var gShowHierarchyEditor = false;
var gHierarchyInstances = [];

var NodeImGui = {
	Nodes:{},
	Current_NodeId:0,
	Current_Node:null,
	BeginNode : function(id, node_x, node_y)
	{
		NodeImGui.Current_NodeId = ImGui.GetID(id);
		NodeImGui.Current_Node = NodeImGui.Nodes[node_id];
		if(NodeImGui.Current_Node == null)
		{
			NodeImGui.Current_Node = {};
			NodeImGui.Nodes[node_id] = NodeImGui.Current_Node;
		}
		NodeImGui.Current_Node.x = node_x;
		NodeImGui.Current_Node.y = node_y;
	},
	EndNode : function()
	{
		var node_x = NodeImGui.Current_Node.x;
		var node_Y = NodeImGui.Current_Node.y;

		var dl = ImGui.GetWindowDrawList();

		var num_inputs = 3;
		var num_outputs = 3;
		var max_pins = num_inputs;
		var line_space = 20;

		var x = ImGui.GetWindowPos().x;
		var y = ImGui.GetWindowPos().y;
		node_x += x;
		node_y += y;
		var node_w = 170;
		var node_border = 5;
		var node_inner_x = node_x + node_border;
		var title_height = 25;
		var node_inner_y = node_y + title_height + node_border;
		var node_h = (max_pins * line_space) + title_height + (node_border * 1);

		var bg_col = new ImGui.ImColor(0.15, 0.15, 0.25, 1.00);
		var title_bg_col = new ImGui.ImColor(0.3, 0.3, 0.4, 1.00);
		var title_txt_col = new ImGui.ImColor(1.0, 1.0, 1.0, 1.00);

		//background
		dl.AddRectFilled(new ImGui.Vec2(node_x, node_y), new ImGui.Vec2(node_x + node_w, node_y + node_h), bg_col.toImU32());
		//title bar
		dl.AddRectFilled(new ImGui.Vec2(node_x, node_y), new ImGui.Vec2(node_x + node_w, node_y + title_height), title_bg_col.toImU32());
		dl.AddText({x:node_inner_x, y:node_y+node_border}, title_txt_col.toImU32(), id);


		for(var i=0; i<num_inputs;++i)
		{
			var pin_text = "Input " + i;
			dl.AddText({x:node_inner_x,y:node_inner_y + (i*line_space)}, title_txt_col.toImU32(), pin_text);
		}

		for(var i=0; i<num_outputs;++i)
		{
			var pin_text = "Output " + i;
			var text_width = ImGui.CalcTextSize(pin_text).x;
			var text_x = node_x + node_w - node_border - text_width;
			dl.AddText({x:text_x,y:node_inner_y + (i*line_space)}, title_txt_col.toImU32(), pin_text);
		}
	}
};

function CreateHierarchyEditor(hierarcy_name)
{
	gHierarchyInstances.push(
		{
			instance:bg.CreateGenerationHierarchy(hierarcy_name),
			node_positions:[],
			selected_node_a:{name:"A", idx:0, input_pin:0,output_pin:0},
			selected_node_b:{name:"B", idx:0, input_pin:0,output_pin:0},
		} 
	);
}

function UpdateSelectedNodeInfo(selected_node, hierarchy_editor_instance)
{
	var hierarchy_instance = hierarchy_editor_instance.instance;
	ImGui.PushID(selected_node.name);
	ImGui.Separator();
	ImGui.Text(selected_node.name);
	ImGui.SliderInt("Selected Node " + selected_node.name, (_ = selected_node.idx) => selected_node.idx = _, 0, hierarchy_instance.hierarchyNodes.length-1);
	if(selected_node.idx >= 0 && selected_node.idx < hierarchy_instance.hierarchyNodes.length)
	{
		var selected_hierarchy_node = hierarchy_instance.hierarchyNodes[selected_node.idx];
		var selected_node_pos = hierarchy_editor_instance.node_positions[selected_node.idx];
		ImGui.Text("Name : " + selected_hierarchy_node.generator.name);
		ImGui.SliderInt("X", (_ = selected_node_pos.x) => selected_node_pos.x = _, -100, 100);
		ImGui.SliderInt("Y", (_ = selected_node_pos.y) => selected_node_pos.y = _, -100, 100);
		ImGui.Text("Inputs : ");
		ImGui.Indent();
		var generator_inputs = selected_hierarchy_node.generator.inputs;
		for([paramKey, paramData] of Object.entries(generator_inputs))
		{
			ImGui.Text(paramKey + " : " + paramData.type);
		}
		ImGui.SliderInt("Selected Input", (_ = selected_node.input_pin) => selected_node.input_pin = _, 0, Object.entries(generator_inputs).length-1);
		ImGui.Unindent();

		ImGui.Text("Outputs : ");
		ImGui.Indent();
		var generator_outputs = selected_hierarchy_node.generator.outputs;
		for([paramKey, paramData] of Object.entries(generator_outputs))
		{
			ImGui.Text(paramKey + " : " + paramData.type);
		}
		ImGui.SliderInt("Selected Output", (_ = selected_node.output_pin) => selected_node.output_pin = _, 0, Object.entries(generator_outputs).length-1);
		ImGui.Unindent();
	}
	else
	{
		ImGui.Text("Invalid Node");
	}
	ImGui.PopID();
}

function UpdateHierarchyEditor()
{
	if(gShowHierarchyEditor)
	{
		if(gHierarchyInstances.length == 0)
		{
			CreateHierarchyEditor("New Hierarchy");
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
			ImGui.Unindent();

			UpdateSelectedNodeInfo(hierarchy_editor_instance.selected_node_a, hierarchy_editor_instance);
			UpdateSelectedNodeInfo(hierarchy_editor_instance.selected_node_b, hierarchy_editor_instance);

			ImGui.EndChild();

			ImGui.SameLine();
			ImGui.BeginChild("Canvas", new ImGui.Vec2(win_width - gens_width, win_height))

			var dw = ImGui.GetWindowDrawList();

			for(var i=0; i<hierarchy_instance.hierarchyNodes.length; ++i)
			{
				var node = hierarchy_instance.hierarchyNodes[i];
				NodeImGui.BeginNode(node.generator.name,
					hierarchy_editor_instance.node_positions[i].x,
					hierarchy_editor_instance.node_positions[i].y
				);
				//NodeImGui.InputNode()
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
						gHierarchyInstances[0].node_positions.push({x:0,y:0});
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
