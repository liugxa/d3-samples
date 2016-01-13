var COLOR_BLACK = "rgb(128, 128, 128)";
var COLOR_WHITE = "rgb(255, 255, 255)";
var COLOR_GRAY = "#dddddd";
var COLOR_YELLOW = "#f0cc00";
var COLOR_GREEN = "#60942c";
var COLOR_RED = "#b2293d";
var COLOR_PINK = "#e17e2d";

var COLOR_RUNNING = "#60942c";
var COLOR_WAITING = "#fff69b";
var COLOR_SUSPENDED = "#e17e2d";
var COLOR_PENDING = "#f0cc00";
var COLOR_EXITED = "#b2293d";
var COLOR_DONE = "#dddddd";
var COLOR_HOLD = "#eeeef0";

function Constants(){
	this.get = function(name){
		var r = {
			"SMT": {"name": "SMT", "wholeName": "Submitted Time"},
			"CT": {"name": "CT", "wholeName": "Current Time"},
			"EST": {"name": "EST", "wholeName": "Estimated Start Time"},
			"ET": {"name": "ET", "wholeName": "End Time"},
			"SPT": {"name": "SPT", "wholeName": "Suspended Time"},
			"PTL": {"name": "PTL", "wholeName": "Pending Time Limit"},
			"EST=PTL": {"name": "PTL", "wholeName": "Pending Time Limit"},
			"ST": {"name": "ST", "wholeName": "Start Time"},
			"EET": {"name": "EET", "wholeName": "Estimated End Time"},
			"RTL": {"name": "RTL", "wholeName": "Run Time Limit"},
			"EET=RTL": {"name": "EET=RTL", "wholeName": "Run Time Limit"},
			
		};
		return r[name];
	}
}

function ProgressBarContext(container){
	this.container = container;
	
	this.width = this.container.style("width");
	this.height = this.container.style("height");
	
	this.h = parseInt(this.height);
	this.w = parseInt(this.width);
		
	this.svg = this.container.append("svg");
	this.svg.attr("width", this.w);
	this.svg.attr("height", this.h);
	
	this.showTimerName = false;
	this.showTimerBar = true;
	this.constants = new Constants();
	
	//the 2 lays are capable of the size
	this.yCount = (this.showTimerBar == true) ? 5 : 2;
	
	this.xUnit = -1;
	this.yUnit = -1;
	this.xMargin = -1;
	this.yMargin = -1;
	
	this.resetXY = function(startTime, endTime){
		this.yUnit = this.h / this.yCount;

		this.xMargin = this.yUnit / 2;
		this.yMargin = this.yUnit;
		
		var xRMargin = this.yUnit / 2;
		//if((this.eetTime - this.rtlTime) == 0) xRMargin = this.yUnit * 2;
		
		var timeRange = endTime - startTime;
		this.xUnit = (this.w -  this.xMargin - xRMargin) / timeRange;
	}
}

