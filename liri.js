require("dotenv").config();

var keys = require("./keys.js")

// Save user's command chocie in variable
var options = process.argv[2]

// Function to determine Liri's command
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
            for (var i = 0; i < tweets.length; i++) {
                var text = tweets[i].text;
                console.log("Tweets: " + text);
            }
        }
    });
};

// Function to pull song information
function songRequest() {
    var Spotify = require('node-spotify-api');

    var spotify = new Spotify(keys.spotify);

    var song = process.argv[3];

    if (!song) {
        song = "The Sign";
    };

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artist: " + data.tracks.items[0].artists[0].name + "\nSong name: "
            + data.tracks.items[0].name + "\nPreview Link: " + data.tracks.items[0].preview_url)
            + "\nAlbum Name: " + data.tracks.items[0].album.name;
    });
};

// Function to pull movie information
function movieRequest() {

    var request = require('request');

    var movieName = process.argv[3];

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

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
