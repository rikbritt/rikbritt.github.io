
bg.RegisterGeneratorGraph = function(project, graph)
{
	project.generatorGraphs.push(graph);
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
	if(node.type == "generator")
	{
		return node.generator.name;
	}
	else if(node.type == "data_def")
	{
		return node.data_def.name;
	}
	return "?";
}

bg.CreateGenerationGraph_GeneratorNode = function(graph, generator)
{
	var node = bg.CreateGenerationGraphNode(graph);
	node.generator = generator;
	node.type="generator";
	return node;
}

bg.CreateGenerationGraph_DataDefNode = function(graph, data_def)
{
	var node = bg.CreateGenerationGraphNode(graph);
	node.data_def = data_def;
	node.type="data_def";
	return node;
}


bg.CreateGenerationGraphLink = function(fromNode, fromNodeOutputName, toNode, toNodeInputName)
{
	//Sanity check the link
	if(bg.GetGeneratorInputByName(toNode.generator, toNodeInputName) == null)
	{
		//Error
		console.error("Failed to make graph link " + 
		"'" + bg.GetGeneratorFullName(fromNode.generator) + "':'" + fromNodeOutputName +"'" +
		" -> '" + bg.GetGeneratorFullName(toNode.generator) + "':'" + toNodeInputName + "'" +
		" because '" + toNodeInputName + "' doesn't exist on the 'to' node."		
		);
	}
	else if(bg.GetGeneratorOutputByName(fromNode.generator, fromNodeOutputName) == null)
	{
		console.error("Failed to make graph link " + 
		"'" + bg.GetGeneratorFullName(fromNode.generator) + "':'" + fromNodeOutputName +"'" +
		" -> '" + bg.GetGeneratorFullName(toNode.generator) + "':'" + toNodeInputName + "'" +
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
	if(nodeInputDataDef == null)
	{
		nodeInputDataDef = Array(targetNode.generator.inputs.length).fill(null);
	}

	//Gather the input nodes data that is required.
	for(var i=0; i<targetNode.inputs.length; ++i)
	{
		var nodeInput = targetNode.inputs[i];
		var inputResult = bg.GenerateGraphNode(nodeInput.fromNode, seed);
		nodeInputDataDef[nodeInput.toNodeInputName] = inputResult.outputs[nodeInput.fromNodeOutputName];
	}
	return bg.RunGenerator(targetNode.generator, seed, nodeInputDataDef);
}


bg.SaveGraphToJSON = function(graph)
{
    return "";
}

bg.LoadGraphFromJSON = function(json_str)
{
	return {};
}