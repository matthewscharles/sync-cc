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


// SyncCC.prototype.updateCaptions
// SyncCC.prototype.requestListener
// SyncCC.prototype.checkNextDescriptionTime
// SyncCC.prototype.splitCaptions

/**
 * Show error
 * @param {*} err 
 */

SyncCC.prototype.requestError = function requestError(err) {
    console.error('Fetch Error', err);
}

export { SyncCC };