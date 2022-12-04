var gShowHierarchyEditor = false;
var gHierarchyInstances = [];

function fmodf(a, b) { return a - (Math.floor(a / b) * b); }

var NodeImGui = {
	Canvases:{},
	BeginCanvas : function(id)
	{
		NodeImGui.Current_CanvasImGuiId = ImGui.GetID(id);
		NodeImGui.Current_Canvas = NodeImGui.Canvases[NodeImGui.Current_CanvasImGuiId];
		if(NodeImGui.Current_Canvas == null)
		{
			NodeImGui.Current_Canvas = {};
			NodeImGui.Canvases[NodeImGui.Current_CanvasImGuiId] = NodeImGui.Current_Canvas;
		}

		NodeImGui.Current_Canvas.Nodes = {};
		NodeImGui.Current_Canvas.Links = [];
		NodeImGui.Current_Canvas.Current_NodeImGuiId = 0;
		NodeImGui.Current_Canvas.Current_Node = null;
		NodeImGui.Current_Canvas.Scrolling = {x:0, y:0};
	},
	BeginNode : function(id, name, node_x, node_y)
	{
		var canvas = NodeImGui.Current_Canvas;
		canvas.Current_NodeImGuiId = ImGui.GetID(id);
		canvas.Current_Node = canvas.Nodes[canvas.Current_NodeImGuiId];
		if(canvas.Current_Node == null)
		{
			canvas.Current_Node = {};
			canvas.Nodes[canvas.Current_NodeImGuiId] = canvas.Current_Node;
		}
		canvas.Current_Node.id = id;
		canvas.Current_Node.name = name;
		canvas.Current_Node.x = node_x;
		canvas.Current_Node.y = node_y;
		canvas.Current_Node.input_pins = [];
		canvas.Current_Node.output_pins = [];
	},
	InputPin : function(pin_id)
	{
		NodeImGui.Current_Canvas.Current_Node.input_pins.push(
			{
				id:pin_id
			}
		);
	},
	OutputPin : function(pin_id)
	{
		NodeImGui.Current_Canvas.Current_Node.output_pins.push(
			{
				id:pin_id
			}
		);
	},
	LinkNode : function(from_id, from_pin, to_pin)
	{
		var from_imgui_id = ImGui.GetID(from_id);
		NodeImGui.Current_Canvas.Links.push(
			{
				from_imgui_id:from_imgui_id,
				from_pin:from_pin,
				to_pin:to_pin,
				to_imgui_id:NodeImGui.Current_Canvas.Current_NodeImGuiId
			}
		);
	},
	EndNode : function()
	{
		NodeImGui.Current_Canvas.Current_Node = null;
	},
	Internal_DrawNode : function(node)
	{
		var node_x = node.x;
		var node_y = node.y;

		var dl = ImGui.GetWindowDrawList();

		var num_inputs = node.input_pins.length;
		var num_outputs = node.output_pins.length;
		var max_pins = num_inputs > num_outputs ? num_inputs : num_outputs;
		var line_space = 20;

		var x = ImGui.GetWindowPos().x;
		var y = ImGui.GetWindowPos().y;
		node_x += x;
		node_y += y;
		var node_w = 170;
		var node_border = 5;
		var pin_diam = 8;
		var node_inner_x = node_x + node_border;
		var title_height = 25;
		var node_inner_y = node_y + title_height + node_border;
		var node_h = (max_pins * line_space) + title_height + (node_border * 1);

		var bg_col = new ImGui.ImColor(0.15, 0.15, 0.25, 1.00);
		var title_bg_col = new ImGui.ImColor(0.3, 0.3, 0.4, 1.00);
		var title_txt_col = new ImGui.ImColor(1.0, 1.0, 1.0, 1.00);
		var pin_col = new ImGui.ImColor(1.0, 1.0, 1.0, 1.00);
		var pin_inner_col = new ImGui.ImColor(0.0, 0.0, 0.0, 1.00);

		//background
		dl.AddRectFilled(new ImGui.Vec2(node_x, node_y), new ImGui.Vec2(node_x + node_w, node_y + node_h), bg_col.toImU32());
		//title bar
		dl.AddRectFilled(new ImGui.Vec2(node_x, node_y), new ImGui.Vec2(node_x + node_w, node_y + title_height), title_bg_col.toImU32());
		dl.AddText({x:node_inner_x, y:node_y+node_border}, title_txt_col.toImU32(), node.name);


		for(var i=0; i<num_inputs;++i)
		{
			var pin_text =  node.input_pins[i].id;
			var text_x = node_inner_x + pin_diam;
			var text_y = node_inner_y + (i*line_space); 
			var pin_x = node_inner_x;
			var pin_y = text_y + (ImGui.GetTextLineHeight() / 2.0);
			node.input_pins[i].x = pin_x;
			node.input_pins[i].y = pin_y;
			dl.AddCircleFilled({x:pin_x,y:pin_y}, pin_diam * 0.8, pin_col.toImU32(), 8);
			dl.AddCircleFilled({x:pin_x,y:pin_y}, pin_diam * 0.6, pin_inner_col.toImU32(), 8);
			dl.AddText({x:text_x, y:text_y}, title_txt_col.toImU32(), pin_text);
		}

		for(var i=0; i<num_outputs;++i)
		{
			var pin_text =  node.output_pins[i].id;
			var text_width = ImGui.CalcTextSize(pin_text).x;
			var text_y = node_inner_y + (i*line_space); 
			var text_x = node_x + node_w - node_border - text_width - pin_diam;
			var pin_y = text_y + (ImGui.GetTextLineHeight() / 2.0);
			var pin_x = node_x + node_w - node_border;
			node.output_pins[i].x = pin_x;
			node.output_pins[i].y = pin_y;
			dl.AddCircleFilled({x:pin_x,y:pin_y}, pin_diam * 0.8, pin_col.toImU32(), 8);
			dl.AddCircleFilled({x:pin_x,y:pin_y}, pin_diam * 0.6, pin_inner_col.toImU32(), 8);
			dl.AddText({x:text_x, y:text_y}, title_txt_col.toImU32(), pin_text);
		}
	},
	Internal_DrawLink : function(link)
	{
		var canvas = NodeImGui.Current_Canvas;
		var from_node = canvas.Nodes[link.from_imgui_id];
		var to_node = canvas.Nodes[link.to_imgui_id];

		var out_pin = null;
		for(var i=0; i<from_node.output_pins.length; ++i)
		{
			var from_out_pin = from_node.output_pins[i];
			if(from_out_pin.id == link.from_pin)
			{
				out_pin = from_out_pin;
				break;
			}
		}
		
		var in_pin = null;
		for(var i=0; i<to_node.input_pins.length; ++i)
		{
			var to_in_pin = to_node.input_pins[i];
			if(to_in_pin.id == link.to_pin)
			{
				in_pin = to_in_pin;
				break;
			}
		}

		var link_col = new ImGui.ImColor(0.7, 0.7, 0.7, 1.00);
		var link_thickness = 2.0;
		var sz = {value:150}
		var x = ImGui.GetWindowPos().x + 50;
		var y = ImGui.GetWindowPos().y + 50;
		var cp4 = [    
			{x:out_pin.x, y:out_pin.y},     
			{x:out_pin.x + 60, y:out_pin.y},
			{x:in_pin.x - 60, y:in_pin.y},
			{x:in_pin.x, y:in_pin.y}
		];

		var dl = ImGui.GetWindowDrawList();
		var curve_segments = 32;
		dl.AddBezierCubic(cp4[0], cp4[1], cp4[2], cp4[3], link_col.toImU32(), link_thickness, curve_segments);

	},
	EndCanvas : function()
	{
		var canvas = NodeImGui.Current_Canvas;
		var dl = ImGui.GetWindowDrawList();
		var canvas_sz = ImGui.GetContentRegionAvail();
		var canvas_p0 = ImGui.GetCursorScreenPos();

		//Draw BG
		dl.AddRectFilled(canvas_p0, canvas_p1, ImGui.COL32(50, 50, 50, 255));

		//Draw BG Grid
		var GRID_STEP = 64.0;
		const canvas_p1 = new ImGui.Vec2(canvas_p0.x + canvas_sz.x, canvas_p0.y + canvas_sz.y);
		for (var x = fmodf(canvas.Scrolling.x, GRID_STEP); x < canvas_sz.x; x += GRID_STEP)
		{
			dl.AddLine(new ImGui.Vec2(canvas_p0.x + x, canvas_p0.y), new ImGui.Vec2(canvas_p0.x + x, canvas_p1.y), ImGui.COL32(200, 200, 200, 40));
		}

		for (let y = fmodf(canvas.Scrolling.y, GRID_STEP); y < canvas_sz.y; y += GRID_STEP)
		{
			dl.AddLine(new ImGui.Vec2(canvas_p0.x, canvas_p0.y + y), new ImGui.Vec2(canvas_p1.x, canvas_p0.y + y), ImGui.COL32(200, 200, 200, 40));
		}
	
		//Draw Nodes
		for([node_id, node] of Object.entries(canvas.Nodes))
        {
			NodeImGui.Internal_DrawNode(node);
		}

		//Draw Links
		for(var i=0; i<canvas.Links.length; ++i)
		{
			NodeImGui.Internal_DrawLink(canvas.Links[i]);
		}

		NodeImGui.Current_Canvas = null;
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
			ImGui.BeginChild("Canvas", new ImGui.Vec2(win_width - gens_width, win_height))

			var dw = ImGui.GetWindowDrawList();

			NodeImGui.BeginCanvas("canvas");
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
			NodeImGui.EndCanvas();

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
