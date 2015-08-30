'use strict'
    /* $resource 是一个创建资源对象的工厂，返回的$resource对象包含了和
    * 后端服务器交互的高层api.
    *  可以把User服务理解为RESTful后端进行交互的接口；User服务包含5个常用
    *  的方法：两个http get类型的方法，3个非http get类型的方法。
    *  一、两个get方法，接受三个参数。
    *      get(params, successFn, errorFn)
    *      query(params, successFn, errorFn)
    *  params(object)
    *  successFn(function): 当http响应成功后的回调函数
    *  errorFn(function) : the callback function of failure response
    *  二、三个非get类型的方法
    *      save(params, payload, successFn, errorFn)
    *      delete(params, payload, successFn, errorFn)
    *      remove(params, payload, successFn, errorFn)
    *  payload(object): 这个对象会随请求发送到服务器
    * ------------------------------------------------------------------
    *  $resource 实例上有三个方法：
    *   $save(),  $remove(),     $delete()
    *  －－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－－
    *  $resource 可以自定义方法。自定义方法传入$resource(params1,params2,params3)
    *  中的第三个参数。 如下：
    */ 
angular.module('cc',[])
	.factory('User', function($resource){
		return $resuorce('/api/user/:id/:controller',
			{id:'@_id'},
			{
				changePassword:{
					method:'PUT',
					params:{
						controller: 'password'
					}
				},
				getMe:{
					method:'GET',
					params:{
						id: 'me'
					}
				}
			}
		);
	});