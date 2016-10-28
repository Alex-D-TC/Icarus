const MAXRESULTS = 30;

/**
 * Executes the youtube search, and feeds the resulting URL to the callback function
 * songData - The song name
 * siteName - The name of the site, in case the songData varies on a site by site basis
 * callback - The callback to execute after fetching the data
 */
function execute(songData, siteName, callback) {

   switch (siteName) {
        
        case 'youtube':
            callback("https://www.youtube.com/watch?v="+songData);
            return;

        default:
            ytSearch(songData, callback);
            return;
    }

}

/**
 *  Searches the Yt database for the given song, executes a callback function
 * that uses the returned data
 * songData - The song name
 * callback - The callback to execute after fetching the data
 */
function ytSearch(songData, callback) {

    var request = gapi.client.youtube.search.list({
        part: "snippet",
        type: "video",
        q: songData,
        maxResults: MAXRESULTS,
        order: "relevance"
    });

    // response.items[0].id.videoId
    request.execute(function(response) {
        //console.log(response);
        callback("https://www.youtube.com/watch?v=" + getExactResult(songData, response).id.videoId);
    });
}

/**
 * Youtube api init function
 */
function init() {
    gapi.client.setApiKey("AIzaSyBxOiook6yH3nVNgP0G9Z2UeflWS9qj09Q");
    gapi.client.load("youtube", "v3", function() {
        // when yt api is ready
        //console.log("Youtube api ready");
    });
}

/**
 * Gets the most similar result from the response items
 * songName - The song name
 * response - The response from the youtube googleApi call
 */
function getExactResult(songName, response) {

    for(var i = 0; i < MAXRESULTS; ++i) {
        if(response.items[i].snippet.title === songName)
            return response.items[i];
    }

    return response.items[0];

}
