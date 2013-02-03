#!/bin/sh
while [ true ]
do
   ./build.sh
   inotifywait core -e close_write
done