function DefaultProgressBar(context){

	this.init = function(){	
		return 	function(){
			this.context.resetXY(this.getStartTime(), this.getEndTime());
			return this;
		}
	}

	this.getTimerBars = function(){
		return 	function(){
			var r = [];
			var x = 0; var y = 0;
			
			var startTime = this.getStartTime();
			var endTime = this.getEndTime();
			
			var tWidth = this.context.w / 3;
			var x1 = x + this.context.xMargin;
			var y1 = y + this.context.yMargin * 2;
			r.push(new TimerBar(this.context, "startTime", startTime, x1, y1, tWidth, this.context.yUnit));
			
			var s2 = (endTime - startTime) * this.context.xUnit;
			var x2 = x1 + s2;
			var y2 = y1;
			r.push(new TimerBar(this.context, "endTime", endTime, x2, y2, tWidth, this.context.yUnit));
			
			return r;
		}
	}
}
/*
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
	
	this.init = function(){
		this.context.resetXY(this.getStartTime(), this.getEndTime());
		return this;
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = 0; var y = 0;
		
		//from smtTime to stTime
		var x1 = x + this.context.xMargin;
		var y1 = y + this.context.yMargin;
		var r1 = (this.stTime - this.smtTime) * this.context.xUnit;
		r.push(new ProgresserBreakLine(this.context, this.smtTime, this.stTime, x1, y1, COLOR_YELLOW, "Pending Duration"));
		
		//from stTime to ctTime
		var x2 = x1 + r1; 
		var y2 = y1;
		var r2 = (this.ctTime - this.stTime) * this.context.xUnit;
		r.push(new Progresser(this.context, this.stTime, this.ctTime, x2, y2, COLOR_GREEN, "Running Duration"));
		
		//from ctTime to eetTime
		var x3 = x2 + r2; 
		var y3 = y2;
		var r3 = (this.eetTime - this.ctTime) * this.context.xUnit;
		r.push(new Progresser(this.context, this.ctTime, this.eetTime, x3, y3, COLOR_GRAY));
				
		if(this.eetTime < this.rtlTime){
			//from estTime to ptlTime
			var x4 = x3 + r3; 
			var y4 = y3;
			var r4 = (this.rtlTime - this.eetTime) * this.context.xUnit;
			r.push(new BreakLine(this.context, this.eetTime, this.rtlTime, x4, y4));
		}
		
		return r;
	}
	
	this.getTimers = function(){
		var r = [];
		var x = 0; var y = 0; 
		
		//smtTime
		if(this.smtTime){
			var x1 = x + this.context.xMargin; 
			var y1 = y + this.context.yMargin;
			r.push(new Timer(this.context, "SMT", this.smtTime, x1, y1, COLOR_GRAY));
		}
		
		//stTime
		if(this.stTime){
			var s2 = (this.stTime - this.smtTime) * this.context.xUnit;
			var x2 = x1 + s2; 
			var y2 = y1;
			r.push(new Timer(this.context, "ST", this.stTime, x2, y2, COLOR_GRAY));
		}
		
		//ctTime
		if(this.ctTime){
			var s3 = (this.ctTime - this.smtTime) * this.context.xUnit;
			var x3 = x1 + s3; 
			var y3 = y2;
			r.push(new Timer(this.context, "CT", this.ctTime, x3, y3, COLOR_GREEN));
		}
		
		if((this.eetTime - this.rtlTime) != 0){
			//eetTime
			if(this.eetTime){
				var s4 = (this.eetTime - this.smtTime) * this.context.xUnit;
				var x4 = x1 + s4; 
				var y4 = y3;
				r.push(new Timer(this.context, "EET", this.eetTime, x4, y4, COLOR_GRAY));
			}
			
			//rtlTime
			if(this.rtlTime){
				var s5 = (this.rtlTime - this.smtTime) * this.context.xUnit;
				var x5 = x1 + s5; 
				var y5 = y4;
				r.push(new Timer(this.context, "RTL", this.rtlTime, x5, y5, COLOR_RED));
			}
		}else{
			//eetTime & rtlTime
			if(this.rtlTime){
				var s5 = (this.rtlTime - this.smtTime) * this.context.xUnit;
				var x5 = x1 + s5; 
				var y5 = y2;
				r.push(new DoubleTimer(this.context, "EET=RTL", this.rtlTime, x5, y5, COLOR_GRAY, COLOR_RED));
			}
		}
		return r;
	}
	
	this.getTimerBars = function(){
		var r = [];
		var x = 0; var y = 0;
		
		var startTime = this.getStartTime();
		var endTime = this.getEndTime();
		
		var tWidth = this.context.w / 3;
		var x1 = x + this.context.xMargin;
		var y1 = y + this.context.yMargin * 2;
		r.push(new TimerBar(this.context, "startTime", startTime, x1, y1, tWidth, this.context.yUnit));
		
		var s2 = (endTime - startTime) * this.context.xUnit;
		var x2 = x1 + s2; 
		var y2 = y1;
		r.push(new TimerBar(this.context, "endTime", endTime, x2, y2, tWidth, this.context.yUnit));
		
		return r;
	}
}
*/

