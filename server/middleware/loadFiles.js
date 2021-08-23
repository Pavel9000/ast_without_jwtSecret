const fs = require('fs')
const deleteRecursive = require('./deleteRecursive')
var Busboy = require('busboy')

module.exports = async (req, res, next) => {
    // let amountFiles = 0
    let id = ''
    if (req.method === 'POST') { id = Date.now()+'_'+Math.round(Math.random()*1e9) }
    if (req.method === 'PUT') { 
      id = req.params.id
      if (fs.existsSync(req.rootDirName+'/client/public/img/'+req.pathForFiles+'/'+id)){
        deleteRecursive.folderSync(req.rootDirName+'/client/public/img/'+req.pathForFiles+'/'+id)
      }
    }

    req.body = Object.create(null)
    var busboy
    try {
      busboy = new Busboy({ 
        headers: req.headers, 
        limits: { 
          fieldNameSize: 100, // Max field name size (in bytes) (Default: 100 bytes)
          fieldSize: 1000000, // Max field value size (in bytes) (Default: 1MB)
          fields: 20, // Max number of non-file fields (Default: Infinity)
          fileSize: 1000000, // max file size (in bytes) (Default: Infinity)
          files: 20, //  max number of file fields (Default: Infinity)
          parts: 40, // max number of parts (fields + files) (Default: Infinity)
          headerPairs: 2000 // max number of header key=>value pairs to parse Default: 2000 (same as node's http)
        } 
      })
      busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        file.on('error', function (err) { 
          return res.status(401).json({"message": "err"})
        })
        file.on('limit', function() { 
          return res.status(401).json({"message": "LIMIT_FILE_SIZE"})
        })
        file.fileRead = [];
        var size = 0;
        file.on('data', function(chunk) {
          // console.log(chunk.length)
          // size += chunk.length
          // if( size > 500000) {
          //   file.resume()
          //   return res.json({success: false, message: 'Invalid file format'})
          // }
          // file.fileRead.push(chunk);
        })
        file.on('end', function() {
          // var data = Buffer.concat(file.fileRead, size);
          // ... upload to S3
          // amountFiles++
        });
        if ( (mimetype !== 'image/png' && mimetype !== 'image/jpeg') ) {
            file.resume()
            return res.json({success: false, message: 'Invalid file format'})
        }
        if (!fs.existsSync(req.rootDirName+'/client/public/img')){
          fs.mkdirSync(req.rootDirName+'/client/public/img')
        }
        if (!fs.existsSync(req.rootDirName+'/client/public/img/'+req.pathForFiles)){
          fs.mkdirSync(req.rootDirName+'/client/public/img/'+req.pathForFiles)
        }
        if (!fs.existsSync(req.rootDirName+'/client/public/img/'+req.pathForFiles+'/'+id)){
          fs.mkdirSync(req.rootDirName+'/client/public/img/'+req.pathForFiles+'/'+id)
        }
        // Upload
        fstream = fs.createWriteStream(req.rootDirName+'/client/public/img/'+req.pathForFiles + '/' + id + '/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () { 
          // return res.json({success: true}) 
        })
      })
      // text
      busboy.on('field', function (fieldname, value) {
        req.body[fieldname] = value
      })
      busboy.on('error', function (err) { 
        return res.status(401).json({"message": "Error"})
      })
      busboy.on('partsLimit', function () { 
        return res.status(401).json({"message": "LIMIT_PART_COUNT"})
      })
      busboy.on('filesLimit', function () { 
        return res.status(401).json({"message": "LIMIT_FILE_COUNT"})
      })
      busboy.on('fieldsLimit', function () { 
        return res.status(401).json({"message": "LIMIT_FIELD_COUNT"})
      })
      busboy.on('finish', function () { 
        // req.body["amountFiles"] = String(amountFiles)
        req.body["id"] = id
        next()
      })
      req.pipe(busboy)
    } catch(err) {
      return res.status(401).json({"message": "Error"})
    }
}
