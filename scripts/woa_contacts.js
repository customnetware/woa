const woaContacts = {
    showContacts: () => {
        let getPageFromCache = false
        let pageArea = document.getElementsByClassName("clsBodyText")[0]
        let appContainer = document.createElement("div"); appContainer.id = "customContainer", appContainer.className = "container"
        pageArea.appendChild(appContainer)
        //while (pageArea.firstChild) { pageArea.removeChild(pageArea.firstChild) }

        //if (typeof (window.performance.getEntriesByType) != "undefined") {
        //    try {
        //        let pageStatus = window.performance.getEntriesByType("navigation")[0].type
        //        if (pageStatus == "navigate" || pageStatus == "reload" || localStorage.getItem("woaCache") === null) {
        //            getPageFromCache = false
        //        } else {
        //            getPageFromCache = true
        //        }
        //    } catch { getPageFromCache = false }
        //} else { getPageFromCache = false }
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



        woaCode.addCard("profileHeader", "profileBody", "fa fa-check-circle fa-lg", "Loading...", false, "")

        $.get("/homepage/28118/resident-home-page" + woaCode.isLocal, function () { })
            .done(function (responseText) {
                let portalContent = new DOMParser().parseFromString(responseText, "text/html")
                document.getElementById("profileHeader").getElementsByTagName("a")[1].innerHTML = portalContent.getElementsByClassName("clsHeader")[0].innerHTML
                woaCode.getContentFromPortal(portalContent)

            })

    },
}
