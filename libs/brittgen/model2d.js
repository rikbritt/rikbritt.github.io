bg.CreatePoint = function(x,y)
{
	return Vector2D(x,y);//{x:x,y:y};
}

bg.GetMiddleOfPoints = function(startPoint, endPoint)
{
	return endPoint.subtract(startPoint).divideByScalar(2.0).add(startPoint);
	//return CreatePoint(
	//	((endPoint.x - startPoint.x) / 2.0) + startPoint.x,
	//	((endPoint.y - startPoint.y) / 2.0) + startPoint.y
	//);
}

bg.GetLengthBetweenPoints = function(startPoint, endPoint)
{
	return startPoint.distance(endPoint);
}

bg.CreateShape = function(model, shapeName, material)
{
	var shape = {
		name:shapeName,
		material:material,
		position:(bg.CreatePoint(0,0)),
		rotation:0,
		points:[]
	};
	
	if(model)
	{
		model.shapes.push(shape);
	}
	
	return shape;
}

bg.CreateBoxShape = function(model, shapeName, material, width, height, xpos, ypos)
{
	var shape = bg.CreateShape(model, shapeName, material);
	shape.position = bg.CreatePoint(xpos, ypos);
	shape.points.push( bg.CreatePoint(0, 0) );
	shape.points.push( bg.CreatePoint(width, 0) );
	shape.points.push( bg.CreatePoint(width, height) );
	shape.points.push( bg.CreatePoint(0, height) );
	return shape;
}

bg.CreateBoxBetweenPoints = function(model, shapeName, material, startPos, endPos, width )
{
	var distBetweenPoints = bg.GetLengthBetweenPoints(startPos, endPos);
	var middle = bg.GetMiddleOfPoints(startPos, endPos);
	var boxShape = bg.CreateBoxShape(model, shapeName, material, width, distBetweenPoints, middle.x, middle.y);
	boxShape.rotation = startPos.angle(endPos);
	return boxShape;
}


//TEMP
bg.CombineModels = function(destModel, sourceModel)
{
	destModel.models.push(sourceModel);
	//for(var i=0;i<sourceModel.shapes.length; ++i)
	//{
	//	destModel.shapes.push(sourceModel.shapes[i]);
	//}	
}

bg.Create2DModel = function()
{
	var model = {
		position:bg.CreatePoint(0,0),
		shapes:[],
		models:[]
	}
	return model;
}