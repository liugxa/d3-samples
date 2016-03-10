function BreakLine(context, x, y, width, tooltip){
	this.context = context;
	this.x = x; 
	this.y = y;
	
	this.width = width;
	this.tooltip = tooltip;
	this.height = this.context.yUnit;
		
	this.show = function(){
		//slash height
		var xHeight = 1;
		var yHeight = this.height / 4;
		
		//line start
		var ls = this.context.svg.append("line");
		var ls_x1 = this.x;
		var ls_y1 = this.y + this.height / 2;
		var ls_x2 = this.x + this.width * 0.4;
		var ls_y2 = ls_y1;
		ls.attr("x1", ls_x1).attr("y1", ls_y1).attr("x2", ls_x2).attr("y2", ls_y2);
		ls.attr("style", "stroke:" + this.context.colors.COLOR_BLACK);
		
		var l2 = this.context.svg.append("line");
		var l2_x1 = ls_x2 - xHeight;
		var l2_y1 = ls_y2 + yHeight;
		var l2_x2 = ls_x2 + xHeight;
		var l2_y2 = ls_y2 - yHeight;
		l2.attr("x1", l2_x1).attr("y1", l2_y1).attr("x2", l2_x2).attr("y2", l2_y2);
		l2.attr("style", "stroke:" + this.context.colors.COLOR_BLACK);

		//line end
		var le = this.context.svg.append("line");
		var le_x1 = this.x + this.width * 0.6;
		var le_y1 = this.y + this.height / 2;
		var le_x2 = this.x + this.width;
		var le_y2 = le_y1;
		le.attr("x1", le_x1).attr("y1", le_y1).attr("x2", le_x2).attr("y2", le_y2);
		le.attr("style", "stroke:" + this.context.colors.COLOR_BLACK);
		
		var l3 = this.context.svg.append("line");
		var l3_x1 = le_x1 - xHeight;
		var l3_y1 = le_y1 + yHeight;
		var l3_x2 = le_x1 + xHeight;
		var l3_y2 = le_y1 - yHeight;
		l3.attr("x1", l3_x1).attr("y1", l3_y1).attr("x2", l3_x2).attr("y2", l3_y2);
		l3.attr("style", "stroke:" + this.context.colors.COLOR_BLACK);
	}
}

function BreakLineSymbol(context, x, y, width, tooltip){
	this.context = context;
	this.x = x; 
	this.y = y;
	
	this.width = width;
	this.tooltip = tooltip;
	
	this.show = function(){
		var bWidth = this.width * 0.6;
		var breakLine = new BreakLine(this.context, this.x, this.y, bWidth);
		breakLine.show();
		
		var tfont = this.width * 0.8 + "px";
		var tWidth = this.width * 0.4;
		var t = this.context.svg.append("text");
		t.attr("x", this.x + bWidth).attr("y", (this.y + this.context.yUnit * 0.8)).attr("width", tWidth);
		t.style("font-family", "Arial").text(" ? ").style("font-size", tfont);
		
		var tp = new Tooltip(this.context, this.x, this.y, tooltip);
		tp.attach(t);
	}
}

function BreakLineTime(context, x, y, width, time, tooltip){
	this.context = context;
	this.x = x; 
	this.y = y;
	
	this.width = width;
	this.time = time;
	this.tooltip = tooltip;
	
	this.show = function(){
		var bWidth = this.width - (this.context.yUnit * 0.3);
		var breakLine = new BreakLine(this.context, this.x, this.y, bWidth);
		breakLine.show();
		
		var time = new Timer(this.context, "PTL", this.time, this.x + bWidth, y, this.context.colors.COLOR_RED);
		time.show();
	}
}


