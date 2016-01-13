
var COLOR_YELLOW = "rgb(235,195,9)";
var COLOR_GRAY = "rgb(230,230,230)";
var COLOR_RED = "rgb(160,23,46)";
var COLOR_BLACK = "rgb(128, 128, 128)";
var COLOR_GREEN = "rgb(79, 133, 33)";

var COLOR_DARK_GRAY= "rgb(136,136,136)";

function ProgressBarContext(container){
	this.container = container;
	
	this.width = this.container.style("width");
	this.height = this.container.style("height");
	
	this.h = parseInt(this.height);
	this.w = parseInt(this.width);
	
	this.svg = this.container.append("svg");
	this.svg.attr("width", this.w);
	this.svg.attr("height", this.h);
	
	//this.mx = this.h / 3;
	//this.my = this.h * 2 / 3;
	
	//this.x = 0 + this.mx;
	//this.y = 0 + this.my;
	
	//this.tHeight = this.h / 8;
	//this.pHeight = this.h / 3;
}

function RunningProgressBar(context, smtTime, stTime, ctTime, eetTime, rtlTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.ctTime = ctTime;
	this.eetTime = eetTime;
	this.rtlTime = rtlTime;
	
	this.getStartTime = function(){
		return this.smtTime;
	}
	
	this.getEndTime = function(){
		var r = this.eetTime;
		if(this.rtlTime != null && this.eetTime <= this.rtlTime){
			r = this.rtlTime;
		}
		return r;
	}
	
	this.getTimeRange = function(){
		return this.getEndTime() - this.getStartTime();
	}
	
	this.getYCount = function(){
		var r = 2;
		//if estTime == ptlTime, there should showing 4 layers
		if((this.eetTime - this.rtlTime) == 0) r = 3;
		//TODO, showing the time stamp & help tips
		return r;	
	}
	this.getYUnit = function(){
		return this.context.h / this.getYCount();
	}
	
	this.getXUnit = function(){
		return (this.context.w -  this.getXMargin() - this.getXRMargin()) / this.getTimeRange();
	}
	
	this.getXMargin = function(){
		return this.getYUnit() / 2;
	}
	
	this.getXRMargin = function(){
		var r = this.getYUnit() / 2;
		if((this.eetTime - this.rtlTime) == 0) r = this.getYUnit() * 2;
		return r;
	}
	
	this.getYMargin = function(){
		return (this.getYCount() - 1) * this.getYUnit();
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = 0; var y = 0;
		
		//from smtTime to stTime
		var x1 = x + this.getXMargin();
		var y1 = y + this.getYMargin();
		var r1 = (this.stTime - this.smtTime) * this.getXUnit();
		r.push(new ProgresserBreakLine(this.context, x1, y1, COLOR_YELLOW, r1, this.getYUnit()));
		
		//from stTime to ctTime
		var x2 = x1 + r1; 
		var y2 = y1;
		var r2 = (this.ctTime - this.stTime) * this.getXUnit();
		r.push(new Progresser(this.context, x2, y2, COLOR_GREEN, r2, this.getYUnit()));
		
		//from ctTime to eetTime
		var x3 = x2 + r2; 
		var y3 = y2;
		var r3 = (this.eetTime - this.ctTime) * this.getXUnit();
		r.push(new Progresser(this.context, x3, y3, COLOR_GRAY, r3, this.getYUnit()));
				
		if(this.eetTime < this.rtlTime){
			//from estTime to ptlTime
			var x4 = x3 + r3; 
			var y4 = y3;
			var r4 = (this.rtlTime - this.eetTime) * this.getXUnit();
			r.push(new BreakLine(this.context, x4, y4, r4, this.getYUnit()));
		}
		
		return r;
	}
	
	this.getTimers = function(){
		var r = [];
		var x = 0; var y = 0; 
		
		var tWidth = this.getYUnit();
		var tHeight = this.getYUnit();
		
		//smtTime
		var x1 = x + this.getXMargin(); 
		var y1 = y + this.getYMargin();
		r.push(new Timer(this.context, x1, y1, tWidth, tHeight, COLOR_GRAY, "SMT"));
		
		//stTime
		var s2 = (this.stTime - this.smtTime) * this.getXUnit();
		var x2 = x1 + s2; 
		var y2 = y1;
		r.push(new Timer(this.context, x2, y2, tWidth, tHeight, COLOR_GRAY, "ST"));

		//ctTime
		var s3 = (this.ctTime - this.smtTime) * this.getXUnit();
		var x3 = x1 + s3; 
		var y3 = y2;
		r.push(new Timer(this.context, x3, y3, tWidth, tHeight, COLOR_GREEN, "CT"));
		
		if((this.eetTime - this.rtlTime) != 0){
			//eetTime
			var s4 = (this.eetTime - this.smtTime) * this.getXUnit();
			var x4 = x1 + s4; 
			var y4 = y3;
			r.push(new Timer(this.context, x4, y4, tWidth, tHeight, COLOR_GRAY, "EET"));
			
			//rtlTime
			var s5 = (this.rtlTime - this.smtTime) * this.getXUnit();
			var x5 = x1 + s5; 
			var y5 = y4;
			r.push(new Timer(this.context, x5, y5, tWidth, tHeight, COLOR_RED, "RTL"));
		}else{
			//eetTime & rtlTime
			var s5 = (this.rtlTime - this.smtTime) * this.getXUnit();
			var x5 = x1 + s5; 
			var y5 = y2;
			r.push(new DoubleTimer(this.context, x5, y5, tWidth * 2, tHeight * 2, COLOR_GRAY, COLOR_RED, "EET=RTL"));
		}
		//console.log(r)
		return r;
	}
}

