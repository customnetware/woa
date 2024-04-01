
const woaDocs = {
    isLocal: (window.location.hostname == "localhost") ? ".html" : "",
    urlParams: new URLSearchParams(window.location.search),

    screenSort: () => {

        let startNumber = (document.getElementById("document").getElementsByTagName("i")[0].className == "fa fa-folder-o fa-lg") ? 0 : 1
        let screens = document.getElementById("document").getElementsByTagName("span")
        let sortScreens = []
        for (let s = startNumber; s < screens.length; s++) {
            sortScreens.push(screens[s].innerHTML)
        }
        sortScreens.sort(function (a, b) { return a - b })
        //
        if (document.getElementById("document").getElementsByTagName("a")[0].innerText !== "Flyers (Events or Activities)") { sortScreens.reverse() }

        for (let s = 0; s < sortScreens.length; s++) {
            screens[s + startNumber].innerHTML = sortScreens[s]
        }
    },
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

        document.getElementById("customContainer").insertBefore(rowDiv, document.getElementById("docRow"))

        if (fnName !== "") { fnName() }

    },
    getProfile: () => {
        let filePage = (window.location.hostname == "localhost") ? "/woa_documents.html" : "/page/28118~1105440"
        let homePage = (window.location.hostname == "localhost") ? "/woa_dashboard.html" : "/page/28118~1101528"
        let profileID = /\(([^)]+)\)/.exec(document.getElementById("HeaderPublishAuthProfile").href)[1].split(",")
        let classArray = ["fa fa fa-home fa-fw fa-lg", "", "fa fa-question-circle fa-fw fa-lg", "profileSort", "fa fa-sort fa-fw fa-lg profileSortIcon"]
        let hrefArray = [homePage, filePage, "/form/28118~327323/social-media-help", "javascript:woaDocs.screenSort()", "javascript:woaDocs.screenSort()"]
        let textArray = ["", "My Documents", "", "Sort", ""]

        for (let a = 0; a <= 4; a++) {
            let headerLinks = document.getElementById("profileHeader").getElementsByTagName("a")
            headerLinks[a].innerHTML = textArray[a]
            headerLinks[a].href = hrefArray[a]
            headerLinks[a].className = classArray[a]
        }

        let profileImage = document.createElement("img")
        let imageFile = $.get("/Member/28118~" + profileID[0] + woaDocs.isLocal, function () { })
        let textFile = $.get("/news/28118~799897" + woaDocs.isLocal, function () { })
        $.when(imageFile, textFile).done(function (responseIMG, responseTXT) {
            let imageFile = new DOMParser().parseFromString(responseIMG, "text/html")
            let userContent = new DOMParser().parseFromString(responseTXT, "text/html")
            let userText = document.createElement("span")
            profileImage.src = imageFile.getElementsByTagName("img")[0].src
            userText.innerHTML = userContent.getElementById("contentInner").children[2].innerHTML
            document.getElementById("profileBody").appendChild(profileImage)
            document.getElementById("profileBody").appendChild(userText)
        })
    },
    getPortalDocuments: (docID, getLatest) => {

        let docArray = []
        let pageDocuments = document.getElementById("document")
        let waitSpan = document.createElement("i")
        waitSpan.className = "fa fa-refresh fa-fw fa-spin fa-4x waitClass"


        while (pageDocuments.firstChild) { pageDocuments.removeChild(pageDocuments.firstChild) }
        pageDocuments.appendChild(waitSpan)

        if (docID === "") { docID = "contentInner" }
        $.get("/resourcecenter/28118/resource-center" + woaDocs.isLocal, function () { })
            .done(function (responseText) {
                waitSpan.remove()
                let documents = new DOMParser().parseFromString(responseText, "text/html")

                if (getLatest == true) {
                    let selectedDocs = documents.getElementById(docID).getElementsByTagName("span")
                    for (let d = 0; d < selectedDocs.length; d++) {
                        if (selectedDocs[d].id.charAt(0) == "d") {
                            docArray.push(selectedDocs[d].id)
                        }
                    }
                    docArray.sort()
                    docID = documents.getElementById(docArray[docArray.length - 1]).parentElement.parentElement.parentElement.parentElement.id
                }
                let allDocuments = documents.getElementById(docID).getElementsByClassName("clsTreeNde")
                if (docID !== "contentInner") {
                    let folderIcon = document.createElement("i")
                    let folderLink = document.createElement("a")
                    let lastFolder = document.createElement("span")
                    folderLink.href = "javascript:woaDocs.getPortalDocuments('" + documents.getElementById(docID).parentElement.parentElement.parentElement.id + "',false)"
                    folderLink.innerHTML = documents.getElementById(docID.replace("contents", "f")).innerText
                    folderIcon.className = "fa fa-folder-open-o fa-lg"
                    folderIcon.style.marginRight = "10px"
                    lastFolder.appendChild(folderIcon)
                    lastFolder.appendChild(folderLink)
                    pageDocuments.appendChild(lastFolder)
                }
                for (let d = 0; d < allDocuments.length; d++) {
                    let parentFolderID = allDocuments[d].parentElement.parentElement.parentElement.parentElement.id
                    if (parentFolderID !== "contents465149" && parentFolderID == docID) {
                        let pageIcon = document.createElement("i")
                        let pageLink = document.createElement("a")
                        let pageDocument = document.createElement("span")
                        pageIcon.style.marginRight = "10px"
                        pageIcon.id = allDocuments[d].id
                        pageLink.innerHTML = allDocuments[d].innerHTML
                        if (allDocuments[d].id.charAt(0) == "f") {
                            pageIcon.className = "fa fa-folder-o fa-lg"
                            pageLink.href = "javascript:woaDocs.getPortalDocuments('" + allDocuments[d].id.replace("f", "contents") + "',false)"
                        } else {
                            pageIcon.className = "fa fa-file-o fa-lg"
                            pageLink.href = documents.getElementById(allDocuments[d].id.replace("d", "contentsDoc")).getElementsByTagName("a")[2].href
                        }
                        pageDocument.appendChild(pageIcon)
                        pageDocument.appendChild(pageLink)
                        pageDocuments.appendChild(pageDocument)
                        if (d == allDocuments.length - 1) {
                            woaDocs.screenSort()
                        }
                    }
                }
            })
    },
    showThePage: () => {
        let appContainer = document.createElement("div"); appContainer.id = "customContainer", appContainer.className = "container"
        let pageRow = document.createElement("div"); pageRow.className = "row", pageRow.id="docRow"
        let pageDocuments = document.createElement("div"); pageDocuments.id = "document", pageDocuments.className ="col-md-12"

        pageRow.appendChild(pageDocuments)


        appContainer.appendChild(pageRow)
        document.getElementsByClassName("clsBodyText")[0].appendChild(appContainer)
        woaDocs.addCard("profileHeader", "profileBody", "fa fa-check-circle fa-lg", "My Documents", false, woaDocs.getProfile)

        if (woaDocs.urlParams.get("ff") !== null) {
            woaDocs.getPortalDocuments(woaDocs.urlParams.get("ff"), true)
        } else {
            woaDocs.getPortalDocuments("", false)
        }
    }
}
woaDocs.showThePage()