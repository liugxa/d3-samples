
function JDCanvas(context, data){
	this.context = context;
	this.data = data;
	
	this.show = function(){
		var cxOffset = 2; var cyOffset = 0;
		
		//get center position
		var cPosition = new JDPosition(this.context, this.context.center.x, cyOffset * this.context.yUnit);
		
		//show the item and sub items at firstChild
		//show item
		var item = this.data.item;
		var jdDiagram = new JDDiagram(this.context, "c", cPosition, item);
		jdDiagram.show();
		
		//show subitems
		var subItems = this.data.subItems;
		if(subItems != null){
			var sx = cPosition.x + (cxOffset + 1) * this.context.xUnit;
			var sy = cyOffset * this.context.yUnit;
			var sPosition = new JDPosition(this.context, sx, sy);
			
			var jdSubItem = new JDSubItems(this.context, "s", sPosition, subItems, jdDiagram);
			jdSubItem.show();
		}
		
		//show the parents
		var parentItem = this.data.parentItem;
		if(parentItem != null){
			var dx = cPosition.x - (cxOffset + 1) * this.context.xUnit;
			var dy = cyOffset * this.context.yUnit;
			var dPosition = new JDPosition(this.context, dx, dy);
			
			var jdParentItem = new JDParentItem(this.context, "p", dPosition, parentItem, jdDiagram);
			jdParentItem.show();
		}
		
		//show the excel or not
		if(this.context.showExcel == true) this.showExcel();
		
		//re-sort the matirx
		this.context.matrix.sort();
	}
	
	this.hideDependencies = function(){
		var paths = svg.selectAll("path")[0];
		for(var i=0;i<paths.length;i++){
			if(paths[i].id){
				var pId = paths[i].id.substring(0, paths[i].id.indexOf("_path"));
				var p = svg.select("#" + pId + "_textpath");
				var d = p.style("display");
				if(d != "none"){
					p.style("display", "none");
				}else{
					p.style("display", "block");
				}
			}
		}
	}
	
	this.showExcel = function(){
		//draw vertical line
		for(var i=0;i<=this.context.xCount;i++){
			var x1 = i * this.context.xUnit; var y1 = 0;
			var x2 = i * this.context.xUnit; var y2 = this.context.yCount * this.context.yUnit;
			
			var sPosition = new JDPosition(this.context, x1, y1);
			var ePosition = new JDPosition(this.context, x2, y2);
			
			var jdDashLine = new JDLine(this.context, "x_" + i, sPosition, ePosition, "", "dash");
			jdDashLine.show();
		}
		
		//draw horizontal line
		for(var i=0;i<=this.context.yCount;i++){
			var x1 = 0; var y1 = i * this.context.yUnit;
			var x2 = this.context.xCount * this.context.xUnit; var y2 = i * this.context.yUnit;
			
			var sPosition = new JDPosition(this.context, x1, y1);
			var ePosition = new JDPosition(this.context, x2, y2);
			
			var jdDashLine = new JDLine(this.context, "y_" + i, sPosition, ePosition, "", "dash");
			jdDashLine.show();
		}
	}
}


function JDSubItems(context, jdId, position, items, parentDiagram){
	this.context = context;
	this.jdId = jdId;
	this.position = position;
	this.items = items;
	this.parentDiagram = parentDiagram;
	
	this.show = function(){
		var cxOffset = 1; var cyOffset = 1;
	
		if(this.items != null){
			for(var i=0;i<this.items.length;i++){
				var item = items[i];
				//get item position
				var itemId = this.jdId + "_" + i;
				var ix = this.position.x; 
				var iy = this.position.y + i * cyOffset * this.context.yUnit;
				var iPosition = new JDPosition(this.context, ix, iy);
				
				var jdDiagram = new JDDiagram(this.context, itemId, iPosition, item);
				var jdDependency = new JDDependency(this.context, this.parentDiagram, jdDiagram);	
				
				jdDependency.show();
				jdDiagram.show();				
				
			}
		}
	}
}

function JDDependency(context, sDiagram, eDiagram, label){
	this.context = context;
	this.jdLineId = sDiagram.jdId + "-" + eDiagram.jdId;
	this.sDiagram = sDiagram;
	this.eDiagram = eDiagram;
	this.label = label;
	
	this.show = function(){
		//show line at first
		var sPosition = this.sDiagram.position;
		var ePosition = this.eDiagram.position;
		
		var jdLine = new JDPathLine(this.context, this.jdLineId, sPosition, ePosition, this.label);
		jdLine.show();
		
		this.sDiagram.outLines.push(jdLine);
		this.eDiagram.inLines.push(jdLine);			
	}
}

