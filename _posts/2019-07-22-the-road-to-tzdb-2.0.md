---
layout: post
title: The road to TZDB 2.0
image: https://raw.githubusercontent.com/pavkam/tzdb/master/media/logo.jpg
tags: delphi tzdb programming
---
With the release of **TZDB 1.9** I have decided to give this project some more attention. I have started TZDB in 2012 and the source code shows it; and besides, version `1.9` still supports **Delphi 6**! This of course comes with a ton of support issues and subtle bugs (_like the recent issues with Linux compilation in Delphi_). So, for version `2.0` I have decided that enough is enough and started focusing on the following fundamental changes:
* Rewrite the core logic to use **year segments**. Each segment represents a clearly defined period of the year that has some properties, such as local time type, abbreviation, bias and etc. This allows for much faster local date/time resolution and simplifies high-level TZDB functionality a lot.
* Better **support for esoteric** time zones. My preferred example is `Africa/Cairo` in the years `1900`, `2010`, `2012` and `2014`. None of them will render entirely correct results in current version. And the crazy part is, each year has a different reason why! Another example is `Europe/Dublin` which has its `Standard` and `Daylight` periods reversed.
* Make **FreePascal support** a priority. My primary desktop is GNU/Linux and I have no intention of switching back to Windows anytime soon. I do have a VM with Windows 10 and latest community edition of Delphi but I only use that to verify if the project compiles after my changes.
* And finally, **drop support** for pre-XP versions of Delphi and FreePascal before version 3. If you need to use older versions of Delphi - you can use 1.9 and periodically re-compile the TZ database from IANA.

My plan is to finish up 2.0 in the next month or so. Hopefully this will be stable enough that I don't have to touch the source code for a while (unless rebuilding the database).

If you have any long standing issues or requests use https://github.com/pavkam/tzdb/issues to submit them. I will gladly consider any request and will prioritize accordingly.

Cheers!
