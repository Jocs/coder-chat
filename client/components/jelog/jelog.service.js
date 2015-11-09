(function(angular) {
	angular.module('jelog.service', [])
	.factory('jerror' , function ( $http , $q , $document) {
		var jerror = {}, errorUrl  = '/error', screenshotsUrl = '/screenshots';
		jerror.errorLog = null;
		jerror.process = [];
		jerror.screenshots = null;

		jerror.sendError = function () {
			var data = {
				errorLog: jerror.errorLog,
				process: jerror.process
			};
			$http({method: 'POST', url: errorUrl, data: data})
			.success(function(){
				console.log('success');
			})
			.error(function (err) {
				console.log(err);
			});
		};

		jerror.sendScreenshots = function ( data ) {
			var fd = new FormData();
			fd.append("image", data, "image.png");
			var xhr = new XMLHttpRequest();
			xhr.open('POST', screenshotsUrl, true);
			xhr.send(fd); 
		};

		function dataURLtoBlob(dataurl) {
			var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			while(n--){
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], {type:mime});
		}

		jerror.canvas2blob = function () {

			var defer = $q.defer();
			html2canvas($document.body , {
				onrendered: function( canvas ) {
					var dataurl = canvas.toDataURL('image/png');
					var blob = dataURLtoBlob(dataurl);
					defer.resolve(blob);
				}
			});
			return defer.promise;
		};

		return jerror;
	})
.provider('Xpath', function() {
	
  this.$get = function() { // injectables go here
  	var self = this;
  	var service = {
  		getXpath : function(element){
  			var path = getPath(element, '');
				query = '//' + path;
				return query;
  		}
  	};
  	return service;
  }

});

function getPath ( e , path ){
	var tn = e.get( 0 ).tagName;
	if(isNullOrEmpty(e) || isNullOrEmpty(tn)){
		return path;
	}
	var attr = getAttr(e);
	tn = tn.toLowerCase() + attr;
	path = isNullOrEmpty(path) ? tn : tn + "/" + path;
	var parentE = e.parent();
	if(isNullOrEmpty(parentE) || attr.substring(0, 5) == '[@id='){
		return path;
	}
	return getPath(parentE, path);
}


function getAttr ( e ){
	var tn = e.get(0).tagName;
	var id = e.attr('id');
	var hasId = !isNullOrEmpty(id);
	id = "[@id='" + id + "']";
	if( hasId ){
		return id;
	} else {
		if(e.siblings(tn).size() > 0) {
			var i = e.prevAll(tn).size();
			i++;
			return '[' + i + ']';
		} else {
			return '';
		}
	}
}


function isNullOrEmpty ( o ){
	return null == o || 'null' == o || '' == o || undefined == o;
}

})(angular);