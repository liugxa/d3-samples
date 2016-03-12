var svg = rave;

function JDContext(container, urlContext, showExcel, showReverse){
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
	
	//show the canvas reverse or not
	this.showReverse = (showReverse != true) ? false : true;

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
}

function JDDiagramList(context, diagrams){
	this.context = context;
	this.diagrams = diagrams;
	
	var xOffset = 5; var yOffset = 0;
	this.getCenterPosition = function(){
		//the center position
		var x = Math.floor(this.context.xCount / 2);
		var y = Math.floor(this.context.yCount / 2);
		return {x: x, y:y};
	}
	
	this.getParentJDDiagrams = function(){
		var r = [];
		var position = this.getCenterPosition();
		
		//parent diagrams
		var pDiagrams = this.diagrams.parents
		var pCount = Math.round(pDiagrams.length / this.context.yCount);
		if(pCount <= (position.x - xOffset)){
			for(var i=0;i<pCount;i++){
				for(var j=0;j<this.context.yCount;j++){
					var index = i * this.context.yCount + j;
					if(index < pDiagrams.length){
						var px = (position.x - xOffset) - i;
						var jdPDiagram = new JDDiagram(this.context, pDiagrams[index], px, j);
						jdPDiagram.startup();
						r.push(jdPDiagram);
					}
				}
			}
		}else{
			//TODO, EXTEND THE CANVAS WIDTH AND HEIGHT
		}
		return r;
	}
	
	this.getCurrentJDDiagram = function(){
		var position = this.getCenterPosition();
		
		//current diagram
		var diagram = this.diagrams.current;
		var jdDiagram = new JDDiagram(this.context, diagram, position.x, 2);
		jdDiagram.startup();
		return jdDiagram;	
	}
	
	this.getChildJDDiagrams = function(){
		var r = [];
		var position = this.getCenterPosition();
		
		//child diagrams
		var cDiagrams = this.diagrams.childrens;
		for(var i=0;i<cDiagrams.length;i++){
			var jdCDiagram = new JDDiagram(this.context, cDiagrams[i], position.x + xOffset, i + 1);
			jdCDiagram.startup();
			r.push(jdCDiagram);
		}
		return r;
	}

	this.getJDDiagrams = function(){
		var r = []; 
		r = r.concat(this.getParentJDDiagrams());
		r = r.concat(this.getChildJDDiagrams());
		r.push(this.getCurrentJDDiagram());
		return r;
	}
}

function JDDiagram(context, diagram, cx, cy){
	this.context = context;
	this.diagram = diagram;
	this.cx = cx;
	this.cy = cy;
	this.jdImage;
	
	this.startup = function(){
		//set the diagram's position in the matrix
		var position = this.getPosition();
		this.jdImage = new JDImage(this.context, this.diagram.id, position.x, position.y, this.diagram.label, this.diagram.type, this.diagram.state);	
	}
	
	this.show = function(mx, my){
		this.jdImage.show();
	}
	
	this.getPosition = function(){
		var x = this.cx * this.context.xUnit;
		var y = this.cy * this.context.yUnit;
		return {x: x, y: y};
	}
}

function JDDependency(context, jdDiagrams, dependency){
	this.context = context;
	this.jdDiagrams = jdDiagrams;
	this.dependency = dependency;
	this.jdLine;
	
	this.startup = function(){
		var sDiagram = this.dependency.sDiagram;
		var eDiagram = this.dependency.eDiagram;
		var condition = this.dependency.condition;
	
		//using the line to express the dependency
		var sPosition = this.getPosition(sDiagram);
		var ePosition = this.getPosition(eDiagram);
		
		var jdLineId = (sDiagram.id + "-" + eDiagram.id);
		this.jdLine = new JDLine(this.context, jdLineId, sPosition.x, sPosition.y, ePosition.x, ePosition.y, condition);	
	}
	
	this.show = function(){
		this.jdLine.show();
	}
	
	this.getPosition = function(diagram){
		var jdDiagram = this.getJDDiagram(diagram.id);
		var position = jdDiagram.getPosition();
		
		var x = position.x + this.context.xUnit / 2;
		var y = (position.y + this.context.TEXT_HEIGHT ) + this.context.IMAGE_HEIGHT / 2;	
		return {x: x, y: y};
	}
	
	this.getJDDiagram = function(jdId){
		var r = null;
		for(var i=0;i<this.jdDiagrams.length;i++){
			if(this.jdDiagrams[i].diagram.id == jdId){
				r = this.jdDiagrams[i];
				break;
			}
		}
		return r;
	}
	
	this.startAt = function(x, y){
		if(this.jdLine) this.jdLine.startAt(x, y);
	}
	
	this.endAt = function(x, y){
		if(this.jdLine) this.jdLine.endAt(x, y);
	}
}

function JDDependencyList(context, dependencies){
	this.context = context;
	this.dependencies = dependencies;

	this.getJDDependencies = function(jdDiagrams){
		var r = []
		for(var i=0;i<this.dependencies.length;i++){
			//using the line to express the dependency
			var jdDependency = new JDDependency(this.context, jdDiagrams, dependencies[i]);
			jdDependency.startup();
			r.push(jdDependency);
		}
		return r;
	}
}

