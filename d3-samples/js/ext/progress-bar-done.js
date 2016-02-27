function DoneProgressBar(context, smtTime, stTime, etTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.etTime = etTime;
	
	this.getStartTime = function(){
		return this.stTime;
	}
	
	this.getEndTime = function(){
		return this.etTime;
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
		
		//from start time to end time
		if(this.getStartTime() && this.getEndTime()){
			var r0 = (this.getEndTime() - this.getStartTime()) * this.context.xUnit;
			var durationDate = this.context.dateFormat.duration(new Date(this.getEndTime() - this.getStartTime()));	
			
			var tooltip = this.context.i18n.get("run.time").value + ": <br> " + durationDate;
			r.push(new Progresser(this.context, x, y, r0, this.context.colors.COLOR_DONE, tooltip));
		}
		return r;
	}
	
	this.getTimers = function(){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		//stTime
		if(this.stTime){
			r.push(new Timer(this.context, "ST", this.stTime, x, y, this.context.colors.COLOR_GRAY));
		}
		
		//etTime
		if(this.etTime){
			var s1 = (this.etTime - this.stTime) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new Timer(this.context, "ET", this.etTime, x1, y, this.context.colors.COLOR_GRAY));
		}
		return r;
	}
}