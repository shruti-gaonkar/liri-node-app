require("dotenv").config();

var Spotify = require("node-spotify-api");
var keys = require("./js/keys");
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');

var spotify = new Spotify(keys.spotify);

inquirer.prompt([

    {
        type: "list",
        name: "category",
        message: "What would you like to search?",
        choices: ["Band/Artist", "Song", "Movie", "Ask Liri"]
    }
]).then(function (respCat) {
    var searchCat = respCat.category;
    inquirer.prompt([
        {
            type: "input",
            name: "term",
            message: `Enter a ${searchCat} name to get all concert details`,
            validate: async (input) => {
                if (!input) {
                    return `${searchCat} name cannot be blank`;
                }
                //console.log(searchCat);
                var search = new Search(input);
                if (searchCat == "Band/Artist") {
                    search.getBand();
                } else if (searchCat == "Movie") {
                    search.getMovie();
                }
            }
        }
    ])
    /*.then(function (response) {
        var searchTerm = response.term;
        if (searchCat == "Band") {
            var search = new Search(searchTerm);
            search.getBand();
        }
    });*/
});

function Search(keyword) {
    this.keyword = keyword;
    this.getBand = function () {
        var url = "https://rest.bandsintown.com/artists/" + this.keyword + "/events?app_id=codingbootcamp";
        axios.get(url).then(
            function (response) {
                var bandArr = response.data;
                for (var i = 0; i < bandArr.length; i++) {
                    var eventDate = moment(bandArr[i].datetime).format('MM/DD/YYYY');
                    console.log(`Name of the venue: ${bandArr[i].venue.name}
Venue location: ${bandArr[i].venue.city}, ${bandArr[i].venue.country}
Date of the event: ${eventDate}
 ---------------------------------------`);
                }
            })
            .catch(function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    //console.log("---------------Data---------------");
                    if (error.response.data.errorMessage.includes('[NotFound]')) {
                        console.log("\nThe artist was not found");
                    } else {
                        console.log(error.response.data);
                    }
                    //console.log(error.response.data);
                    //console.log("---------------Status---------------");
                    //console.log(error.response.status);
                    //console.log("---------------Status---------------");
                    //console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                //console.log(error.config);
            });

    },
        this.getMovie = function () {

        }
}