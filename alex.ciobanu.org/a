#!/bin/bash

for i in *.html; do 
    TITLE=`sed -n 's/<h1 class="entry-title">\(.*\)<\/h1>/\1/p' $i | xargs`
    DATE=`sed -n 's/<span class="entry-date">\(.*\)<\/span>.*/\1/p' $i | xargs`
    if [ "$TITLE" != "" ] && [ "$DATE" != "" ]; then
	FNAME=`echo "$TITLE" | tr "[:upper:]" "[:lower:]" | tr "[:blank:]" "-" | tr -d "[!,(,),:,+,$,?]"`
	FNAME=`echo $FNAME | sed 's/\&#[0-9]*\;//g'`
	FNAME="`date --date="$DATE" +%Y-%m-%d`-$FNAME.md"
        FNAME=~/Development/pavkam.github.io/_posts/$FNAME
	echo "---" > $FNAME
	echo "layout: post" >> $FNAME
        echo "title: $TITLE" >> $FNAME
	echo "image: /img/archive.png" >> $FNAME
	echo "---" >> $FNAME
	echo "This archived post was originally published on $DATE. Read it [here](/alex.ciobanu.org/$i)." >> $FNAME
    fi
done
