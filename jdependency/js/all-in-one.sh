#!/bin/bash

rm -f ./jd.js
rm -f ./jd-plugin.js

#create jd.js file
for file in ./jd/*
do
	cat ${file} >> ./jd.js
	echo "" >> ./jd.js
done