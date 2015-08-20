#! /bin/bash

# Copyright Alejandro A. Martinez-Soria Gallo 2015

# Reset
Color_Off='\033[0m'       # Text Reset

# Regular Colors
Black='\033[0;30m'        # Black
Red='\033[0;31m'          # Red
Green='\033[0;32m'        # Green
Yellow='\033[0;33m'       # Yellow
Blue='\033[0;34m'         # Blue
Purple='\033[0;35m'       # Purple
Cyan='\033[0;36m'         # Cyan
White='\033[0;37m'        # White

# Background
On_Black='\033[40m'       # Black
On_Red='\033[41m'         # Red
On_Green='\033[42m'       # Green
On_Yellow='\033[43m'      # Yellow
On_Blue='\033[44m'        # Blue
On_Purple='\033[45m'      # Purple
On_Cyan='\033[46m'        # Cyan
On_White='\033[47m'       # White


ERROR="$Yellow$On_Red ERROR::"
comment (){
	verbatim=true
	if  $verbatim ; then
		echo -e "$Purple//$Cyan$1$Color_Off"
	fi
}




dbDir="./../db"
jsonDBFile="$dbDir/db.js"



if  test -e $dbDir; then
	comment "$0:: Database File '$dbDir' found."
else 
	comment "$ERROR ' $0:: $dbDir' File not found."
	exit 1
fi


echo "var products = [" > $jsonDBFile

for dir in $dbDir/*
do 
	if  test -d $dir; then
		echo $dir
	 	./createDBEntry.sh $dir >> $jsonDBFile
	 	echo "," >> $jsonDBFile 
	 fi 
done


echo "]">> $jsonDBFile

./okMessage.tcl "The database was succesfully updated..."











