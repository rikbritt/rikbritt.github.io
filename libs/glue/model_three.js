bg.CreateTranslation = function(x,y,z)
{
	return new THREE.Vector3(x,y,z);
}

bg.CreateRotation = function(x,y,z)
{
	return new THREE.Vector3(x,y,z);
}

bg.GetVectorToPos = function(fromPos, toPos)
{
	return toPos.clone().sub(fromPos);
}

bg.LookAtPos = function(eye, dir, up )
{
	var m4 = new THREE.Matrix4();
	m4.lookAt(eye, dir, up);
	var result = new THREE.Euler();
	result.setFromRotationMatrix(m4);
	return result.toVector3();
	//return bg.CreateRotation(0,1,0);
}

bg.upVec = new THREE.Vector3(0,1,0);
bg.GetUpVector = function()
{
	return bg.upVec;
}

bg.CreateRenderer = function(renderWidth, renderHeight, canvas)
{
	var renderer = new THREE.WebGLRenderer({canvas:canvas});
	renderer.setSize( renderWidth, renderHeight );
	return renderer;
}

bg.CreateScene = function(renderWidth, renderHeight, renderer, updateFunc, postRenderFunc)
{
	var scene = new THREE.Scene();
	//scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
	//scene.fog = new THREE.Fog( scene.background, 1, 10 );
	
	var camera = new THREE.PerspectiveCamera( 75, renderWidth/renderHeight, 0.1, 1000 );
	camera.position.set( 0, 2, 5 );
	var controls = new THREE.OrbitControls( camera, renderer.domElement );

	controls.update();

    //renderer.setClearColor(new THREE.Color(1, 0, 0), 1);

	
	return {
		scene:scene,
		camera:camera,
		controls:controls,
		renderer:renderer,
		updateFunc:updateFunc,
		postRenderFunc:postRenderFunc,
		updateScripts:[]
	};
}

bg.UpdateScene = function(viewportLocation, sceneInfo, dt, timestamp)
{
	sceneInfo.controls.update();
		
	if(sceneInfo.updateFunc)
	{
		sceneInfo.updateFunc(dt, timestamp);
	}

	sceneInfo.camera.updateProjectionMatrix();
	sceneInfo.renderer.setViewport(viewportLocation.x, viewportLocation.y, 200, 200);
	sceneInfo.renderer.autoClear = false; 
	sceneInfo.renderer.clearDepth(); // important! clear the depth buffer
	sceneInfo.renderer.render(sceneInfo.scene, sceneInfo.camera);

	if(sceneInfo.postRenderFunc)
	{
		sceneInfo.postRenderFunc(dt, timestamp);
	}

	//For imgui?
	sceneInfo.renderer.state.reset();
}

bg.ClearScene = function(sceneInfo)
{
	var scene = sceneInfo.scene;
	while(scene.children.length > 0){ 
		scene.remove(scene.children[0]); 
	}
}


