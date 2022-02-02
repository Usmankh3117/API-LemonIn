$(document).ready(function () {

    $("#lblDomainMessage,#lblWordsMessage,#lblResetSetting").hide();
    $("#btnSaveBlockDomains").click(SaveBlockDomains);
    $("#btnSaveBlockWords").click(SaveBlockWords);
    $("#btnResetSettings").click(fn_ResetToDefaultSetting);

    BindSettingData();

    $(document).on("change", "#chkCacheMylinks", function () {
        var currentElement = $(this);
        chrome.storage.local.get('UserSetting', function (result) {
            if (result != undefined && result.UserSetting != undefined) {
                Settings = result.UserSetting;
                if (currentElement.prop('checked'))
                    Settings.CacheLink = true;
                else
                    Settings.CacheLink = false;

                chrome.storage.local.set({ 'UserSetting': Settings });
            }
        });
    });

    $(document).on("change", "#chkNoFollowLinks", function () {
        var currentElement = $(this);
        chrome.storage.local.get('UserSetting', function (result) {
            if (result != undefined && result.UserSetting != undefined) {
                Settings = result.UserSetting;
                if (currentElement.prop('checked'))
                    Settings.NoFollowLink = true;
                else
                    Settings.NoFollowLink = false;

                chrome.storage.local.set({ 'UserSetting': Settings });
            }
        });
    });

    $(document).on("change", "#chkURLsonGoogle", function () {
        var currentElement = $(this);
        chrome.storage.local.get('UserSetting', function (result) {
            if (result != undefined && result.UserSetting != undefined) {
                Settings = result.UserSetting;
                if (currentElement.prop('checked'))
                    Settings.GoogleURLs = true;
                else
                    Settings.GoogleURLs = false;

                chrome.storage.local.set({ 'UserSetting': Settings });
            }
        });
    });

    $('input[type=radio][name=fileType]').change(function () {

        var currentElement = this;
        chrome.storage.local.get('UserSetting', function (result) {
            if (result != undefined && result.UserSetting != undefined) {
                Settings = result.UserSetting;
                Settings.FileType = currentElement.value;
                chrome.storage.local.set({ 'UserSetting': Settings });
            }
        });
    });

    $('input[type=radio][name=linkOpener]').change(function () {

        var currentElement = this;
        chrome.storage.local.get('UserSetting', function (result) {
            if (result != undefined && result.UserSetting != undefined) {
                Settings = result.UserSetting;
                Settings.LinkOpener = currentElement.value;
                chrome.storage.local.set({ 'UserSetting': Settings });
            }
        });
    });

    $('input[type=radio][name=RepeatedLinks]').change(function () {

        var currentElement = this;
        chrome.storage.local.get('UserSetting', function (result) {
            if (result != undefined && result.UserSetting != undefined) {
                Settings = result.UserSetting;
                Settings.RepeatedLink = currentElement.value;
                chrome.storage.local.set({ 'UserSetting': Settings });
            }
        });
    });

    $("#txtIntervalChecks").bind('keyup mouseup', function () {
        var currentElement = $(this);
        chrome.storage.local.get('UserSetting', function (result) {
            if (result != undefined && result.UserSetting != undefined) {
                Settings = result.UserSetting;
                Settings.IntervalCheck = currentElement.val();
                chrome.storage.local.set({ 'UserSetting': Settings });
            }
        });
    });

});

function SaveBlockDomains() {

    $("#lblDomainMessage").hide();
    $("#lblDomainMessage").removeClass("text-danger").removeClass("text-success");
    var domains = $("#txtBlockDomains").val();

    /*if (domains != "" && domains.trim() != "") {*/

    var allDomain = [];
    if (domains != "" && domains.trim() != "")
        allDomain = domains.split("\n");
    chrome.storage.local.get('UserSetting', function (result) {
        if (result != undefined && result.UserSetting != undefined) {
            Settings = result.UserSetting;
            Settings.BlockListDomain = allDomain;
            chrome.storage.local.set({ 'UserSetting': Settings });
            $("#lblDomainMessage").text("Domain list saved.");
            $("#lblDomainMessage").addClass("text-success");
            $("#lblDomainMessage").show();
        }
    });
    //}
    //else {
    //    $("#lblDomainMessage").text("Please enter domain list");
    //    $("#lblDomainMessage").addClass("text-danger");
    //    $("#lblDomainMessage").show();
    //}
}

