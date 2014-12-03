
// image process filter
var Filters = function(){

	var self = this;
	this.canvas = null;
	this.context = null;
	this.imgWidth = 0;
	this.imgHeight = 0;
	this.grayData = [];
	this.scale = 0;
	this.new_width = 0;
	this.new_height = 0;

	this.getPixels = function() {	
		return this.context.getImageData(0, 0, this.imgWidth, this.imgHeight);
	};

	this.grayscale = function(){		
		var imageData = this.resize(self.canvas,self.imgWidth,self.imgHeight,100);		
		var grayData = new Array(imageData.height * imageData.width);
		var k = 0;
		// This loop gets every pixels on the image and
		for (var i = 0; i < imageData.height; i++)
		{
			for (var j = 0; j < imageData.width; j++)
			{
				var index=(i*4)*imageData.width+(j*4);
				var red=imageData.data[index];
				var green=imageData.data[index+1];
				var blue=imageData.data[index+2];
				var alpha=imageData.data[index+3];
				var average=(red+green+blue)/3;
				grayData[k++] = parseInt(average);				
			}
		}

		return grayData;
	};

	this.brightness = function(pixels, adjustment) {		
		for (var i = 0; i < pixels.length; i++) {
			pixels[i] += adjustment;
		}
		return pixels;
	};

	this.threshold = function(pixels, threshold) {		
		for (var i=0; i<pixels.length; i++) {
			//var v = (pixels[i] >= threshold) ? 255 : 0;
			var v = (pixels[i] >= threshold) ? 0 : 255;
			pixels[i] = v;
		}
		return pixels;
	};

	this.convolute = function(pixels, iw, ih, weights) {
		var side = Math.round(Math.sqrt(weights.length));
		var halfSide = Math.floor(side/2);
		var src = pixels;
		var sw = iw;
		var sh = ih;

		// pad output by the convolution matrix
		var w = sw;
		var h = sh;
		var output = new Array(w*h);
		var dst = output;

		// go through the destination image pixels
		for (var y=0; y<h; y++) {
			for (var x=0; x<w; x++) {
				var sy = y;
				var sx = x;
				var dstOff = (y*w+x);
				// calculate the weighed sum of the source image pixels that
				// fall under the convolution matrix
				var r=0;
				for (var cy=0; cy<side; cy++) {
					for (var cx=0; cx<side; cx++) {
						var scy = sy + cy - halfSide;
						var scx = sx + cx - halfSide;
						if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
							var srcOff = (scy*sw+scx);
							var wt = weights[cy*side+cx];
							r += src[srcOff] * wt;
						}
					}
				}
				if (r>255)
				{
					r=255;
				}
				else if(r<0)
				{
				    r=0;	
				}
				dst[dstOff] = parseInt(r);
			}
		}
		return output;
	};

	this.blur = function(pixels, iw, ih){
		return this.convolute(pixels, iw, ih, [0.1,	0.1, 0.1,
												0.1,1.0,0.1,
												0.1,0.1, 0.1]);
	};

	this.edge = function(pixels, iw, ih){
		return this.convolute(pixels, iw, ih, [-1,-1,-1,-1,8,-1,-1,-1,-1]);
	};

	this.sharpen = function(pixels, iw, ih){
		return this.convolute(pixels, iw, ih, [1/9, 1/9, 1/9,
												1/9, 1/9, 1/9,
												1/9, 1/9, 1/9]);
	};
   
    this.resize = function(canvas,width,height,new_width)
	{
		var cacheCanvas = document.createElement("canvas");
		context = cacheCanvas.getContext('2d');
		var Scale = new_width/width;
        cacheCanvas.width = new_width;
        cacheCanvas.height = Math.floor(Scale*height);
		this.new_width = new_width;
		this.new_height =  Math.floor(Scale*height);
		this.scale = Scale;
		context.setTransform( Scale, 0, 0, Scale, 0, 0 );
        context.drawImage(canvas, 0, 0 );
		return context.getImageData(0, 0, new_width,Math.floor(Scale*height));
	};

	this.process = function(){
		var grayData = this.grayscale();
		var blurData = this.blur(grayData, this.new_width, this.new_height);
		var thresData = this.threshold(blurData, 128);
		var edgeData = this.edge(thresData, this.new_width, this.new_height);
		this.grayData = edgeData;	
	};

	this.updateImageData = function(pixel){
		this.context.putImageData(pixel, 0, 0);
	};

};