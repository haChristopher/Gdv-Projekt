"""Crawls the nextbike API once or repeatedly."""

import urllib.request
import json
import os
import datetime
import pickle
from weather import Weather
from pathlib import Path
from slackclient import SlackClient
nextBikeUrl = 'https://api.nextbike.net/maps/nextbike-live.json?city=14'


currentTime = str(datetime.datetime.utcnow())
slackToken = os.environ.get('SLACK_BOT_TOKEN')


def getWeather():
    """Take the weather from Yahoo weather."""
    weather = Weather()
    lookup = weather.lookup(667931)
    condition = lookup.condition()
    weatherdata = {}
    weatherdata["humidity"] = lookup.atmosphere()["humidity"]
    weatherdata["text"] = condition.text()
    weatherdata["temp"] = (float(condition.temp())-32)/1.8
    weatherdata["wind"] = lookup.wind()

    return weatherdata


def splitData(bikedata):
    """Split the data into bikes and stations."""
    bikes = []
    stations = []
    for i in bikedata:
        if i["bike"] is True:
            bikes.append(i)
        else:
            stations.append(i)
    return bikes, stations


def createGeoJsonBikes(bikes, stationid):
    """Create Geojson for bikes."""
    geoJson = {}
    geoJson["geometry"] = {"type": "Point", "coordinates": [bikes["lat"], bikes["lng"]]}
    geoJson["type"] = "Feature"
    geoJson["properties"] = {"address": bikes["address"],
                             "name": bikes["name"],
                             "maintenance": bikes["maintenance"],
                             "state": bikes["bike_list"][0]["state"],
                             "bike_type": bikes["bike_list"][0]["bike_type"],
                             "boardcomputer": bikes["bike_list"][0]["boardcomputer"],
                             "uid": bikes["uid"],
                             "timestamp": currentTime,
                             "stationid": stationid,
                             "stationiduid": stationid,
                             "number": bikes["bike_list"][0]["number"]}
    return geoJson


def createGeoJsonStations(stations):
    """Create Geojson for stations and extract bikes."""
    places = []
    bikes = []
    for station in stations:
        placegeojson = {}
        placegeojson["geometry"] = {"type": "Point", "coordinates": [station["lat"], station["lng"]]}
        placegeojson["type"] = "Feature"
        placegeojson["properties"] = {"name": station["name"],
                                      "maintenance": station["maintenance"],
                                      "bike_racks": station["bike_racks"],
                                      "bike_types": station["bike_types"],
                                      "bikes": station["bikes"],
                                      "free_racks": station["free_racks"],
                                      "bike_numbers": station["bike_numbers"],
                                      "rack_locks": station["rack_locks"],
                                      "spot": station["spot"],
                                      "terminal_type": station["terminal_type"],
                                      "timestamp": currentTime,
                                      "number": station["number"],
                                      "uid": station["uid"]}

        places.append(placegeojson)

        for bike in station["bike_list"]:
            geoJson = {}
            geoJson["geometry"] = {"type": "Point", "coordinates": [station["lat"], station["lng"]]}
            geoJson["type"] = "Feature"
            geoJson["properties"] = {"address": station["name"],
                                     "name": station["name"],
                                     "maintenance": "",
                                     "state": bike["state"],
                                     "bike_type": bike["bike_type"],
                                     "boardcomputer": bike["boardcomputer"],
                                     "uid": "",
                                     "timestamp": currentTime,
                                     "stationid": station["number"],
                                     "stationiduid": station["uid"],
                                     "number": bike["number"]}

            bikes.append(geoJson)

    return bikes, places


def createFeatureCollection(bikes):
    """Create feature collections."""
    collection = {"type": "FeatureCollection", "features": []}
    for i in bikes:
        collection["features"].append(i)
    return collection


# check if pickle already exists
def pickleCollections(collection, filename):
    """Pickle files create new or append if exist."""
    datapath = "data/" + filename + ".p"
    my_file = Path(datapath)
    if my_file.exists():
        collectionOld = pickle.load(open(datapath, "rb"))

        for dataset in collection["features"]:
            collectionOld["features"].append(dataset)
        collection = collectionOld

    pickle.dump(collection, open(datapath, "wb"))

    return collection


def slack_message(message, channel):
    """Send message to slack when done."""
    sc = SlackClient(slackToken)
    sc.api_call('chat.postMessage', channel=channel,
                text=message, username='The Mighty Scraper',
                icon_emoji=':robot_face:')


def crawl():
    """Crawl data from nextbike."""
    weather = getWeather()
    weather["time"] = currentTime

    # get json from url
    page = urllib.request.urlopen(nextBikeUrl)
    data = page.read()

    dataString = data.decode('utf8').replace("'", '"')
    dataJson = json.loads(dataString)
    # get places
    bikedata = dataJson["countries"][0]["cities"][0]["places"]

    # split data
    bikes, stations = splitData(bikedata)

    # getlist of all bikes not in stations
    bikelist = []
    for i in bikes:
        bikelist.append(createGeoJsonBikes(i, 0))

    # get stations and bikes in staions
    Sbikes, places = createGeoJsonStations(stations)

    # add bikes from Stations to normal bikelist
    for bike in Sbikes:
        bikelist.append(bike)

    # create collections
    bikeCollection = createFeatureCollection(bikelist)
    stationCollection = createFeatureCollection(places)
    weatherCollection = createFeatureCollection([weather])

    # pickle data
    pickleCollections(stationCollection, "stations")
    x = pickleCollections(bikeCollection, "bikes")
    pickleCollections(weatherCollection, "weather")

    # send message to slack
    slack_message("Im done :) Bikes crawled: " + str(len(bikelist))
                  + " Bikestotal: " + str(len(x["features"])), "gdvprojekt")

    print("Done :)")


def main():
    """Main method."""
    crawl()


if __name__ == "__main__":
    main()
