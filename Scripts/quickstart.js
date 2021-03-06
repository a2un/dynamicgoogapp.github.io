﻿// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '391673877609-vkddr5a38e620pi9muej3019rd0rhtht.apps.googleusercontent.com';

var SCOPES = ['https://www.googleapis.com/auth/drive','https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/script.external_request'];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
    gapi.auth.authorize(
      {
          'client_id': CLIENT_ID,
          'scope': SCOPES.join(' '),
          'immediate': true
      }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
    var authorizeDiv = document.getElementById('authorize-div');
    var _outputPage = document.getElementById('_outputPage');
    if (authResult && !authResult.error) {
        // Hide auth UI, then load client library.
        authorizeDiv.style.display = 'none';
        _outputPage.style.display = 'block';
        _outputPage.style.width = '1000';
        _outputPage.style.height = window.innerHeight;
        //callScriptFunction();
    } else {
        // Show auth UI, allowing the user to initiate authorization by
        // clicking authorize button.
        authorizeDiv.style.display = 'inline';
    }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
    gapi.auth.authorize(
      { client_id: CLIENT_ID, scope: SCOPES, immediate: false },
      handleAuthResult);
    return false;
}

/**
 * Calls an Apps Script function to list the folders in the user's
 * root Drive folder.
 */
function callScriptFunction() {
    /*SpreadsheetReader project in bound to the sheet Test Document in BM Dynamic Folder of drive folder
    https://drive.google.com/drive/folders/0B3NH2reV_QGMYk9wN2NPUnR6Tm8 */
    console.log('entering script function');
    var scriptId = "Mb-ruXorRBJuyxjSrDOaRP0KFVs3fzY2C";

    // Create an execution request object.
    var request = {
        'function': 'callByName'
    };

    // Make the API request.
    var op = gapi.client.request({
        'root': 'https://script.googleapis.com',
        'path': 'v1/scripts/' + scriptId + ':run',
        'method': 'POST',
        'body': request
    });

    op.execute(function (resp) {
        if (resp.error && resp.error.status) {
            // The API encountered a problem before the script
            // started executing.
            appendPre('Error calling API:');
            appendPre(JSON.stringify(resp, null, 2));
        } else if (resp.error) {
            // The API executed, but the script returned an error.

            // Extract the first (and only) set of error details.
            // The values of this object are the script's 'errorMessage' and
            // 'errorType', and an array of stack trace elements.
            var error = resp.error.details[0];
            appendPre('Script error message: ' + error.errorMessage);

            if (error.scriptStackTraceElements) {
                // There may not be a stacktrace if the script didn't start
                // executing.
                appendPre('Script error stacktrace:');
                for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                    var trace = error.scriptStackTraceElements[i];
                    appendPre('\t' + trace.function + ':' + trace.lineNumber);
                }
            }
        } else {
            // The structure of the result will depend upon what the Apps
            // Script function returns. Here, the function returns an Apps
            // Script Object with String keys and values, and so the result
            // is treated as a JavaScript object (folderSet).
            var folderLink = resp.response.result;
            /*if (Object.keys(folderSet).length == 0) {
                appendPre('No folders returned!');
            } else {
                appendPre('Folders under your root folder:');
                Object.keys(folderSet).forEach(function (id) {
                    appendPre('\t' + folderSet[id] + ' (' + id + ')');
                });
            }*/
            appendPre(folderLink);
        }
    });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
    var pre = document.getElementById('meTheFinalText');
    var textContent = document.createTextNode(message + '\n');
    pre.appendChild(textContent);
}
