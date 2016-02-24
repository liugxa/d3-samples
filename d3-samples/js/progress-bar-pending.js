function PendingProgressBar(context, smtTime, ctTime, estTime, ptlTime){
	this.context = context;
	this.smtTime = smtTime;
	this.ctTime = ctTime;
	this.estTime = estTime;
	this.ptlTime = ptlTime;
	
	this.getBeginTime = function(){
		return this.smtTime;
	}
	
	this.getStartTime = function(){
		return this.smtTime;
	}
	
	this.getEndTime = function(){
		var r = this.ctTime;
		if(this.estTime != null) {
			r = this.estTime;
		}
		return r;
	}
	
	this.getFinishTime = function(){
		var r;
		if(this.estTime != null){
			r = this.estTime;
			if(this.ptlTime != null && this.estTime <= this.ptlTime){
				r = this.ptlTime;
			}		
		}else{
			r = this.ctTime;
			if(this.ptlTime != null && this.ctTime <= this.ptlTime){
				r = this.ptlTime;
			}
		}
		return r;
	}
	
	this.getProgressers = function(){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		if(this.ctTime){
			//from smtTime to ctTime
			var r1 = (this.ctTime - this.smtTime) * this.context.xUnit;
			var durationDate = new Date(this.ctTime - this.smtTime);
			
			var tooltip = this.context.i18n.get("pending.duration").value + ": \r\n " + this.context.duration.format(durationDate);
			r.push(new Progresser(this.context, x, y, r1, this.context.colors.COLOR_PENDING, tooltip));
			
			if(this.estTime){
				//from ctTime to estTime
				var x1 = x + (this.ctTime - this.getBeginTime()) * this.context.xUnit;
				var r1 = (this.estTime - this.ctTime) * this.context.xUnit;
				r.push(new Progresser(this.context, x1, y, r1, this.context.colors.COLOR_HOLD));
				
				if(this.ptlTime != null && this.estTime < this.ptlTime){
					//from estTime to ptlTime
					var x1 = x + (this.estTime - this.getBeginTime()) * this.context.xUnit;
					var r1 = (this.ptlTime - this.estTime) * this.context.xUnit;
					r.push(new BreakLine(this.context, x1, y, r1));
				}
			}else{
				if(this.ptlTime != null && this.ctTime < this.ptlTime){
					//from ctTime to ptlTime
					var x1 = x + (this.ctTime - this.getBeginTime()) * this.context.xUnit;
					var r1 = (this.ptlTime - this.ctTime) * this.context.xUnit;
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
		
		//smtTime
		if(this.smtTime){
			r.push(new Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_GRAY));
		}
		
		//ctTime
		if(this.ctTime){
			var s1 = (this.ctTime - this.getBeginTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new Timer(this.context, "CT", this.ctTime, x1, y, this.context.colors.COLOR_YELLOW));
		}
		
		//estTime
		if(this.estTime){
			var s1 = (this.estTime - this.getBeginTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new Timer(this.context, "EST", this.estTime, x1, y, this.context.colors.COLOR_GRAY));
		}
		
		//ptlTime
		if(this.ptlTime){
			var s1 = (this.ptlTime - this.getBeginTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new Timer(this.context, "PTL", this.ptlTime, x1, y, this.context.colors.COLOR_RED));
		}
		return r;
	}
}