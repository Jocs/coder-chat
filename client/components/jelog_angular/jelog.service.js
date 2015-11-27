(function(angular) {
	angular.module('jelog.service', [])
	.factory('jerror' , function ( $http , $q , $document, $cookies) {
		var jerror = {}, errorUrl  = 'http://errorlog.duapp.com/errorlog', 
		    screenshotsUrl = 'http://errorlog.duapp.com/screenshots';
		jerror.errorLog = null;
		jerror.process = [];
		jerror.screenshots = null;
		jerror.userName = $cookies.get('isLogin') || 'unknownUser';
		jerror.uniqueUserID = '';

		jerror.sendError = function () {
			jerror.uniqueUserID = jerror.userName +
		                  new Date().toString().substring(8, 24).replace(/\s+/g, '-') + 
                      '-' + Math.random().toString().slice(2,15);
      if(jerror.errorLog.hasOwnProperty('status')){
      	//如果出现499错误，说明是错误日志服务器抛出的错误。就不用再发送了一次错误日志了。
      	if(jerror.errorLog.status == 499) return;
      	jerror.uniqueUserID = jerror.errorLog.status + 'error-' + jerror.uniqueUserID;
      }
			var data = {
				uniqueUserID: jerror.uniqueUserID,
				errorLog: jerror.errorLog,
				process: jerror.process
			};
			jerror.process = [];
			errorLogStorage('add', data);
			var postData = errorLogStorage('get');
			$http({method: 'POST', url: errorUrl, data: postData})
			.success(function(data){
				if(data.success == true){
					errorLogStorage('empty');
				}
				console.log(data.message);
			})
			.error(function (err) {
				console.log(err);
			});
		};

		jerror.sendScreenshots = function ( data ) {
			var fd = new FormData();
			var imageName = jerror.uniqueUserID;
			fd.append("image", data, imageName + ".png");
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
  			var path = getPath(element, ''),
				query =  '//' + path;	
				return query;
  		}
  	};
  	return service;
  }

})

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

function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch(e) {
		return false;
	}
}

function errorLogStorage(type, data){
	if(storageAvailable('localStorage')){
		if(type == 'add' && arguments.length == 2){
			if(!window.localStorage.getItem('errorLog')) errorLogStorage('empty');
			var dataString = window.localStorage.getItem('errorLog');
			var errorObject = JSON.parse(dataString);
			errorObject.errors.push(data);
			window.localStorage.setItem('errorLog', JSON.stringify(errorObject));
		} else if(type == 'empty' && arguments.length == 1){
			var data = {
				errors:[]
			};
			window.localStorage.setItem('errorLog',JSON.stringify(data));
		} else if(type == 'get' && arguments.length == 1){

			var dataString =  window.localStorage.getItem('errorLog');
			return JSON.parse(dataString);
		}
		else {
			console.warn('unknown localStorage operation!');
		}
		
	} else {
		console.warn('浏览器不支持localStorage API!');
	}
}

})(angular);











