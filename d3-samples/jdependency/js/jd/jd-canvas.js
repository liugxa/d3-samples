

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
