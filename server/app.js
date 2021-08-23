const express = require('express')
const bodyParser = require('body-parser')
const config = require('config')
const fs = require('fs');
const db = require('./db')

const app = express()
// app.use(express.json({extended: true}))

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))


// // отключить защиту CORS
app.use(function (req, res, next) {
  var origins = [
    'http://localhost:5000',
    'http://localhost:3000',
    'http://127.0.0.1:5000',
    'http://127.0.0.1:3000'
  ];
  for(var i = 0; i < origins.length; i++){
      var origin = origins[i];

      // if(req.headers.origin.indexOf(origin) > -1){
      if(req.headers.origin) {
          res.header('Access-Control-Allow-Origin', req.headers.origin);
      }
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token");
  next();
});


const rootDirName = __dirname.slice(0, (-1)*(__dirname.split('/')[__dirname.split('/').length-1].length)).slice(0,-1)
app.use('*', (req, res, next) => { req.rootDirName = rootDirName; next() } )


app.use('/api/about', require('./api/about/routes'))
app.use('/api/admin/about', require('./middleware/isTokenValid'), (req, res, next) => { req.pathForFiles = 'about'; next() }, require('./api/about/routesAdmin'))

app.use('/api/services', require('./api/services/routes'))
app.use('/api/admin/services', require('./middleware/isTokenValid'), (req, res, next) => { req.pathForFiles = 'services'; next() }, require('./api/services/routesAdmin'))

app.use('/api/contacts', require('./api/contacts/routes'))
app.use('/api/admin/contacts', require('./middleware/isTokenValid'), (req, res, next) => { req.pathForFiles = 'contacts'; next() }, require('./api/contacts/routesAdmin'))

app.use('/api/how', require('./api/how/routes'))
app.use('/api/admin/how', require('./middleware/isTokenValid'), (req, res, next) => { req.pathForFiles = 'how'; next() }, require('./api/how/routesAdmin'))

app.use('/api/home', require('./api/home/routes'))
app.use('/api/admin/home', require('./middleware/isTokenValid'), (req, res, next) => { req.pathForFiles = 'home'; next() }, require('./api/home/routesAdmin'))

app.use('/api/posts', require('./api/posts/routes'))
app.use('/api/admin/posts', require('./middleware/isTokenValid'), (req, res, next) => { req.pathForFiles = 'posts'; next() }, require('./api/posts/routesAdmin'))

app.use('/api/auth', require('./api/auth/routes'))

app.use('/img', express.static(rootDirName + '/client/public/img'))
app.use('/', express.static(rootDirName + '/client/build'))
app.get('*', (req, res) => {
  res.sendFile(rootDirName + '/client/build/index.html')
})

// app.get('/my', (req, res) => {
//     res.sendFile(__dirname + 'editImg/my.html')
// })

// app.get('/', (req, res) => {
//   res.send('hello')
// })


async function start() {
    try {
      db.connect('mongodb://localhost:27017', (err) =>  {
        if (err) {
          return console.log(err);
        }
        const PORT = config.get('port') || 5000
        app.listen(PORT, function () {
          console.log(`API app started ${PORT}`);
        })
      })

      // var MongoClient = require('mongodb').MongoClient;
      // const mongoUri = 'mongodb+srv://mdbxx327:asdzxc164@cluster0-a4dyk.mongodb.net/app?retryWrites=true&w=majority'
      // await MongoClient.connect(mongoUri, {
      //     useNewUrlParser: true, 
      //     useUnifiedTopology: true,
      //     // useCreateIndex: true 
      //   }, console.log(`mongodb started `))
      //   app.listen(PORT, function () {
      //     console.log(`API app started ${PORT}`);
      //   })

    } catch (e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()