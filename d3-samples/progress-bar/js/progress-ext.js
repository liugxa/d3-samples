
jProgress.DoneProgressBar = function(context, smtTime, stTime, etTime){
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
			r.push(new jProgress.ProgresserBreakLine(this.context, 0, y, pWidth, this.context.colors.COLOR_PENDING, tooltip));
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
			r.push(new jProgress.Progresser(this.context, x, y, r0, this.context.colors.COLOR_DONE, tooltip));
		}
		return r;
	}
	
	this.getTimers = function(){
		var r = [];
		var x = this.context.xMargin; 
		var y = this.context.yMargin;
		
		//stTime
		if(this.stTime){
			r.push(new jProgress.Timer(this.context, "ST", this.stTime, x, y, this.context.colors.COLOR_GRAY));
		}
		
		//etTime
		if(this.etTime){
			var s1 = (this.etTime - this.stTime) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new jProgress.Timer(this.context, "ET", this.etTime, x1, y, this.context.colors.COLOR_GRAY));
		}
		return r;
	}
}

jProgress.ExitedProgressBar = function(context, smtTime, stTime, etTime){
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
			r.push(new jProgress.ProgresserBreakLine(this.context, 0, y, pWidth, this.context.colors.COLOR_PENDING, tooltip));
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
			r.push(new jProgress.Progresser(this.context, x, y, r0, pColor, tooltip));
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
			r.push(new jProgress.Timer(this.context, "ST", this.stTime, x, y, this.context.colors.COLOR_GRAY));
		}else{
			r.push(new jProgress.Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_GRAY));
		}
		
		//etTime
		if(this.etTime){
			var s1 = (this.etTime - this.getStartTime()) * this.context.xUnit;
			var x1 = x + s1; 
			var y1 = y;
			r.push(new jProgress.Timer(this.context, "ET", this.etTime, x1, y1, this.context.colors.COLOR_RED));
		}
		return r;
	}
}

