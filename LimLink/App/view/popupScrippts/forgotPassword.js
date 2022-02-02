$(document).ready(function () {
    $(".button-click").click(function () {
        const button = $(this);
        clickEventStatus(button, false);
        //loading(true);
        loadingNewButton(true, "SUBMIT");
        const data = extractInputInfo($(".input-feild"));
        if (!isCheckForEmpty(data)) {

            if (IsEmail(data.Email)) {
                $.ajax({
                    type: "POST",
                    url: baseURL + "account/ForgotPassword",
                    dataType: "json",
                    crossDomain: true,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify({
                        "Email": data.Email
                    }),
                    success: function (data) {

                        if (data != null && data != undefined) {
                            if (data.status) {
                                window.location = "../poppupPages/resetLink.html";
                            }
                            else {
                                clickEventStatus(button, true);
                                //loading(false);
                                loadingNewButton(false, "SUBMIT");
                                alert(data.message);
                            }
                        }
                    },
                    error: function (data) {
                        clickEventStatus(button, true);
                        /*loading(false);*/
                        loadingNewButton(false, "SUBMIT");
                    }
                });
            }
            else {
                clickEventStatus(button, true);
                /*loading(false);*/
                loadingNewButton(false, "SUBMIT");
                alert("Please Enter Valid Email");
            }
        } else {
            clickEventStatus(button, true);
            /*loading(false);*/
            loadingNewButton(false, "SUBMIT");
            alert("Please Fill In All Feilds");
        }
    });
});