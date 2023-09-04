bg.CreateTranslation = function(x,y,z)
{
	throw "Not Implemented";
}

bg.CreateRotation = function(x,y,z)
{
	throw "Not Implemented";
}

bg.GetVectorToPos = function(fromPos, toPos)
{
	throw "Not Implemented";
}

bg.GetTranslationBetweenPositions = function(fromPos, toPos)
{
	return bg.GetTranslationAlongLine(fromPos, toPos, 0.5);
}

bg.GetTranslationAlongLine = function(fromPos, toPos, normDistOnLine)
{
	var out = toPos.clone();
	out.sub(fromPos);
	out.multiplyScalar(normDistOnLine);
	out.add(fromPos);
	return out;
}

bg.LookAtPos = function(eye, dir, up )
{
	throw "Not Implemented";
}

bg.GetUpVector = function()
{
	throw "Not Implemented";
}

bg.AddModelToScene = function(sceneInfo, model, options)
{
	throw "Not Implemented";
}


bg.ClipVectorOnY = function(v, yOff, clipOnY)
{
	var distOnY = v.dot(bg.GetUpVector());
	var overshootDist = (distOnY + yOff) - clipOnY;
	if(overshootDist > 0)
	{
		var f = 1.0 - (overshootDist / distOnY);
		v.multiplyScalar(f);
	}
}

bg.CreateNode = function(parentNode)
{
	var node = {
		position:bg.CreateTranslation(0,0,0),
		rotation:bg.CreateRotation(0,0,0),
		children:[],
		type:"node"
		//parentNode:parentNode
	}
	
	if(parentNode) {
		parentNode.children.push(node);
	}
	return node;
}

bg.AddUpdateScriptToNode = function(node, updateScript)
{
	node.updateScript = updateScript;
}

bg.CreateDebugTextNode = function(parentNode, txt, textHeight)
{
	var node = bg.CreateNode(parentNode);
	node.type = "debugtext";
	node.text = txt;
	if(textHeight == null)
	{
		node.textHeight = 0.1;
	}
	else 
	{ 
		node.textHeight = textHeight;
	}
	return node;
}

bg.CreateDebugArrow = function(parentNode, fromPos, toPos)
{
	var node = bg.CreateNode(parentNode);
	node.type = "debugarrow";
	node.toPos = toPos.clone();
	node.position = fromPos.clone();
	return node;
}

bg.CreateDebugPoint = function(parentNode, pos)
{
	var node = bg.CreateNode(parentNode);
	node.type = "debugpoint";
	node.position = pos.clone();
	return node;
}

bg.CreateLineModel = function(parentNode)
{
	var lineModel = bg.CreateNode(parentNode);
	lineModel.type = "line";
	lineModel.lineVerts = [];
	return lineModel;
}

bg.CreateLineModelBetweenPoints = function(parentNode, fromPos, toPos)
{
	var lineModel = bg.CreateLineModel(parentNode);
	lineModel.lineVerts.push(fromPos);
	lineModel.lineVerts.push(toPos);
	return lineModel;
}

bg.CreateBoxModel = function(parentNode, width, height, depth)
{
	var boxModel = bg.CreateNode(parentNode);
	boxModel.type = "box"; //Temp
	boxModel.width = width;
	boxModel.height = height;
	boxModel.depth = depth;
	return boxModel;
}

bg.CreateHeightMapTerrainModel = function(parentNode, width, height, depth, map)
{
	var model = bg.CreateNode(parentNode);
	model.type = "heightmap";
	model.width = width;
	model.height = height;
	model.depth = depth;
	model.map = map;
	return model;
}

//Voxel data values y,z,x
bg.CreateVoxelModel = function(parentNode, width, height, depth, voxelData)
{
	var model = bg.CreateNode(parentNode);
	model.type = "voxel";
	model.width = width;
	model.height = height;
	model.depth = depth;
	model.voxelData = voxelData;
	return model;
}

//The box is 'resting' on 'position'
bg.CreateFlooredBoxModel = function(parentNode, width, height, depth, position)
{
	var boxModel = bg.CreateNode(parentNode);
	boxModel.type = "box"; //Temp
	boxModel.width = width;
	boxModel.height = height;
	boxModel.depth = depth;
	boxModel.position = position.clone();
	boxModel.position.y += height * 0.5;
	return boxModel;
}

bg.SubtractModel = function(sourceModel, modelToSubtract)
{
	throw "Not Implemented";
}