function PendingProgressBar(context, smtTime, ctTime, estTime, ptlTime){
	this.context = context;
	this.smtTime = smtTime;
	this.ctTime = ctTime;
	this.estTime = estTime;
	this.ptlTime = ptlTime;
	
	this.getStartTime = function(){
		return this.smtTime;
	}
	
	this.getEndTime = function(){
		var r = this.estTime;
		if(this.ptlTime != null && this.estTime <= this.ptlTime){
			r = this.ptlTime;
		}
		return r;
	}

	this.getTimeRange = function(){
		return this.getEndTime() - this.getStartTime();
	}
	
	this.getYCount = function(){
		var r = 2;
		//if estTime == ptlTime, there should showing 3 layers
		if((this.estTime - this.ptlTime) == 0) r = 3;
		//TODO, showing the time stamp & help tips
		return r;	
	}
	this.getYUnit = function(){
		return this.context.h / this.getYCount();
	}
	
	this.getXUnit = function(){
		return (this.context.w -  this.getXMargin() - this.getXRMargin()) / this.getTimeRange();
	}
	
	this.getXMargin = function(){
		return this.getYUnit() / 2;
	}
	
	this.getXRMargin = function(){
		var r = this.getYUnit() / 2;
		if((this.estTime - this.ptlTime) == 0) r = this.getYUnit() * 2;
		return r;
	}
	
	this.getYMargin = function(){
		return (this.getYCount() - 1) * this.getYUnit();
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = 0; var y = 0;
		//console.log("YCount: " + this.getYCount() + " | YUnit: " + this.getYUnit());
		
		//from smtTime to ctTime
		var x1 = x + this.getXMargin(); 
		var y1 = y + this.getYMargin();
		var r1 = (this.ctTime - this.smtTime) * this.getXUnit();
		r.push(new Progresser(this.context, x1, y1, COLOR_YELLOW, r1, this.getYUnit()));
		
		//from ctTime to estTime
		var x2 = x1 + r1; 
		var y2 = y1;
		var r2 = (this.estTime - this.ctTime) * this.getXUnit();
		r.push(new Progresser(this.context, x2, y2, COLOR_GRAY, r2, this.getYUnit()));
		
		if(this.estTime < this.ptlTime){
			//from estTime to ptlTime
			var x3 = x2 + r2; 
			var y3 = y2;
			var r3 = (this.ptlTime - this.estTime) * this.getXUnit();
			r.push(new BreakLine(this.context, x3, y3, r3, this.getYUnit()));
		}

		return r;
	}
	
	this.getTimers = function(){
		var r = [];
		var x = 0; var y = 0; 
		
		var tWidth = this.getYUnit();
		var tHeight = this.getYUnit();
		
		//smtTime
		var x1 = x + this.getXMargin(); 
		var y1 = y + this.getYMargin();
		r.push(new Timer(this.context, x1, y1, tWidth, tHeight, COLOR_GRAY, "SMT"));
		
		//ctTime
		var s2 = (this.ctTime - this.smtTime) * this.getXUnit();
		var x2 = x1 + s2; 
		var y2 = y1;
		r.push(new Timer(this.context, x2, y2, tWidth, tHeight, COLOR_YELLOW, "CT"));
		
		if((this.estTime - this.ptlTime) != 0){
			//estTime
			var s3 = (this.estTime - this.smtTime) * this.getXUnit();
			var x3 = x1 + s3; 
			var y3 = y2;
			r.push(new Timer(this.context, x3, y3, tWidth, tHeight, COLOR_GRAY, "EST"));
		
			//ptlTime
			var s4 = (this.ptlTime - this.smtTime) * this.getXUnit();
			var x4 = x1 + s4; 
			var y4 = y3;
			r.push(new Timer(this.context, x4, y4, tWidth, tHeight, COLOR_RED, "PTL"));
		}else{
			//estTime & ptlTime
			var s4 = (this.ptlTime - this.smtTime) * this.getXUnit();
			var x4 = x1 + s4; 
			var y4 = y2;
			r.push(new DoubleTimer(this.context, x4, y4, tWidth * 2, tHeight * 2, COLOR_GRAY, COLOR_RED, "EST=PTL"));		
		}
		//console.log(r)
		return r;
	}
}

