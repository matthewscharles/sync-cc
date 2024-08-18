/**
 * Convert .srt captions to .sbv format.
 * @param {string} srtString 
 * @returns {string} captions in .sbv format
 */

function srtToSbv(srtString: string): string {
    if (typeof srtString !== 'string') {
        throw new TypeError('Input must be a string');
    }
    // Split the string into individual captions
    const captions = srtString.trim().split(/\n\s*\n/);
  
    // Convert each caption to the .sbv format, removing the arrow ("-->") character
    const sbvCaptions = captions.map((caption, index) => {
      // Split the caption into its individual lines
        const lines = caption.trim().split(/\n/);
      
        if (lines.length < 2) {
            throw new Error('Invalid caption format');
        }
  
        // Extract the start and end times from the first line
        const [startTime, endTime] = lines[1].split(' --> ');
  
        // Format the start and end times
        const times = [startTime.replace(',', '.'), endTime.replace(',', '.')];

        // Join the remaining lines to form the caption text
        const text = lines.slice(2).join('\n');
  
        // Combine the formatted start and end times and the caption text to form a single string
        const output = `${times[0]},${times[1]}\n${text}\n`;

        return output;
    });
  
    // Join the .sbv captions into a single string
    return sbvCaptions.join('');
  }