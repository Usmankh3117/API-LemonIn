$(document).ready(function () {
    $(".button-click").click(function () {
        const button = $(this);
        clickEventStatus(button, false);
        loading(true);
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
                                window.location = "verifyEmail.html"
                            }
                            else {
                                clickEventStatus(button, true);
                                loading(false);
                                alert(data.message);
                            }
                        }
                    },
                    error: function (data) {
                        clickEventStatus(button, true);
                        loading(false);
                    }
                });
            }
            else {
                clickEventStatus(button, true);
                loading(false);
                alert("Please Enter Valid Email");
            }
            //request("/api/signup", {
            //    method: "POST",
            //    headers: {
            //        "Content-Type": "application/json;charset=utf-8"
            //    },
            //    body: JSON.stringify(data)
            //}).then(res => {
            //    window.location = "verifyEmail.html"
            //}).catch(err => {
            //    clickEventStatus(button, true);
            //    loading(false);
            //    alert(err);
            //})
        } else {
            clickEventStatus(button, true);
            loading(false);
            alert("Please Fill In All Feilds");
        }
        console.log({ data });
    });
});