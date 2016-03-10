
function ProgressBarContext(container, i18n){
	this.container = PB.select(container);
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
	this.i18n = (i18n != null) ? i18n: new _I18n();
	
	/* the statistic colors */
	this.colors = new Colors();
	
	/* the instance of duration */
	this.dateFormat = new DateFormat();
	
	//the 2 lays are capable of the size
	this.yCount = (this.showTimerBar == true) ? 4 : 2;
	this.xUnit = -1;
	this.yUnit = this.h / this.yCount;
	
	this.xMargin = this.yUnit;
	this.yMargin = this.yUnit;
	if(this.showTimerName != true) this.yMargin = this.yUnit * 0.6;
}

function ProgressBar(context, times, pStatus){
	this.context = context;
	this.times = times;
	this.pStatus = pStatus.toUpperCase();
	
	this.checkTimes = function(){
		var r = false;
		switch(this.pStatus){
			case "PENDING":
				//pending: smtTime*/ctTime*/estTime/ptlTime
				if(this.times.smtTime != null && this.times.ctTime != null) {
					r = true;
				}
				break;
			case "RUNNING":
				//running: smtTime*/ctTime*/stTime/eetTime/rtlTime
				if(this.times.smtTime != null && this.times.ctTime != null){
					r = true;
				}
				break;
			case "DONE":
				//done: smtTime*/stTime*/etTime*		
				if(this.times.smtTime != null && this.times.stTime != null && this.times.etTime != null){
					r = true;
				}
				break;
			case "EXIT":
				//exited: smtTime*/etTime*/stTime/
				if(this.times.smtTime != null && this.times.etTime != null){
					r = true;
				}
				break;
			case "USUSP":
			case "SSUSP":
			case "PSUSP":
				//suspended: smtTime*/sptTime*/ctTime*/stTime/
				if(this.times.smtTime != null && this.times.sptTime != null && this.times.ctTime != null){
					r = true;
				}
				break;
		}
		console.log("check times[" + this.pStatus + "]: "+ r);
		console.log(this.times);
		return r;
	}
	
	this.show = function(){
		if(this.checkTimes()){
			var p = null;
			switch(this.pStatus){
				case "PENDING":
					p = new PendingProgressBar(this.context, this.times.smtTime, this.times.ctTime, this.times.estTime, this.times.ptlTime);
					break;
				case "RUNNING":
					p = new RunningProgressBar(this.context, this.times.smtTime, this.times.stTime, this.times.ctTime, this.times.eetTime, this.times.rtlTime);
					break;
				case "DONE":
					p = new DoneProgressBar(this.context, this.times.smtTime, this.times.stTime, this.times.etTime);
					break;
				case "EXIT":
					p = new ExitedProgressBar(this.context, this.times.smtTime, this.times.stTime, this.times.etTime);
					break;
				case "USUSP":
				case "SSUSP":
				case "PSUSP":
					p = new SuspendedProgressBar(this.context, this.times.smtTime, this.times.stTime, this.times.sptTime, this.times.ctTime);
					break;
			}
			
			if(p != null) {
				//reset the xUnit of the context
				//console.log("begin time: " + p.getBeginTime());
				//console.log("finish time: " + p.getFinishTime());
				var timeRange = p.getEndTime() - p.getStartTime();
				this.context.xUnit = (this.context.w -  this.context.xMargin * 2) / timeRange;
				
				//show start bars
				if(p.getStartBars != null) {
				var startBars = p.getStartBars();
					for(var i=0;i<startBars.length;i++) startBars[i].show();
				}
				
				//show all of the progressers
				var progressers = p.getProgressers();
				for(var i=0;i<progressers.length;i++) progressers[i].show();
				
				//show all of the timers
				var timers = p.getTimers();
				for(var i=0;i<timers.length;i++) timers[i].show();			
				
				//show all of the timer bars
				var timerBars = this.getTimerBars(p);
				for(var i=0;i<timerBars.length;i++) timerBars[i].show();
				
				//show end bars
				if(p.getEndBars != null){
					var endBars = p.getEndBars();
					for(var i=0;i<endBars.length;i++) endBars[i].show();
				}
			}
		}
	}
	
	this.getTimerBars = function(p){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		//showing the start time
		var x1 = x;
		var y1 = y + this.context.yUnit;
		r.push(new TimerBar(this.context, "startTime", p.getStartTime(), x1, y1));

		//showing the end time
		var w = (p.getEndTime() - p.getStartTime()) * this.context.xUnit;
		var x2 = x1 + w;
		var y2 = y1;
		r.push(new TimerBar(this.context, "endTime", p.getEndTime(), x2, y2));
		
		return r;
	}	
}

