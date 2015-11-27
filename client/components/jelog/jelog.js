(function( window, document) {
	//全局的jerror对象
	var jerror = new ErrorLog();

	window.addEventListener('message', function(e){
		var origin = location.origin;
		if(e.origin !== origin) return;
		var obj = JSON.parse(e.data);
		jerror.errorLog = obj;
		sendErrorAndScreenshots(jerror);
	}, false);

	window.addEventListener('error' , function(e){
		jerror.errorLog = {
			message: e.message,
			filename: e.filename,
			lineno: e.lineno,
			timeStamp: e.timeStamp,
			runEnvironment : window.navigator.userAgent
		};
		if(/test\sfor\smanual\serrorlog\ssend/.test(jerror.errorLog.message)){
			console.table([jerror.errorLog]);
			console.table(jerror.process);
		}
		sendErrorAndScreenshots(jerror);
	});

	document.addEventListener('click', function(e){
		var process = getProcess(e);
		jerror.process.push( process );
	});
	
	document.addEventListener('keyup' , function(e){
		var target = e.target;
			//console.log(e);
		if(target.tagName.toLowerCase() == 'input' 
			  || target.tagName.toLowerCase() == 'textarea'
				|| target.hasAttribute('contenteditable')){
			var process = getProcess(e);

			if( e.keyCode == 8 ) {
				jerror.process.push( process );
			} else if( e.ctrlKey && e.keyCode == 88 
				&& process.position.startPosition !== process.position.endPosition) {
				jerror.process.push( process );
			} 

		}
	});

	document.addEventListener('textInput' , function( e ){
		
		var process = getProcess(e);
		jerror.process.push(process);

	});

	//下面是上帝之手操作，会把错误信息打印到控制台，并且手动生成一个错误，触发错误发送机制
	document.addEventListener('keydown' , function(e){
		if(e.shiftKey && e.altKey && e.ctrlKey && e.keyCode === 69){
			throw new Error('test for manual errorlog send!');
		}
	});

	function sendErrorAndScreenshots(jerror){
		jerror.sendError();
		jerror.canvas2blob().then(function(data){
			jerror.screenshots = data;
			jerror.sendScreenshots(data);
		});
	}

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
			else if( window.getSelection && element.type && element.type !== 'checkbox' ) {
			//Firefox,Chrome,Safari etc
				startPosition = element.selectionStart;
				endPosition = element.selectionEnd;
			}
			return {
					'start':startPosition,
					'end':endPosition
			 	}
	}

	function getProcess(e){
		
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
			value = e.data;
		} else {
			value = '';
		}
		
		if(e.type !== undefined){
			if(e.type == 'click'){
				return {
					type : 'click',
					xpath : jerror.getXpath(target),
					timeStamp : +new Date()
				}
			} else if(e.type == 'textInput' || e.type == 'keyup') {
				return {
					type : 'textModify',
					xpath : jerror.getXpath(target),
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

	})(window, document);