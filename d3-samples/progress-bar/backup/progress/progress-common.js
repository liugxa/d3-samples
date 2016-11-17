//using the d3 or rave2
//var PB = d3;
var PB = rave;

function Colors(){
	this.COLOR_BLACK = "rgb(54,54,54)";
	this.COLOR_WHITE = "rgb(255,255,255)";
	this.COLOR_DARK_GRAY = "rgb(118,119,119)";
	this.COLOR_GRAY = "#dddddd";
	this.COLOR_YELLOW = "#f0cc00";
	this.COLOR_GREEN = "#60942c";
	this.COLOR_RED = "#b2293d";
	this.COLOR_PINK = "#e17e2d";

	this.COLOR_RUNNING = "#60942c";
	this.COLOR_WAITING = "#fff69b";
	this.COLOR_SUSPENDED = "#e17e2d";
	this.COLOR_PENDING = "#f0cc00";
	this.COLOR_EXITED = "#b2293d";
	this.COLOR_DONE = "rgb(174, 203, 160)";
	this.COLOR_HOLD = "#eeeef0";
	
	this.COLOR_PENDING_OPT="rgb(247, 230, 138)";
	this.COLOR_RUNNING_OPT="rgb(174, 203, 160)";
	this.COLOR_SUSPENDED_OPT="rgb(226, 127, 48)";
	this.COLOR_TEXT_REGULAR = "#363636";
	this.COLOR_TEXT_ITALIC = "#757575";
}

function DateFormat(){
	this.formatTime = function(date){
		var format = PB.time.format("%Y-%m-%d");
		return format(date);
	}
	
	this.formatStamp = function(date){
		var format = PB.time.format("%H:%M:%S");
		return format(date);	
	}
	
	this.format = function(date){
		var format = PB.time.format("%Y-%m-%d %H:%M:%S");
		return format(date);
	}
	
	this.duration = function(date){
		var r = "";
		
		var y = date.getUTCFullYear() - 1970;
		if(y != 0) r = r + y + "Y" + " ";
		
		var m = date.getUTCMonth();
		if(m != 0) r = r + m + "m" + " ";
		
		var d = date.getUTCDate() - 1;
		if(d != 0) r = r + d + "D" + " ";
		
		var h = date.getUTCHours();
		if(h != 0) r = r + h + "H" + " ";
		
		var mi = date.getUTCMinutes();
		if(mi != 0) r = r + mi + "M" + " ";
		
		var s = date.getUTCSeconds();
		if(s != 0) r = r + s + "S" + " ";
		
		return (r != "") ? r : "0";
	}
}

function Tooltip(context, x, y, tooltip){
	this.context = context; 
	this.x = x; 
	this.y = y;
	this.tooltip = tooltip;
	
	this.attach = function(object){
		object.on("mouseenter", function(){
			object.style("cursor", "pointer");
			var tp_x = PB.event.pageX + 10;
			var tp_y = PB.event.pageY + 10;
			
			var tp = PB.select("body").append("div").attr("id", "div-tooltip").attr("class", "tooltip");
			
			var texts = tooltip.split("<br>");
			for(var i=0;i<texts.length;i++) tp.append("span").style("display", "block").style("height", "15px").text(texts[i]);
			
			//text(tooltip);
			tp.style("left", tp_x + "px").style("top", tp_y + "px");
		});
		
		object.on("mousemove", function(){
			//console.log("event.pageX: " + PB.event.pageX + " | event.pageY: " + PB.event.pageY);
			var tp_x = PB.event.pageX + 10;
			var tp_y = PB.event.pageY + 10;
			
			var tp = PB.select("#div-tooltip");
			tp.style("left", tp_x + "px").style("top", tp_y + "px");
		});
		
		object.on("mouseout", function(){
			//console.log("mouse out!");
			var tp = PB.select("#div-tooltip");
			tp.remove();
		});
	}
}