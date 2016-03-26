


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