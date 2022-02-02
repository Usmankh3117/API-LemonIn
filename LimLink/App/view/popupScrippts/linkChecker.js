var FileTypeSetting = "";
let nullLinks = [];
let rightLinks = [];
let fourOfourerrorLinks = [];
let clientErrorLinks = [];
let wothoutHrefLinks = [];
let reedirectLinks = [];
let serverErrorLinks = [];
let otherLinks = [];
let isProcessCompleted = false;

$(document).ready(function () {

    $("#btnDownloadHighLighter").hide();
    $(".v1_DonwloadCheckValid,.v1_DonwloadCheck404,.v1_DonwloadCheckbroken,.v1_DonwloadCheckempty,.v1_DonwloadCheckredirects,.v1_DonwloadChecknoDomain,.v1_DonwloadCheckServer").hide();
    $(".loader").css({ "display": "none" });
    chrome.storage.local.get(['ApppState', 'UserSetting', 'LemonInUser'], function (result) {
        if (result != undefined && result.ApppState != undefined && result.ApppState == true) {

            let blockedDomains = [], blockedWords = [];
            let intervalCheck = 50;
            if (result.UserSetting != undefined) {
                blockedDomains = result.UserSetting.BlockListDomain;
                blockedWords = result.UserSetting.BlockListWords;
                intervalCheck = result.UserSetting.IntervalCheck;
                FileTypeSetting = result.UserSetting.FileType;
            }
            var limUserId = result.LemonInUser.Id;

            chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                var activeTab = tabs[0];
                chrome.tabs.sendMessage(
                    activeTab.id,
                    { message: "statusCheck", BlockedDomain: blockedDomains, BlockedWords: blockedWords },
                    (responce) => {
                        console.log("responce", responce);
                        if (responce == false) {
                            //$(".loader").css({ "display": "none" });
                            return;
                        }
                        let totalInfo = responce.linksAll;
                        let goodLinks = 0;
                        let fourOfourLinks = 0;
                        let clientLinksError = 0;
                        let redirectLinksError = 0;
                        let hrefOutLinks = 0;
                        let otherLinksStatus = 0;
                        let linksNull = 0;
                        let serverLinksError = 0;
                        let allValues = 0;

                        let i = 0;

                        let fullLinks = responce.fullLinks;
                        GetLastDaysLinks(limUserId, fullLinks);
                        //DeductAccountCredit(limUserId, totalInfo.length);

                        $(".v1_558").text(`${totalInfo.length} total links`);
                        async function requestFunction() {
                            //   $("#extractedLinks").show();
                            //   $("#totalExtracting").text(allValues - 1);
                            if (i > totalInfo.length) {
                                $("#btnDownloadHighLighter").show();
                                $(".v1_DonwloadCheckValid,.v1_DonwloadCheck404,.v1_DonwloadCheckbroken,.v1_DonwloadCheckempty,.v1_DonwloadCheckredirects,.v1_DonwloadChecknoDomain,.v1_DonwloadCheckServer").show();
                                isProcessCompleted == true;
                                GenerateCSVData(rightLinks, fourOfourerrorLinks, wothoutHrefLinks, reedirectLinks, clientErrorLinks, serverErrorLinks);
                                //chrome.tabs.sendMessage(activeTab.id, {
                                //    message: "changeColorwithstatus",
                                //    nullLinks: nullLinks,
                                //    rightLinks: rightLinks,
                                //    fourOfourerrorLinks: fourOfourerrorLinks,
                                //    clientErrorLinks: clientErrorLinks,
                                //    wothoutHrefLinks: wothoutHrefLinks,
                                //    reedirectLinks: reedirectLinks,
                                //    serverErrorLinks: serverErrorLinks,
                                //    otherLinks: otherLinks,
                                //});
                                return;
                            } else {
                                // console.log("totalinfo", totalInfo);
                                if (totalInfo == undefined) {
                                    alert("Please Reload the Page!");
                                    document.location.reload();
                                } else if (totalInfo[i] == null) {
                                    console.log("it's null!");
                                    linksNull += 1;
                                    nullLinks.push(totalInfo[i]);

                                    i++;
                                    allValues++;
                                    setTimeout(function () { requestFunction() }, intervalCheck);
                                } else {
                                    var request = new XMLHttpRequest();
                                    if (totalInfo[i] == "//") {
                                        i++;
                                        allValues++;
                                        setTimeout(function () { requestFunction() }, intervalCheck);
                                    }
                                    request.open("GET", totalInfo[i], true);
                                    request.onreadystatechange = function () {
                                        if (request.readyState === 4) {
                                            if (request.status == 404) {
                                                fourOfourLinks = fourOfourLinks + 1;
                                                fourOfourerrorLinks.push(totalInfo[i]);
                                                console.log("wrong request", fourOfourLinks);
                                                $(".v1_547").text(fourOfourLinks);
                                                i++;
                                                allValues++;
                                                setTimeout(function () { requestFunction() }, intervalCheck);
                                            } else if (request.status >= 400 && request.status <= 499) {
                                                clientLinksError += 1;
                                                clientErrorLinks.push(totalInfo[i]);
                                                $(".v1_551").text(clientLinksError);
                                                console.log("wrong request", clientLinksError);
                                                i++;
                                                allValues++;
                                                setTimeout(function () { requestFunction() }, intervalCheck);
                                            } else if (request.status >= 200 && request.status <= 299) {
                                                goodLinks = goodLinks + 1;
                                                rightLinks.push(totalInfo[i]);
                                                console.log("right request", goodLinks);
                                                $(".v1_546").text(goodLinks);
                                                i++;
                                                allValues++;
                                                setTimeout(function () { requestFunction() }, intervalCheck);
                                            } else if (request.status == 0) {
                                                hrefOutLinks += 1;
                                                wothoutHrefLinks.push(totalInfo[i]);
                                                console.log("null request");
                                                $(".v1_549").text(hrefOutLinks);
                                                i++;
                                                allValues++;
                                                setTimeout(function () { requestFunction() }, intervalCheck);
                                            } else if (request.status >= 300 && request.status <= 399) {
                                                redirectLinksError += 1;
                                                reedirectLinks.push(totalInfo[i]);
                                                console.log("redirect status");
                                                $(".v1_550").text(redirectLinksError);
                                                i++;
                                                allValues++;
                                                setTimeout(function () { requestFunction() }, intervalCheck);
                                            } else if (request.status >= 500 && request.status <= 599) {
                                                console.log("server error status");
                                                serverLinksError += 1;
                                                serverErrorLinks.push(totalInfo[i]);
                                                $(".v1_552").text(serverErrorLinks);
                                                i++;
                                                allValues++;
                                                setTimeout(function () { requestFunction() }, intervalCheck);
                                            } else {
                                                otherLinksStatus += 1;
                                                otherLinks.push(totalInfo[i]);

                                                console.log("this is other status", request.status);
                                                i++;
                                                allValues++;
                                                setTimeout(function () { requestFunction() }, intervalCheck);
                                            }
                                        }
                                    };
                                    request.send();
                                }
                            }
                        }
                        requestFunction();
                    }
                );
            });
        }
        //else
        //    $(".loader").css({ "display": "none" });
    });

    $(".v1_525,.v1_539,.v1_532").click(function () {
        HightLightByStatus("Valid");
    });

    $(".v1_526,.v1_540,.v1_533").click(function () {
        HightLightByStatus("404");
    });

    $(".v1_527,.v1_541,.v1_534").click(function () {
        HightLightByStatus("Broken");
    });

    $(".v1_528,.v1_542,.v1_535").click(function () {
        HightLightByStatus("Empty");
    });

    $(".v1_529,.v1_543,.v1_536").click(function () {
        HightLightByStatus("Redirect");
    });

    $(".v1_530,.v1_544,.v1_537").click(function () {
        HightLightByStatus("NoDomain");
    });

    $(".v1_531,.v1_545,.v1_538").click(function () {
        HightLightByStatus("ServerError");
    });

});

