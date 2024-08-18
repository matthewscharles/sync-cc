import { convertTimeToMs } from "./convertTimeToMs";

/**
 * Split the captions up
 * @param {string} script 
 * @returns {Array}
 */

export const splitCaptions = function(script){
    // something is going wrong with scope/this around the HTTPrequest, so duplicating the convertTimeToMs function here
    // function convertTimeToMs(timeString){
    //     if(timeString=="" || typeof timeString=="undefined") {
    //         // input is blank, return blank string
    //         return "";
    //     }
    //     let timeSplit=timeString.split(':')
    //     let time = {
    //         hours:      parseInt(timeSplit[0]),
    //         minutes:    parseInt(timeSplit[1]),
    //         seconds:    parseInt(timeSplit[2].split('.')[0]),
    //         ms:         parseInt(timeSplit[2].split('.')[1])
    //     }
    //     let totalMs = time.ms + (time.seconds*1000) + (time.minutes*60*1000) + (time.hours*60*60*1000)
    //     return totalMs/1000;
    // }


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