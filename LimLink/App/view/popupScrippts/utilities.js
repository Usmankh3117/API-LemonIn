//const baseURL = "https://localhost:44347/api/";
const baseURL = 'http://limlinkapi-dev.us-east-2.elasticbeanstalk.com/api/';
const buyCreditURL = "https://lemlinks.pearllemonleads.com";

function loading(start) {
    if (start) {
        $(".button-text span").addClass("d-none");
        $(".button-text").append(`<div class="loader"></div>`);
    } else {
        $(".button-text span").removeClass("d-none");
        $(".button-text .loader").remove();
    }
}

function loadingNewButton(start, buttontext) {
    if (start) {
        $('.button-text span').text('Processing');
    } else {
        $(".button-text span").text(buttontext);
    }
}

function clickEventStatus(el, enable) {
    if (enable) el.css({ "pointer-events": "auto" });
    else el.css({ "pointer-events": "none" });
}

function extractInputInfo(inputs) {
    const data = {};
    $.each(inputs, function (index, value) {
        value = $(value);
        data[`${value.attr("name")}`] = value.val();
    });
    return data;
}


function isCheckForEmpty(obj) {
    let flag = false;
    for (const key in obj) {
        if (obj[key] === "") {
            flag = true;
            break;
        }
    }
    return flag;
}


function request(url, options) {
    return new Promise((resolve, reject) => {
        fetch(baseURL + url, options).then(res => res.json()).then(result => {
            if (!result.success) throw result.error;
            else resolve(result);
        }).catch(err => {
            reject(err);
        });
    });
}

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        return false;
    } else {
        return true;
    }
}


function logInWithFB() {
    //var clientId = '396986901552505';
    //var clientSecret = '04ef65d51bcd9e455e4607f08ad7a89a';
    var clientId = '580000616710447';
    var clientSecret = 'fdcfb638a08aaa7e739242aaee6f07e9';

    var redirectUri = chrome.identity.getRedirectURL("extenson-name") //chrome.identity.getRedirectURL("extenson-name");

    var url = 'https://www.facebook.com/dialog/oauth?client_id=' + clientId +
        '&reponse_type=token&access_type=online&display=popup' +
        '&scope=email' +
        '&redirect_uri=' + redirectUri;
    var deferred = $.Deferred();

    chrome.identity.launchWebAuthFlow(
        {
            'url': url,
            'interactive': true
        },
        function (redirectedTo) {
            if (chrome.runtime.lastError) {
                // Example: Authorization page could not be loaded.
                deferred.reject(chrome.runtime.lastError.message);
            } else {
                // var response = urlParamsToMap(redirectedTo.replace(chrome.identity.getRedirectURL("extension-name") + "?", ""));
                var code = redirectedTo.split("?code=")[1];
                // var code = response.get('code');

                $.ajax({
                    url: 'https://graph.facebook.com/oauth/access_token?' +
                        'client_id=' + clientId +
                        '&client_secret=' + clientSecret +
                        '&redirect_uri=' + redirectUri +
                        '&code=' + code,
                    type: "GET",
                    crossDomain: true
                }).then(function (data) {

                    let getURL = `https://graph.facebook.com/me?access_token=${data.access_token}`;
                    fetch(getURL).then(response => response.json()).then(response => {

                        const userInfo = { name: response.name, password: `${response.id}@facebook.com` };
                        getURL = `https://graph.facebook.com/${response.id}?fields=email&access_token=${data.access_token}`;
                        fetch(getURL).then(response => response.json()).then(response => {
                            userInfo.email = response?.email ? response.email : `${response.id}@facebook.com`;

                            deferred.resolve(userInfo);
                        }).catch(err => {
                            deferred.reject(err);
                        });
                    }).catch(err => {
                        deferred.reject(err);
                    });
                });
            }
        }
    );

    return deferred.promise();
}




