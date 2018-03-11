/* Statify.js
Lib made to track visitor behavior and get visitor info */

//in ms, 1h = 3600000;
var SESSION_DURATION = 3600000;

function getBrowserName() {
    var browser = undefined;
    if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)
        browser = "Opera";
    else if (typeof InstallTrigger !== 'undefined')
        browser = "Firefox";
    else if ( /*@cc_on!@*/ false || !!document.documentMode)
        browser = "Internet Explorer";
    else if ((/constructor/i.test(window.HTMLElement) || (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))))
        browser = "Safari";
    else if (!!window.StyleMedia)
        browser = "Edge";
    else if (!!window.chrome && !!window.chrome.webstore)
        browser = "Chrome";

    return browser;
}

function getLocalization(ret) {
    var url = "http://ip-api.com/json/?callback=?";
    $.getJSON(url, function (data) {
        ret(data);
    });
}

//Include this only on the homepage
function getReferrer() {
    return document.referrer;
}


// Ne pas enregistrer les doublons
function visitorInfo() {
    let info = {
        "pattern": null,
        "date": null,
        "time": null,
        "query": null,
        "city": null,
        "country": null,
        "browser": null,
        "referrer": null
    };

    info.pattern = 'visitor_info';
    info.browser = getBrowserName();
    info.referrer = getReferrer();

    getLocalization(function (data) {
        info.query = data.query;
        info.country = data.country;
        info.city = data.city;

        console.log(info.browser + " " + info.query + " " + info.country + " " + info.city + " " + info.referrer);

        $.ajax({
            type: 'POST',
            url: 'http://192.168.0.23:3000',
            data: JSON.stringify(info),
            contentType: 'application/json; charset=utf-8',
            success: function () {
                console.log('POST request succesfully send');
            },
        });
    });
}

// Get click event page coordinates and the element
function clickOnLinkCount() {

    var elem = {
        "x_coord": null,
        "y_coord": null,
        "elem_type": 'webpage',
    };

    window.onclick = function (e) {
        elem.x_coord = e.pageX;
        elem.y_coord = e.pageY;

        if (e.target.localName == 'a' || e.target.localName == 'button') {
            elem.elem_type = e.target.localName;
        } else {
            elem.elem_type = 'webpage';
        }
        console.log("Click detected on " + elem.elem_type + " on [" + elem.x_coord + ':' + elem.y_coord + ']');
    }
}

//Check if user ever been here, then manage visiting time related cookies
function getVisitingTime() {

    // In ms/1970
    var current_locale_time = new Date().getTime();

    // If cookie doesn't exist
    if (!(getCookieValue('statify_last_visit'))) {
        console.log('premiere visite !!');
        createCookie('statify_last_visit', current_locale_time, 10);
        createCookie('statify_visiting_time', 0, 10);
    } else {
        // Time elapsed from last interaction in minutes
        var time_elapsed = ((new Date).getTime() - getCookieValue('statify_last_visit'));
        console.log("Temps écoulé depuis derniere interaction :" + Math.floor(time_elapsed / 60000) + ' minutes.');
        console.log("Temps max entre deux visites " + SESSION_DURATION / 60000 + " min");

        // If session is still active
        if (time_elapsed < SESSION_DURATION) {

            // Update cookies
            let tmp = Number(getCookieValue('statify_visiting_time')) + time_elapsed;

            createCookie('statify_visiting_time', tmp, 10);
            createCookie('statify_last_visit', current_locale_time, 10);

            console.log("La session est active depuis :" + Math.ceil(getCookieValue('statify_visiting_time') / 60000) + ' minutes.');

        } else {
            // Transfert visit time (in min) to the server, renew cookies

            let session_time = getCookieValue('statify_visiting_time') / 60000;
            console.log('La session a expiré. Temps total de la session :' + session_time + ' minutes.');

            $.ajax({
                type: 'POST',
                url: 'http://192.168.0.23:3000',
                data: JSON.stringify(session_time),
                contentType: 'application/json; charset=utf-8',
                success: function () {
                    console.log('POST request succesfully send');
                },
            });

            createCookie('statify_last_visit', current_locale_time, 10);
            createCookie('statify_visiting_time', 0, 10);
        }
    }

}

function createCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// 
function getCookieValue(a) {
    var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