function Progresser(context, x, y, width, color, tooltip){
	this.context = context;
	this.x = x;
	this.y = y;
	
	this.color = color;	
	this.tooltip = tooltip;
	
	this.width = width;
	this.height = this.context.yUnit;
		
	//with an tooltip
	this.show = function(){
		var r = this.context.svg.append("rect");
		r.attr("x", this.x).attr("y", this.y).attr("fill", this.color);
		r.attr("width", this.width).attr("height", this.height);
		
		//attach the mouse event
		if(this.tooltip) {
			var tp = new Tooltip(this.context, this.x, this.y, this.tooltip);
			tp.attach(r);
		}
	}
}

function ProgresserBreakLine(context, x, y, width, color, tooltip){
	this.context = context;
	this.x = x; 
	this.y = y;
	
	this.width = width;
	this.color = color;
	this.tooltip = tooltip;
	
	this.show = function(){
		//var duration = this.endTime - this.startTime;
		//var pMilliseconds = this.startTime.getTime() + duration * 0.4;
		//var pEndTime = new Date(pMilliseconds);
		
		var pWidth = this.width * 0.6;
		var progresser = new Progresser(this.context, this.x, this.y, pWidth, this.color, this.tooltip);
		progresser.show();
		
		var bWidth = this.width * 0.4;
		var breakLine = new BreakLine(this.context, this.x + pWidth, this.y, bWidth);
		//breakLine.show();
	}
}
function BreakLine(context, x, y, width, tooltip){
	this.context = context;
	this.x = x; 
	this.y = y;
	
	this.width = width;
	this.tooltip = tooltip;
	this.height = this.context.yUnit;
		
	this.show = function(){
		//slash height
		var xHeight = 1;
		var yHeight = this.height / 4;
		
		//line start
		var ls = this.context.svg.append("line");
		var ls_x1 = this.x;
		var ls_y1 = this.y + this.height / 2;
		var ls_x2 = this.x + this.width * 0.4;
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
		var le_x1 = this.x + this.width * 0.6;
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
}

function BreakLineSymbol(context, x, y, width, tooltip){
	this.context = context;
	this.x = x; 
	this.y = y;
	
	this.width = width;
	this.tooltip = tooltip;
	
	this.show = function(){
		var bWidth = this.width * 0.6;
		var breakLine = new BreakLine(this.context, this.x, this.y, bWidth);
		breakLine.show();
		
		var tfont = this.width * 0.8 + "px";
		var tWidth = this.width * 0.4;
		var t = this.context.svg.append("text");
		t.attr("x", this.x + bWidth).attr("y", (this.y + this.context.yUnit * 0.8)).attr("width", tWidth);
		t.style("font-family", "Arial").text(" ? ").style("font-size", tfont);
		
		var tp = new Tooltip(this.context, this.x, this.y, tooltip);
		tp.attach(t);
	}
}

function BreakLineTime(context, x, y, width, time, tooltip){
	this.context = context;
	this.x = x; 
	this.y = y;
	
	this.width = width;
	this.time = time;
	this.tooltip = tooltip;
	
	this.show = function(){
		var bWidth = this.width - (this.context.yUnit * 0.3);
		var breakLine = new BreakLine(this.context, this.x, this.y, bWidth);
		breakLine.show();
		
		var time = new Timer(this.context, "PTL", this.time, this.x + bWidth, y, this.context.colors.COLOR_RED);
		time.show();
	}
}



//using the d3 or rave2
//var PB = d3;
var PB = rave;

function Colors(){
	this.COLOR_BLACK = "rgb(54,54,54)";
	this.COLOR_WHITE = "rgb(255,255,255)";
	this.COLOR_DARK_GRAY = "rgb(118,119,119)";
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
	this.COLOR_DONE = "rgb(174, 203, 160)";
	this.COLOR_HOLD = "#eeeef0";
	
	this.COLOR_PENDING_OPT="rgb(247, 230, 138)";
	this.COLOR_RUNNING_OPT="rgb(174, 203, 160)";
	this.COLOR_SUSPENDED_OPT="rgb(226, 127, 48)";
	this.COLOR_TEXT_REGULAR = "#363636";
	this.COLOR_TEXT_ITALIC = "#757575";
}

function DateFormat(){
	this.formatTime = function(date){
		var format = PB.time.format("%Y-%m-%d");
		return format(date);
	}
	
	this.formatStamp = function(date){
		var format = PB.time.format("%H:%M:%S");
		return format(date);	
	}
	
	this.format = function(date){
		var format = PB.time.format("%Y-%m-%d %H:%M:%S");
		return format(date);
	}
	
	this.duration = function(date){
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
		
		return (r != "") ? r : "0";
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
			var tp_x = PB.event.pageX + 10;
			var tp_y = PB.event.pageY + 10;
			
			var tp = PB.select("body").append("div").attr("id", "div-tooltip").attr("class", "tooltip");
			
			var texts = tooltip.split("<br>");
			for(var i=0;i<texts.length;i++) tp.append("span").style("display", "block").style("height", "15px").text(texts[i]);
			
			//text(tooltip);
			tp.style("left", tp_x + "px").style("top", tp_y + "px");
		});
		
		object.on("mousemove", function(){
			//console.log("event.pageX: " + PB.event.pageX + " | event.pageY: " + PB.event.pageY);
			var tp_x = PB.event.pageX + 10;
			var tp_y = PB.event.pageY + 10;
			
			var tp = PB.select("#div-tooltip");
			tp.style("left", tp_x + "px").style("top", tp_y + "px");
		});
		
		object.on("mouseout", function(){
			//console.log("mouse out!");
			var tp = PB.select("#div-tooltip");
			tp.remove();
		});
	}
}
function _I18n(){
	this.get = function(name){
		var r = {
			"SMT": {"name": "SMT", "value": "Submitted Time"},
			"CT": {"name": "CT", "value": "Current Time"},
			"EST": {"name": "EST", "value": "Estimated Start Time"},
			"ET": {"name": "ET", "value": "End Time"},
			"SPT": {"name": "SPT", "value": "Suspended Time"},
			"PTL": {"name": "PTL", "value": "Pending Time Limit"},
			"EST=PTL": {"name": "PTL", "value": "Pending Time Limit"},
			"ST": {"name": "ST", "value": "Start Time"},
			"EET": {"name": "EET", "value": "Estimated End Time"},
			"RTL": {"name": "RTL", "value": "Run Time Limit"},
			"EET=RTL": {"name": "EET=RTL", "value": "Run Time Limit"},
			"submitted":{"name": "submitted", "value": "Submitted"},
			"run.time": {"name": "run.time", "value": "Run Time"},
			"running.time": {"name": "running.time", "value": "Running Time"},
			"pending.duration": {"name": "pending.duration", "value": "Pending Duration"},
			"suspended.duration": {"name": "suspended.duration", "value": "Suspended Duration"},
			"time.remaining": {"name": "time.remaining", "value": "Time Remaining"},
			"est.time.empty": {"name": "est.time.empty", "value": "There is no <br> estimated start time <br> available for this <br> job"},
			"eet.time.empty": {"name": "eet.time.empty", "value": "There is no <br> estimated end time <br> available for this <br> job"},
		};
		return r[name];
	}
}
function Timer(context, name, time, x, y, color){
	this.context = context;
	this.name = name;
	this.time = time;
	
	this.x = x; 
	this.y = y;
	this.color = color;
	
	this.width = this.context.yUnit * 0.3;
	this.height = this.context.yUnit * 0.3;
	
	this.show = function(){
		var yOffset = 0;
		if(this.color == this.context.colors.COLOR_RED) yOffset = this.height;
		this.y = this.y - yOffset;
		
		//show the polygon
		var p = this.context.svg.append("polygon");
		var p_x1 = this.x - this.width;
		var p_y1 = this.y - this.height;
		var p_x2 = p_x1 + this.width * 2;
		var p_y2 = p_y1;;
		var p_x3 = this.x;
		var p_y3 = this.y;
		p.attr("points", (p_x1 + "," + p_y1) + " " + (p_x2 + "," + p_y2) + " " + (p_x3 + "," + p_y3));
		p.style("fill", this.color).style("stroke", this.color).style("stroke-width", 1);
		
		//show line
		var l = this.context.svg.append("line");
		var l_x1 = this.x;
		var l_y1 = this.y;
		var l_x2 = l_x1;
		var l_y2 = l_y1 + this.context.yUnit + yOffset;
		l.attr("x1", l_x1).attr("y1", l_y1).attr("x2", l_x2).attr("y2", l_y2);
		l.style("stroke", this.color);
		
		//attach the mouse event
		if(this.name != ""){
			//console.log(this.name + " | " + this.time);
			var t = this.context.i18n.get(this.name);
			var tMessage = t.value + ": <br> " + this.context.dateFormat.format(this.time);
			
			var tp = new Tooltip(this.context, this.x, this.y, tMessage);
			tp.attach(p);
		}
		
		//show time name
		if(this.context.showTimerName == true){
			var t = this.context.svg.append("text");
			var t_x = this.x - this.width - this.width / 2;
			var t_y = this.y - this.height - this.height / 2;
			var t_s = this.height * 2 + "px";
			t.attr("x", t_x).attr("y", t_y);
			t.style("font-size", t_s).style("fill", this.context.colors.COLOR_BLACK)
			t.text(this.name);		
		}
	}
}

