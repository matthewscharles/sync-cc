/**
 * Update captions
 * @param {*} time              Timestamp
 * @param {*} display           Display?
 * @param {boolean} enabled     Check if captions are enabled overall -- this needed to be separate in the original application.
 * @returns {void}
 */

SyncCC.prototype.updateCaptions = function(time: string, display=true, enabled = true){
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
