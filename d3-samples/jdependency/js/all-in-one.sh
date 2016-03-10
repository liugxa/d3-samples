#!/bin/bash
FILE_NAME=progress-bar-all.js
rm -f ./progress-bar.js
rm -f ./progress-ext.js
rm -f ./progress.js

if [ -f ${FILE_NAME} ]; then
	rm -rf ${FILE_NAME}
fi

#compress the progress directory
for file in ./progress/*
do
	cat ${file} >> ./progress-bar.js
	echo "" >> ./progress-bar.js
done

#compress the ext directory
for file in ./ext/*
do
	cat ${file} >> ./progress-ext.js
	echo "" >> ./progress-ext.js
done

#compress all files into progress.js
cat ./progress-bar.js >> progress.js
cat ./progress-ext.js >> progress.js
