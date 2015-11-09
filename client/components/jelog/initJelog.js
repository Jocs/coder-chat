(function( angular ){

	window.addEventListener('DOMContentLoaded' , loadJelog , false);

	function loadJelog () {
		loadScript('./components/jelog/html2canvas.js')
		.then(loadScript('./components/jelog/jelog.service.js'))
		.then(loadScript('./components/jelog/jelog.js'))
		.then(function(){
			var timer;
			timer = window.setInterval(function() {
				if( angular ) {
					var jelogWrap = document.createElement('div');
					jelogWrap.style.display = 'none';
					document.body.parentNode.insertBefore(jelogWrap, document.body);
					var jelog = angular.module('jelog');
					angular.bootstrap(jelogWrap, ['jelog']);
					clearInterval(timer);
				}
			}, 50);
		});

	}
  //这是一个异步加载script文件的函数，返回一个promise。
	function loadScript(url) {
		var script = document.createElement('script'),
		body = document.body;
		script.style = 'text/javascript';
		script.src = url;
		body.appendChild( script );

		var promise = new Promise(function (resolve, reject) {
			if(script.readyState){
				script.onreadystatechange = function(){
					if( /loaded|complete/.test(script.readyState) ){
						resolve();
					}
				}
			} else {
				script.onload = function(){
					resolve();
				}
			}
		});
		return promise;
	}

})(angular);