function logInWithGoogle() {
    return new Promise((resolve, reject) => {
        // const CLIENT_ID = encodeURIComponent('881664810686-njagpsj9ehjnd0v5g5ue02fpf99ggh0o.apps.googleusercontent.com');
        // const RESPONSE_TYPE = encodeURIComponent('id_token');
        // const REDIRECT_URI = encodeURIComponent("https://kopncmabgnogogbapenkfeleocneigja.chromium.org")
        // const SCOPE = encodeURIComponent('openid email');
        // const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
        // const PROMPT = encodeURIComponent('consent');

        const CLIENT_ID = encodeURIComponent('168043750259-9474gshgr7tv2e7ss12027njojtk80nb.apps.googleusercontent.com');
        const RESPONSE_TYPE = encodeURIComponent('id_token');
        const REDIRECT_URI = chrome.identity.getRedirectURL()

        const SCOPE = encodeURIComponent('openid profile email');
        const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
        const PROMPT = encodeURIComponent('consent');

        function create_auth_endpoint() {
            // let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

            // let openId_endpoint_url =
            //     `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${STATE}&nonce=${nonce}&prompt=${PROMPT}`;
            // return openId_endpoint_url;
            let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

            let openId_endpoint_url =
                `https://accounts.google.com/o/oauth2/v2/auth
?client_id=${CLIENT_ID}
&response_type=${RESPONSE_TYPE}
&redirect_uri=${REDIRECT_URI}
&scope=${SCOPE}
&state=${STATE}
&nonce=${nonce}
&prompt=${PROMPT}`;
            return openId_endpoint_url
        }

        chrome.identity.launchWebAuthFlow({
            'url': create_auth_endpoint(),
            'interactive': true
        }, function (redirect_url) {
            console.log(redirect_url)

            if (chrome.runtime.lastError) {
                reject("Some Problem Occured");
            } else {

                let id_token = redirect_url.substring(redirect_url.indexOf('id_token=') + 9);
                id_token = id_token.substring(0, id_token.indexOf('&'));
                function parseJwt(token) {
                    var base64Url = token.split('.')[1];
                    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    return JSON.parse(jsonPayload);
                };

                const user_info = parseJwt(id_token);

                if ((user_info.iss === 'https://accounts.google.com' || user_info.iss === 'accounts.google.com') && user_info.aud === CLIENT_ID) {
                    resolve({ email: user_info.email });
                } else {
                    reject("Invalid credentials.");
                }
            }
        });
    });
}