function Progresser(context, x, y , color, width, height){
	this.context = context; 
	this.x = x; 
	this.y = y; 
	this.color = color; 
	this.width = width;
	this.height = height;
	
	this.show = function(){
		var r = this.context.svg.append("rect");
		r.attr("x", this.x).attr("y", this.y).attr("fill", this.color);
		r.attr("width", this.width).attr("height", this.height);
	}
	
	this.toHtml = function(){
		//<rect x="310" y="20" width="100" height="20" style="fill:rgb(230,230,230)"/>
	}
}

function ProgresserBreakLine(context, x, y , color, width, height){
	this.context = context; 
	this.x = x; 
	this.y = y; 
	this.color = color; 
	this.width = width;
	this.height = height;
	
	this.show = function(){
		var pWidth = width * 0.4;
		var progresser = new Progresser(this.context, this.x, this.y , this.color, pWidth, this.height);
		progresser.show();
		
		var bWidth = width * 0.6;
		var breakLine = new BreakLine(this.context, this.x + pWidth, this.y, bWidth, this.height);
		breakLine.show();
	}
	
	this.toHtml = function(){
		//<rect x="310" y="20" width="100" height="20" style="fill:rgb(230,230,230)"/>
	}
}

function BreakLine(context, x, y, width, height){
	this.context = context; 
	this.x = x; 
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.show = function(){
		var lPercent = 0.4;
		var rPercent = 0.6;
		
		//slash height
		var xHeight = 1;
		var yHeight = this.height / 4;
		
		//line start
		var ls = this.context.svg.append("line");
		var ls_x1 = this.x;
		var ls_y1 = this.y + this.height / 2;
		var ls_x2 = this.x + this.width * lPercent;
		var ls_y2 = ls_y1;
		ls.attr("x1", ls_x1).attr("y1", ls_y1).attr("x2", ls_x2).attr("y2", ls_y2);
		ls.attr("style", "stroke:" + COLOR_BLACK);
		
		var l2 = this.context.svg.append("line");
		var l2_x1 = ls_x2 - xHeight;
		var l2_y1 = ls_y2 + yHeight;
		var l2_x2 = ls_x2 + xHeight;
		var l2_y2 = ls_y2 - yHeight;
		l2.attr("x1", l2_x1).attr("y1", l2_y1).attr("x2", l2_x2).attr("y2", l2_y2);
		l2.attr("style", "stroke:" + COLOR_BLACK);

		//line end
		var le = this.context.svg.append("line");
		var le_x1 = this.x + this.width * rPercent;
		var le_y1 = this.y + this.height / 2;
		var le_x2 = this.x + this.width;
		var le_y2 = le_y1;
		le.attr("x1", le_x1).attr("y1", le_y1).attr("x2", le_x2).attr("y2", le_y2);
		le.attr("style", "stroke:" + COLOR_BLACK);
		
		var l3 = this.context.svg.append("line");
		var l3_x1 = le_x1 - xHeight;
		var l3_y1 = le_y1 + yHeight;
		var l3_x2 = le_x1 + xHeight;
		var l3_y2 = le_y1 - yHeight;
		l3.attr("x1", l3_x1).attr("y1", l3_y1).attr("x2", l3_x2).attr("y2", l3_y2);
		l3.attr("style", "stroke:" + COLOR_BLACK);
	}
	
	this.toHtml = function(){
		//<rect x="310" y="20" width="100" height="20" style="fill:rgb(230,230,230)"/>
	}
}

