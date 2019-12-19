# liri-node-app

Technologies Used:
Node

Description

LIRI is a _Language_ Interpretation and Recognition Interface. LIRI will be a command line node app that takes in parameters and gives back data

1. LIRI will search Spotify for songs, Bands in Town for concerts, and OMDB for movies.

2. This app prompts user to enter what they want to search i.e band, song, movie or ask Liri.

3. Search for band:
     * This will search the Bands in Town Artist Events API for an artist or band and renders the following information about each event to the terminal:
    ```
     * Name of the venue
     * Venue location
     * Date of the Event (use moment to format this as "MM/DD/YYYY")
    ```
    * If no band is entered, it validates for the band name.

    * Gif link: https://media.giphy.com/media/S9FisGZ63u0olAwZ1v/giphy.gif

4.  Search for song:
    * This will show the following information about the song in your terminal/bash window
    ```
     * Artist(s)
     * The song's name
     * A preview link of the song from Spotify
     * The album that the song is from

    ```
   * If no song is provided then your program will default to "The Sign" by Ace of Base.

   * Gif link: https://media.giphy.com/media/SVOVg72ABUrOr8yTxD/giphy.gif

 5. Search for movie
    * This will output the following information to your terminal/bash window:

     ```
       * Title of the movie.
       * Year the movie came out.
       * IMDB Rating of the movie.
       * Rotten Tomatoes Rating of the movie.
       * Country where the movie was produced.
       * Language of the movie.
       * Plot of the movie.
       * Actors in the movie.
     ```

   * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.' 

   * Gif link: https://media.giphy.com/media/UqMCVO2RIcMvjtvlOW/giphy.gif 

 6. Ask Liri
    * It will search song "I Want it That Way," as follows the text in `random.txt`.

    * The below screenshot gif also includes searching for movie or band as edited in the random.txt file

    * Gif link: https://media.giphy.com/media/hScahtcArcmOZHV4iI/giphy.gif

7. In addition to logging the data to the terminal/bash window, the app outputs the data to a `log.txt` file. For each command, it appends the output to this file.


