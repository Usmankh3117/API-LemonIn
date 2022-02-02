var FileTypeSetting = "";
let blockedDomains = [], blockedWords = [];
$(document).ready(function () {

    chrome.storage.local.get(['ApppState', 'UserSetting', 'LemonInUser'], function (result) {
        if (result != undefined && result.ApppState != undefined && result.ApppState == true) {

            let noFollowLink = true;
            if (result.UserSetting != undefined) {
                blockedDomains = result.UserSetting.BlockListDomain;
                blockedWords = result.UserSetting.BlockListWords;
                noFollowLink = result.UserSetting.NoFollowLink;
                FileTypeSetting = result.UserSetting.FileType;
            }
            var limUserId = result.LemonInUser.Id;

            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(
                    activeTab.id,
                    { message: "getAllLinks", BlockedDomain: blockedDomains, BlockedWords: blockedWords },
                    (response) => {
                        console.log({ response });
                        if (response == false)
                            return;
                        // $(".").text(response?.totalLinks);

                        GetLastDaysLinks(limUserId, response.allLinks);
                        //DeductAccountCredit(limUserId, response.totalLinks);
                        GenerateCSVData(response);
                        $(".v1_164").text(response.internalLinks);
                        $(".v1_165").text(response.externalLinks);
                        $(".v1_166").text(response.dofollowLinks);
                        if (noFollowLink)
                            $(".v1_167").text('-');
                        else
                            $(".v1_167").text(response.nofollowLinks);
                        $(".v1_168").text(response.sponsoredLinks);
                        $(".v1_169").text(response.ugcLinks);
                    }
                );
            });
        }
    });

    $(".v1_127,.v1_158,.v1_151").click(function () {
        HightLightByType("Internal");
    });

    $(".v1_128,.v1_159,.v1_152").click(function () {
        HightLightByType("External");
    });

    $(".v1_129,.v1_160,.v1_153").click(function () {
        HightLightByType("DoFollow");
    });

    $(".v1_130,.v1_161,.v1_154").click(function () {
        HightLightByType("NoFollow");
    });

    $(".v1_131,.v1_162,.v1_155").click(function () {
        HightLightByType("Sponsored");
    });

    $(".v1_132,.v1_163,.v1_156").click(function () {
        HightLightByType("UGC");
    });

});

function HightLightByType(Type) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(
            activeTab.id,
            { message: "HightLightByType", BlockedDomain: blockedDomains, BlockedWords: blockedWords, type: Type },
            (response) => {
                console.log({ response });
            }
        );
    });
}

function GetLastDaysLinks(UserId, currentLinks) {

    $.ajax({
        type: "POST",
        url: baseURL + "LimLink/LastDayLinks",
        dataType: "json",
        crossDomain: true,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            "UserId": UserId
        }),
        success: function (data) {

            if (data != null && data != undefined) {
                if (data.status) {
                    var lastDayLinks = data.data;
                    if (lastDayLinks != undefined && lastDayLinks.length > 0) {
                        let credit = 0;
                        for (var i = 0; i < currentLinks.length; i++) {
                            if (lastDayLinks.indexOf(currentLinks[i]) == -1)
                                credit++;
                        }
                        DeductAccountCredit(UserId, credit);
                    }
                    else
                        DeductAccountCredit(UserId, currentLinks.length);
                }
            }
        },
        error: function (data) {
        }
    });
}

function GenerateCSVData(response) {

    if (response != undefined && response != "") {

        var csvData = "";
        csvData += "Internal links," + response.internalLinks + "\n";
        csvData += "External links," + response.externalLinks + "\n";
        csvData += "Do follow links," + response.dofollowLinks + "\n";
        csvData += "No follow links," + response.nofollowLinks + "\n";
        csvData += "Sponsored Links," + response.sponsoredLinks + "\n";
        csvData += "User generated Links," + response.ugcLinks + "\n";

        if (FileTypeSetting != "" && FileTypeSetting == "CSV")
            $("#btnDownloadHighLighter").attr("download", "Link Typer Data.csv");
        else
            $("#btnDownloadHighLighter").attr("download", "Link Typer Data.txt");
        $("#btnDownloadHighLighter").attr("href", "data:text/csv;charset=utf8,Link Type,Count\n" + encodeURIComponent(csvData));

        LinkTypeGenerateCSV(response.lstInternal, "btnDownloadInternalLink", "Internal Links");
        LinkTypeGenerateCSV(response.lstExternal, "btnDownloadExternalLink", "External Links");
        LinkTypeGenerateCSV(response.lstDoFollow, "btnDownloadDoFollowLink", "Do follow Links");
        LinkTypeGenerateCSV(response.lstNoFollow, "btnDownloadNoFollowLink", "No follow Links");
        LinkTypeGenerateCSV(response.lstSponsored, "btnDownloadSponsoredLink", "Sponsored Links");
        LinkTypeGenerateCSV(response.lstUserGenerated, "btnDownloadUGLinks", "User Generated Links");

    }
}

function LinkTypeGenerateCSV(lstData, buttonId, fileName) {

    if (lstData != undefined && lstData.length > 0) {
        var csvInternal = "";
        for (var i = 0; i < lstData.length; i++) {
            csvInternal += lstData[i] + "\n";
        }

        if (FileTypeSetting != "" && FileTypeSetting == "CSV")
            $("#" + buttonId).attr("download", fileName + ".csv");
        else
            $("#" + buttonId).attr("download", fileName + ".txt");
        $("#" + buttonId).attr("href", "data:text/csv;charset=utf8,Link\n" + encodeURIComponent(csvInternal));
    }

}