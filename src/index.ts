import { srtToSbv } from './srtToSbv';

interface CaptionEntry {
    startS: number;
    endS: number;
    content: string[];
}

/**
 * Sync captions to an external video source and place in an HTML container.
 * @class
 * @property {Object} script
 * @property {Array} timeline
 * @property {String} filename
 * @property {HTMLElement} container
 */

const SyncCC = function(container: HTMLElement): void {
    this.script     =   {};
    this.timeline   =   [];
    this.filename   =   '';
    this.container  =   container;
    // quick fix for testing
    
    (window as any).srtToSbv = srtToSbv;
}

SyncCC.prototype = {}

SyncCC.prototype.constructor = SyncCC;

SyncCC.prototype.setContainer = function(container){
    this.container = container;
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
    // something is going wrong with scope/this around the HTTPrequest, so duplicating the convertTimeToMs function here
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
                content:event.split('\n').slice(1),
                startS:0,
                endS:0
            } 
            lineTest.startS = convertTimeToMs(lineTest.start);
            lineTest.endS = convertTimeToMs(lineTest.end);
            output.push(lineTest);
    }, this)

    return output;
}

// SyncCC.prototype.updateCaptions
// SyncCC.prototype.requestListener
// SyncCC.prototype.checkNextDescriptionTime

/**
 * Show error
 * @param {*} err 
 */

SyncCC.prototype.requestError = function requestError(err) {
    console.error('Fetch Error', err);
}

export { SyncCC };