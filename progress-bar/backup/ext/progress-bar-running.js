function RunningProgressBar(context, smtTime, stTime, ctTime, eetTime, rtlTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.ctTime = ctTime;
	this.eetTime = eetTime;
	this.rtlTime = rtlTime;

	this.getStartTime = function(){
		var r = this.smtTime;
		if(this.stTime) r = this.stTime;
		return r;
	}
	
	this.getEndTime = function(){
		var r = this.ctTime;
		if(this.eetTime) r = this.eetTime;
		return r;
	}
	
	this.getStartBars = function(){
		var r = [];
		var x = this.context.xMargin;
		var y = this.context.yMargin;
		
		//showing the smtTime into the start bar
		if(this.smtTime && this.stTime){
			var pWidth = this.context.xMargin;
			var smtTimeDate = this.context.dateFormat.format(this.smtTime);
			var durationDate = this.context.dateFormat.duration(new Date(this.stTime - this.smtTime));
			
			var tooltip = this.context.i18n.get("submitted").value + ": <br> " + smtTimeDate + " <br> <br> ";
			tooltip = tooltip + this.context.i18n.get("pending.duration").value + ": <br> " + durationDate;
			r.push(new ProgresserBreakLine(this.context, 0, y, pWidth, this.context.colors.COLOR_PENDING, tooltip));
		}
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
			
			var pName = this.context.i18n.get("pending.duration").value;
			var pColor = this.context.colors.COLOR_PENDING;
			if(this.stTime){
				pName = this.context.i18n.get("running.time").value;
				pColor = this.context.colors.COLOR_RUNNING;
			}
			var tooltip =  pName + ": <br> " + durationDate;
			r.push(new Progresser(this.context, x, y, r0, pColor, tooltip));
			
			//show ctTime to end time
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
		
		//show start time: stTime or smtTime
		//if the stTime is not exist, showing the smtTime
		if(this.stTime){
			r.push(new Timer(this.context, "ST", this.stTime, x, y, this.context.colors.COLOR_GRAY));
		}else{
			r.push(new Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_YELLOW));
		}
		
		//ctTime
		if(this.ctTime){
			var s1 = (this.ctTime - this.getStartTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new Timer(this.context, "CT", this.ctTime, x1, y, this.context.colors.COLOR_GRAY));
		}
		
		if(this.eetTime != this.rtlTime){
			//eetTime
			if(this.eetTime){
				var s1 = (this.eetTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1; 
				r.push(new Timer(this.context, "EET", this.eetTime, x1, y, this.context.colors.COLOR_GRAY));
			}
			//rtlTime
			if(this.rtlTime){
				var s1 = (this.rtlTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1;
				r.push(new Timer(this.context, "RTL", this.rtlTime, x1, y, this.context.colors.COLOR_RED));
			}
		}else{
			//eetTime == rtlTime
			if(this.eetTime && this.rtlTime){
				var s1 = (this.eetTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1; 
				r.push(new DoubleTimer(this.context, "EET=RTL", this.eetTime, x1, y, this.context.colors.COLOR_GRAY, this.context.colors.COLOR_RED));
			}
		}
		return r;
	}
	
	this.getEndBars = function(){
		var r = [];
		var x = this.context.xMargin;
		var y = this.context.yMargin;
		
		if(this.eetTime == null){
			var pWidth = this.context.xMargin;
			var x1 = (this.getEndTime() - this.getStartTime()) * this.context.xUnit;
			
			var tooltip = this.context.i18n.get("eet.time.empty").value;
			r.push(new BreakLineSymbol(this.context, x + x1, y, pWidth, tooltip));		
		}else{
			//from the finish time to rlt time
			if(this.rtlTime != null && this.rtlTime > this.getEndTime()){
				var pWidth = this.context.xMargin;
				var x1 = (this.getEndTime() - this.getStartTime()) * this.context.xUnit;
				r.push(new BreakLineTime(this.context, x + x1, y, pWidth, this.rtlTime));		
			}
		}
		return r;
	}
}