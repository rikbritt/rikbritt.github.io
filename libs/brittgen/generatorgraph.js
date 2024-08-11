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

bg.CreateGenerationGraph_GeneratorNode = function(graph, generator)
{
	var node = bg.CreateGenerationGraphNode(graph);
	node.asset_id = generator.id;
	node.type = "generator";
	return node;
}

bg.CreateGenerationGraph_DataDefNode = function(graph, data_def)
{
	var node = bg.CreateGenerationGraphNode(graph);
	node.asset_id = data_def.id;
	node.type = "data_def";
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

bg.CreateGenerationGraphExecutionList = function(graph)
{
	//Walk backwards from the output node
	var output_nodes = bg.GetGraphNodesByType(graph);

	// Execution List =
	//		Prep node inputs 
	// 		Node to be executed
	//		Where to send the nodes outputs
	//		
}

bg.ExecuteGeneratorGraph = function(graph)
{
	if(bg.ValidateGeneratorGraph(graph) == false)
	{
		return;
	}

	bg.CreateGenerationGraphExecutionList(graph);

}

// //Generate a target node. Will trigger generation of all input nodes.
// bg.GenerateGraphNode = function(targetNode, seed, nodeInputDataDef)
// {
// 	var targetAsset = AssetDb.GetAsset(gAssetDb, targetNode.asset_id, "generator");
// 	if(nodeInputDataDef == null)
// 	{
// 		nodeInputDataDef = Array(targetAsset.inputs.length).fill(null);
// 	}

// 	//Gather the input nodes data that is required.
// 	for(var i=0; i<targetNode.inputs.length; ++i)
// 	{
// 		var nodeInput = targetNode.inputs[i];
// 		var inputResult = bg.GenerateGraphNode(nodeInput.fromNode, seed);
// 		nodeInputDataDef[nodeInput.toNodeInputName] = inputResult.outputs[nodeInput.fromNodeOutputName];
// 	}
// 	return bg.RunGenerator(targetAsset, seed, nodeInputDataDef);
// }


// bg.SaveGraphToJSON = function(graph)
// {
//     return "";
// }

// bg.LoadGraphFromJSON = function(json_str)
// {
// 	return {};
// }