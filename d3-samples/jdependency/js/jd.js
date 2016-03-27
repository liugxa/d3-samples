
function JDCanvas(context, data){
	this.context = context;
	this.data = data;
	
	this.show = function(){
		var cxOffset = 3; var cyOffset = 1;
		
		//get center position
		var cPosition = new JDPosition(this.context, this.context.center.x, cyOffset * this.context.yUnit);
		
		//show the item and sub items at firstChild
		//show item
		var item = this.data.item;
		var jdDiagram = new JDDiagram(this.context, "c", cPosition, item.type, item.status, item.id);
		jdDiagram.show();
		
		//show subitems
		var subItems = this.data.subItems;
		if(subItems != null){
			var sx = cPosition.x + cxOffset * this.context.xUnit;
			var sy = cyOffset * this.context.yUnit;
			var sPosition = new JDPosition(this.context, sx, sy);
			
			var jdSubItem = new JDSubItems(this.context, "s", sPosition, subItems, jdDiagram);
			jdSubItem.show();
		}
		
		//show the parents
		var parentItem = this.data.parentItem;
		if(parentItem != null){
			var dx = cPosition.x - cxOffset * this.context.xUnit;
			var dy = cyOffset * this.context.yUnit;
			var dPosition = new JDPosition(this.context, dx, dy);
			
			var jdParentItem = new JDParentItem(this.context, "p", dPosition, parentItem, jdDiagram);
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
			var x1 = i * this.context.xUnit; var y1 = 0;
			var x2 = i * this.context.xUnit; var y2 = this.context.yCount * this.context.yUnit;
			
			var sPosition = new JDPosition(this.context, x1, y1);
			var ePosition = new JDPosition(this.context, x2, y2);
			
			var jdDashLine = new JDLine(this.context, "v_" + i, sPosition, ePosition, "", "dash");
			jdDashLine.show();
		}
		
		//draw horizontal line
		for(var i=0;i<=this.context.yCount;i++){
			var x1 = 0; var y1 = i * this.context.yUnit;
			var x2 = this.context.xCount * this.context.xUnit; var y2 = i * this.context.yUnit;
			
			var sPosition = new JDPosition(this.context, x1, y1);
			var ePosition = new JDPosition(this.context, x2, y2);
			
			var jdDashLine = new JDLine(this.context, "h_" + i, sPosition, ePosition, "", "dash");
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
		if(this.items != null){
			for(var i=0;i<this.items.length;i++){
				var item = items[i];
				//get item position
				var itemId = "s" + i;
				var iPosition = this.getItemPosition(this.context, this.position, i);
				
				var jdDiagram = new JDDiagram(this.context, itemId, iPosition, item.type, item.status, item.id);
				var jdDependency = new JDDependency(this.context, jdDiagram, this.parentDiagram);	
				
				jdDependency.show();
				jdDiagram.show();				
				
			}
		}
	}
	
	this.getItemPosition = function(context, position, index){
		var xOffset = Math.floor(index / this.context.yCount);
		var yOffset = index % this.context.yCount;
		
		var x = position.x + xOffset  * context.xUnit;
		var y = yOffset * context.yUnit;
		
		return new JDPosition(context, x, y);
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
		var cxOffset = 2; var cyOffset = 1;
		
		if(this.item.items != null && this.item.items.length > 1){
			var jdAndOrId = this.jdId;
			var jdAndOrDiagram = new JDDiagram(this.context, jdAndOrId, this.position, this.item.type);
			var jdDependency = new JDDependency(this.context, jdAndOrDiagram, this.parentDiagram, this.item.dependency);
			
			//show it directly
			jdDependency.show();
			jdAndOrDiagram.show();
			
			//show all of the items
			var items = this.item.items;
			if(items != null){
				for(var i=0;i<items.length;i++){
					var item = items[i];
					//get item position
					var itemId = jdAndOrId + "_" + i;
					var iPosition = this.getItemPosition(this.context, this.position, i);
					var jdDiagram = new JDDiagram(this.context, itemId, iPosition, item.type, item.status, item.id);
					var jdDependency = new JDDependency(this.context, jdDiagram, jdAndOrDiagram);
					
					//show it directly!
					jdDependency.show();
					jdDiagram.show();
				}
			}
		}else{
			var itemId = this.jdId;
			var jdDiagram = new JDDiagram(this.context, itemId, this.position, this.item.type, this.item.status, this.item.id);
			var jdDependency = new JDDependency(this.context, jdDiagram, this.parentDiagram, this.item.dependency);
			
			//show it directly!
			jdDependency.show();
			jdDiagram.show();
		}
	}
	
	this.getItemPosition = function(context, position, index){
		var xOffset = Math.floor(index / this.context.yCount);
		var yOffset = index % this.context.yCount;
		
		var x = position.x - (xOffset + 2) * context.xUnit;
		var y = yOffset * context.yUnit;
		
		return new JDPosition(context, x, y);
	}
} 


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
	this.text.y = this.y + this.context.TEXT_HEIGHT;
	
	this.image = {};
	this.image.x = this.x;
	this.image.y = this.y + this.context.TEXT_HEIGHT;
	
	this.equals = function(position){
		var r = false;
		if(position.x == this.x && position.y == this.y) r = true;
		return r;
	}
}
function imageOnclick(context){
	console.log(context);
}
