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
		r.push(new ProgresserBreakLine(this.context, this.smtTime, this.stTime, x1, y1, COLOR_PENDING, "Pending Duration"));
		
		//from stTime to ctTime
		var x2 = x1 + r1; 
		var y2 = y1;
		var r2 = (this.ctTime - this.stTime) * this.context.xUnit;
		r.push(new Progresser(this.context, this.stTime, this.ctTime, x2, y2, COLOR_RUNNING, "Running Duration"));
		
		//from ctTime to eetTime
		var x3 = x2 + r2; 
		var y3 = y2;
		var r3 = (this.eetTime - this.ctTime) * this.context.xUnit;
		r.push(new Progresser(this.context, this.ctTime, this.eetTime, x3, y3, COLOR_HOLD));
				
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