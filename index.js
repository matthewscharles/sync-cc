/**
 * Convert .srt captions to .sbv format.
 * @param {string} srtString 
 * @returns {string} captions in .sbv format
 */

function srtToSbv(srtString) {
    // Split the string into individual captions
    const captions = srtString.trim().split(/\n\s*\n/);
  
    // Convert each caption to the .sbv format, removing the arrow ("-->") character
    const sbvCaptions = captions.map((caption, index) => {
      // Split the caption into its individual lines
      const lines = caption.trim().split(/\n/);
  
      // Extract the start and end times from the first line
      const [startTime, endTime] = lines[1].split(' --> ');
  
      // Format the start and end times
      const times = [startTime.replace(',', '.'), endTime.replace(',', '.')];

      // Join the remaining lines to form the caption text
      const text = lines.slice(2).join('\n');
  
      // Combine the formatted start and end times and the caption text to form a single string
      const output = `${times[0]},${times[1]}\n${text}\n`;

      return output;
    });
  
    // Join the .sbv captions into a single string
    return sbvCaptions.join('');
  }


/**
 * Sync captions to an external video source and place in an HTML container.
 * @class
 * @property {Object}   script
 * @property {Array}    timeline
 * @property {String} filename
 * @property {HTMLElement} container
 */

const SyncCC = function(container){
    this.script     =   {};
    this.timeline   =   [];
    this.filename   =   '';
    this.container  =   container;
    // quick fix for testing
    window.srtToSbv = srtToSbv;
}

SyncCC.prototype = {}

SyncCC.prototype.constructor = SyncCC;

SyncCC.prototype.setContainer = function(container){
    this.container = container;
}

/**
 * Update captions
 * @param {*} time              Timestamp
 * @param {*} display           Display?
 * @param {boolean} enabled     Check if captions are enabled overall -- this needed to be separate in the original application.
 * @returns {void}
 */

SyncCC.prototype.updateCaptions = function(time, display=true, enabled = true){
    let output="";

    if(!display){
        this.container.style.opacity = 0;
        return false;
    }

    let msg = this.timeline.find(entry => (entry.startS <= time && entry.endS >= time));

    if (typeof msg != 'undefined'){
        msg.content.forEach((x,i)=>{        
            output+=x;
            if(i<msg.content.length-1) output+='<br>';
        })

        if(output!=this.container.innerHTML){            
            this.container.innerHTML = "";
            this.container.innerHTML = output;
        } else {

        }
        // todo: look into adding/removing classes instead of setting opacity -- more flexibility
        this.container.style.opacity = enabled ? 1 : 0;

    } else {
        this.container.innerHTML = ""
        this.container.style.opacity = 0;
    } 
}

/**
 * Check the current time of the player, set nextDescription to the next available entry.<br>
 * If the next description is over 6 seconds away, send a screenreader message to notify the user. 
 * @param {Object} player generated by YT API
 */

 SyncCC.prototype.checkNextDescriptionTime = function(player){

    let time = player.getCurrentTime();
    let nextDescription = Math.floor(sbvCaptions.timeline.find(entry => (entry.startS >= time && entry.endS >= time)).startS-time);
    // If the next description is a while away (over six seconds), let the user know through their screen reader of choice.
    if (nextDescription > 6 && typeof StatusVO != undefined) {
        StatusVO.update(`audio description starting in ${nextDescription} seconds`)
    };

}

/**
 * Convert time string to seconds
 * @param {string} timeString 
 * @returns {number} time in seconds, or blank string if blank ?!
 */

SyncCC.prototype.convertTimetoMs = function(timeString){
    if(timeString=="" || typeof timeString=="undefined") {
        // input is blank, return blank string
        console.log('nothing to convert...');
        return "";
    }
    let timeSplit=timeString.split(':')
    let time = {
        hours:      parseInt(timeSplit[0]),
        minutes:    parseInt(timeSplit[1]),
        seconds:    parseInt(timeSplit[2].split('.')[0]),
        ms:         parseInt(timeSplit[2].split('.')[1])
    }
    let totalMs = time.ms + (time.seconds*1000) + (time.minutes*60*1000) + (time.hours*60*60*1000);
    return totalMs/1000;
}

/**
 * Split the captions up
 * @param {string} script 
 * @returns {Array}
 */

SyncCC.prototype.splitCaptions = function(script){
    // something is going wrong with scope/this around the httprequest, so duplicating the convertTimeToMs function here
    function convertTimeToMs(timeString){
        if(timeString=="" || typeof timeString=="undefined") {
            // input is blank, return blank string
            return "";
        }
        let timeSplit=timeString.split(':')
        let time = {
            hours:      parseInt(timeSplit[0]),
            minutes:    parseInt(timeSplit[1]),
            seconds:    parseInt(timeSplit[2].split('.')[0]),
            ms:         parseInt(timeSplit[2].split('.')[1])
        }
        let totalMs = time.ms + (time.seconds*1000) + (time.minutes*60*1000) + (time.hours*60*60*1000)
        return totalMs/1000;
    }


    let output = []
    script.forEach((event,i)=>{
        if(event=="")return;
            let lineTest={
                start:event.split('\n')[0].split(',')[0],
                end:event.split('\n')[0].split(',')[1],
                content:event.split('\n').slice(1)
            } 
            lineTest.startS = convertTimeToMs(lineTest.start);
            lineTest.endS = convertTimeToMs(lineTest.end);
            output.push(lineTest);
    }, this)

    return output;
}


/**
 * Call the method to split the captions up and set the timeline from the results.
 */

 SyncCC.prototype.requestListener = function requestListener() {
    // troubleshooting
    console.log('requestListener', this.responseText, this.captionTarget);
    if(!this.captionTarget) {window.textOutput = this.responseText; return false};
    this.captionTarget.script.events = this.responseText.split('\n\n')
    this.captionTarget.timeline = this.captionTarget.splitCaptions(this.captionTarget.script.events, this.captionTarget);
}

/**
 * Show error
 * @param {*} err 
 */

SyncCC.prototype.requestError = function requestError(err) {
    console.error('Fetch Error', err);
}

/**
 * Load captions from file and set up an XMLHttpRequest
 * @param {string} filename 
 */

SyncCC.prototype.loadCaptions = function(filename){
    this.filename = filename;
    var request = new XMLHttpRequest();
    request.captionTarget = this;
    request.onload = this.requestListener;
    request.onerror = this.requestError;
    request.open('get', `./${this.filename}`, true);
    request.send();
}

export default SyncCC;