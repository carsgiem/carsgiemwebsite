
// Copyright 2015 Alejandro A. Martinez-Soria Gallo 
// All rights reserved



function LanguageSetters(al){
	// Docstring: 'al' is an instance of the class AwesomeLanguage()
	this.languageSetterClassName="al-lang-setter";
	this.languageAttributeName=al.languageAttributeName;

	this.addEventListener = function(node,lang){
		// Docstring: Add event listener for setting the global language.
		node.addEventListener("click", function(){
			al.setLanguage(lang);
			al.toggleAllNodes();
		});
	}

	this.getSetterLanguage = function(node){
		// Returns lang if the language attribute of the setter element is supported or existent
		// and undefined otherwise
		var lang = node.getAttribute(this.languageAttributeName);
		if(al.languageIsSupported(lang)){
			return lang; 
		}
		else{
			return undefined;
		}
	}

	this.getSetters = function(){
		// get all setters in the html document (by className)
		return document.getElementsByClassName(this.languageSetterClassName);
	}

	this.initSetters = function(){
		// initialise setters with eventListener if the languages are supported
		// TODO: If this function is called two times it should check if an event Listener 
		// for the same actions was already defined and then don't define it twice
		var lang; 
		var setters = this.getSetters();
		for (var i = 0; i < setters.length; i++) {
			lang = this.getSetterLanguage(setters[i]);
			if (lang) {
				console.log("Lang Setter detected with language "+lang);
				this.addEventListener(setters[i], lang);
			};
		};
	}

	this.update = function(){
		this.initSetters();
	}

}



function AwesomeLanguage(){

	this.DEFAULT_LANGUAGE = "es";
	this.LANGUAGES_LIST = ["en","cat","es","fr"];
	this.languageCookieVariableName="al-lang";
	this.languageAttributeName="al-lang";
	this.languageItemClassName="al-lang-item";

	this.languageSetters = new LanguageSetters(this);


	this.setSupportedLanguages = function(list){
		this.LANGUAGES_LIST=list;
	}

	this.setCookieLanguage = function(lang){
		var cookieLang = this.DEFAULT_LANGUAGE;
		if (this.languageIsSupported(lang)) {
			// Check if the passed language is supported 
			cookieLang=lang;
		}
		document.cookie=this.languageCookieVariableName+"="+cookieLang+";";
	}
	this.getCookieLanguage = function(){
		var index = document.cookie.indexOf(this.languageCookieVariableName+'=');
		if (index!=-1) {
			var lang = document.cookie.replace(this.languageCookieVariableName+"=","").split(';')[0];
			if (lang!="") {
				if(this.languageIsSupported(lang)){
					return lang; 
				}
				else{
					return undefined;
				}
			}
			else{
				return undefined;
			}
		}
		else{
			return undefined;
		}
	}
	this.getHtmlLanguage = function(){
		var lang = document.documentElement.lang; 
		if (lang)
		{
			return lang;
		}
		else
		{
			return undefined;
		}
	}
	this.setHtmlLanguage= function(lang){
		var htmlLang = this.DEFAULT_LANGUAGE;
		if (this.languageIsSupported(lang)) {
			// Check if the passed language is supported 
			htmlLang=lang;
		}
		document.documentElement.lang=htmlLang;
	}


	this.getNavigatorLanguage=function(){
		var userLang = navigator.language || navigator.userLanguage;
		if (userLang) {
			console.log("Navigator language "+userLang+" detected");
			return userLang;
		}
		else{
			return undefined;
		}
	}


	this.getLanguageItems = function(node){
		return node.getElementsByClassName(this.languageItemClassName);
	}
	this.toggleNode = function(node,currentLang){
		var nodeLang = node.getAttribute(this.languageAttributeName);
		console.log("Item with language      "+ nodeLang);
		if(nodeLang==currentLang){
			node.style.display="initial";
		}
		else{
			node.style.display="none";
		}
	}
	this.toggleNodesInNode = function(node){
		var nodes = node.getElementsByClassName(this.languageItemClassName);
		var currentLang = this.getLanguage();
		for (var i = 0; i < nodes.length; i++) {
			this.toggleNode(nodes[i], currentLang);
		};
	}
	this.toggleAllNodes = function(){
		this.toggleNodesInNode(document);
	}


	this.getLanguage=function(){
		var htmlLang = this.getHtmlLanguage();
		var cookieLang = this.getCookieLanguage();
		var navLang = this.getNavigatorLanguage();

		// PRIORITIES : 1. Cookie, 2. HtmlTag, 3. navigator
		if (cookieLang) {
			return cookieLang;
		} 
		else if (htmlLang){
			return htmlLang;
		} 
		else if (navLang) {
			return navLang;
		}
		else{
			return this.DEFAULT_LANGUAGE;
		}
	}


	this.setLanguage=function(lang){
		this.setHtmlLanguage(lang);
		this.setCookieLanguage(lang);
	}

	
	this.languageIsSupported=function(lang){
		if (this.LANGUAGES_LIST.indexOf(lang)!=-1){
			return true;
		}
		else{
			return false;
		}
	}
	this.update = function(){
		this.languageSetters.update();
		this.toggleAllNodes();
	}
}

var al = new AwesomeLanguage();

document.onreadystatechange = function () {
  	if (document.readyState == "complete") {
    	al.update();
  		}
	}

