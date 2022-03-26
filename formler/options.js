let page = document.getElementById("formDiv");
let buttonSave = document.getElementById("savePreset");
let buttonAdd = document.getElementById("addItem");
let urlField = document.getElementById("url");
let autoSubCheck = document.getElementById("autoSubmit");
let indexValue;
let indexNumbersArray = [];
let tempIdsList = [];
let tempValuesList = [];

function createItem(idx) {
    let row = document.createElement('div');
    row.className = 'row';
    row.setAttribute('id', 'row-' + idx);
    let label1 = document.createElement("label");
    label1.setAttribute("for", "id");
    label1.innerText = "id:";
    let input1 = document.createElement("input");
    input1.setAttribute("type", "id");
    input1.setAttribute("id", "id-" + idx);
    input1.setAttribute("placeholder", "Enter target id");
    input1.setAttribute("name", "id");
    let label2 = document.createElement("label");
    label1.setAttribute("for", "value");
    label2.innerText = "value:";
    let input2 = document.createElement("input");
    input2.setAttribute("type", "id");
    input2.setAttribute("id", "value-" + idx);
    input2.setAttribute("placeholder", "Enter target id");
    input2.setAttribute("name", "id");
    let remove = document.createElement("button");
    remove.setAttribute("id", "removeItem-" + idx);
    remove.innerText = "Remove";

    remove.addEventListener("click", removeItem);

    chrome.storage.sync.get('currentIndexNumbers', function(result) {

      indexNumbersArray = result.currentIndexNumbers;
      
      chrome.storage.sync.get('dynamicIdList', function(result1) {
        console.log('Value currently is ' + result1.dynamicIdList);
    
        tempIdsList = result1.dynamicIdList;
        console.log(tempIdsList);
        if (idx != "" && tempIdsList[indexNumbersArray.indexOf(idx)] != undefined) {
          document.getElementById("id-" + idx).value = tempIdsList[indexNumbersArray.indexOf(idx)];
        }
      });

      chrome.storage.sync.get('dynamicValueList', function(result2) {
        console.log('Value currently is ' + result2.dynamicValueList);
    
        tempValuesList = result2.dynamicValueList;
        console.log(tempValuesList);
        if (idx != "" && tempValuesList[indexNumbersArray.indexOf(idx)] != undefined) {
          document.getElementById("value-" + idx).value = tempValuesList[indexNumbersArray.indexOf(idx)];
        }
      });

    });

    row.appendChild(label1);
    row.appendChild(input1);
    row.appendChild(label2);
    row.appendChild(input2);
    row.appendChild(remove);

    page.appendChild(row);
};

function constructOptions(indexNumbersArray) {
  
  chrome.storage.sync.get('urlValue', function(result) {
    console.log(result.urlValue);
    let urlField = document.getElementById('url');
    urlField.value = result.urlValue;
  });

  chrome.storage.sync.get('executeOnStartup', function(result) {
    console.log(result.executeOnStartup);
    let executeOnStartup = document.getElementById('executeOnStartup');
    executeOnStartup.checked = result.executeOnStartup;
  });

  chrome.storage.sync.get('onceADay', function(result) {
    console.log(result.onceADay);
    let onceADay = document.getElementById('onceADay');
    onceADay.checked = result.onceADay;
  });

  chrome.storage.sync.get('subTargetName', function(result) {
    console.log(result.subTargetName);
    let subTargetName = document.getElementById('subTargetName');
    subTargetName.value = result.subTargetName;
  });

  chrome.storage.sync.get('autoSubmit', function(result) {
    console.log(result.autoSubmit);
    let autoSub = document.getElementById('autoSubmit');
    autoSub.checked = result.autoSubmit;
  });

  chrome.storage.sync.get('currentIndexNumbers', function(result) {
    console.log('Value currently is ' + result.currentIndexNumbers);
    
    indexNumbersArray = result.currentIndexNumbers;

    for (let indexNumberArray of indexNumbersArray) {
      console.log(indexNumberArray);
      createItem(indexNumberArray);
    }
  });
};

