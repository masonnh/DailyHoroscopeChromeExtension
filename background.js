function generateHoroscope()
{
  // get the user's selected sign from storage
  chrome.storage.sync.get(['sign', 'api_token'], ({ sign, api_token }) => {
    console.log(`Retrieved sign: ${sign}`);
    console.log(`Retrieved api_token: ${api_token}`);

    chrome.storage.sync.set({ prevHoroscopeSign: sign }, () => {
      console.log(`prevHoroscopeSign: ${sign}`)
    });

    // generate the horoscope here
    fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_token}`
    },
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "max_tokens": 256,
      "messages": [
        {"role":"system", "content":"You are a horoscope chatbot that generates horoscopes based on astrological signs"},
        {"role":"user", "content":`Give me a unique horoscope for people with the astrological sign of ${sign}, but without any introductory words. Please just return the horoscope.`}
      ]
    })
  })
  .then(response => response.json())
  .then(data => {
    const text = data.choices[0].message.content;

    chrome.storage.sync.set({ horoscope: text }, () => {
      console.log(`Saved horoscope: ${text}`);
    });
  })
  });
}

// set up the alarm to trigger immediately and then every night at 12am
chrome.alarms.create('generateHoroscope', {
  when: Date.now(),
  periodInMinutes: 24 * 60 // 24 hours in minutes
});

// listen for the alarm and generate the horoscope when it triggers
chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'generateHoroscope') {
    generateHoroscope()
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message === "getHoroscopeData") {
      console.log("phs ", chrome.storage.sync.get(["prevHoroscopeSign"]))
      chrome.storage.sync.get(["horoscope"], function(result) {
        if (result.horoscope != null) {
          sendResponse(result.horoscope);
        } else {
          generateHoroscope();
          chrome.storage.sync.get(["horoscope"], function(result) {
            sendResponse(result.horoscope);
          });
        }
      });
      return true; // Indicates that sendResponse will be called asynchronously
    }

    if (message === "getSignData") {
      chrome.storage.sync.get(["sign"], function(result) {
        if (result.sign != null) {
          sendResponse(result.sign);
        } else {
          sendResponse('Aries')
        }
        
      });
      return true; // Indicates that sendResponse will be called asynchronously
    }

    if (message === "getTokenData") {
      chrome.storage.sync.get(["api_token"], function(result) {
        if (result.api_token != null) {
        sendResponse(result.api_token);
        }
        else {
          sendResponse('None')
        }
      });
      return true; // Indicates that sendResponse will be called asynchronously
    }

    if (message === "generateNewHoroscope")
    {
      generateHoroscope()
    }
});

chrome.action.onClicked.addListener(function(tab) {
  chrome.scripting.executeScript({
      file: "popup.js"
    });
});