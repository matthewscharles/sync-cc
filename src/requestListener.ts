/**
 * Call the method to split the captions up and set the timeline from the results.
 */

export const requestListener = function requestListener() {
    // console.log('requestListener', this.responseText, this.captionTarget);
    if(!this.captionTarget) {(window as any).textOutput = this.responseText; return false};
    this.captionTarget.script.events = this.responseText.split('\n\n')
    this.captionTarget.timeline = this.captionTarget.splitCaptions(this.captionTarget.script.events, this.captionTarget);
}