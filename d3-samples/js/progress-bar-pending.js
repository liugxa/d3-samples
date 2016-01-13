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
		r.push(new Progresser(this.context, this.smtTime, this.ctTime, x1, y1, COLOR_PENDING, "Pending Duration"));
		
		//from ctTime to estTime
		var x2 = x1 + r1; 
		var y2 = y1;
		var r2 = (this.estTime - this.ctTime) * this.context.xUnit;
		r.push(new Progresser(this.context, this.ctTime, this.estTime, x2, y2, COLOR_HOLD));
		
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