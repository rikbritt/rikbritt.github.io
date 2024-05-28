
bg.UpgradeGeneratorGraph = function(graph)
{

}

bg.ValidateGeneratorGraph = function(graph)
{
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

bg.CreateGenerationGraph = function(graphName)
{
	var graph = {
		name:graphName,
		nodes:[]
	};
	
	return graph;
}

bg.CreateGenerationGraphNode = function(graph)
{
	var node = {
		id:bg.CreateGUID(),
		idx:graph.nodes.length,
		inputs:[]
	};
	
	graph.nodes.push(node);
	
	return node;
}

bg.GetGenerationGraphNodeName = function(node)
{
	var asset = AssetDb.GetAsset(gAssetDb, node.asset_id, node.type);
	if(asset != null)
	{
		return asset.name;
	}
	return "?";
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


bg.CreateGenerationGraphLink = function(fromNode, fromNodeOutputName, toNode, toNodeInputName)
{
	var toGen = AssetDb.GetAsset(gAssetDb, toNode.asset_id, "generator");
	var fromGen = AssetDb.GetAsset(gAssetDb, fromNode.asset_id, "generator");

	//Sanity check the link
	if(bg.GetGeneratorInputByName(toGen, toNodeInputName) == null)
	{
		//Error
		console.error("Failed to make graph link " + 
		"'" + bg.GetGeneratorFullName(fromGen) + "':'" + fromNodeOutputName +"'" +
		" -> '" + bg.GetGeneratorFullName(toGen) + "':'" + toNodeInputName + "'" +
		" because '" + toNodeInputName + "' doesn't exist on the 'to' node."		
		);
	}
	else if(bg.GetGeneratorOutputByName(fromGen, fromNodeOutputName) == null)
	{
		console.error("Failed to make graph link " + 
		"'" + bg.GetGeneratorFullName(fromGen) + "':'" + fromNodeOutputName +"'" +
		" -> '" + bg.GetGeneratorFullName(toGen) + "':'" + toNodeInputName + "'" +
		" because '" + fromNodeOutputName + "' doesn't exist on the 'from' node."
		);
	}
	//todo: add idx sanity checks and pass graph in as param to allow that
	else
	{
		var link = {
			fromNodeIdx:fromNode.idx,
			fromNodeOutputName:fromNodeOutputName,
			toNodeIdx:toNode.idx, //Maybe don't include this one.
			toNodeInputName:toNodeInputName
		};
		
		toNode.inputs.push(link);
	}
}

//Generate a target node. Will trigger generation of all input nodes.
bg.GenerateGraphNode = function(targetNode, seed, nodeInputDataDef)
{
	var targetAsset = AssetDb.GetAsset(gAssetDb, targetNode.asset_id, "generator");
	if(nodeInputDataDef == null)
	{
		nodeInputDataDef = Array(targetAsset.inputs.length).fill(null);
	}

	//Gather the input nodes data that is required.
	for(var i=0; i<targetNode.inputs.length; ++i)
	{
		var nodeInput = targetNode.inputs[i];
		var inputResult = bg.GenerateGraphNode(nodeInput.fromNode, seed);
		nodeInputDataDef[nodeInput.toNodeInputName] = inputResult.outputs[nodeInput.fromNodeOutputName];
	}
	return bg.RunGenerator(targetAsset, seed, nodeInputDataDef);
}


bg.SaveGraphToJSON = function(graph)
{
    return "";
}

bg.LoadGraphFromJSON = function(json_str)
{
	return {};
}