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

// WIP

// func_graph_add_pins = Called when updating the graph canvas to add pins to the node
var gGraphNodeTypes = {};
function RegisterGraphEditorNodeType(node_type, func_get_node_title, func_add_node, func_update_node_info, func_graph_add_pins)
{
	var node_type_data = {
		type:node_type,
		get_node_title:func_get_node_title,
		add_node:func_add_node,
		update_node_info:func_update_node_info,
		graph_add_pins:func_graph_add_pins
	};
	gGraphNodeTypes[node_type] = node_type_data;
}

RegisterGraphEditorNodeType(
	"generator",
	function(graph_instance, node)
	{
		return `${bg.GetGenerationGraphNodeName(node)} (${node.type})`;
	},
	function(graph_instance)
	{
		if(ImGui.BeginMenu("Add Generator..."))
		{
			UpdateGeneratorsList(
				function(selected)
				{
					var node = bg.CreateGenerationGraph_GeneratorNode(graph_instance, selected);
					NodeImGui.SetNodePosToPopup(node.id);
				}
			);
			ImGui.EndMenu();
		}
	},
	function(graph_instance, selected_graph_node)
	{
		var generator = AssetDb.GetAsset(gAssetDb, selected_graph_node.asset_id, selected_graph_node.type);
		ImGui.Text("Node id : " + selected_graph_node.id);
		ImGui.Text("Generator id : " + generator.id);
		ImGui.Text("Generator Name : " + generator.name);
	},
	function(graph_instance, node)
	{
		var generator = AssetDb.GetAsset(gAssetDb, node.asset_id, node.type);
		for(field of generator.inputs.fields)
		{
			var connection = NodeImGui.InputPin(field.id, field.name, field.type, CanLinkGenGraphNodes);
			ProcessGraphConnection(graph_instance, connection);
		}

		for(field of generator.outputs.fields)
		{
			var connection = NodeImGui.OutputPin(field.id, field.name, field.type, CanLinkGenGraphNodes);
			ProcessGraphConnection(graph_instance, connection);
		}
	}
);


RegisterGraphEditorNodeType(
	"data_def",
	function(graph_instance, node)
	{
		return `${bg.GetGenerationGraphNodeName(node)} (${node.type})`;
	},
	function(graph_instance)
	{
		if(ImGui.BeginMenu("Add Data Def..."))
		{
			UpdateDataDefsList(
				function(selected)
				{
					var node = bg.CreateGenerationGraph_DataDefNode(graph_instance, selected);
					NodeImGui.SetNodePosToPopup(node.id);
				}
			);
			ImGui.EndMenu();
		}
	},
	function(graph_instance, selected_graph_node)
	{
	},
	function(graph_instance, node)
	{
		NodeImGui.NodeColour(new ImGui.ImColor(0.25, 0.38, 0.55, 1.00));
		var data_def = AssetDb.GetAsset(gAssetDb, node.asset_id, node.type);

		NodeImGui.InputPin("", "This Data Def", "data_def");
		for(var j=0; j<data_def.fields.length; ++j)
		{
			var field = data_def.fields[j];
			NodeImGui.InputPin(field.id, field.name, field.type);
		}
		NodeImGui.OutputPin("", "", "data_def");
		for(var j=0; j<data_def.fields.length; ++j)
		{
			var field = data_def.fields[j];
			NodeImGui.OutputPin(field.id, "", field.type);
		}
	}
);

RegisterGraphEditorNodeType(
	"data_table",
	function(graph_instance, node)
	{
		return `${bg.GetGenerationGraphNodeName(node)} (${node.type})`;
	},
	function(graph_instance)
	{
		if(ImGui.BeginMenu("Add Data Table"))
		{
			UpdateDataTablesList(
				function(selected)
				{
					var node = bg.CreateGenerationGraph_DataTableNode(graph_instance, selected);
					NodeImGui.SetNodePosToPopup(node.id);
				}
			);
			ImGui.EndMenu();
		}
	},
	function(graph_instance, selected_graph_node)
	{
	},
	function(graph_instance, node)
	{
		NodeImGui.NodeColour(new ImGui.ImColor(0.33, 0.48, 0.24, 1.00));
		var data_table = AssetDb.GetAsset(gAssetDb, node.asset_id, node.type);
	}
);

