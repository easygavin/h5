/**
 * Created by Administrator on 14-3-26.
 */
define(function (require, exports, module) {
  var $ = require('zepto'),
    util = require('util'),
    service = require('services/jcz'),
    path = require('path');
  var a;
  var b;
  var c;
  var analyse = {
    show: function () {
      service.getJCZQAgainstInfo(this.param, function (data) {

      });
    },

    init: function (data, forward) {
      this.param = data;
      this.forward = forward;
      this.data = {}
      this.show();
      this.events();
    },
    events: function () {

    }
  };
  module.exports = analyse;
});