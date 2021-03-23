'use strict';

const express = require('express');
const app = express();
const redis = require('redis');

// Redis
// default ip and port: 127.0.0.1 & 6379
const redisClient = redis.createClient({host: 'redis'}); 

redisClient.on('connect', function() {
    console.log('Redis client connected');
});

redisClient.on('error', function (err) {
    console.log('Error::' + err);
});

function hashCode(s) {
    let h;
    for(let i = 0; i < s.length; i++) 
          h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    return h.toString().substring(1);
}

app.get('/new/:url', function (req, res) {
    const original_url = req.params.url;
    const short_url = hashCode(original_url);
    const isUrl = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/).test(original_url);

    if (isUrl) {
        redisClient.get(short_url, function (error, result) {
            if (result == null) {
                redisClient.set(short_url, original_url, redis.print);
            }
            if (error) {
                res.send({error}); 
            }
            res.send({"original_url": result, short_url});
        });
    } else {
        res.send({'error': 'url is not valid'});
    }
})

app.get('/:url', function (req, res) {
    const short_url = req.params.url;
    redisClient.get(short_url, function (error, result) {
        console.log(error);
        console.log(result);
        if (error != null || result == null) {
            res.send({'error':'hashcode does not exist'})
        } else {
            res.status(301).redirect(result);
        }
    });
})

app.listen(3000);
console.log('App running on http://localhost:3000');