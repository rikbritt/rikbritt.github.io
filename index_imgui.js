var gGeneratorInstances = [];

var gRenderScene = null;
var gRenderOptions = {
	showGround:false,
	showWireframe:false,
	showConstructionInfo:false
};
var gBlankEntry = "--- None ---";

function UpdateGeneratorInputsImGui(generatorInputs, setInputs)
{
	ImGui.Indent();
	for([paramKey, paramData] of Object.entries(generatorInputs))
	{		
		var addclearButton = false;
		if(paramData.type == "float" 
			|| paramData.type == "distance"
			|| paramData.type == "time")
		{
			if(setInputs[paramKey] == null)
			{
				setInputs[paramKey] = paramData.min;//temp
			}
			if(ImGui.Button("Clear"))
			{
				setInputs[paramKey] = paramData.min;
			}
			ImGui.SameLine();
			ImGui.SliderFloat(paramKey, (_ = setInputs[paramKey]) => setInputs[paramKey] = _, paramData.min, paramData.max);
		}
		else if(paramData.type == "int")
		{
			if(setInputs[paramKey] == null)
			{
				setInputs[paramKey] = paramData.min;//temp
			}
			if(ImGui.Button("Clear"))
			{
				setInputs[paramKey] = paramData.min;
			}
			ImGui.SameLine();
			ImGui.SliderInt(paramKey, (_ = setInputs[paramKey]) => setInputs[paramKey] = _, paramData.min, paramData.max);
		}
		else if(paramData.type == "params")
		{			
			UpdateGeneratorInputsImGui(paramData.paramType.fields, setInputs);
		}
		else if(paramData.type == "bool")
		{
			if(setInputs[paramKey] == null)
			{
				setInputs[paramKey] = true;//temp
			}
			ImGui.Checkbox(paramKey, (_ = setInputs[paramKey]) => setInputs[paramKey] = _);
		}
		else
		{
			ImGui.Text("Unknown param : " + paramKey);
		}
		
		if(paramData.description != null)
		{
			ImGui.Text(paramData.description);
		}		
	}
	ImGui.Unindent();
}

function UpdateImgui(dt, timestamp)
{
	ImGui_Impl.NewFrame(timestamp);
	ImGui.NewFrame();

	if(ImGui.Begin("Generators"))
	{
	  UpdateViewOptions();
	  UpdateGeneratorsList();
	  UpdateGeneratorHierarchiesList();
	}
	ImGui.End();

	for(var i=0; i<gGeneratorInstances.length; ++i)
	{
	  var generatorInstance = gGeneratorInstances[i];
	  if(ImGui.Begin("Generator " + i + bg.GetGeneratorFullName(generatorInstance[i].generator)))
	  {
		  if(ImGui.Button("Randomise"))
		  {
			generatorInstance.seed = Math.floor( Math.random() * 2000 );
		  }
		  ImGui.SliderInt("Seed", (_ = generatorInstance.seed) => generatorInstance.seed = _, 0, 10000000);
		  UpdateGeneratorInputsImGui(generatorInstance.generator.inputs, generatorInstance.setInputs);
		  if(ImGui.Button("Generate"))
		  {
			  RunGeneratorInstance(generatorInstance);
		  }
	  }

	  ImGui.Text("Generator Output");
	  //if(ImGui.Begin("Generator Output"))
	  {
		  if(generatorInstance.output.outputs)
		  {
			  if(generatorInstance.output.outputs.model == null)
			  {
				  UpdateObjectImGui(generatorInstance.outputs.output, "output");
			  }
		  }
	  }
	  ImGui.End();
	}


	ImGui.EndFrame();

	if(gRenderScene)
	{
		for(var i=0; i<gRenderScene.updateScripts.length; ++i)
		{
			var updateInfo = gRenderScene.updateScripts[i];
			updateInfo.updateScript(dt, updateInfo.node, updateInfo.node.temp_renderModel);
		}
	}
}

