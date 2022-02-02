$(document).ready(function () {
    $(".v1_hidepassword").hide();

    $(".button-click").click(function () {
        const button = $(this);
        clickEventStatus(button, false);
        loadingNewButton(true,"SIGN UP");
        const data = extractInputInfo($(".input-feild"));
        if (!isCheckForEmpty(data)) {

            if (IsEmail(data.Email)) {
                $.ajax({
                    type: "POST",
                    url: baseURL + "account/register",
                    dataType: "json",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify({
                        "FirstName": data.FirstName,
                        "Email": data.Email,
                        "Password": data.Password,
                    }),
                    success: function (data) {

                        if (data != null && data != undefined) {
                            if (data.status) {

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
                                chrome.storage.local.set({ 'UserSetting': Settings });

                                window.location = "verifyEmail.html";
                                chrome.storage.local.set({ 'ApppState': true });
                            }
                            else {
                                clickEventStatus(button, true);
                                loadingNewButton(false, "SIGN UP");
                                alert(data.message);
                            }
                        }
                    },
                    error: function (data) {
                        clickEventStatus(button, true);
                        loadingNewButton(false, "SIGN UP");
                    }
                });
            }
            else {
                clickEventStatus(button, true);
                loadingNewButton(false, "SIGN UP");
                alert("Please Enter Valid Email");
            }
        } else {
            clickEventStatus(button, true);
            loadingNewButton(false, "SIGN UP");
            alert("Please Fill In All Feilds");
        }
        console.log({ data });
    });

    $(".v1_viewpassword").click(function () {
        $('input[name="Password"]').attr("type", "text");
        $(".v1_hidepassword").show();
        $(".v1_viewpassword").hide();
    });

    $(".v1_hidepassword").click(function () {
        $('input[name="Password"]').attr("type", "password");
        $(".v1_hidepassword").hide();
        $(".v1_viewpassword").show();
    });
});