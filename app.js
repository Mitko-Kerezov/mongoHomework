#!/usr/bin/env node
var express = require('express'),
    path = require('path'),
    utility = require('./utility'),
    MongoClient = require('mongodb').MongoClient;

var app = express();

MongoClient.connect('mongodb://localhost/races', function(err, db) {
    if (err) {
        console.error('Cannot connect to the database', err);
        return;
    }

    var marathons = db.collection('marathons');

    marathons.find({}).count(function (err, count) {
        if (err) {
            console.err(err);
        }

        if (!count) {
            utility.seedData(marathons);
        } else {
            console.log('Skipping data seed, because db already has ' + count + ' records.');
        }
        
        setupExpress(marathons);
    })
});



function setupExpress(marathons) {
    app.use(express.static(path.join(__dirname, 'public')));
    app.set('view engine', 'jade');
    app.get('/', function(req, res) {
        marathons.find({})
            .toArray(function(err, records) {
                res.render('index', { marathons: records });
            })
    });

    app.get('/burgasTopThree', function(req, res) {
        marathons.find({location: "Burgas"})
            .sort({participants:-1})
            .limit(3)
            .toArray(function(err, records) {
                res.render('index', { marathons: records });
            })
    });

    app.get('/addMarathons', function(req, res) {
        marathons.updateMany(
            {distances: {$in: [42]}}, 
            {$set: {summary: "42km Marathon"}}, 
            function(err, result) {
                if (err) {
                    console.error(err);
                }

                res.redirect("/");
            });
    });

    app.get('/removePetarAndMaria', function(req, res) {
        marathons.deleteMany({
                winners: {
                    $elemMatch: {
                        distance: 2,
                        name: {$in: ["Pater Petrov", "Maria Ivanova"]}
                    }
                }
            }, 
            function(err) {
                if (err) {
                    console.error(err);
                }

                res.redirect("/");
            });
    });

     app.get('/updateSponsors', function(req, res) {
       marathons.updateMany(
            {sponsors: {$ne:undefined}}, 
            {$push:{distances:5}},
            function(err, result) {
                if (err) {
                    console.error(err);
                }

                res.redirect("/");
            });
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // development error handler
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
