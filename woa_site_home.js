
var w_redirect = document.getElementById("woa_redirect");
if (w_redirect !== null) { w_redirect.value = "https://ourwoodbridge.net/page/28118~1077903/welcome"; };

var signinStatus = document.getElementById("HeaderPublishGuestSignIn");
if (signinStatus !== null) {
    signinStatus.href = "https://ourwoodbridge.net/page/28118~1093962/welcome-to-woodbridge"
    signinStatus.style.display = "none";
};

var loginStatus = document.getElementById("HeaderPublishAuthLogout");
if (loginStatus !== null) {
    loginStatus.href = "https://ourwoodbridge.net/page/28118~1094081/logging-out"
    var profileTitle = document.getElementById("login_header");
    if (profileTitle !== null) {
        if (loginStatus.innerText = "Sign Out") {
            profileTitle.innerText = "Your Status: Logged In";
            document.getElementById("login_div").style.display = "none";
            document.getElementById("login_notice").style.display = "none";
            document.getElementById("loggedinDiv").style.display = "block";
        }
    }
}

var m_loginStatus = document.getElementById("head-mobile").getElementsByClassName("mobile-menu-word-link");
if (m_loginStatus !== null) {
    if (m_loginStatus.length == 2) { m_loginStatus[1].href = "https://ourwoodbridge.net/page/28118~1094081/logging-out" }
    if (m_loginStatus.length == 1) {
        m_loginStatus[0].href = "https://ourwoodbridge.net/page/28118~1093962/welcome-to-woodbridge"
        m_loginStatus[0].style.display = "none";
    }
}
