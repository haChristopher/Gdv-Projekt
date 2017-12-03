# Gdv-Project
Visualization project

## Data:
Json: https://api.nextbike.net/maps/nextbike-live.json?city=14

Xml: https://api.nextbike.net/maps/nextbike-live.xml?city=14


## Installation


### Dependencies

Python 3.4.4: https://www.python.org/downloads/release/python-344/


## Run as cronjob

```
*/10 * * * * python/orEnviromentPath crawl.py >/tmp/stdout.log 2>/tmp/stderr.log
```
