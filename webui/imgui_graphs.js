var gGraphInstances = [];


function CreateGraphEditor(graph_name)
{
	gGraphInstances.push(
		{
			instance:bg.CreateGenerationGraph(graph_name),
			node_positions:[],
			selected_node_a:{name:"A", idx:0, input_pin:0,output_pin:0},
			selected_node_b:{name:"B", idx:0, input_pin:0,output_pin:0},
		} 
	);
}

function UpdateSelectedNodeInfo(selected_node, graph_instance)
{
	ImGui.PushID(selected_node.name);
	ImGui.Separator();
	ImGui.Text(selected_node.name);
	ImGui.SliderInt("Selected Node " + selected_node.name, (_ = selected_node.idx) => selected_node.idx = _, 0, graph_instance.nodes.length-1);
	if(selected_node.idx >= 0 && selected_node.idx < graph_instance.nodes.length)
	{
		var selected_graph_node = graph_instance.nodes[selected_node.idx];
		var selected_node_layout = bg.FindOrCreateNodeLayout(graph_instance.layout, selected_node.idx);
		ImGui.Text("Name : " + bg.GetGenerationGraphNodeName(selected_graph_node));
		ImGui.SliderInt("X", (_ = selected_node_layout.x) => selected_node_layout.x = _, -100, 500);
		ImGui.SliderInt("Y", (_ = selected_node_layout.y) => selected_node_layout.y = _, -100, 500);
		ImGui.Text("Inputs : ");
		ImGui.Indent();

		if(selected_graph_node.type == "generator")
		{
			var generator_inputs = selected_graph_node.generator.inputs;
			for([paramKey, paramData] of Object.entries(generator_inputs))
			{
				ImGui.Text(paramKey + " : " + paramData.type);
			}
			ImGui.SliderInt("Selected Input", (_ = selected_node.input_pin) => selected_node.input_pin = _, 0, Object.entries(generator_inputs).length-1);
			ImGui.Unindent();

			ImGui.Text("Outputs : ");
			ImGui.Indent();
			var generator_outputs = selected_graph_node.generator.outputs;
			for([paramKey, paramData] of Object.entries(generator_outputs))
			{
				ImGui.Text(paramKey + " : " + paramData.type);
			}
			ImGui.SliderInt("Selected Output", (_ = selected_node.output_pin) => selected_node.output_pin = _, 0, Object.entries(generator_outputs).length-1);
			ImGui.Unindent();

			ImGui.Text("Links : ");
			ImGui.Indent();
			var links = selected_graph_node.inputs;
			for(var i=0; i<links.length; ++i)
			{
				var link = links[i];
				ImGui.Text(link.fromNodeOutputName + " > " + link.toNodeInputName);
			}
			ImGui.Unindent();
		}
	}
	else
	{
		ImGui.Text("Invalid Node");
	}
	ImGui.PopID();
}

