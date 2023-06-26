# sync-cc
Synchronise captions to an external video source and place in an HTML container.
This currently handles SubViewer files (.sbv) files, which must be hosted and provided to the script separately.
A quick converter from .srt to .sbv is provided to the global scope for testing purposes (srtToSbv()).
This is work in progress and not necessarily ready for other people to use. Please get in touch if you are interested.

## instructions
```javascript
import SyncCC from 'sync-cc';
window.syncCC = new SyncCC(document.querySelector('#captions_div'));
syncCC.load('captions_sample.sbv');
```

Charles Matthews 2023