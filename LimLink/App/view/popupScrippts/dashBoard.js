$(document).ready(function () {
    //chrome.storage.local.get(['LemonInUser'], function (result) {
    //    if (result != undefined || result.LemonInUser != undefined) {
    //        LockFeatures(result.LemonInUser.Id);
    //    }
    //});
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