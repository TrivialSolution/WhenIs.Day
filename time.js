//helper code to parse URL query string
let query = window.location.search.substring(1); //save url
console.log(window.location);
if (query.includes("obfsc=8&")) { //if url is obfuscated, de-obfuscate
	query = atob(query.replace("obfsc=8&",""));
}
let vars = query.split("&");
function getQueryVariable(variable) {
	for (let i=0;i<vars.length;i++) {
		let pair = vars[i].split("=");
		if(pair[0] == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
	return(false);
}

//Parsing the User settings from the query URL
//Technically it would be more efficient to just pass all of these things to the DOM directly
//but that would create serious content injection issues. Managing styles individually is safer.

let now = new Date();

// Set the countdown target time. query variable name date.
// Ideally the person entering the URL is entering a UTC time (using a Z at the end of the date string).
// This way the countdown works the same for users anywhere; i.e. a user in one location can send the page to a user in a different timezone,
// and the countdown should run out at the same absolute time for both of them. 
// Local times (without the Z at the end) can still be entered but will cause different behavior in different time zones.
let targetDate = new Date(getQueryVariable("date")).getTime();
// if no date is selected, use the current time.
if (isNaN(targetDate)||!getQueryVariable("date")) {
	targetDate = now.getTime();
}

// page title. query variable name title.
// innerText is used instead of innerHTML because since elements are populated using the URL contents there is a significant risk of content injection.
let titleText = getQueryVariable("title");
//if no title was supplied, make title blank
if (!getQueryVariable("title")) {
	titleText = "";
}
document.title = titleText;
document.getElementById("title").innerText = titleText;

// finish text. query variable name finish.
// If finish text is not supplied (is false), timer simply stops at 0.
let finishText = getQueryVariable("finish");
if (getQueryVariable("finish") == false) {
	finishText = false;
}

//Countup. query variable name countUp.
//Counts up from a time in the past if enabled. -1 corresponds to true; 1 to false.
//For instance, if you want to record "How long since...?"
let countUp = 1
if (!!getQueryVariable("countUp")) {
	countUp = -1;
}

//fixed duration rather than target time. query variable name duration.
//if countup, count up from <duration> seconds ago. if countdown, count down to <duration> seconds from now. Negatives get abs'd.
let duration = 0;
if (!isNaN(parseInt(getQueryVariable("duration")))) {
	if (countUp == 1){//if countup false
		targetDate = now.getTime() + Math.abs(parseInt(getQueryVariable("duration")))*1000;
	} else {//if countup true
		targetDate = now.getTime() - Math.abs(parseInt(getQueryVariable("duration")))*1000;
	}
}

//recurring event. query variable name recur.
//The timer will always count to/from the nearest relevant occurence. options are "daily", "yearly".
//This means that the year (or the day, if applicable) supplied by the user will be ignored.
//this option functionally does nothing if "duration" is selected.
if (getQueryVariable("recur") == "daily") {
	if (countUp == 1){ //if countup false (ie counting down)
		//reschedule target to next occurrence
		targetDate=now.getTime()+((((targetDate - now.getTime()) % (1000 * 60 * 60 * 24)) + (1000 * 60 * 60 * 24)) % (1000 * 60 * 60 * 24))
	} else { //if countup true
		//reschedule target to previous occurrence
		targetDate=now.getTime()-((((now.getTime() - targetDate) % (1000 * 60 * 60 * 24)) + (1000 * 60 * 60 * 24)) % (1000 * 60 * 60 * 24))
	}
} else if (getQueryVariable("recur") == "yearly") {  
	//due to leap years it is not sufficient to simply change the year or mod 365 days.
	//instead set year of target to current year, then adjust one year forward or backward accordingly.
	let datePlaceholder = new Date();  //temporarily make a date object version of targetDate for year manipulation
	datePlaceholder.setTime(targetDate);
	if (countUp == 1){ //if countup false (ie counting down)
		//reschedule target to next occurrence
		datePlaceholder.setFullYear(now.getFullYear()); //reschedule targetDate to current year
		if (now.getTime()-datePlaceholder.getTime()>0) {//if targetDate is in the past
			datePlaceholder.setFullYear(now.getFullYear() + 1);
		}
		targetDate = datePlaceholder.getTime(); //reschedule targetDate to next year
	} else { //if countup true
		//reschedule target to previous occurrence
		datePlaceholder.setFullYear(now.getFullYear()); //reschedule targetDate to current year
		if (now.getTime()-datePlaceholder.getTime()<0) {//if targetDate is in the future
			datePlaceholder.setFullYear(now.getFullYear() - 1); //reschedule targetDate to last year
		}
		targetDate = datePlaceholder.getTime(); 
	}
} 

//toggle fractions of seconds. query variable name decimals.
//the decimals variable is later used to determine how many decimal places to display.
//a little bit of checking to make sure only integers 0-3 get used.
let decimals = 0;
if (!isNaN(parseInt(getQueryVariable("decimals")))) {
	decimals = Math.max(Math.min(getQueryVariable("decimals"),3),0);
}

//background video. query variable bgVid.
//takes a youtube link. this overrides other background options.
//takes in youtube video identifier of form dQw4w9WgXcQ and converts to form 
//https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0&showinfo=0&mute=1&rel=0&autoplay=1&loop=1&playlist=dQw4w9WgXcQ
//note that many vidoes will not work due to embed restrictions. or because youtube just feels like not working. or because CORS policies.
if (!!getQueryVariable("bgVid")) {
	let embed = "https://www.youtube.com/embed/" + getQueryVariable("bgVid") + "?controls=0&showinfo=0&mute=1&rel=0&autoplay=1&loop=1&playlist=" + getQueryVariable("bgVid");
	document.getElementById("backgroundVideoFrame").setAttribute("src", embed);
	document.getElementById("backgroundVideoFrame").style.visibility = "visible";
}

//background image. query variable name bgImg.
//if background image invalid the browser will fall back to background color anyways so no extra error handling here
document.body.style.backgroundImage = "url(" + getQueryVariable("bgImg") + ")"; 
document.body.style.backgroundSize = "cover"; 

//background color. query variable name bgCol.
//overwritten by background image if applicable. Default is white.
document.body.style.backgroundColor = getQueryVariable("bgCol"); 

//finish text color. query variable name finishCol.
//save as a variable since finish text gets updated when the timer runs out.
//for instance if you want the timer to turn red when time runs out.
let finishCol = getQueryVariable("finishCol");

//general text color. query variable name textCol.
document.body.style.color = getQueryVariable("textCol");

//textshadow color. query variable name shadowCol.
//intended to improve readability with certain backgrounds. default is no textshadow.
document.body.style.textShadow = "2px 2px " + getQueryVariable("shadowCol");

//box color. query variable name boxCol.
//puts a background box around the text to improve readability. default is transparent (no box).
document.getElementById("box").style.backgroundColor = getQueryVariable("boxCol");

//underline timer. query variable underline.
//puts a line under the timer numbers. Intended to make reading the labels easier. default is no underline.
if (!!getQueryVariable("underline")) {
	Array.from(document.getElementsByClassName("time")).forEach((element) => {
		element.style.textDecoration="0.2rem underline";
	});
}

//show/hide time labels. query variable name hideLabels.
//If preference is not supplied (is false), make labels visible. (default is visible)
if (!!getQueryVariable("hideLabels")) {
	Array.from(document.getElementsByClassName("label")).forEach((element) => {
		element.style.display="none";
	});
}

// show/hide days. query variable name hideDays.
// default is show days. Note that since removing elements messes with the grid the grid is resized.
let hideDays = !!getQueryVariable("hideDays") //cast as boolean
if (hideDays) {
	Array.from(document.getElementsByClassName("days")).forEach((element) => {
		element.style.display="none";
	});
	document.getElementById("timer").style.gridTemplateColumns = "min-content min-content min-content min-content min-content";
}

//Main
// Countdown display. Update every 30ms (roughly 30fps)
var x = setInterval(function() {

	// Refresh the current date and time.
	now = new Date();
	//if recur is enabled we also need to check if the target time needs to wrap around
	if (getQueryVariable("recur") == "daily") {
		if (countUp == 1){ //if countup false (ie counting down)
			//reschedule target to next occurrence
			targetDate=now.getTime()+((((targetDate - now.getTime()) % (1000 * 60 * 60 * 24)) + (1000 * 60 * 60 * 24)) % (1000 * 60 * 60 * 24))
		} else { //if countup true
			//reschedule target to previous occurrence
			targetDate=now.getTime()-((((now.getTime() - targetDate) % (1000 * 60 * 60 * 24)) + (1000 * 60 * 60 * 24)) % (1000 * 60 * 60 * 24))
		}
	} else if (getQueryVariable("recur") == "yearly") {  
		//due to leap years it is not sufficient to simply change the year or mod 365 days.
		//instead set year of target to current year, then adjust one year forward or backward accordingly.
		let datePlaceholder = new Date();  //temporarily make a date object version of targetDate for year manipulation
		datePlaceholder.setTime(targetDate);
		if (countUp == 1){ //if countup false (ie counting down)
			//reschedule target to next occurrence
			datePlaceholder.setFullYear(now.getFullYear()); //reschedule targetDate to current year
			if (now.getTime()-datePlaceholder.getTime()>0) {//if targetDate is in the past
				datePlaceholder.setFullYear(now.getFullYear() + 1);
			}
			targetDate = datePlaceholder.getTime(); //reschedule targetDate to next year
		} else { //if countup true
			//reschedule target to previous occurrence
			datePlaceholder.setFullYear(now.getFullYear()); //reschedule targetDate to current year
			if (now.getTime()-datePlaceholder.getTime()<0) {//if targetDate is in the future
				datePlaceholder.setFullYear(now.getFullYear() - 1); //reschedule targetDate to last year
			}
			targetDate = datePlaceholder.getTime(); 
		}
	} 
	// Find the distance between now and the count down date
	// countUp = -1 if enabled.
	let distance = countUp*(targetDate - now.getTime());
    
	// calculations for hours, minutes, seconds
	// alter caulcation based on whether days will be displayed or everything is in hours
	if (!hideDays) {
		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
		let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		document.getElementById("days").innerText = days.toString().padStart(2, "0");
		document.getElementById("hours").innerText = hours.toString().padStart(2, "0");
	} else {
		let hours = Math.floor(distance/(1000 * 60 * 60));
		document.getElementById("hours").innerText = hours.toString().padStart(2, "0");
	}

	let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = ((distance % (1000 * 60)) / 1000);
    
	// Output the result in timer div
	document.getElementById("minutes").innerText = minutes.toString().padStart(2, 0);
	//display seconds. adds decimals as appropriate. !!casts to boolean (1 or 0).
	//toFixed() does not work here because it rounds, causing the seconds to read "60" occasionally when decimals=0.
	document.getElementById("seconds").innerText = (seconds.toString()+"000000").slice(0,seconds.toString().lastIndexOf(".")+decimals+!!decimals).padStart(!!decimals+decimals+2, 0);
    
	// If the countdown ends, replace the timer with text
	if (distance < 0) {
		clearInterval(x);
		if (finishText) {// if no finish text was supplied, just stop the timer at 0.
			document.getElementById("timer").innerText = finishText;
			document.getElementById("timer").style.color = finishCol;
		} else {
			document.getElementById("days").innerText = "00";
			document.getElementById("hours").innerText = "00";
			document.getElementById("minutes").innerText = "00";
			document.getElementById("seconds").innerText = Number(0).toFixed(decimals).toString().padStart(!!decimals+decimals+2, 0);
		}
  	}
}, 30);
