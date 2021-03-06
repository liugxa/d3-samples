
jDependency.JDDiagram = function(context, jdId, position, item){
	this.context = context;
	this.jdId = jdId;
	this.position = position;
	this.item = item;
	
	this.inLines = [];
	this.outLines = [];
	
	this.jdText = null;
	this.jdImage = null;
		
	this.show = function(){
		var _self = this;
		var drag = svg.behavior.drag().on("drag", function() {
			var position = new JDPosition(_self.context, svg.event.x , svg.event.y);
			_self.move(position);
		});
		
		//create group
		var group = this.context.dg.append("g").attr("id", this.jdId);
		group.call(drag);
		
		//create text
		var jdTextId = this.jdId + "_text";
		var jdLabel = (this.item.type != "and" && this.item.type != "or") ? this.item.name : "";
		this.jdText = new JDText(this.context, jdTextId, group, this.position, jdLabel, this.item.id);
		this.jdText.show();
		
		//crete image
		var jdImageId = this.jdId + "_image";
		this.jdImage = new JDImage(this.context, jdImageId, group, this.position, this.item.id, this.getImgSrc(this.item), this.getType(this.item), this.getTooltip(this.item));
		this.jdImage.show();
	}
	
	this.move = function(position){
		this.position = position;
		
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
	
	this.getType = function(item){
		var r = "job";
		if(item.type){
			var t = item.type.toUpperCase();
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
		
	this.getImgSrc = function(item){
		var type = this.getType(item);
		var path = "/images/resources/" + type + ".gif";
		
		if(type == "job" || type == "jobarray"){
			var state = this.getState(item);
			if(state != "") path = "/images/resources/" + state.toLowerCase() + "/" + type + ".gif";
		}
		return this.context.urlContext + path;
	}
	
	this.getState = function(item){
		var r = "";
		if(item.status){
			var s = item.status.toUpperCase();
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
	
	this.getTooltip = function(item){
		var r = "";
		var type = this.getType(item);
		if(type == "job"){
			var state = this.getState(item);
			switch(state){
				case "pending":
					r = this.context.i18n.get("job.status.pending");
					break;
				case "running":
					r = this.context.i18n.get("job.status.running");
					break;
				case "done":
					r = this.context.i18n.get("job.status.done");
					break;
				case "exited":
					r = this.context.i18n.get("job.status.exited");
					break;
				case "suspended":
					r = this.context.i18n.get("job.status.suspended");
					break;
				case "waiting":
					r = this.context.i18n.get("job.status.waiting");
					break;
				case "onhold":
					r = this.context.i18n.get("job.status.onhold");
					break;
			}
		}
		
		if(type == "jobarray"){
			r = item.itemsStatus;
		}
		return r;
	}	
}

jDependency.JDPathLine = function(context, jdId, sPosition, ePosition, text){
	this.context = context;
	this.jdId = jdId;
	this.sPosition = sPosition;
	this.ePosition = ePosition;
	this.text = text;
	
	this.show = function(){
		//var group = this.context.svg.append("g").attr("id", this.jdId);
		var group = this.context.pg.append("g").attr("id", this.jdId);
		
		var path = group.append("path").attr("id", this.jdId + "_path");
		path.attr("d", this.getD(this.sPosition, this.ePosition));
		path.attr("style", "stroke: black").attr("marker-mid","url(#arrow)");
		
		var t = group.append("text").attr("id", this.jdId + "_text");
		t.style("text-anchor", "middle").style("font-size", "9pt");
		t.style("font-family", "Arial, Helvetica, sans-serif").style("font-style", "italic");
		t.attr("dy", "-4");
		
		var tPath = t.append("textPath").attr("id", this.jdId + "_textpath");
		tPath.attr("xlink:href", "#" + this.jdId + "_path").attr("startOffset", "50%");
		if(this.text != null) tPath.text(this.text);
	}
	
	this.move = function(sPosition, ePosition){
		this.sPosition = sPosition; this.ePosition = ePosition;
		//var path = svg.select("#" + this.jdId);
		//path.attr("d", this.getD(this.sPosition, this.ePosition));
		
		//svg marker doese not work in IE browser, 
		//you are enable to get the the answer from stackoverflow
		var group = svg.select("#" + this.jdId);
		group.remove();
		this.show();
	}
	
	this.getD = function(sPosition, ePosition){
		var dx = ePosition.line.x - sPosition.line.x; var dy = ePosition.line.y - sPosition.line.y;
		var mx = sPosition.line.x + dx / 2; var my = sPosition.line.y + dy / 2;
		return "M" + sPosition.line.x + "," + sPosition.line.y +  " T" + mx + "," + my + " T" + ePosition.line.x + "," + ePosition.line.y;
	}
}

jDependency.JDLine = function(context, jdId, sPosition, ePosition, text){
	this.context = context;
	this.jdId = jdId;
	this.sPosition = sPosition;
	this.ePosition = ePosition;
	this.text = text;
	
	this.show = function(){
		var group = this.context.pg.append("g").attr("id", this.jdId);
		
		var line = group.append("line").attr("id", this.jdId + "_line");
		line.attr("x2", this.ePosition.line.x).attr("y2", this.ePosition.line.y);
		line.attr("x1", this.sPosition.line.x).attr("y1", this.sPosition.line.y);
		line.style("stroke", "gray").style("stroke-width", "1");
		line.style("stroke-dasharray", ("3, 3"));
	}
	
	this.move = function(sPosition, ePosition){
		this.sPosition = sPosition; this.ePosition = ePosition;
		var line = svg.select("#" + this.jdId + "_line");
		line.attr("x1", this.sPosition.line.x).attr("y1", this.sPosition.line.y);
		line.attr("x2", this.ePosition.line.x).attr("y2", this.ePosition.line.y);
	}	
}

//draw the line on the "bg" group
jDependency.JDUnderLine = function(context, jdId, sPosition, ePosition, text){
	this.context = context;
	this.jdId = jdId;
	this.sPosition = sPosition;
	this.ePosition = ePosition;
	this.text = text;
	
	this.show = function(){
		var group = this.context.bg.append("g").attr("id", this.jdId);
		
		var line = group.append("line").attr("id", this.jdId + "_line");
		line.attr("x1", this.sPosition.line.x).attr("y1", this.sPosition.line.y);
		line.attr("x2", this.ePosition.line.x).attr("y2", this.ePosition.line.y);
		line.style("stroke", "gray").style("stroke-width", "1");
		line.style("stroke-dasharray", ("3, 3"));
	}
	
	this.move = function(sPosition, ePosition){
		this.sPosition = sPosition; this.ePosition = ePosition;
		var line = svg.select("#" + this.jdId);
		line.attr("x1", this.sPosition.line.x).attr("y1", this.sPosition.line.y);
		line.attr("x2", this.ePosition.line.x).attr("y2", this.ePosition.line.y);
	}	
}

//the below item is base on the group object
jDependency.JDImage = function(context, jdId, group, position, id, src, type, tooltip){
	this.context = context;
	this.jdId = jdId;
	this.group = group;
	this.position = position;
	this.id = id;
	this.src = src;
	this.type = type;
	this.tooltip = tooltip;
	
	this.show = function(){
		var _self = this;
		
		var img = this.group.append("image");
		img.attr("id", this.jdId);
		img.attr("x", this.position.image.x).attr("y", this.position.image.y);
		img.attr("width", this.context.IMAGE_WIDTH).attr("height", this.context.IMAGE_HEIGHT);
		img.attr("xlink:href", this.src);
		img.on("dblclick", function(){
			window.imageOnclick(_self.context, _self.id, _self.type);
		})
		
		//attach the tooltip 
		if(this.tooltip){
			img.on("mouseenter", function(){
				img.style("cursor", "pointer");
				var tp_x = svg.event.pageX + 10;
				var tp_y = svg.event.pageY + 10;
				
				var tp = svg.select("body").append("div").attr("id", "div-tooltip").attr("class", "tooltip");
				var texts = _self.tooltip.split("<br>");
				for(var i=0;i<texts.length;i++) tp.append("span").style("display", "block").style("height", "15px").text(texts[i]);
				
				//text(tooltip);
				tp.style("left", tp_x + "px").style("top", tp_y + "px");
			});
			img.on("mousemove", function(){
				//console.log("event.pageX: " + PB.event.pageX + " | event.pageY: " + PB.event.pageY);
				var tp_x = svg.event.pageX + 10;
				var tp_y = svg.event.pageY + 10;
				
				var tp = svg.select("#div-tooltip");
				tp.style("left", tp_x + "px").style("top", tp_y + "px");
			});
			img.on("mouseout", function(){
				//console.log("mouse out!");
				var tp = svg.select("#div-tooltip");
				tp.remove();
			});
		}
	}
	
	this.move = function(position){
		this.position = position;
		var img = svg.select("#" + this.jdId);
		img.attr("x", this.position.image.x).attr("y", this.position.image.y);
	}
}

jDependency.JDText = function(context, jdId, group, position, label, xlink){
	this.context = context;
	this.jdId = jdId;
	this.group = group;
	this.position = position;
	this.label = label;
	this.xlink = xlink;
	
	this.show = function(){
		var _self = this; var LABEL_LENGTH = 8;
		
		var t = this.group.append("text");
		t.attr("id", this.jdId);
		t.attr("x", this.position.text.x).attr("y", this.position.text.y);
		
		t.attr("width", this.context.TEXT_WIDTH).attr("height", this.context.TEXT_HEIGHT);
		t.style("font-family", "Arial").style("font-size", "8.5pt").style("weight", "bold");
		
		//show the text label with tooltip
		var tLabel = this.label;
		if(tLabel.length > LABEL_LENGTH) {
			tLabel = tLabel.substring(0, LABEL_LENGTH) + "_...";
			t.on("mouseenter", function(){
				t.style("cursor", "pointer");
				var tp_x = svg.event.pageX + 10;
				var tp_y = svg.event.pageY + 10;
				
				var tp = svg.select("body").append("div").attr("id", "div-tooltip").attr("class", "tooltip");
				tp.append("span").style("display", "block").style("height", "15px").text(_self.label);
				
				//text(tooltip);
				tp.style("left", tp_x + "px").style("top", tp_y + "px");
			});
			t.on("mousemove", function(){
				//console.log("event.pageX: " + PB.event.pageX + " | event.pageY: " + PB.event.pageY);
				var tp_x = svg.event.pageX + 10;
				var tp_y = svg.event.pageY + 10;
				
				var tp = svg.select("#div-tooltip");
				tp.style("left", tp_x + "px").style("top", tp_y + "px");
			});
			t.on("mouseout", function(){
				//console.log("mouse out!");
				var tp = svg.select("#div-tooltip");
				tp.remove();
			});		
		}
		t.text(tLabel + " ");
		
		//show the xlink
		if(this.label && this.label != ""){
			var a = t.append("a");
			a.attr("xlink:href", "javascript:void(0)").text("(" + this.xlink + ")");
			a.on("click", function(){
				window.textOnclick(_self.context, _self.xlink);
			})
		}
	}
	
	this.move = function(position){
		this.position = position;
		var t = svg.select("#" + this.jdId);
		t.attr("x", this.position.text.x).attr("y", this.position.text.y);
	}
}