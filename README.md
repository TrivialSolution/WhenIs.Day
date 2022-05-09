# StaticTimer
A static webpage that displays a countdown, and can be customized using URL query strings. All processing is done client-side, meaning no server is required.

Make your own custom timer at [whenis.day/make](https://whenis.day/make).

### Examples
The variety of settings available allow the static time.html page to display a wide variety of timers.
* [A countdown to a date in the future](https://whenis.day/time?date=2061-07-28T00%3A00%3A00&title=When%20will%20Halley's%20Comet%20return%3F&)
* [A page that starts a 5 minute timer every time it is opened](https://whenis.day/time?date=T&hideDays=1&duration=300&decimals=2&)
* [A clock that displays the current time in India](https://whenis.day/time?date=2022-05-08T18%3A30%3A00.000Z&title=Time%20in%20India&hideLabels=1&hideDays=1&countUp=1&recur=daily&)
* [A more advanced page showing off a variety of cosmetic tweaks (including a background video) and hides its contents in the URL](https://whenis.day/time?obfsc=8&ZGF0ZT1UJnRpdGxlPVRpbWUlMjBTaW5jZSUyMExhc3QlMjBSaWNrcm9sbCUzQSZkZWNpbWFscz0yJnRleHRDb2w9JTIzZmZmZmZmJnNoYWRvd0NvbD0lMjMwMDAwMDAmaGlkZUxhYmVscz0xJmhpZGVEYXlzPTEmYmdWaWQ9ZFF3NHc5V2dYY1EmY291bnRVcD0xJmR1cmF0aW9uPTAm)

Note that daylight savings time may appear to break certain timers. For instance, if you have a countdown to a recurring meeting at 5pm daily and use the "sync" option in make.html to synchronize the timer for people across multiple time zones, the countdown will not adjust itself when your time zone shifts, because it is synchronized based on UTC. Using the local time setting will cause the timer to adjust for daylight savings (though it may require a page refresh), but will not synchronize across time zones. 

## Usage
StaticTimer consists of two webpages:
* time.html, a static page which displays a countdown (or countup) based on parameters set in the URL query string
* make.html, a static page which supplies an interface for generating functional links to time.html

Also included in the repository are a .htaccess file (which removes the .html from the page URLs), a CNAME file (which allows the whenis.day website to be hosted from github pages), and this file, README.md, which explains the project.

### Make.html
Open the make page to generate custom links to timers on the time page. Adjust the settings in the panel on the left. Clicking the "generate" button in the bottom right will create a link to the corresponding timer, and display a preview of it on the right. Clicking the "copy" button will copy the link to the clipboard. 

The preview window is a 16:9 aspect ratio by default. In browsers that follow proper web standards, it can be resized vertically by dragging on its bottom right corner, and horizontally by dragging on the bottom right corner of the settings pane.

#### Options

The time page has fairly boring default behavior for each of the options if they are not selected.

| Option  | Query Variable Name | Query Variable Value | Description |
| ------- | ------------------- | -------------------- | ----------- |
| Date | `date` | **YYYY-MM-DD**THH:MM:SSZ | The target date that the timer will count down to or up from. Clicking on this field will bring up a calendar date picker in most browsers. This is passed in the query string in ISO 8601 format. If this is not supplied, the timer will default to the time the page is loaded, which will cause a countdown to instantly complete. If counting up, the page will count from the moment the page loads. If a fixed duration is set later in the settings, the date option is overridden. |
| Time | `date` | YYYY-MM-DDT**HH:MM:SS**Z | Same deal as date, but with less convenient picker support. Specify hours:minutes:seconds. Depending on your browser you may need to specify AM or PM. When the make page loads, it defaults to a time one hour in the future. |
| Time Zone | `date` | YYYY-MM-DDTHH:MM:SS**Z** | Choose whether the timer counts in local time or absolute time. If "sync" is selected, the value displayed on the time page will be the same everywhere; for instance, the countdown to a global product launch will hit zero at the same time everywhere in the world. If "local" is selected, the timer will adjust to the local time; for instance, a countdown to New Year will reach midnight at different times around the world. |
| Page Title | `title` | *string* | The name of the page. This is text that will appear above the timer numbers themselves, as well as become the name of the tab. |
| Completion Text | `finish` | *string* | The text that displays when a countdown reaches 0. For instance, you can have a message like "Time's up!" or "Congratulations!" appear at the end of a countdown. If not specified, the timer simply reaches 0 and stops. |
| Decimals | `decimals` | *integer* | How many decimal places seconds should display. This is purely cosmetic, since target times can't be specified to more precision than one second. An integer between 0 and 3, inclusive. Default is no decimals. |
| Underline | `underline` | *boolean* | Whether to include an underline beneath the numbers in the counter. Default is no underline. |
| Hide Labels | `hideLabels` | *boolean* | Whether to hide the unit labels for each number in the timer. Default is display labels. |
| Hide Days | `hideDays` | *boolean* | Whether to hide the days in the timer, making the largest unit hours. Default is to show days. |
| Text Color | `textCol` | #RRGGBB | The color of the title and timer text. Default is black. |
| Finish Color | `finishCol` | #RRGGBB | The color of the optional finish text when the counter finishes; for instance, if you want the words "Time's Up! to be red. Default is black. |
| Text Shadow | `shadowCol` | #RRGGBB | Sets the color of the drop shadow beneath the text. The default is no drop shadow. |
| Box | `box` | #RRGGBB | Sets the color of a box around the text. Usually used to make the text more visible on a hard-to-see background. Default is no box around the text. |
| Background Image | `bgImg` | image link | The link to an image background. This should be a file , e.g. PNG, SVG, JPG, GIF, etc., and not a webpage itself. If no background image is specified or the image link is invalid, the background color will be displayed. |
| Background Color | `bgCol` | #RRGGBB | A background color. This will display if no other background options are selected. The default is white. |
| Background Video | `bgVid` | Youtube video ID | A link to a youtube video, which will automatically play muted in the background of the page. Many youtube videos have embed restrictions, which will cause the video to not play properly. The make file takes in a full youtube link, for instance `https://www.youtube.com/watch?v=dQw4w9WgXcQ`. The time file takes only the video ID, for instance `dQw4w9WgXcQ`. If no video is specified, the background image will display. |
| Count Up | `countUp` | *boolean* | Causes the timer to count upwards *from* a target date rather than down to one. For instance, if you want to record the amount of time elapsed since something occurred. Default is count down. |
| Recur | `recur` | "daily" or "yearly" | Causes the timer to always count to/from the nearest instance of a date/time within a given interval. For instance, if daily is selected, then the date specified does not matter, as the time will always count to the next occurrence, whether today or tomorrow. When that time arrives, the counter will roll over and reset rather than finishing. By default events are assumed one-time (not recurring). |
| Duration | `duration` | *integer* | Causes the timer to ignore the target date and instead use a set offset. The number supplied is the number of seconds from/until the opening of the page to set the target time. Use when you want to count up/down relative to the user opening the time page, for instance to make simple stopwatch pages. Default is disabled. |
| Obfuscate | `obfsc=8` | N/A | When enabled in make, encodes the rest of the query string in base64 to make it harder to read. Use when you [want to avoid spoilers](https://whenis.day/time?obfsc=8&ZGF0ZT1UJnRpdGxlPVRpbWUlMjBTaW5jZSUyMExhc3QlMjBSaWNrcm9sbCUzQSZkZWNpbWFscz0yJnRleHRDb2w9JTIzZmZmZmZmJnNoYWRvd0NvbD0lMjMwMDAwMDAmaGlkZUxhYmVscz0xJmhpZGVEYXlzPTEmYmdWaWQ9ZFF3NHc5V2dYY1EmY291bnRVcD0xJmR1cmF0aW9uPTAm). Default is not obfuscated. |

### Time.html
Alternatively, you may decide to use the time page directly by writing query strings, without requiring the make page. These are passed in the format:

`example.com/time?variable1=value1&variable2=value2`

and so on. Not including a variable will cause it to exhibit default behavior.

### Self-hosting
Because StaticTimer is fully static, it is easy to host. In most cases, all you have to do is upload the files to a directory on your website. [Github link is here](https://github.com/Lithovox/StaticTimer/).

Doing so will cause the make page to appear at URL/make, and the time page to appear at URL/time. For instance, if your website's domain is example.com, and you upload the files to the folder /countdown/, then example.com/countdown/time will link to the time page.

Make.html, make.js, and make.css are not required for the time page to function. If you are comfortable editing query variables manually, or want to use the maker elsewhere, you can do so. .htaccess also does not affect the functionality of the time page, except to change its address from simply "time" to "time.html".
