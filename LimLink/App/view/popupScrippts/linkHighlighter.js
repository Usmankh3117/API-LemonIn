var FileTypeSetting = "";
$(document).ready(function () {

    (function () {

        chrome.storage.local.get(['ApppState', 'UserSetting'], function (result) {
            if (result != undefined && result.ApppState != undefined && result.ApppState == true) {

                let blockedDomains = [], blockedWords = [];
                if (result.UserSetting != undefined) {
                    blockedDomains = result.UserSetting.BlockListDomain;
                    blockedWords = result.UserSetting.BlockListWords;
                    FileTypeSetting = result.UserSetting.FileType;
                }

                chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                    var activeTab = tabs[0];
                    chrome.tabs.sendMessage(
                        activeTab.id,
                        { message: "changeColor", BlockedDomain: blockedDomains, BlockedWords: blockedWords },
                        (responce) => {

                            console.log("responce", responce);
                            if (responce == false)
                                return;
                            var error = chrome.runtime.lastError;
                            if (error) {
                                // chrome.tabs.sendMessage(activeTab.id, { message: "reloadPage" });
                            } else {
                                //   window.location = "linkHighLighter.html";
                                $("#totalHighLightedLinks").text(responce.length);
                                if (responce.allLink != undefined && responce.allLink != null) {
                                    SaveHistoryLinks(responce.allLink);
                                    GenerateCSVData(responce.allLink);
                                }
                            }
                        }
                    );
                });
            }
        });

        // console.log("i am here button");
        // window.location = "linkHighLighter.html";
        // var term = "i am here button";
        //   window.location.replace("linkHighLighter.html" + term);
    }());
});

function SaveHistoryLinks(links) {

    chrome.storage.local.get('LemonInUser', function (result) {
        if (result != undefined && result.LemonInUser != undefined && result.LemonInUser.Id != undefined && result.LemonInUser.Id != null) {

            var userId = result.LemonInUser.Id;

            $.ajax({
                type: "POST",
                url: baseURL + "LimLink/SaveHistoryLink",
                dataType: "json",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "UserId": userId,
                    "Links": links
                }),
                success: function (data) {

                    if (data != null && data != undefined) {
                        if (data.status) {
                            chrome.storage.local.get(['UserLocalCredit'], function (result) {
                                BindCredit(userId, result.UserLocalCredit);
                            });
                            console.log(data);
                        }
                    }
                },
                error: function (data) {
                }
            });

        }
    });
}

function GenerateCSVData(allLinksData) {

    if (allLinksData.length > 0) {

        var csvData = "";
        for (var i = 0; i < allLinksData.length; i++) {
            var link = allLinksData[i];
            csvData += link + "\n";
        }
        if (FileTypeSetting != "" && FileTypeSetting == "CSV")
            $("#btnDownloadHighLighter").attr("download", "Link Highlighter Links.csv");
        else
            $("#btnDownloadHighLighter").attr("download", "Link Highlighter Links.txt");
        $("#btnDownloadHighLighter").attr("href", "data:text/csv;charset=utf8,Link\n" + encodeURIComponent(csvData));
    }
}