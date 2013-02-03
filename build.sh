#!/bin/sh
NOW=`date`
echo "var BOXEO = (function() {" > boxeo.js
cat core/config.js | sed "s/%%BUILD%%/$NOW/" >> boxeo.js
cat core/platform.js >> boxeo.js
cat core/images.js >> boxeo.js
cat core/document.js >> boxeo.js
cat core/rendering-software.js >> boxeo.js
cat core/core.js >> boxeo.js
cat core/api.js >> boxeo.js
echo "return new API();" >> boxeo.js
echo "})();" >> boxeo.js

