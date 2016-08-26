# vitrivr UI

This repository contains the user interface of the vitrivr stack adapted to citystories.

## Setup

In order for this UI to work, Cineast, ADAM and the supplementary PostgreSQL database need to be running:

1. `cd cineast && java -jar build/libs/cineast.jar`
2. `sudo docker run -d -p 5432:5432 adam`
3. `cd cineast/docker && sudo docker build -t cs-spatial . && sudo docker run -d -p 5433:5432 cs-spatial`
4. `php -S localhost:8080`

