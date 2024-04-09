const woaContainer = document.createElement("div")
const isLocal = (window.location.hostname == "localhost") ? ".html" : ""
woaContainer.id = "customContainer", woaContainer.className = "container"
document.getElementsByClassName("clsBodyText")[0].appendChild(woaContainer)

const woaContact = {

    addHTML: (start, end) => {

        let divIDs = ["recentFiles", "recentEmails", "recentPosts", "officeContacts"]
        let divTitles = ["Recent Documents", "Recent Association Emails", "Recent Comments", "Clubhouse Office Contacts"]


        let woaHeaderRow = document.createElement("div")
        let woaHeaderGreeting = document.createElement("div")

        let woaHeaderTxt = document.createElement("span")
        let woaHeaderImg = document.createElement("img")

        woaHeaderRow.id = "woaHeaderRow"
        woaHeaderGreeting.className = "notifyHeader"
        woaHeaderGreeting.paddingBottom = "50px"

        woaHeaderRow.appendChild(woaHeaderGreeting)
        if (end < 3) { woaHeaderRow.appendChild(woaHeaderImg) }
        woaHeaderRow.appendChild(woaHeaderTxt)
        woaContainer.appendChild(woaHeaderRow)


        for (let p = start; p <= end; p++) {
            let notificationDiv = document.createElement("div")
            let notificationHdr = document.createElement("span")

            notificationDiv.id = divIDs[p]
            notificationHdr.className = "notifyHeader"
            notificationHdr.innerText = divTitles[p]
            notificationDiv.appendChild(notificationHdr)
            woaContainer.appendChild(notificationDiv)
        }

   

    },
    getContactHdr: () => {
        let textFile = $.get("/news/28118~799909" + isLocal, function () { })
        $.when(textFile).done(function (responseTXT) {
            let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
            document.getElementById("woaHeaderRow").getElementsByTagName("div")[0].innerText = "Silvercreek Association Management"
            document.getElementById("woaHeaderRow").getElementsByTagName("span")[0].innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
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
            $.get("/Member/28118~" + contactArray[p] + isLocal, function () { })
                .done(function (responseText) {
                    let contactCard = new DOMParser().parseFromString(responseText, "text/html")
                    let contactName = contactCard.getElementsByClassName("clsDMHeader")
                    let contactTitle = contactCard.getElementsByClassName("clsHeader")
                    let contactData = contactCard.getElementsByClassName("contactComms")


                    if (contactName.length > 1) {
                        let contactLink = document.createElement("a")
                        contactLink.href = "/Member/28118~" + contactArray[p] + isLocal
                        contactLink.innerHTML = contactName[1].children[0].innerText.trim()
                        nameDiv.appendChild(contactLink)
                    }
                    if (contactTitle.length > 0) {
                        let contactLink = document.createElement("a")
                        contactLink.href = "/Member/28118~" + contactArray[p] + isLocal
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
                                    phoneDiv.appendChild(document.createTextNode(" " + selectedData[p].nextElementSibling.innerText.trim()))
                                }
                            }
                        }
                    }
                    document.getElementById("officeContacts").appendChild(contactDiv)

                })

        }

    },
    getPageCache: () => {
        let getPageFromCache = false
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
        return getPageFromCache
    },
}
woaContact.addHTML(3, 3)
woaContact.getContactHdr()
woaContact.getContacts()


