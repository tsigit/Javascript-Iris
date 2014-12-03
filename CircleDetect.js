
// transform of HoughCircle
var myHoughCircle = function(){
    
	this.imagData;
	this.rect;	
	this.circle = [];
	this.scale = 0;
	var self = this;

	// preget values of cos, sin
	function cs_factor(angle)
	{
	   var cos_factor = [];
       var cos_val,sin_val;
	   for (var i =0; i<360 ; i+=angle)
	   {
           var radian = (i/180)*Math.PI;
		   cos_val = Math.cos(radian);
		   sin_val = Math.sin(radian);
		   cos_factor.push({cos:cos_val,sin:sin_val});
	   }

	   return cos_factor;
	}

	// get pixel of image.
	function pixel(x,y)
	{
		if(x<0) x=0;
		else if(x>self.width) x=self.width;

        if(y<0) y=0;
		else if(y>self.height) y=self.height;

        var index = y * self.width + x;
		return self.imagData[index];

	}

	// get maximum of radius.
	function get_maxR(x,y)
	{
		var x1= self.rect.x1;
		var x2= self.rect.x2;
		var y1= self.rect.y1;
		var y2= self.rect.y2;
		var x_r = Math.min(x-x1,x2-x);
		var y_r = Math.min(y-y1,y2-y);
		return Math.min(x_r,y_r);		 
	}

	// detect of circle round.
	function detect_pixel(x,y,n)
	{
		var i,j; 
		for (j=y-n;j<=y+n;j++ )
		{
			for (i=x-n;i<=x+n;i++ )
			{
				if(pixel(i,j)==255)
				{
					return true;
				}
			}
		}
		return false;
	 }
  
	// detect circle
	this.CircleDetector = function(x,y,r,factor,threshold)
	{	     
		 var i; 
		 var result=0;
         for (i=0;i<factor.length;i++ )
         {
			 var x1 = Math.floor(x+r*factor[i].cos);
             var y1 = Math.floor(y+r*factor[i].sin);
             if(pixel(x1,y1)==255)
			 {
				result++;
			 }
			 else if(detect_pixel(x1,y1,1)) 
			 {
				result++;				 
			 }
		 } 
		
        var accuracy = (result/factor.length)*100;
		if(accuracy>threshold)
		{
			this.circle.push({x:x,y:y-1,r:r+2});  
		}
	};
   
   // initialize
   this.init =function(image,rect,min_r, w, h){
	     this.imagData = image;
	     this.rect = rect;
		 this.min_r = min_r;
		 this.width = w;
		 this.height = h;
	};
	
	// get available all circles
	this.circle_scan = function(image,rect,min_r,threshold, w, h)
	{	      
		    
          var r_limit= Math.min((rect.x2-rect.x1)/2,(rect.y2-rect.y1)/2);
		  if(r_limit<min_r)
		   {
			  min_r=Math.floor(r_limit);
		   }

		  this.init(image, rect, min_r, w, h);
		  var x,y,r;
		  var factor = cs_factor(8);

		  for (y = rect.y1 + min_r;y<=rect.y2-min_r;y++)
		  {
			  for (x=rect.x1+min_r;x<=rect.x2-min_r;x++)
			  {  
                  var max_r =get_maxR(x,y); 
				  for (r=min_r;r<=max_r;r++)
				  {
					  this.CircleDetector(x,y,r,factor,threshold);
				  }
			  }
		  }
		  draw_circle();
         
    };
	
	// draw iris circle.
    function draw_circle()
	{
		if(self.circle.length>0)
		{   
			var iris = {x:0,y:0,r:0};

			var myCanvas = document.getElementById('ImageCanvas');
			var ctx = myCanvas.getContext('2d');
			ctx.beginPath();			
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#ff00ff';
			ctx.stroke();	

			for (var i = 0; i < self.circle.length; i++)
			{
				if (self.circle[i].r > iris.r)
				{
					iris.x = self.circle[i].x;
					iris.y = self.circle[i].y;
					iris.r = self.circle[i].r;
				}
				
				
			}

			var x = Math.floor(iris.x/self.scale);
			var y = Math.floor(iris.y/self.scale);
			var r = Math.floor(iris.r/self.scale);	

			ctx.arc(x, y, r, 0, 2 * Math.PI, false);
			ctx.moveTo(x+r,y);
			ctx.lineTo(x-r,y);
			ctx.moveTo(x,y+r);
			ctx.lineTo(x,y-r);

			ctx.stroke();
            
			
		}
		else
		{
		    alert('no iris!');
	    }
	}
  
};
