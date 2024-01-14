function addComments(selectedPostID, groupID) {
    let waitNum = 0
    let commentForm = document.getElementById((selectedPostID !== "replyContent") ? selectedPostID.replace("post", "comment") : selectedPostID)
    let commentSubject = document.getElementById("replySubject").value
    let newPost = document.getElementById("newPostButton").getElementsByTagName("span")[0]
    if (commentForm.value.length > 5) {
        document.getElementById("woaFrame").src = pageLocation("/Discussion/28118~" + groupID)
        let frameWindow = document.getElementById('woaFrame').contentWindow
        let replyWait = document.getElementById(selectedPostID).getElementsByTagName("a")[1]
        if (selectedPostID !== "replyContent") {
            replyWait.className = "fa fa-refresh fa-spin fa-fw fa-lg"
            replyWait.innerHTML = ""
        } else { newPost.className = "fa fa-refresh fa-spin fa-fw" }
        let waitforButton = setInterval(function () {
            waitNum++
            let replyButton = frameWindow.document.getElementById((selectedPostID !== "replyContent") ? selectedPostID.replace("post", "lnkTopicReply") : "lnkAddTopic")
            if (replyButton !== null || window.location.hostname == "localhost") {
                clearInterval(waitforButton)
                try { replyButton.click() } catch { }
                let waitforForm = setInterval(function () {
                    waitNum++
                    if (frameWindow.document.getElementById("txt_post_body") !== null || window.location.hostname == "localhost") {
                        try {
                            frameWindow.document.getElementById("txt_post_body").innerHTML = commentForm.value
                            frameWindow.document.getElementsByClassName("x-btn-text save-button")[0].click()
                            clearInterval(waitforForm)
                        } catch { clearInterval(waitforForm) }
                        let waitforConfirm = setInterval(function () {
                            waitNum++
                            if (frameWindow.document.getElementsByClassName(" x-btn-text").length > 0 || window.location.hostname == "localhost") {
                                try { frameWindow.document.getElementsByClassName(" x-btn-text")[4].click() } catch { clearInterval(waitforConfirm) }
                                clearInterval(waitforConfirm)
                                let waitforGroupsLive = setInterval(function () {
                                    waitNum++
                                    if (frameWindow.document.getElementById("txt_post_body") == null || window.location.hostname == "localhost") {
                                        clearInterval(waitforGroupsLive)
                                        if (selectedPostID !== "replyContent") {
                                            showComments(selectedPostID, groupID, true)
                                            commentForm.value = ""
                                            replyWait.className = ""
                                            replyWait.innerHTML = "Reply"
                                        } else {
                                            let currentPost = document.getElementById("recentPostsBody").getElementsByTagName("p")[0]

                                            newPost.className = "fa fa-plus"
                                        }
                                    }
                                }, 500)
                            }
                        }, 500)
                    }
                }, 500)
            }
        }, 500)
    }
}