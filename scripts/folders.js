    $(window).load(function () {

            showDocuments('Y', '000000')
        })
        function showDocuments(DoSort, selectedFolder) {
            document.getElementById("document").innerHTML = ""
            try {
                let fileLocation = (window.location.hostname == "localhost") ? "/resourcecenter/28118/resource-center.html" : "/resourcecenter/28118/resource-center"

                $.get(fileLocation, function () { })
                    .done(function (responseText) {
                        let documents = new DOMParser().parseFromString(responseText, "text/html")
                        if (selectedFolder == '000000') {
                           const parentElement = documents.querySelector(".clsTree")
                            let allChildren = parentElement.querySelectorAll(":scope > div")
                            for (let p = 0; p < allChildren.length; p++) {
                                let resourceItem = document.createElement("span")
                                let link = document.createElement("a")
                                let folderID = allChildren[p].getElementsByTagName("span")[0].id
                                link.href = "javascript:test();"
                               /* link.href = "javascript:showDocuments('Y','" + folderID.replace("f", "") + "');"*/
                                link.innerHTML = allChildren[p].getElementsByTagName("span")[0].innerText
                                resourceItem.appendChild(link)
                                document.getElementById("document").appendChild(resourceItem)
                            }
                        } else {
                            let documentName = documents.getElementById("contents" + selectedFolder).querySelectorAll(":scope > div")
                            let doclist = documentName[1].querySelectorAll(":scope > div")
                            let arrowHref = documents.getElementById("contents" + selectedFolder).parentElement.parentElement.parentElement.id.replace("contents", "").replace("contentInner", "000000")
                            document.getElementById("bArrow").href = "javascript:showDocuments('Y','" + arrowHref + "')"
                            for (let p = 0; p < doclist.length; p++) {
                                try {
                                    let resourceItem = document.createElement("span")
                                    let selectedDoc = document.createElement("a")
                                    selectedDoc.innerHTML = doclist[p].getElementsByTagName("span")[0].innerText
                                    if (doclist[p].getElementsByTagName("span")[0].id.startsWith("f")) {
                                        selectedDoc.href = "javascript:showDocuments('Y','" + doclist[p].getElementsByTagName("span")[0].id.replace("f", "") + "');"
                                    } else {
                                        let fileID = "contentsDoc" + doclist[p].getElementsByTagName("span")[0].id.replace("d", "")
                                        let selectedFile = documents.getElementById(fileID)
                                        selectedDoc.href = selectedFile.getElementsByTagName("a")[2].href
                                    }
                                    resourceItem.appendChild(selectedDoc)
                                    document.getElementById("document").appendChild(resourceItem)
                                } catch { }
                            }
                        }

                        /*let testArray = []*/
                        //for (let p = 0; p < documentName.length; p++) {
                        //    testArray.push(documentName[p].innerHTML + "|" + documentLink[p])
                        //}
                        //testArray.sort()
                        //if (DoSort == "Y") { testArray.reverse() }

                    })
            } catch (error) {
            }
        }
        function test() { alert("This is test")}
