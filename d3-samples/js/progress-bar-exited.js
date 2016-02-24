function ExitedProgressBar(context, smtTime, stTime, etTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.etTime = etTime;
	
	this.getBeginTime = function(){
		var r = stTime;
		if(this.stTime == null) r = smtTime;
		return r;
	}
	
	this.getStartTime = function(){
		var r = stTime;
		if(this.stTime == null) r = smtTime;
		return r;
	}
	
	this.getEndTime = function(){
		return this.etTime;
	}
	
	this.getFinishTime = function(){
		return this.etTime;
	}
	
	this.getStartBars = function(){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		//showing the smtTime into the start bar
		if(this.stTime){
			var pWidth = this.context.xMargin;
			var durationDate = new Date(this.stTime - this.smtTime);
			
			var tooltip = this.context.i18n.get("pending.duration").value + ": \r\n " + this.context.duration.format(durationDate);
			r.push(new ProgresserBreakLine(this.context, 0, y, pWidth, this.context.colors.COLOR_PENDING, tooltip));
		}
		return r;
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		//show stTime or smtTime
		if(this.stTime){
			//from stTime to etTime
			var r1 = (this.etTime - this.stTime) * this.context.xUnit;
			r.push(new Progresser(this.context, x, y, r1, this.context.colors.COLOR_EXITED));
		}else{
			//from smtTime to etTime
			var r1 = (this.etTime - this.smtTime) * this.context.xUnit;
			r.push(new Progresser(this.context, x, y, r1, this.context.colors.COLOR_EXITED));
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
			r.push(new Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_GRAY));
		}
		
		//etTime
		if(this.etTime){
			var s1 = (this.etTime - this.getBeginTime()) * this.context.xUnit;
			var x1 = x + s1; 
			var y1 = y;
			r.push(new Timer(this.context, "ET", this.etTime, x1, y1, this.context.colors.COLOR_RED));
		}
		return r;
	}
}