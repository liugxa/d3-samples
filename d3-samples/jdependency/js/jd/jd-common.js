

function JDDiagram(context, position, id, type, state, label){
	this.context = context;
	this.position = position;
	this.id = id;
	this.type = type;
	this.state = state;
	this.label = label;
	
	this.inLines = [];
	this.outLines = [];
	
	var yOffset = 2;
	var jdText = null;
	var jdImage = null;
	
	this.show = function(){
		var _self = this;
		
		var drag = svg.behavior.drag().on("drag", function() {	
			//var t = svg.transform(this.getAttribute("transform")).translate;
			//var x = svg.event.dx + t[0]; 
			//var y = svg.event.dy + t[1];
			//svg.select(this).attr("transform", "translate(" + x + "," + y +   ")");
			var x = svg.event.x - _self.context.xUnit / 2;
			var y = svg.event.y - _self.context.yUnit / 2;
			var position = new JDPosition(_self.context, x, y);
			_self.move(position);
		});
		var group = this.context.svg.append("g")
		group.call(drag);
		
		//create text
		var type = this.getType(); var state = this.getState();
		
		var tx = this.position.x;
		var ty = this.position.y + this.context.TEXT_HEIGHT - yOffset;
		var tl = "";
		if(this.label != null) tl = type + "(" + this.label + ")";
		jdText = new JDText(group, tx, ty, this.context.TEXT_WIDTH, this.context.TEXT_WIDTH, this.id, tl);
		jdText.show();
		
		//crete image
		var ix = this.position.x;
		var iy = this.position.y + this.context.TEXT_HEIGHT;
		var is = this.context.urlContext + this.getSrc(type, state);
		jdImage = new JDImage(group, ix, iy, this.id, this.context.IMAGE_WIDTH, this.context.IMAGE_HEIGHT, is, label);
		jdImage.show();
	}
	
	this.move = function(position){
		this.position = position;
		
		var tx = this.position.x;
		var ty = this.position.y + this.context.TEXT_HEIGHT - yOffset;
		jdText.move(tx, ty);
		
		var ix = this.position.x;
		var iy = this.position.y + this.context.TEXT_HEIGHT;
		jdImage.move(ix, iy);
		
		//move line
		var cPosition = position.getCenter();
		//call the in lines to execute the endAt method
		for(var i=0;i<this.inLines.length;i++){
			var inLine = this.inLines[i];
			inLine.move(inLine.sPosition, cPosition);
		}
		
		//call the out lines to execute the startAt method
		for(var i=0;i<this.outLines.length;i++){
			var outLine = this.outLines[i];
			outLine.move(cPosition, outLine.ePosition);
		}
	}
	
	this.getSrc = function(){
		var type = this.getType(); var state = this.getState();
		var r = "/images/resources/" + type + ".gif";
		if(state != "") r = "/images/resources/" + state + "/" + type + ".gif";
		return r;
	}
	
	this.getType = function(){
		var r = "job";
		if(this.type){
			var t = this.type.toUpperCase();
			switch(t){
				case "JOBARRAY":
					r = "jobarray";
					break;
				case "AND":
					r = "and";
					break;
				case "OR":
					r = "or";
					break;
			}
		}
		return r;
	}
	
	this.getState = function(){
		var r = "";
		if(this.state){
			var s = this.state.toUpperCase();
			if(s.indexOf("*") != -1) s = s.substring(s.indexOf("*") + 1);
			switch(s){
				case "PENDING":
				case "PEND":
					r = "pending";
					break;
				case "RUNNING":
				case "RUN":
					r = "running";
					break;
				case "DONE":
					r = "done";
					break;
				case "EXIT":
					r = "exited";
					break;
				case "USUSP":
				case "SSUSP":
				case "PSUSP":
					r = "suspended";
					break;
				case "WAITING":
					r = "waiting";
					break;
				case "ONHOLD":
					r = "onhold";
					break;
			}
		}
		return r;
	}	
}

