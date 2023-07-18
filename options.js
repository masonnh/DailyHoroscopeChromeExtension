const signSelect = document.getElementById('sign-select');
const openaiSetting = document.getElementById('openai-token');
const saveButton = document.getElementById('save-button');
const confirmation = document.getElementById('confirmation');

function getSignData() {
    console.log('running')
    chrome.runtime.sendMessage("getSignData", function(response) {
        if(chrome.runtime.lastError) {
            setTimeout(getSignData, 1000);
        } 
        else {
            document.getElementById(response).selected = true;
        }
    });
}

function getTokenData() {
    console.log('running')
    chrome.runtime.sendMessage("getTokenData", function(response) {
        if(chrome.runtime.lastError) {
            setTimeout(getSignData, 1000);
        } 
        else {
            openaiSetting.value = `${response}`;
        }
    });
}

saveButton.addEventListener('click', () => {
    console.log('saving...')
    const selectedSign = signSelect.value;
    const openaiToken = openaiSetting.value;

    chrome.storage.sync.set({ sign: selectedSign, api_token: openaiToken }, () => {
        confirmation.textContent = `Saved sign: ${selectedSign} || Saved token: ${openaiToken}`
        
        function generateNewHoroscope(){
            chrome.runtime.sendMessage("generateNewHoroscope", function(response) {
                if(chrome.runtime.lastError) {
                    setTimeout(generateNewHoroscope, 1000);
                }
            });
        }
        generateNewHoroscope()
        
    });

});

getSignData()
getTokenData()