RegisterGraphEditorNodeType(
	"gen_graph",
	function(graph_instance, node)
	{
		return `${bg.GetGenerationGraphNodeName(node)} (${node.type})`;
	},
	function(graph_instance)
	{
		if(ImGui.BeginMenu("Add Generator Graph"))
		{
			UpdateGeneratorGraphsList(
				function(selected)
				{
					var node = bg.CreateGenerationGraph_GenGraphNode(graph_instance, selected);
					NodeImGui.SetNodePosToPopup(node.id);
				}
			);
			ImGui.EndMenu();
		}
	},
	function(graph_instance, selected_graph_node)
	{

	},
	function(graph_instance, node)
	{
		NodeImGui.NodeColour(new ImGui.ImColor(0.33, 0.48, 0.24, 1.00));
	}
);

RegisterGraphEditorNodeType(
	"output",
	function(graph_instance, node)
	{
		return "Output";
	},
	function(graph_instance)
	{
	},
	function(graph_instance, selected_graph_node)
	{
		ImGui.Text("Output Node");
	},
	function(graph_instance, node)
	{
		// TODO check pin id
		var connection = NodeImGui.InputPin(node.id, "Output", "any", CanLinkGenGraphNodes);
		ProcessGraphConnection(graph_instance, connection);
	}
);

RegisterGraphEditorNodeType(
	"value",
	function(graph_instance, node)
	{
		return "Value";
	},
	function(graph_instance)
	{
		if(ImGui.BeginMenu("Add Value"))
		{
			var fieldTypes = GetSortedObjectKeys(bg.fieldTypes);
			for(var fieldTypeId of fieldTypes)
			{
				if(ImGui.MenuItem(fieldTypeId))
				{
					var node = bg.CreateGenerationGraph_ValueNode(graph_instance, bg.fieldTypes[fieldTypeId]);
					NodeImGui.SetNodePosToPopup(node.id);
				}
			}
			ImGui.EndMenu();
		}
	},
	function(graph_instance, selected_graph_node)
	{
		var field_types_list = Object.keys(bg.fieldTypes);
		var field_type_idx = field_types_list.indexOf(selected_graph_node.fieldTypeId);
		if(ImGui.Combo("##Field Type To Make", (_ = field_type_idx) => field_type_idx = _, GetFieldTypeName, bg.fieldTypes, field_types_list.length))
		{
			selected_graph_node.fieldTypeId = field_types_list[field_type_idx];
			selected_graph_node.value = bg.CreateDefaultFieldValue(selected_graph_node.fieldTypeId);
			selected_graph_node.fieldData = bg.CreateDefaultFieldDef(selected_graph_node.fieldTypeId);
		}
		
		UpdateEditorForValue(
			"Value", 
			selected_graph_node.fieldTypeId,
			selected_graph_node.fieldData,
			function() { 
				return selected_graph_node.value;
			}, 
			function(v) {
				 selected_graph_node.value = v;
			}
		);
	},
	function(graph_instance, node)
	{
		NodeImGui.OutputPin(node.id, "Value", node.fieldTypeId);
	}
);

RegisterGraphEditorNodeType(
	"comment",
	function(graph_instance, node)
	{
		return "Comment";
	},
	function(graph_instance)
	{
		if(ImGui.MenuItem("Add Note / Comment"))
		{
			var node = bg.CreateGenerationGraph_CommentNode(graph_instance);
			NodeImGui.SetNodePosToPopup(node.id);
		}
	},
	function(graph_instance, selected_graph_node)
	{
		ImGui.InputText("Comment", (_ = selected_graph_node.comment) => selected_graph_node.comment = _, 256);
	},
	function(graph_instance, node)
	{
		NodeImGui.NodeColour(new ImGui.ImColor(0.65, 0.58, 0.26, 1.00));
		NodeImGui.AddInfoText(node.comment);
	}
);

