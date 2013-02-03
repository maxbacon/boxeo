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

   var _project = function(pnts, axis, axis_off) {
      var a = 1000000.0;
      var b = -a;
      for ( var k = 0; k < 8; k += 2) {
         var p = axis[axis_off] * pnts[k] + axis[axis_off + 1] * pnts[k + 1];
         a = Math.min(p, a);
         b = Math.max(p, b);
      }
      return [ a, b ];
   };

   var _shown = false;
   this.touches = function(_x, _y, _w, _h) {
      var u = _state.$orientation_u;
      var v = _state.$orientation_v;
      var pntsA = [];
      var w = _state.$width / 2.0;
      var h = _state.$height / 2.0;
      var duX = w * u;
      var duY = w * v;
      var dvX = h * (-v);
      var dvY = h * u;
      pntsA[0] = _state.$origin_x - duX - dvX;
      pntsA[1] = _state.$origin_y - duY - dvY;
      pntsA[2] = _state.$origin_x + duX - dvX;
      pntsA[3] = _state.$origin_y + duY - dvY;
      pntsA[4] = _state.$origin_x + duX + dvX;
      pntsA[5] = _state.$origin_y + duY + dvY;
      pntsA[6] = _state.$origin_x - duX + dvX;
      pntsA[7] = _state.$origin_y - duY + dvY;
      var pntsB = [ _x, _y, _x + _w, _y, _x + _w, _y + _h, _x, _y + _h ];
      var axis = [ u, v, -v, u, 0, 1, 1, 0 ];
      for ( var k = 0; k < 8; k += 2) {
         var projA = _project(pntsA, axis, k);
         var projB = _project(pntsB, axis, k);
         if (projA[1] < projB[0] || projB[1] < projA[0])
            return false;
      }
      return true;
   };

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
      var result = { inside : inside, item : this };
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

   _viewport = { x : 0, y : 0 };
   this.updateViewPort = function(x, y) {
      _viewport.x = x;
      _viewport.y = y;
   };
   this.size = function() {
      return _elements.length;
   };
   this.add = function(boxeo) {
      _elements[_elements.length] = boxeo;
      boxeo.subscribe(function() {
         _notify();
      });
      _notify();
   };
   this.addAll = function(boxeos) {
      for ( var k = 0; k < boxeos.length; k++) {
         _elements[_elements.length] = boxeos[k];
         boxeos[k].subscribe(function() {
            _notify();
         });
      }
      _notify();
   };
   this.remove = function(boxeo) {
      var _next = [];
      for ( var _k = 0; _k < _n; _k++) {
         if (_elements[_k] != boxeo) {
            _next[_next.length] = _elements[_k];
         }
      }
   };
   this.selectByPoint = function(x, y, dontUpdateSelectionState) {
      _state.$cursor_x = x;
      _state.$cursor_y = y;
      var selUpdate = !dontUpdateSelectionState;

      var last = null;
      var _n = _elements.length;
      var changed = false;
      for ( var _k = 0; _k < _n; _k++) {
         var chk = _elements[_k].contains(x, y);
         if (chk.inside) {
            last = chk;
         }
         if (selUpdate) {
            if (_elements[_k].selected != chk.inside) {
               changed = true;
               _elements[_k].selected = chk.inside;
            }
         }
      }
      if (selUpdate) {
         if (changed) {
            if (last != null)
               last.selected = true;
         }
      }
      _notify();
      return last;
   };
   this.selectByRect = function(rect) {
      var x = rect.x;
      var y = rect.y;
      var w = rect.w;
      var h = rect.h;
      var objs = [];
      var _n = _elements.length;
      var changed = false;
      for ( var _k = 0; _k < _n; _k++) {
         var chk = _elements[_k].touches(x, y, w, h);
         if (chk) {
            objs[objs.length] = _elements[_k];
         }
         if (_elements[_k].selected != chk) {
            changed = true;
            _elements[_k].selected = chk;
         }
      }
      if (changed) {
         _notify();
      }
      if (objs.length > 0) {
         return objs;
      }
      return null;
   };
   this.iterate = function(foo) {
      var _n = _elements.length;
      for ( var _k = 0; _k < _n; _k++) {
         foo(_elements[_k], _k);
      }
   };
   this.map = function(foo) {
      var _n = _elements.length;
      var res = [];
      for ( var _k = 0; _k < _n; _k++) {
         res[_k] = foo(_elements[_k], _k);
      }
      return res;
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
      e.dataTransfer.setData("offX", et.width / 2 - p.x);
      e.dataTransfer.setData("offY", et.height / 2 - p.y);
   };
   this.computeDrop = function(e) {
      var m = __MOUSE(e);
      m.x += parseInt(e.dataTransfer.getData("offX"));
      m.y += parseInt(e.dataTransfer.getData("offY"));
      return m;
   };
   var _trackRubberBandStart = { x : 0, y : 0, dom : null };
   this.beginRubberBand = function(rubberBandId, m) {
      var rubberBand = document.getElementById(rubberBandId);
      _trackRubberBandStart.x = m.x;
      _trackRubberBandStart.y = m.y;
      rubberBand.style.position = "absolute";
      rubberBand.style.display = "";
      rubberBand.style.left = (m.x + _viewport.x) + "px";
      rubberBand.style.top = (m.y + _viewport.y) + "px";
      rubberBand.style.width = "1px";
      rubberBand.style.height = "1px";
      _trackRubberBandStart.dom = rubberBand;
   };
   this.updateRubberBand = function(m) {
      var rubberBand = _trackRubberBandStart.dom;
      var a = Math.min(m.x, _trackRubberBandStart.x);
      var b = Math.min(m.y, _trackRubberBandStart.y);
      var c = Math.max(m.x, _trackRubberBandStart.x);
      var d = Math.max(m.y, _trackRubberBandStart.y);
      rubberBand.style.left = (a + _viewport.x) + "px";
      rubberBand.style.top = (b + _viewport.y) + "px";
      rubberBand.style.width = (c - a) + "px";
      rubberBand.style.height = (d - b) + "px";
      return { x : a, y : b, w : c - a, h : d - b };
   };
   this.hideRubberBand = function(m) {
      var rubberBand = _trackRubberBandStart.dom;
      rubberBand.style.display = "none";
      rubberBand.style.left = "0px";
      rubberBand.style.top = "0px";
      rubberBand.style.width = "1px";
      rubberBand.style.height = "1px";
      var a = Math.min(m.x, _trackRubberBandStart.x);
      var b = Math.min(m.y, _trackRubberBandStart.y);
      var c = Math.max(m.x, _trackRubberBandStart.x);
      var d = Math.max(m.y, _trackRubberBandStart.y);
      return { x : a, y : b, w : c - a, h : d - b };
   };
};
