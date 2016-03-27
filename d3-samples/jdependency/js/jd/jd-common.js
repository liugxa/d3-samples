
function JDDiagram(context, jdId, position, type, state, label){
	this.context = context;
	this.jdId = jdId;
	this.position = position;
	this.type = type;
	this.state = state;
	this.label = label;
	
	this.inLines = [];
	this.outLines = [];
	
	this.jdText = null;
	this.jdImage = null;
		
	this.show = function(){
		var _self = this;
		var drag = svg.behavior.drag().on("drag", function() {
			_self.move(svg.event.x , svg.event.y);
		});
		
		//create group
		var group = this.context.svg.append("g")
		group.call(drag);
		
		//create text
		var jdTextId = this.jdId + "_text";
		var jdText = (this.label != null) ? (this.getType() + "(" + this.label + ")") : "";
		this.jdText = new JDText(this.context, jdTextId, group, this.position, jdText);
		this.jdText.show();
		
		//crete image
		var jdImageId = this.jdId + "_image";
		var jdImageSrc = this.context.urlContext + this.getSrc(type, state);
		this.jdImage = new JDImage(this.context, jdImageId, group, this.position, jdImageSrc, this.label);
		this.jdImage.show();
	}
	
	this.move = function(x, y){
		this.position = new JDPosition(this.context, x, y);
		
		this.jdText.move(this.position);
		this.jdImage.move(this.position);
		
		//move line
		//call the in lines to execute the endAt method
		for(var i=0;i<this.inLines.length;i++){
			var inLine = this.inLines[i];
			inLine.move(inLine.sPosition, this.position);
		}
		
		//call the out lines to execute the startAt method
		for(var i=0;i<this.outLines.length;i++){
			var outLine = this.outLines[i];
			outLine.move(this.position, outLine.ePosition);
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

function JDPathLine(context, jdId, sPosition, ePosition, label, style){
	this.context = context;
	this.jdId = jdId;
	this.sPosition = sPosition;
	this.ePosition = ePosition;
	this.label = label;
	this.style = style;
	
	this.show = function(){
		this.style = (this.style) ? this.style: "dash";
		var group = this.context.svg.append("g");
		
		var path = group.append("path").attr("id", this.jdId);
		path.attr("d", this.getD(this.sPosition, this.ePosition));
		path.attr("style", "stroke: black").attr("marker-mid","url(#arrow)");
		
		//the line style. By default, showing dash line
		if(this.style == "dash") path.style("stroke-dasharray", ("3, 3"));
		
		var t = group.append("text").attr("id", this.jdId + "_text");
		t.style("text-anchor", "middle").style("font-size", "9pt");
		t.style("font-family", "Arial, Helvetica, sans-serif").style("font-style", "italic");
		t.attr("dy", "-4");
		
		var tPath = t.append("textPath").attr("id", this.jdId + "_textpath");
		tPath.attr("xlink:href", "#" + this.jdId).attr("startOffset", "50%");
		if(this.label != null) tPath.text(this.label);
	}
	
	this.move = function(sPosition, ePosition){
		this.sPosition = sPosition; this.ePosition = ePosition;
		var path = svg.select("#" + this.jdId);
		path.attr("d", this.getD(this.sPosition, this.ePosition));
	}
	
	this.getD = function(sPosition, ePosition){
		var dx = ePosition.center.x - sPosition.center.x; var dy = ePosition.center.y - sPosition.center.y;
		var mx = sPosition.center.x + dx / 2; var my = sPosition.center.y + dy / 2;
		return "M" + sPosition.center.x + "," + sPosition.center.y +  " T" + mx + "," + my + " T" + ePosition.center.x + "," + ePosition.center.y;
	}
}

function JDLine(context, jdId, sPosition, ePosition, label, style){
	this.context = context;
	this.jdId = jdId;
	this.sPosition = sPosition;
	this.ePosition = ePosition;
	this.label = label;
	this.style = style;
	
	this.show = function(){
		this.style = (this.style) ? this.style: "dash";
		var group = this.context.svg.append("g");
		
		var line = group.append("line").attr("id", this.jdId);
		line.attr("x1", this.sPosition.x).attr("y1", this.sPosition.y);
		line.attr("x2", this.ePosition.x).attr("y2", this.ePosition.y);
		line.style("stroke", "gray").style("stroke-width", "1");
		
		//the line style. By default, showing dash line
		if(this.style == "dash") line.style("stroke-dasharray", ("3, 3"));
	}
	
	this.move = function(sPosition, ePosition){
		this.sPosition = sPosition; this.ePosition = ePosition;
		var line = svg.select("#" + this.jdId);
		line.attr("x1", this.sPosition.x).attr("y1", this.sPosition.y);
		line.attr("x2", this.ePosition.x).attr("y2", this.ePosition.y);
	}	
}

//the below item is base on the group object
function JDImage(context, jdId, group, position, src, label){
	this.context = context;
	this.jdId = jdId;
	this.group = group;
	this.position = position;
	this.src = src;
	this.label = label;
	
	this.show = function(){
		var _self = this;
		
		var img = this.group.append("image");
		img.attr("id", this.jdId);
		img.attr("x", this.position.image.x).attr("y", this.position.image.y);
		img.attr("width", this.context.IMAGE_WIDTH).attr("height", this.context.IMAGE_HEIGHT);
		img.attr("xlink:href", this.src);
		img.on("dblclick", function(){
			window.imageOnclick(_self.context, _self.label);
		})
	}
	
	this.move = function(position){
		this.position = position;
		var img = svg.select("#" + this.jdId);
		img.attr("x", this.position.image.x).attr("y", this.position.image.y);
	}
}

function JDText(context, jdId, group, position, label){
	this.context = context;
	this.jdId = jdId;
	this.group = group;
	this.position = position;
	this.label = label;
	
	this.show = function(){
		var t = this.group.append("text");
		t.attr("id", this.jdId);
		t.attr("x", this.position.text.x).attr("y", this.position.text.y);
		
		t.attr("width", this.context.TEXT_WIDTH).attr("height", this.context.TEXT_HEIGHT);
		t.style("font-family", "Arial").style("font-size", "8.5pt").style("weight", "bold");
		t.text(this.label);
	}
	
	this.move = function(position){
		this.position = position;
		var t = svg.select("#" + this.jdId);
		t.attr("x", this.position.text.x).attr("y", this.position.text.y);
	}
}