function addItem() {
  console.log('adding..');

  chrome.storage.sync.get('currentIndexNumbers', function(result) {
      console.log('Value currently is ' + result.currentIndexNumbers);

      chrome.storage.sync.get('currentIndex', function(result1) {
        console.log('Current index is ' + result1.currentIndex);
        indexValue = result1.currentIndex;
        indexValue++;
        chrome.storage.sync.set({currentIndex: indexValue}, function() {
          console.log('Value is set to ' + indexValue);
        });

        chrome.storage.sync.get('dynamicIdList', function(result2) {
          tempIdsList = result2.dynamicIdList;
          console.log(tempIdsList);
          tempIdsList.push("");
          chrome.storage.sync.set({dynamicIdList: tempIdsList});
        });

        chrome.storage.sync.get('dynamicValueList', function(result3) {
          tempValuesList = result3.dynamicValueList;
          console.log(tempValuesList);
          tempValuesList.push("");
          chrome.storage.sync.set({dynamicValueList: tempValuesList});
        });

        createItem(indexValue);
        indexNumbersArray = result.currentIndexNumbers;
        console.log(indexNumbersArray);
        indexNumbersArray.push(indexValue);

        chrome.storage.sync.set({currentIndexNumbers: indexNumbersArray}, function() {
          console.log('Value push to '+ indexNumbersArray); 
        });
      }); 
  } );
}

function removeItem(Event) {
  console.log('removing..');
  console.log(Event);
  console.log(Event.srcElement.parentElement);
  let itemId = Event.srcElement.parentElement.id;
  let itemIndex = itemId.substr(4);
  console.log(itemIndex);
  page.removeChild(document.getElementById(itemId));

  chrome.storage.sync.get('currentIndexNumbers', function(result) {
    console.log('Value currently is ' + result.currentIndexNumbers);

      indexNumbersArray = result.currentIndexNumbers;
      console.log(indexNumbersArray);
      console.log(indexNumbersArray.indexOf(Number(itemIndex)));
      let arrayIdx = indexNumbersArray.indexOf(Number(itemIndex));
      indexNumbersArray.splice(arrayIdx, 1);

      chrome.storage.sync.get('dynamicIdList', function(result1) {
        tempIdsList = result1.dynamicIdList;
        tempIdsList.splice(arrayIdx, 1);

        chrome.storage.sync.set({dynamicIdList: tempIdsList});
      });

      chrome.storage.sync.get('dynamicValueList', function(result2) {
        tempValuesList = result2.dynamicValueList;
        tempValuesList.splice(arrayIdx, 1);

        chrome.storage.sync.set({dynamicValueList: tempValuesList});
      });

      chrome.storage.sync.set({currentIndexNumbers: indexNumbersArray}, function() {
        console.log('Value push to ' + indexNumbersArray); 
      });
  });
}

function savePreset() {
  console.log('saving..');

  chrome.storage.sync.set({urlValue: document.getElementById('url').value});
  chrome.storage.sync.set({executeOnStartup: document.getElementById('executeOnStartup').checked});
  chrome.storage.sync.set({onceADay: document.getElementById('onceADay').checked});
  chrome.storage.sync.set({autoSubmit: document.getElementById('autoSubmit').checked});
  chrome.storage.sync.set({subTargetName: document.getElementById('subTargetName').value});
   
  chrome.storage.sync.get('currentIndexNumbers', function(result) {

    indexNumbersArray = result.currentIndexNumbers;
    
    chrome.storage.sync.get('dynamicIdList', function(result1) {
      console.log('Value currently is ' + result1.dynamicIdList);
  
      tempIdsList = result1.dynamicIdList;
      console.log(tempIdsList);

      for (let i = 0; i < tempIdsList.length; i++) {
        arrayIdx = indexNumbersArray[i];
        console.log(arrayIdx + 'test|');
        console.log(document.getElementById("id-" + arrayIdx));
        tempIdsList[i] = document.getElementById("id-" + arrayIdx).value;
        console.log(tempIdsList[i] + 'test');
      }

      chrome.storage.sync.set({dynamicIdList: tempIdsList}, function() {
        console.log('Value push to '+ tempIdsList); 
      }); 
    });  

    chrome.storage.sync.get('dynamicValueList', function(result2) {
      console.log('Value currently is ' + result2.dynamicValueList);
  
      tempValuesList = result2.dynamicValueList;
      console.log(tempValuesList);

      for (let i = 0; i < tempValuesList.length; i++) {
        arrayIdx = indexNumbersArray[i];
        console.log(arrayIdx + 'test|');
        console.log(document.getElementById("value-" + arrayIdx));
        tempValuesList[i] = document.getElementById("value-" + arrayIdx).value;
        console.log(tempValuesList[i] + 'test');
      }

      chrome.storage.sync.set({dynamicValueList: tempValuesList}, function() {
        console.log('Value push to '+ tempValuesList); 
      }); 
    });  
  });

};

buttonAdd.addEventListener("click", addItem);
buttonSave.addEventListener("click", savePreset);

// Initialize the page by constructing the options
constructOptions(indexNumbersArray);