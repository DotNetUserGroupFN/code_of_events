'use strict';

const angular = require('angular'),
      request = require('request');

const app = angular.module('winner', []);

app.controller('EventsController', function ($scope) {
  this.events = [];

  this.addParticipant = function (eventId, name, phoneNumber) {
    request({
      method: 'POST',
      url: `http://nug.goloroden.de/api/v1/events/${eventId}/participant`,
      json: true,
      body: { name, phoneNumber }
    }, (err, res) => {
      if (err || res.statusCode !== 200) {
        return console.log('Something went wrong!', err);
      }
    });
  };

  request({
    method: 'GET',
    url: `http://nug.goloroden.de/api/v1/events/?_${Date.now()}`,
    json: true
  }, (err, res) => {
    if (err) {
      return console.log(err);
    }

    $scope.$apply(() => {
      console.log(res.body);
      this.events = res.body;
    });
  });
});
