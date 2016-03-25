

function JDCanvas(context, data){
	this.context = context;
	this.data = data;
	
	this.show = function(){
		var cxOffset = 3; var cyOffset = 1;
		
		//get center position
		var center = this.getCenter();
		var cPosition = new JDPosition(this.context, center.cx, center.cy);
		
		//show the item and sub items at firstChild
		//show item
		var item = this.data.item;
		var jdDiagram = new JDDiagram(this.context, cPosition, "c", item.type, item.status, item.id);
		jdDiagram.show();
		
		//show subitems
		var subItems = this.data.subItems;
		for(var i=0;i<subItems.length;i++){
			var subItem = subItems[i];
			
			//get subitem's position
			var scx = cPosition.cx + cxOffset;
			var scy = cPosition.cy - cyOffset + i;
			var sPosition = new JDPosition(this.context, scx, scy);
			
			var jdSubDiagram = new JDDiagram(this.context, sPosition, "s" + i, subItem.type, subItem.status, subItem.id);
			this.showDiagram(this.context, jdDiagram, jdSubDiagram);
		}
		
		//show the dependency
		var dependency = this.data.dependency;
		if(dependency != null){
			var dcx = cPosition.cx - cxOffset;
			var dcy = cPosition.cy;
			var dPosition = new JDPosition(this.context, dcx, dcy);
			
			var jdDependency = new JDDependency(this.context, dPosition, "p", dependency, jdDiagram);
			jdDependency.show();
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
	
	this.showDiagram = function(context, jdStartDiagram, jdEndDiagram){
		//show line at first
		var sPosition = jdStartDiagram.position.getCenterPosition();
		var ePosition = jdEndDiagram.position.getCenterPosition();
		
		var jdLineId = jdStartDiagram.id + "-" + jdEndDiagram.id;
		var jdLine = new JDPathLine(context, sPosition.x, sPosition.y, ePosition.x, ePosition.y, jdLineId);
		jdLine.show();
		
		jdStartDiagram.outLines.push(jdLine);
		jdEndDiagram.inLines.push(jdLine);
		
		//show diagram
		jdEndDiagram.show();
	}
	
	this.showExcel = function(){
		//draw vertical line
		for(var i=0;i<=this.context.xCount;i++){
			var x1 = i * this.context.xUnit;
			var y1 = 0;
			
			var x2 = i * this.context.xUnit;
			var y2 = this.context.H;
			
			var jdDashLine = new JDLine(this.context, x1, y1, x2, y2, "dash");
			jdDashLine.show();
		}
		
		//draw horizontal line
		for(var i=0;i<=this.context.yCount;i++){
			var x1 = 0;
			var y1 = i * this.context.yUnit;
			
			var x2 = this.context.W;
			var y2 = i * this.context.yUnit;
			
			var jdDashLine = new JDLine(this.context, x1, y1, x2, y2, "dash");
			jdDashLine.show();
		}
	}
	
	this.getCenter = function(){
		var cx = Math.floor(this.context.xCount / 2);
		var cy = Math.floor(this.context.yCount / 3);
		return {cx: cx, cy: cy};
	}
}

function JDDependency(context, position, id, dependency, jdParentDiagram){
	this.context = context;
	this.position = position;
	this.id = id;
	this.dependency = dependency;
	this.jdParentDiagram = jdParentDiagram;
	
	this.show = function(){
		this.showDependency(this.context, this.position, this.id, this.dependency, this.jdParentDiagram);
	}
	
	this.showDependency = function(context, position, id, dependency, jdParentDiagram){
		var cxOffset = 2; var cyOffset = 1;
		
		var type = dependency.type;
		if(type != null){
			if(type == "and" || type == "or"){
				var andOrId = id;
				var jdAndOrDiagram = new JDDiagram(context, position, andOrId, dependency.type);
				this.showDiagram(context, jdAndOrDiagram, jdParentDiagram);
				
				var items = dependency.items;
				if(items != null){
					for(var i=0;i<items.length;i++){
						var icx = position.cx - cxOffset;
						var icy = position.cy - cyOffset + i;
						var iPosition = new JDPosition(context, icx, icy);
						
						var itemId = andOrId + "_" + i;
						this.showDependency(context, iPosition, itemId, items[i], jdAndOrDiagram);
					}
				}
			}else{
				var jdId = id;
				var jdDiagram = new JDDiagram(context, position, jdId, dependency.type, dependency.status, dependency.id);
				this.showDiagram(context, jdDiagram, jdParentDiagram, dependency.condition);
			}
		}
	}
	
	this.showDiagram = function(context, jdStartDiagram, jdEndDiagram, condition){
		//show line at first
		var sPosition = jdStartDiagram.position.getCenterPosition();
		var ePosition = jdEndDiagram.position.getCenterPosition();
		
		var jdLineId = jdStartDiagram.id + "-" + jdEndDiagram.id;
		var jdLine = new JDPathLine(context, sPosition.x, sPosition.y, ePosition.x, ePosition.y, jdLineId, condition);
		jdLine.show();	
		
		jdStartDiagram.outLines.push(jdLine);
		jdEndDiagram.inLines.push(jdLine);
		
		//show diagram
		jdStartDiagram.show();
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
	
	this.W = this.xUnit * this.xCount;
	this.H = this.yUnit * this.yCount;

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

function JDPosition(context, cx, cy){
	this.context = context;
	this.cx = cx;
	this.cy = cy;
	this.x = cx * context.xUnit;
	this.y = cy * context.yUnit;
	
	this.getCenterPosition = function(){
		var x = this.x + this.context.xUnit / 2;
		var y = (this.y + this.context.TEXT_HEIGHT ) + this.context.IMAGE_HEIGHT / 2;	
		return {x: x, y: y};
	}
}
function imageOnclick(context){
	console.log(context);
}
