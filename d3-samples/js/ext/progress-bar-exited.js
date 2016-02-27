function ExitedProgressBar(context, smtTime, stTime, etTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.etTime = etTime;
	
	this.getStartTime = function(){
		var r = smtTime;
		if(this.stTime) r = stTime;
		return r;
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
			//get the showing name and color
			var pName = this.context.i18n.get("pending.duration").value;
			var pColor = this.context.colors.COLOR_PENDING_OPT;
			if(this.stTime){
				pName = this.context.i18n.get("running.time").value;
				pColor = this.context.colors.COLOR_RUNNING_OPT;
			}
			
			//get the duration date
			var r0 = (this.getEndTime() - this.getStartTime()) * this.context.xUnit;
			var durationDate = this.context.dateFormat.duration(new Date(this.getEndTime() - this.getStartTime()));
			
			//show start time to end time
			var tooltip = pName + ": <br> " + durationDate;
			r.push(new Progresser(this.context, x, y, r0, pColor, tooltip));
		}
		return r;
	}
	
	this.getTimers = function(){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		//show the start time
		//if the stTime is not exist, showing the smtTime
		if(this.stTime){
			r.push(new Timer(this.context, "ST", this.stTime, x, y, this.context.colors.COLOR_GRAY));
		}else{
			r.push(new Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_GRAY));
		}
		
		//etTime
		if(this.etTime){
			var s1 = (this.etTime - this.getStartTime()) * this.context.xUnit;
			var x1 = x + s1; 
			var y1 = y;
			r.push(new Timer(this.context, "ET", this.etTime, x1, y1, this.context.colors.COLOR_RED));
		}
		return r;
	}
}