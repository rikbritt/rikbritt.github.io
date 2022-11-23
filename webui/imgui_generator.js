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

function UpdateParamEditorV2(paramData, getFunc, setFunc, paramKey)
{
	if(paramData.type == "float" 
	|| paramData.type == "distance"
	|| paramData.type == "time")
	{
		ImGui.SliderFloat(paramKey, (_ = getFunc()) => setFunc(_), paramData.min, paramData.max);		
	}
	else if(paramData.type == "int")
	{
		ImGui.SliderInt(paramKey, (_ = getFunc()) => setFunc(_), paramData.min, paramData.max);
	}
	else if(paramData.type == "data")
	{
		//Not done here
	}
	else if(paramData.type == "bool")
	{
		ImGui.Checkbox(paramKey, (_ = getFunc()) => setFunc(_));
	}
	else if(paramData.type == "text")
	{
		ImGui.InputText(paramKey, (_ = getFunc()) => setFunc(_), 256);
	}
	else if(paramData.type == "list")
	{
		//Not done here
	}
	else
	{
		ImGui.Text(`Unknown param type '${paramData.type}' for '${paramKey}'`);
	}
}

function UpdateGeneratorInputsImGuiV2_Recurse(generatorInputs, setInputs)
{
	for([paramKey, paramData] of Object.entries(generatorInputs))
	{
        ImGui.TableNextRow();
        ImGui.TableNextColumn();
		
		ImGui.PushID(paramKey);
		if(paramData.type == "data")
		{
			if(setInputs[paramKey] == null)
			{
				ImGui.Text(paramKey);
				ImGui.TableNextColumn();
				if(ImGui.Button("Override Data " + paramKey))
				{
					setInputs[paramKey] = GetParamDefault(paramData);
				}
			}
			else
			{
				if(ImGui.TreeNode(paramKey))
				{
					UpdateGeneratorInputsImGuiV2_Recurse(paramData.dataType.fields, setInputs[paramKey]);
					ImGui.TreePop();
				}
			}
		}
		else if(paramData.type == "list")
		{
			if(setInputs[paramKey] == null)
			{
				ImGui.Text(paramKey);
				ImGui.TableNextColumn();
				if(ImGui.Button("Override List " + paramKey))
				{
					setInputs[paramKey] = GetParamDefault(paramData);
				}
			}
			else
			{
				var list = setInputs[paramKey];
				if(Array.isArray(list) == false)
				{
					ImGui.Text(`${paramKey} is not a JS Array!`);
				}
				else
				{
					if(ImGui.TreeNodeEx(`${paramKey} ${list.length} / ${paramData.max}`, ImGui.TreeNodeFlags.DefaultOpen))
					{
						for(var i=0; i<list.length; ++i)
						{
							ImGui.PushID(i);
							ImGui.TableNextRow();
							ImGui.TableNextColumn();
							ImGui.Text(`${i} :`);

							ImGui.TableNextColumn();
							if(ImGui.Button("Del"))
							{
								list.splice(i, 1);
								--i;
							}
							else
							{
								ImGui.TableNextColumn();
								UpdateParamEditorV2(
									paramData.elementType,
									function() { var l = list; var idx = i; return function () { 
										return l[idx];
										} }(),
									function() { var l = list; var idx = i; return function (val) {
										l[idx] = val;
										return val;
									} }(),
									`${i}`
								);
							}
							ImGui.PopID();
						}
						
						ImGui.TableNextRow();
						ImGui.TableNextColumn();
						if(list.length < paramData.max && ImGui.Button("Add Element"))
						{
							list.push(GetParamDefault(paramData.elementType));
						}

						ImGui.TreePop();
					}
				}
			}
		}
		else
		{
			ImGui.Text(paramKey);
			var addclearButton = false;
			
			ImGui.TableNextColumn();
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
					ImGui.TableNextColumn();
					UpdateParamEditorV2(
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
		}

		//if(paramData.description != null)
		//{
		//	ImGui.Text(paramData.description);
		//}
		ImGui.PopID();
	}
}

function UpdateGeneratorInputsImGuiV2(generatorInputs, setInputs)
{
	ImGui.BeginTable("Parameter_Table", 3, ImGui.ImGuiTableFlags.Borders | ImGui.ImGuiTableFlags.RowBg);

	ImGui.TableSetupColumn("Param");
	ImGui.TableSetupColumn("Control");
	ImGui.TableSetupColumn("Value");
	ImGui.TableHeadersRow();

	UpdateGeneratorInputsImGuiV2_Recurse(generatorInputs, setInputs);

	ImGui.EndTable();
}

function UpdateGeneratorsList( selected_func ) 
{
	//Default behaviour - add generator to instances list
	if(selected_func == null)
	{
		selected_func = function(selected_generator)
		{
			gGeneratorInstances.push(
				{
					open:true,
					seed:0,
					generator:selected_generator,
					setInputs:{},
					output:{}
				}
			);
		};
	}
	
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
				selected_func(bg.generators[i]);
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

function UpdateGeneratorInstances()
{
	for(var i=0; i<gGeneratorInstances.length; ++i)
	{
		var generatorInstance = gGeneratorInstances[i];
		if(ImGui.Begin(`Generator ${i} - ${bg.GetGeneratorFullName(generatorInstance.generator)}`, (_ = generatorInstance.open) => generatorInstance.open = _))
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

			//TODO: Delete when sure V2 is ok
			//if(ImGui.TreeNodeEx("Inputs", ImGui.TreeNodeFlags.DefaultOpen))
			//{	
			//	UpdateGeneratorInputsImGui(generatorInstance.generator.inputs, generatorInstance.setInputs);
			//	ImGui.TreePop();
			//}

			if(ImGui.CollapsingHeader("Inputs"))
			{
				UpdateGeneratorInputsImGuiV2(generatorInstance.generator.inputs, generatorInstance.setInputs);
			}

			if(ImGui.Button("Generate"))
			{
				RunGeneratorInstance(generatorInstance);
			}

			ImGui.SameLine();
			if(ImGui.Button("Randomise Seed & Generate"))
			{
				generatorInstance.seed = Math.floor( Math.random() * 2000 );
				RunGeneratorInstance(generatorInstance);
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
	}

	//Remove all closed windows
	gGeneratorInstances = gGeneratorInstances.filter(item => item.open);
}