function DoubleTimer(context, x, y, width, height, color1, color2, name){
	this.context = context; 
	this.x = x; 
	this.y = y;
	this.width = width;
	this.height = height;
	this.color1 = color1; 
	this.color2 = color2;
	this.name = name;
	
	this.show = function(){
		var tWidth = width / 2;
		var tHeight = height / 2;
		
		var t1_x = this.x;
		var t1_y = this.y;
		var timer1 = new Timer(this.context, t1_x, t1_y, tWidth, tHeight, this.color1, "");
		timer1.show();
		
		var t2_x = t1_x;
		var t2_y = t1_y - tHeight / 4;
		var timer2 = new Timer(this.context, t2_x, t2_y, tWidth, tHeight, this.color2, this.name);
		timer2.show();
	}
	
	this.toHtml = function(){
		//<text x="3" y="5" style="font-size:10px;fill:black">SMT</text>
		//<polygon points="5,12 15,12 10,20" style="fill:rgb(214,214,218);stroke:rgb(136,136,136);stroke-width:1" />
		//<line x1="10" y1="20" x2="10" y2="42" style="stroke:rgb(128,128,128)" />
	}
}

function Timer(context, x, y, width, height, color, name){
	this.context = context; 
	this.x = x; 
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color; 
	this.name = name;
	
	this.show = function(){		
		var pWidth = this.width / 4;
		var pHeight = this.height / 4;
		
		var p = this.context.svg.append("polygon");
		var p_x1 = this.x - pWidth;
		var p_y1 = this.y - pHeight;
		var p_x2 = p_x1 + pWidth * 2;
		var p_y2 = p_y1;;
		var p_x3 = this.x;
		var p_y3 = this.y;
		p.attr("points", (p_x1 + "," + p_y1) + " " + (p_x2 + "," + p_y2) + " " + (p_x3 + "," + p_y3));
		p.attr("style", "fill:" + this.color + ";stroke:" + COLOR_BLACK + ";stroke-width:1");

		var tWidth = this.width / 2;
		var tHeight = this.height / 2;

		var t = this.context.svg.append("text");
		var t_x = this.x - tWidth;
		var t_y = this.y - tHeight;
		var t_s = tHeight + "px";
		t.attr("x", t_x).attr("y", t_y).attr("style", "font-size:" + t_s + ";fill:black").text(this.name);
		
		var l = this.context.svg.append("line");
		var l_x1 = this.x;
		var l_y1 = this.y;
		var l_x2 = l_x1;
		var l_y2 = l_y1 + this.height;
		l.attr("x1", l_x1).attr("y1", l_y1).attr("x2", l_x2).attr("y2", l_y2);
		l.attr("style", "stroke:" + COLOR_BLACK);
	}
	
	this.toHtml = function(){
		//<text x="3" y="5" style="font-size:10px;fill:black">SMT</text>
		//<polygon points="5,12 15,12 10,20" style="fill:rgb(214,214,218);stroke:rgb(136,136,136);stroke-width:1" />
		//<line x1="10" y1="20" x2="10" y2="42" style="stroke:rgb(128,128,128)" />
	}
}