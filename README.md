# URL Shortener Microservice

## Objective

Build a full stack app that is functionally similar to this: https://little-url.herokuapp.com/.

## Requirements

* User Story: I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

* User Story: If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.

* User Story: When I visit that shortened URL, it will redirect me to my original link.

## Notes

Requirements:
- NodeJS
- NPM
- Redis
- Docker (optional)

Run using NPM:
```bash
# start redis server
redis-server start

# install dependencies
npm install

# run app at localhost:3000
npm start
```

Run using Docker:
```bash
# build image
docker build -t pbgnz/url-shortener-microservice .

# run image
docker run -p 49160:3000 -d pbgnz/url-shortener-microservice
```

Usage
```bash
# create short url for https://www.google.ca
http://localhost:3000/new/https://www.google.ca

# expected response
{"original_url": "https://www.google.ca", "short_url": "025550381"}

# going to short url redirects to https://www.google.ca
http://localhost:3000/025550381

```
