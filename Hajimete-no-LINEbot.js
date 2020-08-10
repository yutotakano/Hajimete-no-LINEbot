/**

Hajimete-LINE-bot, Yuto Takano

This is a simple LINE bot script to be hosted on Google Apps Script, using Google Spreadsheet as a database.
Read the README.md for details.

*/
function doPost(e) {

  var channelToken = '';
  var spreadSheetUrl = 'https://docs.google.com/spreadsheets/d/abcdefghijklmnop/edit';
  var reply = '君が好きな数字は$$ですね！😄♪';
  var itemName = '好きな数字';
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // 
  //
  //   この下は、いじれる自信がない人はいじらない方が身のため。
  //
  // 
  
  var baseUrl = 'https://api.line.me/v2/bot/';

  var jsonEvent = JSON.parse(e.postData.contents).events[0];
  
  if (typeof jsonEvent.replyToken === 'undefined') {
    // not a valid message to reply to
    return;
  }
  
  if (jsonEvent.type !== 'message' || (jsonEvent.type === 'message' && jsonEvent.message.type !== 'text')) {
    // ignore events that are not text messages
    return;
  }

  if (jsonEvent.source.type !== 'user') {
    // ignore groups and rooms, only 個チャ allowed
    return;
  }
  
  if (typeof jsonEvent.source.userId === 'undefined' || jsonEvent.source.userId === null) {
    // user could not be found or identified for some reason, shouldn't happen, but why not
    return;
  }
  
  var spreadSheet = SpreadsheetApp.openByUrl(spreadSheetUrl);  
  initialiseSpreadSheet(spreadSheet);
  var activeSheet = spreadSheet.getActiveSheet();

  // get the user's profile from LINE
  var userProfileResponse = UrlFetchApp.fetch(baseUrl + 'profile/' + jsonEvent.source.userId, {
    'headers': {
      'Authorization': 'Bearer ' + channelToken 
    }
  });
  var userProfile = JSON.parse(userProfileResponse.getContentText());
  
  // then extract the number from the text (including full-width numbers)
  var halfWidthString = convertToHalfWidth(jsonEvent.message.text);
  var matches = halfWidthString.match(/\d+/);
  if (matches === null) {
    // there was no detectable number in the message, ignore message
    return;
  }
  // take first number in string
  var favoriteNum = matches[0];
  
  // now onto adding it into the spreadsheet  
  var cells = activeSheet.getRange('A2:A').getValues();
  var rowIdentifier = null;
  // loop over all existing names to find a matching ID
  for (var i = 0; i < cells.length; i++) {
    if (cells[i] == userProfile.userId) {
      rowIdentifier = i + 2;
    }
  }
  if (rowIdentifier === null) {
    // there were no matches
    rowIdentifier = activeSheet.getLastRow() + 1;
  }
  var idCellIdentifier = 'A' + rowIdentifier;
  var nameCellIdentifier = 'B' + rowIdentifier;
  var numberCellIdentifier = 'C' + rowIdentifier;
  
  activeSheet.getRange(idCellIdentifier).setValue(userProfile.userId);
  activeSheet.getRange(nameCellIdentifier).setValue(userProfile.displayName);
  activeSheet.getRange(numberCellIdentifier).setValue(favoriteNum);
  
  var messages = [{
    'type': 'text',
    'text': reply.replace('$$', favoriteNum.toString())
  }];

  UrlFetchApp.fetch(baseUrl + 'message/reply', {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + channelToken,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': jsonEvent.replyToken,
      'messages': messages,
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'OK.'})).setMimeType(ContentService.MimeType.JSON);
}

function initialiseSpreadSheet(spreadSheet) {
  var activeSheet = spreadSheet.getActiveSheet();
  // compare header values to see if it's already initialised
  if (activeSheet.getRange('A1').getValue() === 'ID' && activeSheet.getRange('B1').getValue() === '名前' && activeSheet.getRange('C1').getValue() == 'ボールの個数') {
    return;
  }
  if (activeSheet.getLastRow() !== 0 || activeSheet.getLastColumn() !== 0) {
    // if not initialised, insert new sheet at position 0 and focus on it
    spreadSheet.renameActiveSheet('[Archive]' + new Date().toISOString().substring(0, 10));
    spreadSheet.insertSheet(0);
    activeSheet = spreadSheet.getActiveSheet();
  }
  activeSheet.getRange('A1:C1').setValues([['ID', '名前', itemName]]);
  activeSheet.getRange('E1').setValue('このスプレッドシートの改変しないでください。データの破損に繋がる恐れがあります。');
}

function convertToHalfWidth(text) {
  return text.replace(
    /[\uff01-\uff5e]/g,
    function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); }
    );
}

//   This code is licensed by Yuto Takano under GNU General Public License v3.0. Full license omitted for brevity.