function TimerBar(context, name, time, x, y){
	this.context = context;
	this.name = name;
	this.time = time;
	
	this.x = x; 
	this.y = y;
	
	this.w = this.context.w;
	this.h = this.context.h - this.y;
	
	this.width = 70;
	this.height = this.h * 0.6;
	
	this.xOffset = this.width / 8;
	this.yOffset = this.height / 2;
	
	this.show = function(){	
		//draw a poly line
		var l = this.context.svg.append("polyline");
		//point 1
		var l1_x = this.x;
		var l1_y = this.y;
		//point 2
		var l2_x = this.x;
		var l2_y = this.y + this.yOffset;
		//point 3
		var l3_x = this.x + this.xOffset;
		var l3_y = l2_y;
		
		if(this.name == "endTime") l3_x = this.x - this.xOffset;
		l.attr("points", (l1_x + "," + l1_y)  + " " + (l2_x + "," + l2_y) + " " + (l3_x + "," + l3_y));
		l.style("fill", "none").style("stroke", this.context.colors.COLOR_DARK_GRAY).style("stroke-width", 0.4);
		
		//draw the rect
		var r = this.context.svg.append("rect");
		var rx = this.x + this.xOffset;
		var ry = this.y;
		if(this.name == "endTime") rx = this.x - this.width - this.xOffset;
		//r.attr("x", rx).attr("y", ry).attr("width", this.width).attr("height", this.height)
		//r.style("fill", this.context.colors.COLOR_WHITE).style("fill-opacity", 0.8).style("stroke", this.context.colors.COLOR_GRAY);
		
		//draw the time
		var tfont = this.height * 0.46 + "px";
		var t1 = this.context.svg.append("text");
		var t1_x = rx + this.xOffset / 2;
		var t1_y = ry + this.height / 2;
		t1.attr("x", t1_x).attr("y", t1_y).attr("width", this.width).attr("height", this.height);
		t1.text(this.context.dateFormat.formatTime(this.time));
		this.setFont(this.name, t1, tfont);
		
		//draw the stamp
		var t2 = this.context.svg.append("text");
		var t2_x = t1_x;
		var t2_y = t1_y + this.height / 2;
		t2.attr("x", t2_x).attr("y", t2_y).attr("width", this.width).attr("height", this.height);
		t2.text(this.context.dateFormat.formatStamp(this.time));
		this.setFont(this.name, t2, tfont);
	}
	
	this.setFont = function(name, t, tfont){
		t.style("font-size", tfont).style("font-family", "Arial");
		if(name == "endTime") {
			t.attr("fill", this.context.colors.COLOR_TEXT_ITALIC);
			t.style("font-style", "italic");
		}else{
			t.attr("fill", this.context.colors.COLOR_TEXT_REGULAR);
			t.style("font-weight", "bold");
		}	
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
		var t2_y = t1_y - timer1.height / 4;
		var timer2 = new Timer(this.context, this.name, this.time, t2_x, t2_y, this.color2);
		timer2.show();
	}
}
