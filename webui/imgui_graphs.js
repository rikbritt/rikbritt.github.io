var GenGraphImGui = {
	graphNodeTypes:{}
};

// WIP

// func_graph_add_pins = Called when updating the graph canvas to add pins to the node
GenGraphImGui.RegisterGraphEditorNodeType = function(node_type_id, func_get_node_title, func_add_node, func_update_node_info, func_graph_add_pins, func_node_context_menu)
{
	var node_type_data = {
		type:node_type_id,
		get_node_title:func_get_node_title,
		add_node:func_add_node,
		update_node_info:func_update_node_info,
		graph_add_pins:func_graph_add_pins,
		node_context_menu:func_node_context_menu
	};
	GenGraphImGui.graphNodeTypes[node_type_id] = node_type_data;
}

GenGraphImGui.GetGraphNodeType = function(node_type_id)
{
	return GenGraphImGui.graphNodeTypes[node_type_id];
}


function UpdateSelectedNodeInfo(selected_node, graph_instance)
{
	ImGui.PushID(selected_node.name);
	ImGui.Separator();
	ImGui.Text(selected_node.name);

	var layout = bg.FindOrCreateNodeLayout(graph_instance.layout, selected_node.id);
	ImGui.Text(`x:${layout.x} y:${layout.y}`);
	ImGui.PopID();
}

GenGraphImGui.InputPin = function(graph_instance, id, name, type)
{
	var connection = NodeImGui.InputPin(id, name, type, CanLinkGenGraphNodes);
	GenGraphImGui.ProcessGraphConnection(graph_instance, connection);
}

GenGraphImGui.OutputPin = function(graph_instance, id, name, type)
{
	var connection = NodeImGui.OutputPin(id, name, type, CanLinkGenGraphNodes);
	GenGraphImGui.ProcessGraphConnection(graph_instance, connection);
}

GenGraphImGui.ProcessGraphConnection = function(graph, connection)
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

			if(ImGui.IsItemHovered())
			{
				// If step has a node id, highlight it
				if(step.id)
				{
					graph_instance._highlighted.nodes.push(step.id);
				}

				// If step has a link, highlight it
				if(step.from)
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
	
	UpdateObjectImGui(execution_context, "context", false /* open by default*/);

	if(execution_context.lastNodeOutput)
	{
		UpdateObjectImGui(execution_context.lastNodeOutput, "output");
	}
	else
	{
		ImGui.Text("No Last Generator Output");
	}
}

// Add to an imgui window imgui controls for viewing and using an generator graph
function UpdateGenGraphEditor(graph_instance)
{
	if(ImGui.BeginTable("graph_view", 2, ImGui.TableFlags.SizingFixedFit | ImGui.TableFlags.Resizable | ImGui.TableFlags.BordersOuter | ImGui.TableFlags.BordersV))
	{
		ImGui.TableSetupColumn("##options", ImGui.TableColumnFlags.WidthFixed);
		ImGui.TableSetupColumn("##canvas", ImGui.TableColumnFlags.WidthStretch);

		ImGui.TableNextRow();

		ImGui.TableNextColumn();
		{
			if(graph_instance._selected_node == null)
			{
				ImGui.Text("No Node Selected");
			}
			else
			{
				ImGui.Text(`Node Id: ${graph_instance._selected_node.id}`);
				ImGui.Text(`Type: ${graph_instance._selected_node.type}`);

				var layout = bg.FindOrCreateNodeLayout(graph_instance.layout, graph_instance._selected_node.id);
				ImGui.Text(`x:${layout.x} y:${layout.y}`);

				var nodeType = GenGraphImGui.GetGraphNodeType(graph_instance._selected_node.type);
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

			if(ImGui.Button("Save As JS To Clipboard"))
			{
				var js = bg.SaveGeneratorGraphToJSON(graph_instance);
				ImGui.SetClipboardText(js);
			}

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
					ImGui.SliderInt("Seed", (_ = graph_instance._tempExecutionContext.seed) => graph_instance._tempExecutionContext.seed = _, 0, 10000000);
					if(ImGui.Button("Execute Next Step"))
					{
						bg.ExecuteNextStepGenerationGraphExecutionContext(graph_instance._tempExecutionContext);
					}
					if(ImGui.Button("Execute Context (all steps)"))
					{
						bg.ExecuteGenerationGraphExecutionContext(graph_instance._tempExecutionContext);
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


//   ██████  █████  ███    ██ ██    ██  █████  ███████ 
//  ██      ██   ██ ████   ██ ██    ██ ██   ██ ██      
//  ██      ███████ ██ ██  ██ ██    ██ ███████ ███████ 
//  ██      ██   ██ ██  ██ ██  ██  ██  ██   ██      ██ 
//   ██████ ██   ██ ██   ████   ████   ██   ██ ███████ 
//                                                     
//                                                     

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
		var nodeType = GenGraphImGui.GetGraphNodeType(node.type);
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
		var highlighted_node_id = NodeImGui.GetHoveredNodeId();
		if(highlighted_node_id == null)
		{
			for(const [key, value] of Object.entries(GenGraphImGui.graphNodeTypes))
			{
				if(value.add_node)
				{
					value.add_node(graph_instance);
				}
			}
		}
		else
		{
			var nodeType = GenGraphImGui.GetGraphNodeType(node.type);
			if(nodeType.node_context_menu)
			{
				nodeType.node_context_menu();
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
		UpdateGenGraphEditor(graph_instance);
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