//var c_x = 0;
//var c_y = 0;
//function UpdateGraphEditor()
//{
//	if(gShowGraphEditor)
//	{
//		if(gGraphInstances.length == 0)
//		{
//			CreateGraphEditor("New Graph");
//		}
//
//		var graph_editor_instance = gGraphInstances[0];
//		var graph_instance = gGraphInstances[0].instance;
//		if(ImGui.Begin("Graph Editor - " + graph_instance.name))
//		{
//			var win_width = ImGui.GetContentRegionAvail().x;
//			var win_height = ImGui.GetContentRegionAvail().y;
//			var gens_width = Math.min(200, win_width * 0.5);
//
//			ImGui.BeginChild("GraphProperties", new ImGui.Vec2(gens_width, win_height))
//			ImGui.Text(graph_instance.name);
//
//			if(ImGui.Button("Create Test Setup"))
//			{
//				var person_node = bg.CreateGenerationGraphNode(gGraphInstances[0].instance, mm_personGenerator);
//				gGraphInstances[0].node_positions.push({x:0,y:10});
//
//				var suspect_node = bg.CreateGenerationGraphNode(gGraphInstances[0].instance, mm_suspectGenerator);
//				gGraphInstances[0].node_positions.push({x:300,y:10});
//
//				bg.CreateGenerationGraphLink(person_node, "data", suspect_node, "suspect");
//			}
//
//			ImGui.Text("Num Nodes : " + graph_instance.nodes.length);
//			ImGui.Indent();
//			for(var i=0; i<graph_instance.nodes.length; ++i)
//			{
//				var node = graph_instance.nodes[i];
//				ImGui.Text(node.generator.name);
//			}
//			ImGui.Unindent();
//
//			UpdateSelectedNodeInfo(graph_editor_instance.selected_node_a, graph_editor_instance);
//			UpdateSelectedNodeInfo(graph_editor_instance.selected_node_b, graph_editor_instance);
//
//			if(ImGui.Button("Add A:Output To B:Input Link"))
//			{
//				var node_a = graph_instance.nodes[graph_editor_instance.selected_node_a.idx];
//				var node_a_output_name = Object.entries(node_a.generator.outputs)[graph_editor_instance.selected_node_a.output_pin][0];
//				var node_b = graph_instance.nodes[graph_editor_instance.selected_node_b.idx];
//				var node_b_input_name = Object.entries(node_b.generator.inputs)[graph_editor_instance.selected_node_b.input_pin][0];
//				bg.CreateGenerationGraphLink(node_a, node_a_output_name, node_b, node_b_input_name);
//			}
//
//			ImGui.SliderInt("Canvas X", (_ = c_x) => c_x = _, 0, 1000);
//			ImGui.SliderInt("Canvas Y", (_ = c_y) => c_y = _, 0, 1000);
//			ImGui.EndChild();
//
//			ImGui.SameLine();
//
//			var dw = ImGui.GetWindowDrawList();
//
//			NodeImGui.BeginCanvas("canvas",  new ImGui.Vec2(win_width - gens_width, win_height));
//			NodeImGui.Current_Canvas.Scrolling.x = c_x;
//			NodeImGui.Current_Canvas.Scrolling.y = c_y;
//			for(var i=0; i<graph_instance.nodes.length; ++i)
//			{
//				var node = graph_instance.nodes[i];
//				NodeImGui.BeginNode(
//					node.idx,
//					node.generator.name,
//					graph_editor_instance.node_positions[i].x,
//					graph_editor_instance.node_positions[i].y
//				);
//
//				for([paramKey, paramData] of Object.entries(node.generator.inputs))
//				{
//					NodeImGui.InputPin(paramKey);
//				}
//
//				for([paramKey, paramData] of Object.entries(node.generator.outputs))
//				{
//					NodeImGui.OutputPin(paramKey);
//				}
//
//				//Input Links
//				for(var j=0; j<node.inputs.length; ++j)
//				{
//					var link = node.inputs[j];
//					NodeImGui.LinkNode(
//						link.fromNodeIdx,
//						link.fromNodeOutputName,
//						link.toNodeInputName
//					);
//				}
//
//				NodeImGui.EndNode();
//			}
//
//			if (ImGui.BeginPopupContextWindow())
//			{
//				if(ImGui.BeginMenu("Add Generator..."))
//				{
//					UpdateGeneratorsList(
//						function(generator)
//						{
//							bg.CreateGenerationGraphNode(gGraphInstances[0].instance, generator);
//							gGraphInstances[0].node_positions.push({x:0,y:0});
//						}
//					);
//					ImGui.EndMenu();
//				}
//
//				if(ImGui.MenuItem("Add Note / Comment"))
//				{
//				}
//
//				ImGui.EndPopup();
//			}
//
//			NodeImGui.EndCanvas();
//		}
//		ImGui.End();
//	}
//}

