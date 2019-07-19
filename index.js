
var webpush = require('web-push');
var formidable = require('formidable');
var fs = require('fs');
var uuid = require('uuid-v4');

var gcconfig = {
	projectId : '',
	keyFilename : ''
};

var gcs = require('@google-cloud/storage')(gcconfig);

	var uuid =  uuid();
	var formData = new formidavle.IncomingForm();
	formData.parse(request , function(err , fields , files){
		fs.rename(files.file.path , '/tmp/' + files.file.name);
		var bucket = gcs.bucket('');
		bucket.upload('/tmp/' + files.file.name , {
			uploadType : 'media' , 
			metadata : {
				metadata : {
					contentType : files.file.type , 
					firebaseStorageDownloadTokens : uuid
				}
			}
		} , function(err , file){
			if(!err){

			} else {
				console.log(err);
			}
		});
	})


.then(() => {
	webpush.setVapidDetails('mailto' : 'jainanjali043@gmail.com' , '' ,'')
})