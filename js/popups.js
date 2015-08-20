
function createImagePopup(src){
	var mainDiv = document.createElement("div");
	mainDiv.className="image-popup";
	mainDiv.style.position="fixed";
	mainDiv.style.top="0";
	mainDiv.style.left="0";
	mainDiv.style.width="100%";
	mainDiv.style.height="100%";
	mainDiv.style.backgroundColor="rgba(0,0,0,.9)";
	mainDiv.style.zIndex="1001";



	var img = document.createElement("img"); 
	img.className="popup-image";
	img.style.position="absolute";
	img.style.top="0";
	img.style.bottom="0";
	img.style.right="0";
	img.style.left="0";
	img.style.margin="auto";
	img.style.maxWidth="100%";
	img.style.maxHeight="100%";


	var closeButton = document.createElement("button");
	closeButton.className="popup-image-closebutton";
	closeButton.style.position="absolute";
	closeButton.style.right="0";
	closeButton.style.top="0";
	closeButton.style.fontSize="2em";
	closeButton.style.width="1.5em";
	closeButton.style.height="1.5em";
	closeButton.style.backgroundColor="rgba(0,0,0,0)";
	closeButton.style.cursor="pointer";
	closeButton.style.borderColor="red";
	closeButton.style.color="red";

	closeButton.innerHTML="<span class='glyphicon glyphicon-remove-sign' ></span>";


	document.body.appendChild(mainDiv);
	mainDiv.appendChild(img);
	mainDiv.appendChild(closeButton);


	img.src = src;
	closeButton.onclick = function(){
		mainDiv.parentNode.removeChild(mainDiv);
	}


}






function createProductPopup(product,obj){
	if (obj.productPopupExists) {
		return false;
	}else{
		obj.productPopupExists=true;
	}

	var maxHeight; 
	var maxWidth;

	var popup = document.createElement("div"); 
	popup.className="product-popup row container";
	popup.style.visibility="hidden";
	
	var imagesContainer = document.createElement("div"); 
	imagesContainer.className="images-container col-xs-12 col-sm-8 row center-block";

	var textContainer = document.createElement("div"); 
	textContainer.className="text-container col-xs-12 col-sm-4";
	
	var mainImageContainer = document.createElement("div"); 
	mainImageContainer.className="main-image-container col-xs-12";
	
	var mainImage = document.createElement("img"); 
	mainImage.className="main-image";// img-responsive center-block";
	
	var imageThumbnailsContainer=document.createElement("div"); 
	imageThumbnailsContainer.className="image-thumbnails-container col-xs-12 center-block row hidden-x";
	
	

	document.body.appendChild(popup);
	popup.appendChild(imagesContainer);
	popup.appendChild(textContainer);
	imagesContainer.appendChild(mainImageContainer);
	imagesContainer.appendChild(imageThumbnailsContainer);


	mainImageContainer.innerHTML+="<span class='popup-right-arrow popup-arrow glyphicon glyphicon-chevron-right'></span>";
	mainImageContainer.innerHTML+="<span class='popup-left-arrow popup-arrow glyphicon glyphicon-chevron-left'></span>";
	mainImageContainer.appendChild(mainImage);

	mainImage.src = product.images[0];
	mainImage.onclick = function(){
		createImagePopup(this.src);
	}



	for (var i = 0; i < product.images.length; i++) {
		var thumbnail = document.createElement("img");
		thumbnail.className="popup-thumbnail";
		thumbnail.id="thumbnail-"+i.toString();
		thumbnail.src=product.images[i];
		imageThumbnailsContainer.appendChild(thumbnail);
		thumbnail.onclick=function(){
			var thumbnails = document.getElementsByClassName('popup-thumbnail');
			for (var i = 0; i < thumbnails.length; i++) {
				thumbnails[i];
			};
			mainImage.src = this.src;
		}
	};

	var text = "<h1> Product </h1>";
	text+=" <table class='table'> ";


	var data = product.data;

	for (var i = 0; i < data.length; i++) {
		
		var field = data[i].lang.en;

		for ( var id in field){
			if (field[id].replace(" ","")){
				text+="<tr> <td> <strong>"+id+" </strong></td> <td>"+field[id]+"</td> </tr>";
			}
			else {
				text+="<tr> <td> "+id+"</td> <td>N/A</td> </tr>";
			}
		}

	};


	text+=" </table> ";


	textContainer.innerHTML=text;

	var closeButton = document.createElement("button");
	closeButton.className="popup-close-button glyphicon glyphicon-remove ";

	document.body.appendChild(closeButton);
	closeButton.onclick = function(){
		popup.parentNode.removeChild(popup);
		this.parentNode.removeChild(this);
		obj.productPopupExists=false;
	}

	$('.product-popup').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1}, 500);


}

