/**
 * Sync captions to an external video source and place in an HTML container.
 * @class
 * @property {Object}   script
 * @property {Array}    timeline
 * @property {String} filename
 * @property {HTMLElement} container
 */

const CaptionsSBV = function(container){
    this.script     =   {};
    this.timeline   =   [];
    this.filename   =   '';
    this.container  =   container;
}

CaptionsSBV.prototype = {}

CaptionsSBV.prototype.constructor = CaptionsSBV;


/**
 * Update captions
 * @param {*} time              Timestamp
 * @param {*} display           Display?
 * @param {boolean} enabled     Check if captions are enabled overall -- this needed to be separate in the original application.
 * @returns {void}
 */

CaptionsSBV.prototype.updateCaptions = function(time, display=true, enabled = true){
    if(!display){
        this.container.style.opacity = 0;
        return false;
    }
    let msg = sbvCaptions.timeline.find(entry => (entry.startS <= time && entry.endS >= time));
    this.container.innerHTML = "";

    if (typeof msg != 'undefined'){
        msg.content.forEach((x,i)=>{
            // text(x,width/2,i*30+height/2)
            this.container.innerHTML+=x;
            if(i<msg.content.length-1)this.container.innerHTML+='<br>';
        })
        this.container.style.opacity = enabled ? 1 : 0
    } else {
        this.container.style.opacity = 0;
    } 
}

/**
 * Check the current time of the player, set nextDescription to the next available entry.<br>
 * If the next description is over 6 seconds away, send a screenreader message to notify the user. 
 */

 CaptionsSBV.prototype.checkNextDescriptionTime = function(){
    let time = player.getCurrentTime();
    let nextDescription = Math.floor(sbvCaptions.timeline.find(entry => (entry.startS >= time && entry.endS >= time)).startS-time);
    // If the next description is a while away (over six seconds), let the user know through their screen reader of choice.
    if (nextDescription > 6 && typeof StatusVO != undefined) StatusVO.update(`audio description starting in ${nextDescription} seconds`);
}

/**
 * Convert time string to seconds
 * @param {string} timeString 
 * @returns {number} time in seconds, or blank string if blank ?!
 */

CaptionsSBV.prototype.convertTimetoMs = function convertTimeToMs(timeString){
    if(timeString=="" || typeof timeString=="undefined") {
        // input is blank, return blank string
        return ""
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

/**
 * Split the captions up
 * @param {string} script 
 * @returns {Array}
 */

CaptionsSBV.prototype.splitCaptions = function(script){
    let output = []
    text.forEach((event,i)=>{
        if(event=="")return;
            let lineTest={
                start:event.split('\n')[0].split(',')[0],
                end:event.split('\n')[0].split(',')[1],
                content:event.split('\n').slice(1)
            } 
            lineTest.startS = this.convertTimeToMs(lineTest.start)
            lineTest.endS = this.convertTimeToMs(lineTest.end)
            output.push(lineTest)
    })

    return output;
}


/**
 * Call the method to split the captions up and set the timeline from the results.
 */

 CaptionsSBV.prototype.requestListener = function requestListener() {
    this.captionTarget.script.events = this.responseText.split('\n\n')
    this.captionTarget.timeline = this.captionTarget.splitCaptions(this.captionTarget.script.events);
}

/**
 * Show error
 * @param {*} err 
 */

CaptionsSBV.prototype.requestError = function requestError(err) {
    console.error('Fetch Error', err);
}

/**
 * Load captions from file and set up an XMLHttpRequest
 * @param {string} filename 
 */

CaptionsSBV.prototype.loadCaptions = function(filename, captionsObject){
    captionsObject.filename = filename;
    var request = new XMLHttpRequest();
    request.onload = captionsObject.requestListener;
    request.onerror = captionsObject.requestError;
    request.open('get', `./${captionsObject.filename}`, true);
    request.send();
}


module.exports = CaptionsSBV;