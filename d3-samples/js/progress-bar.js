function Colors(){
	this.COLOR_BLACK = "rgb(128, 128, 128)";
	this.COLOR_WHITE = "rgb(255, 255, 255)";
	this.COLOR_GRAY = "#dddddd";
	this.COLOR_YELLOW = "#f0cc00";
	this.COLOR_GREEN = "#60942c";
	this.COLOR_RED = "#b2293d";
	this.COLOR_PINK = "#e17e2d";

	this.COLOR_RUNNING = "#60942c";
	this.COLOR_WAITING = "#fff69b";
	this.COLOR_SUSPENDED = "#e17e2d";
	this.COLOR_PENDING = "#f0cc00";
	this.COLOR_EXITED = "#b2293d";
	this.COLOR_DONE = "#dddddd";
	this.COLOR_HOLD = "#eeeef0";
}

function I18n(){
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
	
	/* the switch to showing the time name or not */
	this.showTimerName = false;
	
	/* the switch to showing the time stamp or not */
	this.showTimerBar = true;
	
	/* i18n messages */	
	this.i18n = new I18n();
	
	/* the statistic colors */
	this.colors = new Colors();
	
	//the 2 lays are capable of the size
	this.yCount = (this.showTimerBar == true) ? 4 : 2;
	this.xUnit = -1;
	this.yUnit = -1;
	this.xMargin = -1;
	this.yMargin = -1;
}

