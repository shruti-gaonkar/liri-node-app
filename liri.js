require("dotenv").config();

var Spotify = require("node-spotify-api");
var keys = require("./js/keys");
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");

inquirer.prompt([

    {
        type: "list",
        name: "category",
        message: "What would you like to search?",
        choices: ["Band/Artist", "Song", "Movie", "Ask Liri"]
    }
]).then(function (respCat) {
    var searchCat = respCat.category;
    if (searchCat == "Ask Liri") {
        var search = new Search();
        search.askLiri();
        return;
    }
    inquirer.prompt([
        {
            type: "input",
            name: "term",
            message: `Enter a ${searchCat} name to get all concert details`,
            validate: async (input) => {
                if (!input && `${searchCat}` == "Band") {
                    return `${searchCat} name cannot be blank`;
                }
                //console.log(searchCat);
                var search = new Search(input);
                if (searchCat == "Band/Artist") {
                    search.getBand();
                } else if (searchCat == "Song") {
                    search.getSong();
                } else if (searchCat == "Movie") {
                    search.getMovie();
                }
            }
        }
    ])
    //search = null;
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
        axios.get(url).then(function (response) {
            var bandArr = response.data;
            let output, output1;
            output1 = "\n***************************************\n";
            output1 += "Band: " + keyword + "\n";
            output1 += "---------------------------------------\n";
            for (var i = 0; i < bandArr.length; i++) {
                var eventDate = moment(bandArr[i].datetime).format('MM/DD/YYYY');
                output = `
Name of the venue: ${bandArr[i].venue.name}
Venue location: ${bandArr[i].venue.city}, ${bandArr[i].venue.country}
Date of the event: ${eventDate}
---------------------------------------`;
                output1 += output;
                console.log(output);
            }
            writeFile(output1);
        }).catch(function (error) {
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
    };
    this.getMovie = function () {
        this.keyword = (this.keyword) ? this.keyword : "Mr. Nobody";
        var url = "https://www.omdbapi.com/?t=" + this.keyword + "&y=&plot=short&apikey=trilogy";
        axios.get(url).then(
            function (response) {
                var movieResp = response.data;
                //console.log(movieArr);

                console.log(`
-----------------------------------------------------------------------------------------------                    
Title of the movie: ${movieResp.Title}
Year the movie came out: ${movieResp.Year}
IMDB Rating of the movie: ${movieResp.imdbRating}
Rotten Tomatoes Rating of the movie: ${movieResp.Ratings[1].Value}
Country where the movie was produced: ${movieResp.Country}
Language of the movie: ${movieResp.Language}
Plot of the movie: ${movieResp.Plot}
Actors in the movie: ${movieResp.Actors}
-----------------------------------------------------------------------------------------------`);

            }).catch(function (error) {
                // Something happened in setting up the request that triggered an Error
                console.log("\nThere was an error processing the request");
            });
    };

    this.getSong = function () {
        var spotify = new Spotify(keys.spotify);
        this.keyword = (this.keyword) ? this.keyword : "The Sign,Ace of Base";
        spotify.search({ type: 'track,artist', query: this.keyword, limit: 10 }).then(function (response) {
            //console.log(response.tracks.items);
            let tracksResp = response.tracks.items;
            //console.log(tracksResp[0].artists);
            for (var i = 0; i < tracksResp.length; i++) {
                let artistsResp = tracksResp[i].artists;
                console.log("\nArtists:");
                for (var j = 0; j < artistsResp.length; j++) {
                    console.log(`${artistsResp[j].name}`);
                }
                console.log(`\nSong: ${tracksResp[i].name}
Preview link: ${(tracksResp[i].preview_url) ? tracksResp[i].preview_url : '-'}
Album: ${tracksResp[i].album.name}
------------------------------------------------------------------------`);

            }
        }).catch(function (err) {
            console.log(err);
        });
    };
    this.askLiri = function () {
        let dataArr = readFile("random.txt");
        //console.log(dataArr);
        this.keyword = dataArr[1];
        var searchCat = dataArr[0];
        //console.log(dataArr[0]);
        if (searchCat == "Band/Artist") {
            this.getBand();
        } else if (searchCat == "Song") {
            this.getSong();
        } else if (searchCat == "Movie") {
            this.getMovie();
        }
    }

};

function readFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');

        // Then split it by commas (to make it more readable)
        let dataArr = data.split(",");

        return dataArr;
    } catch (err) {
        console.error(err);
    }
}

function writeFile(text) {
    fs.appendFile("log.txt", text, function (err) {

        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }

        // Otherwise, it will print: "movies.txt was updated!"
        //console.log("movies.txt was updated!");

    });
}