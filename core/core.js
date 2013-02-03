/**
 * License: MIT; Author: Max Bacon
 */
var boxeo$setup = function(htmlId, boxeoDocument, config) {
   var domElementFront = document.getElementById(htmlId);
   // based on config.RENDERER; pick one, for now we only have 2D
   var _renderer = new boxeo$rendering$software(htmlId);
   _sent = false;
   var waitms = config.REFRESH_WAIT;
   var _drawAll = function() {
      if (_sent) {
         return;
      }
      _sent = true;
      window.setTimeout(function() {
         _sent = false;
         var dim = _renderer.begin(htmlId);
         var p = __ELEMENT_POSITION(domElementFront);
         boxeoDocument.updateViewPort(p.x, p.y);
         boxeoDocument.resize(dim.width, dim.height);
         boxeoDocument.fire('draw', _renderer);
      }, waitms);
   };
   _renderer.setRestart(_drawAll);
   $(domElementFront).mousedown(function(e) {
      boxeoDocument.fire('mouse-down', __MOUSE(e));
   });
   $(domElementFront).mousemove(function(e) {
      boxeoDocument.fire('mouse-move', __MOUSE(e));
   });
   $(domElementFront).mouseup(function(e) {
      boxeoDocument.fire('mouse-up', __MOUSE(e));
   });
   boxeoDocument.subscribe(_drawAll);
   _drawAll();
};
