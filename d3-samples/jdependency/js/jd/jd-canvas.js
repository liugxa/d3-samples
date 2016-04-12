
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
		var cxOffset = 1; var cyOffset = 1;
	
		if(this.items != null){
			for(var i=0;i<this.items.length;i++){
				var item = items[i];
				//get item position
				var itemId = "s" + i;
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
