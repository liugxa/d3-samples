var svg = d3;

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
	
	this.xCount = Math.round(this.w / this.xUnit);
	this.yCount = Math.round(this.h / this.yUnit);
	
	this.W = this.xUnit * (this.xCount - 1);
	this.H = this.yUnit * (this.yCount - 1);
	
	//console.log("xUnit:" + this.xUnit + "|yUnit:" + this.yUnit);
	//console.log("xCount:" + this.xCount + "|yCount:" + this.yCount);
}

function JDCanvas(context, diagrams){
	this.context = context;
	this.diagrams = diagrams;
	
	var xOffset = 5; var yOffset = 1;
	this.getCurrentDiagram = function(){
		var r = this.diagrams.current;
		r.ex = xOffset * 2;
		r.ey = 5;
		return r;
	}
	
	this.getParentDiagrams = function(){
		var r = [];
		var pDiagrams = this.diagrams.parents;
		for(var i=0;i<pDiagrams.length;i++){
			var diagram = pDiagrams[i];
			diagram.ex = xOffset;
			diagram.ey = i + yOffset;
			r.push(diagram);
		}
		return r;
	}
	
	this.getChildDiagrams = function(){
		var r = [];
		var cDiagrams = this.diagrams.childrens;
		for(var i=0;i<cDiagrams.length;i++){
			var diagram = cDiagrams[i];
			diagram.ex = xOffset * 3;
			diagram.ey = (i + 3) + yOffset;
			r.push(diagram);
		}
		return r;
	}
	
	this.getStartPosition = function(diagram){
		var x = (diagram.ex - 1) * this.context.xUnit;
		var y = (diagram.ey - 1) * this.context.yUnit;
		return {x: x, y: y};
	}
	
	this.getCentPositon = function(diagram){
		var sPosition = this.getStartPosition(diagram);
		var x = sPosition.x + this.context.xUnit / 2;
		var y = (sPosition.y + this.context.TEXT_HEIGHT ) + this.context.IMAGE_HEIGHT / 2;	
		return {x: x, y: y};
	}
	
	this.toJDDiagram = function(diagram){
		var position = this.getStartPosition(diagram);
		return new JDDiagram(this.context, diagram.id, position.x, position.y, diagram.label, diagram.type, diagram.state);
	}
	
	this.toJDLine = function(sDiagram, eDiagram, condition){
		var sPosition = this.getCentPositon(sDiagram);
		var ePosition = this.getCentPositon(eDiagram);
		
		var jdLineId = (sDiagram.id + "-" + eDiagram.id);
		return new JDLine(this.context, jdLineId, sPosition.x, sPosition.y, ePosition.x, ePosition.y, condition);
	}
	
	this.getJDDiagram = function(jdDiagrams, jdId){
		var r = null;
		for(var i=0;i<jdDiagrams.length;i++){
			if(jdDiagrams[i].id == jdId){
				r = jdDiagrams[i];
				break;
			}
		}
		return r;
	}
	
	this.getJDDiagrams = function(){
		var r = [];
		//parent diagrams
		var pDiagrams = this.getParentDiagrams();
		for(var i=0;i<pDiagrams.length;i++){
			var jdPDiagram = this.toJDDiagram(pDiagrams[i]);
			r.push(jdPDiagram);
		}
		
		//current diagram
		var diagram = this.getCurrentDiagram();
		var jdDiagram = this.toJDDiagram(diagram);
		r.push(jdDiagram);
		
		//child diagrams
		var cDiagrams = this.getChildDiagrams();
		for(var i=0;i<cDiagrams.length;i++){
			var jdCDiagram = this.toJDDiagram(cDiagrams[i]);
			r.push(jdCDiagram);
		}
		return r;
	}
	
	this.setDependencies = function(jdDiagrams, diagram){
		var jdDiagram = this.getJDDiagram(jdDiagrams, diagram.id);	
		
		var dependencies = diagram.dependencies;
		if(dependencies){
			for(var j=0;j<dependencies.length;j++){
				var dependency = dependencies[j];
				
				var depDiagram = dependency.depended;
				var jdDepDiagram = this.getJDDiagram(jdDiagrams, depDiagram.id);
				
				//using the line to express the dependency
				var jdPLine = this.toJDLine(depDiagram, diagram, dependency.condition);
				
				//set relationship
				//console.log("set relationship between: " + jdDepDiagram.id + " & " + jdDiagram.id);
				jdDepDiagram.addOutLine(jdPLine);
				jdDiagram.addInLine(jdPLine);
			}
		}
	}
	
	this.setJDDiagramsWithDependency = function(jdDiagrams){
		//current diagram
		var diagram = this.getCurrentDiagram();
		this.setDependencies(jdDiagrams, diagram);
		
		//parent diagrams
		var pDiagrams = this.getParentDiagrams();
		for(var i=0;i<pDiagrams.length;i++){
			this.setDependencies(jdDiagrams, pDiagrams[i]);
		}
		
		//child diagrams
		var cDiagrams = this.getChildDiagrams();
		for(var i=0;i<cDiagrams.length;i++){
			this.setDependencies(jdDiagrams, cDiagrams[i]);
		}
	}
		
	this.showDiagrams = function(jdDiagrams){
		for(var i=0;i<jdDiagrams.length;i++){
			var jdPDiagram = jdDiagrams[i];
			jdPDiagram.show();
		}
	}
	
	this.showDependencies = function(jdDiagrams){
		this.setJDDiagramsWithDependency(jdDiagrams);
		for(var i=0;i<jdDiagrams.length;i++){
			var jdInLines = jdDiagrams[i].inLines;
			for(var j=0;j<jdInLines.length;j++){
				jdInLines[j].show();
			}
		}
	}
	
	this.show = function(){
		//show the excel or not
		if(this.context.showExcel == true) this.showExcel();
		
		//show the reverse or not
		var jdDiagrams = this.getJDDiagrams();
		if(this.context.showReverse != true){
			this.showDependencies(jdDiagrams);
			this.showDiagrams(jdDiagrams);
		}else{
			this.showDiagrams(jdDiagrams);
			this.showDependencies(jdDiagrams);	
		}
	}
	
	this.showExcel = function(){
		//draw vertical line
		for(var i=0;i<this.context.xCount;i++){
			var x1 = i * this.context.xUnit;
			var y1 = 0;
			
			var x2 = i * this.context.xUnit;
			var y2 = this.context.H;
			
			var jdDashLine = new JDDashLine(this.context, x1, y1, x2, y2);
			jdDashLine.show();
		}
		
		//draw horizontal line
		for(var i=0;i<this.context.yCount;i++){
			var x1 = 0;
			var y1 = i * this.context.yUnit;
			
			var x2 = this.context.W;
			var y2 = i * this.context.yUnit;
			
			var jdDashLine = new JDDashLine(this.context, x1, y1, x2, y2);
			jdDashLine.show();
		}
	}
}

