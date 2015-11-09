(function(angular){

	angular.module('jelog' ,['jelog.service','ui.router'])
	.run(function ( $window , jerror , $rootScope , $location, $document, Xpath) {
		window.addEventListener('error' , function(e){
			jerror.errorLog = {
				message: e.message,
				filename: e.filename,
				lineno: e.lineno,
				timeStamp: e.timeStamp,
				runEnvironment : window.navigator.userAgent
			};
			jerror.sendError();
			jerror.canvas2blob().then(function(data){
				jerror.screenshots = data;
				jerror.sendScreenshots(data);
			});

		});

		$document.bind('click' , function( e ) {
			var process = getProcess(Xpath, angular, e);
			jerror.process.push( process );
		});

		$document.bind('keyup' , function( e ){
			var target = e.target;
			if(e.keyCode == 13){
				throw new testError('a test error');
			};
			//console.log(e);
			if(target.tagName.toLowerCase() == 'input' 
				|| target.tagName.toLowerCase() == 'textarea'
				|| target.hasAttribute('contenteditable')){
				var process = getProcess(Xpath, angular, e);
				if( e.keyCode == 8 ) {
					
					jerror.process.push( process );
				} else if( e.ctrlKey && e.keyCode == 88 
					&& process.position.startPosition !== process.position.endPosition) {
					jerror.process.push( process );
				} 

			}
		});

		$document.bind('textInput' , function( e ){
			var process = getProcess(Xpath, angular, e);
			jerror.process.push(process);

		});

	})
	
	function getPositions( element ) {
			var startPosition = -1;//所选文本的开始位置
			var endPosition = -1;//所选文本的结束位置
			if( document.selection ) {
			//IE
				var range = document.selection.createRange();//创建范围对象
				var drange = range.duplicate();//克隆对象

				drange.moveToElementText(element);  //复制范围  
				drange.setEndPoint('EndToEnd', range);

				startPosition = drange.text.length - range.text.length;
				endPosition = startPosition + range.text.length;
			}
			else if( window.getSelection ) {
			//Firefox,Chrome,Safari etc
				startPosition = element.selectionStart;
				endPosition = element.selectionEnd;
			}
			return {
					'start':startPosition,
					'end':endPosition
			 	}
	}

	function getProcess(Xpath, angular, e){
		var target = e.target , value, position;
		if(target.tagName.toLowerCase() == 'input' && target.type == 'email' ){
			position = {
				startPosition : e.target.value.length,
				endPosition : e.target.value.length
			};
		} else if(target.tagName.toLowerCase() == 'div') {
			position = {
				startPosition : e.target.textContent.length,
				endPosition : e.target.textContent.length
			};
		} else {
			position = getPositions(target);
		}
		if(e.type == 'textInput'){
			value = e.originalEvent.data;
		} else {
			value = '';
		}
		if(e.hasOwnProperty('type')){
			if(e.type == 'click'){
				return {
					type : 'click',
					xpath : Xpath.getXpath(angular.element(target)),
					timeStamp : +new Date()
				}
			} else if(e.type == 'textInput' || e.type == 'keyup') {
				return {
					type : 'textModify',
					xpath : Xpath.getXpath(angular.element(target)),
					value : value,
					position : position,
					fullValueLength : e.target.value && e.target.value.length || e.target.textContent.length,
					timeStamp : +new Date()
				}
			}
		}	else {
			throw new Error('e is not a event');
		}
	}


})(angular);