jProgress.PendingProgressBar = function(context, smtTime, ctTime, estTime, ptlTime){
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
			r.push(new jProgress.Progresser(this.context, x, y, r0, this.context.colors.COLOR_PENDING, tooltip));
			
			//from ctTime to end time
			if(this.getEndTime()){
				var x1 = x + r0;
				var r1 = (this.getEndTime() - this.ctTime) * this.context.xUnit;	
				var durationDate = this.context.dateFormat.duration(new Date(this.getEndTime() - this.ctTime));
				
				var tooltip = this.context.i18n.get("time.remaining").value + ": <br> " + durationDate;
				r.push(new jProgress.Progresser(this.context, x1, y, r1, this.context.colors.COLOR_HOLD, tooltip));
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
			r.push(new jProgress.Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_GRAY));
		}
		
		//ctTime
		if(this.ctTime){
			var s1 = (this.ctTime - this.getStartTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new jProgress.Timer(this.context, "CT", this.ctTime, x1, y, this.context.colors.COLOR_YELLOW));
		}
		
		if(this.estTime != this.ptlTime){
			//estTime
			if(this.estTime){
				var s1 = (this.estTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1;
				r.push(new jProgress.Timer(this.context, "EST", this.estTime, x1, y, this.context.colors.COLOR_GRAY));
			}
			//ptlTime
			if(this.ptlTime){
				var s1 = (this.ptlTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1;
				r.push(new jProgress.Timer(this.context, "PTL", this.ptlTime, x1, y, this.context.colors.COLOR_RED));
			}
		}else{
			//the estTime == ptlTime
			if(this.estTime && this.ptlTime){
				var s1 = (this.estTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1;
				r.push(new jProgress.DoubleTimer(this.context, "EST=PTL", this.estTime, x1, y, this.context.colors.COLOR_GRAY, this.context.colors.COLOR_RED));
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
			r.push(new jProgress.BreakLineSymbol(this.context, x + x1, y, pWidth, tooltip));		
		}else{
			//from the finish time to plt time
			if(this.ptlTime != null && this.ptlTime > this.getEndTime()){
				var pWidth = this.context.xMargin;
				var x1 = (this.getEndTime() - this.getStartTime()) * this.context.xUnit;
				r.push(new jProgress.BreakLineTime(this.context, x + x1, y, pWidth, this.ptlTime));		
			}
		}
		return r;
	}
}

jProgress.RunningProgressBar = function(context, smtTime, stTime, ctTime, eetTime, rtlTime){
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
			r.push(new jProgress.ProgresserBreakLine(this.context, 0, y, pWidth, this.context.colors.COLOR_PENDING, tooltip));
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
			r.push(new jProgress.Progresser(this.context, x, y, r0, pColor, tooltip));
			
			//show ctTime to end time
			if(this.getEndTime()){
				var x1 = x + r0;
				var r1 = (this.getEndTime() - this.ctTime) * this.context.xUnit;				
				var durationDate = this.context.dateFormat.duration(new Date(this.getEndTime() - this.ctTime));
				
				var tooltip = this.context.i18n.get("time.remaining").value + ": <br> " + durationDate;
				r.push(new jProgress.Progresser(this.context, x1, y, r1, this.context.colors.COLOR_HOLD, tooltip));
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
			r.push(new jProgress.Timer(this.context, "ST", this.stTime, x, y, this.context.colors.COLOR_GRAY));
		}else{
			r.push(new jProgress.Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_YELLOW));
		}
		
		//ctTime
		if(this.ctTime){
			var s1 = (this.ctTime - this.getStartTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new jProgress.Timer(this.context, "CT", this.ctTime, x1, y, this.context.colors.COLOR_GRAY));
		}
		
		if(this.eetTime != this.rtlTime){
			//eetTime
			if(this.eetTime){
				var s1 = (this.eetTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1; 
				r.push(new jProgress.Timer(this.context, "EET", this.eetTime, x1, y, this.context.colors.COLOR_GRAY));
			}
			//rtlTime
			if(this.rtlTime){
				var s1 = (this.rtlTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1;
				r.push(new jProgress.Timer(this.context, "RTL", this.rtlTime, x1, y, this.context.colors.COLOR_RED));
			}
		}else{
			//eetTime == rtlTime
			if(this.eetTime && this.rtlTime){
				var s1 = (this.eetTime - this.getStartTime()) * this.context.xUnit;
				var x1 = x + s1; 
				r.push(new jProgress.DoubleTimer(this.context, "EET=RTL", this.eetTime, x1, y, this.context.colors.COLOR_GRAY, this.context.colors.COLOR_RED));
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
			r.push(new jProgress.BreakLineSymbol(this.context, x + x1, y, pWidth, tooltip));		
		}else{
			//from the finish time to rlt time
			if(this.rtlTime != null && this.rtlTime > this.getEndTime()){
				var pWidth = this.context.xMargin;
				var x1 = (this.getEndTime() - this.getStartTime()) * this.context.xUnit;
				r.push(new jProgress.BreakLineTime(this.context, x + x1, y, pWidth, this.rtlTime));		
			}
		}
		return r;
	}
}

jProgress.SuspendedProgressBar = function(context, smtTime, stTime, sptTime, ctTime){
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
			r.push(new jProgress.ProgresserBreakLine(this.context, 0, y, pWidth, this.context.colors.COLOR_PENDING, tooltip));
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
			r.push(new jProgress.Progresser(this.context, x, y, r0, pColor, tooltip));
			
			//from sptTime to end time
			if(this.getEndTime()){
				var x1 = x + r0;
				var r1 = (this.getEndTime() - this.sptTime) * this.context.xUnit;				
				var durationDate = this.context.dateFormat.duration(new Date(this.getEndTime() - this.sptTime));
				
				var tooltip = this.context.i18n.get("suspended.duration").value + ": <br> " + durationDate;
				r.push(new jProgress.Progresser(this.context, x1, y, r1, this.context.colors.COLOR_SUSPENDED_OPT, tooltip));
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
			r.push(new jProgress.Timer(this.context, "ST", this.stTime, x, y, this.context.colors.COLOR_GRAY));
		}else{
			r.push(new jProgress.Timer(this.context, "SMT", this.smtTime, x, y, this.context.colors.COLOR_GRAY));
		}
		
		//sptTime
		if(this.sptTime){
			var s1 = (this.sptTime - this.getStartTime()) * this.context.xUnit;
			var x1 = x + s1;
			r.push(new jProgress.Timer(this.context, "SPT", this.sptTime, x1, y, this.context.colors.COLOR_PINK));
		}
		
		if(this.ctTime){
			var s1 = (this.ctTime - this.getStartTime()) * this.context.xUnit;
			var x1 = x + s1;			
			r.push(new jProgress.Timer(this.context, "CT", this.ctTime, x1, y, this.context.colors.COLOR_GRAY));		
		}
		return r;
	}
}