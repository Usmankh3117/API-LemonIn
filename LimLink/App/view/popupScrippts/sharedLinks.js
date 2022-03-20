let UserId = "";
$(document).ready(function () {

    chrome.storage.local.get('LemonInUser', function (result) {
        if (result != undefined && result.LemonInUser != undefined && result.LemonInUser.Id != undefined && result.LemonInUser.Id != null) {
            UserId = result.LemonInUser.Id;
            GetAllSharedLinks(UserId);
        }
    });

    $("#btnDeleteSharedHistory").click(fn_DeleteAllHistory);
});

function GetAllSharedLinks(userId) {

    $.ajax({
        type: "POST",
        url: baseURL + "LimLink/GetSharedLink",
        dataType: "json",
        crossDomain: true,
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
                if (data.status) {
                    let sharedData = data.data;
                    BindSharedLinks(sharedData);

                    chrome.storage.local.get('UserSetting', function (result) {
                        if (result != undefined && result.UserSetting != undefined) {
                            if (result.UserSetting.FileType == "CSV")
                                GenerateCSVData(sharedData, true);
                            else if (result.UserSetting.FileType == "TXT")
                                GenerateCSVData(sharedData, false);
                        }
                    });
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

function BindSharedLinks(allLinksData) {

    $("#divHistoryLinks").html('');

    if (allLinksData.length > 0) {

        var mainHTMl = "";
        for (var i = 0; i < allLinksData.length; i++) {

            var linksByUser = allLinksData[i];
            var userName = linksByUser.sharedUserName;
            var clearuserName = userName.replaceAll(' ', '');
            var allLinks = linksByUser.sharedLinks;

            var linkHTMl = "";
            for (var j = 0; j < allLinks.length; j++) {
                var link = allLinks[j].link;
                var id = allLinks[j].id;
                var tempHTMl = '<div class="row mb-2"><div class="col-8 pl-4 link-word-break" id="divLinkText">' + link + '</div>' +
                    '<div class="col-4 history-icons"><i class="far fa-trash-alt mr-2 btnDeleteSingleLink" style="color:red" title="Delete" data-id="' + id + '"></i>' +
                    '<i class="fas fa-share-alt mr-2 btnShareSinglelink" data-type="1" title="Share" data-id="' + id + '"></i>' +
                    '<i class="far fa-star mr-2 btnSaveSinglelink customtooltip" title="Save" data-id="' + id + '"><span class="classic">Saved</span></i>' +
                    '<i class="far fa-copy mr-3 copytoclipboard customtooltip" title="Copy to clipboard"><span class="classic">Saved</span></i></div></div>';
                linkHTMl += tempHTMl;
            }

            mainHTMl += '<div class="col-11 ml-3 hisotry-collapse mb-3">' +
                '<div class="p-2 hisotry-tabs row" data-toggle="collapse" data-target="#collapse' + clearuserName + '" aria-expanded="true" aria-controls="collapse' + clearuserName + '">' +
                '<div class="col-10" id="divDateText">' + userName + '</div>' +
                '<div class="col-2"><i class="fa ml-3" aria-hidden="true"></i></div></div>' +
                '<div id="collapse' + clearuserName + '" class="collapse hisotry-content pt-4 pb-3 history-links-scroll" aria-labelledby="headingOne" data-parent="#divHistoryLinks">' + linkHTMl + '</div></div>';
        }
        $("#divHistoryLinks").html(mainHTMl);
    }
    else {
        $("#divHistoryLinks").html('<p class="text-danger ml-5">No Data Found.</p>');
        $("#btnDeleteSharedHistory").hide();
        $("#btnDownloadShared").hide();
    }

}


$(document).on("click", ".copytoclipboard", function () {
    var currentUser = $(this);
    var link = currentUser.parent().parent().find("#divLinkText").text();
    fncopyToClipboard(link);
    if (currentUser != undefined && currentUser.length > 0) {
        currentUser.removeClass("far");
        currentUser.addClass("fas");
        currentUser.find('span').text("Link Copied!");
        currentUser.find('span').addClass("show");
        setTimeout(function () {
            currentUser.find('span').removeClass("show");
            currentUser.addClass("far");
            currentUser.removeClass("fas");
        }, 2000);
    }
});


$(document).on("click", ".btnShareSinglelink", function () {
    $("#hdnLinkId").val('');
    $("#hdnShareType").val('');

    var linkId = $(this).attr('data-id');
    var type = $(this).attr('data-type');
    if (linkId != undefined && linkId != "") {
        $("#hdnLinkId").val(linkId);
        $("#hdnShareType").val(type);
        $("#txtShareEmail").val('');
        $("#divShareDetails").show();
        $("html, body").animate({ scrollTop: 0 }, 300);
    }
});

$(document).on("click", ".btnDeleteSingleLink", function () {
    if (confirm('Are you sure you want to delete?')) {

        var linkId = $(this).attr('data-id');
        if (linkId != undefined && linkId != "") {

            var LeadData = {
                "Id": parseInt(linkId)
            }

            $.ajax({
                type: "POST",
                url: baseURL + "LimLink/DeleteHistoryLinkById",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(LeadData),
                beforeSend: function () {
                    $('#lemoin-overlay').show();
                },
                success: function (data) {
                    if (data != null && data != undefined) {
                        if (data.status != undefined && data.status == true) {
                            GetAllSharedLinks(UserId);
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
    }
});

$(document).on("click", ".btnSaveSinglelink", function () {
    /*$("#lblCopyMessage").hide();*/

    var currentElement = $(this);
    var linkId = $(this).attr('data-id');
    if (linkId != undefined && linkId != "") {

        var LeadData = {
            "UserId": UserId,
            "Id": parseInt(linkId)
        }

        $.ajax({
            type: "POST",
            url: baseURL + "LimLink/SaveUserLink",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(LeadData),
            beforeSend: function () {
                $('#lemoin-overlay').show();
            },
            success: function (data) {
                if (data != null && data != undefined) {
                    if (data.status != undefined && data.status == true) {
                        //$("#lblCopyMessage").show();
                        //$("#lblCopyMessage").text("Link Saved!");
                        //setTimeout(function () {
                        //    $("#lblCopyMessage").hide();
                        //}, 3000);
                        if (currentElement != undefined && currentElement.length > 0) {
                            currentElement.removeClass("far");
                            currentElement.addClass("fas");
                        }
                        //var xElement = $("#snackbarMessage");
                        //xElement.addClass("show");
                        //xElement.text("Link Saved!");
                        //setTimeout(function () { xElement.removeClass("show") }, 3000);
                        currentElement.find('span').text("Link Saved!");
                        currentElement.find('span').addClass("show");
                        setTimeout(function () { currentElement.find('span').removeClass("show") }, 2000);
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

});

function fn_DeleteAllHistory() {
    if (confirm('Are you sure you want to delete?')) {

        if (UserId != undefined && UserId != "") {

            var LeadData = {
                "UserId": UserId
            }

            $.ajax({
                type: "POST",
                url: baseURL + "LimLink/DeleteAllSharedLinks",
                dataType: "json",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(LeadData),
                beforeSend: function () {
                    $('#lemoin-overlay').show();
                },
                success: function (data) {
                    if (data != null && data != undefined) {
                        if (data.status != undefined && data.status == true) {
                            GetAllSharedLinks(UserId);
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
    }
}

function GenerateCSVData(allLinksData, IsCSV) {

    if (allLinksData.length > 0) {

        var csvData = "";
        for (var i = 0; i < allLinksData.length; i++) {
            var linksByUser = allLinksData[i];
            var userName = linksByUser.sharedUserName;
            var allLinks = linksByUser.sharedLinks;

            for (var j = 0; j < allLinks.length; j++) {
                var link = allLinks[j].link;
                var id = allLinks[j].id;
                csvData += userName + "," + '=HYPERLINK("' + link + '"' + ')' + "\n";
                //csvData += userName + "," + link + "\n";
            }
        }
        if (IsCSV)
            $("#btnDownloadShared").attr("download", "Shared Links.csv");
        else
            $("#btnDownloadShared").attr("download", "Shared Links.txt");
        $("#btnDownloadShared").attr("href", "data:text/csv;charset=utf8,Shared By,Link\n" + encodeURIComponent(csvData));
    }
}