const woaContact = {
    completeFNs: 0,
    profileID: /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(","),
    isLocal: (window.location.hostname == "localhost") ? ".html" : "",
    addCard: (hdrId, bdyId, crdIcon, crdText, useCollapse, fnName) => {
        let rowDiv = document.createElement("div")
        let colDiv = document.createElement("div")
        let crdDiv = document.createElement("div")
        let hdrDiv = document.createElement("div")
        let bdyDiv = document.createElement("div")

        if (hdrId === "profileHeader") {
            for (let a = 1; a <= 5; a++) {
                let headerLinks = document.createElement("a")
                hdrDiv.appendChild(headerLinks)
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
        document.getElementById("customContainer").appendChild(rowDiv)

        if (fnName !== "") { fnName() }

    },
    getProfile: () => {
        let hmPg = (window.location.hostname == "localhost") ? "woa_dashboard.html" :"/page/28118~1101528"
        let classArray = ["fa fa-building-o fa-lg", "", "fa fa-home fa-fw fa-lg", "fa fa-question-circle fa-fw fa-lg", "fa fa-envelope fa-fw fa-lg"]
        let hrefArray = ["", "https://portal.sc-manage.com/Home_v2/Login", hmPg, "/form/28118~327323/social-media-help", "/form/28118~116540/ask-a-manager"]
        let textArray = ["", "Silvercreek Association Management", "", "", ""]


        for (let a = 0; a <= 4; a++) {
            let headerLinks = document.getElementById("profileHeader").getElementsByTagName("a")
            headerLinks[a].innerHTML = textArray[a]
            headerLinks[a].href = hrefArray[a]
            headerLinks[a].className = classArray[a]
        }

        $.get("/news/28118~799909" + woaContact.isLocal, function () { })
            .done(function (responseText) {
                let portalContent = new DOMParser().parseFromString(responseText, "text/html")
                document.getElementById("profileBody").innerHTML = portalContent.getElementById("contentInner").children[2].innerHTML


            })
    },
    getContacts: () => {
        let contactArray = ["10544936", "10551971", "10863452", "8108389", "10566484", "10854040"]

        for (let p = 0; p < contactArray.length; p++) {
            let contactDiv = document.createElement("div")
            let nameDiv = document.createElement("div")
            let jobDiv = document.createElement("div")
            let phoneDiv = document.createElement("div")
            let emailDiv = document.createElement("div")
            contactDiv.appendChild(nameDiv)
            contactDiv.appendChild(jobDiv)
            contactDiv.appendChild(phoneDiv)
            contactDiv.appendChild(emailDiv)
            $.get("/Member/28118~" + contactArray[p] + woaContact.isLocal, function () { })
                .done(function (responseText) {
                    let contactCard = new DOMParser().parseFromString(responseText, "text/html")
                    let contactName = contactCard.getElementsByClassName("clsDMHeader")
                    let contactTitle = contactCard.getElementsByClassName("clsHeader")
                    let contactData = contactCard.getElementsByClassName("contactComms")


                    if (contactName.length > 1) {
                        let contactLink = document.createElement("a")
                        contactLink.href = "/Member/28118~" + contactArray[p] + woaContact.isLocal
                        contactLink.innerHTML = contactName[1].children[0].innerText.trim()
                        nameDiv.appendChild(contactLink)
                    }
                    if (contactTitle.length > 0) {
                        let contactLink = document.createElement("a")
                        contactLink.href = "/Member/28118~" + contactArray[p] + woaContact.isLocal
                        contactLink.innerHTML = contactTitle[0].innerText.trim()
                        jobDiv.appendChild(contactLink)
                    }
                    if (contactData.length > 0) {
                        let selectedData = contactData[0].getElementsByClassName("contactLabel")
                        if (selectedData.length > 0) {
                            for (let p = 0; p < selectedData.length; p++) {
                                //if (selectedData[p].innerText == "Email" && selectedData[p].nextElementSibling.childElementCount == 2) {
                                //    emailDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.children[0].innerText))
                                //}
                                if (selectedData[p].innerText == "Work") {
                                    phoneDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.innerText.trim()))
                                }
                                if (selectedData[p].innerText == "Other") {
                                    phoneDiv.appendChild(document.createTextNode(selectedData[p].nextElementSibling.innerText.trim()))
                                }
                            }
                        }
                    }
                    document.getElementById("contactBody").appendChild(contactDiv)
  
                })

        }

    },
    showThePage: () => {
        let getPageFromCache = false
        let pageArea = document.getElementsByClassName("clsBodyText")[0]
        while (pageArea.firstChild) { pageArea.removeChild(pageArea.firstChild) }

        if (typeof (window.performance.getEntriesByType) != "undefined") {
            try {
                let pageStatus = window.performance.getEntriesByType("navigation")[0].type
                if (pageStatus == "navigate" || pageStatus == "reload" || localStorage.getItem("woaCache") === null) {
                    getPageFromCache = false
                } else {
                    getPageFromCache = true
                }
            } catch { getPageFromCache = false }
        } else { getPageFromCache = false }
        let appContainer = document.createElement("div"); appContainer.id = "customContainer", appContainer.className = "container"
        pageArea.appendChild(appContainer)
        woaContact.addCard("profileHeader", "profileBody", "fa fa-building-o fa-lg", "Silvercreek Association Management", false, woaContact.getProfile)
        woaContact.addCard("contactHeader", "contactBody", "fa fa-address-card-o fa-lg", "Clubhouse Office Contacts", false, woaContact.getContacts)
    },
}
woaContact.showThePage()