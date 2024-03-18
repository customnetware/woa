
let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
let appContainer = document.createElement("div")
appContainer.id = "customContainer"
appContainer.className = "container"
document.getElementsByClassName("clsBodyText")[0].appendChild(appContainer)
function pageLocation(URLString) {
    return (window.location.hostname == "localhost") ? URLString + ".html" : URLString
}

function addCard(hdrId, bdyId) {
    let rowDiv = document.createElement("div")
    let colDiv = document.createElement("div")
    let crdDiv = document.createElement("div")
    let hdrDiv = document.createElement("div")
    let bdyDiv = document.createElement("div")
    crdDiv.appendChild(hdrDiv)
    crdDiv.appendChild(bdyDiv)
    colDiv.appendChild(crdDiv)
    rowDiv.appendChild(colDiv)
    rowDiv.className = "row", colDiv.className = "col-md-12", crdDiv.className = "card mb-1", hdrDiv.className = "card-header", bdyDiv.className = "card-body"
    hdrDiv.id = hdrId, bdyDiv.id = bdyId
    appContainer.appendChild(rowDiv)
}

addCard("profileHeader", "userProfile")
let waitA = document.createElement("a")
let nameA = document.createElement("a")
let helpA = document.createElement("a")
let postA = document.createElement("a")
let mailA = document.createElement("a")
let profileImage = document.createElement("img")
profileImage.style.height = "100px"
profileImage.style.marginBottom = "20px"
waitA.className = "fa fa-check-circle fa-lg"
nameA.innerHTML = "Welcome Webmaster"
helpA.className = "fa fa-question-circle fa-fw fa-lg"
postA.className = "fa fa-comment fa-fw fa-lg"
mailA.className = "fa fa-envelope fa-fw fa-lg"
document.getElementById("profileHeader").appendChild(waitA)
document.getElementById("profileHeader").appendChild(nameA)
document.getElementById("profileHeader").appendChild(helpA)
document.getElementById("profileHeader").appendChild(postA)
document.getElementById("profileHeader").appendChild(mailA)
document.getElementById("userProfile").appendChild(profileImage)

$.get(pageLocation("/Member/28118~" + profileID[0]), function () { })
    .done(function (responseText) {
        let imageFile = new DOMParser().parseFromString(responseText, "text/html")
        profileImage.src = imageFile.getElementsByTagName("img")[0].src
    })
$.get(pageLocation("/news/28118~792554"), function () { })
    .done(function (responseText) {
        let userContent = new DOMParser().parseFromString(responseText, "text/html")
        let userText = document.createElement("span")
        userText.innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
        document.getElementById("userProfile").appendChild(userText)
    })


$.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
    .done(function (responseText) {
        let portalContent = new DOMParser().parseFromString(responseText, "text/html")
        getContentFromProfile(portalContent, "emailHeader", "emailBody", "Recent Emails", "fa fa-envelope fa-lg", "panel_messages_content")
        getContentFromProfile(portalContent, "newsHeader", "newsBody", "News Articles", "fa fa-newspaper-o fa-lg", "panel_news_content")
        getContentFromProfile(portalContent, "forSaleHeader", "forSaleBody", "For Sale or Free", "fa fa-shopping-cart fa-lg", "panel_classifieds_content")
        getContentFromProfile(portalContent, "photoHeader", "photoBody", "Event Photos", "fa fa-picture-o fa-lg", "panel_gallery_content")
    })

function getContentFromProfile(profilePage, profileHeader, profileBody, profileText, profileIcon, eventsID) {
    addCard(profileHeader, profileBody)
    let cardHeader = document.getElementById(profileHeader)
    let cardBody = document.getElementById(profileBody)
    let newsIcon = document.createElement("span")
    let newsText = document.createElement("span")
    newsText.innerText = profileText
    newsIcon.className = profileIcon
    cardHeader.className = "card-header collapsed"
    cardHeader.setAttribute("data-toggle", "collapse")
    cardHeader.setAttribute("data-target", "#" + cardBody.id)
    cardHeader.setAttribute("aria-expanded", "false")
    cardBody.className = "card-body collapse"
    cardBody.setAttribute("data-parent", "#customContainer")
    cardHeader.appendChild(newsIcon)
    cardHeader.appendChild(newsText)
    let portalLinks = profilePage.getElementById(eventsID).getElementsByTagName("a")
    if (eventsID !== "panel_gallery_content") {
        for (let p = 0; p < portalLinks.length; p++) {
            let pageLink = document.createElement("a")
            let pageText = document.createElement("p")
            let pageStamp = document.createElement("span")
            pageLink.href = portalLinks[p].href
            pageLink.innerHTML = portalLinks[p].getAttribute("data-tooltip-title")
            pageText.appendChild(pageLink)
            cardBody.appendChild(pageText)
        }
    } else {
        for (let p = 0; p < portalLinks.length; p += 2) {
            let img = document.createElement("img")
            img.style.marginRight = "20px"
            img.style.marginTop = "20px"
            img.style.marginTop = "20px"
            img.src = "https://ourwoodbridge.net/" + portalLinks[p].getAttribute("data-tooltip-text").split("|")[0]
            cardBody.appendChild(img)
        }
    }
}



