# URL Shortener Microservice

## Objective

Build a full stack app that is functionally similar to this: https://little-url.herokuapp.com/.

## Requirements

* User Story: I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

* User Story: If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

* User Story: When I visit that shortened URL, it will redirect me to my original link.

* Use Cases:  
![Use Cases Img](https://user-images.githubusercontent.com/20388583/111838785-334a1400-88d0-11eb-9712-f200a14d0945.png)

## Notes

Requirements:
- NodeJS
- NPM
- MongoDB
- Redis
- Docker & Docker-compose (optional)

Run using NPM:
```bash
# start mongodb
systemctl start mongod

# start redis server
redis-server start

# install dependencies
npm install

# run app at localhost:3000
npm start
```

Run using docker-compose:
```bash
# build and start the containers
docker-compose up --build

# stop the containers
docker-compose down
```

Usage
```bash
# create short url for https://www.google.ca
http://localhost:3000/new/www.google.ca

# expected response
{"longUrl": "https://www.google.ca", "shortUrl": "025550381"}

# going to short url redirects to https://www.google.ca
http://localhost:3000/get/025550381

```

Architecture

![image](https://user-images.githubusercontent.com/20388583/111843043-d9008180-88d6-11eb-9df4-5c860415b269.png)

