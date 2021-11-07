
var gChosenGenerator = mm_scenarioGenerator;
var gGeneratorHierarchy = null;
var gTargetHierarchyNode = null;

var gGeneratorInputs = {};
var gGeneratorOutputs = {};
var gRenderScene = null;
var gRenderOptions = {
	showGround:false,
	showWireframe:false,
	showConstructionInfo:false
};
var gBlankEntry = "--- None ---";

function doThing(){
   alert('Horray! Someone wrote "' + this.value + '"!');
}

function ClearUIInput(inputName)
{
	gGeneratorInputs[inputName] = undefined;
	RunTest();
}

function CreateUIForDataDef(inputs, hostElement) {
	hostElement.innerHTML = "";
	for([paramKey, paramData] of Object.entries(inputs)) {
	
		var container = document.createElement("p");
		container.append(paramKey + " : ");
		container.setAttribute("id", "Input_" + paramKey);
		
		var addclearButton = false;
		if(paramData.type == "float" 
			|| paramData.type == "distance"
			|| paramData.type == "time"
		) {
		
			var valDisplay = document.createElement("p");
			valDisplay.append(paramData.value);
			valDisplay.setAttribute("id", "InputVal_" + paramKey);
			valDisplay.style.display = "inline";
		
			var valEdit = document.createElement("input");
			valEdit.setAttribute("type", "range");
			valEdit.setAttribute("min", paramData.min * 10.0);
			valEdit.setAttribute("max", paramData.max * 10.0);
			valEdit.setAttribute("id", "InputSlider_" + paramKey);
			var makeOnValueChange = function() { 
				var pKey = paramKey;
				return function(){
					gGeneratorInputs[pKey] = Number(this.value) / 10.0;
					RunTest();
				}
			};
			valEdit.addEventListener('input', makeOnValueChange());
			
			container.appendChild(valEdit);
			container.appendChild(valDisplay);
			addclearButton = true;
		}
		else if(paramData.type == "int")
		{
			var valDisplay = document.createElement("p");
			valDisplay.append(paramData.value);
			valDisplay.setAttribute("id", "InputVal_" + paramKey);
			valDisplay.style.display = "inline";
		
			var valEdit = document.createElement("input");
			valEdit.setAttribute("type", "range");
			valEdit.setAttribute("min", paramData.min);
			valEdit.setAttribute("max", paramData.max );
			valEdit.setAttribute("id", "InputIntSlider_" + paramKey);
			var makeOnValueChange = function() { 
				var pKey = paramKey;
				return function(){
					gGeneratorInputs[pKey] = Number(this.value);
					RunTest();
				}
			};
			valEdit.addEventListener('input', makeOnValueChange());
			
			container.appendChild(valEdit);
			container.appendChild(valDisplay);
			addclearButton = true;
		}
		else if(paramData.type == "params")
		{
			var valEdit = document.createElement("p");
			
			CreateUIForDataDef(paramData.paramType.fields, valEdit);
			
			container.appendChild(valEdit);
		}
		else if(paramData.type == "bool")
		{
			//todo: Checkbox
			var valDisplay = document.createElement("p");
			valDisplay.style.display = "inline";
			valDisplay.innerHTML = paramData.value == null ? "null" : paramData.value.toString();
			
			container.appendChild(valDisplay);
		}
		
		if(addclearButton)
		{
			var clearButton = document.createElement("button");
			clearButton.append("Clear Override");
			clearButton.setAttribute("onclick", "ClearUIInput('" + paramKey + "')");
			container.appendChild(clearButton);
		}
		
		if(paramData.description != null)
		{
			var description = document.createElement("span");
			description.innerHTML = paramData.description;
			container.appendChild(description);
		}
		
		hostElement.appendChild(container);
	}
}

function RefreshUIForGeneratorInputs() {
	for([paramKey, paramData] of Object.entries(gGeneratorInputs)) {
		var container = document.getElementById("Input_" + paramKey);
		var valDisplay = document.getElementById("InputVal_" + paramKey);
		if(valDisplay)
		{
			valDisplay.innerHTML = paramData;
			//valDisplay.style.color = "red";
		}
		
		var valSlider = document.getElementById("InputSlider_" + paramKey);
		if(valSlider)
		{
			valSlider.value = paramData * 10.0;
		}
		
		var valIntSlider = document.getElementById("InputIntSlider_" + paramKey);
		if(valIntSlider)
		{
			valIntSlider.value = paramData;
		}
	}
}

