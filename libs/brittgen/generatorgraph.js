bg.UpgradeGeneratorGraph = function(graph)
{

}

bg.ValidateGeneratorGraph = function(graph)
{
	var output_nodes = bg.GetGraphNodesByType(graph, "output");
	if(output_nodes.length != 1)
	{
		// Wrong number of output nodes
		return false;
	}
	return true;
}

bg.RegisterProjectGeneratorGraph = function(project, graph)
{
	bg.UpgradeGeneratorGraph(graph);
	if(bg.ValidateGeneratorGraph(graph))
	{
		project.generatorGraphs.push(graph);
		AssetDb.AddAsset(project.assetDb, graph.id, "graph", graph);
	}
}

bg.CreateGenerationGraph = function(graphName = "New Graph")
{
	var graph = bg.CreateGraph();
	graph.id = bg.CreateGUID();
	graph.name = graphName;	

	//Give gen graphs a output node by default
	bg.CreateGenerationGraph_OutputNode(graph);

	return graph;
}

bg.CreateGenerationGraphNode = function(graph)
{
	var node = bg.AddGraphNode(graph, bg.CreateGUID(), {});
	return node;
}

bg.GetGenerationGraphNodeName = function(node)
{
	if(node.type=="output")
	{
		return "Output";
	}

	var asset = AssetDb.GetAsset(gAssetDb, node.asset_id, node.type);
	if(asset != null)
	{
		return asset.name;
	}
	return "?";
}

bg.CreateGenerationGraph_OutputNode = function(graph)
{
	var node = bg.AddGraphNode(graph, bg.CreateGUID(), {});
	node.type = "output";
	return node;
}

bg.CreateGenerationGraph_GeneratorNode = function(graph, generator_id)
{
	var node = bg.CreateGenerationGraphNode(graph);
	node.asset_id = generator_id;
	node.type = "generator";
	return node;
}

bg.CreateGenerationGraph_GenGraphNode = function(graph, gen_graph)
{
	var node = bg.CreateGenerationGraphNode(graph);
	node.asset_id = gen_graph.id;
	node.type = "gen_graph";
	return node;
}

bg.CreateGenerationGraph_DataDefNode = function(graph, data_def_id)
{
	var node = bg.CreateGenerationGraphNode(graph);
	node.asset_id = data_def_id;
	node.type = "data_def";
	return node;
}

bg.CreateGenerationGraph_DataTableNode = function(graph, data_table)
{
	var node = bg.CreateGenerationGraphNode(graph);
	node.asset_id = data_table.id;
	node.type = "data_table";
	return node;
}

bg.CreateGenerationGraph_CommentNode = function(graph)
{
	var node = bg.CreateGenerationGraphNode(graph);
	node.asset_id = null;
	node.type = "comment";
	node.comment = "Hello World";
	return node;
}

bg.CreateGenerationGraph_ValueNode = function(graph, fieldTypeId)
{
	var node = bg.CreateGenerationGraphNode(graph);
	node.asset_id = null;
	node.type = "value";
	node.fieldTypeId = fieldTypeId;
	node.value = bg.CreateDefaultFieldValue(node.fieldTypeId);
	node.fieldData = bg.CreateDefaultFieldDef(node.fieldTypeId);
	return node;
}

bg.CreateGenerationGraphLink = function(graph, fromNode, fromNodeOutputId, toNode, toNodeInputId)
{

	//Sanity check the link
	if(toNode.type == "genertor")
	{
		var toGen = AssetDb.GetAsset(gAssetDb, toNode.asset_id, "generator");
		if(bg.GetGeneratorInputById(toGen, toNodeInputId) == null)
		{
			//Error
			console.error("Failed to make graph link " + 
			"'" + bg.GetGeneratorFullName(fromGen) + "':'" + fromNodeOutputId +"'" +
			" -> '" + bg.GetGeneratorFullName(toGen) + "':'" + toNodeInputId + "'" +
			" because '" + toNodeInputId + "' doesn't exist on the 'to' node."		
			);
			return;
		}
	}
	
	if(fromNode.type == "generator")
	{
		var fromGen = AssetDb.GetAsset(gAssetDb, fromNode.asset_id, "generator");
		if(bg.GetGeneratorOutputById(fromGen, fromNodeOutputId) == null)
		{
			console.error("Failed to make graph link " + 
			"'" + bg.GetGeneratorFullName(fromGen) + "':'" + fromNodeOutputId +"'" +
			" -> '" + bg.GetGeneratorFullName(toGen) + "':'" + toNodeInputId + "'" +
			" because '" + fromNodeOutputId + "' doesn't exist on the 'from' node."
			);
			return;
		}
	}
	
	bg.AddGraphSubEdgeById(
		graph,
		fromNode.id,
		fromNodeOutputId,
		toNode.id,
		toNodeInputId
	);
}

bg.RemoveGenerationGraphLinkById = function(graph, fromNodeId, fromNodeOutputId, toNodeId, toNodeInputId)
{
	bg.RemoveGraphSubEdgeById(
		graph,
		fromNodeId,
		fromNodeOutputId,
		toNodeId,
		toNodeInputId
	);
}

