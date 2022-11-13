var gShowHierarchyEditor = false;

function UpdateHierarchyEditor()
{
	if(gShowHierarchyEditor)
	{
		ImGui.Begin("Hierarchy Editor");
		var dw = ImGui.GetWindowDrawList();
		var c = new ImGui.ImColor(1.0, 1.0, 1.0, 1.00);
		var th = 4.0;
		var sz = {value:150}
		var x = ImGui.GetWindowPos().x + 50;
		var y = ImGui.GetWindowPos().y + 50;
		var cp4 = [    new ImGui.Vec2(x, y),     new ImGui.Vec2(x + sz.value * 1.3, y + sz.value * 0.3), 
			    new ImGui.Vec2(x + sz.value - sz.value * 1.3, y + sz.value - sz.value * 0.3),
				    new ImGui.Vec2(x + sz.value, y + sz.value) ];
					var curve_segments = 168;
					dw.AddBezierCubic(cp4[0], cp4[1], cp4[2], cp4[3], c.toImU32(), th, curve_segments);
		ImGui.End();
	}
}

function UpdateGeneratorHierarchiesList() 
{
	for(var i=0; i<bg.generatorHierarchies.length; ++i)
	{
		if(ImGui.MenuItem(bg.generatorHierarchies[i].name))
		{
			//gChosenGenerator = bg.generators[i];
		}
	}
}

function SetupHierarchyView()
{
	var canvas = document.getElementById('hierarchyCanvas');
	paper.setup(canvas);
	paper.view.center = new paper.Point(0,0);
}

function RenderHierarchy()
{
	paper.project.activeLayer.removeChildren();
	if(gGeneratorHierarchy != null)
	{
		var RenderHierarchyLevel = function(nodes, lvl)
		{
			for(var i=0; i<nodes.length; ++i)
			{
				var hierarchyNode = nodes[i];
				
				var nodeCenter = new paper.Point(0, lvl * 40);
				var rectangle = new paper.Rectangle();
				rectangle.center = nodeCenter;
				rectangle.size = new paper.Size(100, 30);
				var path = new paper.Path.Rectangle(rectangle);
				path.fillColor = '#e9e9ff';
				
				var txt = new paper.PointText(nodeCenter);
				txt.content = hierarchyNode.generator.name;
				txt.justification = 'center';
				//path.selected = true;
				
				if(hierarchyNode.inputs.length > 0)
				{
					var childNodes = [];
					for(var j=0; j<hierarchyNode.inputs.length; ++j)
					{
						childNodes.push(hierarchyNode.inputs[j].fromNode);
					}
					RenderHierarchyLevel(childNodes, lvl+1);
				}
			}
		};
		
		RenderHierarchyLevel(gGeneratorHierarchy.hierarchyNodes, 0);
	}
	paper.view.draw();
}
