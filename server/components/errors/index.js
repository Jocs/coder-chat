'use strict'

module.exports[404] = function(req, res){
	res.render('404', function(err){
		if(err){
			res.json({'404Error': err});
		} else {
			res.render('404');
		}
	});
};