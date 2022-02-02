var UserId = "";
$(document).ready(function () {

    chrome.storage.local.get('LemonInUser', function (result) {
        if (result != undefined || result.LemonInUser != undefined) {
            UserId = result.LemonInUser.Id;
            $("#txtFullName").val(result.LemonInUser.Name);
            $("#txtEmailAddress").val(result.LemonInUser.Email);
            $("#txtEmailAddress").attr("disabled", true);
        }
    });

    $("#lblNameMessage,#lblEmailMessage,#lblPasswordMessage,#lblConfirmPasswordMessage,#divErrorMessage").hide();
    $("#btnUpdateAccount").click(fn_UpdateAccount);

});

function fn_UpdateAccount() {

    $("#lblNameMessage,#lblEmailMessage,#lblPasswordMessage,#lblConfirmPasswordMessage,#divErrorMessage").hide();
    if (validateInput()) {

        var name = $("#txtFullName").val();
        var password = $("#txtPassword").val();

        $.ajax({
            type: "POST",
            url: baseURL + "account/UpdateDetails",
            dataType: "json",
            crossDomain: true,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "UserId": UserId,
                "FullName": name,
                "Password": password,
            }),
            beforeSend: function () {
                $('#lemoin-overlay').show();
            },
            success: function (data) {
                $("#divErrorMessage").show();
                $("#lblMessage").parent().removeClass("alert-success").removeClass("alert-danger");

                if (data != null && data != undefined) {
                    if (data.status) {

                        $("#lblMessage").parent().addClass("alert-success");
                        $("#lblMessage").html(data.message);
                        $("#txtPassword,#txtConfirmPassword").val('');

                        chrome.storage.local.get('LemonInUser', function (result) {
                            if (result != undefined || result.LemonInUser != undefined) {
                                result.LemonInUser.Name = name;
                                chrome.storage.local.set({ 'LemonInUser': result.LemonInUser });
                            }
                        });
                    }
                    else {
                        $("#lblMessage").parent().addClass("alert-danger");
                        $("#lblMessage").html(data.message);
                    }
                }
                setTimeout(function () {
                    $("#divErrorMessage").hide();
                }, 3000);

            },
            error: function (data) {

            },
            complete: function () {
                $('#lemoin-overlay').hide();
            }
        });

    }
}

function validateInput() {
    var isValid = true;

    var name = $("#txtFullName").val();
    var emailAddress = $("#txtEmailAddress").val();
    var password = $("#txtPassword").val();
    var confimPassword = $("#txtConfirmPassword").val();

    if (name == "" || name.trim() == "") {
        $("#lblNameMessage").text("Full Name field is required.");
        $("#lblNameMessage").show();
        isValid = false;
    }

    if (emailAddress == "" || emailAddress.trim() == "") {
        $("#lblEmailMessage").text("Email Address field is required.");
        $("#lblEmailMessage").show();
        isValid = false;
    }

    if (password != "" && password.trim() != "" && password.length < 6) {
        $("#lblPasswordMessage").text("The Password must be at least 6 characters long, non alphanumeric, one lowercase and one uppercase");
        $("#lblPasswordMessage").show();
        isValid = false;
    }

    if (password != "" && password.trim() != "" && (confimPassword == "" || confimPassword.trim() == "")) {
        $("#lblConfirmPasswordMessage").text("Confirm Password field is required.");
        $("#lblConfirmPasswordMessage").show();
        isValid = false;
    }

    if (password != "" && password.trim() != "" && confimPassword != "" && confimPassword.trim() != "") {
        if (password != confimPassword) {
            $("#lblConfirmPasswordMessage").text("New password and confirm new password should be same.");
            $("#lblConfirmPasswordMessage").show();
            isValid = false;
        }
    }

    return isValid;
}