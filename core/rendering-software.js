/**
 * License: MIT; Author: Max Bacon
 */
var boxeo$rendering$software = function(id) {
   var _ctx = null;
   var _w = 1;
   var _h = 1;
   var _restart = function() {
   };
   this.begin = function(htmlId) {
      var domElement = document.getElementById(htmlId);
      _ctx = domElement.getContext('2d');
      _w = $(domElement).width();
      _h = $(domElement).height();
      return {
         width : _w,
         height : _h
      };
   };
   this.setRestart = function(restart) {
      _restart = restart;
   }
   this.restart = function() {
      _restart();
   };
   this.clear = function() {
      _ctx.clearRect(0, 0, _w, _h);
   };
   this.shade = function(shaderName) {
      if (shaderName == 'black') {
         _ctx.strokeStyle = '#000000';
      }
      if (shaderName == 'red') {
         _ctx.strokeStyle = '#ff0000';
      }
   };
   this.rect = function(x, y, w, h) {
      _ctx.beginPath();
      var hw = Math.round(w / 2);
      var hh = Math.round(h / 2);
      _ctx.moveTo(x - hw, y - hh);
      _ctx.lineTo(x - hw, y + (h - hh));
      _ctx.lineTo(x + (w - hw), y + (h - hh));
      _ctx.lineTo(x + (w - hw), y - hh);
      _ctx.lineTo(x - hw, y - hh);
      _ctx.stroke();
   };
   this.rect2 = function(x, y, w, h) {
      _ctx.beginPath();
      _ctx.moveTo(x, y);
      _ctx.lineTo(x, y + h);
      _ctx.lineTo(x + w, y + h);
      _ctx.lineTo(x + w, y);
      _ctx.lineTo(x, y);
      _ctx.stroke();
   };
   this.transform = function(u, v, x, y, cb) {
      _ctx.save();
      try {
         _ctx.transform(u, v, -v, u, x, y);
         cb();
      } catch (e) {
         _ctx.restore();
         throw e;
      }
      _ctx.restore();
   };
   this.image = function(img, x, y) {
      if (img) {
         _ctx.drawImage(img, x, y);
      }
   };
   this.snapshot = function() {
      return _ctx.toDataURL("image/png");
   };
   this.point = function(x, y, r) {
      _ctx.beginPath();
      _ctx.arc(x, y, r, 0, 2 * Math.PI, false);
      _ctx.stroke();
   };
}
