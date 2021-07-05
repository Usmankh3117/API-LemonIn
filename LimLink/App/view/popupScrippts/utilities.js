//const baseURL = "http://18.118.173.214";
// const baseURL = "http://localhost:8080";
const baseURL = "https://localhost:44347/api/";

function loading(start) {
    if (start) {
        $(".button-text span").addClass("d-none");
        $(".button-text").append(`<div class="loader"></div>`);
    } else {
        $(".button-text span").removeClass("d-none");
        $(".button-text .loader").remove();
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
    var clientId = '396986901552505';
    var clientSecret = '04ef65d51bcd9e455e4607f08ad7a89a';
    var redirectUri = chrome.identity.getRedirectURL("extenson-name");

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
                            userInfo.email = response.email;
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
        const CLIENT_ID = encodeURIComponent('110556227270-vcu0r1fn2h8h9g5dupb2eut0qpmn5kvn.apps.googleusercontent.com');
        const RESPONSE_TYPE = encodeURIComponent('id_token');
        const REDIRECT_URI = encodeURIComponent(chrome.identity.getRedirectURL("extenson-name"))
        const SCOPE = encodeURIComponent('openid email');
        const STATE = encodeURIComponent('meet' + Math.random().toString(36).substring(2, 15));
        const PROMPT = encodeURIComponent('consent');

        function create_auth_endpoint() {
            let nonce = encodeURIComponent(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));

            let openId_endpoint_url =
                `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&state=${STATE}&nonce=${nonce}&prompt=${PROMPT}`;
            return openId_endpoint_url;
        }

        chrome.identity.launchWebAuthFlow({
            'url': create_auth_endpoint(),
            'interactive': true
        }, function (redirect_url) {
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
    $(document).on("click", ".login-with-google", function () {
        const text = $(".google-text");
        text.find(".main-text").addClass("d-none");
        text.find(".wait-text").removeClass("d-none");
        logInWithGoogle().then(data => {
            startLocalLoginFlow(data.email.split("@")[0], data.email, data.email + 'LEMonIn');
        }).catch(err => {
            alert(err);
            buttonLoading(button, false);
        });
    });


    $(document).on("click", ".login-with-facebook", function () {
        const text = $(".facebook-text");
        text.find(".main-text").addClass("d-none");
        text.find(".wait-text").removeClass("d-none");
        logInWithFB().then(data => {
            startLocalLoginFlow(data.name, data.email, data.password + 'LEMonIn');
        }).catch(err => {
            alert(err);
            buttonLoading(button, false);
        });
    });
});


function startLocalLoginFlow(FullName, Email, Password) {
    $.ajax({
        type: "POST",
        url: baseURL + "/api/signup",
        dataType: "json",
        crossDomain: true,
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({
            "name": FullName,
            "email": Email,
            "password": Password,
            "sociallyVerifiedEmail": true
        }),
        beforeSend: function () {
            //
        },
        complete: function (data) {
            console.log("signup", data);
            $.ajax({
                type: "POST",
                url: baseURL + "/api/signin",
                dataType: "json",
                crossDomain: true,
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    "email": Email,
                    "password": Password,
                }),
                beforeSend: function () {
                    //
                },
                complete: function () {
                    //
                },
                success: function (data) {
                    console.log("signin", data);
                    // localStorage.setItem("active", "true");
                    // chrome.browserAction.setPopup({ popup: "../view/poppupPages/started.html" });
                    // window.location = "../poppupPages/dashBoard.html";
                },
                error: function (data) {
                }
            });
        },
        success: function (data) {

        },
        error: function (data) {
            //
        }
    });
}