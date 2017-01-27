# CityStories UI

This repository contains the user interface of the vitrivr stack adapted to CityStories.

## Dependencies

* [Docker](https://www.docker.com/)
* [PHP](https://php.net/)
* [Cineast for CityStories](https://github.com/lukasbeck/cineast)
* [ADAM for CityStories](https://github.com/lukasbeck/adam)

## Setup

### Building dependencies

1. Cineast for CityStories:
   ```
   git clone https://github.com/lukasbeck/cineast.git cs_cineast
   cd cs_cineast
   gradle jar
   ```

2. ADAM for CityStories:
   ```
   git clone https://github.com/lukasbeck/adam.git cs_ADAM
   cd cs_ADAM/docker/adamempty
   sudo docker build -t adamempty .
   ```

3. Supplementary PostGIS database:
   ```
   cd cs_cineast/docker
   sudo docker build -t cs-spatial .
   ```

### Running

1. `cd cs_cineast && java -jar build/libs/cineast.jar`
2. `sudo docker run -d -p 5432:5432 adamempty`
3. `sudo docker run -d -p 5433:5432 cs-spatial`
4. `php -S localhost:8080`


## Add collection

To add an image collection to the backend, run `core.run.ImageFeatureExtractionRunner` with the path to the collection. For example using `gradle`:

    cd cs_cineast
    gradle -PmainClass=ch.unibas.cs.dbis.cineast.core.run.ImageFeatureExtractionRunner -PappArgs="['../cs_vitrivr-ui/collection']" execute
