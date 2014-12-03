
var filter = new Filters;

$(document).ready(function(){

	var fileobj = document.getElementById('openfile');
	fileobj.onchange = function (event) {

		var fr = new FileReader();
		fr.onload = function (event) {
			var myCanvas = document.getElementById('ImageCanvas');
			var myCanvasContext = myCanvas.getContext('2d');
			var imageObj = new Image();

			filter.canvas = myCanvas;
			filter.context = myCanvasContext;

			imageObj.onload = function() {
				filter.imgWidth = imageObj.width;
				filter.imgHeight = imageObj.height;
				myCanvas.width = filter.imgWidth;
				myCanvas.height = filter.imgHeight;
				             
   
				myCanvasContext.drawImage(imageObj, 0, 0);
			};

			imageObj.src = event.target.result;
		};

		fr.readAsDataURL(event.target.files[0]);
	};	

	$("#detect").click(function() {
		filter.process();
		var CircleDetector = new myHoughCircle;
		var rect ={x1:0,y1:0,x2:filter.new_width,y2:filter.new_height};
        CircleDetector.scale = filter.scale;
		CircleDetector.circle_scan(filter.grayData,rect,10,85, filter.new_width, filter.new_height);	
	});
});