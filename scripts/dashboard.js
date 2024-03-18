
let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
let appContainer = document.createElement("div")
appContainer.id = "customContainer", appContainer.className = "container"
document.getElementsByClassName("clsBodyText")[0].appendChild(appContainer)
function pageLocation(URLString) {
    return (window.location.hostname == "localhost") ? URLString + ".html" : URLString
}
function addCard(hdrId, bdyId, crdIcon, crdText, useCollapse, fnName) {
    let rowDiv = document.createElement("div")
    let colDiv = document.createElement("div")
    let crdDiv = document.createElement("div")
    let hdrDiv = document.createElement("div")
    let bdyDiv = document.createElement("div")

    if (hdrId === "profileHeader") {
        let classArray = ["", "fa fa-check-circle fa-lg", "", "fa fa-question-circle fa-fw fa-lg", "fa fa-comment fa-fw fa-lg", "fa fa-envelope fa-fw fa-lg"]
        for (let a = 1; a <= 5; a++) {
            let pLink = document.createElement("a")
            pLink.className = classArray[a]
            hdrDiv.appendChild(pLink)
        }
    } else {
        let cardIcon = document.createElement("span")
        let cardText = document.createElement("span")
        cardIcon.className = crdIcon
        cardText.innerText = crdText
        hdrDiv.appendChild(cardIcon)
        hdrDiv.appendChild(cardText)
    }
    crdDiv.appendChild(hdrDiv)
    crdDiv.appendChild(bdyDiv)
    colDiv.appendChild(crdDiv)
    rowDiv.appendChild(colDiv)
    rowDiv.className = "row"
    colDiv.className = "col-md-12"
    crdDiv.className = "card mb-1"
    hdrDiv.className = "card-header"
    bdyDiv.className = "card-body"
    hdrDiv.id = hdrId, bdyDiv.id = bdyId
    if (useCollapse == true) {
        hdrDiv.classList.add("collapsed")
        hdrDiv.setAttribute("data-toggle", "collapse")
        hdrDiv.setAttribute("data-target", "#" + bdyDiv.id)
        hdrDiv.setAttribute("aria-expanded", "false")
        bdyDiv.classList.add("collapse")
        bdyDiv.setAttribute("data-parent", "#customContainer")
    }
    appContainer.appendChild(rowDiv)
    if (fnName !== "") { fnName() }
}
function getProfile() {
    let profileImage = document.createElement("img")
    let imageFile = $.get(pageLocation("/Member/28118~" + profileID[0]), function () { })
    let textFile = $.get(pageLocation("/news/28118~792554"), function () { })
    $.when(imageFile, textFile).done(function (responseIMG, responseTXT) {
        let imageFile = new DOMParser().parseFromString(responseIMG, "text/html")
        let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
        let userText = document.createElement("span")
        profileImage.src = imageFile.getElementsByTagName("img")[0].src
        userText.innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
        document.getElementById("profileBody").appendChild(profileImage)
        document.getElementById("profileBody").appendChild(userText)
    })
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
                    contactLink.innerHTML = contactName[1].children[0].innerText.trim()
                    contactDiv.appendChild(contactLink)
                }
                if (contactTitle.length > 0) {
                    let contactLink = document.createElement("a")
                    contactLink.href = pageLocation("/Member/28118~" + contactArray[p])
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
function getContentFromPortal(portalDocument) {
    let portalIds = ["messages", "news", "classifieds", "gallery"]
    let contentIds = ["emailBody", "newsBody", "forSaleBody", "photoBody"]
    for (let i = 0; i < portalIds.length; i++) {
        let portalLinks = portalDocument.getElementById("panel_" + portalIds[i] + "_content").getElementsByTagName("a")
        if (portalIds[i] !== "gallery") {
            for (let p = 0; p < portalLinks.length; p++) {
                let pageLink = document.createElement("a")
                let pageText = document.createElement("p")
                let pageStamp = document.createElement("span")
                pageLink.href = portalLinks[p].href
                pageLink.innerHTML = portalLinks[p].getAttribute("data-tooltip-title")
                pageText.appendChild(pageLink)
                document.getElementById(contentIds[i]).appendChild(pageText)
            }
        } else {
            for (let p = 0; p < portalLinks.length; p += 2) {
                let img = document.createElement("img")
                img.src = "https://ourwoodbridge.net/" + portalLinks[p].getAttribute("data-tooltip-text").split("|")[0]
                document.getElementById(contentIds[i]).appendChild(img)
            }
        }
    }
}
addCard("profileHeader", "profileBody", "fa fa-check-circle fa-lg", "Welcome", false, getProfile)
addCard("emailHeader", "emailBody", "fa fa-envelope fa-lg", "Recent Emails", true, "")
addCard("newsHeader", "newsBody", "fa fa-newspaper-o fa-lg", "Recent News", true, "")
addCard("forSaleHeader", "forSaleBody", "fa fa-shopping-cart fa-lg", "For Sale or Free", true, "")
addCard("photoHeader", "photoBody", "fa fa-picture-o fa-lg", "Event Photos", true, "")
addCard("contactHeader", "contactBody", "fa fa-address-card-o", "Office Contacts", true, getContacts)

$.get(pageLocation("/homepage/28118/resident-home-page"), function () { })
    .done(function (responseText) {
        let portalContent = new DOMParser().parseFromString(responseText, "text/html")
        document.getElementById("profileHeader").getElementsByTagName("a")[1].innerHTML = portalContent.getElementsByClassName("clsHeader")[0].innerHTML
        getContentFromPortal(portalContent)

    })












