;(function(){
  function loadbar() {
    var ovrl = document.getElementById("overlay"),
        elements =document.getElementsByTagName('img'),
        c = 0,
        tot = elements.length;
    if(tot == 0) {return doneLoading();}

    function elementLoaded(){
      c += 1;
      if(c===tot) return doneLoading();
    }
    function doneLoading(){
      ovrl.style.opacity = 0;
      setTimeout(function(){ 
        ovrl.style.display = "none";
        console.log("hey");
      }, 1200);
    }
    for(var i=0; i<tot; i++) {
      elements[i].onload  = elementLoaded;
      elements[i].onerror = elementLoaded;
    }    
  }
  document.addEventListener('DOMContentLoaded', loadbar, false);
}());