function RunningProgressBar(context, smtTime, stTime, ctTime, eetTime, rtlTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.ctTime = ctTime;
	this.eetTime = eetTime;
	this.rtlTime = rtlTime;

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
		var r = this.ctTime;
		if(this.eetTime != null) {
			r = this.eetTime;
		}
		return r;
	}
	
	this.getFinishTime = function(){
		var r;
		if(this.eetTime != null){
			r = this.eetTime;
			if(this.rtlTime != null && this.eetTime <= this.rtlTime){
				r = this.rtlTime;
			}		
		}else{
			r = this.ctTime;
			if(this.rtlTime != null && this.ctTime <= this.rtlTime){
				r = this.rtlTime;
			}
		}
		return r;
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = 0; var y = 0;
		
		//from smtTime to stTime
		var x1 = x + this.context.xMargin;
		var y1 = y + this.context.yMargin;
		var r1 = (this.stTime - this.smtTime) * this.context.xUnit;
		var c1 = this.context.colors.COLOR_PENDING;
		r.push(new ProgresserBreakLine(this.context, this.smtTime, this.stTime, x1, y1, c1, "Pending Duration"));
		
		//from stTime to ctTime
		var x2 = x1 + r1; 
		var y2 = y1;
		var r2 = (this.ctTime - this.stTime) * this.context.xUnit;
		var c2 = this.context.colors.COLOR_RUNNING;
		r.push(new Progresser(this.context, this.stTime, this.ctTime, x2, y2, c2, "Running Duration"));
		
		if(this.eetTime){
			//from ctTime to eetTime
			var x3 = x2 + r2; 
			var y3 = y1;
			var r3 = (this.eetTime - this.ctTime) * this.context.xUnit;
			var c3 = this.context.colors.COLOR_HOLD;
			r.push(new Progresser(this.context, this.ctTime, this.eetTime, x3, y3, c3));
			
			//from eetTime to rtlTime
			if(this.rtlTime != null && this.eetTime < this.rtlTime){
				//from estTime to ptlTime
				var x4 = x3 + r3; 
				var y4 = y1;
				var r4 = (this.rtlTime - this.eetTime) * this.context.xUnit;
				r.push(new BreakLine(this.context, this.eetTime, this.rtlTime, x4, y4));
			}
		}else{
			if(this.rtlTime){
				//from ctTime to rtlTime
				var x3 = x2 + r2; 
				var y3 = y1;
				var r3 = (this.eetTime - this.ctTime) * this.context.xUnit;
				r.push(new BreakLine(this.context, this.ctTime, this.rtlTime, x3, y3));
			}
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
		
		//ctTime
		if(this.ctTime){
			var s3 = (this.ctTime - this.smtTime) * this.context.xUnit;
			var x3 = x1 + s3; 
			var y3 = y1;
			r.push(new Timer(this.context, "CT", this.ctTime, x3, y3, this.context.colors.COLOR_GREEN));
		}
		
		//eetTime
		if(this.eetTime){
			var s4 = (this.eetTime - this.smtTime) * this.context.xUnit;
			var x4 = x1 + s4; 
			var y4 = y1;
			r.push(new Timer(this.context, "EET", this.eetTime, x4, y4, this.context.colors.COLOR_GRAY));
		}
				
		//rtlTime
		if(this.rtlTime){
			var s5 = (this.rtlTime - this.smtTime) * this.context.xUnit;
			var x5 = x1 + s5; 
			var y5 = y1;
			r.push(new Timer(this.context, "RTL", this.rtlTime, x5, y5, this.context.colors.COLOR_RED));
		}
		return r;
	}
}