// Use this to execute a generation graph and get the output.
// Creates an execution list for a graph and sets up the context
// to execute the first step.
// Goal is step by step debuggable exection, or fire and forget with a callback
bg.CreateGenerationGraphExecutionContext = function(graph, seed = 1)
{
	var context = {
		graph:graph,
		executionList:bg.CreateGenerationGraphExecutionList(graph),
		nextStepToExecute:0,
		seed:seed,
        lastGenOutput:{},
        nextGenInputs:{}
	};

	return context;
}

bg.CreateGenerationGraphExecutionList = function(graph)
{
	var executionList = [];
	var MakeCopyCmd = function(from_node_id, sub_id, to_node_id, to_sub_id)
	{
		var cmd = {cmd:"copy", from:from_node_id, from_output:sub_id, to:to_node_id, to_input:to_sub_id};
		return cmd;
	};
	var AddInputsToExecutionList = function(node)
	{
		if(executionList.indexOf(node.id) != -1)
		{
			// Already in the list
			return;
		}
		if(node.type == "generator")
		{
			executionList.push({cmd:"gen", id:node.id});
		}
		else if(node.type == "data_def")
		{
			executionList.push({cmd:"def", id:node.id});
		}
		else
		{
			return;
		}

		//Recursively go up all inputs
		bg.ForEachGraphEdgeIntoNode(
			graph,
			node.id,
			function(from_node_id, sub_id, to_node_id, to_sub_id)
			{
				var fromNode = bg.GetGraphNodeById(graph, from_node_id);
				executionList.push(MakeCopyCmd(from_node_id, sub_id, to_node_id, to_sub_id));
				AddInputsToExecutionList(fromNode);
			}
		);
	};

	//Walk backwards from the output node
	var output_nodes = bg.GetGraphNodesByType(graph, "output");
	for(var output_node of output_nodes)
	{
		executionList.push({cmd:"output", id:output_node.id});
		bg.ForEachGraphEdgeIntoNode(
			graph,
			output_node.id,
			function(from_node_id, sub_id, to_node_id, to_sub_id)
			{
				var fromNode = bg.GetGraphNodeById(graph, from_node_id);
				executionList.push(MakeCopyCmd(from_node_id, sub_id, to_node_id, to_sub_id));
				AddInputsToExecutionList(fromNode);
			}
		);
	}

	// Reverse it so earliest input nodes are done first
	executionList.reverse();

	return executionList;
}

bg.ExecuteNextStepGenerationGraphExecutionContext = function(context)
{
	var graph = context.graph;
	if(context.nextStepToExecute >= context.executionList.length)
	{
		return;
	}

	var step = context.executionList[context.nextStepToExecute];
	context.nextStepToExecute += 1;

	if(step.cmd == "gen")
	{
		var node = bg.GetGraphNodeById(graph, step.id);
		if(node.type == "generator")
		{
			var generator = AssetDb.GetAsset(gAssetDb, node.asset_id, "generator");
			var genResults = bg.RunGenerator(generator, context.seed, context.nextGenInputs);
            context.lastGenOutput = genResults.outputs;
		}

        //Reset for next generator steps
        context.nextGenInputs = {};
	}
	else if(step.cmd == "def")
	{
		var data_def = AssetDb.GetAsset(gAssetDb, node.asset_id, "data_def");
		var built_data = bg.BuildDataDefValues(data_def, context.seed, context.nextGenInputs);
		// todo - use the built data
	}
    else if(step.cmd == "copy")
    {
        var from_node = bg.GetGraphNodeById(graph, step.from);
		var to_node = bg.GetGraphNodeById(graph, step.to);

		// Get the val
		var val = null;
		if(from_node.type == "generator")
		{
			// todo - error checking	
			var from_generator = AssetDb.GetAsset(gAssetDb, from_node.asset_id, "generator");
			var output = bg.GetGeneratorOutputById(from_generator, step.from_output);
			val = context.lastGenOutput[output.name];
		}
		else if(from_node.type == "value")
		{
			val = from_node.value;
		}

		// Assign the val
		if(to_node.type == "generator")
		{
			// todo - error checking	
			var to_generator = AssetDb.GetAsset(gAssetDb, to_node.asset_id, "generator");
            var input = bg.GetGeneratorInputById(to_generator, step.to_input);

            context.nextGenInputs[input.name] = val;        
        }
		else if(to_node.type == "data_def")
		{
			var to_def = AssetDb.GetAsset(gAssetDb, to_node.asset_id, "data_def");
            var field = bg.GetDataDefFieldById(to_def, step.to_input);

            context.nextGenInputs[field.name] = val; 
		}
    }
}

bg.ExecuteGeneratorGraph = function(graph)
{
	if(bg.ValidateGeneratorGraph(graph) == false)
	{
		return;
	}

	bg.CreateGenerationGraphExecutionList(graph);

}



// bg.SaveGraphToJSON = function(graph)
// {
//     return "";
// }

// bg.LoadGraphFromJSON = function(json_str)
// {
// 	return {};
// }