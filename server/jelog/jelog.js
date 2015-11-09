var fs = require('fs');
// config the uploader 
var options = {
    tmpDir:  __dirname + '/error/tmp',
    uploadDir: __dirname + '/error',
    uploadUrl:  '/uploaded/files/',
    maxPostSize: 11000000000, // 11 GB 
    minFileSize:  1,
    maxFileSize:  10000000000, // 10 GB 
    acceptFileTypes:  /.+/i,
    // Files not matched by this regular expression force a download dialog, 
    // to prevent executing any scripts in the context of the service domain: 
    inlineFileTypes:  /\.(gif|jpe?g|png)/i,
    imageTypes:  /\.(gif|jpe?g|png)/i,
    copyImgAsThumb : true, // required 
    imageVersions :{
        maxWidth : 200,
        maxHeight : 200
    },
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
        allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
    }
    // storage : {
    //     type : 'aws',
    //     aws : {
    //         accessKeyId :  'xxxxxxxxxxxxxxxxx',
    //         secretAccessKey : 'xxxxxxxxxxxxxxxxx',
    //         region : 'us-east-1',//make sure you know the region, else leave this option out 
    //         bucketName : 'xxxxxxxxxxxxxxxxx'
    //     }
    // }
};
 
// init the uploader 
var uploader = require('blueimp-file-upload-expressjs')(options);
 
 
module.exports = function (app) {
    app.get('/screenshots', function(req, res) {
      uploader.get(req, res, function (err,obj) {
            if(!err){
                res.send( JSON.stringify(obj) );
            }
      });
      
    });
 
    app.post('/screenshots', function(req, res) {
      uploader.post(req, res, function (error,obj, redirect) {
          if(!error){
            res.send(JSON.stringify(obj)); 
          }
      });
      
    });
    
    // the path SHOULD match options.uploadUrl 
    app.delete('/screenshots', function(req, res) {
      uploader.delete(req, res, function (err,obj) {
            res.Json({error:err}); 
      });
      
    });

    app.use('/error' , function(req, res, err) {
        // var processes = JSON.parse(JSON.stringify(req.body.process));
        // console.log(processes.length);
        // var str = '';
        // while( processes.length ){
        //     var process = processes.shift();
        //     if(process.type == 'click') {
                
        //         str += 'var element' + process.timeStamp + '=element(by.xpath("' + process.xpath + '"));' +
        //                 'element'+ process.timeStamp +'.click();';
        //     } else if(process.type = 'keyup') {
        //         str += 'var element' + process.timeStamp + '=element(by.xpath("' + process.xpath + '"));' +
        //                 'element'+ process.timeStamp +'.sendKeys("' + process.charCode + '");';     
        //     }
        // }
		fs.writeFile('server/jelog/jserror.log.js', 'module.exports =' + JSON.stringify(req.body), function(err){
			if(err) {
				console.log(err);
			} 
			
		});


	});
  return app;
}
	