gRenderImGui = true;
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
	
	bg.ClearScene(gRenderScene);
	
	var light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
	light.position.set(0,0.7,0.4);
	gRenderScene.scene.add( light );
			
	if(gRenderOptions.showGround)
	{
		var groundHeight = 0.05;
		var groundSize = 10;
		var groundGeometry = new THREE.BoxGeometry( groundSize, groundHeight, groundSize );
		var groundMaterial = new THREE.MeshBasicMaterial( { color: 0x008800 } );
		var ground = new THREE.Mesh( groundGeometry, groundMaterial );
		ground.position.y = -(groundHeight*0.5);
		gRenderScene.scene.add( ground );

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
			gRenderScene.scene.add( xPlane );
			
			var zPlane = new THREE.Mesh( gridLineGeometry, gridMaterial );
			zPlane.rotation.x = THREE.Math.degToRad(-90);
			zPlane.rotation.z = THREE.Math.degToRad(-90);
			zPlane.position.y = 0.001;
			zPlane.position.x = i;
			//zPlane.rotation.z = THREE.Math.degToRad(-90);
			gRenderScene.scene.add( zPlane );
		}
	}
	
	if(generatorInstance.output.outputs.model)
	{
		//document.getElementById('modelOutput').style.visibility = "visible";
		//document.getElementById('modelOutput').style.height = null;
		//document.getElementById('dataOutput').style.visibility = "hidden";
		//document.getElementById('dataOutput').style.height = "0px";
		bg.AddModelToScene(gRenderScene, generatorInstance.output.outputs.model, gRenderOptions);
	}
	/*
	else
	{
		document.getElementById('modelOutput').style.visibility = "hidden";
		document.getElementById('modelOutput').style.height = "0px";
		document.getElementById('dataOutput').style.visibility = "visible";
		document.getElementById('dataOutput').style.height = null;
		
		document.getElementById('dataOutput').innerHTML = "";
		var jsonViewer = new JSONViewer();
		document.getElementById('dataOutput').appendChild(jsonViewer.getContainer());
		jsonViewer.showJSON(gGeneratorOutputs.outputs);
	}*/
	//Draw2DModel(gGeneratorOutputs.outputs.model, document.getElementById('myCanvas'));
	
	//Rebuild/Refresh UI inputs
	generatorInstance.inputs = generatorInstance.output.outputs.builtInputs;
	//RefreshUIForGeneratorInputs();
}

function RunGeneratorInstanceWithRandomSeed(generatorInstance)
{
	var d = new Date();
	Math.seedrandom(d.getTime());
	generatorInstance.seed = Math.floor( Math.random() * 2000 );
	RunGeneratorInstance(generatorInstance);
}

function OnRenderOption(elementName) 
{
	var checkBox = document.getElementById(elementName);
	gRenderOptions[elementName] = checkBox.checked;
	RunTest();
}

function UpdateViewOptions()
{
    if(ImGui.CollapsingHeader("View Options"))
    {
        ImGui.Indent();
        ImGui.Checkbox("Ground", (value = gRenderOptions.showGround) => gRenderOptions.showGround = value);
        ImGui.Checkbox("Wireframe", (value = gRenderOptions.showWireframe) => gRenderOptions.showWireframe = value);
        ImGui.Checkbox("Construction Info", (value = gRenderOptions.showConstructionInfo) => gRenderOptions.showConstructionInfo = value);
        ImGui.Unindent();
    }
}

function UpdateGeneratorsList() 
{    
    if(ImGui.BeginCombo("Generators"))
    {
        for(var i=0; i<bg.generators.length; ++i)
        {
            if(ImGui.Selectable(bg.GetGeneratorFullName(bg.generators[i])))
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
        }
        ImGui.EndCombo();
    }
}

function UpdateGeneratorHierarchiesList() 
{
    if(ImGui.BeginCombo("Hierarchies", "???"))
    {
        for(var i=0; i<bg.generatorHierarchies.length; ++i)
        {
            if(ImGui.Selectable(bg.generatorHierarchies[i].name))
            {
                //gChosenGenerator = bg.generators[i];
            }
        }
        ImGui.EndCombo();
    }
}

function UpdateObjectImGui(object, name)
{
	ImGui.PushID(name);
	if(Array.isArray(object))
	{
		if(ImGui.TreeNodeEx(name + "[" + object.length + "]", ImGui.TreeNodeFlags.DefaultOpen))
		{
			for(var i=0; i<object.length; ++i)
			{
				UpdateObjectImGui(object[i], name + "[" + i + "]");
			}
		}
	}
	else if(typeof(object) == 'object')
	{
		if(ImGui.TreeNodeEx(name, ImGui.TreeNodeFlags.DefaultOpen))
		{
			for([key, val] of Object.entries(object)) 
			{
				UpdateObjectImGui(val, key);
			}
		}
	}
	else
	{
		ImGui.Text(name + " : " + String(object));
	}
	
	ImGui.PopID();
}

