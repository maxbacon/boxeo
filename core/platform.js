/**
 * License: MIT; Author: Max Bacon
 */
var __UID = function() {
   var parts = [];
   parts[0] = Math.random().toString(36).substr(2, 9);
   parts[1] = Math.random().toString(36).substr(2, 9);
   parts[2] = Math.random().toString(36).substr(2, 9);
   parts[3] = Math.random().toString(36).substr(2, 9);
   parts[4] = new Date().getTime().toString(36);
   return parts.join('-').toUpperCase();
};

var __IMMUTABLE = function(o) {
   var cpy = {};
   for (k in o)
      cpy[k] = o[k];
   return cpy;
};

var __ELEMENT_POSITION = function(domElement) {
   var curleft = curtop = 0;
   if (domElement.offsetParent) {
      do {
         curleft += domElement.offsetLeft;
         curtop += domElement.offsetTop;
      } while (domElement = domElement.offsetParent);
      return { "x" : curleft, "y" : curtop };
   }
};

var __MOUSE = function(e) {

   // this section is from http://www.quirksmode.org/js/events_properties.html
   var targ = null;
   if (!e)
      e = window.event;
   if (e.target)
      targ = e.target;
   else if (e.srcElement)
      targ = e.srcElement;
   if (targ.nodeType == 3) // defeat Safari bug
      targ = targ.parentNode;

   // jQuery normalizes the pageX and pageY
   // pageX,Y are the mouse positions relative to the document
   // offset() returns the position of the element relative to the document
   var x = e.pageX - $(targ).offset().left;
   var y = e.pageY - $(targ).offset().top;

   return { "x" : x, "y" : y };
};

var __PUBSUB = function(_self) {
   var _events = [];
   _self.subscribe = function(evt) {
      _events[_events.length] = evt;
   };
   var _notify = function() {
      var optimizeNeeded = false;
      var _n = _events.length;
      for ( var _k = 0; _k < _n; _k++) {
         if (_events[_k] == null)
            continue;
         var ctrl = { $remove : false };
         _events[_k](_self, ctrl);
         if (ctrl.$remove) {
            optimizeNeeded = true;
            _events[_k] = null;
         }
      }
      if (!optimizeNeeded) {
         return;
      }
      var _nextEvents = new Array();
      for ( var _k = 0; _k < _n; _k++) {
         if (_events[_k] != null) {
            _nextEvents[_nextEvents.length] = _events[_k];
         }
      }
      _events = _nextEvents;
   };
   _self.notify = _notify;
   return _notify;
};

var __EVENTS = function(self) {
   var _events = {};

   self.event = function(name, callback) {
      _events[name] = callback;
   };

   self.fire = function(name, ctx) {
      var callback = _events[name];
      if (callback)
         callback(self, ctx);
   };
};

var __STATE = function(self, _notify, _norm) {
   var _state = {};

   self.state = function() {
      return __IMMUTABLE(_state);
   };
   self.mutate = function(next) {
      var didAnything = false;
      for (k in next) {
         if (_state[k] != next[k]) {
            _state[k] = next[k];
            didAnything = true;
         }
      }
      if (!didAnything)
         return;
      _norm(_state);
      _notify();
      return self;
   };
   return _state;
};
