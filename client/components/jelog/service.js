
  var ErrorLog = (function(){
 		var _ErrorLog = function ErrorLog(){
 			var jerror = this, 
      ONLINE_ORIGIN = 'http://errorlog.duapp.com',
 			errorUrl  = ONLINE_ORIGIN + '/errorlog', 
      signatureUrl = ONLINE_ORIGIN + '/signature',
      imagesavedUrl = ONLINE_ORIGIN + '/imagesaved',
 			screenshotsUrl = 'http://v1.api.upyun.com/protractor';

 			jerror.errorLog = null;
 			jerror.process = [];
 			jerror.screenshots = null;
 			jerror.userName = 'unknownUser';
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
        
        //通过_http方法发送错误日志
        _http(errorUrl)
        .post(postData)
        .then(function(data){
          var data = JSON.parse(data);
          if(data.success == true){
            errorLogStorage('empty');
          }
          console.log(data.message);
        }, function(err){
          console.log(err);
        })
      };

      jerror.sendScreenshots = function ( data ) {

    	  var fd = new FormData();
    	  var imageName = jerror.uniqueUserID + '.png';
        fd.append("file", data, imageName);

        var promise = new Promise(function(resolve, reject){
          _http(signatureUrl)
          .post({filename: imageName})
          .then(function(data){
            resolve(data);
          }, function(err){
            reject(err);
          });
        });
        
        promise.then(function(data){
          //服务器返回的signature对象是一个JSON字符串，因此需要转化为对象。
          var data = JSON.parse(data);
          fd.append("policy" , data.policy);
          fd.append("signature", data.signature);
          var xhr = new XMLHttpRequest();
          xhr.open('POST', screenshotsUrl, true);
          xhr.send(fd); 
          //图片保存后向错误日志服务器发送UPYUN返回信息，包括路径、状态码等。
          xhr.onload = function(){
            var responseData = JSON.parse(this.response);
            _http(imagesavedUrl)
            .post(responseData);
          };
        }, function(err){
          console.log(err);
        });
    	  
      };   

      jerror.canvas2blob = function () {
    	  var promise = new Promise(function(resolve, reject){
    		  html2canvas(document.body , {
    			  onrendered: function( canvas ) {
    				  var dataurl = canvas.toDataURL('image/png');
    				  var blob = dataURLtoBlob(dataurl);
    				  resolve(blob);
    			  }
    		  });
    	  });
    	return promise;
      };

      jerror.getXpath = function(element){
    	  var path = getPath(element, ''),
    	  query =  '//' + path;	
    	  return query;
      };

    return jerror;
  };
  return _ErrorLog;

  //以下是辅助函数
  function dataURLtoBlob(dataurl) {
      var arr = dataurl.split(','), 
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
      
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    }

  function getPath ( e , path ){
  	var tn = e.tagName;
  	if(isNullOrEmpty(e) || isNullOrEmpty(tn)){
  		return path;
  	}
  	var attr = getAttr(e);
  	tn = tn.toLowerCase() + attr;
  	path = isNullOrEmpty(path) ? tn : tn + "/" + path;
  	var parentE = e.parentNode;
  	if(isNullOrEmpty(parentE) || attr.substring(0, 5) == '[@id='){
  		return path;
  	}
  	return getPath(parentE, path);
  }


  function getAttr ( e ){
  	var tn = e.tagName.toLowerCase();
  	var id = e.getAttribute('id');
  	var hasId = !isNullOrEmpty(id);
  	id = "[@id='" + id + "']";
  	if( hasId ){
  		return id;
  	} else {
  		if(e.parentNode && e.parentNode.getElementsByTagName(tn).length > 1) {
  			var i = 0;
  			while( e.previousElementSibling ){
  				if(e.previousElementSibling.tagName.toLowerCase() === tn){
  					i ++;
  				}
  				e = e.previousElementSibling;
  			}
  			i ++;
  			return '[' + i + ']';
  		} else {
  			return '';
  		}
  	}
  }


  function isNullOrEmpty ( o ){
  	return null == o || 'null' == o || '' == o || undefined == o;
  }
  // 判断window.localStorage是否可用
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
  //用来设置localStorage的方法，传入不同type进行不同操作，
  //type ： add、empty、get 分别用来添加，清空和获取键位「errorLog」的localStorage值。
  //get 返回的是一个json格式的数据。 
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
  /**
   * http 用来发送json格式数据，现在包括get和post方法。本例主要使用post方法
   */
  function _http(url){

	  var core = {
	    // Method that performs the ajax request
	    ajax : function (method, url, data) {
	      // Creating a promise
	      var promise = new Promise( function (resolve, reject) {
	        // Instantiates the XMLHttpRequest
	        var client = new XMLHttpRequest();
          
	        var uri = url;

	        if (data && (method === 'POST' || method === 'PUT')) {
	        	client.open(method, uri, true);
            client.setRequestHeader("Content-Type","application/json; charset=UTF-8");
            client.send(JSON.stringify(data));
	        } else {
            client.open(method, uri);
            client.setRequestHeader("Content-Type","application/json; charset=UTF-8");
            client.send();
          }

	        client.onload = function () {
	        	if (this.status >= 200 && this.status < 300) {
	            // Performs the function "resolve" when this.status is equal to 2xx
	            resolve(this.response);
	          } else {
	            // Performs the function "reject" when this.status is different than 2xx
	            reject(this.statusText);
	          }
	        };
	        client.onerror = function () {
	        	reject(this.statusText);
	        };
	      });

	      // Return the promise
	      return promise;
	    }
	  };

	  // Adapter pattern
	  return {
	  	'get' : function() {
	  		return core.ajax('GET', url);
	  	},
	  	'post' : function(data) {
	  		return core.ajax('POST', url, data);
	  	}
	  };
	};

})();
