/**
 * License: MIT; Author: Max Bacon
 */
var API = function() {
   this.getDefaultConfig = boxeo$config;
   this.setUp = boxeo$setup;
   this.newLayer = function(cfg) {
      return new BoxeoLayer(cfg);
   };
   this.newObject = function(cfg) {
      return new Boxeo(cfg);
   };
   this.image = boxeo$image;
};
