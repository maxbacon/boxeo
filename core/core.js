/**
 * License: MIT; Author: Max Bacon
 */
var boxeo$setup = function(htmlId, boxeoDocument, config) {
   var domElementFront = document.getElementById(htmlId);
   // based on config.RENDERER; pick one, for now we only have 2D
   var _renderer = new boxeo$rendering$software(htmlId);
   var _drawAll = function() {
      var dim = _renderer.begin(htmlId);
      boxeoDocument.resize(dim.width, dim.height);
      boxeoDocument.fire('draw', _renderer);
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
