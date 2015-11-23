function ensureNumberTwoDigits(nbr) {
  if (nbr < 10)
    return "0" + nbr;
  else
    return nbr;
}

function formatDateyymmddhhmm(myDate) {
  var result = "";
  var year = myDate.getFullYear();
  // getMonth() returns 0 through 11
  var month = myDate.getMonth() + 1;
  var day = myDate.getDate();
  var hours = myDate.getHours();
  var minutes = myDate.getMinutes();
  
  // get two digit year
  result += year;
  result = result.substring(2);
  result += "-";
  result += ensureNumberTwoDigits(month);
  result += "-";
  result += ensureNumberTwoDigits(day);
  result += " ";
  result += ensureNumberTwoDigits(hours);
  result += ":";
  result += ensureNumberTwoDigits(minutes);
  
  return result;
}

var lastTableElementArraySize = 0;
var lastEmailDateArraySize = 0;

// over time, the array changes, new emails come in, search adds emails to array, etc.
// run every second
setInterval(function() {
  // get all table cells associated with the date/time column
  var tableTimeCells = document.getElementsByClassName('xW xY');
  if (tableTimeCells.length > 0) {
    
    // if the content of the first cell and last cell look good, and the array has not changed size, skip this logic
    var firstCellText = tableTimeCells[0].firstElementChild.innerText; 
    var lastCellText = tableTimeCells[tableTimeCells.length - 1].firstElementChild.innerText;
    if (lastCellText.length == 14
      && firstCellText.length == 14
      && tableTimeCells.length == lastTableElementArraySize) {
      // early out, do nothing
    }
    else {
      lastTableElementArraySize = tableTimeCells.length;
    
      // interate over cells and replace content to include both date and time.
      for (i = 0; i < tableTimeCells.length; i++) {
        var cell = tableTimeCells[i];
        var dateText = cell.firstElementChild.title;
        // remove the word 'at' so we can parse with js Date
        dateText = dateText.replace(' at', ''); 
        var dateTextAsDate = new Date(dateText);
        var newCellText = formatDateyymmddhhmm(dateTextAsDate);
        cell.firstElementChild.innerText = newCellText;
        
        // must shrink text to fit
        cell.style.fontSize = "70%";
      }
    }
  }
  
  // get all elements associated with the date next to the subject of an open email
  var emailDates = document.getElementsByClassName('g3');
  if (emailDates.length > 0) {
    
    // determine if we have already run, early out logic
    var firstDateText = emailDates[0].innerText;
    if ((firstDateText.indexOf("AM") > 0
      || firstDateText.indexOf("PM") > 0)
      || lastEmailDateArraySize != emailDates.length) {
      
      lastEmailDateArraySize = emailDates.length;
      
      for (i = 0; i < emailDates.length; i++) {
        var dateSpan = emailDates[i];
        var dateText = dateSpan.title;
        var spanText = dateSpan.innerText; 
        // find the first "("  -- we want to preserve the relative time
        var paranIndex = spanText.indexOf("("); 
        var relativeTimeText = spanText.substring(paranIndex);
        
        // remove the word 'at' so we can parse with js Date
        dateText = dateText.replace(' at', ''); 
        var dateTextAsDate = new Date(dateText);
        
        // set new value
        var newSpanText = formatDateyymmddhhmm(dateTextAsDate);
        dateSpan.innerText = newSpanText + " " + relativeTimeText;
        
        // must shrink text to fit
        dateSpan.style.fontSize = "90%";
      }
    }
  }
  
}, 1000);