function HightLightByStatus(Type) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            message: "HightLightByStatus",
            type: Type,
            nullLinks: nullLinks,
            rightLinks: rightLinks,
            fourOfourerrorLinks: fourOfourerrorLinks,
            clientErrorLinks: clientErrorLinks,
            wothoutHrefLinks: wothoutHrefLinks,
            reedirectLinks: reedirectLinks,
            serverErrorLinks: serverErrorLinks,
            otherLinks: otherLinks,
        });
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

function GenerateCSVData(rightLinks, fourOfourerrorLinks, wothoutHrefLinks, reedirectLinks, clientErrorLinks, serverErrorLinks) {

    if (rightLinks.length > 0 || fourOfourerrorLinks.length > 0 || wothoutHrefLinks.length > 0 || reedirectLinks.length > 0 || clientErrorLinks.length > 0 || serverErrorLinks.length > 0) {

        var csvData = "";
        for (var i = 0; i < rightLinks.length; i++) {
            var link = rightLinks[i];
            csvData += link + ",Valid" + "\n";
        }
        for (var i = 0; i < fourOfourerrorLinks.length; i++) {
            var link = fourOfourerrorLinks[i];
            csvData += link + ",404" + "\n";
        }
        for (var i = 0; i < wothoutHrefLinks.length; i++) {
            var link = wothoutHrefLinks[i];
            csvData += link + ",Empty" + "\n";
        }
        for (var i = 0; i < reedirectLinks.length; i++) {
            var link = reedirectLinks[i];
            csvData += link + ",Redirects" + "\n";
        }
        for (var i = 0; i < clientErrorLinks.length; i++) {
            var link = clientErrorLinks[i];
            csvData += link + ",No Domain" + "\n";
        }
        for (var i = 0; i < serverErrorLinks.length; i++) {
            var link = serverErrorLinks[i];
            csvData += link + ",Server Error" + "\n";
        }
        if (FileTypeSetting != "" && FileTypeSetting == "CSV")
            $("#btnDownloadHighLighter").attr("download", "Link Checker Data.csv");
        else
            $("#btnDownloadHighLighter").attr("download", "Link Checker Data.txt");
        $("#btnDownloadHighLighter").attr("href", "data:text/csv;charset=utf8,Link,Type\n" + encodeURIComponent(csvData));

        LinkCheckerGenerateCSV(rightLinks, "btnDownloadValidlLink", "Valid Links");
        LinkCheckerGenerateCSV(fourOfourerrorLinks, "btnDownload404Link", "404 Links");
        LinkCheckerGenerateCSV(wothoutHrefLinks, "btnDownloademptyLink", "Empty Links");
        LinkCheckerGenerateCSV(reedirectLinks, "btnDownloadredirectsLink", "Redirects Links");
        LinkCheckerGenerateCSV(clientErrorLinks, "btnDownloadnoDomainLink", "No Domain Links");
        LinkCheckerGenerateCSV(serverErrorLinks, "btnDownloadServerLink", "Server Error Links");
    }
}

function LinkCheckerGenerateCSV(lstData, buttonId, fileName) {

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