function JDCanvas(context, diagrams, dependencies){
	this.context = context;
	this.diagrams = diagrams;
	this.dependencies = dependencies;
	this.jdDiagrams;
	this.jdDependencies;
	
	this.startup = function(){
		var jdDiagramList = new JDDiagramList(this.context, this.diagrams);
		var jdDependencyList = new JDDependencyList(this.context, this.dependencies);
		
		this.jdDiagrams = jdDiagramList.getJDDiagrams();
		this.jdDependencies = jdDependencyList.getJDDependencies(this.jdDiagrams);	
		
		//register myself into the context
		this.context.canvas = this;
		
		//create the maker
		var defs = this.context.svg.append("defs");
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
	
	this.show = function(){
		//show the excel or not
		if(this.context.showExcel == true) this.showExcel();
		
		//show the reverse or not
		if(this.context.showReverse != true){
			this.showJDDependencies();
			this.showJDDiagrams();
		}else{
			this.showJDDiagrams();
			this.showJDDependencies();	
		}
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
	
	this.showJDDiagrams = function(){
		for(var i=0;i<this.jdDiagrams.length;i++){
			var jdDiagram = this.jdDiagrams[i];
			if(jdDiagram) jdDiagram.show();
		}
	}
	
	this.showJDDependencies = function(){
		for(var i=0;i<this.jdDependencies.length;i++){
			var jdDependency = this.jdDependencies[i];
			if(jdDependency) jdDependency.show();
		}
	}
	
	this.moveDependency = function(jdId, x, y){
		//get all dependencies of the jdDiagram
		for(var i=0;i<this.jdDependencies.length;i++){
			var jdDependency = this.jdDependencies[i];
			var dependency = jdDependency.dependency;
			if(dependency.sDiagram.id == jdId){
				//move the start point
				jdDependency.startAt(x, y);
			}
			if(dependency.eDiagram.id == jdId){
				//move the end point
				jdDependency.endAt(x, y);
			}
		}
	}
}

/* diagram = text + image */
function JDImage(context, id, x, y, label, type, state){
	this.context = context;
	this.id = id;
	this.x = x;
	this.y = y;
	this.label = label;
	this.type = type;
	this.state = state;
	
	this.show = function(){
		var yOffset = 2;
		var self = this;
		var drag = svg.behavior.drag().on("drag", function() {	
			var move = svg.transform(this.getAttribute("transform")).translate;
			var x = svg.event.dx + move[0];
			var y = svg.event.dy + move[1];
			svg.select(this).attr("transform", "translate(" + x + "," + y +   ")");
			
			self.context.canvas.moveDependency(self.id, x, y);
		});
		
		var group = this.context.svg.append("g").call(drag);
		var t = group.append("text").attr("id", this.id + "-text");
		var tx = this.x;
		var ty = this.y + this.context.TEXT_HEIGHT - yOffset;
		t.attr("x", tx).attr("y", ty);
		t.attr("width", this.context.TEXT_WIDTH).attr("height", this.context.TEXT_HEIGHT);
		t.style("font-family", "Arial").style("font-size", "8.5pt").style("weight", "bold");
		t.text(this.label);
		
		//crete image
		var img = group.append("image").attr("id", this.id + "-image");
		var ix = this.x;
		var iy = this.y + this.context.TEXT_HEIGHT;
		img.attr("x", ix).attr("y", iy);
		img.attr("width", this.context.IMAGE_WIDTH).attr("height", this.context.IMAGE_HEIGHT);
		img.attr("xlink:href", this.context.urlContext + this.getImageSrc());
	}
	
	this.getImageSrc = function(){
		var t = this.getType();
		var s = this.getState();
		
		var r = "/images/resources/" + t + ".gif";
		if(s != "") r = "/images/resources/" + s + "/" + t + ".gif";
		return r;
	}
	
	this.getType = function(){
		var r = "job";
		if(this.type){
			var t = this.type.toUpperCase();
			if(t == "JOBARRAY") r = "jobarray";
		}
		return r;
	}
	
	this.getState = function(){
		var r = "";
		if(this.state){
			var s = this.state.toUpperCase();
			switch(s){
				case "PENDING":
					r = "pending";
					break;
				case "RUNNING":
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
		//console.log("Job State: "+ r);
		return r;
	}
}

function JDLine(context, id, x1, y1, x2, y2, label){
	this.context = context;
	this.id = id;
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.label = label;
	
	this.show = function(){	
		var group = this.context.svg.append("g");
		
		//<path id="LINE_PATH" d="M 40 0 l 200 200" stroke="green" stroke-width="3" fill="none" />
		var path = group.append("path").attr("id", this.id + "-path");
		var d = this.getD(this.x1, this.y1, this.x2, this.y2);
		path.attr("d", d).attr("style", "stroke: black").attr("marker-mid","url(#arrow)");
		path.style("stroke-dasharray", ("3, 3"));
		
		var t = group.append("text").attr("id", this.id + "-text");
		t.style("text-anchor", "middle").style("font-size", "9pt");
		t.style("font-family", "Arial, Helvetica, sans-serif").style("font-style", "italic");
		t.attr("dy", "-4");
		
		var tPath = t.append("textPath").attr("id", this.id + "-textpath");
		tPath.attr("xlink:href", "#" + (this.id + "-path")).attr("startOffset", "50%");
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
		var path = svg.select("#" + (this.id + "-path"));
		
		var d = this.getD(this.px1, this.py1, this.px2, this.py2)
		path.attr("d", d);	
	}
	
	this.endAt = function(dx, dy){
		this.px2 = this.x2 + dx; this.py2 = this.y2 + dy;
		var path = svg.select("#" + (this.id + "-path"));
		
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
