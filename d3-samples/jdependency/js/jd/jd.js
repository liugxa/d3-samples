var svg = rave;

function JDContext(container, urlContext, showExcel){
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
	this.showExcel = (showExcel != true) ? false : true;

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
	
	this.getCenterPosition = function(){
		//the center position
		var x = Math.floor(this.xCount / 2);
		var y = Math.floor(this.yCount / 3);
		return {x: x, y:y};
	}
}

function JDCanvas(context, dependencies){
	this.context = context;
	this.dependencies = dependencies;
	
	this.show = function(){
		var xOffset = 3; var yOffset = 1;
		
		//register myself into the context
		//this.context.canvas = this;
		var position = this.context.getCenterPosition();
		
		//show the item and sub items at firstChild
		//show item
		var item = this.dependencies.item;
		var jdDiagram = new JDDiagram(this.context, position.x, position.y, "c", item);
		jdDiagram.show();
		
		//show sub items
		var sx = position.x + xOffset;
		var sy = position.y - yOffset;
		var subItems = this.dependencies.subItems;
		for(var i=0;i<subItems.length;i++){
			var jdSubDiagram = new JDDiagram(this.context, sx, sy + i, "s" + i, subItems[i]);
			this.showDiagram(this.context, jdDiagram, jdSubDiagram);
		}
		
		//show the dependency
		var dx = position.x - xOffset;
		var dy = position.y;
		var dependency = this.dependencies.dependency;
		var jdDependency = new JDDependency(this.context, dx, dy, "d", dependency, jdDiagram);
		jdDependency.show();
		
		//show the excel or not
		if(this.context.showExcel == true) this.showExcel();
	}
	
	this.showDiagram = function(context, jdStartDiagram, jdEndDiagram){
		//show line at first
		var sPosition = jdStartDiagram.getCenterPosition();
		var ePosition = jdEndDiagram.getCenterPosition();
		
		var jdLineId = jdStartDiagram.id + "_" + jdEndDiagram.id;
		var jdLine = new JDLine(context, sPosition.x, sPosition.y, ePosition.x, ePosition.y, jdLineId);
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
			
			var jdDashLine = new JDDashLine(this.context, x1, y1, x2, y2);
			jdDashLine.show();
		}
		
		//draw horizontal line
		for(var i=0;i<=this.context.yCount;i++){
			var x1 = 0;
			var y1 = i * this.context.yUnit;
			
			var x2 = this.context.W;
			var y2 = i * this.context.yUnit;
			
			var jdDashLine = new JDDashLine(this.context, x1, y1, x2, y2);
			jdDashLine.show();
		}
	}
}
	
function JDDependency(context, cx, cy, id, dependency, jdParentDiagram){
	this.context = context;
	this.cx = cx; 
	this.cy = cy;
	this.id = id;
	this.dependency = dependency;
	this.jdParentDiagram = jdParentDiagram;
	
	this.show = function(){
		this.showDependency(this.cx, this.cy, this.id, this.dependency, this.jdParentDiagram);
	}
	
	this.showDiagram = function(context, jdStartDiagram, jdEndDiagram){
		//show line at first
		var sPosition = jdStartDiagram.getCenterPosition();
		var ePosition = jdEndDiagram.getCenterPosition();
		
		var jdLineId = jdStartDiagram.id + "_" + jdEndDiagram.id;
		var jdLine = new JDLine(context, sPosition.x, sPosition.y, ePosition.x, ePosition.y, jdLineId);
		jdLine.show();	
		
		jdStartDiagram.outLines.push(jdLine);
		jdEndDiagram.inLines.push(jdLine);
		
		//show diagram
		jdStartDiagram.show();
	}
	
	this.showDependency = function(cx, cy, id, dependency, jdParentDiagram){
		var xOffset = 2; var yOffset = 1;
		var type = dependency.type;
		if(type != null){
			if(type == "and" || type == "or"){
				var andOrId = id + "_" + type;
				var jdAndOrDiagram = new JDDiagram(this.context, cx, cy, andOrId, dependency);
				this.showDiagram(this.context, jdAndOrDiagram, jdParentDiagram);
				
				var items = dependency.items;
				if(items != null){
					for(var i=0;i<items.length;i++){
						var icx = cx - xOffset;
						var icy = cy - yOffset + i;
						var itemId = andOrId + "_" + i;
						this.showDependency(icx, icy, itemId, items[i], jdAndOrDiagram);
					}
				}
			}else{
				var jdId = id + "_" + "d"
				var jdDiagram = new JDDiagram(this.context, cx, cy, jdId, dependency);
				this.showDiagram(this.context, jdDiagram, jdParentDiagram);
			}
		}
	}
}

