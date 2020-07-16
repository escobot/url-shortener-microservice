'use strict';

const express = require('express');
const app = express();
const redis = require('redis');

// default ip and port: 127.0.0.1 & 6379
const client = redis.createClient(); 

client.on('connect', function() {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Error::' + err);
});

function hashCode(s) {
    let h = 0, l = s.length, i = 0;
    if ( l > 0 )
      while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h.toString().substring(1);
}

app.get('/new/:url', function (req, res) {
    const original_url = req.params.url;
    const short_url = hashCode(original_url);
    const isUrl = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/).test(original_url);

    if (isUrl) {
        client.get(short_url, function (error, result) {
            if (result == null) {
                client.set(short_url, original_url, redis.print);
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
    client.get(short_url, function (error, result) {
        if (error || result == null) {
            res.send({error})
        } else {
            res.redirect(result);
        }
    });
})

app.listen(3000);
console.log('App running on http://localhost:3000');