function UpdateTest(dt)
{
	if(gRenderScene)
	{
		for(var i=0; i<gRenderScene.updateScripts.length; ++i)
		{
			var updateInfo = gRenderScene.updateScripts[i];
			updateInfo.updateScript(dt, updateInfo.node, updateInfo.node.temp_renderModel);
		}
	}
}

function RunTest()
{
	if(gGeneratorHierarchy == null)
	{
		//Create an empty hierarchy for the selected generator
		gGeneratorHierarchy = bg.CreateGenerationHierarchy("Test Harness");
		gTargetHierarchyNode = bg.CreateGenerationHierarchyNode(gGeneratorHierarchy, gChosenGenerator);
	}
	RenderHierarchy();

	var seedInputElement = document.getElementById('seedInput');
	//gGeneratorOutputs = bg.RunGenerator(gChosenGenerator, Number(seedInputElement.value), gGeneratorInputs);
	gGeneratorOutputs = bg.GenerateHierarchyNode(gTargetHierarchyNode, Number(seedInputElement.value), gGeneratorInputs);
	
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
	
	if(gGeneratorOutputs.outputs.model)
	{
		document.getElementById('modelOutput').style.visibility = "visible";
		document.getElementById('modelOutput').style.height = null;
		document.getElementById('dataOutput').style.visibility = "hidden";
		document.getElementById('dataOutput').style.height = "0px";
		bg.AddModelToScene(gRenderScene, gGeneratorOutputs.outputs.model, gRenderOptions);
	}
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
	}
	//Draw2DModel(gGeneratorOutputs.outputs.model, document.getElementById('myCanvas'));
	
	//Rebuild/Refresh UI inputs
	gGeneratorInputs = gGeneratorOutputs.builtInputs;
	RefreshUIForGeneratorInputs();
}

function RunTestWithRandomSeed()
{
	gGeneratorInputs = {};
	var seedInputElement = document.getElementById('seedInput');
	var d = new Date();
	Math.seedrandom(d.getTime());
	seedInputElement.value = Math.floor( Math.random() * 2000 );
	RunTest();
}

function OnRenderOption(elementName) {
	var checkBox = document.getElementById(elementName);
	gRenderOptions[elementName] = checkBox.checked;
	RunTest();
}

function BuildGeneratorList() {
	var generatorsList = document.getElementById('generatorsList');
	
	var noneOpt = document.createElement('option');
	noneOpt.innerHTML = gBlankEntry;
	generatorsList.appendChild(noneOpt);
	
	for(var i=0; i<bg.generators.length; ++i)
	{
		var opt = document.createElement('option');
		opt.innerHTML = bg.GetGeneratorFullName(bg.generators[i]);
		generatorsList.appendChild(opt);
		
		//Make the current generator the default selection
		if(bg.generators[i] == gChosenGenerator)
		{
			generatorsList.value = bg.GetGeneratorFullName(bg.generators[i]);
		}
	}
}

function BuildGeneratorHierarchiesList() {
	var list = document.getElementById('generatorHierarchiesList');
	
	var noneOpt = document.createElement('option');
	noneOpt.innerHTML = gBlankEntry;
	list.appendChild(noneOpt);
	
	for(var i=0; i<bg.generatorHierarchies.length; ++i)
	{
		var opt = document.createElement('option');
		opt.innerHTML = bg.generatorHierarchies[i].name;
		list.appendChild(opt);
		
		////Make the current generator the default selection
		//if(bg.generators[i] == gChosenGenerator)
		//{
		//	generatorsList.value = bg.GetGeneratorFullName(bg.generators[i]);
		//}
	}
}

function SetNewGenerator()
{
	var generatorHierarchiesList = document.getElementById('generatorHierarchiesList');
	generatorHierarchiesList.value = gBlankEntry;
	
	var generatorsList = document.getElementById('generatorsList');
	for(var i=0; i<bg.generators.length; ++i)
	{
		if(bg.GetGeneratorFullName(bg.generators[i]) == generatorsList.value)
		{
			gChosenGenerator = bg.generators[i];
			gGeneratorHierarchy = null;
			gTargetHierarchyNode = null;
			CreateUIForDataDef(gChosenGenerator.inputs, document.getElementById('gGeneratorInputs'));
			RunTest();
			return;
		}
	}
	
	if(generatorsList.value != gBlankEntry)
	{
		alert("Couldn't find generator called " + generatorsList.value);
	}
}

