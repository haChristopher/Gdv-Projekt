"""Load the pickle data and convert it to GeoJson."""
import pickle
import json


def convert():
    """Load the pickle data and convert it to GeoJson."""
    # load pickle data
    bikeCollection = pickle.load(open("data/bikes.p", "rb"))
    stationCollection = pickle.load(open("data/stations.p", "rb"))
    weatherCollection = pickle.load(open("data/weather.p", "rb"))

    with open('data/bikes.geojson', 'w', encoding='utf8') as outfile:
        json.dump(bikeCollection, outfile, sort_keys=True, indent=4, ensure_ascii=False)

    with open('data/stations.geojson', 'w', encoding='utf8') as outfile:
        json.dump(stationCollection, outfile, sort_keys=True, indent=4, ensure_ascii=False)

    with open('data/weather.geojson', 'w', encoding='utf8') as outfile:
        json.dump(weatherCollection, outfile, sort_keys=True, indent=4, ensure_ascii=False)


def main():
    """Main method."""
    convert()


if __name__ == "__main__":
    main()