function UpdateSelectedNodeInfo(selected_node, graph_instance)
{
	ImGui.PushID(selected_node.name);
	ImGui.Separator();
	ImGui.Text(selected_node.name);
	// ImGui.SliderInt("Selected Node " + selected_node.name, (_ = selected_node.idx) => selected_node.idx = _, 0, graph_instance.nodes.length-1);
	// if(selected_node.idx >= 0 && selected_node.idx < graph_instance.nodes.length)
	// {
	// 	var selected_graph_node = graph_instance.nodes[selected_node.idx];
	// 	var selected_node_layout = bg.FindOrCreateNodeLayout(graph_instance.layout, selected_node.idx);
	// 	ImGui.Text("Name : " + bg.GetGenerationGraphNodeName(selected_graph_node));
	// 	ImGui.SliderInt("X", (_ = selected_node_layout.x) => selected_node_layout.x = _, -100, 500);
	// 	ImGui.SliderInt("Y", (_ = selected_node_layout.y) => selected_node_layout.y = _, -100, 500);
	// 	ImGui.Text("Inputs : ");
	// 	ImGui.Indent();

	// 	var nodeType = gGraphNodeTypes[selected_graph_node.type];
	// 	if(nodeType != null && nodeType.update_node_info != null)
	// 	{
	// 		nodeType.update_node_info(graph_instance, selected_graph_node);
	// 	}
	// }
	// else
	// {
	// 	ImGui.Text("Invalid Node");
	// }
	ImGui.PopID();
}

function ProcessGraphConnection(graph, connection)
{
	if(connection != null)
	{
		if(connection.break)
		{
			//TODO
			bg.RemoveGenerationGraphLink();
		}
		else
		{
			var output_graph_node = bg.GetGraphNodeById(graph, connection.output_node.id);
			var input_graph_node = bg.GetGraphNodeById(graph, connection.input_node.id);

			var output_pin_id = connection.output_node.output_pins[connection.output_idx].id;
			var input_pin_id = connection.input_node.input_pins[connection.input_idx].id;

			bg.CreateGenerationGraphLink(
				graph, 
				output_graph_node, 
				output_pin_id,
				input_graph_node, 
				input_pin_id
			);
		}
	}
}


var CanLinkGenGraphNodes = function(connection_data)
{
	return true;
}

function UpdateExecutionList(graph_instance, execution_list, nextStep = -1)
{
	ImGui.PushID(graph_instance.id);
	if(ImGui.BeginTable("exe_list", 4, ImGui.TableFlags.Resizable | ImGui.TableFlags.BordersOuter | ImGui.TableFlags.BordersV | ImGui.TableFlags.RowBg))
	{
		ImGui.SetColumnWidth(50);
		ImGui.TableSetupColumn("Step");
		ImGui.TableSetupColumn("Cmd");
		ImGui.TableSetupColumn("Data");
		ImGui.TableSetupColumn("Debug");
		ImGui.TableHeadersRow();
	
		for(var i=0; i<execution_list.length; ++i)
		{
			ImGui.TableNextRow();
			ImGui.TableNextColumn();
			var step = execution_list[i];
			if(i == nextStep)
			{
				ImGui.Text(">");
			}
			
			ImGui.TableNextColumn();
			ImGui.Text(`${step.cmd}`);
			if(step.cmd == "gen")
			{
				if(ImGui.IsItemHovered())
				{
					graph_instance._highlighted.nodes.push(step.id);
				}
			}
			else if(step.cmd == "copy")
			{
				if(ImGui.IsItemHovered())
				{
					graph_instance._highlighted.links.push(
						{
							from_id:step.from,
							from_sub_id:step.from_output,
							to_id:step.to,
							to_sub_id:step.to_input
						}
					);
				}
			}

			ImGui.TableNextColumn();
			if(step.cmd == "gen")
			{
				var exeNode = bg.GetGraphNodeById(graph_instance, step.id);
				var generator = AssetDb.GetAsset(gAssetDb, exeNode.asset_id, "generator");
				ImGui.Text(`${generator.name} ${step.id}`);
			}
			else if(step.cmd == "copy")
			{
				var from_node = bg.GetGraphNodeById(graph_instance, step.from);
				var to_node = bg.GetGraphNodeById(graph_instance, step.to);
				
				ImGui.Text(`From : `);
				if(from_node.type == "generator")
				{
					var generator = AssetDb.GetAsset(gAssetDb, from_node.asset_id, "generator"); 
					ImGui.SameLine();
					ImGui.Text(generator.name);      
				}
				ImGui.SameLine();
				ImGui.Text(`${step.from}`);

				ImGui.Text(`To : `);
				if(to_node.type == "generator")
				{
					var generator = AssetDb.GetAsset(gAssetDb, to_node.asset_id, "generator"); 
					ImGui.SameLine();
					ImGui.Text(generator.name);      
				}
				ImGui.SameLine();
				ImGui.Text(`${step.to}`);
			}

			ImGui.TableNextColumn();
			if(step.cmd == "gen")
			{
				if(ImGui.Button("Open..."))
				{
					var exeNode = bg.GetGraphNodeById(graph_instance, step.id);
					var generator = AssetDb.GetAsset(gAssetDb, exeNode.asset_id, "generator");
					OpenWindow(generator.id, UpdateGeneratorWindow, generator);
				}
			}
		}
		ImGui.EndTable();
	}
	ImGui.PopID();
}