function JDPathLine(context, sPosition, ePosition, id, label, style){
	this.context = context;
	this.sPosition = sPosition;
	this.ePosition = ePosition;
	this.id = id;
	this.label = label;
	this.style = (style) ? style: "dash";
	
	this.show = function(){
		var group = this.context.svg.append("g");
		
		var path = group.append("path").attr("id", this.id);
		var d = this.getD(this.sPosition.x, this.sPosition.y, this.ePosition.x, this.ePosition.y);
		path.attr("d", d).attr("style", "stroke: black").attr("marker-mid","url(#arrow)");
		
		//the line style. By default, showing dash line
		if(this.style == "dash") path.style("stroke-dasharray", ("3, 3"));
		
		var t = group.append("text").attr("id", this.id + "_text");
		t.style("text-anchor", "middle").style("font-size", "9pt");
		t.style("font-family", "Arial, Helvetica, sans-serif").style("font-style", "italic");
		t.attr("dy", "-4");
		
		var tPath = t.append("textPath").attr("id", this.id + "_textpath");
		tPath.attr("xlink:href", "#" + this.id).attr("startOffset", "50%");
		if(this.label != null) tPath.text(this.label);
	}
		
	this.startAt = function(position){
		this.sPosition.x = position.getCenter().x; 
		this.sPosition.y = position.getCenter().y;
		
		var path = svg.select("#" + this.id);
		var d = this.getD(this.sPosition.x, this.sPosition.y, this.ePosition.x, this.ePosition.y);
		path.attr("d", d);
	}
	
	this.endAt = function(position){
		this.ePosition.x = position.getCenter().x; 
		this.ePosition.y = position.getCenter().y;
		
		var path = svg.select("#" + this.id);
		var d = this.getD(this.sPosition.x, this.sPosition.y, this.ePosition.x, this.ePosition.y);
		path.attr("d", d);
	}
	
	this.move = function(sPosition, ePosition){
		this.sPosition = sPosition;
		this.ePosition = ePosition;
		
		var path = svg.select("#" + this.id);
		var d = this.getD(this.sPosition.x, this.sPosition.y, this.ePosition.x, this.ePosition.y);
		path.attr("d", d);
	}
	
	this.getD = function(x1, y1, x2, y2){
		var dx = x2 - x1; var dy = y2 - y1;
		return "M" + x1 + "," + y1 +  " T" + (x1 + dx / 2) + "," + (y1 + dy / 2) + " T" + x2 + "," + y2;
	}
}

function JDLine(context, sPosition, ePosition, id, condition, style){
	this.context = context;
	this.sPosition = sPosition;
	this.ePosition = ePosition;
	this.id = id;
	this.condition = condition;
	this.style = (style) ? style: "dash";
	
	this.show = function(){
		var group = this.context.svg.append("g");
		var line = group.append("line").attr("id", this.id);
		
		var cPosition1 = this.sPosition;
		var cPosition2 = this.ePosition;
		
		line.attr("x1", cPosition1.x).attr("y1", cPosition1.y).attr("x2", cPosition2.x).attr("y2", cPosition2.y);
		line.style("stroke", "gray").style("stroke-width", "1");
		
		//the line style. By default, showing dash line
		if(this.style == "dash") line.style("stroke-dasharray", ("3, 3"));
	}
	
	this.startAt = function(x, y){
		this.sPosition.x = x; 
		this.sPosition.y = y;
		
		var line = svg.select("#" + this.id);
		line.attr("x1", this.sPosition.x).attr("y1", this.sPosition.y);
	}
	
	this.endAt = function(x, y){
		this.ePosition.x = x; 
		this.ePosition.y = y;
		
		var line = svg.select("#" + this.id);
		line.attr("x2", x).attr("y2", y);
	}
	
	this.move = function(sPosition, ePosition){
		this.sPosition = sPosition;
		this.ePosition = ePosition;
		
		var line = svg.select("#" + this.id);
		line.attr("x1", this.sPosition.x).attr("y1", this.sPosition.y).attr("x2", this.ePosition.x).attr("y2", this.ePosition.y);
	}	
}

//the below item is base on the group object
function JDImage(group, x, y, id, width, height, src, label){
	this.group = group;
	this.x = x;
	this.y = y;
	this.id = id;
	this.width = width;
	this.height = height;
	this.src = src;
	this.label = label;
	
	var img = null;
	this.show = function(){
		var _self = this;
		img = this.group.append("image");
		img.attr("id", this.id + "_image");
		img.attr("x", this.x).attr("y", this.y);
		img.attr("width", this.width).attr("height", this.height);
		img.attr("xlink:href", this.src);
		img.on("dblclick", function(){
			window.imageOnclick(_self.context, _self.label);
		})
	}
	
	this.move = function(x, y){
		this.x = x; this.y = y;
		img.attr("x", this.x).attr("y", this.y);
	}
}

function JDText(group, x, y, id, width, height, text){
	this.group = group;
	this.x = x;
	this.y = y;
	this.id = id;
	this.widht = width;
	this.height = height;
	this.text = text;
	
	var t = null;
	this.show = function(){
		t = this.group.append("text");
		t.attr("id", this.id + "_text");
		t.attr("x", this.x).attr("y", this.y);
		
		t.attr("width", this.width).attr("height", this.height);
		t.style("font-family", "Arial").style("font-size", "8.5pt").style("weight", "bold");
		t.text(this.text);
	}
	
	this.move = function(x, y){
		this.x = x; this.y = y;
		t.attr("x", this.x).attr("y", this.y);
	}
}