/* diagram = text + image */
function JDDiagram(context, id, x, y, label, type, state){
	this.context = context;
	this.id = id;
	this.x = x;
	this.y = y;
	this.label = label;
	this.type = type;
	this.state = state;
	
	this.inLines = [];
	this.outLines = [];
	var _self = this;
	
	this.addInLine = function(jdLine){
		this.inLines.push(jdLine);
	}
	this.addOutLine = function(jdLine){
		this.outLines.push(jdLine);
	}
	this.show = function(){
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
		var d = "M " + this.x1 + " " + this.y1 + " L " + this.x2 + " " + this.y2;		
		path.attr("d", d).attr("style", "stroke: black");

		var t = group.append("text").attr("id", this.id + "-text");
		t.style("text-anchor", "middle").style("font", "14px sans-serif");
		t.attr("dy", "-2");
		
		var tPath = t.append("textPath").attr("id", this.id + "-textpath");
		tPath.attr("xlink:href", "#" + (this.id + "-path")).attr("startOffset", "50%");
		tPath.text(this.label);
		
		this.px1 = this.x1; this.py1 = this.y1;
		this.px2 = this.x2; this.py2 = this.y2;
	}
	
	this.startAt = function(dx, dy){
		this.px1 = this.x1 + dx; this.py1 = this.y1 + dy;
		var path = svg.select("#" + (this.id + "-path"));
		var d = "M " + this.px1 + " " + this.py1 + " L " + this.px2 + " " + this.py2;
		path.attr("d", d);	
	}
	
	this.endAt = function(dx, dy){
		this.px2 = this.x2 + dx; this.py2 = this.y2 + dy;
		var path = svg.select("#" + (this.id + "-path"));		
		var d = "M " + this.px1 + " " + this.py1 + " L " + this.px2 + " " + this.py2;
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
