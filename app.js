#!/usr/bin/env node
var express = require('express');
var path = require('path');
// var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

// var tasks = require('./routes/tasks');

var app = express();

MongoClient.connect('mongodb://localhost/calendar', function(err, db) {
    if (err) {
        console.error('Cannot connect to the database', err);
        return;
    }

    setup_express();
});


function setup_express() {
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('view engine', 'jade');
    app.get('/', function(req, res) {
        res.render('index', {pageTitle: "TITLE"});
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.set('port', process.env.PORT || 8080);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
