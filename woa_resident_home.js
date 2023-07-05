
document.getElementById("overlay").addEventListener("click", function () { document.getElementById("overlay").style.display = "none"; }, false);
var profileData = document.getElementById("profile_data").getElementsByClassName("card-body");
var woaFrame = document.getElementById("MyFrame");

var page_link = window.setInterval(function () {
    var loginStatus = document.getElementById("HeaderPublishAuthLogout");
    if (loginStatus !== null) {
        window.clearInterval(page_link);
        loginStatus.href = "https://ourwoodbridge.net/page/28118~1094081/logging-out"
    };
}, 50)

var mobile_link = window.setInterval(function () {
    var m_loginStatus = document.getElementById("head-mobile").getElementsByClassName("mobile-menu-word-link");
    if (m_loginStatus !== null && m_loginStatus.length == 2) {
        window.clearInterval(mobile_link);
        m_loginStatus[1].href = "https://ourwoodbridge.net/page/28118~1094081/logging-out"
    };

}, 50)

// =================== Display news articles uploaded to the Resource Center: ==================
var recentNewswait = window.setInterval(function () {
    let recentNewsText = woaFrame.contentWindow.document.getElementById("panel_news_content");
    if (recentNewsText !== null) {
        window.clearInterval(recentNewswait);
        let recentNewsUL = document.createElement('ul');
        recentNewsUL.setAttribute('style', 'padding: 0; margin: 0;');
        for (let p = 0; p < recentNewsText.length; p++) {
            let contentURL = recentNewsText.getElementsByClassName("news")[p].getElementsByTagName("a")[0].href
            let contentText = recentNewsText.getElementsByClassName("news")[p].getElementsByTagName("a")[0].getAttribute("data-tooltip-text")
            let contentTitle = recentNewsText.getElementsByClassName("news")[p].getElementsByTagName("a")[0].getAttribute("data-tooltip-title")
            let contentLI = document.createElement('li');
            contentLI.innerHTML = "<p><b>" + contentTitle + "</b><br />" + contentText + "<a href=" + contentURL + ">&nbsp;<i>Read More</i></a></p>";
            contentLI.setAttribute('style', 'display: block;');
            recentNewsUL.appendChild(contentLI);

        } profileData[0].appendChild(recentNewsUL);
    }
}, 50)

//=================  Display last three emails sent from Messenger================================
var recentEmailswait = window.setInterval(function () {
    let recentEmailsText = woaFrame.contentWindow.document.getElementById("panel_messages_content");
    if (recentEmailsText !== null) {
        window.clearInterval(recentEmailswait);
        let recentEmailsUL = document.createElement('ul');
        recentEmailsUL.setAttribute('style', 'padding: 0; margin: 0;');
        for (let p = 0; p < recentEmailsText.length; p++) {
            let contentLI = document.createElement('li');
            let contentURL = recentEmailsText.getElementsByClassName("message")[p].getElementsByTagName("a")[0].getAttribute("onclick");
            let contentText = recentEmailsText.getElementsByClassName("message")[p].getElementsByTagName("a")[0].getAttribute("data-tooltip-title").split("by");
            let contentBody = recentEmailsText.getElementsByClassName("message")[p].getElementsByTagName("a")[0].getAttribute("data-tooltip-text")
            contentLI.innerHTML = "<p><b>" + contentText[0] + "</b><br />" + contentBody + "<a onclick=" + contentURL + " href='#'>&nbsp;<i>Read More</i></a></p>";
            contentLI.setAttribute('style', 'display: block; padding:bottom:10px;');
            recentEmailsUL.appendChild(contentLI);
        } profileData[1].appendChild(recentEmailsUL);
       
    }
}, 50)