$(document).ready(function () {
    $("#lblCopyMessage,#divShareDetails,#lblShareEmail").hide();
    //$("#chkAppOnOff").prop('checked', true);
    if ($(".dropdown-menu .dropdown-item").length > 0) {
        $($(".dropdown-menu .dropdown-item")[1]).attr("href", buyCreditURL);
        $($(".dropdown-menu .dropdown-item")[1]).attr("target", "_blank");
    }

    $(document).on("click", ".login-with-google", function () {
        const text = $(".google-text");
        text.find(".main-text").addClass("d-none");
        text.find(".wait-text").removeClass("d-none");
        logInWithGoogle().then(data => {
            startLocalLoginFlow(data.email.split("@")[0], data.email, '', 'Google');
        }).catch(err => {
            alert(err);
            text.find(".main-text").removeClass("d-none");
            text.find(".wait-text").addClass("d-none");
            //buttonLoading(button, false);
        });
    });


    $(document).on("click", ".login-with-facebook", function () {
        const text = $(".facebook-text");
        text.find(".main-text").addClass("d-none");
        text.find(".wait-text").removeClass("d-none");

        logInWithFB().then(data => {


            startLocalLoginFlow(data.name, data.email, '', 'FB');
        }).catch(err => {


            alert(err);
            text.find(".main-text").removeClass("d-none");
            text.find(".wait-text").addClass("d-none");
            //buttonLoading(button, false);
        });
    });

    $(document).on("click", "#btnLogout", function () {
        localStorage.removeItem("active");
        chrome.storage.local.remove('LemonInUser');
        chrome.storage.local.remove('ApppState');
        window.location = "../poppupPages/signIn.html";
        chrome.browserAction.setPopup({ popup: "../view/poppupPages/started.html" });
    });

    $(document).on("change", "#chkAppOnOff", function () {
        if ($(this).prop('checked')) {
            chrome.storage.local.set({ 'ApppState': true });
            $("#chkAppOnOff").next().attr("title", "Off");
        }
        else {
            chrome.storage.local.remove('ApppState');
            $("#chkAppOnOff").next().attr("title", "On");
        }
    });

    chrome.storage.local.get(['ApppState', 'LemonInUser', 'UserLocalCredit'], function (result) {
        if (result != undefined && result.ApppState != undefined && result.ApppState == true) {
            $("#chkAppOnOff").prop('checked', true);
            $("#chkAppOnOff").next().attr("title", "Off");
        }
        else {
            $("#chkAppOnOff").prop('checked', false);
            $("#chkAppOnOff").next().attr("title", "On");
        }

        if (result != undefined && result.LemonInUser != undefined) {
            BindCredit(result.LemonInUser.Id, result.UserLocalCredit);
        }
    });



    $("#btnShareLink").click(fnShareLinkToUser);

    $(".buttontextHover").hover(function () {
        var button = $(".custombuttonhover");
        button.toggleClass("Hovercustombuttonhover");
    });

    $(".buttonHoverGoogle").hover(function () {
        var button = $("div.login-with-google");
        button.toggleClass("Hovercustombuttonhover");
    });
    $(".buttonHoverFacebook").hover(function () {
        var button = $("div.login-with-facebook");
        button.toggleClass("Hovercustombuttonhover");
    });
    $(".buttonHoverEmail").hover(function () {
        var button = $(".custombuttonhover");
        button.toggleClass("Hovercustombuttonhover");
    });
    $(".buttonhighlighterHover").hover(function () {
        var button = $(".v1_34");
        button.toggleClass("Hovercustombuttonhover");
    });
    $(".buttonlinkType").hover(function () {
        var button = $(".v1_35");
        button.toggleClass("Hovercustombuttonhover");
    });
    $(".buttonlinkchecker").hover(function () {
        var button = $(".v1_36");
        button.toggleClass("Hovercustombuttonhover");
    });
    $(".buttonlinkOpener").hover(function () {
        var button = $(".v1_37");
        button.toggleClass("Hovercustombuttonhover");
    });
    $(".buttonMylink").hover(function () {
        var button = $(".v1_38");
        button.toggleClass("Hovercustombuttonhover");
    });
    $(".v1_261").hover(function () {
        var button = $(".v1_258");
        button.toggleClass("Hovercustombuttonhover");
    });
    $(".v1_262").hover(function () {
        var button = $(".v1_259");
        button.toggleClass("Hovercustombuttonhover");
    });
    $(".v1_263").hover(function () {
        var button = $(".v1_260");
        button.toggleClass("Hovercustombuttonhover");
    });
});

function startLocalLoginFlow(FullName, Email, Password, AccountType) {
    $.ajax({
        type: 'POST',
        url: baseURL + 'account/register',
        dataType: 'json',
        crossDomain: true,
        headers: {
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            FirstName: FullName,
            Email: Email,
            Password: Password,
            sociallyVerifiedEmail: true,
            AccountType : AccountType
        }),
        beforeSend: function () {
            //
        },
        complete: function (data) {
            console.log('signup', data);
            $.ajax({
                type: 'POST',
                url: baseURL + 'account/login',
                dataType: 'json',
                crossDomain: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify({
                    Email: Email,
                    Password: Password,
                    AccountType: AccountType
                }),
                beforeSend: function () {
                    //
                },
                complete: function () {
                    //
                },
                success: function (data) {
                    console.log('signin', data);
                    if (data != null && data != undefined) {
                        if (data.status) {
                            var user = {
                                Name: data.fullName,
                                Email: data.email,
                                Id: data.id,
                                Token: data.token,
                            };
                            chrome.storage.local.set({ LemonInUser: user });

                            chrome.storage.local.get('UserSetting', function (result) {
                                if (result == undefined || result.UserSetting == undefined) {
                                    var Settings = {
                                        IntervalCheck: 50,
                                        CacheLink: false,
                                        NoFollowLink: false,
                                        GoogleURLs: false,
                                        BlockListDomain: [],
                                        BlockListWords: [],
                                        FileType: 'CSV',
                                        LinkOpener: 'NewTab',
                                        RepeatedLink: 'RepeatedLink',
                                    };
                                    chrome.storage.local.set({ UserSetting: Settings });
                                }

                                localStorage.setItem('active', 'true');
                                chrome.browserAction.setPopup({
                                    popup: '../view/poppupPages/dashboard.html',
                                });
                                window.location = '../poppupPages/dashBoard.html';
                            });
                        }
                    }
                },
                error: function (data) { },
            });
        },
        success: function (data) { },
        error: function (data) {
            //
        },
    });
}


