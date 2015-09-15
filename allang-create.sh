#! /bin/bash



LANGUAGE_LIST=(en es cat fr)

DEPENDENCIES=("db\/" "js\/" "css\/" "swiper\/" "images\/" "font-awesome-4.4.0")


for lang in ${LANGUAGE_LIST[@]}; do
	#statements
	if test -d "$lang"
	then
		echo -e "\033[7;49;33m WARNING: Directory '$lang' found, we will overwrite everything inside"
	else
		echo "Directory '$lang' not found, creating it"
		mkdir $lang
	fi
	# LOOP FOR HTML
	for html in *.html
	do
		cp $html "$lang/$html"
		echo -e "\033[7;49;92m Analysing file $html for language $lang \033[0m"

		sed -i.bak -e "s/al-lang=\"$lang\"//"  "$lang/$html" 
		sed -i.bak -e "s/^.*al-lang=\"*\".*$//"  "$lang/$html"  
		sed -i.bak -e "s/al-lang-item//"  "$lang/$html" 
		
		for dep in ${DEPENDENCIES[@]}; do
			sed -i.bak -e "s:=\"$dep:=\"../$dep:" "$lang/$html"
			echo $dep
		done

	done



done




echo -e "****\t Cleaning up .bak files"
for lang in ${LANGUAGE_LIST[@]}; do
	rm ${lang}/*.bak
done