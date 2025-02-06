"use strict";

const seeStatisticsButton = document.getElementById("seeStatistics");
seeStatisticsButton.addEventListener("click", () => {
    const statisticsDiv = document.getElementById("statistics");
    if(statisticsDiv.classList.contains("d-none")){
        statisticsDiv.classList.remove("d-none");
        seeStatisticsButton.innerText = "Hide statistics";
    } else {
        statisticsDiv.classList.add("d-none");
        seeStatisticsButton.innerText = "Show statistics";
    }
})