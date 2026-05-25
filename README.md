# maps-search-link
Adds a Maps link to the Google Search navigation bar.

Made for, and tested with, [Userscripts for Safari](https://apps.apple.com/app/userscripts/id1463298887). May work with other similar extensions.

## How it works
The script finds the "All" tab by its text content rather than CSS classes, which Google frequently changes.

## Configuration
If your Google Search shows the "All" tab in a different language (e.g. "Alle" in German/Dutch), update the `ALL_TAB_LABEL` variable at the top of the script to match.
