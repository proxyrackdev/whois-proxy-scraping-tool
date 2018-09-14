'use strict';

const port = '8080';

function sendRequest(path, body, cb) {
  const url = `http://${window.location.hostname}:${port}/${path}`;
  const xmlhttp = new XMLHttpRequest();
  if (body) {
    xmlhttp.open('POST', url, true);
    xmlhttp.send(body);
  } else {
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  }

  xmlhttp.onreadystatechange = function() {
    if (this.readyState === 4) {
      const response = this.responseText;
      const obj = JSON.parse(response);
      cb(null, obj);
    }
  };
}

function getLookupStatus(lookupID) {
  console.log('getting lookup status');
  sendRequest(`lookups/${lookupID}`, null, (err, resp) => {
    console.log(resp.data);
    const {availableUrl, elapsedTime, error, finished, registeredUrl, remainingTime, resultUrl, success, total} = resp.data;
    const progressString = `progress: ${finished}/${total};     ${error} errors.`;
//    const progressString = `${total} domains total, finished: ${finished}, errors: ${error}.`;
    const timeString = `Elapsed time: ${elapsedTime} seconds, remaining time: ${remainingTime} seconds`;
    const progressSpan = document.getElementById('progress');
    progressSpan.innerText = progressString;
    const timeSpan = document.getElementById('time');
    timeSpan.innerText = timeString;

    const registered = document.getElementById('registered');
    const available = document.getElementById('available');
    const results = document.getElementById('results');
    registered.innerText = 'Registered domains';
    available.innerText = 'Available domains';
    results.innerText = 'Results';        
    registered.href = `http://${window.location.hostname}:${port}${registeredUrl}`;
    available.href = `http://${window.location.hostname}:${port}${availableUrl}`;
    results.href = `http://${window.location.hostname}:${port}${resultUrl}`;
  });
}

let statusIntervalID = null;
function requestLookup(input) {
  clearInterval(statusIntervalID);
  sendRequest('lookups', input, (err, resp) => {
    if (err) {
      console.log('Error sending request'); // todo
      console.log(err);
      return;
    }
    const lookupID = resp.data.id;
    console.log('lookup id is: %s', lookupID);
    statusIntervalID = setInterval(() => {
      getLookupStatus(lookupID);
    }, 1000);
  });
}

function main() {
  const submitButton = document.getElementById('submitButton');
  const textarea = document.getElementById('domains');

  submitButton.onclick = () => {
    const domains = textarea.value;
    console.log('submitting');
    console.log(domains);
    requestLookup(domains);
  };

  textarea.focus();
}

main();
