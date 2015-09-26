#! /usr/bin/env wish


frame .c 
pack .c

tk_messageBox -parent .c -type ok -message [lindex $argv 0]

exit 