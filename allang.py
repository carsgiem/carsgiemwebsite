from BeautifulSoup import BeautifulSoup 
import re
import glob, os



def changeMainLinks(documentString):
	rootFolders = [{"type":"stylesheet","name":r"css"},
	{"type":"javascript","name":r"js"},
	{"type":"img","name":r"images"},
	{"type":"javascript","name":r"bower_components"},
	{"type":"stylesheet","name":r"bower_components"},
	{"type":"javascript","name":r"db"}];
	for folder in rootFolders:
		if folder["type"]=="stylesheet":
			documentString = re.sub(r"href\s*=\s*\"\s*"+folder["name"], "href=\"../"+folder["name"], documentString)
		elif folder["type"]=="javascript":
			documentString = re.sub(r"src\s*=\s*\"\s*"+folder["name"], "src=\"../"+folder["name"], documentString)
		elif folder["type"]=="img":
			documentString = re.sub(r"src\s*=\s*\"\s*"+folder["name"], "src=\"../"+folder["name"], documentString)
		else:
			pass

	# bacground images
	documentString = re.sub(r"background-image:\s*url\(\s*\'", "background-image:url(\'../", documentString)
	return documentString

files = glob.glob("./*html")

LANGUAGES_LIST = ["es","en","cat","fr"]

for lan in LANGUAGES_LIST:
	if os.path.exists(lan):
		print "\033[7;47;34m Directory "+lan+" exists, we will overwrite everything \033[0m"
	else:
		print "\033[7;47;34m Directory "+lan+" DOES NOT exists, we will overwrite everything \033[0m"
		os.mkdir(lan)

	for fileName in files:
		try:
			f = open(fileName)
		except IOError:
			raise IOError("The file "+fileName+" could not be opened, check it now!!!")
		else:
			print "\033[7;47;42m \t Processing "+fileName+" \033[0m"
			documentHTML = f.read()
			f.close()
			document = BeautifulSoup(documentHTML)
			for el in document.findAll(re.compile("\w"), {"al-lang":re.compile("\w")}):
				elLang = el.attrMap["al-lang"]
				if (elLang == lan):
					try:
						print "Class of the element", el['class']
						el["class"] = el["class"].replace("al-lang-item","")
						print el["class"]
					except:
						pass
					del(el["al-lang"])
				elif (elLang == "{{lan}}"):
					el["ng-if"]="lan=='"+lan+"'"
					el["class"] = el["class"].replace("al-lang-item","")
					del(el["al-lang"])
				else:
					# print el["class"],"pepepepepp"
					try: 
						# matbe the class is not defined
						if ("al-lang-setter" in el["class"]):
							el['class'] = el['class'].replace('al-lang-setter','')
							del(el['al-lang'])
						else:
							el.extract()
					except:
						el.extract()

				print "-------------------------------"+elLang

			if fileName=="./about.html":
				print ""#document.prettify() 

			# print document.findAll(re.compile("\w"),{'al-lang':lan})

			try:
				fname = fileName.replace("./","")
				fOut = open(lan+"/"+fname, "w")
			except IOError:
				print("We could not create the file "+lan+"/test-"+fileName)
			else:
				documentToWrite = document.prettify()
				documentToWrite = changeMainLinks(documentToWrite)

				if fileName=="./index.html":
					print documentToWrite
				fOut.write(documentToWrite)




	