function JDParentItem(context, jdId, position, item, parentDiagram){
	this.context = context;
	this.jdId = jdId;
	this.position = position;
	this.item = item;
	this.parentDiagram = parentDiagram;
	
	this.show = function(){
		this.showItem(this.context, this.jdId, this.position, this.item, this.parentDiagram);
	}
	
	this.showItem = function(context, jdId, position, item, parentDiagram){
		var cxOffset = 1; var cyOffset = 1;
		
		if(item.type != null){
			if(item.type == "and" || item.type == "or"){
				var jdAndOrId = jdId;
				var jdAndOrDiagram = new JDDiagram(context, jdAndOrId, position, item);
				var jdDependency = new JDDependency(context, jdAndOrDiagram, parentDiagram);
				
				//show it directly
				jdDependency.show();
				jdAndOrDiagram.show();
				
				//add the diagram into the matrix
				context.matrix.add(position, jdAndOrDiagram);

				//show all of the items
				var items = item.items;
				if(items != null){
					for(var i=0;i<items.length;i++){
						var itemId = jdAndOrId + "_" + i;
						var ix = position.x - (cxOffset + 1) * context.xUnit; 
						var iy = position.y + (i * cyOffset) * context.yUnit;
						var iPosition = new JDPosition(context, ix, iy);
						this.showItem(context, itemId, iPosition, items[i], jdAndOrDiagram);
					}
				}
			}else{
				var jdDiagram = new JDDiagram(context, jdId, position, item);
				var jdDependency = new JDDependency(context, jdDiagram, parentDiagram, item.condition);
				
				//show it directly!
				jdDependency.show();
				jdDiagram.show();
				
				//add the diagram into the matrix
				context.matrix.add(position, jdDiagram);
			}
		}
	}
} 


