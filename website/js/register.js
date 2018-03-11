function isValidLogin() {
    var no_pass = false;
    var invalid_symbol = false;
    if ($('#Pseudo').val() == undefined || $('#Password').val() == undefined) {
        no_pass = true;
    }
}

function formValidation() {
    // All verification process
    // If a field is empty
    var isEmpty = true;
    // If a field doesn't not match with what I expect
    var isBreakingRules = true;
    // It is for username and email
    var isAlreadyTaken = false;
    //If user accepted rules
    var isChecked = $("input[name='website-accept-rule']").is(':checked');


    //Sub case
    var isBadEmail = true;
    var isBadPassword = true;
    //Store all the user' account informations
    var username = $("input[name='account-name']").val();
    var email = $("input[name='email-address']").val();
    var website_name = $("input[name='website-name']").val();
    var website_url = $("input[name='website-url']").val();
    var password = $("input[name='password']").val();
    var password_conf = $("input[name='password-again']").val();

    //Empty field step
    if (username && email && website_name && website_url && password && password_conf)
        isEmpty = false;

    //Breaking rules step
    if (password == password_conf && password.length >= 8)
        isBadPassword = false;
    if (emailValidation(email))
        isBadEmail = false;
    if (!isBadPassword && !isBadEmail)
        isBreakingRules = false;


    console.log('isEmpty: ' + isEmpty + ' isBreakingRules: ' + isBreakingRules + ' isAlreadyTaken: ' + isAlreadyTaken + ' isChecked: ' + isChecked + ' isBadEmail: ' + isBadEmail + ' isBadPassword: ' + isBadPassword);

    if (!isEmpty && !isBreakingRules && !isAlreadyTaken && isChecked) {
        //Send data to server here
        var account_info = {
            pattern: "account_registration",
            account_name: username,
            email_address: email,
            website_name: website_name,
            website_url: website_url,
            password: password
        }
        console.log(account_info);
        $.ajax({
            type: 'POST',
            url: 'http://192.168.0.23:3000',
            data: JSON.stringify(account_info),
            contentType: 'application/json; charset=utf-8',
            success: function () {
                console.log('POST request succesfully send');
            },
        });

        $('#error-container').css('display', 'none');
        $('#input-wrapper').css('margin-top', '0vh');
        $('#website-name-input-text').css('color', 'black');
        $('#password-input-text').css('color', 'black');
        $('#password-validation-input-text').css('color', 'black');

    } else {

        if (isEmpty)
            $('#error-text').text('Some required fields are empty.');
        else if (!isChecked)
            $('#error-text').text('You must accept our condition to use our service.');
        else if (isBreakingRules) {
            if (isBadPassword) {
                $('#error-text').text('Password problem.');
                $('#password-input-text').css('color', 'darkred');
                $('#password-validation-input-text').css('color', 'darkred');
            } else if (isBadEmail) {
                $('#error-text').text('Email problem.');
                $('#email-input-text').css('color', 'darkred');
            } else
                $('#error-text').text('Some fields are not completed correctly.');
        }
        $('#error-container').css('display', 'inline');
        $('#input-wrapper').css('margin-top', '15vh');
    }
}

function emailValidation(mail) {
    if (mail.length >= 3) {
        var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
        return regexp.test(mail);
    }
    return false;
}

function passwordValidation(password) {
    var regexp = "^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$";
    return regexp.test(password);
}
