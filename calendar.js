
var style_cookie_name = "style" ;
var style_cookie_duration = 30 ;

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
    $('#year').attr('value', new Date().getFullYear());
    $('#calendar h1').html(new Date().getFullYear());
    $('#year').focus();
    $('#print').click(function(event) {
        event.preventDefault();
        window.print();
    });
    $('#toggleConfiguration').click(function(event) {
        event.preventDefault();
        $('#configurationcontent').slideToggle('fast', 'swing');
    });
    makeCalendar();
}

function toggleHighlight() {
   $(this).nextUntil(".dayOfMonth").toggleClass("hovered", 1000);
   $(this).toggleClass("hovered", 1000);
   $(this).prevUntil(".weeknr").toggleClass("hovered", 1000);
}

function makeCalendar() {
  $('#calendar table tbody').empty();
  var year = $('#year').attr('value');
  $('#calendar h1').html(year);
  var type = $("input[@name='amount']:checked").val()
  var theme = $('#theme').val();
  if (!(typeof console == 'undefined')) {
    console.log("Making calendar for year " + year);
    console.log("Type " + type);
    console.log("Theme " + theme);
  }
  $("#theme1").attr("disabled", true);
  $("#theme2").attr("disabled", true);
  if (theme == "blue") {
    $("#theme1").attr("disabled", false);
  } else if (theme == "green") {
    $("#theme2").attr("disabled", false);
  }

  var easterSunday = calculateEasterSunday(new Date().getFullYear());
  var specialDays = [
        {"dayName": "1. nyttårsdag", "dayDate": new Date(year, 0, 1)},
        {"dayName": "1. påskedag", "dayDate": easterSunday},
        {"dayName": "Skjærtorsdag", "dayDate": easterSunday.clone().addDays(-3)},
        {"dayName": "Langfredag", "dayDate": easterSunday.clone().addDays(-2)},
        {"dayName": "2. påskedag", "dayDate": easterSunday.clone().addDays(1)},
        {"dayName": "Pinseaften", "dayDate": easterSunday.clone().addDays(49)},
        {"dayName": "1. pinsedag", "dayDate": easterSunday.clone().addDays(50)},
        {"dayName": "Kristi Himmelfartsdag", "dayDate": easterSunday.clone().addDays(39)},
        {"dayName": "Arbeidernes dag", "dayDate": new Date(year, 4, 1)},
        {"dayName": "Grunnlovsdagen", "dayDate": new Date(year, 4, 17)},
        {"dayName": "1. juledag", "dayDate": new Date(year, 11, 25)},
        {"dayName": "2. juledag", "dayDate": new Date(year, 11, 26)}
    ];

  var startMonth =0;
  var endMonth = Date.CultureInfo.monthNames.length;
  if (type=='h1') {
    endMonth = 6;
  } else if (type=='h2') {
    startMonth = 6;
  }

  for (j=0; j<32;j++) {
    var newTr = $("<tr />");
    $("#calendar table tbody").append(newTr);
    for (i=startMonth; i<endMonth; i++) {
      if (j == 0) {
        monthHeader = $("<td colspan=4 class='monthHeader'>" + Date.CultureInfo.monthNames[i] + "</td>");
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
          daynameFull = theDate.toString('dddd');
          daynr = theDate.getDate();
          weeknr = "&nbsp;";
          if (theDate.is().mon())
            weeknr = "Uke " + theDate.getWeek();

          var content = "&nbsp;";
          var markWeekend = false;
          for (var specialDayCount=0; specialDayCount<specialDays.length; specialDayCount++) {
            if (theDate.equals(specialDays[specialDayCount].dayDate)) {
              markWeekend = true;
              content = specialDays[specialDayCount].dayName;
            }
          }

          monthHeader = $("<td id='" + i + "-" + j + "' class='dayOfMonth'>"  + (daynr) + "</td><td class='dayName' title='"+ daynameFull    + "'>" + dayname + "</td><td class='content' title='" + theDate + "'>" + content + "</td><td class='weeknr' title='" + theDate + "'>" + weeknr + "</td>");
          monthHeader.addClass("day")

          if (markWeekend)
            monthHeader.addClass("weekend");

          if (j%2==0)
            monthHeader.addClass("zebra");

          if ((theDate.is().sun()))
            monthHeader.addClass("weekend");



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

  $('#calendar td').mouseenter(toggleHighlight);
  $('#calendar td').mouseleave(toggleHighlight);
  $('#year').focus();
}