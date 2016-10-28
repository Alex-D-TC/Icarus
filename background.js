chrome.tabs.onUpdated.addListener(function(id, info, tab) {
    chrome.tabs.query({"active": true, "lastFocusedWindow": true}, 
        function(tabs) {
            var site = validatePage(tabs[0].url)
            //console.log(tabs[0].url + " " + site);
            if(!site.match("invalid")) {

                // Send siteName;
                //console.log(site)
                
                var siteName = site;
                chrome.tabs.sendMessage(tabs[0].id, {site: siteName})
                chrome.pageAction.show(tab.id);
                //console.log("loaded in " + tabs[0].url);
            }
        });
});

chrome.pageAction.onClicked.addListener(function(tab) {
    if(validatePage(tab.url)) {
        //console.log("clicked in " + tab.url);
        
        //console.log("Sending site " + siteName);
        chrome.tabs.query({active: true, currentWindow: true}, 
        function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {function: "GO"}, 
            function(response) {
               //console.log(response.result);
               execute(response.result, response.site, function(msg) {
                    download(msg);
                });
            })
        });

    }
});

/**
 * Checks if we are on a page where the extension is usable
 */
function validatePage(url) {

    var regexSiteMap = getRegexSiteMap();
    var site = "invalid";

    regexSiteMap.forEach(function(siteObj) {
        if(url.match(siteObj.urlRegex)) {
            site = siteObj.siteURL;
        }
    });

    return site;
}

/**
 * Returns an array of objects representing the site regex strings where the extension is usable
 */
function getRegexSiteMap() {
    var urlRegexString = "^(?:https?\:\/\/)?(?:www\.)?";

    return [
        {siteURL: "debug", urlRegex: "localhost"},
        {siteURL: "youtube", urlRegex: urlRegexString + "youtube\.com\/watch.*"},
        {siteURL: "pandora", urlRegex: urlRegexString + "pandora\.com.*"} 
    ]
}

/**
 * Downloads the mp3 using the http://www.youtubeinmp3.com api
 */
function download(url) {
    var fullsrc = "https://www.youtubeinmp3.com/widget/button/?video=" + url;
    
    var xmlHTTPreq = new XMLHttpRequest();

    xmlHTTPreq.onreadystatechange = function() {
        if(xmlHTTPreq.readyState == XMLHttpRequest.DONE && xmlHTTPreq.status == 200) {
            var parsedResult = xmlHTTPreq.responseText
                .match(/<a .* href="(.*progressType=button)/)[1]
            //console.log(parsedResult);
            chrome.downloads.download({
                url: "https://www.youtubeinmp3.com" + parsedResult
            });
        }
    }

    xmlHTTPreq.open("GET", fullsrc, true);
    xmlHTTPreq.send();

    // If you want to use jQuery
    /*
    $.ajax({
        url: fullsrc,
        success: function(result) {
            var parsedResult = result
                .match(/<a .* href="(.*progressType=button)/)[1]
            console.log(parsedResult);
            chrome.downloads.download({
                url: "https://www.youtubeinmp3.com" + parsedResult
            });
        }
    });
    */
}

// Load icarusSrc
function loadIcarusSrc() {
    var script = document.createElement("script");
    script.src = "scripts/icarusSrc.js";
    //console.log("Loading icarusSrc");
    script.addEventListener("load", loadGoogleApi, false);
    document.head.appendChild(script);
}

// Load google api
function loadGoogleApi() {

    //console.log("Loading google api");

    var script = document.createElement('script');
    script.src = "https://apis.google.com/js/client.js?onload=init";

    document.head.appendChild(script);
}

// Load jQuery. Add the jquery script into the assets folder
function loadjQuery() {
    //console.log("Loading jQuery");

    var script = document.createElement('script');
    script.src = "assets/jquery-3.1.0.min.js";
    script.addEventListener("load", function() {
        //console.log("jQuery loaded");
    }, false);

    document.head.appendChild(script);
}

//loadjQuery();
loadIcarusSrc();