/*
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
	
	this.init = function(){
		this.context.resetXY(this.getStartTime(), this.getEndTime());
		return this;
	}

	this.getTimerBars = function(){
		var r = [];
		var x = 0; var y = 0;
		
		var startTime = this.getStartTime();
		var endTime = this.getEndTime();
		
		var tWidth = this.context.w / 3;
		var x1 = x + this.context.xMargin;
		var y1 = y + this.context.yMargin * 2;
		r.push(new TimerBar(this.context, "startTime", startTime, x1, y1, tWidth, this.context.yUnit));
		
		var s2 = (endTime - startTime) * this.context.xUnit;
		var x2 = x1 + s2; 
		var y2 = y1;
		r.push(new TimerBar(this.context, "endTime", endTime, x2, y2, tWidth, this.context.yUnit));
		
		return r;
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = 0; var y = 0;
		
		//from smtTime to ctTime
		var x1 = x + this.context.xMargin; 
		var y1 = y + this.context.yMargin;
		var r1 = (this.ctTime - this.smtTime) * this.context.xUnit;
		r.push(new Progresser(this.context, this.smtTime, this.ctTime, x1, y1, COLOR_YELLOW, "Pending Duration"));
		
		//from ctTime to estTime
		var x2 = x1 + r1; 
		var y2 = y1;
		var r2 = (this.estTime - this.ctTime) * this.context.xUnit;
		r.push(new Progresser(this.context, this.ctTime, this.estTime, x2, y2, COLOR_GRAY));
		
		if(this.estTime < this.ptlTime){
			//from estTime to ptlTime
			var x3 = x2 + r2; 
			var y3 = y2;
			var r3 = (this.ptlTime - this.estTime) * this.context.xUnit;
			r.push(new BreakLine(this.context, this.estTime, this.ptlTime, x3, y3));
		}
		
		return r;
	}
	
	this.getTimers = function(){
		var r = [];
		var x = 0; var y = 0;
		
		//smtTime
		if(this.smtTime){
			var x1 = x + this.context.xMargin; 
			var y1 = y + this.context.yMargin;
			r.push(new Timer(this.context, "SMT", this.smtTime, x1, y1, COLOR_GRAY));
		}
		
		//ctTime
		if(this.ctTime){
			var s2 = (this.ctTime - this.smtTime) * this.context.xUnit;
			var x2 = x1 + s2; 
			var y2 = y1;
			r.push(new Timer(this.context, "CT", this.ctTime, x2, y2, COLOR_YELLOW));
		}
		
		if((this.estTime - this.ptlTime) != 0){
			//estTime
			if(this.estTime){
				var s3 = (this.estTime - this.smtTime) * this.context.xUnit;
				var x3 = x1 + s3; 
				var y3 = y2;
				r.push(new Timer(this.context, "EST", this.estTime, x3, y3, COLOR_GRAY));
			}
			
			//ptlTime
			if(this.ptlTime){
				var s4 = (this.ptlTime - this.smtTime) * this.context.xUnit;
				var x4 = x1 + s4; 
				var y4 = y3;
				r.push(new Timer(this.context, "PTL", this.ptlTime, x4, y4, COLOR_RED));
			}
		}else{
			//estTime & ptlTime
			if(this.ptlTime){
				var s4 = (this.ptlTime - this.smtTime) * this.context.xUnit;
				var x4 = x1 + s4; 
				var y4 = y2;
				r.push(new DoubleTimer(this.context, "EST=PTL", this.ptlTime, x4, y4, COLOR_GRAY, COLOR_RED));
			}
		}
		return r;
	}
}
*/

function Tooltip(context, x, y, tooltip){
	this.context = context; 
	this.x = x; 
	this.y = y;
	this.tooltip = tooltip;
	
	this.attach = function(object){
		object.on("mouseenter", function(){
			object.style("cursor", "pointer");
			var tp_x = d3.event.pageX + 10;
			var tp_y = d3.event.pageY + 10;
			
			var tp = d3.select("body").append("div").attr("id", "div-tooltip").attr("class", "tooltip").text(tooltip);
			tp.style("left", tp_x + "px").style("top", tp_y + "px");
		});
		
		object.on("mousemove", function(){
			//console.log("event.pageX: " + d3.event.pageX + " | event.pageY: " + d3.event.pageY);
			var tp_x = d3.event.pageX + 10;
			var tp_y = d3.event.pageY + 10;
			
			var tp = d3.select("#div-tooltip");
			tp.style("left", tp_x + "px").style("top", tp_y + "px");
		});
		
		object.on("mouseout", function(){
			//console.log("mouse out!");
			var tp = d3.select("#div-tooltip");
			tp.remove();
		});
	}
}