function DefaultProgressBar(){
	/**
	* initilize the progress bar context value, it include the xUnit/yUnit/xMargin/yMargin
	* the child classes should implement the getStartTime()/getEndTime() !!
	*/
	this.init = function(_this){	
		_this.context.yUnit = _this.context.h / _this.context.yCount;

		_this.context.xMargin = _this.context.yUnit / 2;
		_this.context.yMargin = _this.context.yUnit;
		
		var xRMargin = _this.context.yUnit / 2;
		//if((this.eetTime - this.rtlTime) == 0) xRMargin = this.yUnit * 2;
		
		var timeRange = _this.getFinishTime() - _this.getBeginTime();
		_this.context.xUnit = (_this.context.w -  _this.context.xMargin - xRMargin) / timeRange;
		
		return _this;
	}

	this.getTimerBars = function(_this){
		var r = [];
		var x = (_this.getStartTime() - _this.getBeginTime()) * _this.context.xUnit; 
		var y = 0;
		var w = (_this.getEndTime() - _this.getStartTime()) * _this.context.xUnit;
		
		//showing the start time
		var tWidth = w / 3;
		var x1 = x + _this.context.xMargin;
		var y1 = y + _this.context.yMargin * 2;
		r.push(new TimerBar(_this.context, "startTime", _this.getStartTime(), x1, y1, tWidth, _this.context.yUnit));

		//showing the end time
		var x2 = x1 + w;
		var y2 = y1;
		r.push(new TimerBar(_this.context, "endTime", _this.getEndTime(), x2, y2, tWidth, _this.context.yUnit));
		
		return r;
	}
}

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
		ls.attr("style", "stroke:" + this.context.colors.COLOR_BLACK);
		
		var l2 = this.context.svg.append("line");
		var l2_x1 = ls_x2 - xHeight;
		var l2_y1 = ls_y2 + yHeight;
		var l2_x2 = ls_x2 + xHeight;
		var l2_y2 = ls_y2 - yHeight;
		l2.attr("x1", l2_x1).attr("y1", l2_y1).attr("x2", l2_x2).attr("y2", l2_y2);
		l2.attr("style", "stroke:" + this.context.colors.COLOR_BLACK);

		//line end
		var le = this.context.svg.append("line");
		var le_x1 = this.x + this.width * rPercent;
		var le_y1 = this.y + this.height / 2;
		var le_x2 = this.x + this.width;
		var le_y2 = le_y1;
		le.attr("x1", le_x1).attr("y1", le_y1).attr("x2", le_x2).attr("y2", le_y2);
		le.attr("style", "stroke:" + this.context.colors.COLOR_BLACK);
		
		var l3 = this.context.svg.append("line");
		var l3_x1 = le_x1 - xHeight;
		var l3_y1 = le_y1 + yHeight;
		var l3_x2 = le_x1 + xHeight;
		var l3_y2 = le_y1 - yHeight;
		l3.attr("x1", l3_x1).attr("y1", l3_y1).attr("x2", l3_x2).attr("y2", l3_y2);
		l3.attr("style", "stroke:" + this.context.colors.COLOR_BLACK);
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
	
	this.width = this.context.yUnit / 3;
	this.height = this.context.yUnit / 3;
	
	this.show = function(){
		var p = this.context.svg.append("polygon");
		var p_x1 = this.x - this.width;
		var p_y1 = this.y - this.height;
		var p_x2 = p_x1 + this.width * 2;
		var p_y2 = p_y1;;
		var p_x3 = this.x;
		var p_y3 = this.y;
		p.attr("points", (p_x1 + "," + p_y1) + " " + (p_x2 + "," + p_y2) + " " + (p_x3 + "," + p_y3));
		p.style("fill", this.color).style("stroke", this.color).style("stroke-width", 1);
		
		//attach the mouse event
		if(this.name != ""){
			//console.log(this.name + " | " + this.time);
			var t = this.context.i18n.get(this.name);
			var format = d3.time.format("%Y-%m-%d %H:%M:%S");
			var tp = new Tooltip(this.context, this.x, this.y, t.wholeName + " " + format(this.time));
			tp.attach(p);
		}
		
		if(this.context.showTimerName == true){
			var t = this.context.svg.append("text");
			var t_x = this.x - this.width - this.width / 2;
			var t_y = this.y - this.height - this.height / 2;
			var t_s = this.height * 2 + "px";
			t.attr("x", t_x).attr("y", t_y);
			t.style("font-size", t_s).style("fill", this.context.colors.COLOR_BLACK)
			t.text(this.name);		
		}
		
		var l = this.context.svg.append("line");
		var l_x1 = this.x;
		var l_y1 = this.y;
		var l_x2 = l_x1;
		var l_y2 = l_y1 + this.context.yUnit;
		l.attr("x1", l_x1).attr("y1", l_y1).attr("x2", l_x2).attr("y2", l_y2);
		l.style("stroke", this.context.colors.COLOR_GRAY);
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
		var offset = 6;
		
		//draw a poly line
		var l = this.context.svg.append("polyline");
		var point0 = this.x + "," + this.y;
		var point1 = this.x + "," + (this.y + this.height / 2);
		var point2 = (this.x + offset) + "," + (this.y + this.height / 2);
		if(this.name == "endTime") point2 = (this.x - offset) + "," + (this.y + this.height / 2);
		l.attr("points", point0 + " " + point1 + " " + point2);
		l.style("fill", "none").style("stroke", this.context.colors.COLOR_GRAY).style("stroke-width", 1);
		
		//draw the rect
		var r = this.context.svg.append("rect");
		var rx = this.x + offset;
		var ry = this.y + offset;
		if(this.name == "endTime") rx = this.x - this.width - offset;
		r.attr("x", rx).attr("y", ry).attr("width", this.width).attr("height", this.height - offset * 2)
		r.style("fill", this.context.colors.COLOR_WHITE).style("fill-opacity", 0.8).style("stroke", this.context.colors.COLOR_GRAY);
		
		//draw the time stamp
		var t = this.context.svg.append("text");
		var tx = rx + (this.width / 2);
		var ty = ry + (this.height / 2);	
		var ts = this.height * 0.3 + "px";
		t.attr("x", tx).attr("y", ty).attr("width", this.width).attr("height", this.height)
		t.style("text-anchor", "middle").style("font-size", ts);
		
		var format = d3.time.format("%Y-%m-%d %H:%M:%S");
		t.text(format(this.time));
	}
}