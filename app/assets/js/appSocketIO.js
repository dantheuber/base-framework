'use strict';

/* global io:true*/
/* global define:true*/
define(['bootbox',
        'jquery',
        'notify-bootstrap',
        'socket.io-client'
    ], function (bootbox, $) {
  return function (UI) {
    var self = this;

    // saving knockout model
    self.UI = UI;

    var socket = io.connect('http://localhost');

    /* global window:true*/
    // Rewriting emit to add debugging information in console
    if (window.knockoutBootstrapDebug) {
      (function () {
        var $emit = socket.$emit;
        socket.$emit = function () {
          var args = Array.prototype.slice.call(arguments);
          $emit.apply(socket, ['*'].concat(args));
          if (!$emit.apply(socket, arguments)) {
            $emit.apply(socket, ['default'].concat(args));
          }
        };

        var emit = socket.emit;
        socket.emit = function () {
          console.log('==> ', arguments[0], arguments[1]);
          emit.apply(socket, arguments);
        };

        socket.on('default', function (event, data) {
          console.log('Event not trapped: ' + event + ' - data:' + JSON.stringify(data));
        });

        socket.on('*', function (event, data) {
          console.log('<== ', event, data);
        });
      })();
    }

    // Events

    socket.on('message', function (data) {
      UI.messageReceived(UI.messageReceived() + data.message + '\n');
    });

    // The connection status is saved in the model
    socket.on('connect', function () {
      UI.connection.state('connect');
    });

    socket.on('connecting', function (data) {
      UI.connection.connectionMethod(data);
      UI.connection.state('connecting');
    });

    socket.on('disconnect', function () {
      UI.connection.state('disconnect');
    });

    socket.on('reconnecting', function (data) {
      UI.connection.setReconnectDelay(parseInt(data) / 1000);
      UI.connection.state('reconnecting');
    });

    socket.on('reconnect', function () {
      UI.connection.state('reconnect');
    });

    // Actions

    self.sendBroadcastMessage = function () {
      if (UI.message.isValid()) {
        bootbox.confirm('Are you sure?', function (result) {
          if (result) {
            socket.emit('send_message', {message: self.UI.message()});
            $.notify('message sent', 'success');
          }
        });
      }
    };
  };
});
