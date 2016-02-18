function RunningProgressBar(context, smtTime, stTime, ctTime, eetTime, rtlTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.ctTime = ctTime;
	this.eetTime = eetTime;
	this.rtlTime = rtlTime;
	
	this.getBeginTime = function(){
		var r = this.stTime;
		if(this.stTime == null) r = this.smtTime;
		return r;
	}
	
	this.getStartTime = function(){
		var r = this.stTime;
		if(this.stTime == null) r = this.smtTime;
		return r;
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
	
	this.getStartBars = function(){
		var r = [];
		var x = this.context.xMargin;
		var y = this.context.yMargin;
		
		//showing the smtTime into the start bar
		if(this.stTime){
			var pWidth = this.context.xMargin;
			var durationDate = new Date(this.stTime - this.smtTime);
			
			var tooltip = "Pending Duration: \r\n " + this.context.duration.format(durationDate);
			r.push(new ProgresserBreakLine(this.context, 0, y, pWidth, this.context.colors.COLOR_PENDING, tooltip));
		}
		return r;
	}
	
	this.getEndBars = function(){
		var r = [];
		var x = this.context.xMargin;
		var y = this.context.yMargin;
		
		//if there is no eetTime and no rtlTime
		if(this.eetTime == null && this.rtlTime == null){
			//showing the ? into the end bar
			var x1 = x + (this.ctTime - this.getBeginTime()) * this.context.xUnit;
			var y1 = y;
			var pWidth = this.context.xMargin;
			r.push(new BreakLine(this.context, x1, y1, pWidth));
		}
		return r;
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		if(this.ctTime){
			//show smtTime or stTime
			if(this.stTime){
				//from stTime to ctTime
				var r1 = (this.ctTime - this.stTime) * this.context.xUnit;
				var durationDate = new Date(this.ctTime - this.stTime);
				
				var tooltip = "Running Time: \r\n " + this.context.duration.format(durationDate);
				r.push(new Progresser(this.context, x, y, r1, this.context.colors.COLOR_RUNNING, tooltip));
			}else{
				//from smtTime to ctTime
				var r1 = (this.ctTime - this.smtTime) * this.context.xUnit;
				var durationDate = new Date(this.ctTime - this.smtTime);
				
				var tooltip = "Pending Duration: \r\n " + this.context.duration.format(durationDate);
				r.push(new Progresser(this.context, x, y, r1, this.context.colors.COLOR_PENDING, tooltip));
			}
			
			//show eetTime or rtlTime
			if(this.eetTime){
				//from ctTime to eetTime
				var x1 = x + (this.ctTime - this.getBeginTime()) * this.context.xUnit;
				var r1 = (this.eetTime - this.ctTime) * this.context.xUnit;
				r.push(new Progresser(this.context, x1, y, r1, this.context.colors.COLOR_HOLD));
				
				//from eetTime to rtlTime
				if(this.rtlTime != null && this.eetTime < this.rtlTime){
					//from estTime to ptlTime
					var x1 = x + (this.eetTime - this.getBeginTime()) * this.context.xUnit;
					var r1 = (this.rtlTime - this.eetTime) * this.context.xUnit;
					r.push(new BreakLine(this.context, x1, y, r1));
				}
			}else{
				if(this.rtlTime != null && this.ctTime < this.rtlTime){
					//from ctTime to rtlTime
					var x1 = x + (this.ctTime - this.getBeginTime()) * this.context.xUnit;
					var r1 = (this.rtlTime - this.ctTime) * this.context.xUnit;
					r.push(new BreakLine(this.context, x1, y, r1));
				}
			}
		}
		return r;
	}
	
	this.getTimers = function(){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		//stTime or smtTime
		//if the stTime is not exist, showing the smtTime
		if(this.stTime){
			r.push(new Timer(this.context, "ST", this.stTime, x, y, this.context.colors.COLOR_GRAY));
		}else{
			r.push(new Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_YELLOW));
		}
		
		//ctTime
		if(this.ctTime){
			var s1 = (this.ctTime - this.getBeginTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new Timer(this.context, "CT", this.ctTime, x1, y, this.context.colors.COLOR_GREEN));
		}
		
		//eetTime
		if(this.eetTime){
			var s1 = (this.eetTime - this.getBeginTime()) * this.context.xUnit;
			var x1 = x + s1; 
			r.push(new Timer(this.context, "EET", this.eetTime, x1, y, this.context.colors.COLOR_GRAY));
		}
				
		//rtlTime
		if(this.rtlTime){
			var s1 = (this.rtlTime - this.getBeginTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new Timer(this.context, "RTL", this.rtlTime, x1, y, this.context.colors.COLOR_RED));
		}
		return r;
	}
}