function SaveBlockWords() {

    $("#lblWordsMessage").hide();
    $("#lblWordsMessage").removeClass("text-danger").removeClass("text-success");
    var words = $("#txtBlockWords").val();

    /*if (words != "" && words.trim() != "") {*/
    var allDomain = [];
    if (words != "" && words.trim() != "")
        allDomain = words.split("\n");
    chrome.storage.local.get('UserSetting', function (result) {
        if (result != undefined && result.UserSetting != undefined) {
            Settings = result.UserSetting;
            Settings.BlockListWords = allDomain;
            chrome.storage.local.set({ 'UserSetting': Settings });
            $("#lblWordsMessage").text("Words list saved.");
            $("#lblWordsMessage").addClass("text-success");
            $("#lblWordsMessage").show();
        }
    });
    //}
    //else {
    //    $("#lblWordsMessage").text("Please enter word list");
    //    $("#lblWordsMessage").addClass("text-danger");
    //    $("#lblWordsMessage").show();
    //}

}

function BindSettingData() {
    chrome.storage.local.get('UserSetting', function (result) {
        if (result != undefined && result.UserSetting != undefined) {

            var setting = result.UserSetting;

            if (setting.IntervalCheck)
                $("#txtIntervalChecks").val(setting.IntervalCheck);
            if (setting.CacheLink)
                $("#chkCacheMylinks").prop('checked', true);
            else
                $("#chkCacheMylinks").prop('checked', false);
            if (setting.NoFollowLink)
                $("#chkNoFollowLinks").prop('checked', true);
            else
                $("#chkNoFollowLinks").prop('checked', false);
            if (setting.GoogleURLs)
                $("#chkURLsonGoogle").prop('checked', true);
            else
                $("#chkURLsonGoogle").prop('checked', false);
            if (setting.BlockListDomain != undefined && setting.BlockListDomain.length > 0) {
                $("#txtBlockDomains").val(setting.BlockListDomain.join("\n"));
            }
            if (setting.BlockListWords != undefined && setting.BlockListWords.length > 0) {
                $("#txtBlockWords").val(setting.BlockListWords.join("\n"));
            }
            if (setting.FileType == "CSV") {
                $("#rbtnCSV").prop('checked', true);
            }
            else if (setting.FileType == "TXT") {
                $("#rbtnTXT").prop('checked', true);
            }

            if (setting.LinkOpener == "NewTab") {
                $("#rbtnNewTab").prop('checked', true);
            }
            else if (setting.LinkOpener == "NewWindow") {
                $("#rbtnNewWindow").prop('checked', true);
            }
            else if (setting.LinkOpener == "InognitoWindow") {
                $("#rbtnNewInognito").prop('checked', true);
            }

            if (setting.RepeatedLink == "RepeatedLink") {
                $("#rbtnRepeatedLinks").prop('checked', true);
            }
        }
    });
}

function fn_ResetToDefaultSetting() {

    var Settings = {
        IntervalCheck: 50,
        CacheLink: false,
        NoFollowLink: false,
        GoogleURLs: false,
        BlockListDomain: [],
        BlockListWords: [],
        FileType: "CSV",
        LinkOpener: "NewTab",
        RepeatedLink: "RepeatedLink",
    }
    chrome.storage.local.set({ 'UserSetting': Settings }, function () {
        BindSettingData();
        $("#lblResetSetting").show();
        $("#lblResetSetting").text("Setting reset successfully.");
        setTimeout(function () {
            $("#lblResetSetting").hide();
        }, 3000)
    });

}