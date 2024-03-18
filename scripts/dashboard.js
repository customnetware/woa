
let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
let contactArray = ["10544936", "10551971", "10863452", "8108389", "10566484", "10854040"]
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
    if (hdrId == "contactHeader") {

        appContainer.appendChild(rowDiv)
    } else {
        appContainer.appendChild(rowDiv)
    }

}
function getContentFromPortal(profilePage, profileHeader, profileBody, profileText, profileIcon, eventsID) {
    addCard(profileHeader, profileBody)
    let cardHeader = document.getElementById(profileHeader)
    let cardBody = document.getElementById(profileBody)

    let cardIcon = document.createElement("span")
    let cardText = document.createElement("span")

    cardIcon.className = profileIcon
    cardText.innerText = profileText

    cardHeader.className = "card-header collapsed"
    cardHeader.setAttribute("data-toggle", "collapse")
    cardHeader.setAttribute("data-target", "#" + cardBody.id)
    cardHeader.setAttribute("aria-expanded", "false")
    cardBody.className = "card-body collapse"
    cardBody.setAttribute("data-parent", "#customContainer")

    cardHeader.appendChild(cardIcon)
    cardHeader.appendChild(cardText)
    if (profilePage !== "") {
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
                img.src = "https://ourwoodbridge.net/" + portalLinks[p].getAttribute("data-tooltip-text").split("|")[0]
                cardBody.appendChild(img)
            }
        }
    } else { getContacts() }
}
function getContacts() {
    let contactArray = ["10544936", "10551971", "10863452", "8108389", "10566484", "10854040"]
    for (let p = 0; p < contactArray.length; p++) {
        $.get(pageLocation("/Member/28118~" + contactArray[p]), function () { })
            .done(function (responseText) {
                let contactCard1 = new DOMParser().parseFromString(responseText, "text/html")
                let contactName = contactCard1.getElementsByClassName("clsDMHeader")
                let contactTitle = contactCard1.getElementsByClassName("clsHeader")
                let contactData = contactCard1.getElementsByClassName("contactComms")
                let contactDiv = document.createElement("div")

                if (contactName.length > 1) {
                    let contactLink = document.createElement("a")
                    contactLink.href = pageLocation("/Member/28118~" + contactArray[p])
                    contactLink.innerHTML = contactName[1].children[p].innerText.trim()
                    contactDiv.appendChild(contactLink)
                }
                if (contactTitle.length > 0) {
                    let contactLink = document.createElement("a")
                    contactLink.href = pageLocation("/Member/28118~" + contactArray[0])
                    contactLink.innerHTML = contactTitle[0].innerText.trim()
                    contactDiv.appendChild(contactLink)
                }
                if (contactData.length > 0) {
                    let selectedData = contactData[0].getElementsByClassName("contactLabel")
                    if (selectedData.length > 0) {
                        for (let p = 0; p < selectedData.length; p++) {
                            if (selectedData[p].innerText == "Email" && selectedData[p].nextElementSibling.childElementCount == 2) {
                                contactDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.children[0].innerText))
                            }
                            if (selectedData[p].innerText == "Work") {
                                contactDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.innerText.trim()))
                            }
                            if (selectedData[p].innerText == "Other") {
                                contactDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.innerText.trim()))
                            }
                        }
                    }
                }
                document.getElementById("contactBody").appendChild(contactDiv)
            })

    }
}

addCard("profileHeader", "userProfile")
let profileImage = document.createElement("img")
document.getElementById("userProfile").appendChild(profileImage)
let classArray = ["", "fa fa-check-circle fa-lg", "", "fa fa-question-circle fa-fw fa-lg", "fa fa-comment fa-fw fa-lg", "fa fa-envelope fa-fw fa-lg"]
for (let a = 1; a <= 5; a++) {
    let pLink = document.createElement("a")
    pLink.className = classArray[a]
    document.getElementById("profileHeader").appendChild(pLink)
}
let imageFile = $.get(pageLocation("/Member/28118~" + profileID[0]), function () { })
let textFile = $.get(pageLocation("/news/28118~792554"), function () { })
$.when(imageFile, textFile).done(function (responseIMG, responseTXT) {
    let imageFile = new DOMParser().parseFromString(responseIMG, "text/html")
    let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
    let userText = document.createElement("span")
    profileImage.src = imageFile.getElementsByTagName("img")[0].src
    userText.innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
    document.getElementById("userProfile").appendChild(userText)
})

$.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
    .done(function (responseText) {
        let portalContent = new DOMParser().parseFromString(responseText, "text/html")
        document.getElementById("profileHeader").getElementsByTagName("a")[1].innerHTML = portalContent.getElementsByClassName("clsHeader")[0].innerHTML
        getContentFromPortal(portalContent, "emailHeader", "emailBody", "Recent Emails", "fa fa-envelope fa-lg", "panel_messages_content")
        getContentFromPortal(portalContent, "newsHeader", "newsBody", "News Articles", "fa fa-newspaper-o fa-lg", "panel_news_content")
        getContentFromPortal(portalContent, "forSaleHeader", "forSaleBody", "For Sale or Free", "fa fa-shopping-cart fa-lg", "panel_classifieds_content")
        getContentFromPortal(portalContent, "photoHeader", "photoBody", "Event Photos", "fa fa-picture-o fa-lg", "panel_gallery_content")
        getContentFromPortal("", "contactHeader", "contactBody", "Clubhouse Office Contacts", "fa fa-picture-o fa-lg", "getContacts")
    })




