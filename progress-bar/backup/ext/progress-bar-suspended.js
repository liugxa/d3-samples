function SuspendedProgressBar(context, smtTime, stTime, sptTime, ctTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.sptTime = sptTime;
	this.ctTime = ctTime;
	
	this.getStartTime = function(){
		var r = smtTime;
		if(this.stTime) r = stTime;
		return r;		
	}
	
	this.getEndTime = function(){
		return this.ctTime;
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
		
		//from start time to sptTime
		if(this.getStartTime() && this.sptTime){
			//get the showing name and color
			var pName = this.context.i18n.get("pending.duration").value;
			var pColor = this.context.colors.COLOR_PENDING_OPT;
			if(this.stTime){
				pName = this.context.i18n.get("running.time").value;
				pColor = this.context.colors.COLOR_RUNNING_OPT;
			}
			//get the duration date
			var r0 = (this.sptTime - this.getStartTime()) * this.context.xUnit;
			var durationDate = this.context.dateFormat.duration(new Date(this.sptTime - this.getStartTime()));
			
			//show start time to sptTime
			var tooltip = pName + ": <br> " + durationDate;
			r.push(new Progresser(this.context, x, y, r0, pColor, tooltip));
			
			//from sptTime to end time
			if(this.getEndTime()){
				var x1 = x + r0;
				var r1 = (this.getEndTime() - this.sptTime) * this.context.xUnit;				
				var durationDate = this.context.dateFormat.duration(new Date(this.getEndTime() - this.sptTime));
				
				var tooltip = this.context.i18n.get("suspended.duration").value + ": <br> " + durationDate;
				r.push(new Progresser(this.context, x1, y, r1, this.context.colors.COLOR_SUSPENDED_OPT, tooltip));
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
			r.push(new Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_GRAY));
		}
		
		//sptTime
		if(this.sptTime){
			var s1 = (this.sptTime - this.getStartTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new Timer(this.context, "SPT", this.sptTime, x1, y, this.context.colors.COLOR_PINK));
		}
		
		if(this.ctTime){
			var s1 = (this.ctTime - this.getStartTime()) * this.context.xUnit;
			var x1 = x + s1;			
			r.push(new Timer(this.context, "CT", this.ctTime, x1, y, this.context.colors.COLOR_GRAY));		
		}
		return r;
	}
}