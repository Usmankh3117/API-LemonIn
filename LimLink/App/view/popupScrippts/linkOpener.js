$(document).ready(function () {

    $("#lblMessage").hide();
    $("#btnOpenURL").click(fn_OpenURLForOpener);

});

function fn_OpenURLForOpener() {

    $("#lblMessage").hide();
    var url = $("#txtURL").val();
    if (url != "" && url.trim() != "") {
        chrome.tabs.create({ "url": url });
    }
    else {
        $("#lblMessage").show();
        $("#lblMessage").text("Please enter URL");
    }
}