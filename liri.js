require("dotenv").config();

// include all the npm packages 
var Spotify = require("node-spotify-api");
var keys = require("./js/keys");
var inquirer = require("inquirer");
var axios = require("axios");
var moment = require('moment');
var fs = require("fs");

// prompt to select from the list of options
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
    var message = (searchCat == "Band/Artist") ? `Enter a ${searchCat} name to get all concert details` : `Enter a ${searchCat} name to get the details`;
    if (searchCat == "Song") {
        message = "Enter in this format: song name or song name,artist";
    }
    inquirer.prompt([
        {
            type: "input",
            name: "term",
            message: message,
            validate: async (input) => {
                if (!input && `${searchCat}` == "Band/Artist") {
                    return `${searchCat} name cannot be blank`;
                }
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
});


/**
 * constructor to search the data
 * @param {string} keyword 
 */
function Search(keyword) {
    this.keyword = keyword;
};

// creates the getBand method and applies it to all search objects
Search.prototype.getBand = function () {
    let keyword = this.keyword;
    var url = "https://rest.bandsintown.com/artists/" + keyword + "/events?app_id=codingbootcamp";
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
            if (error.response.data.errorMessage.includes('[NotFound]')) {
                console.log("\nThe artist was not found");
            } else {
                console.log(error.response.data);
            }
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an object that comes back with details pertaining to the error that occurred.
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
    });
};

// creates the getSong method and applies it to all search objects
Search.prototype.getSong = function () {
    var spotify = new Spotify(keys.spotify);
    let keyword = (this.keyword) ? this.keyword : "The Sign,Ace of Base";
    spotify.search({ type: 'track,artist', query: keyword, limit: 10 }).then(function (response) {
        let output, output1;
        output1 = "\n***************************************\n";
        output1 += "Song: " + keyword + "\n";
        output1 += "---------------------------------------\n";

        let tracksResp = response.tracks.items;
        for (var i = 0; i < tracksResp.length; i++) {
            let artistsResp = tracksResp[i].artists;
            output = "\nArtists:";
            for (var j = 0; j < artistsResp.length; j++) {
                output += `\n${artistsResp[j].name}`;
            }
            output += `\nSong: ${tracksResp[i].name}
Preview link: ${(tracksResp[i].preview_url) ? tracksResp[i].preview_url : '-'}
Album: ${tracksResp[i].album.name}
------------------------------------------------------------------------`;
            output1 += output;
            console.log(output);
        }
        writeFile(output1);
    }).catch(function (err) {
        console.log(err);
    });
};

// creates the getMovie method and applies it to all search objects
Search.prototype.getMovie = function () {
    let keyword = (this.keyword) ? this.keyword : "Mr. Nobody";
    var url = "https://www.omdbapi.com/?t=" + keyword + "&y=&plot=short&apikey=trilogy";
    axios.get(url).then(
        function (response) {
            let movieResp = response.data;
            let output, output1;
            output1 = "\n***************************************\n";
            output1 += "Movie: " + keyword + "\n";
            output1 += "---------------------------------------\n";
            output = `
-----------------------------------------------------------------------------------------------                    
Title of the movie: ${movieResp.Title}
Year the movie came out: ${movieResp.Year}
IMDB Rating of the movie: ${movieResp.imdbRating}
Rotten Tomatoes Rating of the movie: ${movieResp.Ratings[1].Value}
Country where the movie was produced: ${movieResp.Country}
Language of the movie: ${movieResp.Language}
Plot of the movie: ${movieResp.Plot}
Actors in the movie: ${movieResp.Actors}
-----------------------------------------------------------------------------------------------`;
            output1 += output;
            console.log(output);
            writeFile(output1);
        }).catch(function (error) {
            // Something happened in setting up the request that triggered an Error
            console.log("\nThere was an error processing the request");
        });
};

// creates the askLiri method and applies it to all search objects
Search.prototype.askLiri = function () {
    let dataArr = readFile("random.txt");
    let searchCat = dataArr[0];
    this.keyword = dataArr[1];
    if (searchCat == "Band/Artist") {
        this.getBand();
    } else if (searchCat == "Song") {
        this.getSong();
    } else if (searchCat == "Movie") {
        this.getMovie();
    }
}


// function to read file
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

// function to write to a file and append data everytime it is called
function writeFile(text) {
    fs.appendFile("log.txt", text, function (err) {

        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }
    });
}