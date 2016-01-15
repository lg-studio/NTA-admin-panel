var express = require('express');
// var cors = require('cors');
var morgan = require('morgan');
var path = require('path');

var app = express();
// var port = process.env.PORT || 3000;
var port = 3002;

// app.use(cors());
app.use(morgan('dev', {
        skip: function (req, res) { 
            var path = req.url;
            if(path.indexOf('.components') > -1 ) return true
            if(path.indexOf('css') > -1 ) return true
            if(path.indexOf('img') > -1 ) return true
            if(path.indexOf('views') > -1 ) return true
            if(path.indexOf('js') > -1 ) return true
        }
    }));

process.env.PWD = process.cwd();
app.set('dist', path.join(process.env.PWD, 'dist'));
app.use(express.static(path.join(process.env.PWD, 'dist')));

// app.use(express.static(__dirname + '/src'));

app.listen(port);
console.log('Server starts on localhost:' + port);