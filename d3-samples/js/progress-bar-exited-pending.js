function ExitedPendingProgressBar(context, smtTime, etTime){
	this.context = context;
	this.smtTime = smtTime;
	this.etTime = etTime;
	
	this.dpb = new DefaultProgressBar(context);
	
	this.init = this.dpb.init();
	
	this.getTimerBars = this.dpb.getTimerBars();
	
	this.getStartTime = function(){
		return this.smtTime;
	}
	
	this.getEndTime = function(){
		return this.etTime;
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = 0; var y = 0;
		
		//from smtTime to etTime
		var x1 = x + this.context.xMargin; 
		var y1 = y + this.context.yMargin;
		var r1 = (this.etTime - this.smtTime) * this.context.xUnit;
		r.push(new Progresser(this.context, this.smtTime, this.etTime, x1, y1, COLOR_EXITED, "Pending Duration"));
		
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
		
		//etTime
		if(this.etTime){
			var s2 = (this.etTime - this.smtTime) * this.context.xUnit;
			var x2 = x1 + s2; 
			var y2 = y1;
			r.push(new Timer(this.context, "ET", this.etTime, x2, y2, COLOR_RED));
		}
		return r;
	}
}