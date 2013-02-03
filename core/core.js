var boxeo$setup = function(htmlId, boxeoDocument) {
	var domElement = document.getElementById(htmlId);
	var _drawAll = function() {
		var ctx = domElement.getContext('2d');
		var w = $(domElement).width();
		var h = $(domElement).height();
		boxeoDocument.resize(w, h);
		boxeoDocument.clearAll = function() {
			ctx.clearRect(0, 0, w, h);
		};
		boxeoDocument.fire('draw', ctx);
	};
	$(domElement).mousedown(function(e) {
		boxeoDocument.fire('mouse-down', __MOUSE(e));
	});
	$(domElement).mousemove(function(e) {
		boxeoDocument.fire('mouse-move', __MOUSE(e));
	});
	$(domElement).mouseup(function(e) {
		boxeoDocument.fire('mouse-up', __MOUSE(e));	
	});
	boxeoDocument.subscribe(_drawAll);
	_drawAll();
};