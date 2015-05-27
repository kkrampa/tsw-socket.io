/* jshint node: true */
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();
var expressSession = require('express-session');
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);
var passport = require('passport');
var static = require('serve-static');
var database = require('./database/users');
var passportLocal = require('passport-local');
var crypto = require('crypto');
var uuid = require('node-uuid');

var oneDay = 86400000;
var port = process.env.PORT || 3000;

app.use('/img', static(__dirname + '/public/img', { maxAge: oneDay }));
app.use('/js/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use('/js/jquery.min.map', static(__dirname + '/bower_components/jquery/dist/jquery.min.map'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');

var validateUser = function (username, password, done) {
    var user = database.findByUsername(username);
    crypto.pbkdf2(password, 'salt', 4096, 10, 'sha256', function(err, key) {
        if (err)
            throw err;
        var hash = key.toString('hex');
        if (user && user.password === hash) {
            done(null, user);
        } else {
            done(null, null);
        }
    });
    
};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    var user = database.findById(id);
    if (user) {
        done(null, {
            id: user.id,
            username: user.username,
            password: user.password
        });
    } else {
        done({
            msg: 'Nieznany ID'
        });
    }
});

passport.use(new passportLocal.Strategy(validateUser));
var users = [];
io.sockets.on("connection", function (socket) {
    socket.on("message", function (data) {
        var user = users.filter(function(element) {
            return element.socket === socket;
        })[0];
        var date = new Date();
        io.sockets.emit("echo", '[' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + '] ' + user.nick + ": " + data);
    });
    socket.on("nick", function (data) {
        var alreadyTaken = users.some(function(element) {
            return element.nick === data;
        });
        
        if (alreadyTaken) {
            socket.disconnect();
        } else {
            users.push({
                nick: data,
                socket: socket
            });
            var date = new Date();
            socket.emit("echo", "Witaj " + data + "!");
            io.sockets.emit("echo", '[' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + '] ' + data + ' dołączył do czatu');
        }
    });
    
    socket.on("disconnect", function(data) {
        var user = users.filter(function(element) {
            return element.socket === socket;
        })[0];
        users = users.filter(function(element) {
            return element.socket !== socket;
        });
        var date = new Date();
        io.sockets.emit("echo", '[' + date.toLocaleDateString() + ' ' + date.toLocaleTimeString() + '] ' + user.nick + ' rozłączył się');
    });
    
    socket.on("error", function (err) {
        console.dir(err);
    });
});

app.get('/login', function (req, res) {
   res.render('form'); 
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    res.redirect('/');
});

app.get('/', function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/login');
    } else {
        res.render('index', {
            isAuthenticated: req.isAuthenticated(),
            user: req.user
        });
    }
    
});

httpServer.listen(port, function () {
    console.log('Serwer HTTP działa na porcie ' + port);
});
