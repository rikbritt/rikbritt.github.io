var gShowHierarchyEditor = false;
var gHierarchyInstances = [];

var NodeImGui = {
	BeginNode : function(id)
	{
		var dw = ImGui.GetWindowDrawList();
		var x = ImGui.GetWindowPos().x + 150;
		var y = ImGui.GetWindowPos().y + 150;
		var col = new ImGui.ImColor(0.5, 1.0, 1.0, 1.00);
		dw.AddRectFilled(new ImGui.Vec2(x, y), new ImGui.Vec2(x + 100, y + 100), col.toImU32());   
	},
	EndNode : function()
	{

	}
};

function UpdateHierarchyEditor()
{
	if(gShowHierarchyEditor)
	{
		if(gHierarchyInstances.length == 0)
		{
			gHierarchyInstances.push(
				{
					instance:bg.CreateGenerationHierarchy("New Hierarchy"),
					selected_node:0
				} 
			);
		}

		var hierarchy_editor_instance = gHierarchyInstances[0];
		var hierarchy_instance = gHierarchyInstances[0].instance;
		if(ImGui.Begin("Hierarchy Editor - " + hierarchy_instance.name))
		{
			var win_width = ImGui.GetContentRegionAvail().x;
			var win_height = ImGui.GetContentRegionAvail().y;
			var gens_width = Math.min(200, win_width * 0.5);

			ImGui.BeginChild("HierarchyProperties", new ImGui.Vec2(gens_width, win_height))
			ImGui.Text(hierarchy_instance.name);

			ImGui.Text("Num Nodes : " + hierarchy_instance.hierarchyNodes.length);
			ImGui.Indent();
			for(var i=0; i<hierarchy_instance.hierarchyNodes.length; ++i)
			{
				var node = hierarchy_instance.hierarchyNodes[i];
				ImGui.Text(node.generator.name);
			}
			ImGui.SliderInt("Selected Node", (_ = hierarchy_editor_instance.selected_node) => hierarchy_editor_instance.selected_node = _, 0, hierarchy_instance.hierarchyNodes.length-1);
			if(hierarchy_editor_instance.selected_node >= 0 && hierarchy_editor_instance.selected_node < hierarchy_instance.hierarchyNodes.length)
			{
				var selected_hierarchy_node = hierarchy_instance.hierarchyNodes[hierarchy_editor_instance.selected_node];
				ImGui.Text("Selected Node Info : " + selected_hierarchy_node.generator.name);
				ImGui.Text("Selected Node Inputs : ");
				ImGui.Indent();
				var generator_inputs = selected_hierarchy_node.generator.inputs;
				for([paramKey, paramData] of Object.entries(generator_inputs))
				{
					ImGui.Text(paramKey);
				}
				ImGui.Unindent();
				ImGui.Text("Selected Node Outputs : ");
			}
			else
			{
				ImGui.Text("Invalid Node");
			}
			ImGui.Unindent();

			ImGui.EndChild();

			ImGui.SameLine();
			ImGui.BeginChild("Canvas", new ImGui.Vec2(win_width - gens_width, win_height))

			var dw = ImGui.GetWindowDrawList();

			for(var i=0; i<hierarchy_instance.hierarchyNodes.length; ++i)
			{
				var node = hierarchy_instance.hierarchyNodes[i];
				NodeImGui.BeginNode(node.generator.name);
				ImGui.Text(node.generator.name);
				NodeImGui.EndNode();
			}

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

			if (ImGui.BeginPopupContextWindow())
			{
				if(ImGui.BeginMenu("Add Generator..."))
				{
					UpdateGeneratorsList(function(generator)
					{
						bg.CreateGenerationHierarchyNode(gHierarchyInstances[0].instance, generator);
					});
					ImGui.EndMenu();
				}

				if(ImGui.MenuItem("Add Note / Comment"))
				{
				}

				ImGui.EndPopup();
			}

			ImGui.EndChild();
		}
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
