var zipFolder = require('zip-folder');
var path = require('path');
var fs = require('fs');
var request = require('request');

var rootFolder = path.resolve('.');
var zipPath = path.resolve(rootFolder, '../paulstestbot1804.zip');
var kuduApi = 'https://paulstestbot1804.scm.azurewebsites.net/api/zip/site/wwwroot';
var userName = '$paulstestbot1804';
var password = 'hKTnBo6ZW6B9P2pmtxowwXZYup8bt0SmdSK0dpCcRhvvwd9zatTWezTKHYkN';

function uploadZip(callback) {
  fs.createReadStream(zipPath).pipe(request.put(kuduApi, {
    auth: {
      username: userName,
      password: password,
      sendImmediately: true
    },
    headers: {
      "Content-Type": "applicaton/zip"
    }
  }))
  .on('response', function(resp){
    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      fs.unlink(zipPath);
      callback(null);
    } else if (resp.statusCode >= 400) {
      callback(resp);
    }
  })
  .on('error', function(err) {
    callback(err)
  });
}

function publish(callback) {
  zipFolder(rootFolder, zipPath, function(err) {
    if (!err) {
      uploadZip(callback);
    } else {
      callback(err);
    }
  })
}

publish(function(err) {
  if (!err) {
    console.log('paulstestbot1804 publish');
  } else {
    console.error('failed to publish paulstestbot1804', err);
  }
});