function UpdateGraphWindow(close_func, graph_instance)
{
	if(graph_instance.layout == null)
	{
		bg.AddGraphLayout(graph_instance);
	}

	ImGui.PushID(graph_instance.id);
	if(ImGui.Begin(`Graph Instance - ${graph_instance.name}###${graph_instance.id}`, close_func))
	{
		var win_width = ImGui.GetContentRegionAvail().x;
		var win_height = ImGui.GetContentRegionAvail().y;
		var gens_width = Math.min(200, win_width * 0.5);

		ImGui.BeginChild("GraphProperties", new ImGui.Vec2(gens_width, win_height))
		ImGui.Text(graph_instance.id);
		ImGui.InputText("Name", (_ = graph_instance.name) => graph_instance.name = _, 256);
		ImGui.InputText("Description", (_ = graph_instance.description) => graph_instance.description = _, 256);

		ImGui.Text("Num Nodes : " + graph_instance.nodes.length);
		ImGui.Indent();
		for(var i=0; i<graph_instance.nodes.length; ++i)
		{
			var node = graph_instance.nodes[i];
			ImGui.Text(bg.GetGenerationGraphNodeName(node));
		}
		ImGui.Unindent();

		var current_canvas = NodeImGui.GetOrCreateCanvas(graph_instance.id);
		UpdateSelectedNodeInfo(current_canvas.selected_node_a, graph_instance);
		UpdateSelectedNodeInfo(current_canvas.selected_node_b, graph_instance);

		ImGui.SliderInt("Canvas X", (_ = current_canvas.c_x) => current_canvas.c_x = _, 0, 1000);
		ImGui.SliderInt("Canvas Y", (_ = current_canvas.c_y) => current_canvas.c_y = _, 0, 1000);
		ImGui.EndChild();

		ImGui.SameLine();

		var dw = ImGui.GetWindowDrawList();

		NodeImGui.BeginCanvas(graph_instance.id,  new ImGui.Vec2(win_width - gens_width, win_height), graph_instance.layout);
		NodeImGui.Current_Canvas.Scrolling.x = current_canvas.c_x;
		NodeImGui.Current_Canvas.Scrolling.y = current_canvas.c_y;
		for(var i=0; i<graph_instance.nodes.length; ++i)
		{
			var node = graph_instance.nodes[i];
			NodeImGui.BeginNode(
				node.idx,
				bg.GetGenerationGraphNodeName(node)
			);

			if(node.type == "generator")
			{
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
			}
			else if(node.type == "data_def")
			{
				for(var j=0; j<node.data_def.fields.length; ++j)
				{
					NodeImGui.InputPin(node.data_def.fields[j].name);
				}
			}

			NodeImGui.EndNode();
		}
		
		if (NodeImGui.BeginPopupContextWindow())
		{
			if(ImGui.BeginMenu("Add Generator..."))
			{
				UpdateGeneratorsList(
					function(generator)
					{
						var node = bg.CreateGenerationGraph_GeneratorNode(graph_instance, generator);
						NodeImGui.SetNodePosToPopup(node.idx);
					}
				);
				ImGui.EndMenu();
			}

			if(ImGui.BeginMenu("Add Data Def..."))
			{
				UpdateDataDefsList(
					function(data_def)
					{
						var node = bg.CreateGenerationGraph_DataDefNode(graph_instance, data_def);
						NodeImGui.SetNodePosToPopup(node.idx);
					}
				);
				ImGui.EndMenu();
			}

			if(ImGui.MenuItem("Add Note / Comment"))
			{
			}

			NodeImGui.EndPopup();
		}
		NodeImGui.EndCanvas();
	}
	ImGui.End();
	ImGui.PopID();
}

function UpdateGeneratorGraphsList() 
{
	for(var i=0; i<bg.projects.length; ++i)
	{
		var project = bg.projects[i];
		
		if(ImGui.BeginMenu(project.name + " Graphs"))
		{
			for(var j=0; j<project.generatorGraphs.length; ++j)
			{
				if(ImGui.MenuItem(project.generatorGraphs[j].name))
				{
					//gChosenGenerator = bg.generators[j];
				}
			}
			ImGui.EndMenu();
		}
	}
}

function SetupGraphView()
{
	var canvas = document.getElementById('graphCanvas');
	paper.setup(canvas);
	paper.view.center = new paper.Point(0,0);
}