function UpdateExecutionContext(graph_instance, execution_context)
{
	UpdateExecutionList(graph_instance, execution_context.executionList, execution_context.nextStepToExecute);
	if(execution_context.lastGenOutput)
	{
		UpdateObjectImGui(execution_context.lastGenOutput, "output");
	}
	else
	{
		ImGui.Text("No Last Generator Output");
	}
}

// Add to an imgui window imgui controls for viewing and using an generator graph
function UpdateGenGraphEditor(graph_instance)
{
	if(ImGui.BeginTable("graph_view", 2, ImGui.TableFlags.Resizable | ImGui.TableFlags.BordersOuter | ImGui.TableFlags.BordersV))
	{
		ImGui.TableNextRow();

		ImGui.SetColumnWidth(200);
		ImGui.TableNextColumn();
		{
			if(graph_instance._selected_node == null)
			{
				ImGui.Text("No Node Selected");
			}
			else
			{
				var nodeType = gGraphNodeTypes[graph_instance._selected_node.type];
				if(nodeType && nodeType.update_node_info)
				{
					nodeType.update_node_info(graph_instance, graph_instance._selected_node);
				}
				else
				{
					ImGui.Text("Unknown Node Type");
				}
			}
			ImGui.Separator();

			if(ImGui.Button("Execute Graph"))
			{
				bg.ExecuteGeneratorGraph(graph_instance);
			}

			ImGui.Text("Graph Info");
			ImGui.Text("Id : " + graph_instance.id);
			ImGui.Text("Output");
			if(ImGui.CollapsingHeader("Debug"))
			{
				ImGui.Indent();
				if(ImGui.Button("Make Execution List"))
				{
					var executionList = bg.CreateGenerationGraphExecutionList(graph_instance);
					graph_instance._tempExecutionList = executionList;
				}
				if(graph_instance._tempExecutionList)
				{
					UpdateExecutionList(graph_instance, graph_instance._tempExecutionList);
				}

				if(ImGui.Button("Make Execution Context"))
				{
					var context = bg.CreateGenerationGraphExecutionContext(graph_instance);
					graph_instance._tempExecutionContext = context;
				}
				if(graph_instance._tempExecutionContext)
				{
					if(ImGui.Button("Execute Next Step"))
					{
						bg.ExecuteNextStepGenerationGraphExecutionContext(graph_instance._tempExecutionContext);
					}
					UpdateExecutionContext(graph_instance, graph_instance._tempExecutionContext);
				}
				ImGui.Unindent();
			}
		}
		
		ImGui.TableNextColumn();
		UpdateGenGraphCanvas(graph_instance, graph_instance._highlighted);
		graph_instance._highlighted = {
			nodes:[],
			links:[]
		};

		ImGui.EndTable();
	}
}

