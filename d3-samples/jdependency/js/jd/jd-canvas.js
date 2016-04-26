
function JDCanvas(context, data){
	this.context = context;
	this.data = data;
	
	this.show = function(){
		//show item
		var item = this.data.item;
		var cPosition = new JDPosition(this.context, this.context.center.x, this.context.center.y);
		var jdDiagram = new JDDiagram(this.context, "c", cPosition, item);
		jdDiagram.show();
		
		//show subitems
		var subItems = this.data.subItems;
		if(subItems != null){
			//calculate the sub item's postion
			var jdSubItem = new JDSubItems(this.context, "s", subItems, jdDiagram);
			jdSubItem.show();
		}
		
		//show the parents
		var parentItem = this.data.parentItem;
		if(parentItem != null){			
			var jdParentItem = new JDParentItem(this.context, "p", parentItem, jdDiagram);
			jdParentItem.show();
		}
		
		//show the excel or not
		if(this.context.showExcel == true) this.showExcel();
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
			
			var jdDashLine = new JDUnderLine(this.context, "x_" + i, sPosition, ePosition, "", "dash");
			jdDashLine.show();
		}
		
		//draw horizontal line
		for(var i=0;i<=this.context.yCount;i++){
			var x1 = 0; var y1 = i * this.context.yUnit;
			var x2 = this.context.xCount * this.context.xUnit; var y2 = i * this.context.yUnit;
			
			var sPosition = new JDPosition(this.context, x1, y1);
			var ePosition = new JDPosition(this.context, x2, y2);
			
			var jdDashLine = new JDUnderLine(this.context, "y_" + i, sPosition, ePosition, "", "dash");
			jdDashLine.show();
		}
	}
}


function JDSubItems(context, jdId, items, parentDiagram){
	this.context = context;
	this.jdId = jdId;
	this.items = items;
	this.parentDiagram = parentDiagram;
	
	this.show = function(){
		if(this.items != null){
			var iStep = this.context.h / this.items.length;
			for(var i=0;i<this.items.length;i++){
				//calculate the item position
				var ix = this.context.center.x + this.context.IMAGE_XOFFSET * this.context.xUnit;
				var iy = i * iStep + iStep / this.context.C_LOCATION_POINT;
				var iPosition = new JDPosition(this.context, ix, iy);
				
				var itemId = this.jdId + "_" + i;
				var jdDiagram = new JDDiagram(this.context, itemId, iPosition, this.items[i]);
				var jdDependency = new JDDependency(this.context, this.parentDiagram, jdDiagram, "", "line");	
				
				jdDependency.show();
				jdDiagram.show();
			}
		}
	}
}

function JDParentItem(context, jdId, item, parentDiagram){
	this.context = context;
	this.jdId = jdId;
	this.item = item;
	this.parentDiagram = parentDiagram;
	
	this.show = function(){
		var sx = this.context.center.x - this.context.IMAGE_XOFFSET * this.context.xUnit;
		var sPosition = new JDPosition(this.context, sx, 0);
		var ePosition = new JDPosition(this.context, sx, this.context.h);
		this.showItem(this.jdId, sPosition, ePosition, this.item, this.parentDiagram);
	}
	
	this.showItem = function(jdId, sPosition, ePosition, item, parentDiagram){
		if(item.type != null){
			var jdx = sPosition.x;
			var jdy = sPosition.y + (ePosition.y - sPosition.y) / this.context.P_LOCATION_POINT;
			//console.log(sPosition.y + "," + ePosition.y);
			
			var jdPosition = new JDPosition(this.context, jdx, jdy);
			if(item.type == "and" || item.type == "or"){
				var jdAndOrDiagram = new JDDiagram(this.context, jdId, jdPosition, item);
				var jdDependency = new JDDependency(this.context, jdAndOrDiagram, parentDiagram);
				
				//show it directly
				jdDependency.show();
				jdAndOrDiagram.show();

				//show all of the items
				var items = item.items;
				if(items != null){
					var iStep = (ePosition.y - sPosition.y) / items.length;
					for(var i=0;i<items.length;i++){
						//calculate the item position
						var ix = sPosition.x - this.context.IMAGE_XOFFSET * this.context.xUnit;
						var iy = sPosition.y + i * iStep;
						
						var isPosition = new JDPosition(this.context, ix, iy);
						var iePosition = new JDPosition(this.context, ix, iy + iStep);
						var itemId = jdId + "_" + i;
						this.showItem(itemId, isPosition, iePosition, items[i], jdAndOrDiagram);
					}
				}
			}else{
				var jdDiagram = new JDDiagram(this.context, jdId, jdPosition, item);
				var jdDependency = new JDDependency(this.context, jdDiagram, parentDiagram, item.condition);
				
				//show it directly!
				jdDependency.show();
				jdDiagram.show();
			}
		}
	}
}

function JDDependency(context, sDiagram, eDiagram, label, style){
	this.context = context;
	this.jdLineId = sDiagram.jdId + "-" + eDiagram.jdId;
	this.sDiagram = sDiagram;
	this.eDiagram = eDiagram;
	this.label = label;
	this.style = style;
	
	this.show = function(){
		var style = (this.style && this.style == "line") ? "line" : "pathLine";
		
		//show line at first
		var sPosition = this.sDiagram.position;
		var ePosition = this.eDiagram.position;
		
		//initialize the line
		var jdLine = new JDLine(this.context, this.jdLineId, sPosition, ePosition, this.label);
		if(style == "pathLine") jdLine = new JDPathLine(this.context, this.jdLineId, sPosition, ePosition, this.label);
		jdLine.show();
		
		this.sDiagram.outLines.push(jdLine);
		this.eDiagram.inLines.push(jdLine);			
	}
}