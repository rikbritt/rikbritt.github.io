var gGeneratorInstances = [];
var gGeneratorRenderTargetWidth = 1920 / 2;
var gGeneratorRenderTargetHeight = 1080 / 2;

function RunGeneratorInstance(generatorInstance)
{
	if(generatorInstance.generatorHierarchy == null)
	{
		//Create an empty hierarchy for the selected generator
		generatorInstance.generatorHierarchy = bg.CreateGenerationHierarchy("Test Harness");
		generatorInstance.targetHierarchyNode = bg.CreateGenerationHierarchyNode(generatorInstance.generatorHierarchy, generatorInstance.generator);
	}
	//RenderHierarchy();

	generatorInstance.output = bg.GenerateHierarchyNode(
		generatorInstance.targetHierarchyNode, 
		generatorInstance.seed, 
		generatorInstance.setInputs);
	
	if(generatorInstance.output.outputs.model)
	{
		if(generatorInstance.renderScene == null)
		{
			var renderWidth = gGeneratorRenderTargetWidth;
			var renderHeight = gGeneratorRenderTargetHeight;
		
			generatorInstance.renderScene = bg.CreateScene(renderWidth, renderHeight, gRenderer, function() {}, function() {});
			generatorInstance.renderTarget = new THREE.WebGLRenderTarget( renderWidth, renderHeight, 
				{ minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat } );
			generatorInstance.renderTarget.texture.flipY = false;
		}
		else
		{
			bg.ClearScene(generatorInstance.renderScene);
		}
		
		var renderScene = generatorInstance.renderScene;

		var light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
		light.position.set(0,0.7,0.4);
		renderScene.scene.add( light );
				
		if(gRenderOptions.showGround)
		{
			var groundHeight = 0.05;
			var groundSize = 10;
			var groundGeometry = new THREE.BoxGeometry( groundSize, groundHeight, groundSize );
			var groundMaterial = new THREE.MeshBasicMaterial( { color: 0x008800 } );
			var ground = new THREE.Mesh( groundGeometry, groundMaterial );
			ground.position.y = -(groundHeight*0.5);
			renderScene.scene.add( ground );

			//Ground grid
			//var groundLineMaterial = new THREE.LineBasicMaterial( { color: 0x006600 } );
			//for(var i=0; i<5; ++i)
			//{
			//	var gridHeight = 0.001;
			//	var groundLineGeometry = new THREE.Geometry();
			//	groundLineGeometry.vertices.push(new THREE.Vector3( -(groundSize*0.5), gridHeight, i) );
			//	groundLineGeometry.vertices.push(new THREE.Vector3( (groundSize*0.5), gridHeight, i) );
			//	var groundGrid = new THREE.Line( groundLineGeometry, groundLineMaterial );
			//	gRenderScene.scene.add( groundGrid );
			//}
			
			var gridMaterial = new THREE.MeshBasicMaterial( {color: 0x006600 /*, side: THREE.DoubleSide*/ } );
			var gridLineGeometry = new THREE.PlaneGeometry( groundSize, 0.02 );
			for(var i=-5; i<5; ++i) {
				var xPlane = new THREE.Mesh( gridLineGeometry, gridMaterial );
				xPlane.rotation.x = THREE.Math.degToRad(-90);
				xPlane.position.y = 0.001;
				xPlane.position.z = i;
				renderScene.scene.add( xPlane );
				
				var zPlane = new THREE.Mesh( gridLineGeometry, gridMaterial );
				zPlane.rotation.x = THREE.Math.degToRad(-90);
				zPlane.rotation.z = THREE.Math.degToRad(-90);
				zPlane.position.y = 0.001;
				zPlane.position.x = i;
				//zPlane.rotation.z = THREE.Math.degToRad(-90);
				renderScene.scene.add( zPlane );
			}
		}
		
		bg.AddModelToScene(renderScene, generatorInstance.output.outputs.model, gRenderOptions);
	}
	//Draw2DModel(gGeneratorOutputs.outputs.model, document.getElementById('myCanvas'));
	
	//Rebuild/Refresh UI inputs
	//generatorInstance.setInputs = generatorInstance.output.outputs.builtInputs;
	//RefreshUIForGeneratorInputs();
}

function RunGeneratorInstanceWithRandomSeed(generatorInstance)
{
	var d = new Date();
	Math.seedrandom(d.getTime());
	generatorInstance.seed = Math.floor( Math.random() * 2000 );
	RunGeneratorInstance(generatorInstance);
}

function UpdateGeneratorInputsImGui(generatorInputs, setInputs)
{
	for([paramKey, paramData] of Object.entries(generatorInputs))
	{
		ImGui.PushID(paramKey);
		var addclearButton = false;
		
		if(setInputs[paramKey] == null)
		{
			if(ImGui.Button("Override " + paramKey))
			{
				setInputs[paramKey] = GetParamDefault(paramData);
			}
		}
		else
		{
			if(ImGui.Button("Clear " + paramKey))
			{
				delete setInputs[paramKey];
			}
			else
			{
				ImGui.SameLine();
				UpdateParamEditor(
					paramData,
					function() { var inputs = setInputs; var key = paramKey; return function () { 
						return inputs[key];
					 } }(),
					function() { var inputs = setInputs; var key = paramKey; return function (val) {
						inputs[key] = val;
						return val;
					} }(),
					paramKey
				);
			}
		}
		
		if(paramData.description != null)
		{
			ImGui.Text(paramData.description);
		}
		ImGui.PopID();
	}
}

function UpdateGeneratorsList() 
{    
	for(var i=0; i<bg.generators.length; ++i)
	{
		var numOpen = 0;
		for(var c=0; c<bg.generators[i].category.length; ++c)
		{
			var category = bg.generators[i].category[c];
			if(ImGui.BeginMenu(category))
			{
				++numOpen;
			}
			else
			{
				break;
			}
		}
		if(numOpen == bg.generators[i].category.length)
		{
			if(ImGui.MenuItem(bg.generators[i].name))
			{
				gGeneratorInstances.push(
					{
						seed:0,
						generator:bg.generators[i],
						setInputs:{},
						output:{}
					}
				);
			}
			if(bg.generators[i].description != undefined && ImGui.IsItemHovered())
			{
				ImGui.SetTooltip(bg.generators[i].description);
			}
		}
		for(var c=0; c<numOpen; ++c)
		{
			ImGui.EndMenu();
		}
	}
}
