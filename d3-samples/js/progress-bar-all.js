function ProgressBar(context, times, pStatus){
	this.context = context;
	this.times = times;
	this.pStatus = pStatus;
	
	this.checkTimes = function(){
		var r = false;
		
		//pending: smtTime*/ctTime*/estTime/ptlTime
		if(this.pStatus == "pending"){
			if(this.times.smtTime != null && this.times.ctTime != null) {
				r = true;
			}
		}
		
		//running: smtTime*/stTime*/ctTime*/eetTime/rtlTime
		if(this.pStatus == "running"){
			if(this.times.smtTime != null && this.times.stTime != null && this.times.ctTime != null){
				r = true;
			}
		}
		
		//done: smtTime*/stTime*/etTime*
		if(this.pStatus == "done"){
			if(this.times.smtTime != null && this.times.stTime != null && this.times.etTime != null){
				r = true;
			}
		}
		//exited: smtTime*/stTime/etTime*
		if(this.pStatus == "exited"){
			if(this.times.smtTime != null && this.times.etTime != null){
				r = true;
			}
		}
		
		//suspended: smtTime*/stTime/sptTime*
		if(this.pStatus == "suspended"){
			if(this.times.smtTime != null && this.times.sptTime != null){
				r = true;
			}
		}
		console.log("check times[" + this.pStatus + "]: "+ r);
		return r;
	}
	
	this.show = function(){
		if(this.checkTimes()){
			var p = null;
			switch(this.pStatus){
				case "pending":
					p = new PendingProgressBar(this.context, this.times.smtTime, this.times.ctTime, this.times.estTime, this.times.ptlTime);
					break;
				case "running":
					p = new RunningProgressBar(this.context, this.times.smtTime, this.times.stTime, this.times.ctTime, this.times.eetTime, this.times.rtlTime);
					break;
				case "done":
					p = new DoneProgressBar(this.context, this.times.smtTime, this.times.stTime, this.times.etTime);
					break;
				case "exited":
					p = new ExitedProgressBar(this.context, this.times.smtTime, this.times.stTime, this.times.etTime);
					break;
				case "suspended":
					p = new SuspendedProgressBar(this.context, this.times.smtTime, this.times.stTime, this.times.sptTime);
					break;
			}
			
			if(p != null) {
				//initialize the progress bar
				p.init();
			
				//show all of the progressers
				var progressers = p.getProgressers();
				for(var i=0;i<progressers.length;i++) progressers[i].show();
				
				//show all of the timers
				var timers = p.getTimers();
				for(var i=0;i<timers.length;i++) timers[i].show();			
				
				//show all of the timer bars
				var timerBars = p.getTimerBars();
				for(var i=0;i<timerBars.length;i++) timerBars[i].show();	
			}
		}
	}
}


function DefaultProgressBar(){
	//initilize the progress bar context value, it include the xUnit/yUnit/xMargin/yMargin
	// the child classes should implement the getStartTime()/getEndTime() !!
	this.init = function(_this){	
		_this.context.yUnit = _this.context.h / _this.context.yCount;

		_this.context.xMargin = _this.context.yUnit / 2;
		_this.context.yMargin = _this.context.yUnit;
		if(_this.showTimerName != true) _this.context.yMargin = _this.context.yUnit * 0.6;
		
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
		var x1 = x + _this.context.xMargin;
		var y1 = y + _this.context.yMargin + _this.context.yUnit;
		r.push(new TimerBar(_this.context, "startTime", _this.getStartTime(), x1, y1));

		//showing the end time
		var x2 = x1 + w;
		var y2 = y1;
		r.push(new TimerBar(_this.context, "endTime", _this.getEndTime(), x2, y2));
		
		return r;
	}
}