function SetNewGeneratorHierarchy()
{
	var generatorsList = document.getElementById('generatorsList');
	generatorsList.value = gBlankEntry;
	
	var generatorHierarchiesList = document.getElementById('generatorHierarchiesList');
	for(var i=0; i<bg.generatorHierarchies.length; ++i)
	{
		if(bg.generatorHierarchies[i].name == generatorHierarchiesList.value)
		{
			gChosenGenerator = null;
			gGeneratorHierarchy = bg.generatorHierarchies[i];
			gTargetHierarchyNode = gGeneratorHierarchy.hierarchyNodes[gGeneratorHierarchy.hierarchyNodes.length-1]; //Just pick last for now.
			//CreateUIForDataDef(gChosenGenerator.inputs, document.getElementById('gGeneratorInputs'));
			RunTest();
			return;
		}
	}
	
	if(generatorHierarchiesList.value != gBlankEntry)
	{
		alert("Couldn't find generator hierarchy called " + generatorHierarchiesList.value);
	}
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
	
	//Build the selection list of generators.
	//BuildGeneratorList();
	//BuildGeneratorHierarchiesList();
		
	//Set render option check boxes.
	for([paramKey, paramData] of Object.entries(gRenderOptions)) {
		var checkBox = document.getElementById(paramKey);
		checkBox.checked = paramData;
	}	
	
	//Create the render scene
	var renderWidth = 640;
	var renderHeight = 320;
	
	//gRenderScene = bg.CreateScene(renderWidth, renderHeight, document.getElementById('modelOutput'), UpdateTest);
	
	//CreateUIForDataDef(gChosenGenerator.inputs, document.getElementById('gGeneratorInputs'));
	//RenderHierarchy();
	RunTest();

    (async function() {
        await ImGui.default();
        const canvas = document.getElementById("output");
        const devicePixelRatio = window.devicePixelRatio || 1;
        canvas.width = canvas.scrollWidth * devicePixelRatio;
        canvas.height = canvas.scrollHeight * devicePixelRatio;
        window.addEventListener("resize", () => {
          const devicePixelRatio = window.devicePixelRatio || 1;
          canvas.width = canvas.scrollWidth * devicePixelRatio;
          canvas.height = canvas.scrollHeight * devicePixelRatio;
        });
      
        ImGui.CreateContext();
        ImGui_Impl.Init(canvas);
      
        ImGui.StyleColorsDark();
        //ImGui.StyleColorsClassic();
      
        const clear_color = new ImGui.ImVec4(0.45, 0.55, 0.60, 1.00);
      
        /* static */ let buf = "Quick brown fox";
        /* static */ let f = 0.6;
      
        let done = false;
        window.requestAnimationFrame(_loop);
        function _loop(time) {
          ImGui_Impl.NewFrame(time);
          ImGui.NewFrame();
      
          ImGui.SetNextWindowPos(new ImGui.ImVec2(20, 20), ImGui.Cond.FirstUseEver);
          ImGui.SetNextWindowSize(new ImGui.ImVec2(294, 140), ImGui.Cond.FirstUseEver);
          ImGui.Begin("Debug");
      
          try {
            ImGui.Text('Hi');
          } catch (e) {
            ImGui.TextColored(new ImGui.ImVec4(1.0,0.0,0.0,1.0), "error: ");
            ImGui.SameLine();
            ImGui.Text(e.message);
          }
      
          ImGui.End();
      
          ImGui.EndFrame();
      
          ImGui.Render();
          const gl = ImGui_Impl.gl;
          gl && gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
          gl && gl.clearColor(clear_color.x, clear_color.y, clear_color.z, clear_color.w);
          gl && gl.clear(gl.COLOR_BUFFER_BIT);
          //gl.useProgram(0); // You may want this if using this code in an OpenGL 3+ context where shaders may be bound
      
          ImGui_Impl.RenderDrawData(ImGui.GetDrawData());
      
          window.requestAnimationFrame(done ? _done : _loop);
        }
      
        function _done() {
          ImGui_Impl.Shutdown();
          ImGui.DestroyContext();
        }
      })();
}