bg.ConvertNodeToThreeJSGeometry = function(node, options)
{
	if(node.type == "node")
	{
		//todo: matrix push or something
		var group = new THREE.Group();
		group.position.set( node.position.x, node.position.y, node.position.z);
		group.rotation.set( node.rotation.x, node.rotation.y, node.rotation.z);
		return group;
	}
	else if(node.type == "debugtext")
	{
		if(options == null || options.showConstructionInfo)
		{
			var txtObj = bg.THREE_CreateDebugText(node.text);
			txtObj.position.set( node.position.x, node.position.y, node.position.z);
			txtObj.rotation.set( node.rotation.x, node.rotation.y, node.rotation.z);
			txtObj.scale.set(node.textHeight, node.textHeight, node.textHeight);
			return txtObj;
		}
		return null;
	}
	else if(node.type == "debugarrow")
	{
		var lineMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );
		var lineGeometry = new THREE.Geometry();
		
		//todo: Arrow head.
		lineGeometry.vertices.push(node.position, node.toPos);
		
		var lineObj = new THREE.LineSegments( lineGeometry, lineMaterial );
		return lineObj;
	}
	else if(node.type == "debugpoint")
	{
		var pointsMaterial = new THREE.PointsMaterial( { size:0.01, color: 0xFFFFFF } );
		var lineGeometry = new THREE.Geometry();
		
		lineGeometry.vertices.push(node.position);
		
		var lineObj = new THREE.Points( lineGeometry, pointsMaterial );
		return lineObj;
	}
	else if(node.type == "line")
	{
		var lineMaterial = new THREE.LineBasicMaterial( { color: 0xFFFFFF } );
		var lineGeometry = new THREE.Geometry();
		
		for(var v=0; v<node.lineVerts.length; ++v)
		{
			var vertPos = node.lineVerts[v];
			lineGeometry.vertices.push(new THREE.Vector3( vertPos.x, vertPos.y, vertPos.z) );
		}
		
		var lineObj = new THREE.Line( lineGeometry, lineMaterial );
		return lineObj;
	}
	else if(node.type == "box") //temp
	{
		var colour = 0xaaaaaa;
		if(node.colour != undefined)
		{
			colour = node.colour;
		}
		var boxMaterial = new THREE.MeshLambertMaterial( { color: colour } );
		//boxMaterial.wireframe = true;
		var boxGeometry = new THREE.BoxGeometry( node.width, node.height, node.depth );
		var box = new THREE.Mesh( boxGeometry, boxMaterial );
		box.position.set( node.position.x, node.position.y, node.position.z);
		box.rotation.set( node.rotation.x, node.rotation.y, node.rotation.z);
		return box;
	}
	else if(node.type == "voxel")
	{
		var voxelGroup = new THREE.Group();
		voxelGroup.position.set( node.position.x, node.position.y, node.position.z);
		voxelGroup.rotation.set( node.rotation.x, node.rotation.y, node.rotation.z);
		
		var voxelData = node.voxelData;
		var i = 0;
		for(var y=0; y<voxelData.height; ++y)
		{
			for(var z=0; z<voxelData.depth; ++z)
			{
				for(var x=0; x<voxelData.width; ++x)
				{
					//var i = (y*voxelData.depth*voxelData.width) + (z*voxelData.width) + x;
					if(voxelData.values[i] != 0)
					{
						var voxelMaterial = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
						var voxelGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
						var voxel = new THREE.Mesh( voxelGeometry, voxelMaterial );
						voxel.position.set( x * 0.1, y * 0.1, z * 0.1);
						//voxel.rotation.set( node.rotation.x, node.rotation.y, node.rotation.z);
						
						voxelGroup.add(voxel);
					}
					++i;
				}
			}
		}
		return voxelGroup;
	}
	else if(node.type == "heightmap")
	{
		var colour = 0x00aa00;
		if(node.colour != undefined)
		{
			colour = node.colour;
		}
		var terrainMaterial = new THREE.MeshLambertMaterial( { /*color: colour,*/ vertexColors: THREE.VertexColors } );
		var terrainGeom = new THREE.PlaneGeometry( node.width, node.depth, node.map.width - 1, node.map.height - 1 );
		
		//terrainGeom.vertices[3].z =0.5;
		
		
		for(var i=0; i<(node.map.width*node.map.height); ++i)
		{
			terrainGeom.vertices[i].z = (node.map.values[i] * node.height);
			terrainGeom.colors[i] = new THREE.Color(0x004400 + (node.map.values[i] * 0xFFFFFF));
		}
		
		var faceIndices = [ 'a', 'b', 'c', 'd' ];
		for ( var i = 0; i < terrainGeom.faces.length; i++ ) 
		{
			face = terrainGeom.faces[ i ];
			numberOfSides = ( face instanceof THREE.Face3 ) ? 3 : 4;
			for( var j = 0; j < numberOfSides; j++ ) 
			{
				vertexIndex = face[ faceIndices[ j ] ];
				face.vertexColors[ j ] = terrainGeom.colors[ vertexIndex ];
			}
		}

		//boxMaterial.wireframe = true;
		//var boxGeometry = new THREE.BoxGeometry( node.width, node.height, node.depth );
		var box = new THREE.Mesh( terrainGeom, terrainMaterial );
		box.position.set( node.position.x, node.position.y, node.position.z);
		box.rotation.set( node.rotation.x - (Math.PI/2), node.rotation.y, node.rotation.z);
		return box;
	}
	else if(node.type == "geom") //temp
	{
		return node.geom;
		//var material = new THREE.MeshLambertMaterial( { color: 0xaaaaaa } );
		//var mesh = new THREE.Mesh( node.geom, material );
		//mesh.position.set( node.position.x, node.position.y, node.position.z);
		//return mesh;
	}
	else
	{
		console.error("Unknown node type " + node.type);
	}
	return null;
}

bg.ConvertThreeJSGeometryToNode = function(geom)
{
	var result = bg.CreateNode(null);
	result.type = "geom";
	result.geom = geom; //temp
	return result;
}

bg.AddModelToScene = function(sceneInfo, model, options)
{
	var addNodeToScene = function(sceneInfo, threeJSParent, node, options) {
		
		var model = bg.ConvertNodeToThreeJSGeometry(node, options);
		if(model != null)
		{
			threeJSParent.add( model );
		
			for(var i=0; i<node.children.length; ++i) {
				var childNode = node.children[i];
				addNodeToScene(sceneInfo, model, childNode, options);
			}
		}
		node.temp_renderModel = model;
		
		//Probably don't want every node to have a pointer to the scene it belongs to!
		//Though it is handy :/
		node.scene = sceneInfo;
		
		if(node.updateScript)
		{
			var updateInfo = {
				updateScript:node.updateScript,
				node:node
			};
			sceneInfo.updateScripts.push(updateInfo);
		}
	}
	
	addNodeToScene(sceneInfo, sceneInfo.scene, model, options);
}

bg.SubtractModel = function(sourceModel, modelToSubtract)
{
	var sourceThreeModel = bg.ConvertNodeToThreeJSGeometry(sourceModel);
	var toSubtractThreeModel = bg.ConvertNodeToThreeJSGeometry(modelToSubtract);
	
	var sourceBsp = new ThreeBSP(sourceThreeModel);
	var toSubtractBsp = new ThreeBSP(toSubtractThreeModel);
	
	var resultBsp = sourceBsp.subtract(toSubtractBsp);
	//toSubtractBsp.subtract(sourceBsp);
	
	var threeJSResult = resultBsp.toMesh();
	//threeJSResult.geometry.computeVertexNormals();
	var nodeResult = bg.ConvertThreeJSGeometryToNode(threeJSResult);
	return nodeResult;
}