function JDDiagram(context, jdId, position, item){
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
		var jdText = (this.item.type != "and" && this.item.type != "or") ? (this.item.name + "(" + this.item.id + ")") : "";
		this.jdText = new JDText(this.context, jdTextId, group, this.position, jdText);
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

function JDPathLine(context, jdId, sPosition, ePosition, text, style){
	this.context = context;
	this.jdId = jdId;
	this.sPosition = sPosition;
	this.ePosition = ePosition;
	this.text = text;
	this.style = style;
	
	this.show = function(){
		this.style = (this.style) ? this.style: "dash";
		//var group = this.context.svg.append("g").attr("id", this.jdId);
		var group = this.context.pg.append("g").attr("id", this.jdId);
		
		var path = group.append("path").attr("id", this.jdId + "_path");
		path.attr("d", this.getD(this.sPosition, this.ePosition));
		path.attr("style", "stroke: black").attr("marker-mid","url(#arrow)");
		
		//the line style. By default, showing dash line
		if(this.style == "dash") path.style("stroke-dasharray", ("3, 3"));
		
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
		var dx = ePosition.center.x - sPosition.center.x; var dy = ePosition.center.y - sPosition.center.y;
		var mx = sPosition.center.x + dx / 2; var my = sPosition.center.y + dy / 2;
		return "M" + sPosition.center.x + "," + sPosition.center.y +  " T" + mx + "," + my + " T" + ePosition.center.x + "," + ePosition.center.y;
	}
}

function JDLine(context, jdId, sPosition, ePosition, text, style){
	this.context = context;
	this.jdId = jdId;
	this.sPosition = sPosition;
	this.ePosition = ePosition;
	this.text = text;
	this.style = style;
	
	this.show = function(){
		this.style = (this.style) ? this.style: "dash";
		var group = this.context.bg.append("g").attr("id", this.jdId);
		
		var line = group.append("line").attr("id", this.jdId + "_line");
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
function JDImage(context, jdId, group, position, id, src, type, tooltip){
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

function JDText(context, jdId, group, position, text){
	this.context = context;
	this.jdId = jdId;
	this.group = group;
	this.position = position;
	this.text = text;
	
	this.show = function(){
		var _self = this;
		var t = this.group.append("text");
		t.attr("id", this.jdId);
		t.attr("x", this.position.text.x).attr("y", this.position.text.y);
		
		t.attr("width", this.context.TEXT_WIDTH).attr("height", this.context.TEXT_HEIGHT);
		t.style("font-family", "Arial").style("font-size", "8.5pt").style("weight", "bold");
		t.text(this.text);
		
		t.style("cursor", "pointer").on("click", function(){
			var params = _self.text.substring(_self.text.indexOf('(') + 1, _self.text.indexOf(')'));
			window.textOnclick(_self.context, params);
		})
	}
	
	this.move = function(position){
		this.position = position;
		var t = svg.select("#" + this.jdId);
		t.attr("x", this.position.text.x).attr("y", this.position.text.y);
	}
}
var svg = rave;

function JDContext(container, urlContext, showExcel, i18n){
	this.container = svg.select(container);
	this.urlContext = urlContext;
	
	this.width = this.container.style("width");
	this.height = this.container.style("height");
	
	this.w = parseInt(this.width);
	this.h = parseInt(this.height);
	
	this.svg = this.container.append("svg");
	this.svg.attr("width", this.w);
	this.svg.attr("height", this.h);
	
	//show the excel background
	this.showExcel = false;
	if(showExcel && showExcel == true) this.showExcel = true;
	
	/* i18n messages */	
	this.i18n = (i18n != null) ? i18n: new JDI18n();
	
	//the diagram's width & height
	this.TEXT_WIDTH = 16;
	this.TEXT_HEIGHT = 16;
	
	this.IMAGE_WIDTH = 32;
	this.IMAGE_HEIGHT = 32;
	
	this.xUnit = this.IMAGE_WIDTH;
	this.yUnit = this.TEXT_HEIGHT + this.IMAGE_HEIGHT;

	this.xCount = Math.floor(this.w / this.xUnit);
	this.yCount = Math.floor(this.h / this.yUnit);
	
	this.center = {};
	this.center.x = Math.floor(this.xCount / 2) * this.xUnit;
	this.center.y = Math.floor(this.yCount / 2) * this.yUnit;
	
	//create the maker
	var defs = this.svg.append("defs");
	var marker = defs.append("marker")
		.attr("id","arrow")
		.attr("markerUnits","strokeWidth")
		.attr("markerWidth","12")
		.attr("markerHeight","12")
		.attr("viewBox","0 0 12 12")
		.attr("refX","6")
		.attr("refY","6")
		.attr("orient","auto");
	var arrow_path = "M2,2 L10,6 L2,10 L6,6 L2,2";	
	marker.append("path").attr("d", arrow_path).attr("fill", "#000000;");
	
	//create path group
	this.pg = this.svg.append("g");
	this.pg.attr("id", "pg");
	
	//create diagram group
	this.dg = this.svg.append("g");
	this.dg.attr("id", "dg");
	
	//create background group
	this.bg = this.svg.append("g");
	this.bg.attr("id", "bg");
	
	this.matrix = new JDMatrix(this);
}

function JDPosition(context, x, y){
	this.context = context;
	this.x = x;
	this.y = y;
	
	this.center = {};
	this.center.x = this.x + this.context.xUnit / 2;
	this.center.y = (this.y + this.context.TEXT_HEIGHT ) + this.context.IMAGE_HEIGHT / 2;
	
	this.text = {};
	this.text.x = this.x;
	this.text.y = this.y + this.context.TEXT_HEIGHT / 2 + this.context.TEXT_HEIGHT / 3;
	
	this.image = {};
	this.image.x = this.x;
	this.image.y = this.y + this.context.TEXT_HEIGHT;
	
	this.equals = function(position){
		var r = false;
		if(position.x == this.x && position.y == this.y) r = true;
		return r;
	}
}

function JDRecord(){
	this.position;
	this.items = [];
}

function JDMatrix(context){
	this.context = context;
	this.records = [];
	
	this.add = function(position, item){
		var record = null;
		for(var i=0;i<this.records.length;i++){
			var r = this.records[i];
			var rItems = r.items;
			for(var j=0;j<rItems.length;j++){
				var rItem = rItems[j];
				if(rItem != null && rItem.position.x == position.x){
					record = r;
					break;
				}
			}
		}
		
		if(record != null){
			record.items.push(item);
		}else{
			record = new JDRecord();
			record.position = position;
			record.items.push(item);
			this.records.push(record);
		}
	}
	
	this.sort = function(){
		//re-setting the position of the item base on the size of canvas
		//but, the principle is to let the diagram visible!
		//so, if there has not enought cells to fit for these items, resize the canvas!
		//the other solution is to resize the diagram's width/height, but is lower.
		//console.log(this.context.yCount + "|" + this.items.length);
		for(var i=0;i<this.records.length;i++){
			var record = this.records[i];
			var rPosition = record.position;
			var rItems = record.items;
			
			var step = (this.context.yCount * this.context.yUnit) / rItems.length;
			for(var j=0;j<rItems.length;j++){
				//the cx not be change, only focus on the cy
				var y = step * j;
				var position = new JDPosition(this.context, rPosition.x, y);
				rItems[j].move(position);
			}
		}
	}
}

function JDI18n(){
	this.get = function(name){
		var r = {
			"job.status.pending": "Pending",
			"job.status.running": "Running",
			"job.status.done": "Done",
			"job.status.exited": "Exited",
			"job.status.suspended": "Suspended",
			"job.status.waiting": "Waiting",
			"job.status.onhold": "On Hold",
		}
		return r[name];
	}
}
function imageOnclick(context, id, type){
	console.log("image on click! id:" + id, ", type:" + type);
}

function textOnclick(context, id){
	console.log("text on click! id:" + id);
}
