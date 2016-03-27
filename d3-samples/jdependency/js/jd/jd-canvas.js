
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
