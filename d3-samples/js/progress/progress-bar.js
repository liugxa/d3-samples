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