 woaFrame.onload = (function () {
                displayContent("panel_news_content", "news", "data-tooltip-text", 0)
                displayContent("panel_messages_content", "message", "data-tooltip-text", 1)
                displayContent("panel_discuss_content", "post", "data-tooltip-text", 2)
                displayContent("panel_classifieds_content", "classified", "data-tooltip-text", 3)
                displayContent("panel_resource_content", "document", "data-item-viewurl", 5)
                displayContent("panel_cal_content", "event", "href", 6)
                waitScreen.style.display = "none";
                if (profileTitle.getElementsByTagName("a").length > 0) {
                    profileTitle.getElementsByTagName("a")[0].innerText = woaFrame.contentWindow.document.getElementsByClassName("clsHeader")[0].innerText
                } else { profileTitle.innerText = woaFrame.contentWindow.document.getElementsByClassName("clsHeader")[0].innerText }

                function displayContent(contentID, contentClass, contentAttr, contentPos) {
                    let displayClass = woaFrame.contentWindow.document.getElementById(contentID).getElementsByClassName(contentClass)
                    for (let i = 0; i < displayClass.length; i++) {
                        let displayParagraph = document.createElement("p")
                        displayParagraph.setAttribute("style", "padding: 0; margin-top: 0; px; margin-bottom: 3px;");
                        let displayAttr = displayClass[i].getElementsByTagName("a")[0].getAttribute(contentAttr);
                        let displayText = displayClass[i].getElementsByTagName("a")[0].innerText;
                        if (contentPos == 1) {
                            let displayURL = displayClass[i].getElementsByTagName("a")[0].getAttribute("onclick");
                            let displayTitle = displayClass[i].getElementsByTagName("a")[0].getAttribute("data-tooltip-title").split("by");
                            displayParagraph.innerHTML = "<b>" + displayTitle[0] + "</b><br />" + displayAttr + "<a onclick=" + displayURL + " href='#'>&nbsp;<i>Read More</i></a>";
                        }
                        if (contentPos == 2) { displayParagraph.innerHTML = displayClass[i].innerHTML + displayAttr; }
                        if (contentPos == 0 || contentPos == 3) { displayParagraph.innerHTML = displayClass[i].innerHTML + "<br>" + displayAttr; }
                        if (contentPos == 5 || contentPos == 6) { displayParagraph.innerHTML = "<a href=" + displayAttr + ">" + displayText + "</a>"; }
                        profileData[contentPos].appendChild(displayParagraph)
                    }
                    }
            })
