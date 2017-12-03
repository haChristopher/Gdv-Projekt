"""Crawls the nextbike API once or repeatedly."""

import urllib.request
import time
import json
nextBikeUrl = 'https://api.nextbike.net/maps/nextbike-live.json?city=14'


def crawl():
    """Crawl once."""
    page = urllib.request.urlopen(nextBikeUrl)
    data = page.read()
    process(data)


def crawlLoop(timewindow):
    """Crawl repeatedly."""
    while(True):
        currentTime = time.strftime("%Y,%m,%d,%H,%M,%S")
        _, month, day, hour, minute, second = currentTime.split(',')
        if int(minute) % 10 == 0 and int(second) == 0:
            crawl()
            # time.sleep(1)


def process(data):
    """Process the crawled information."""
    dataString = data.decode('utf8').replace("'", '"')
    dataJson = json.loads(dataString)

    # get time for filename
    currentTime = time.strftime("%Y,%m,%d,%H,%M,%S")
    _, month, day, hour, minute, second = currentTime.split(',')
    crawlTime = day + "." + month + "-" + hour + ":" + minute + ":" + second

    # save as json, because of the cronjob you need to specify the whole path
    with open('/Users/christopher/Uni/GDV/Projekt/Gdv-Projekt/data/'
              + crawlTime + '.json', 'w') as outfile:
        json.dump(dataJson, outfile)


def main():
    """Main method."""
    crawl()


if __name__ == "__main__":
    main()
