//initialize inputs
//set date input to today
let today = new Date();
let day = today.getDate();
let month = today.getMonth() + 1;
let year = today.getFullYear();
if (month < 10) month = "0" + month;
if (day < 10) day = "0" + day;    
document.getElementById("date").value = year + "-" + month + "-" + day;

//set time input default to 5 minutes from now
document.getElementById("time").value = new Date(new Date().getTime()+60*60*1000).toTimeString().slice(0,8);

//Based on user inputs on the page, generate a URL with query string to the corresponding timer page, and display a preview of that page.
function generate() {
    //Figure out URL path for final page
    let path = "";

    //get inputs, append to the URL string.

    //get date/time by adding elements to a string.
    let dateTime = "YYYY-MM-DDTHH:MM:SSZ"; //placeholder to remind proper format for date constructor.
    dateTime = document.getElementById("date").value + "T"; 
    dateTime += document.getElementById("time").value;
    if (document.getElementById("sync").value == "sync") {
        //if sync is slected, convert date to UTC string
        dateTime = new Date(dateTime).toISOString();
    } 
    path += "date=" + encodeURIComponent(dateTime) + "&";

    //add start/finish text. If blank, do not add.
    if (document.getElementById("title").value){
        path += "title=" + encodeURIComponent(document.getElementById("title").value) + "&";
    }
    if (document.getElementById("finish").value){
        path += "finish=" + encodeURIComponent(document.getElementById("finish").value) + "&";
    }

    //add cosmetic options
    if (document.getElementById("decimals").value < 4 && document.getElementById("decimals").value > 0) { // timer code checks for number so this is fine
        path += "decimals=" + encodeURIComponent(document.getElementById("decimals").value) + "&";
    }
    if (document.getElementById("bgImg").value) {
        path += "bgImg=" + encodeURIComponent(document.getElementById("bgImg").value) + "&";
    }
    if (document.getElementById("bgCol").value.toLowerCase()!=="#ffffff") { // if not default color, pass color.
        path += "bgCol=" + encodeURIComponent(document.getElementById("bgCol").value) + "&";
    }
    if (document.getElementById("textCol").value!=="#000000") { // if not default color, pass color.
        path += "textCol=" + encodeURIComponent(document.getElementById("textCol").value) + "&";
    }
    if (document.getElementById("finishCol").value!=="#000000") { // if not default color, pass color.
        path += "finishCol=" + encodeURIComponent(document.getElementById("finishCol").value) + "&";
    }
    //the following all have default behavior if no query string is provided.
    if (document.getElementById("shadow").checked) {
        path += "shadowCol=" + encodeURIComponent(document.getElementById("shadowCol").value) + "&";
    }
    if (document.getElementById("box").checked) {
        path += "boxCol=" + encodeURIComponent(document.getElementById("boxCol").value) + "&";
    }
    if (document.getElementById("underline").checked) {
        path += "underline=1&";
    }
    if (document.getElementById("hideLabels").checked) {
        path += "hideLabels=1&";
    }
    if (document.getElementById("hideDays").checked) {
        path += "hideDays=1&";
    }
    if (document.getElementById("bgVid").value) { //youtube background video link
        vidLink = document.getElementById("bgVid").value;
        let match = vidLink.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\?v=)([^#&?]*).*/); //regex to find video ID from link
        if (match && match[2].length == 11) {
            path += "bgVid=" + encodeURIComponent(match[2]) + "&";
        }
    }

    //add advanced options
    if (document.getElementById("countUp").value=="up") {
        path += "countUp=1&"; //Confusingly, setting countUp=1 in the url sets countUp=-1 in the timer.
    }
    if (document.getElementById("recur").value !== "no") {
        path += "recur=" + document.getElementById("recur").value + "&";
    }
    if (document.getElementById("duration").checked) {
        path += "duration=" + encodeURIComponent(document.getElementById("length").value) + "&";
    }
    if (document.getElementById("obfuscate").checked) {
        path = "obfsc=8&" + btoa(path);
    }

    //update output URL. Note that since it cuts off at the least / you may have to edit this if the maker is the website's root index page.
    path = window.location.href.slice(0,window.location.href.lastIndexOf("/")) + "/time?" + path; //replace page name with time page, add ? to start query string;

    document.getElementById("outputURL").textContent = path; 
    //update preview iFrame
	document.getElementById('preview').setAttribute("src",path);

    //Briefly set text on generate button to generated so user has some visual feedback.
    document.getElementById("generate").innerHTML = "Generated Timer!";
    setTimeout(function(){document.getElementById("generate").innerHTML = "Generate Timer";},800);
}

function copy(){
    navigator.clipboard.writeText(document.getElementById("outputURL").textContent);
    //Briefly set text on copy button to Copied so user has some visual feedback.
    document.getElementById("copy").innerHTML = "Copied Link!";
    setTimeout(function(){document.getElementById("copy").innerHTML = "Copy Link";},800);
}
//click a generate button
document.getElementById("generate").addEventListener("click", generate);
//add a copy text button
document.getElementById("copy").addEventListener("click", copy);