'use strict';

/* global define:true*/
define(['jquery',
    'knockout',
    '../../assets/js/models/appViewModel.js',
    '../../assets/js/appSocketIO.js',
    'jquery.bootstrap'
    ], function ($, ko, AppViewModel, AppSocketIO) {

  var UI = new AppViewModel();

  // creating new object to manage socket.io events / connection
  // this object has the knockout view model as parameter
  UI.socketIO = new AppSocketIO(UI);

  ko.applyBindings(UI);

});
