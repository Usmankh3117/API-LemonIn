let UserId = "";
$(document).ready(function () {

    chrome.storage.local.get('LemonInUser', function (result) {
        if (result != undefined && result.LemonInUser != undefined && result.LemonInUser.Id != undefined && result.LemonInUser.Id != null) {
            UserId = result.LemonInUser.Id;
            GetAllSavedLinks(UserId);
        }
    });

    $("#btnDeleteSavedHistory").click(fn_DeleteAllSaved);

});


function GetAllSavedLinks(userId) {

    $.ajax({
        type: "POST",
        url: baseURL + "LimLink/GetUserLink",
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
                    let savedData = data.data;
                    BindSavedLinks(savedData);

                    chrome.storage.local.get('UserSetting', function (result) {
                        if (result != undefined && result.UserSetting != undefined) {
                            if (result.UserSetting.FileType == "CSV")
                                GenerateCSVData(savedData, true);
                            else if (result.UserSetting.FileType == "TXT")
                                GenerateCSVData(savedData, false);
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

function BindSavedLinks(allLinksData) {

    $("#divHistoryLinks").html('');

    if (allLinksData.length > 0) {

        var mainHTMl = "";
        for (var i = 0; i < allLinksData.length; i++) {

            var userLink = allLinksData[i];
            var linkName = userLink.link;
            var id = userLink.id;

            mainHTMl += '<div class="row ml-4 mr-4 m-2 p-2 pt-3 pb-3 save-links-con">' +
                //'<div class="col-1"></div>' +
                '<div class="col-8 pl-1 save-link-text"><label id="lblLinktext" class="m-0"> ' + linkName + '</label></div>' +
                '<div class="col-4 text-right save-link-icons">' +
                //'<i class="far fa-trash-alt mr-3 btnDeleteSingleLink" style="color:red" title="Delete" data-id="' + id + '"></i>' +
                '<i class="fas fa-share-alt mr-3 btnShareSinglelink" data-type="2" title="Share" data-id="' + id + '"></i>' +
                '<i class="far fa-copy mr-3 copytoclipboard customtooltip" title="Copy to clipboard"><span class="classic">Saved</span></i>' +
                '<i class="fas fa-star btnDeleteSingleLink" data-id="' + id + '"></i></div></div>';
        }
        $("#divHistoryLinks").html(mainHTMl);
    }
    else {
        $("#divHistoryLinks").html('<p class="text-danger ml-5">No Data Found.</p>');
        $("#btnDeleteSavedHistory").hide();
        $("#btnDownloadSaved").hide();
    }

}

$(document).on("click", ".copytoclipboard", function () {
    var currentUser = $(this);
    var link = currentUser.parent().parent().find("#lblLinktext").text();
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
    //if (confirm('Are you sure you want to delete?')) {

    var linkId = $(this).attr('data-id');
    if (linkId != undefined && linkId != "") {

        var LeadData = {
            "Id": parseInt(linkId)
        }

        $.ajax({
            type: "POST",
            url: baseURL + "LimLink/DeleteUserLink",
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
                        GetAllSavedLinks(UserId);
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
    //}
});

function fn_DeleteAllSaved() {
    if (confirm('Are you sure you want to delete?')) {

        if (UserId != undefined && UserId != "") {

            var LeadData = {
                "UserId": UserId
            }

            $.ajax({
                type: "POST",
                url: baseURL + "LimLink/DeleteAllUserLink",
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
                            GetAllSavedLinks(UserId);
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
            var userLink = allLinksData[i];
            var linkName = userLink.link;
            var id = userLink.id;
            csvData += linkName + "\n";
        }
        if (IsCSV)
            $("#btnDownloadSaved").attr("download", "Saved Links.csv");
        else
            $("#btnDownloadSaved").attr("download", "Saved Links.txt");
        $("#btnDownloadSaved").attr("href", "data:text/csv;charset=utf8,Link\n" + encodeURIComponent(csvData));
    }
}