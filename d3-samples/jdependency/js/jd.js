


function JDCanvas(context, data){
	this.context = context;
	this.data = data;
	
	this.show = function(){
		var cxOffset = 3; var cyOffset = 1;
		
		//get center position
		var center = this.getCenterPosition();
		var cPosition = new JDPosition(this.context, center.x, center.y);
		
		//show the item and sub items at firstChild
		//show item
		var item = this.data.item;
		var jdDiagram = new JDDiagram(this.context, cPosition, "c", item.type, item.status, item.id);
		jdDiagram.show();
		
		//show subitems
		var subItems = this.data.subItems;
		for(var i=0;i<subItems.length;i++){
			var sx = cPosition.x + (cxOffset * this.context.xUnit);
			var sy = cPosition.y - (cyOffset + i) * this.context.yUnit;
			var sPosition = new JDPosition(this.context, sx, sy);
			
			var jdSubItem = new JDSubItem(this.context, sPosition, "s" + i, subItems[i], jdDiagram);
			jdSubItem.show();
		}
		
		//show the parents
		var parentItem = this.data.parentItem;
		if(parentItem != null){
			var dx = cPosition.x - cxOffset * this.context.xUnit;
			var dy = cPosition.y;
			var dPosition = new JDPosition(this.context, dx, dy);
			
			var jdParentItem = new JDParentItem(this.context, dPosition, "p", parentItem, jdDiagram);
			jdParentItem.show();
		}
		
		//show the excel or not
		if(this.context.showExcel == true) this.showExcel();
	}
	
	this.hideDependencies = function(){
		var paths = svg.selectAll("path")[0];
		for(var i=0;i<paths.length;i++){
			var pathId = paths[i].id;
			if(pathId){
				var p = svg.select("#" + pathId);
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
			var x1 = i * this.context.xUnit;
			var y1 = 0;
			
			var x2 = i * this.context.xUnit;
			var y2 = this.context.yCount * this.context.yUnit;
			
			var sPosition = new JDPosition(this.context, x1, y1);
			var ePosition = new JDPosition(this.context, x2, y2);
			
			var jdDashLine = new JDLine(this.context, sPosition, ePosition, "vl", "dash");
			jdDashLine.show();
		}
		
		//draw horizontal line
		for(var i=0;i<=this.context.yCount;i++){
			var x1 = 0;
			var y1 = i * this.context.yUnit;
			
			var x2 = this.context.xCount * this.context.xUnit;
			var y2 = i * this.context.yUnit;
			
			var sPosition = new JDPosition(this.context, x1, y1);
			var ePosition = new JDPosition(this.context, x2, y2);
			
			var jdDashLine = new JDLine(this.context, sPosition, ePosition, "hl", "dash");
			jdDashLine.show();
		}
	}
	
	this.getCenterPosition = function(){
		var cx = Math.floor(this.context.xCount / 2);
		var cy = Math.floor(this.context.yCount / 2);
		
		var x = cx * this.context.xUnit;
		var y = cy * this.context.yUnit;
		return {x: x, y: y};
	}
}


function JDSubItem(context, position, id, item, jdParentDiagram){
	this.context = context;
	this.position = position;
	this.id = id;
	this.item = item;
	this.jdParentDiagram = jdParentDiagram;
	
	this.show = function(){
		var jdSubDiagram = new JDDiagram(this.context, this.position, this.id, this.item.type, this.item.status, this.item.id);
		var jdDependency = new JDDependency(context,  this.jdParentDiagram, jdSubDiagram);
		
		jdDependency.show();
		jdSubDiagram.show();
	}
	
}

function JDDependency(context, jdStartDiagram, jdEndDiagram, condition){
	this.context = context;
	this.jdStartDiagram = jdStartDiagram;
	this.jdEndDiagram = jdEndDiagram;
	this.condition = condition;
	
	this.show = function(){
		//show line at first
		var sPosition = this.jdStartDiagram.position.getCenter();
		var ePosition = this.jdEndDiagram.position.getCenter();
		
		var jdLineId = this.jdStartDiagram.id + "-" + this.jdEndDiagram.id;
		var jdLine = new JDPathLine(this.context, sPosition, ePosition, jdLineId, this.condition);
		jdLine.show();
		
		this.jdStartDiagram.outLines.push(jdLine);
		this.jdEndDiagram.inLines.push(jdLine);
	}		
}

function JDParentItem(context, position, id, item, jdParentDiagram){
	this.context = context;
	this.position = position;
	this.id = id;
	this.item = item;
	this.jdParentDiagram = jdParentDiagram;
	var jdLayer = new JDLayer(context);
	
	this.show = function(){
		this.showItem(this.context, this.position, this.id, this.item, this.jdParentDiagram);
		jdLayer.settingPosition();
	}
	
	this.showItem = function(context, position, id, item, jdParentDiagram){
		var cxOffset = 2; var cyOffset = 1;
		
		var itemType = item.type;
		if(itemType != null){
			if(itemType == "and" || itemType == "or"){
				var andOrId = id;
				var jdAndOrDiagram = new JDDiagram(context, position, andOrId, itemType);
				var jdDependency = new JDDependency(context, jdAndOrDiagram, jdParentDiagram);
				
				jdDependency.show();
				jdAndOrDiagram.show();
				
				//add the item into the layer
				jdLayer.addItem(position, jdAndOrDiagram);
				
				var items = item.items;
				if(items != null){
					for(var i=0;i<items.length;i++){
						var ix = position.x - cxOffset * context.xUnit;
						var iy = position.y - (cyOffset + i) * context.yUnit;
						var iPosition = new JDPosition(context, ix, iy);
						
						var itemId = andOrId + "_" + i;
						this.showItem(context, iPosition, itemId, items[i], jdAndOrDiagram);
					}
				}
			}else{
				var jdDiagram = new JDDiagram(context, position, id, itemType, item.status, item.id);
				var jdDependency = new JDDependency(context, jdDiagram, jdParentDiagram, item.condition);
				
				jdDependency.show();
				jdDiagram.show();
				
				//add the item into the layer
				jdLayer.addItem(position, jdDiagram);
			}
		}
	}
}



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


var svg = rave;

function JDContext(container, urlContext, showExcel=false){
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
	this.showExcel = showExcel;

	//the diagram's width & height
	this.TEXT_WIDTH = 16;
	this.TEXT_HEIGHT = 16;
	
	this.IMAGE_WIDTH = 32;
	this.IMAGE_HEIGHT = 32;
	
	this.xUnit = this.IMAGE_WIDTH;
	this.yUnit = this.TEXT_HEIGHT + this.IMAGE_HEIGHT;

	this.xCount = Math.floor(this.w / this.xUnit);
	this.yCount = Math.floor(this.h / this.yUnit);
	
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
}

function JDPosition(context, x, y){
	this.context = context;
	this.x = x;
	this.y = y;
	
	this.getCell = function(){
		var cx = this.x / this.context.xUnit;
		var cy = this.y / this.context.yUnit;
		return {cx: cx, cy: cy};	
	}
	
	this.getCenter = function(){
		var x = this.x + this.context.xUnit / 2;
		var y = (this.y + this.context.TEXT_HEIGHT ) + this.context.IMAGE_HEIGHT / 2;	
		return {x: x, y: y};
	}
	
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

function JDLayer(context){
	this.context = context;
	this.records = [];
	
	this.addItem = function(position, item){
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
	
	this.settingPosition = function(){
		//re-setting the position of the item base on the size of canvas
		//but, the principle is to let the diagram visible!
		//so, if there has not enought cells to fit for these items, resize the canvas!
		//the other solution is to resize the diagram's width/height, but is lower.
		//console.log(this.context.yCount + "|" + this.items.length);
		
		for(var i=0;i<this.records.length;i++){
			var record = this.records[i];
			var rPosition = record.position;
			var rItems = record.items;
			
			var step = Math.floor(this.context.yCount / rItems.length);
			for(var j=0;j<rItems.length;j++){
				//the cx not be change, only focus on the cy
				var cy = Math.floor(step * (j + 1) - (step / 2));
				var y = cy * this.context.yUnit;
	
				var position = new JDPosition(this.context, rPosition.x, y);
				rItems[j].move(position);
			}
		}
	}
}
function imageOnclick(context){
	console.log(context);
}
