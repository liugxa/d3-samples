function DoneProgressBar(context, smtTime, stTime, etTime){
	this.context = context;
	this.smtTime = smtTime;
	this.stTime = stTime;
	this.etTime = etTime;
	
	this.getBeginTime = function(){
		return this.stTime;
	}
	
	this.getStartTime = function(){
		return this.stTime;
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
		var x = 0; var y = 0;
		
		//from stTime to etTime
		var x2 = x + this.context.xMargin; 
		var y2 = y + this.context.yMargin;
		var r2 = (this.etTime - this.stTime) * this.context.xUnit;
		r.push(new Progresser(this.context, x2, y2, r2, this.context.colors.COLOR_DONE));
		
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