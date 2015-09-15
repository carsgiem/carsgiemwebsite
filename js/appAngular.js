



function initSwiper(i){

	console.log("Initiating swiper for "+i.toString());
	var swiper = new Swiper('#CGIEM-swiper-container-product-'+i.toString(), {
       	pagination: '#CGIEM-swiper-pagination-product-'+i.toString(),
       	paginationClickable: true,
       	nextButton: '#CGIEM-swiper-button-next-product-'+i.toString(),
       	prevButton: '#CGIEM-swiper-button-prev-product-'+i.toString(),
       	spaceBetween: 30,
       	effect: "slide",
       	loop:true
    });

	
	return swiper;

}


function initSwiperFromBtn(btn){
	var dataTarget=btn.getAttribute("data-target");
	var i = dataTarget.replace("#CGIEM-product-","");
	console.log("Initiating swiper from button for "+i);
	
	$(dataTarget).on('shown.bs.modal', function () {
		var swiper = initSwiper(i);
  		// swiper.updateContainerSize();
	});
	
}


var app = angular.module('GIEMCars',[]);
app.controller("carList",function($scope){
	$scope.products = products; 
	// $scope.initSwiper = initSwiper;


	$scope.al = al;
	$scope.alLang = $scope.al.getLanguage();
	// $scope.initAwesomeLanguage = function(){
	// 	$scope.al.update();
	// }
	$scope.getKeyFromPropertyObject = function(prop){
		for (var key in prop){
			if (key){
				return key;
			}
			else{
				return undefined;
			}
		}
	}

	$scope.getValueFromPropertyObject = function(prop){
		var key = $scope.getKeyFromPropertyObject(prop);
		if (key){
			return prop[key];
		}
		else{
			return undefined;
		}
	}

	$scope.getField = function(prod, field){
		var data = prod.data;
		var key;
		var value;
		for (var i = 0; i < data.length; i++) {
			for (key in data[i].lang.en){
				// console.log(key);
				if (key == field) {
					value=data[i].lang.en[key];
					if (value.replace(" ", "")!="") {
						//console.log(value);
						return value;
					};
				};
			}
		};
		return "N/A";
	}; 
	$scope.getPrice = function(prod){
		return $scope.getField(prod, "PRICE");
	};
	$scope.getBrand = function(prod){
		return $scope.getField(prod, "BRAND");
	};
	$scope.getModel = function(prod){
		return $scope.getField(prod, "MODEL");
	};
	$scope.propertyIsNotEmpty=function(prop){
		for (var value in prop.lang.en){
			if (prop.lang.en[value].replace(" ","")==""){
				return false;
			}
			else{
				return true;
			}
		}
	};
});










