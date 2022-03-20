$(document).ready(function () {
    chrome.storage.local.get(['LemonInUser'], function (result) {
       if (result != undefined || result.LemonInUser != undefined) {
           LockFeatures(result.LemonInUser.Id);
       }
    });

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
                        { message: "resetColor", BlockedDomain: blockedDomains, BlockedWords: blockedWords },
                        (responce) => {

                            console.log("responce", responce);
                            if (responce == false)
                                return;
                            var error = chrome.runtime.lastError;
                            if (error) {
                                // chrome.tabs.sendMessage(activeTab.id, { message: "reloadPage" });
                            } else {
                                //   window.location = "linkHighLighter.html";
                                
                            }
                        }
                    );
                });
            }
        });

    }());
});


function LockFeatures(userId) {
    $.ajax({
        type: "POST",
        url: baseURL + "Credit/GetAccountCredit",
        dataType: "json",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            "UserId": userId
        }),
        beforeSend: function () {
            $('#lemoin-overlay').show();
        },
        success: function (data) {
            if (data != null && data != undefined) {

                if (data.status != undefined) {
                    if (data.status == true) {
                        if (data.data != undefined && data.data.availableCredit == 0) {
                            var allPages = $(".lockPage");
                            if (allPages.length > 0) {
                                allPages.each(function () {
                                    $(this).attr("href", "#");
                                });
                                $(".v1_34").attr("style", "background:rgb(234 234 234)");
                                $(".v1_35").attr("style", "background:rgb(234 234 234)");
                                $(".v1_36").attr("style", "background:rgb(234 234 234)");
                                $(".v1_37").attr("style", "background:rgb(234 234 234)");
                            }
                        }
                    }
                    else {
                        var allPages = $(".lockPage");
                        if (allPages.length > 0) {
                            allPages.each(function () {
                                $(this).attr("href", "#");
                            });
                            $(".v1_34").attr("style", "background:rgb(234 234 234)");
                            $(".v1_35").attr("style", "background:rgb(234 234 234)");
                            $(".v1_36").attr("style", "background:rgb(234 234 234)");
                            $(".v1_37").attr("style", "background:rgb(234 234 234)");
                        }
                    }
                }
            }
        },
        error: function (data) {
        },
        complete: function () {
            $('#lemoin-overlay').hide();
        }
    });
}