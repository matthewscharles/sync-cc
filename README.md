# Sync-CC
Synchronise a caption file to an external video source and place in an HTML container.

Once in place, these captions can be utilized creatively, such as triggering related events or interactions.

This is useful in scenarios where:

- Standard caption controls are unavailable or non-functional.
-	Users have disabled caption display, preventing detection of changes in the typical caption container.

## Application

An earlier version of this code was used in Joanne Cox's [Define Your Journey](https://blurringtheboundaries.org/dyj/) project.

## File support

This currently handles SubViewer files (.sbv) files, which must be hosted and provided to the script separately from the source YouTube video.

A quick converter from .srt to .sbv is provided to the global scope for testing purposes (**srtToSbv()**).

## Instructions
```javascript
import { SyncCC } from 'sync-cc';

// create an instance, identifying the container for captions
window.syncCC = new SyncCC(document.querySelector('#captions_div'));

// load the captions from an external .sbv file
syncCC.load('captions_sample.sbv');
```

Charles Matthews 2024
