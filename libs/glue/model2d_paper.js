
bg.ConvertShapeToPath = function(shape)
{
	var path = new paper.Path();
	for(var p=0; p<shape.points.length; p++){
		var shapePoint = shape.points[p];
		path.add(new paper.Point(shapePoint.x, shapePoint.y));
	}
	path.closed = true;
	return path;
}

bg.UniteShape = function(shape1, shape2, shapeName)
{
	//Implemented with Paper JS
	var originalPaperScope = paper;
	var tempPaperScope = new paper.PaperScope();
	tempPaperScope.setup(null);
	
	var path1 = bg.ConvertShapeToPath(shape1);
	var path2 = bg.ConvertShapeToPath(shape2);
	
	var unitedPath = path1.unite(path2);
	
	var result = bg.CreateShape(null, shapeName, shape1.material);
	for (var i=0; i<unitedPath.segments.length; ++i) {
		var resultPoint = unitedPath.segments[i].point;
		result.points.push(bg.CreatePoint(resultPoint.x, resultPoint.y));
	}
	
	tempPaperScope.remove();
	originalPaperScope.activate();
	
	return result;
}

bg.Draw2DModel = function(model, canvas)
{
	// Create an empty project and a view for the canvas:
	paper.setup(canvas);
	
	var DrawModelRecursive = function(model) {
		for (var i=0; i<model.shapes.length; i++) {
			var shape = model.shapes[i];
			
			var path = bg.ConvertShapeToPath(shape);
			path.strokeColor = 'black';
			
			if(shape.material == "wood")
			{
				path.fillColor = 'brown';
			}
			else
			{
				path.fillColor = 'black';
			}
			
			
			//It seems you have to set 'position' after all the points are added.
			path.position = new paper.Point(shape.position.x + model.position.x, shape.position.y + model.position.y);
			path.rotation = shape.rotation;
		}
		
		for(var i=0; i<model.models.length; i++) {
			DrawModelRecursive(model.models[i]);
		}
	}
	
	DrawModelRecursive(model);
	
	paper.project.activeLayer.position = paper.view.center;
	paper.project.activeLayer.scale( new paper.Point(20,-20) );
	paper.view.draw();
}