/* jshint browser: true, globalstrict: true, devel: true */
/* global io: false */
"use strict";

// Inicjalizacja
window.addEventListener("load", function (event) {
    var status = $("#status");
    var open = $('#open');
    var close = $("#close");
    var send = $("#send");
    var text = $("#text");
    var message = $("#message");
    var nick = $('#nick');
    
    var socket;

    status.text = "Brak połącznia";
    close.disabled = true;
    send.disabled = true;

    // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
    open.on("click", function (event) {
        open.disabled = true;
        if (!socket || !socket.connected) {
            socket = io({forceNew: true});
        }
        socket.on('connect', function () {
            send.prop('disabled', false);
            close.prop('disabled', false);
            open.prop('disabled', true);

            status.attr('src', "img/bullet_green.png");
            console.log('Nawiązano połączenie przez Socket.io');
            socket.emit('nick', nick.val());
        });
        socket.on('disconnect', function () {
            open.prop('disabled', false);
            status.attr('src', "img/bullet_red.png");
            console.log('Połączenie przez Socket.io zostało zakończone');
        });
        socket.on("error", function (err) {
            message.text("Błąd połączenia z serwerem: '" + JSON.stringify(err) + "'");
        });
        socket.on("echo", function (data) {
            message.prepend('<li>' + data + '</li>');
        });
    });
    
    // Zamknij połączenie po kliknięciu guzika „Rozłącz”
    close.on("click", function (event) {
        close.prop('disabled', true);
        send.prop('disabled', true);
        open.prop('disabled', false);
        message.val("");
        socket.io.disconnect();
        console.dir(socket);
    });

    // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
    send.on("click", function (event) {
        socket.emit('message', text.val());
        console.log('Wysłałem wiadomość: ' + text.val());
        text.val("");
    });
});
