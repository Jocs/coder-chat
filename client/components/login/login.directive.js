'use strict'
/*
* nicknameValidation指令用来验证nickname输入框是否合法
* nickname*要求不能为空
*         *字符在3到20之间
*         *只能包含数字字母和下划线
*         *nickname 在数据库中唯一
*/
angular.module('cc')
  .directive('nicknameValidation', function($http){
  	return {
  		restrict: 'A',
  		require: 'ngModel',
  		link: function(scope, ele, attrs, ctrl){
  			var url = 'api/user/unique';
  			ctrl.$parsers.push(function(val){
  				/*－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
  				* /^\w+$/匹配字母、数字、下划线，其中＋号表示匹配一次或多次。  ｜
  				* 正则表达式RegExp.test(String)方法，如果正则表达式和string  ｜
  				* 匹配，表达式返回true，如果不匹配表达式返回false。           ｜
  				* $setValidity用来设置某项是否通过验证。false是没有通过验证， ｜
  				* 在ng－message就会显示。设置为true，对应的ng-message不会显示｜
  				*－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
  				*/
  				ctrl.$setValidity('pattern', /^\w+$/.test(val));

  				if(!val || val.length === 0 ){
  					ctrl.$setValidity('requiredI',false);
  					ctrl.$setValidity('minlength', true);
  					return;
  				};
  				if(val && (val.length < 3 || val.length > 20)) {
  					ctrl.$setValidity('requiredI', true);
  					ctrl.$setValidity('minlength', false);
  					return;
  				};		
  				ctrl.$setValidity('checking', false);
  				ctrl.$setValidity('isUsed',true);
  				$http({
  					method:'POST',
  					url: url,
  					data:{nickname: val}
  				}).success(function(data){
  					if(data.isUsed){
  						ctrl.$setValidity('requiredI',true);
  						ctrl.$setValidity('minlength',true);
  						ctrl.$setValidity('checking',true);
  						ctrl.$setValidity('isUsed', false);
  					} else {
  						ctrl.$setValidity('required', true);
  						ctrl.$setValidity('pattern', true);
  						ctrl.$setValidity('requiredI',true);
  						ctrl.$setValidity('minlength',true);
  						ctrl.$setValidity('maxlength', true);
  						ctrl.$setValidity('checking',true);
  						ctrl.$setValidity('isUsed', true);

  					}
  				})
  				return val;
  			});
  		}
  	};
  })
.directive('mongooseError', function(){
	return{
		restrict: 'A',
		require:'ngModel',
		link: function(scope, ele, attrs, ctrl){
			ele.on('keydown', function(){
				ctrl.$setValidity('mongoose', true);
			});
		}
	};
});










