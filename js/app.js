




function ItemsContainer(db){
	this.db = db;
	this.containerId="items-container";
	this.productClass = "item-div";
	this.productImage = "item-image";
	this.productPopupExists=false;
	this.lang = getLanguage();
	this.propNumber=2;

	this.getContainer = function(){
		var container = document.getElementById(this.containerId);
		if (container) {
			return container;
		}
		else{
			alert("No Element with id = "+this.containerId+" was found, no elements can be displayed.");
			return false;
		}
	}
	
	this.deployProducts = function(){
		var container = this.getContainer();
		for (var i = 0; i < this.db.length; i++) {
			var product = this.db[i];
			// console.log(product);
			var imgDiv = document.createElement("div");
			var img = document.createElement("div");

			//imgDiv.className = this.productClass;
			imgDiv.className="col-lg-4 col-sm-6 text-center "+this.productClass;
			//img.className="img-responsive img-center";
			img.className="center-block "+ this.productImage;

			
			imgDiv.id = i;
			product.id = i;
			imgDiv.appendChild(img);

			

			
			var obj = this;
			imgDiv.addEventListener("click", function(){
				createProductPopup(obj.getProductById(this.id),obj);
			});
			

			// var src = this.thumbnailName(product.images[0]);
			// img.src = src[0]+"/thumbnail-"+src[1];
			img.style.backgroundImage = "url('"+product.images[0]+"')";
			container.appendChild(imgDiv);


			for (var j = 0; j < product.data.length; j++) {
				var property = product.data[j].lang[getLanguage()];
				if (j>=this.propNumber) {
					break 
				} 
				for (var id in property) {
					// console.log(id);
					imgDiv.innerHTML+=id+"<br>";
				}

			};
			
			delete product;
		}
	}
	// this.thumbnailName  = function(filepath){
	// 	var filePathArray = filepath.split('/');
	// 	if (filePathArray.length==2){
	// 		var filename = filePathArray[1];
	// 		var folder = filePathArray[0];
	// 	}
	// 	else{
	// 		var filename = filepath;
	// 		var folder = "./";
	// 	}
	// 	return [folder,filename];
	// }
	this.getProductById = function(id){
		console.log("looking for it");
		for (var i = 0; i < this.db.length; i++) {
			if(this.db[i].id==id){
				return this.db[i];
			}
		};
	}
	this.init = function(){
		console.log("Starting deploying");
		this.deployProducts();
	}
}





var itemsContainer = new ItemsContainer(products);

itemsContainer.init();






