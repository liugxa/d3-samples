function ExitedProgressBar(context, smtTime, stTime, etTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.etTime = etTime;
	
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
		var r = this.smtTime;
		if(this.stTime != null) r = this.stTime;
		return r;
	}
	
	this.getEndTime = function(){
		return this.etTime;
	}
	
	this.getFinishTime = function(){
		return this.etTime;
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = 0; var y = 0;
		
		if(this.stTime){
			//from smtTime to stTime
			var x1 = x + this.context.xMargin; 
			var y1 = y + this.context.yMargin;
			var r1 = (this.stTime - this.smtTime) * this.context.xUnit;
			var c1 = this.context.colors.COLOR_PENDING;
			r.push(new ProgresserBreakLine(this.context, this.smtTime, this.stTime, x1, y1, c1, "Pending Duration"));
			
			//from stTime to etTime
			var x2 = x1 + r1; 
			var y2 = y1;
			var r2 = (this.etTime - this.stTime) * this.context.xUnit;
			var c2 = this.context.colors.COLOR_EXITED;
			r.push(new Progresser(this.context, this.stTime, this.etTime, x2, y2, c2));
		
		}else{
			//from smtTime to etTime
			var x1 = x + this.context.xMargin; 
			var y1 = y + this.context.yMargin;
			var r1 = (this.etTime - this.smtTime) * this.context.xUnit;
			var c1 = this.context.colors.COLOR_EXITED;
			r.push(new Progresser(this.context, this.smtTime, this.etTime, x1, y1, c1, "Pending Duration"));
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
			r.push(new Timer(this.context, "SMT", this.smtTime, x1, y1, this.context.colors.COLOR_GRAY));
		}
		
		//stTime
		if(this.stTime){
			var s2 = (this.stTime - this.smtTime) * this.context.xUnit;
			var x2 = x1 + s2; 
			var y2 = y1;
			r.push(new Timer(this.context, "ST", this.stTime, x2, y2, this.context.colors.COLOR_GRAY));
		}
		
		//etTime
		if(this.etTime){
			var s3 = (this.etTime - this.smtTime) * this.context.xUnit;
			var x3 = x1 + s3; 
			var y3 = y1;
			r.push(new Timer(this.context, "ET", this.etTime, x3, y3, this.context.colors.COLOR_RED));
		}
		return r;
	}
}