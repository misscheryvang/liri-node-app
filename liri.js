require("dotenv").config();

var keys = require("./keys.js")

var options = process.argv[2]

function liriDoThis() {
    if (options.toLowerCase() === "my-tweets") {
        tweetsRequest();
    } else if (options.toLowerCase() === "spotify-this-song") {
        songRequest();
    } else if (options.toLowerCase() === "movie-this") {
        movieRequest();
    } else {
        doSayRequest();
    };
};

// Function to pull the last 20 tweets
function tweetsRequest() {
    var Twitter = require("twitter");

    var client = new Twitter(keys.twitter);

    var params = { screen_name: 'vang_chery', count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            console.log(tweets[0].text);
        }
    });
};

// Function to pull song information
function songRequest() {
    var Spotify = require('node-spotify-api');

    var spotify = new Spotify(keys.spotify);

    var song = process.argv[3];

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log("Artist(s): " + data.name);
    });
};

// Function to pull movie information
function movieRequest() {

    var request = require('request');

    // Grabs movie name and store it in a variable
    var movieName = process.argv[3];

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // This logs the movie information
    request(queryUrl, function (error, response, data) {
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(data).Title + "\nRelease Year: " + JSON.parse(data).Year +
                "\nRating: " + JSON.parse(data).Rated + "\nRotten Tomatoes Rating: " + JSON.parse(data).Ratings[1].Value
                + "\nCountry movie produced: " + JSON.parse(data).Country + "\nLanguage: " + JSON.parse(data).Language
                + "\nPlot: " + JSON.parse(data).Plot + "\nActors: " + JSON.parse(data).Actors);
        }
    });
};

// Function to make Liri do things
function doSayRequest() {
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        // Break the string down by comma separation and store the contents into the output array.
        var output = data.split(",");

        if (output[0].toLowerCase() === "movie-this") {
            options = output[0];
            movieName = output[1];

        } else if (output[0].toLowerCase() === "spotify-this-song") {
            options = output[0];
            song = output[1];
        } else {
            options = output[0];
        }

        //call Liri function to run commands
        liriDoThis()
    });
};

// Calling the function to run commands
liriDoThis();
