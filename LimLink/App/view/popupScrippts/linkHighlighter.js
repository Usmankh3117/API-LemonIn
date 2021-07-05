$(document).ready(function() {

    (function() {
        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(
              activeTab.id,
              { message: "changeColor" },
              (responce) => {
                  
                console.log("responce", responce);
                var error = chrome.runtime.lastError;
                if (error) {
                  // chrome.tabs.sendMessage(activeTab.id, { message: "reloadPage" });
                } else {
                //   window.location = "linkHighLighter.html";
                    $("#totalHighLightedLinks").text(responce.length);
                }
              }
            );
        });
        
        // console.log("i am here button");
        // window.location = "linkHighLighter.html";
        // var term = "i am here button";
        //   window.location.replace("linkHighLighter.html" + term);
    }());
})