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
	verbatim=false
	if  $verbatim ; then
		echo -e "$Purple//$Cyan$1$Color_Off"
	fi
}





dir=$1
filePath="$dir/data.txt"
imgDir="$dir/images"


comment "\n*** Starting to create a DBEntry for $filePath \n\n"

if  test -e "$filePath" ; then
	comment "\tFile $filePath found!"
else
	comment "$ERROR FILE '$filePath' not found" 
	exit 
fi


comment "Reading file $filePath"


# CONTROL VARIABLES

languageDetected=false
blockDetected=false


echo -e "{'data':["

for line in $(cat $filePath)
do
	if [[ "$line" == "----" ]];then 
		# We have to look if another language was recognised before 
		if $blockDetected  ; then
			echo -e "\t\t}"
			echo -e "\t},"
		fi
		comment "\n\n\t\t\tDetecting new block"
		echo -e "\t{"
		echo -e "\t'lang':{"
		blockDetected=true
	fi
	if [[ $line == *"="* ]]; then 
		#We are recognising a language
		comment "\n\n//Detecting language item: \t $line"
		#echo $line | sed -e "s/^/{'/" -e "s/=/':'/" -e "s/$/',/"
		language=$(echo $line | sed  -e "s/lang=//");
		if [[ $language == "" ]]; then
			comment "$ERROR  $line, language is not set! "
			exit
		fi
		comment "The language is $language" 
		echo -n -e "\t\t'$language':{"
		languageDetected=true
	fi 
	if [[ "$line" == *":"* ]]; then
		#we are recognising a property with a language 
		if $languageDetected ; then
			comment "Property detected "
			value=$(echo "$line " | sed -e "s/^.*://")
			field=$(echo "$line " | sed -e "s/:.*$//")
			comment "The value of '$field' is '$value'"
			echo -e "\t'$field':'$value'},"
			languageDetected=false
		else 
			comment "$ERROR Property $line declared without language  "
		fi
	fi
done


echo -e "\t\t}"
echo -e "\t}"
echo -e "\t],"


# IMAGES FOR DB 

echo -e "'images':["


if [ -d $imgDir ]; then
	comment "Image directory $imgDir found!"
else 
	comment "$ERROR Image directory $imgDir not found!"
	echo -e "]}"
	exit 1
fi



# HERE WE HAVE TO REPLACE THE ../ INSIDE THE $imgFile
imgNumber=$(ls $imgDir | wc -l)
actualImage=1
comment "There are $imgNumber images"
for imgFile in $imgDir/*
do 	
	comment "image $actualImage of $imgNumber"
	if [ $actualImage == $imgNumber ]; then
		comment "We are in the last image"
		echo -e "\t'$imgFile'" | sed -e "s:./../::"
	else
		echo -e "\t'$imgFile'," | sed -e "s:./../::"
	fi
	actualImage=$(($actualImage + 1))
	
done

echo -e "]}"