function SetupHierarchyView()
{
	var canvas = document.getElementById('hierarchyCanvas');
	paper.setup(canvas);
	paper.view.center = new paper.Point(0,0);
}

function RenderHierarchy()
{
	paper.project.activeLayer.removeChildren();
	if(gGeneratorHierarchy != null)
	{
		var RenderHierarchyLevel = function(nodes, lvl)
		{
			for(var i=0; i<nodes.length; ++i)
			{
				var hierarchyNode = nodes[i];
				
				var nodeCenter = new paper.Point(0, lvl * 40);
				var rectangle = new paper.Rectangle();
				rectangle.center = nodeCenter;
				rectangle.size = new paper.Size(100, 30);
				var path = new paper.Path.Rectangle(rectangle);
				path.fillColor = '#e9e9ff';
				
				var txt = new paper.PointText(nodeCenter);
				txt.content = hierarchyNode.generator.name;
				txt.justification = 'center';
				//path.selected = true;
				
				if(hierarchyNode.inputs.length > 0)
				{
					var childNodes = [];
					for(var j=0; j<hierarchyNode.inputs.length; ++j)
					{
						childNodes.push(hierarchyNode.inputs[j].fromNode);
					}
					RenderHierarchyLevel(childNodes, lvl+1);
				}
			}
		};
		
		RenderHierarchyLevel(gGeneratorHierarchy.hierarchyNodes, 0);
	}
	paper.view.draw();
}

function OnPageLoaded() {

	//SetupHierarchyView();
		
	//Set render option check boxes.
	//for([paramKey, paramData] of Object.entries(gRenderOptions)) {
	//	var checkBox = document.getElementById(paramKey);
	//	checkBox.checked = paramData;
	//}	
	
	//Create the render scene
	//var renderWidth = 1280;
	//var renderHeight = 720;
	
	//RenderHierarchy();
	//RunTest();

    (async function() {
        await ImGui.default();
        const canvas = document.getElementById("output");
		var renderWidth = canvas.clientWidth;
		var renderHeight = canvas.clientHeight;
        /*
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.scrollWidth * devicePixelRatio;
        canvas.height = canvas.scrollHeight * devicePixelRatio;
        window.addEventListener("resize", () => {
          const devicePixelRatio = window.devicePixelRatio || 1;
          canvas.width = canvas.scrollWidth * devicePixelRatio;
          canvas.height = canvas.scrollHeight * devicePixelRatio;
        });*/
      
        ImGui.CreateContext();
      
        ImGui.StyleColorsDark();
        //ImGui.StyleColorsClassic();
      
        const clear_color = new ImGui.ImVec4(0.45, 0.55, 0.60, 1.00);
      
        /* static */ let buf = "Quick brown fox";
        /* static */ let f = 0.6;
      
		gRenderScene = bg.CreateScene(renderWidth, renderHeight, canvas, function() { }, function() { });

        ImGui_Impl.Init(canvas);
			
		var clock = new THREE.Clock();

		var animate = function (timestamp) 
		{
			requestAnimationFrame( animate );

			var dt = clock.getDelta();
			UpdateImgui(dt, timestamp);
			bg.UpdateScene(gRenderScene, dt, timestamp);

			if(gRenderImGui)
			{
				//Build the imgui render data
				ImGui.Render();
		
				//Clear the background
				//const gl = ImGui_Impl.gl;
				//const clear_color = new ImGui.ImVec4(0.45, 0.55, 0.60, 1.00);
				//gl && gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
				//gl && gl.clearColor(clear_color.x, clear_color.y, clear_color.z, clear_color.w);
				//gl && gl.clear(gl.COLOR_BUFFER_BIT);
				//gl.useProgram(0); // You may want this if using this code in an OpenGL 3+ context where shaders may be bound
		
				//Render the imgui data
				ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
			}
		};

		animate();
      
        function _done() {
          ImGui_Impl.Shutdown();
          ImGui.DestroyContext();
        }
      })();
}
