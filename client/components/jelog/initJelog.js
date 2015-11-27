(function( window , document){

	window.addEventListener('DOMContentLoaded' , loadJelog , false);

	function loadJelog () {
		loadScript('./components/jelog/html2canvas.js')
		.then(loadScript('./components/jelog/service.js'))
		.then(function(){
			//虽然service.js loaded了，但是可能浏览器还没有解析代码，因此ErrorLog对象
			//还不能够使用，所以就有如下的方法了。
			var timer = null;
			timer = setInterval(function(){
				if( typeof ErrorLog === 'function'){
					clearInterval( timer );
					loadScript('./components/jelog/jelog.js');
				} else {
					console.info('server.js is still loading ~~~');
				}
			}, 50);
		})
		.then(function(){
			console.log('errorlog system modules load successful!');
		}, function(err){
			console.log(err);
		});

	}
  //这是一个异步加载script文件的函数，返回一个promise。
	function loadScript( url ) {
		var script = document.createElement('script'),
		body = document.body;
		script.style = 'text/javascript';
		
		var canIUseOnload = isImplementedOnload( script );
		var promise = new Promise(function (resolve, reject) {
			if( !canIUseOnload ){ // this is for IE only
				script.onreadystatechange = function(){
					if( /loaded|complete/.test(script.readyState) ){
						resolve();
						script.onreadystatechange = null;
					}
				}
			} else { // this is for Chrome \Opera \ Safari \ Firefox
				script.onload = function(data){
					resolve();
				};
				script.onerror = function(err){
					reject(err);
				};
			}

		});

		script.src = url;
		body.appendChild( script );

		return promise;
	}

	function isImplementedOnload(script){

　　script = script || document.createElement('script') ;
　　if('onload' in script) return true; 
    script.setAttribute('onload','');
    return typeof script.onload == 'function'; // ff true ie false .
	}

})( window , document);