function Progresser(context, startTime, endTime, x, y , color, tooltip){
	this.context = context;
	this.startTime = startTime;
	this.endTime = endTime;

	this.x = x;
	this.y = y;

	this.color = color;	
	this.tooltip = tooltip;

	this.width = (this.endTime - this.startTime) * this.context.xUnit;
	this.height = this.context.yUnit;
		
	//with an tooltip
	this.show = function(){
		var r = this.context.svg.append("rect");
		r.attr("x", this.x).attr("y", this.y).attr("fill", this.color);
		r.attr("width", this.width).attr("height", this.height);
		
		//attach the mouse event
		var durationDate = new Date(this.endTime - this.startTime);
		var format = d3.time.format("%H %M %S");
		
		if(this.tooltip) {
			var tp = new Tooltip(this.context, this.x, this.y, this.tooltip + "\n" + this.formatDuration(durationDate));
			tp.attach(r);
		}
	}
	
	this.formatDuration = function(date){
		var r = "";
		
		var y = date.getUTCFullYear() - 1970;
		if(y != 0) r = r + y + "Y" + " ";
		
		var m = date.getUTCMonth();
		if(m != 0) r = r + m + "m" + " ";
		
		var d = date.getUTCDate() - 1;
		if(d != 0) r = r + d + "D" + " ";
		
		var h = date.getUTCHours();
		if(h != 0) r = r + h + "H" + " ";
		
		var mi = date.getUTCMinutes();
		if(mi != 0) r = r + mi + "M" + " ";
		
		var s = date.getUTCSeconds();
		if(s != 0) r = r + s + "S" + " ";
		
		return r;
	}
	
	this.toHtml = function(){
		//<rect x="310" y="20" width="100" height="20" style="fill:rgb(230,230,230)"/>
	}
}

function ProgresserBreakLine(context, startTime, endTime, x, y, color, tooltip){
	this.context = context;
	this.startTime = startTime;
	this.endTime = endTime;
	
	this.x = x; 
	this.y = y;
	
	this.color = color;
	this.tooltip = tooltip;
	
	this.show = function(){
		var duration = this.endTime - this.startTime;
		var pMilliseconds = this.startTime.getTime() + duration * 0.4;
		var pEndTime = new Date(pMilliseconds);
		
		//console.log(this.x + "|" + this.y + "|" + this.xUnit + "|" + this.yUnit + "|" + this.color);
		var progresser = new Progresser(this.context, this.startTime, pEndTime, this.x, this.y, this.color,this.tooltip);
		progresser.show();
		
		//console.log(this.startTime + " | " + pEndTime + " | " + this.endTime);
		var bX = (pEndTime - this.startTime) * this.context.xUnit;
		var breakLine = new BreakLine(this.context, pEndTime, this.endTime, this.x + bX, this.y);
		breakLine.show();
	}
	
	this.toHtml = function(){
		//<rect x="310" y="20" width="100" height="20" style="fill:rgb(230,230,230)"/>
	}
}

