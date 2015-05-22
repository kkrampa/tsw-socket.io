/* jshint node: true */
var app = require("express")();
var httpServer = require("http").Server(app);
var io = require("socket.io")(httpServer);

var static = require('serve-static');
var port = process.env.PORT || 3000;

var oneDay = 86400000;

app.use('/img', static(__dirname + '/public/img', { maxAge: oneDay }));
app.use('/js/jquery.min.js', static(__dirname + '/bower_components/jquery/dist/jquery.min.js'));
app.use('/js/jquery.min.map', static(__dirname + '/bower_components/jquery/dist/jquery.min.map'));
app.use(static(__dirname + '/public'));

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
        user = users.filter(function(element) {
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

httpServer.listen(port, function () {
    console.log('Serwer HTTP działa na porcie ' + port);
});
