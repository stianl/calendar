function calculateEasterSunday(YR) {
/* http://www.merlyn.demon.co.uk/estralgs.txt
Anon, put in Wikipedia computus Discussion by A1jrj, 2008-05-01;
to JavaScript by JRS.

function MaybeGauss1(YR) {
*/

  var a, b, c, d, e, g, h, n, i, k, l
  a = YR%19
  c = YR%100 ; b = (YR-c)/100
  e = b%4 ; d = (b-e)/4
  g = ((8*b+13)/25)|0
  h = (19*a+b-d-g+15)%30
  m = ((a+11*h)/319)|0
  k = c%4 ; i = (c-k)/4
  l = (2*e+2*i-k-h+m+32)%7
  month = ((h-m+l+90)/25)|0
  day = (h-m+l+month+19)%32
  var easterSunday = new Date(YR, month-1, day);
  return easterSunday;
}

function init() {
    $('#remake').click(makeCalendar);
    $('#year').attr('value', '2011');
    $('#year').focus();
    makeCalendar();
}

function makeCalendar() {
  $('#calendar table').empty();
  var year = $('#year').attr('value');
  var type = $("input[@name='amount']:checked").val()
  console.log("Making calendar for year " + year);
  console.log("Type " + type);
  var monthNames = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];

  var newYears = new Date(year, 0, 1);
  var easterSunday = calculateEasterSunday(newYears.getFullYear());
  var easterThursday = easterSunday.clone().addDays(-3);
  var easterFriday = easterSunday.clone().addDays(-2);
  var easterMonday = easterSunday.clone().addDays(1);
  var whitmon = easterSunday.clone().addDays(49);
  var whitmon2 = easterSunday.clone().addDays(50);
  var ascen = easterSunday.clone().addDays(39);

  var may1 = new Date(year, 4, 1);
  var may17 = new Date(year, 4, 17);

  var boxing1 = new Date(year, 11, 25);
  var boxing2 = new Date(year, 11, 26);

  var startMonth =0;
  var endMonth = monthNames.length;
  if (type=='h1') {
    endMonth = 6;
  } else if (type=='h2') {
    startMonth = 6;
  }

  for (j=0; j<32;j++) {
    var newTr = $("<tr />");
    $("#calendar table").append(newTr);
    for (i=startMonth; i<endMonth; i++) {
      if (j == 0) {
        monthHeader = $("<td colspan=4 class='monthHeader'>" + monthNames[i] + "</td>");
        newTr.append(monthHeader);
      } else {
        daysInMonth = Date.getDaysInMonth(year, i);
        if (i == 3) {
          if (j == 4 || j == 5 || j == 6) {
            monthHeader.removeClass("zebra");
          }
        }

        if (j<=daysInMonth) {
          theDate = new Date(year, i, j);

          dayname = theDate.toString('ddd');
          daynr = theDate.getDate();
          weeknr = "&nbsp;";
          if (theDate.is().mon()) {
            weeknr = "Uke " + theDate.getWeek();
          }
          var content = "&nbsp;";
          monthHeader = $("<td id='" + i + "-" + j + "' class='daynr'>"  + (daynr) + "</td><td class='dayid'>" + dayname + "</td><td class='content'>" + content + "</td><td class='weeknr'>" + weeknr + "</td>");
          monthHeader.addClass("day")
          if (j%2==0)
            monthHeader.addClass("zebraDay");

          if ((theDate.is().sun())) {
            monthHeader.addClass("weekend");
          }

          if (theDate.equals(easterSunday) ||
            theDate.equals(easterMonday) ||
            theDate.equals(easterThursday) ||
            theDate.equals(easterFriday) ||
            theDate.equals(newYears) ||
            theDate.equals(boxing1) ||
            theDate.equals(boxing2) ||
            theDate.equals(whitmon) ||
            theDate.equals(whitmon2) ||
            theDate.equals(ascen) ||
            theDate.equals(may1) ||
            theDate.equals(may17)) {
              monthHeader.addClass("weekend");
              content = 'holy';
          }

          if (Date.today().equals(theDate))
            monthHeader.addClass("today");

          newTr.append(monthHeader);
          theDate.addDays(1);
        } else {
          newTr.append("<td colspan=4>&nbsp;</td>");
        }
      }
    }
  }
  $('#year').focus();
}