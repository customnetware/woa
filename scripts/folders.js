$(window).load(function () {

    showDocuments('000000')
})
function showDocuments(selectedFolder) {
    document.getElementById("document").innerHTML = ""
    try {
        let fileLocation = (window.location.hostname == "localhost") ? "/resourcecenter/28118/resource-center.html" : "/resourcecenter/28118/resource-center"
        $.get(fileLocation, function () { })
            .done(function (responseText) {
                let documents = new DOMParser().parseFromString(responseText, "text/html")
                if (selectedFolder == '000000') {
                    const parentElement = documents.querySelector(".clsTree")
                    let fileList = parentElement.querySelectorAll(":scope > div")
                    for (let p = 0; p < fileList.length; p++) {
                        let resourceItem = document.createElement("span")
                        let link = document.createElement("a")
                        let folderID = fileList[p].getElementsByTagName("span")[0].id

                        link.href = "javascript:showDocuments('Y','" + folderID.replace("f", "") + "');"
                        link.innerHTML = fileList[p].getElementsByTagName("span")[0].innerText
                        let fileIcon = document.createElement("i")
                        fileIcon.className = "fa fa-folder-o formatIcon"
                        resourceItem.appendChild(fileIcon)
                        resourceItem.appendChild(link)
                        document.getElementById("document").appendChild(resourceItem)

                    }
                    let homeScreenID = ["000000"]
                    let screenToSave = JSON.stringify(homeScreenID)
                    localStorage.setItem("screenList", screenToSave)
                    let homeSreen = []
                    let currentScreen = document.getElementById("document").getElementsByTagName("span")
                    for (let h = 0; h < currentScreen.length; h++) {
                        homeSreen.push(currentScreen[h].innerHTML)
                    }
                    let saveFileList = JSON.stringify(homeSreen)
                    localStorage.setItem(homeScreenID, saveFileList)

                } else {
                    let retrievedData = localStorage.getItem("screenList")
                    if (retrievedData.includes(selectedFolder) == false) {
                        let allScreens = JSON.parse(retrievedData)
                        allScreens.push(selectedFolder)
                        let screensToSave = JSON.stringify(allScreens)
                        localStorage.setItem("screenList", screensToSave)
                    }
                    let documentName = documents.getElementById("contents" + selectedFolder).querySelectorAll(":scope > div")[1]
                    let doclist = documentName.querySelectorAll(":scope > div")

                    for (let p = 0; p < doclist.length; p++) {
                        try {
                            let fileIcon = document.createElement("i")
                            let resourceItem = document.createElement("span")
                            let docLink = document.createElement("a")
                            let docSelected = doclist[p].getElementsByTagName("span")[0]
                            docLink.innerHTML = docSelected.innerText
                            if (docSelected.id.startsWith("f")) {
                                fileIcon.className = "fa fa-folder-o formatIcon"
                                docLink.href = "javascript:showDocuments('" + docSelected.id.replace("f", "") + "');"
                            } else {
                                fileIcon.className = "fa fa-file-pdf-o formatIcon"
                                let fileID = "contentsDoc" + docSelected.replace("d", "")
                                let selectedFile = documents.getElementById(fileID)
                                docLink.href = selectedFile.getElementsByTagName("a")[2].href
                            }
                            resourceItem.appendChild(fileIcon)
                            resourceItem.appendChild(docLink)
                            document.getElementById("document").appendChild(resourceItem)
                        } catch { }
                    }
                    document.getElementById("bArrow").href = "javascript:getLastPage('" + selectedFolder + "')"


                    let subScreen = []
                    let currentScreen = document.getElementById("document").getElementsByTagName("span")
                    for (let h = 0; h < currentScreen.length; h++) {
                        subScreen.push(currentScreen[h].innerHTML)
                    }
                    let saveFileList = JSON.stringify(subScreen)
                    localStorage.setItem(selectedFolder, saveFileList)
                }
            })
    } catch (error) {
    }
}
function sortList() {
    let testArray = []
    for (let p = 0; p < documentName.length; p++) {
        testArray.push(documentName[p].innerHTML + "|" + documentLink[p])
    }
    testArray.sort()
    if (DoSort == "Y") { testArray.reverse() }
}
function getLastPage(ScreenID) {
    document.getElementById("document").innerHTML = ""
    let retrievedData = localStorage.getItem("screenList")
    let screens = JSON.parse(retrievedData)
    let index = screens.indexOf(ScreenID)
    let currentIndex = (index > 0) ? index - 1 : index



    retrievedData = localStorage.getItem(screens[currentIndex])

    if (retrievedData !== null) {
        let fileListing = JSON.parse(retrievedData)
        for (let p = 0; p < fileListing.length; p++) {
            let currentFile = document.createElement("span")
            currentFile.innerHTML = fileListing[p]
            document.getElementById("document").appendChild(currentFile)
        }
    }

    document.getElementById("bArrow").href = "javascript:getLastPage('" + screens[currentIndex] + "')"



    //if (retrievedData !== null) {
    //    
    //    let recentList = document.getElementById("document")
    //    recentList.innerHTML = ""
    //    for (let p = 0; p < lastPage.length; p++) {
    //        let rowContent = document.createElement("span")
    //        rowContent.innerHTML = lastPage[p]
    //        recentList.appendChild(rowContent)
    //    }
    //}
}