function BreakLine(context, startTime, endTime, x, y, tooltip){
	this.context = context;
	this.startTime = startTime;
	this.endTime = endTime;
	
	this.x = x; 
	this.y = y;
	this.tooltip = tooltip;
	
	this.width = (this.endTime - this.startTime) * this.context.xUnit;
	this.height = this.context.yUnit;
		
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

function DoubleTimer(context, name, time, x, y, color1, color2){
	this.context = context;
	this.name = name;
	this.time = time;
	
	this.x = x; 
	this.y = y;
	
	this.color1 = color1; 
	this.color2 = color2;
	
	this.show = function(){
		var t1_x = this.x;
		var t1_y = this.y;
		var timer1 = new Timer(this.context, "", this.time, t1_x, t1_y, this.color1);
		timer1.show();
		
		var t2_x = t1_x;
		var t2_y = t1_y - timer1.height;
		var timer2 = new Timer(this.context, this.name, this.time, t2_x, t2_y, this.color2);
		timer2.show();
	}
	
	this.toHtml = function(){
		//<text x="3" y="5" style="font-size:10px;fill:black">SMT</text>
		//<polygon points="5,12 15,12 10,20" style="fill:rgb(214,214,218);stroke:rgb(136,136,136);stroke-width:1" />
		//<line x1="10" y1="20" x2="10" y2="42" style="stroke:rgb(128,128,128)" />
	}
}


function Timer(context, name, time, x, y, color){
	this.context = context;
	this.name = name;
	this.time = time;
	
	this.x = x; 
	this.y = y;
	this.color = color;
	
	this.width = this.context.yUnit / 4;
	this.height = this.context.yUnit / 4;
	
	this.show = function(){
		var p = this.context.svg.append("polygon");
		var p_x1 = this.x - this.width;
		var p_y1 = this.y - this.height;
		var p_x2 = p_x1 + this.width * 2;
		var p_y2 = p_y1;;
		var p_x3 = this.x;
		var p_y3 = this.y;
		p.attr("points", (p_x1 + "," + p_y1) + " " + (p_x2 + "," + p_y2) + " " + (p_x3 + "," + p_y3));
		p.attr("style", "fill:" + this.color + ";stroke:" + COLOR_BLACK + ";stroke-width:1");
		
		//attach the mouse event
		if(this.name != ""){
			//console.log(this.name + " | " + this.time);
			var t = this.context.constants.get(this.name);
			var format = d3.time.format("%Y-%m-%d %H:%M:%S");
			var tp = new Tooltip(this.context, this.x, this.y, t.wholeName + " " + format(this.time));
			tp.attach(p);
		}
		
		if(this.context.showTimerName == true){
			var tWidth = this.width + this.width / 2;
			var tHeight = this.height + this.height / 2;
			
			var t = this.context.svg.append("text");
			var t_x = this.x - tWidth;
			var t_y = this.y - tHeight;
			var t_s = this.height * 2 + "px";
			t.attr("x", t_x).attr("y", t_y).attr("style", "font-size:" + t_s + ";fill:black").text(this.name);		
		}
		
		var l = this.context.svg.append("line");
		var l_x1 = this.x;
		var l_y1 = this.y;
		var l_x2 = l_x1;
		var l_y2 = l_y1 + this.context.yUnit;
		l.attr("x1", l_x1).attr("y1", l_y1).attr("x2", l_x2).attr("y2", l_y2);
		l.attr("style", "stroke:" + COLOR_BLACK);
	}
	
	this.toHtml = function(){
		//<text x="3" y="5" style="font-size:10px;fill:black">SMT</text>
		//<polygon points="5,12 15,12 10,20" style="fill:rgb(214,214,218);stroke:rgb(136,136,136);stroke-width:1" />
		//<line x1="10" y1="20" x2="10" y2="42" style="stroke:rgb(128,128,128)" />
	}
}

function TimerBar(context, name, time, x, y){
	this.context = context;
	this.name = name;
	this.time = time;
	
	this.x = x; 
	this.y = y;

	this.width = this.context.w / 4;
	this.height = this.context.h - this.y;
		
	this.show = function(){
		var offset = 4;
		var rx = this.x;
		var ry = this.y + offset;
		
		var l = this.context.svg.append("line");
		l.attr("x1", this.x).attr("y1", this.y).attr("x2", rx).attr("y2", ry);
		l.attr("style", "stroke:" + COLOR_GRAY);

		if(this.name == "endTime") rx = this.x - this.width;	
		var r = this.context.svg.append("rect");
		r.attr("x", rx).attr("y", ry).attr("width", this.width).attr("height", this.height - offset * 2)
		r.style("fill", COLOR_WHITE).style("fill-opacity", 0.8).style("stroke", COLOR_GRAY);
		
		var t = this.context.svg.append("text");
		var tx = rx + (this.width / 2);
		var ty = ry + (this.height / 2);	
		var ts = this.height * 0.3 + "px";
		t.attr("x", tx).attr("y", ty).attr("width", this.width).attr("height", this.height).style("text-anchor", "middle");
		t.style("font-size", ts);
		
		var format = d3.time.format("%Y-%m-%d %H:%M:%S");
		t.text(format(this.time));
	}
}