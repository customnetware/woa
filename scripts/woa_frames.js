function formatTime(eventTime) {
    let eventDate = new Date()
    let amPM = eventTime.slice(-2)
    eventTime = eventTime.replace(amPM, "")
    eventHours = Number(eventTime.split(":")[0])
    eventMinutes = Number(eventTime.split(":")[1])
    if (amPM == "PM" && eventHours < 12) eventHours = eventHours + 12
    if (amPM == "AM" && eventHours == 12) eventHours = eventHours - 12
    eventDate.setHours(eventHours, eventMinutes, 0)
    return eventDate
}
function getCalendar() {
    let woaCalendar = document.createElement("iframe")
    let calendarArray = []
    woaCalendar.id = "woaIFrame"
    woaCalendar.style.display = "none"
    woaCalendar.onload = function () {
        calendarWait = setInterval(function () {
            let calendarDocument = woaCalendar.contentWindow.document
            let eventList = calendarDocument.getElementById("eventList")
            let todaysEvents = eventList.getElementsByClassName("event")
            let eventLocation = ""
            if (calendarDocument !== null && calendarDocument.readyState == "complete" && eventList !== null && todaysEvents.length > 0) {
                clearInterval(calendarWait)
                for (let d = 0; d < todaysEvents.length; d++) {
                    $.get((window.location.hostname !== "localhost") ? todaysEvents[d].getElementsByTagName("a")[0].href : "/Calendar/Event/event.html", function () { })
                        .done(function (responseText) {
                            let woaEvent = new DOMParser().parseFromString(responseText, "text/html")
                            eventLocation = woaEvent.getElementsByClassName("clsInput clsBodyText")[0].innerText.trim()
                        })
                        .fail(function () {
                            eventLocation = "Event Location Not Avaiable (Error)"
                        })
                        .always(function () {
                            calendarArray.push({
                                calTime: formatTime(todaysEvents[d].children[0].innerText).getTime(),
                                calTitle: todaysEvents[d].children[1].innerText,
                                calLink: todaysEvents[d].getElementsByTagName("a")[0].href,
                                calLocation: eventLocation
                            })
                            if (d === todaysEvents.length - 1) {
                                calendarArray.sort((a, b) => { return a.calTime - b.calTime })
                                showCalendar(calendarArray)
                                document.getElementById("woaIFrame").remove()
                            }
                        })
                }
            }
        }, 1000)

    }
    woaCalendar.src = pageLocation("/Calendar/28118~19555")
    document.body.appendChild(woaCalendar)
}
function showCalendar(calenderEvents) {
    for (let d = 0; d < calenderEvents.length; d++) {
        let eventLink = document.createElement("a")
        let eventDiv = document.createElement("div")
        let nameDiv = document.createElement("div")
        let timeDiv = document.createElement("div")
        let placeDiv = document.createElement("div")
        eventDiv.appendChild(nameDiv)
        eventDiv.appendChild(timeDiv)
        eventDiv.appendChild(placeDiv)
        eventLink.href = calenderEvents[d].calLink
        eventLink.innerHTML = calenderEvents[d].calTitle
        nameDiv.appendChild(eventLink)
        timeDiv.innerText = new Date(calenderEvents[d].calTime).toLocaleTimeString()
        placeDiv.className = "hideFromApp"
        placeDiv.innerText = calenderEvents[d].calLocation
        document.getElementById("eventsBody").appendChild(eventDiv)
    }


}
