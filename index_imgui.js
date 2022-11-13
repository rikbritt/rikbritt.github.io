

var gRenderer = null;
var gRenderOptions = {
	showGround:false,
	showWireframe:false,
	showConstructionInfo:false
};
var gBlankEntry = "--- None ---";
var gBlockImGuiInput = false;


function UpdateImgui(dt, timestamp)
{
	ImGui_Impl.NewFrame(timestamp);
	ImGui.NewFrame();

	if (ImGui.BeginMainMenuBar())
	{
		if (ImGui.BeginMenu("Generators"))
		{
			UpdateGeneratorsList();
			ImGui.EndMenu();
		}
		if (ImGui.BeginMenu("View Options"))
		{
			UpdateViewOptions();
			ImGui.EndMenu();
		}
		if (ImGui.BeginMenu("Hierarchies"))
		{
			if(ImGui.MenuItem("Hierarchy Editor"))
			{
				gShowHierarchyEditor = !gShowHierarchyEditor;
			}
			UpdateGeneratorHierarchiesList();
			ImGui.EndMenu();
		}
		ImGui.EndMainMenuBar();
	}
	ImGui.End();

	UpdateHierarchyEditor();

	for(var i=0; i<gGeneratorInstances.length; ++i)
	{
		var generatorInstance = gGeneratorInstances[i];
		if(ImGui.Begin(`Generator ${i} - ${bg.GetGeneratorFullName(generatorInstance.generator)}`))
		{
			if(generatorInstance.generator.description != undefined)
			{
				ImGui.Text(generatorInstance.generator.description);
			}
			if(ImGui.Button("Randomise"))
			{
				generatorInstance.seed = Math.floor( Math.random() * 2000 );
			}
			ImGui.SameLine();
			ImGui.SliderInt("Seed", (_ = generatorInstance.seed) => generatorInstance.seed = _, 0, 10000000);
			if(ImGui.TreeNodeEx("Inputs", ImGui.TreeNodeFlags.DefaultOpen))
			{	
				UpdateGeneratorInputsImGui(generatorInstance.generator.inputs, generatorInstance.setInputs);
				ImGui.TreePop();
			}
			if(ImGui.Button("Generate"))
			{
				RunGeneratorInstance(generatorInstance);
			}
	  	}
		
		ImGui.Text("Generator Output");
		{
			if(generatorInstance.output.outputs)
			{
				if(generatorInstance.output.outputs.model == null)
				{
					UpdateObjectImGui(generatorInstance.output.outputs, "output");
				}
				else
				{
					var renderTargetProperties = gRenderer.properties.get(generatorInstance.renderTarget.texture);
					//get win width
					var avail_width = ImGui.GetContentRegionAvail().x;
					var image_width = avail_width - 8;
					if(image_width > 2)
					{
						var image_height = image_width * (gGeneratorRenderTargetHeight / gGeneratorRenderTargetWidth);
						ImGui.ImageButton(renderTargetProperties.__webglTexture, new ImGui.Vec2(image_width, image_height), new ImGui.Vec2(0,1), new ImGui.Vec2(1,0));
						if(ImGui.IsItemHovered())
						{
							generatorInstance.sendInputToScene = true;
						}
						else
						{
							generatorInstance.sendInputToScene = false;
						}
						if (ImGui.BeginDragDropSource(ImGui.DragDropFlags.None))
						{
							ImGui.EndDragDropSource();
						}
					}
				}
			}
		}
	}
	ImGui.End();

	ImGui.EndFrame();
}

gRenderImGui = true;
function OnRenderOption(elementName) 
{
	var checkBox = document.getElementById(elementName);
	gRenderOptions[elementName] = checkBox.checked;
	RunTest();
}

function UpdateViewOptions()
{
	ImGui.Checkbox("Ground", (value = gRenderOptions.showGround) => gRenderOptions.showGround = value);
	ImGui.Checkbox("Wireframe", (value = gRenderOptions.showWireframe) => gRenderOptions.showWireframe = value);
	ImGui.Checkbox("Construction Info", (value = gRenderOptions.showConstructionInfo) => gRenderOptions.showConstructionInfo = value);
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
			ImGui.TreePop();
		}
	}
	else if(object instanceof Map)
	{
		if(ImGui.TreeNodeEx(name, ImGui.TreeNodeFlags.DefaultOpen))
		{
			for([key, val] of object) 
			{
				UpdateObjectImGui(val, key);
			}
			ImGui.TreePop();
		}
	}
	else if(typeof(object) == 'object')
	{
		if(ImGui.TreeNodeEx(name, ImGui.TreeNodeFlags.DefaultOpen))
		{
			if(object.data_type == "timeline")
			{
				if(ImGui.TreeNodeEx("Timeline Visualisation"))
				{
					AddTimeline("vis", object);
					ImGui.TreePop();
				}
			}
			for([key, val] of Object.entries(object)) 
			{
				UpdateObjectImGui(val, key);
			}
			ImGui.TreePop();
		}
	}
	else
	{
		if(ImGui.SmallButton("Copy"))
		{
			ImGui.LogToClipboard();
			ImGui.LogText(String(object));
			ImGui.LogFinish();
		}
		ImGui.SameLine();
		var str = String(object);
		if(str.length > 128)
		{
			if(ImGui.TreeNodeEx(name))
			{
				ImGui.Text(str);
				ImGui.TreePop();
			}
		}
		else
		{
			ImGui.Text(name + " : " + str);
		}
	}
	
	ImGui.PopID();
}

function OnPageLoaded() 
{

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
		gRenderer = new THREE.WebGLRenderer({canvas:canvas});
		gRenderer.setSize( renderWidth, renderHeight );
        //gRenderer = bg.CreateRenderer(renderWidth, renderHeight, canvas);
		//gRenderScene = bg.CreateScene(renderWidth, renderHeight, canvas, function() {}, function() {});

        ImGui_Impl.Init(canvas);
			
		var clock = new THREE.Clock();

		var animate = function (timestamp) 
		{
			requestAnimationFrame( animate );

			var dt = clock.getDelta();
			UpdateImgui(dt, timestamp);

/*
			if(gRenderScene)
			{
				for(var i=0; i<gRenderScene.updateScripts.length; ++i)
				{
					var updateInfo = gRenderScene.updateScripts[i];
					updateInfo.updateScript(dt, updateInfo.node, updateInfo.node.temp_renderModel);
				}
			}
*/
			for(var i=0; i<gGeneratorInstances.length; ++i)
			{
				var generatorInstance = gGeneratorInstances[i];
				if(generatorInstance.renderScene)
				{
					bg.UpdateScene(generatorInstance.renderScene, generatorInstance.sendInputToScene, dt, timestamp);
				}
			}

			for(var i=0; i<gGeneratorInstances.length; ++i)
			{
				var generatorInstance = gGeneratorInstances[i];
				if(generatorInstance.renderScene)
				{
					bg.RenderScene(generatorInstance.renderTarget, generatorInstance.renderScene, dt, timestamp);				
				}
			}

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
			
			/*
			for(var i=0; i<gGeneratorInstances.length; ++i)
			{
				var generatorInstance = gGeneratorInstances[i];
				if(generatorInstance.renderScene)
				{
					bg.UpdateScene(generatorInstance.viewportLocation, generatorInstance.renderScene, dt, timestamp);
				}
			}
			*/
		};

		animate();
      
        function _done() {
          ImGui_Impl.Shutdown();
          ImGui.DestroyContext();
        }
      })();
}
