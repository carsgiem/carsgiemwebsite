#! /usr/bin/env wish

puts "The tk version is $tk_version"
puts "The tk library path is on $tk_library"


package require Tk


# MAIN DB PARAMETER DEFINITION

set DBFOLDER "../db"
set TEMPLATEPATH "../db/template.txt"





proc getDBList {} \
{
	global DBFOLDER
	set dblist ""
	set db $DBFOLDER

	foreach folder [glob $DBFOLDER/*] {
		puts $folder
		if {[file isdirectory $folder]} {
			puts "Is File"
			lappend dblist $folder
		}
	}
	return $dblist
}


























# Main GUI 

wm title . "Web Management CGIEM" 

ttk::frame .c -padding "3 3 12 12" 
#-width 800 -height 400

# grid .c -column 0 -row 0  -sticky nwes
pack .c -expand yes -fill both
grid columnconfigure . 1 -weight 1
grid rowconfigure . 0 -weight 1

ttk::button .c.new -text "New" -command newItem
ttk::button .c.updateWeb -text "Update Web" -command updateWeb
ttk::button .c.edit -text "Edit" -command {showFileContents [getSelectedItemContent]}
ttk::button .c.openImages -text "Open images" -command {tk_messageBox -type ok -icon info -message "This function is not yet implemented" -detail "Contact your service provider for further details"}


grid .c.new -column 3 -row 0 -sticky news
grid .c.edit -column 3 -row 1 -sticky news
grid .c.updateWeb -column 3 -row 2 -sticky news 
grid .c.openImages -column 3 -row 3 -sticky news 


frame .c.contents -width 100 -height 20 -background #DDDDDD
grid .c.contents -column 0 -row 0 -rowspan 10 -columnspan 3












































# HIDE AND SHOW TEXTBOXS AND LISTBOXS


proc hideContents {} \
{
	foreach w [winfo children .c.contents] {
		destroy $w
	}
}



proc createListBox { {contents ""} } \
{	
	if {$contents == ""} {
		set contents [getDBList]
	}

	hideContents

	set width 100
	set height 20

	listbox .c.contents.lb -selectmode single -height $height -width $width
	
	scrollbar .c.contents.sb -command [list .c.contents.lb yview]
	.c.contents.lb configure -yscrollcommand [list .c.contents.sb set]

	.c.contents.lb insert 0 {*}$contents 
	
	grid .c.contents.lb .c.contents.sb -sticky news

}


proc createTextBox {contents {fileName "../db/untitled"}} \
{
	hideContents	

	set width 100
	set height 20

	text .c.contents.mainText -width $width -height $height

	.c.contents.mainText insert 0.0 $contents
	grid .c.contents.mainText -column 0 -row 0


	frame .c.contents.textBoxButtonsFrame  -pady 20 -width $width -height $height -bg #DDDDDD
	grid .c.contents.textBoxButtonsFrame -column 0 -row 1

	#SAVE BUTTON
	button .c.contents.textBoxButtonsFrame.save -text "Save" -command save
	#CANCEL BUTTON
	button .c.contents.textBoxButtonsFrame.cancel -text "Cancel" -command createListBox

	label .c.contents.textBoxButtonsFrame.entryName -text "Item Name: " -bg #DDDDDD
	entry .c.contents.textBoxButtonsFrame.filename 

	.c.contents.textBoxButtonsFrame.filename insert 0  $fileName

	grid .c.contents.textBoxButtonsFrame.entryName -column 0 -row 0
	grid .c.contents.textBoxButtonsFrame.filename -column 1 -row 0

	grid .c.contents.textBoxButtonsFrame.save -column 3 -row 0
	grid .c.contents.textBoxButtonsFrame.cancel -column 4 -row 0 
	

}


















proc showFileContents {fileName} \
{	
	set dataFile "$fileName/data.txt"
	if {[file exist $dataFile] } {
		puts "Datafile ($dataFile) for $fileName found"
		if { [ catch { set fp [open $dataFile r] } ] } {
			puts "ERROR: TEMPLATE FILE NOT FOUND"
			exit 1
		}
    	set file_data [read $fp]
    	close $fp
    	createTextBox $file_data $fileName

	} else {
		tk_messageBox -type ok -message "Error: There is no 'data.txt' file for the product $fileName"
	}
}





proc getSelectedItemContent {} \
{
	puts "Actual selected item:--"
	set index [.c.contents.lb curselection]
	puts $index 
	set indexContent [.c.contents.lb get $index] 
	puts $indexContent
	return $indexContent
}


createListBox [getDBList]



proc updateWeb {} \
{
	set answer [tk_messageBox -type yesno -message "Are you sure you want to update the Website?" -icon warning -detail "Check everything before contiuing..."]
	switch -exact -- $answer {
		yes {
			puts "Updating the website"
			exec ./updateDB.sh &
		}
		no {
			puts "Not updating the website"
		}
		default {}
	}
}	


proc createNewItem {itemName} \
{
	global DBFOLDER
	file mkdir {$DBFOLDER/itemName}
	
	
}
















#FUNCIONS FOR SAVING TEXTBOX
proc getTextBoxContents {} \
{
	return [.c.contents.mainText get 0.0 end] 
}

proc getEntryBoxContent {} \
{
	return [.c.contents.textBoxButtonsFrame.filename get]
}

proc save {} \
{	
	set answer [tk_messageBox -type yesno -message "Are you sure you want to save this file?" -icon warning -detail "Check that the filename is correctly set..."]
	switch -exact -- $answer {
		no {
			return 1
		}
		default {}
	}

	set toWrite [getTextBoxContents]
	set dirPath [getEntryBoxContent]
	set filePath "$dirPath/data.txt"


	if {[file exist $dirPath]} {
		puts "$dirPath exists, not necessary to create"
	} else {
		set answer [tk_messageBox -type yesno -message "The folder '$dirPath' does not exist yet, do you want to create it? " -icon warning ]
		switch -exact -- $answer {
			no {
				return 1
			}
			default {}
		}
		newItemInitialise $dirPath

	}


	puts "\nWriting in $filePath\n"

	if { [ catch { set fp [open $filePath w] } ] } {
		tk_messageBox -type ok -message "The file $filePath could not be overwritten" -detail "Try it again later..."
	} else {
		puts $fp $toWrite 
		tk_messageBox -type ok -message "The file $filePath was overwritten succesfully" 
	}

	close $fp

	createListBox

}







proc getItemTemplate {templatePath} \
{
	if { [ catch { set fp [open $templatePath r] } ] } {
		puts "ERROR: TEMPLATE FILE NOT FOUND"
		exit 1
	}
    set file_data [read $fp]
    puts "\tReading template file at $templatePath"
    close $fp
    return $file_data
}

proc newItem {} \
{	

	global TEMPLATEPATH
	createTextBox [getItemTemplate $TEMPLATEPATH]
}

proc newItemInitialise {folderPath} \
{
	file mkdir $folderPath
	file mkdir "$folderPath/images"
}





# foreach w [winfo children .c] {grid configure $w -padx 5 -pady 5 ; puts $w}
# focus .c.feet
bind . <Return> {getSelectedItemContent}


# bind .c.02 <Enter> {.c.02 configure -width 20}
# bind .c.02 <Leave> {.c.02 configure -width 5}