// Update an imgui node canvas specifically for a generator graph.
// highlighted.nodes = list of node ids to highlght, highlighted.links = list of links to highlight
function UpdateGenGraphCanvas(graph_instance, highlighted = {}, canvas_width = -1, canvas_height = -1)
{
	if(highlighted == null)
	{
		highlighted = {};
	}

	NodeImGui.BeginCanvas(graph_instance.id,  new ImGui.Vec2(canvas_width, canvas_height), graph_instance.layout);
	for(var i=0; i<graph_instance.nodes.length; ++i)
	{
		var node = graph_instance.nodes[i];
		var node_title = `? (${node.type})`;
		var nodeType = gGraphNodeTypes[node.type];
		if(nodeType != null && nodeType.get_node_title != null)
		{
			node_title = nodeType.get_node_title(graph_instance, node);
		}
		
		if(NodeImGui.BeginNode(
			node.id,
			node_title
		))
		{
			graph_instance._selected_node = node;
		}

		if(highlighted.nodes && highlighted.nodes.includes(node.id) )
		{
			NodeImGui.HighlightNode();
		}

		if(nodeType != null && nodeType.graph_add_pins)
		{
			nodeType.graph_add_pins(graph_instance, node);
		}

		NodeImGui.EndNode();
	}

	// Do all links after nodes are defined
	for(var i=0; i<graph_instance.nodes.length; ++i)
	{
		var node = graph_instance.nodes[i];	

		//Input Links
		var remove_link = {
			do_remove:false
		};

		bg.ForEachGraphEdgeIntoNode(
			graph_instance,
			node.id,
			function(from_node_id, sub_id, to_node_id, to_sub_id)
			{
				if(NodeImGui.LinkNodes(
					from_node_id,
					sub_id,
					to_node_id,
					to_sub_id
				) == false)
				{
					remove_link.from_node_id = from_node_id;
					remove_link.sub_id = sub_id;
					remove_link.to_node_id = to_node_id;
					remove_link.to_sub_id = to_sub_id;
					remove_link.do_remove = true;
				}

				if(highlighted.links)
				{
					var found = highlighted.links.find(
						(element) => element.from_id == from_node_id
							&& element.from_sub_id == sub_id
							&& element.to_id == to_node_id
							&& element.to_sub_id == to_sub_id
					);
					if(found)
					{
						NodeImGui.HighlightLink();
					}
				}
			}
		)

		if(remove_link.do_remove)
		{
			bg.RemoveGenerationGraphLinkById(
				graph_instance,
				remove_link.from_node_id,
				remove_link.sub_id,
				remove_link.to_node_id,
				remove_link.to_sub_id
			);
		}
	}
	
	if (NodeImGui.BeginPopupContextWindow())
	{
		for(const [key, value] of Object.entries(gGraphNodeTypes))
		{
			if(value.add_node)
			{
				value.add_node(graph_instance);
			}
		}

		NodeImGui.EndPopup();
	}
	NodeImGui.EndCanvas();
}

function UpdateGenGraphWindow(close_func, graph_instance)
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

		var category_str = graph_instance.category.join("/");
		if(ImGui.InputText("Categories", (_ = category_str) => category_str = _, 256))
		{
			graph_instance.category = category_str.split("/");
		}

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


		//current_canvas.Scrolling.x = current_canvas.c_x;
		//current_canvas.Scrolling.y = current_canvas.c_y;
		UpdateGenGraphCanvas(graph_instance, {}, win_width - gens_width, win_height);
	}
	ImGui.End();
	ImGui.PopID();
}

function UpdateGeneratorGraphsList(selected_func = null) 
{
	if(selected_func == null)
	{
		selected_func = function(data_def)
		{
			//OpenWindow(data_def.id, UpdateDataDefWindow, data_def);
		};
	}
	UpdateProjectItemsMenuList(selected_func, "Generator Graphs", "generatorGraphs");
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
		},
		UpdateNodeValue:function()
		{
			if(ImGui.Button("Open..."))
			{
				OpenWindow(graph.id, UpdateGenGraphWindow, graph);
			}
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
		GetNodeIcon:function() { return "z"; },
		GetNodeChildren:function()
		{
			var children = [];

			//Might be slow as shit
			var categories = BuildGraphOfCategories(project.generatorGraphs);

			for([key, data] of Object.entries(categories.children))
			{
				children.push( CreateExplorerGraphCategoryNode(project, key, data));
			}

			for(g of categories.objects)
			{
				children.push( CreateExplorerGraphNode(project, g) );
			}

			return children;
		},
		UpdateContextMenu:function()
		{
			if(ImGui.Button("Create New Graph..."))
			{
				var graph = bg.CreateEmptyProjectGraph(project);
				OpenWindow(graph.id, UpdateGenGraphWindow, graph);
                ImGui.CloseCurrentPopup();
			}
		}
	};
}