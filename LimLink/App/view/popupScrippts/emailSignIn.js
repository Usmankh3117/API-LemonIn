$(document).ready(function () {
    $(".v1_hidepassword").hide();
    $(".button-click").click(function () {
        const button = $(this);
        clickEventStatus(button, false);
        loadingNewButton(true, "LOGIN");
        const data = extractInputInfo($(".input-feild"));
        if (!isCheckForEmpty(data)) {

            if (IsEmail(data.Email)) {
                $.ajax({
                    type: "POST",
                    url: baseURL + "account/login",
                    dataType: "json",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify({
                        "Email": data.Email,
                        "Password": data.Password,
                        "AccountType": "Email"
                    }),
                    success: function (data) {

                        if (data != null && data != undefined) {
                            if (data.status) {
                                var user = {
                                    Name: data.fullName,
                                    Email: data.email,
                                    Id: data.id,
                                    Token: data.token
                                }
                                chrome.storage.local.set({ 'LemonInUser': user });

                                chrome.storage.local.get('UserSetting', function (result) {
                                    if (result == undefined || result.UserSetting == undefined) {
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
                                    }
                                    localStorage.setItem("active", "true");
                                    chrome.browserAction.setPopup({ popup: "../view/poppupPages/dashboard.html" });
                                    window.location = "../poppupPages/dashBoard.html";
                                });
                            }
                            else {
                                clickEventStatus(button, true);
                                loadingNewButton(false, "LOGIN");
                                alert(data.message);
                            }
                        }
                    },
                    error: function (data) {
                        clickEventStatus(button, true);
                        loadingNewButton(false, "LOGIN");
                    }
                });
            }
            else {
                clickEventStatus(button, true);
                loadingNewButton(false, "LOGIN");
                alert("Please Enter Valid Email");
            }
        } else {
            clickEventStatus(button, true);
            loadingNewButton(false, "LOGIN");
            alert("Please Fill In All Feilds");
        }
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