$(document).ready(function() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(
            activeTab.id,
            { message: "getAllLinks" },
            (response) => {
                console.log({response});
                // $(".").text(response?.totalLinks);
                $(".v1_164").text(response.internalLinks);
                $(".v1_165").text(response.externalLinks);
                $(".v1_166").text(response.dofollowLinks);
                $(".v1_167").text(response.nofollowLinks);
                $(".v1_168").text(response.sponsoredLinks);
                $(".v1_169").text(response.ugcLinks);
            }
        );
    });
});