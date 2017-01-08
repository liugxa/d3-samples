function Timer(context, name, time, x, y, color){
	this.context = context;
	this.name = name;
	this.time = time;
	
	this.x = x; 
	this.y = y;
	this.color = color;
	
	this.width = this.context.yUnit * 0.3;
	this.height = this.context.yUnit * 0.3;
	
	this.show = function(){
		var yOffset = 0;
		if(this.color == this.context.colors.COLOR_RED) yOffset = this.height;
		this.y = this.y - yOffset;
		
		//show the polygon
		var p = this.context.svg.append("polygon");
		var p_x1 = this.x - this.width;
		var p_y1 = this.y - this.height;
		var p_x2 = p_x1 + this.width * 2;
		var p_y2 = p_y1;;
		var p_x3 = this.x;
		var p_y3 = this.y;
		p.attr("points", (p_x1 + "," + p_y1) + " " + (p_x2 + "," + p_y2) + " " + (p_x3 + "," + p_y3));
		p.style("fill", this.color).style("stroke", this.color).style("stroke-width", 1);
		
		//show line
		var l = this.context.svg.append("line");
		var l_x1 = this.x;
		var l_y1 = this.y;
		var l_x2 = l_x1;
		var l_y2 = l_y1 + this.context.yUnit + yOffset;
		l.attr("x1", l_x1).attr("y1", l_y1).attr("x2", l_x2).attr("y2", l_y2);
		l.style("stroke", this.color);
		
		//attach the mouse event
		if(this.name != ""){
			//console.log(this.name + " | " + this.time);
			var t = this.context.i18n.get(this.name);
			var tMessage = t.value + ": <br> " + this.context.dateFormat.format(this.time);
			
			var tp = new Tooltip(this.context, this.x, this.y, tMessage);
			tp.attach(p);
		}
		
		//show time name
		if(this.context.showTimerName == true){
			var t = this.context.svg.append("text");
			var t_x = this.x - this.width - this.width / 2;
			var t_y = this.y - this.height - this.height / 2;
			var t_s = this.height * 2 + "px";
			t.attr("x", t_x).attr("y", t_y);
			t.style("font-size", t_s).style("fill", this.context.colors.COLOR_BLACK)
			t.text(this.name);		
		}
	}
}

function TimerBar(context, name, time, x, y){
	this.context = context;
	this.name = name;
	this.time = time;
	
	this.x = x; 
	this.y = y;
	
	this.w = this.context.w;
	this.h = this.context.h - this.y;
	
	this.width = 70;
	this.height = this.h * 0.6;
	
	this.xOffset = this.width / 8;
	this.yOffset = this.height / 2;
	
	this.show = function(){	
		//draw a poly line
		var l = this.context.svg.append("polyline");
		//point 1
		var l1_x = this.x;
		var l1_y = this.y;
		//point 2
		var l2_x = this.x;
		var l2_y = this.y + this.yOffset;
		//point 3
		var l3_x = this.x + this.xOffset;
		var l3_y = l2_y;
		
		if(this.name == "endTime") l3_x = this.x - this.xOffset;
		l.attr("points", (l1_x + "," + l1_y)  + " " + (l2_x + "," + l2_y) + " " + (l3_x + "," + l3_y));
		l.style("fill", "none").style("stroke", this.context.colors.COLOR_DARK_GRAY).style("stroke-width", 0.4);
		
		//draw the rect
		var r = this.context.svg.append("rect");
		var rx = this.x + this.xOffset;
		var ry = this.y;
		if(this.name == "endTime") rx = this.x - this.width - this.xOffset;
		//r.attr("x", rx).attr("y", ry).attr("width", this.width).attr("height", this.height)
		//r.style("fill", this.context.colors.COLOR_WHITE).style("fill-opacity", 0.8).style("stroke", this.context.colors.COLOR_GRAY);
		
		//draw the time
		var tfont = this.height * 0.46 + "px";
		var t1 = this.context.svg.append("text");
		var t1_x = rx + this.xOffset / 2;
		var t1_y = ry + this.height / 2;
		t1.attr("x", t1_x).attr("y", t1_y).attr("width", this.width).attr("height", this.height);
		t1.text(this.context.dateFormat.formatTime(this.time));
		this.setFont(this.name, t1, tfont);
		
		//draw the stamp
		var t2 = this.context.svg.append("text");
		var t2_x = t1_x;
		var t2_y = t1_y + this.height / 2;
		t2.attr("x", t2_x).attr("y", t2_y).attr("width", this.width).attr("height", this.height);
		t2.text(this.context.dateFormat.formatStamp(this.time));
		this.setFont(this.name, t2, tfont);
	}
	
	this.setFont = function(name, t, tfont){
		t.style("font-size", tfont).style("font-family", "Arial");
		if(name == "endTime") {
			t.attr("fill", this.context.colors.COLOR_TEXT_ITALIC);
			t.style("font-style", "italic");
		}else{
			t.attr("fill", this.context.colors.COLOR_TEXT_REGULAR);
			t.style("font-weight", "bold");
		}	
	}
}

function DoubleTimer(context, name, time, x, y, color1, color2){
	this.context = context;
	this.name = name;
	this.time = time;
	
	this.x = x; 
	this.y = y;
	
	this.color1 = color1; 
	this.color2 = color2;
	
	this.show = function(){
		var t1_x = this.x;
		var t1_y = this.y;
		var timer1 = new Timer(this.context, "", this.time, t1_x, t1_y, this.color1);
		timer1.show();
		
		var t2_x = t1_x;
		var t2_y = t1_y - timer1.height / 4;
		var timer2 = new Timer(this.context, this.name, this.time, t2_x, t2_y, this.color2);
		timer2.show();
	}
}