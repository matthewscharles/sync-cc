/**
 * Convert time string to seconds
 * @param {string} timeString 
 * @returns {number} time in seconds, or blank string if blank ?!
 */

export const convertTimeToMs = function(timeString){
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
