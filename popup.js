const header = document.getElementById('header');
const horoscopeElement = document.getElementById('horoscope');

function getHoroscopeData() {
    chrome.runtime.sendMessage("getHoroscopeData", function(response) {
        if(chrome.runtime.lastError) {
            setTimeout(getHoroscopeData, 1000);
        } 
        else {
            horoscopeElement.textContent = response || 'No horoscope found.';
        }
    });
}

function getSignData() {
    chrome.runtime.sendMessage("getSignData", function(response) {
        if(chrome.runtime.lastError) {
            setTimeout(getSignData, 1000);
        } 
        else {
            header.textContent = `Your Unique ${response} Horoscope` || 'Your Unique Daily Horoscope';
        }
    });
}


// add a click event listener to the settings button
const settingsButton = document.getElementById('settings-button');
settingsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
});

// add a click event listener to the horoscope button
const horoscopeButton = document.getElementById('horoscope-button');
horoscopeButton.addEventListener('click', () => {
    getHoroscopeData()
});

chrome.runtime.onStartup.addListener(function() {
chrome.windows.create({
    type: "popup",
    url: "popup.html",
    width: 600,
    height: 600,
    left: 100,
    top: 100
});
});

// runs when popup loads
document.addEventListener('DOMContentLoaded', function() {
    getSignData()
    getHoroscopeData()
});

getSignData()
getHoroscopeData()