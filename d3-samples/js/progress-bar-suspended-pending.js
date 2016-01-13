function SuspendedPendingProgressBar(context, smtTime, sptTime){
	this.context = context;
	this.smtTime = smtTime;
	this.sptTime = sptTime;
	this.dpb = new DefaultProgressBar(context);
	
	this.getStartTime = function(){
		return this.smtTime;
	}
	
	this.getEndTime = function(){
		return this.sptTime;
	}
	
	this.init = this.dpb.init();
	
	this.getTimerBars = this.dpb.getTimerBars();
	
	this.getProgressers = function(){
		var r = [];
		var x = 0; var y = 0;
		
		//from smtTime to sptTime
		var x1 = x + this.context.xMargin; 
		var y1 = y + this.context.yMargin;
		var r1 = (this.sptTime - this.smtTime) * this.context.xUnit;
		r.push(new Progresser(this.context, this.smtTime, this.sptTime, x1, y1, COLOR_SUSPENDED, "Pending Duration"));
		
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
		
		//sptTime
		if(this.sptTime){
			var s2 = (this.sptTime - this.smtTime) * this.context.xUnit;
			var x2 = x1 + s2; 
			var y2 = y1;
			r.push(new Timer(this.context, "SPT", this.sptTime, x2, y2, COLOR_PINK));
		}
		return r;
	}
}