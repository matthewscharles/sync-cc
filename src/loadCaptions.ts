/**
 * Load captions from file and set up an XMLHttpRequest
 * @param {string} filename 
 */
export const loadCaptions = function(filename){
    this.filename = filename;
    var request = new XMLHttpRequest();
    request.captionTarget = this;
    request.onload = this.requestListener;
    request.onerror = this.requestError;
    request.open('get', `./${this.filename}`, true);
    request.send();
}