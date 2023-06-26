(()=>{"use strict";function t(t){const n=t.trim().split(/\n\s*\n/).map(((t,n)=>{const e=t.trim().split(/\n/),[i,r]=e[1].split(" --\x3e "),s=[i.replace(",","."),r.replace(",",".")],o=e.slice(2).join("\n");return`${n+1}\n${s[0]},${s[1]}\n${o}\n`}));return n.join("")}const n=function(n){this.script={},this.timeline=[],this.filename="",this.container=n,window.srtToSbv=t};(n.prototype={}).constructor=n,n.prototype.setContainer=function(t){this.container=t},n.prototype.updateCaptions=function(t,n=!0,e=!0){let i="";if(!n)return this.container.style.opacity=0,!1;let r=this.timeline.find((n=>n.startS<=t&&n.endS>=t));void 0!==r?(r.content.forEach(((t,n)=>{i+=t,n<r.content.length-1&&(i+="<br>")})),i!=this.container.innerHTML&&(this.container.innerHTML="",this.container.innerHTML=i),this.container.style.opacity=e?1:0):(this.container.innerHTML="",this.container.style.opacity=0)},n.prototype.checkNextDescriptionTime=function(t){let n=t.getCurrentTime(),e=Math.floor(sbvCaptions.timeline.find((t=>t.startS>=n&&t.endS>=n)).startS-n);e>6&&null!=typeof StatusVO&&StatusVO.update(`audio description starting in ${e} seconds`)},n.prototype.convertTimetoMs=function(t){if(""==t||void 0===t)return console.log("nothing to convert..."),"";let n=t.split(":"),e=parseInt(n[0]),i=parseInt(n[1]),r=parseInt(n[2].split(".")[0]);return(parseInt(n[2].split(".")[1])+1e3*r+60*i*1e3+60*e*60*1e3)/1e3},n.prototype.splitCaptions=function(t){function n(t){if(""==t||void 0===t)return"";let n=t.split(":"),e=parseInt(n[0]),i=parseInt(n[1]),r=parseInt(n[2].split(".")[0]);return(parseInt(n[2].split(".")[1])+1e3*r+60*i*1e3+60*e*60*1e3)/1e3}let e=[];return t.forEach(((t,i)=>{if(""==t)return;let r={start:t.split("\n")[0].split(",")[0],end:t.split("\n")[0].split(",")[1],content:t.split("\n").slice(1)};r.startS=n(r.start),r.endS=n(r.end),e.push(r)}),this),e},n.prototype.requestListener=function(){this.captionTarget.script.events=this.responseText.split("\n\n"),this.captionTarget.timeline=this.captionTarget.splitCaptions(this.captionTarget.script.events,this.captionTarget)},n.prototype.requestError=function(t){console.error("Fetch Error",t)},n.prototype.loadCaptions=function(t){this.filename=t;var n=new XMLHttpRequest;n.captionTarget=this,n.onload=this.requestListener,n.onerror=this.requestError,n.open("get",`./${this.filename}`,!0),n.send()};const e=n;window.syncCC=new e(document.querySelector("#captions_div"))})();