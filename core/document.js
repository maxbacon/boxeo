/**
 * License: MIT; Author: Max Bacon
 */
var Boxeo = function(config) {
   var _notify = __PUBSUB(this);
   __EVENTS(this);

   var _state = __STATE(this, _notify, function(_state) {
      var u = _state.$orientation_u;
      var v = _state.$orientation_v;
      var d = u * u + v * v;
      // ideally, this condition converges, but should we prove
      // otherwise, let's not worry about the performance
      var len = Math.sqrt(d);
      _state.$orientation_u = u / len;
      _state.$orientation_v = v / len;
   });

   _state.$uid = __UID();
   _state.$origin_x = 0;
   _state.$origin_y = 0;
   _state.$orientation_u = 1;
   _state.$orientation_v = 0;
   _state.$width = 200;
   _state.$height = 100;
   _state.$tags = "";
   _state.$url = "";

   this.contains = function(_x, _y) {
      var x = _x - _state.$origin_x;
      var y = _y - _state.$origin_y;
      // first we take (x,y) and divide by (u,v) ~ u + v i
      // since u*u + v*v = 1, this is simple
      // 1 / (u + v i) = (u - v i) / (u + v i)*(u - v i) = (u - v i) / 1
      // (x + y i) * (u - v i) = x * (u - v i) + yi * (u - v i)
      // = x * u - x * v i + y i * u - y i * v i
      // = (x * u - y * v * -1) + (y i * u - x * v i)
      // = (x*u+y*v) + (y*u-x*v) i
      var u = _state.$orientation_u;
      var v = _state.$orientation_v;
      var _a = x * u + y * v;
      var _b = y * u - x * v;
      var check_a = Math.abs(_a) * 2 <= _state.$width;
      var check_b = Math.abs(_b) * 2 <= _state.$height;
      var inside = check_a && check_b;
      var result = {
         inside : inside,
         item : this
      };
      if (inside) {
         result.x = _a + _state.$width / 2.0;
         result.y = _b + _state.$height / 2.0;
      }
      return result;
   };

   return this;
};

var BoxeoLayer = function(config) {
   var _elements = [];
   var _notify = __PUBSUB(this);
   __EVENTS(this);
   var _state = __STATE(this, _notify, function(_state) {

   });

   _state.$uid = __UID();
   _state.$cursor_x = 0;
   _state.$cursor_y = 0;
   _state.$width = 1;
   _state.$height = 1;

   this.add = function(boxeo) {
      _elements[_elements.length] = boxeo;
      boxeo.subscribe(function() {
         _notify();
      });
      _notify();
   };
   this.remove = function(boxeo) {
      var _next = [];
      for ( var _k = 0; _k < _n; _k++) {
         if (_elements[_k] != boxeo) {
            _next[_next.length] = _elements[_k];
         }
      }
   }
   this.selectByPoint = function(x, y) {
      _state.$cursor_x = x;
      _state.$cursor_y = y;
      var last = null;
      var _n = _elements.length;
      for ( var _k = 0; _k < _n; _k++) {
         var chk = _elements[_k].contains(x, y);
         if (chk.inside) {
            last = chk;
         }
      }
      if (last != null) {
         last.selected = true;
      }
      _notify();
      return last;
   };
   this.iterate = function(foo) {
      var _n = _elements.length;
      for ( var _k = 0; _k < _n; _k++) {
         foo(_elements[_k], _k);
      }
   };
   var _iter = this.iterate;
   this.resize = function(w, h) {
      var diff = Math.abs(_state.$width - w) + Math.abs(_state.$height - h);
      if (diff > 0) {
         _state.$width = w;
         _state.$height = h;
         _notify();
      }
   };
   var _fire = this.fire;
   this.event('draw', function(self, ctx) {
      _fire('pre-draw', ctx);
      _iter(function(element, _) {
         element.fire('draw', ctx);
      });
      _fire('post-draw', ctx);
   });
   this.packageDrag = function(e) {
      var p = __MOUSE(e);
      var et = e.currentTarget;
      e.dataTransfer.setData("offX", et.width/2 - p.x);
      e.dataTransfer.setData("offY", et.height/2 - p.y);
   };
   this.computeDrop = function(e) {
      var m = __MOUSE(e);
      m.x += parseInt(e.dataTransfer.getData("offX"));
      m.y += parseInt(e.dataTransfer.getData("offY"));
      return m;
   };
};