/* diagram = text + image */
function JDDiagram(context, cx, cy, id, item){
	this.context = context;
	this.cx = cx; 
	this.cy = cy;
	this.id = id;
	this.item = item;
	this.inLines = [];
	this.outLines = [];
	
	this.show = function(){
		var position = this.getPosition();
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
		
		var group = this.context.svg.append("g").call(drag);
		var t = group.append("text").attr("id", "jd_image_text_" + this.id);
		var tx = position.x;
		var ty = position.y + this.context.TEXT_HEIGHT - yOffset;
		t.attr("x", tx).attr("y", ty);
		t.attr("width", this.context.TEXT_WIDTH).attr("height", this.context.TEXT_HEIGHT);
		t.style("font-family", "Arial").style("font-size", "8.5pt").style("weight", "bold");
		if(this.getType() != "and" && this.getType() != "or"){
			t.text(this.item.type + " (" + this.item.id + ") ");
		}
		
		//crete image
		var img = group.append("image").attr("id", "jd_image_" + this.id);
		var ix = position.x;
		var iy = position.y + this.context.TEXT_HEIGHT;
		img.attr("x", ix).attr("y", iy);
		img.attr("width", this.context.IMAGE_WIDTH).attr("height", this.context.IMAGE_HEIGHT);
		img.attr("xlink:href", this.context.urlContext + this.getImageSrc());
		img.on("dblclick", function(){
			window.imageOnclick(self.context, self.id);
		})
	}
	
	this.getImageSrc = function(){
		var r = "/images/resources/" + this.getType() + ".gif";
		if(this.state != "") r = "/images/resources/" + this.getStatus() + "/" + this.getType() + ".gif";
		return r;
	}
		
	this.getPosition = function(){
		var x = this.cx * this.context.xUnit;
		var y = this.cy * this.context.yUnit;
		return {x: x, y: y};
	}
	
	this.getCenterPosition = function(){
		var position = this.getPosition();
		var x = position.x + context.xUnit / 2;
		var y = (position.y + this.context.TEXT_HEIGHT ) + this.context.IMAGE_HEIGHT / 2;	
		return {x: x, y: y};
	}
	
	this.getType = function(){
		var r = "job";
		var t = this.item.type.toUpperCase();
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
		return r;
	}
	
	this.getStatus = function(){
		var r = "";
		if(this.item.status){
			var s = this.item.status.toUpperCase();
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

function JDLine(context, x1, y1, x2, y2, id, label, style){
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
		
		var path = group.append("path").attr("id", "jd_line_path_" + this.id);
		var d = this.getD(this.x1, this.y1, this.x2, this.y2);
		path.attr("d", d).attr("style", "stroke: black").attr("marker-mid","url(#arrow)");
		
		//the line style. By default, showing dash line
		if(this.style == "dash") path.style("stroke-dasharray", ("3, 3"));
		
		var t = group.append("text").attr("id", "jd_line_text_" + this.id);
		t.style("text-anchor", "middle").style("font-size", "9pt");
		t.style("font-family", "Arial, Helvetica, sans-serif").style("font-style", "italic");
		t.attr("dy", "-4");
		
		var tPath = t.append("textPath").attr("id", "jd_line_textpath_" + this.id);
		tPath.attr("xlink:href", "#" + ("jd_line_path_" + this.id)).attr("startOffset", "50%");
		tPath.text(this.label);
		
		this.px1 = this.x1; this.py1 = this.y1;
		this.px2 = this.x2; this.py2 = this.y2;
	}
	
	this.getD = function(x1, y1, x2, y2){
		var dx = x2 - x1; var dy = y2 - y1;
		return "M" + x1 + "," + y1 +  " T" + (x1 + dx / 2) + "," + (y1 + dy / 2) + " T" + x2 + "," + y2;
	}
	
	this.startAt = function(dx, dy){
		this.px1 = this.x1 + dx; this.py1 = this.y1 + dy;
		var path = svg.select("#" + ("jd_line_path_" + this.id));
		
		var d = this.getD(this.px1, this.py1, this.px2, this.py2)
		path.attr("d", d);	
	}
	
	this.endAt = function(dx, dy){
		this.px2 = this.x2 + dx; this.py2 = this.y2 + dy;
		var path = svg.select("#" + ("jd_line_path_" + this.id));
		
		var d = this.getD(this.px1, this.py1, this.px2, this.py2)
		path.attr("d", d);
	}	
}

function JDDashLine(context, x1, y1, x2, y2){
	this.context = context;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	
	this.show = function(){
		var group = this.context.svg.append("g");
		var line = group.append("line");
		
		line.attr("x1", this.x1).attr("y1", this.y1).attr("x2", this.x2).attr("y2", this.y2);
		line.style("stroke", "gray").style("stroke-width", "1").style("stroke-dasharray", ("3, 3"));
	}
}
