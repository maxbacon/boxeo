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
   }
}
