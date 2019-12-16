require("dotenv").config();

var Spotify = require("node-spotify-api");
var keys = require("./js/keys");
var inquirer = require("inquirer");
var axios = require("axios");

var spotify = new Spotify(keys.spotify);

inquirer.prompt([

    {
        type: "list",
        name: "category",
        message: "What would you like to search?",
        choices: ["Band", "Song", "Movie", "Ask Liri"]
    }
]).then(function (respCat) {
    var searchCat = respCat.category;
    inquirer.prompt([
        {
            type: "input",
            name: "term",
            message: `Enter a ${searchCat} name`
        }
    ]).then(function (response) {
        var searchTerm = response.term;
        if (searchCat == "Band") {
            var search = new Search(searchTerm);
            search.getBand();
        }
    });
});

function Search(keyword) {
    this.keyword = keyword;
    this.getBand = function () {
        var url = "https://rest.bandsintown.com/artists/" + this.keyword + "/events?app_id=codingbootcamp";
        //console.log(url);
        axios.get(url).then(
            function (response) {
                var bandArr = response.data;
                for (var i = 0; i < bandArr.length; i++) {
                    console.log(`Name of the venue: ${bandArr[i].venue.name}
Venue location: ${bandArr[i].venue.city}, ${bandArr[i].venue.country}
Date of the event: ${bandArr[i].datetime}
---------------------------------------`)
                }

            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
            });

    }
}