function RenderGraph()
{
	paper.project.activeLayer.removeChildren();
	if(gGeneratorGraph != null)
	{
		var RenderGraphLevel = function(nodes, lvl)
		{
			for(var i=0; i<nodes.length; ++i)
			{
				var graphNode = nodes[i];
				
				var nodeCenter = new paper.Point(0, lvl * 40);
				var rectangle = new paper.Rectangle();
				rectangle.center = nodeCenter;
				rectangle.size = new paper.Size(100, 30);
				var path = new paper.Path.Rectangle(rectangle);
				path.fillColor = '#e9e9ff';
				
				var txt = new paper.PointText(nodeCenter);
				txt.content = bg.GetGenerationGraphNodeName(graphNode);
				txt.justification = 'center';
				//path.selected = true;
				
				if(graphNode.inputs.length > 0)
				{
					var childNodes = [];
					for(var j=0; j<graphNode.inputs.length; ++j)
					{
						childNodes.push(graphNode.inputs[j].fromNode);
					}
					RenderGraphLevel(childNodes, lvl+1);
				}
			}
		};
		
		RenderGraphLevel(gGeneratorGraph.nodes, 0);
	}
	paper.view.draw();
}


function UpdateGraphsTable_AddCatRow(cat, cat_name, is_root, selected_func)
{
	ImGui.PushID(cat_name);
	var open = true;
	if(is_root == false)
	{
		ImGui.TableNextRow();
		ImGui.TableSetColumnIndex(0);
		open = ImGui.TreeNodeEx(cat_name, ImGui.TreeNodeFlags.SpanFullWidth);
		ImGui.TableSetColumnIndex(1);
		ImGui.TextUnformatted("-");
	}
	if(open)
	{
		for([key, data] of Object.entries(cat.children))
		{
			UpdateGraphsTable_AddCatRow(data, key, false, selected_func);
		}
		for(graph of cat.objects)
		{
			ImGui.TableNextRow();
			ImGui.TableSetColumnIndex(0);
			if(ImGui.Button(graph.name))
			{
				selected_func(graph);
			}
			ImGui.TableSetColumnIndex(1);
			if(graph.description != null)
			{
				ImGui.TextUnformatted(graph.description);
			}
			else
			{
				ImGui.TextUnformatted("-");
			}
		}

		if(is_root == false)
		{
			ImGui.TreePop();
		}
	}
	ImGui.PopID();
}

function UpdateGraphsTable(id, graphs, selected_func)
{
	//Mighg be slow as shit
	var categories = BuildGraphOfCategories(graphs);

	var flags = ImGui.TableFlags.Borders | ImGui.TableFlags.RowBg;
	if (ImGui.BeginTable(id, 2, flags))
	{
		ImGui.TableSetupColumn("Name");
		ImGui.TableSetupColumn("Description");
		ImGui.TableHeadersRow();

		UpdateGraphsTable_AddCatRow(categories, "DataDefs", true, selected_func);
		
		ImGui.EndTable();
	}
}

function CreateExplorerGraphNode(project, graph)
{
	return {
		project:project,
		id:graph.id,
		graph:graph,
		GetNodeName:function() { return graph.name; },
		GetNodeIcon:function() { return "f"; },
		GetNodeChildren:function()
		{ 
			var children = [];
			return children; 
		}
	};
}

function CreateExplorerGraphCategoryNode(project, cat_name, category)
{
	return {
		project:project,
		id:cat_name,
		category:category,
		GetNodeName:function() { return cat_name; },
		GetNodeIcon:function() { return "n"; },
		GetNodeChildren:function()
		{ 
			var children = [];
			for([key, data] of Object.entries(category.children))
			{
				children.push( CreateExplorerGraphCategoryNode(project, key, data));
			}
		
			for(data_def of category.objects)
			{
				children.push( CreateExplorerGraphNode(project, data_def) );
			}
			return children; 
		}
	};
}

function CreateExplorerGraphsNode(project)
{
	return {
		project:project,
		id:"graphs_" + project.id,
		GetNodeName:function() { return "Graphs"; },
		GetNodeIcon:function() { return "q"; },
		GetNodeChildren:function()
		{
			var children = [];

			//Might be slow as shit
			var categories = BuildGraphOfCategories(project.dataDefs);

			for([key, data] of Object.entries(categories.children))
			{
				children.push( CreateExplorerGraphCategoryNode(project, key, data));
			}

			for(g of categories.objects)
			{
				children.push( CreateExplorerGraphNode(project, g) );
			}

			return children;
		}
	};
}