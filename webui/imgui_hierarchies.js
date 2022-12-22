var gShowHierarchyEditor = false;
var gHierarchyInstances = [];


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
		ImGui.SliderInt("X", (_ = selected_node_pos.x) => selected_node_pos.x = _, -100, 500);
		ImGui.SliderInt("Y", (_ = selected_node_pos.y) => selected_node_pos.y = _, -100, 500);
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

		ImGui.Text("Links : ");
		ImGui.Indent();
		var links = selected_hierarchy_node.inputs;
		for(var i=0; i<links.length; ++i)
		{
			var link = links[i];
			ImGui.Text(link.fromNodeOutputName + " > " + link.toNodeInputName);
		}
		ImGui.Unindent();
	}
	else
	{
		ImGui.Text("Invalid Node");
	}
	ImGui.PopID();
}

var c_x = 0;
var c_y = 0;
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

			if(ImGui.Button("Create Test Setup"))
			{
				var person_node = bg.CreateGenerationHierarchyNode(gHierarchyInstances[0].instance, bg.GetGeneratorById("mm_person"));
				gHierarchyInstances[0].node_positions.push({x:0,y:10});

				var suspect_node = bg.CreateGenerationHierarchyNode(gHierarchyInstances[0].instance, bg.GetGeneratorById("mm_suspect"));
				gHierarchyInstances[0].node_positions.push({x:300,y:10});

				bg.CreateGenerationHierarchyLink(person_node, "data", suspect_node, "suspect");
			}

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

			if(ImGui.Button("Add A:Output To B:Input Link"))
			{
				var node_a = hierarchy_instance.hierarchyNodes[hierarchy_editor_instance.selected_node_a.idx];
				var node_a_output_name = Object.entries(node_a.generator.outputs)[hierarchy_editor_instance.selected_node_a.output_pin][0];
				var node_b = hierarchy_instance.hierarchyNodes[hierarchy_editor_instance.selected_node_b.idx];
				var node_b_input_name = Object.entries(node_b.generator.inputs)[hierarchy_editor_instance.selected_node_b.input_pin][0];
				bg.CreateGenerationHierarchyLink(node_a, node_a_output_name, node_b, node_b_input_name);
			}

			ImGui.SliderInt("Canvas X", (_ = c_x) => c_x = _, 0, 1000);
			ImGui.SliderInt("Canvas Y", (_ = c_y) => c_y = _, 0, 1000);
			ImGui.EndChild();

			ImGui.SameLine();

			var dw = ImGui.GetWindowDrawList();

			NodeImGui.BeginCanvas("canvas",  new ImGui.Vec2(win_width - gens_width, win_height));
			NodeImGui.Current_Canvas.Scrolling.x = c_x;
			NodeImGui.Current_Canvas.Scrolling.y = c_y;
			for(var i=0; i<hierarchy_instance.hierarchyNodes.length; ++i)
			{
				var node = hierarchy_instance.hierarchyNodes[i];
				NodeImGui.BeginNode(
					node.idx,
					node.generator.name,
					hierarchy_editor_instance.node_positions[i].x,
					hierarchy_editor_instance.node_positions[i].y
				);

				for([paramKey, paramData] of Object.entries(node.generator.inputs))
				{
					NodeImGui.InputPin(paramKey);
				}

				for([paramKey, paramData] of Object.entries(node.generator.outputs))
				{
					NodeImGui.OutputPin(paramKey);
				}

				//Input Links
				for(var j=0; j<node.inputs.length; ++j)
				{
					var link = node.inputs[j];
					NodeImGui.LinkNode(
						link.fromNodeIdx,
						link.fromNodeOutputName,
						link.toNodeInputName
					);
				}

				NodeImGui.EndNode();
			}

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

			NodeImGui.EndCanvas();
		}
		ImGui.End();
	}
}

function UpdateGeneratorHierarchiesList() 
{
	if(gCurrentProject)
	{
		for(var i=0; i<gCurrentProject.generatorHierarchies.length; ++i)
		{
			if(ImGui.MenuItem(gCurrentProject.generatorHierarchies[i].name))
			{
				//gChosenGenerator = bg.generators[i];
			}
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