function fncopyToClipboard(value) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(value).select();
    document.execCommand("copy");
    $temp.remove();
    //var xElement = $("#snackbarMessage");
    //xElement.addClass("show");
    //xElement.text("Link Copied!");
    //setTimeout(function () { xElement.removeClass("show") }, 2000);
    //$("#lblCopyMessage").show();
    //$("#lblCopyMessage").text("Link Copied!");
    //setTimeout(function () {
    //    $("#lblCopyMessage").hide();
    //}, 3000);
}


function fnShareLinkToUser() {

    $("#lblShareEmail").removeClass("text-success").removeClass("text-danger");
    $("#lblShareEmail").hide();
    var Email = $("#txtShareEmail").val();
    var isValid = true;

    if (Email == "" || Email.trim() == "") {
        $("#lblShareEmail").text("Email field is required.");
        $("#lblShareEmail").show();
        $("#lblShareEmail").addClass("text-danger");
        isValid = false;
    }
    else {
        if (!IsEmail(Email)) {
            $("#lblShareEmail").text("Enter valid email.");
            $("#lblShareEmail").show();
            $("#lblShareEmail").addClass("text-danger");
            isValid = false;
        }
    }

    if (isValid) {

        var linkId = $("#hdnLinkId").val();
        var shareType = $("#hdnShareType").val();

        $.ajax({
            type: "POST",
            url: baseURL + "LimLink/ShareUserLink",
            dataType: "json",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "UserId": UserId,
                "Email": Email,
                "LinkId": parseInt(linkId),
                "Type": parseInt(shareType)
            }),
            beforeSend: function () {
                $('#lemoin-overlay').show();
            },
            success: function (data) {
                if (data != null && data != undefined) {

                    $("#lblShareEmail").removeClass("text-success").removeClass("text-danger");
                    if (data.status != undefined) {
                        if (data.status == true) {
                            $("#txtShareEmail").val('');
                            $("#lblShareEmail").text(data.message);
                            $("#lblShareEmail").show();
                            $("#lblShareEmail").addClass("text-success");
                        }
                        else {
                            $("#lblShareEmail").text(data.message);
                            $("#lblShareEmail").show();
                            $("#lblShareEmail").addClass("text-danger");
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

}

function BindCredit(userId, localCredit) {

    if (localCredit != undefined) {
        if (localCredit.Total != undefined && localCredit.Total != "")
            $("#lblTotalCredit").text(localCredit.Total);
        if (localCredit.Available != undefined && localCredit.Available != "")
            $("#lblAvailableCredit").text(localCredit.Available);
    }


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
                        $("#lblAvailableCredit").text(data.data.availableCredit);
                        $("#lblTotalCredit").text(data.data.totalCredit);

                        var locaCredit = {
                            Total: data.data.totalCredit,
                            Available: data.data.availableCredit
                        };
                        chrome.storage.local.set({ 'UserLocalCredit': locaCredit });
                    }
                    else {
                        $("#lblAvailableCredit").text("0");
                        $("#lblTotalCredit").text("0");
                    }

                    // Dashbaord lock feature
                    if (location.href != undefined && location.href.indexOf("dashBoard.html") > 0) {
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
            }
        },
        error: function (data) {
        },
        complete: function () {
            $('#lemoin-overlay').hide();
        }
    });
}

function DeductAccountCredit(UserId, Credit) {

    $.ajax({
        type: "POST",
        url: baseURL + "Credit/DeductAccountCredit",
        dataType: "json",
        crossDomain: true,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            "UserId": UserId,
            "Credit": Credit
        }),
        success: function (data) {

            if (data != null && data != undefined) {
                if (data.status) {
                    console.log(data);
                    chrome.storage.local.get(['UserLocalCredit'], function (result) {
                        BindCredit(UserId, result.UserLocalCredit);
                    });
                }
            }
        },
        error: function (data) {
        }
    });
}