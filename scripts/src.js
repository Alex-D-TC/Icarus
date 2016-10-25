var siteName;

/**
 * Gets song name + artist based on page
 */
function getSongData(site) {
    return getCallbackBasedOnSite(site)();
}

/**
 *  Formats the text to be used for youtube search.
 *  Combines each ' ' group into one ' ', then removes any ' ' 
 * before and after the string
 */
function format(text) {
    return text
        .replace(/ +/g, " ")
        .trim();
}

/**
 * Checks if a given string is a URL
 */
function isURL(text) {
    return text.match("(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})");
}

/**
 * Gets an anonymous function descibing how to extract song data on a site by site basis
 */
function getCallbackBasedOnSite(site) {
    switch(site) {
        case "pandora":
        case "localhost":
            return function() {
                //var jqsongName = $(".songTitle").html();
                //var jqsongArtist = $(".artistSummary").html();

                var songName = document.getElementsByClassName("songTitle")[0].innerHTML;
                var songArtist = document.getElementsByClassName("artistSummary")[0].innerHTML;

                return songName + " " + songArtist;
            }
        case "youtube":
            return function() {
                //var jQsongTitle = $("#eow-title").html();
                var songTitle = document.getElementById("eow-title").innerHTML;
                
                return songTitle;
            }
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //console.log(request);
        //console.log(request.site);

        if(request.function === "GO") {
            //console.log("Dooin it!");
            sendResponse({result: format(getSongData(siteName))});
        }

        if(request.site != null) {
            siteName = request.site;
            //console.log(siteName);
        }
    }
);
