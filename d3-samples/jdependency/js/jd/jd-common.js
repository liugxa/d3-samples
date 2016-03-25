

function JDDiagram(context, position, id, type, state, label){
	this.context = context;
	this.position = position;
	this.id = id;
	this.type = type;
	this.state = state;
	this.label = label;
	
	this.inLines = [];
	this.outLines = [];
	
	this.show = function(){
		var _self = this;
		var yOffset = 2;
		
		var drag = svg.behavior.drag().on("drag", function() {	
			var move = svg.transform(this.getAttribute("transform")).translate;
			var x = svg.event.dx + move[0];
			var y = svg.event.dy + move[1];
			svg.select(this).attr("transform", "translate(" + x + "," + y +   ")");
			
			//call the in lines to execute the endAt method
			for(var i=0;i<_self.inLines.length;i++){
				var inLine = _self.inLines[i];
				inLine.endAt(x, y);
			}
			
			//call the out lines to execute the startAt method
			for(var i=0;i<_self.outLines.length;i++){
				var outLine = _self.outLines[i];
				outLine.startAt(x, y);
			}
		});
		var group = this.context.svg.append("g")
		group.call(drag);
		
		//create text
		var type = this.getType(); var state = this.getState();
		
		var tx = this.position.x;
		var ty = this.position.y + this.context.TEXT_HEIGHT - yOffset;
		var tl = "";
		if(this.label != null) tl = type + "(" + this.label + ")";
		var jdText = new JDText(group, tx, ty, this.context.TEXT_WIDTH, this.context.TEXT_WIDTH, this.id, tl);
		jdText.show();
		
		//crete image
		var ix = this.position.x;
		var iy = this.position.y + this.context.TEXT_HEIGHT;
		var is = this.context.urlContext + this.getSrc(type, state);
		var jdImage = new JDImage(group, ix, iy, this.id, this.context.IMAGE_WIDTH, this.context.IMAGE_HEIGHT, is, label);
		jdImage.show();
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

function JDPathLine(context, x1, y1, x2, y2, id, label, style){
	this.context = context;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.id = id;
	this.label = label;
	this.style = (style) ? style: "dash";
	
	this.show = function(){
		var group = this.context.svg.append("g");
		
		var path = group.append("path").attr("id", this.id);
		var d = this.getD(this.x1, this.y1, this.x2, this.y2);
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
		
		this.px1 = this.x1; this.py1 = this.y1;
		this.px2 = this.x2; this.py2 = this.y2;
	}
	
	this.getD = function(x1, y1, x2, y2){
		var dx = x2 - x1; var dy = y2 - y1;
		return "M" + x1 + "," + y1 +  " T" + (x1 + dx / 2) + "," + (y1 + dy / 2) + " T" + x2 + "," + y2;
	}
	
	this.startAt = function(dx, dy){
		this.px1 = this.x1 + dx; this.py1 = this.y1 + dy;
		var path = svg.select("#" + this.id);
		
		var d = this.getD(this.px1, this.py1, this.px2, this.py2)
		path.attr("d", d);	
	}
	
	this.endAt = function(dx, dy){
		this.px2 = this.x2 + dx; this.py2 = this.y2 + dy;
		var path = svg.select("#" + this.id);
		
		var d = this.getD(this.px1, this.py1, this.px2, this.py2)
		path.attr("d", d);
	}	
}

function JDLine(context, x1, y1, x2, y2, style){
	this.context = context;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.style = (style) ? style: "dash";
	
	this.show = function(){
		var group = this.context.svg.append("g");
		var line = group.append("line");
		
		line.attr("x1", this.x1).attr("y1", this.y1).attr("x2", this.x2).attr("y2", this.y2);
		line.style("stroke", "gray").style("stroke-width", "1");
		
		//the line style. By default, showing dash line
		if(this.style == "dash") line.style("stroke-dasharray", ("3, 3"));		
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
	
	this.show = function(){
		var _self = this;
		var img = this.group.append("image");
		img.attr("id", this.id + "_image");
		img.attr("x", this.x).attr("y", this.y);
		img.attr("width", this.width).attr("height", this.height);
		img.attr("xlink:href", this.src);
		img.on("dblclick", function(){
			window.imageOnclick(_self.context, _self.label);
		})
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
	
	this.show = function(){
		var t = this.group.append("text");
		t.attr("id", this.id + "_text");
		t.attr("x", this.x).attr("y", this.y);
		
		t.attr("width", this.width).attr("height", this.height);
		t.style("font-family", "Arial").style("font-size", "8.5pt").style("weight", "bold");
		t.text(this.text);
	}
}

