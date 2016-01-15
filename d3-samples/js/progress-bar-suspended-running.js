function SuspendedRunningProgressBar(context, smtTime, stTime, sptTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.sptTime = sptTime;
	
	this.init = function(){
		return new DefaultProgressBar().init(this);
	}

	this.getTimerBars = function(){
		return new DefaultProgressBar().getTimerBars(this);
	}
	
	this.getBeginTime = function(){
		return this.smtTime;
	}
	
	this.getStartTime = function(){
		return this.stTime;
	}
	
	this.getEndTime = function(){
		return this.sptTime;
	}
	
	this.getFinishTime = function(){
		return this.sptTime;
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = 0; var y = 0;
		
		//from smtTime to stTime
		var x1 = x + this.context.xMargin; 
		var y1 = y + this.context.yMargin;
		var r1 = (this.stTime - this.smtTime) * this.context.xUnit;
		r.push(new ProgresserBreakLine(this.context, this.smtTime, this.stTime, x1, y1, this.context.colors.COLOR_PENDING, "Pending Duration"));
		
		//from stTime to sptTime
		var x2 = x1 + r1; 
		var y2 = y1;
		var r2 = (this.sptTime - this.stTime) * this.context.xUnit;
		r.push(new Progresser(this.context, this.stTime, this.sptTime, x2, y2, this.context.colors.COLOR_SUSPENDED));
		
		return r;
	}
	
	this.getTimers = function(){
		var r = [];
		var x = 0; var y = 0;
		
		//smtTime
		if(this.smtTime){
			var x1 = x + this.context.xMargin; 
			var y1 = y + this.context.yMargin;
			r.push(new Timer(this.context, "SMT", this.smtTime, x1, y1, this.context.colors.COLOR_GRAY));
		}
		
		//stTime
		if(this.stTime){
			var s2 = (this.stTime - this.smtTime) * this.context.xUnit;
			var x2 = x1 + s2; 
			var y2 = y1;
			r.push(new Timer(this.context, "ST", this.stTime, x2, y2, this.context.colors.COLOR_GRAY));
		}
		
		//sptTime
		if(this.sptTime){
			var s3 = (this.sptTime - this.smtTime) * this.context.xUnit;
			var x3 = x1 + s3; 
			var y3 = y2;
			r.push(new Timer(this.context, "SPT", this.sptTime, x3, y3, this.context.colors.COLOR_PINK));
		}
		return r;
	}
}