woaFrame.onload = function () {
    var woaPage = woaFrame.contentWindow.document
    var profileTitle = document.getElementsByClassName("clsHeader")[0]

    if (profileTitle.getElementsByTagName("a").length > 0) {
        profileTitle.getElementsByTagName("a")[0].innerText = woaPage.getElementsByClassName("clsHeader")[0].innerText
    } else { profileTitle.innerText = woaPage.getElementsByClassName("clsHeader")[0].innerText }




    //=================  Display lastest classifieds================================
    let recentsellsText = woaPage.getElementById("panel_classifieds_content").getElementsByClassName("classified")
    let recentsellsUL = document.createElement('ul');
    recentsellsUL.setAttribute('style', 'padding: 0; margin: 0;');
    for (let p = 0; p < recentsellsText.length; p++) {
        let contentURL = recentsellsText[p].getElementsByTagName("a")[0].href
        let contentText = recentsellsText[p].getElementsByTagName("a")[0].innerText;
        let contentTitle = recentsellsText[p].getElementsByTagName("a")[0].getAttribute("data-tooltip-text");
        let contentLI = document.createElement('li');
        contentLI.innerHTML = "<p><a href=" + contentURL + ">" + contentText + "</a><br />" + contentTitle + "</p>";
        contentLI.setAttribute('style', 'display: block;');
        recentsellsUL.appendChild(contentLI);
    }
    profileData[2].appendChild(recentsellsUL);
    // =================== Display last three documents uploaded to the Resource Center: ======
    let recentDocsText = woaPage.getElementById("panel_resource_content").getElementsByClassName("document")
    let recentDocsUL = document.createElement('ul');
    recentDocsUL.setAttribute('style', 'padding: 0; margin: 0;');
    for (let p = 0; p < recentDocsText.length; p++) {
        let flds = recentDocsText[p].getElementsByTagName("a")[0].getAttribute("data-tooltip-title")
        if (flds.indexOf("Board Room") == 0 || flds.indexOf("Flyers (Events or Activities)") == 0 || flds.indexOf("Listening Post") == 0) {
            let contentURL = recentDocsText[p].getElementsByTagName("a")[0].getAttribute("data-item-viewurl");
            let contentText = recentDocsText[p].getElementsByTagName("a")[0].innerText;
            let contentLI = document.createElement('li');
            contentLI.innerHTML = "<a href='" + contentURL + "'>" + contentText + "</a>";
            contentLI.setAttribute('style', 'display: block;');
            recentDocsUL.appendChild(contentLI);
        }
    }
    profileData[4].appendChild(recentDocsUL);
    //=================  Display last three calendar events================================
    let recentEventsText = woaPage.getElementById("panel_cal_content").getElementsByClassName("event")
    let recentEventsUL = document.createElement('ul');
    recentEventsUL.setAttribute('style', 'padding: 0; margin: 0;');
    for (let p = 0; p < recentEventsText.length; p++) {
        let contentURL = recentEventsText[p].getElementsByTagName("a")[0].href
        let contentText = recentEventsText[p].getElementsByTagName("a")[0].innerText;
        let contentLI = document.createElement('li');
        contentLI.innerHTML = "<a href=" + contentURL + ">" + contentText + "</a>";
        contentLI.setAttribute('style', 'display: block;');
        recentEventsUL.appendChild(contentLI);
    }
    profileData[5].appendChild(recentEventsUL);
    //=================  Display lastest discussion================================
    let recentgroupsName = woaPage.getElementById("panel_discuss_content").getElementsByClassName("discussion")
    let recentgroupsUL = document.createElement('ul');
    recentgroupsUL.setAttribute('style', 'padding: 0; margin: 0;');

    if (recentgroupsName[0].innerText == "a. General") {
        let recentgroupsText = woaPage.getElementById("panel_discuss_content").getElementsByClassName("post")
        for (let p = 0; p < recentgroupsText.length; p++) {
            let contentURL = recentgroupsText[p].getElementsByTagName("a")[0].href
            let contentText = recentgroupsText[p].getElementsByTagName("a")[0].innerText;
            let contentLI = document.createElement('li');
            contentLI.innerHTML = "<a href=" + contentURL + ">" + contentText + "</a>";
            contentLI.setAttribute('style', 'display: block;');
            recentgroupsUL.appendChild(contentLI);
        }
    } else {
        let contentLI = document.createElement('li');
        contentLI.setAttribute('style', 'display: block; white-space:normal');
        contentLI.innerText = "Posts from the Woodbridge General group will appear here when available.";
        recentgroupsUL.appendChild(contentLI);
    }
    profileData[6].appendChild(recentgroupsUL);

    var inter = window.setInterval(function () {
        var p_info_div = woaPage.getElementById("panel_acct_tabs__panel_acct_profile")
        var p_info = woaPage.getElementById("panel_acct_profile_ajax")
        if (p_info_div !== null) { p_info_div.className = "x-tab-strip-active" }
        if (p_info !== null && p_info_div !== null && p_info.getElementsByTagName("div").length > 3 && p_info.getElementsByTagName("img").length > 0) {
            window.clearInterval(inter);
            getProfileInfo(p_info);
        }
    }, 100)
    document.getElementById("overlay").style.display = "none";
}
function getProfileInfo(profileElem) {
    let img01div = document.createElement('div');
    let img01 = document.createElement('img');
    img01div.style.float = "left"
    img01.src = profileElem.getElementsByTagName("img")[0].src
    img01.style.width = "110px"
    img01.style.float = "left"
    img01.style.marginRight = "25px"
    img01div.appendChild(img01)

    let profileDiv = document.createElement('div');
    profileDiv.style.float = "left"
    for (let p = 0; p < 3; p++) {
        let divToAdd = document.createElement('div');
        divToAdd.innerText = profileElem.getElementsByTagName("div")[p].innerText;
        profileDiv.appendChild(divToAdd)
    }

    let img02div = document.createElement('div');
    img01div.style.float = "left";

    let img02link = document.createElement('a');
    img02link.href = profileElem.getElementsByTagName("div")[3].getElementsByTagName("a")[0].href;

    let img02 = document.createElement('img');
    img02.src = "https://customnetware.github.io/woa/edit_text.png";
    img02.style.width = "50px";
    img02.style.float = "right";

    img02link.appendChild(img02);
    img02div.appendChild(img02link);

    profileData[3].appendChild(img01div);
    profileData[3].appendChild(profileDiv);
    profileData[3].appendChild(img02div);
}


