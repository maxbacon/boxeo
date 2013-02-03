var __CACHE = {};
var boxeo$image = function(url, onload) {
	var cacheEntry = __CACHE[url];
	if (cacheEntry) {
		return cacheEntry;
	}
	var img = new Image();
	img.onload = function() {
		__CACHE[url] = img;
		onload(img);
	};
	img.src = url;
	return img;
};