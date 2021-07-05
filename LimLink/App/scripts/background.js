chrome.runtime.onInstalled.addListener(function() {
    localStorage.removeItem("active");
    chrome.browserAction.setPopup({ popup: "../view/poppupPages/started.html" });
});


chrome.browserAction.onClicked.addListener(function(tabs) {
    if (isUserLogged()) {
        chrome.browserAction.setPopup({ popup: "../view/poppupPages/dashboard.html" });
    } else chrome.browserAction.setPopup({ popup: "../view/poppupPages/started.html" });
});



function isUserLogged() {
    if (localStorage.getItem("active")) return true;
    else return false;
}