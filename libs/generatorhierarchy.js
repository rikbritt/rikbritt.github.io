
bg.RegisterGeneratorHierarchy = function(project, hierarchy)
{
	project.generatorHierarchies.push(hierarchy);
}

bg.CreateGenerationHierarchy = function(hierarchyName)
{
	var hierarchy = {
		name:hierarchyName,
		hierarchyNodes:[]
	};
	
	return hierarchy;
}

bg.CreateGenerationHierarchyNode = function(hierarchy, generator)
{
	var node = {
		idx:hierarchy.hierarchyNodes.length,
		generator:generator,
		inputs:[]
	};
	
	hierarchy.hierarchyNodes.push(node);
	
	return node;
}

bg.CreateGenerationHierarchyLink = function(fromNode, fromNodeOutputName, toNode, toNodeInputName)
{
	//Sanity check the link
	if(toNode.generator.inputs[toNodeInputName] == null)
	{
		//Error
		console.error("Failed to make hierarchy link " + 
		"'" + bg.GetGeneratorFullName(fromNode.generator) + "':'" + fromNodeOutputName +"'" +
		" -> '" + bg.GetGeneratorFullName(toNode.generator) + "':'" + toNodeInputName + "'" +
		" because '" + toNodeInputName + "' doesn't exist on the 'to' node."		
		);
	}
	else if(fromNode.generator.outputs[fromNodeOutputName] == null)
	{
		console.error("Failed to make hierarchy link " + 
		"'" + bg.GetGeneratorFullName(fromNode.generator) + "':'" + fromNodeOutputName +"'" +
		" -> '" + bg.GetGeneratorFullName(toNode.generator) + "':'" + toNodeInputName + "'" +
		" because '" + fromNodeOutputName + "' doesn't exist on the 'from' node."
		);
	}
	//todo: add idx sanity checks and pass hierarchy in as param to allow that
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
bg.GenerateHierarchyNode = function(targetNode, seed, nodeInputDataDef)
{
	if(nodeInputDataDef == null)
	{
		nodeInputDataDef = {};
	}

	//Gather the input nodes data that is required.
	for(var i=0; i<targetNode.inputs.length; ++i)
	{
		var nodeInput = targetNode.inputs[i];
		var inputResult = bg.GenerateHierarchyNode(nodeInput.fromNode, seed);
		nodeInputDataDef[nodeInput.toNodeInputName] = inputResult.outputs[nodeInput.fromNodeOutputName];
	}
	return bg.RunGenerator(targetNode.generator, seed, nodeInputDataDef);
}


bg.SaveHierarchyToJSON = function(hierarchy)
{
    return "";
}