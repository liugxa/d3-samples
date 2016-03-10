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
		var r = this.ctTime;
		if(this.estTime) r = this.estTime;
		return r;
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		if(this.getStartTime() && this.ctTime){
			//from start time to ctTime
			var r0 = (this.ctTime - this.getStartTime()) * this.context.xUnit;
			var durationDate = this.context.dateFormat.duration(new Date(this.ctTime - this.getStartTime()));
			
			var tooltip = this.context.i18n.get("pending.duration").value + ": <br> " + durationDate;
			r.push(new Progresser(this.context, x, y, r0, this.context.colors.COLOR_PENDING, tooltip));
			
			//from ctTime to end time
			if(this.getEndTime()){
				var x1 = x + r0;
				var r1 = (this.getEndTime() - this.ctTime) * this.context.xUnit;	
				var durationDate = this.context.dateFormat.duration(new Date(this.getEndTime() - this.ctTime));
				
				var tooltip = this.context.i18n.get("time.remaining").value + ": <br> " + durationDate;
				r.push(new Progresser(this.context, x1, y, r1, this.context.colors.COLOR_HOLD, tooltip));
			}
		}
		return r;
	}
	
	this.getTimers = function(){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		//start time
		if(this.smtTime){
			r.push(new Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_GRAY));
		}
		
		//ctTime
		if(this.ctTime){
			var s1 = (this.ctTime - this.getStartTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new Timer(this.context, "CT", this.ctTime, x1, y, this.context.colors.COLOR_YELLOW));
		}
		
		if(this.estTime != this.ptlTime){
			//estTime
			if(this.estTime){
				var s1 = (this.estTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1;
				r.push(new Timer(this.context, "EST", this.estTime, x1, y, this.context.colors.COLOR_GRAY));
			}
			//ptlTime
			if(this.ptlTime){
				var s1 = (this.ptlTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1;
				r.push(new Timer(this.context, "PTL", this.ptlTime, x1, y, this.context.colors.COLOR_RED));
			}
		}else{
			//the estTime == ptlTime
			if(this.estTime && this.ptlTime){
				var s1 = (this.estTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1;
				r.push(new DoubleTimer(this.context, "EST=PTL", this.estTime, x1, y, this.context.colors.COLOR_GRAY, this.context.colors.COLOR_RED));
			}
		}
		return r;
	}
	
	this.getEndBars = function(){
		var r = [];
		var x = this.context.xMargin;
		var y = this.context.yMargin;
		
		if(this.estTime == null){
			var pWidth = this.context.xMargin;
			var x1 = (this.getEndTime() - this.getStartTime()) * this.context.xUnit;
			
			var tooltip = this.context.i18n.get("est.time.empty").value;
			r.push(new BreakLineSymbol(this.context, x + x1, y, pWidth, tooltip));		
		}else{
			//from the finish time to plt time
			if(this.ptlTime != null && this.ptlTime > this.getEndTime()){
				var pWidth = this.context.xMargin;
				var x1 = (this.getEndTime() - this.getStartTime()) * this.context.xUnit;
				r.push(new BreakLineTime(this.context, x + x1, y, pWidth, this.ptlTime));		
			}
		}
		return r;
	}
}