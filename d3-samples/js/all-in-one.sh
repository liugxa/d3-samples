#!/bin/bash
FILE_NAME=progress-bar-all.js

if [ -f ${FILE_NAME} ]; then
	rm -rf ${FILE_NAME}
fi

for file in ./progress-bar-*
do
	cat ${file} >> ./${FILE_NAME}
	echo "" >> ./${FILE_NAME}
done