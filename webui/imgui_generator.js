var gGeneratorInstances = [];
var gGeneratorRenderTargetWidth = 1920 / 2;
var gGeneratorRenderTargetHeight = 1080 / 2;

function RunGeneratorInstance(generatorInstance)
{
	generatorInstance.output = bg.RunGenerator(
		generatorInstance.generator, 
		generatorInstance.seed,
		generatorInstance.setInputs
	);
	
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

// function UpdateGeneratorInputsImGui(generatorInputs, setInputs)
// {
// 	for([paramKey, paramData] of Object.entries(generatorInputs))
// 	{
// 		ImGui.PushID(paramKey);
// 		var addclearButton = false;
		
// 		if(setInputs[paramKey] == null)
// 		{
// 			if(ImGui.Button("Override " + paramKey))
// 			{
// 				setInputs[paramKey] = GetParamDefault(paramData);
// 			}
// 		}
// 		else
// 		{
// 			if(ImGui.Button("Clear " + paramKey))
// 			{
// 				delete setInputs[paramKey];
// 			}
// 			else
// 			{
// 				ImGui.SameLine();
// 				UpdateParamEditor(
// 					paramData,
// 					function() { var inputs = setInputs; var key = paramKey; return function () { 
// 						return inputs[key];
// 					 } }(),
// 					function() { var inputs = setInputs; var key = paramKey; return function (val) {
// 						inputs[key] = val;
// 						return val;
// 					} }(),
// 					paramKey
// 				);
// 			}
// 		}
		
// 		if(paramData.description != null)
// 		{
// 			ImGui.Text(paramData.description);
// 		}
// 		ImGui.PopID();
// 	}
// }

//TODO - Delete in favour of per field registered editors
function UpdateParamEditorV2(field, getFunc, setFunc)
{
	// use this instead?
	//UpdateEditorForFieldValue(field.name, field, getFunc, setFunc);
    var field_imgui = gFieldTypesImGui[field.type];
	if(field_imgui != null)
	{
		field_imgui.edit_value_imgui(field.name, field, getFunc, setFunc);
	}
	else
	{
		ImGui.Text(`Unknown param type '${field.type}' for '${field.name}'`);
	}
}

function UpdateFieldNameTooltip(field)
{
	if(ImGui.IsItemHovered())
	{
		ImGui.SetTooltip("Id:" + field.id);
	}
}

function UpdateOverridableDataDef_Recurse(data_def, setInputs)
{
	if(data_def.fields.length != setInputs.length)
	{
		console.error("fix me! Input length mismatch");
	}

	for(var i=0; i<data_def.fields.length; ++i)
	{
		var field = data_def.fields[i];

        ImGui.TableNextRow();
        ImGui.TableNextColumn();
		
		ImGui.PushID(i);
		if(field.type == "data_def")
		{
			if(setInputs[i] == null)
			{
				ImGui.Text(field.name);
				UpdateFieldNameTooltip(field);

				ImGui.TableNextColumn();
				if(ImGui.Button("Override Data " + field.name))
				{
					setInputs[i] = bg.CreateFieldTypeInstance(field);
				}
			}
			else
			{
				if(ImGui.TreeNode(field.name))
				{
					var field_data_def = AssetDb.GetAsset(gAssetDb, field.default_def, "data_def");
					UpdateOverridableDataDef_Recurse(field_data_def, setInputs[i]);
					ImGui.TreePop();
				}
			}
		}
		else if(field.type == "list")
		{
			if(setInputs[i] == null)
			{
				ImGui.Text(field.name);
				UpdateFieldNameTooltip(field);

				ImGui.TableNextColumn();
				if(ImGui.Button("Override List " + field.name))
				{
					setInputs[i] = bg.CreateFieldTypeInstance(field);
				}
			}
			else
			{
				var list = setInputs[i];
				if(Array.isArray(list) == false)
				{
					ImGui.Text(`${field.name} is not a JS Array!`);
				}
				else
				{
					if(ImGui.TreeNodeEx(`${field.name} ${list.length} / ${field.max}`, ImGui.TreeNodeFlags.DefaultOpen))
					{
						for(var j=0; j<list.length; ++j)
						{
							ImGui.PushID(j);
							ImGui.TableNextRow();
							ImGui.TableNextColumn();
							ImGui.Text(`${j} :`);

							ImGui.TableNextColumn();
							if(ImGui.Button("Del"))
							{
								list.splice(j, 1);
								--j;
							}
							else
							{
								ImGui.TableNextColumn();
								UpdateParamEditorV2(
									field.elementType,
									function() { var l = list; var idx = j; return function () { 
										return l[idx];
										} }(),
									function() { var l = list; var idx = j; return function (val) {
										l[idx] = val;
										return val;
									} }()
								);
							}
							ImGui.PopID();
						}
						
						ImGui.TableNextRow();
						ImGui.TableNextColumn();
						if(list.length < field.max && ImGui.Button("Add Element"))
						{
							list.push(bg.CreateFieldTypeInstance(field.elementType));
						}

						ImGui.TreePop();
					}
				}
			}
		}
		else
		{
			ImGui.Text(field.name);
			UpdateFieldNameTooltip(field);
			
			var addclearButton = false;
			
			ImGui.TableNextColumn();
			if(setInputs[i] == null)
			{
				if(ImGui.Button("Override " + field.name))
				{
					setInputs[i] = bg.CreateFieldTypeInstance(field);
				}
			}
			else
			{
				if(ImGui.Button("Clear " + field.name))
				{
					//todo - splice array?
					delete setInputs[i];
				}
				else
				{
					ImGui.TableNextColumn();
					UpdateParamEditorV2(
						field,
						function() { var inputs = setInputs; var key = i; return function () { 
							return inputs[key];
						} }(),
						function() { var inputs = setInputs; var key = i; return function (val) {
							inputs[key] = val;
							return val;
						} }()
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

function UpdateOverridableDataDef(data_def, overridden_values)
{
	ImGui.BeginTable("DataDef_Table", 3, ImGui.ImGuiTableFlags.Borders | ImGui.ImGuiTableFlags.RowBg);

	ImGui.TableSetupColumn("Field");
	ImGui.TableSetupColumn("Control");
	ImGui.TableSetupColumn("Value");
	ImGui.TableHeadersRow();

	UpdateOverridableDataDef_Recurse(data_def, overridden_values);

	ImGui.EndTable();
}

//TODO - Move to bg lib? Everything except the UI part of this.
function CreateGeneratorInstance( generator )
{
	gGeneratorInstances.push(
		{
			open:true,
			seed:0,
			generator:generator,
			setInputs:Array(generator.inputs.fields.length).fill(null),
			output:{}
		}
	);
}

function UpdateGeneratorsList( selected_func ) 
{
	//Default behaviour - add generator to instances list
	if(selected_func == null)
	{
		selected_func = function(selected_generator)
		{
			CreateGeneratorInstance(selected_generator);
		};
	}
	UpdateProjectItemsMenuList(selected_func, "Generators", "generators");
}

var gLastScriptErrors = {};
function SetGeneratorScript(generator, script_str)
{
	gLastScriptErrors[generator.id] = null;
	bg.SetGeneratorScript(generator, script_str,
		function(err) {
			gLastScriptErrors[generator.id] = err; 
		}
	);
	return script_str;
}

function UpdateGeneratorWindow(close_func, generator)
{
	if(ImGui.Begin(`Generator Def - ${bg.GetGeneratorFullName(generator)}###${generator.id}`, close_func))
	{
		ImGui.Text("Id : " + generator.id);
		ImGui.SameLine();
		if(ImGui.SmallButton("Copy##copy_gen_id"))
		{
			ImGui.SetClipboardText(generator.id);
		}

		ImGui.InputText("Name", (_ = generator.name) => generator.name = _, 256);
		if(generator.description == undefined)
		{
			generator.description = "";
		}
		ImGui.InputText("Description", (_ = generator.description) => generator.description = _, 256);
		ImGui.SameLine(); ImGui.HelpMarker("Use / define folders in the category text");

		var category_str = generator.category.join("/");
		if(ImGui.InputText("Categories", (_ = category_str) => category_str = _, 256))
		{
			generator.category = category_str.split("/");
		}

		if(ImGui.Button("Create Temporary Test Instance"))
		{
			CreateGeneratorInstance(generator);
		}

		if(ImGui.Button("Save As JS To Clipboard"))
		{
			var js = bg.SaveGeneratorToJS(generator);
			ImGui.SetClipboardText(js);
		}

		if(ImGui.CollapsingHeader("Inputs"))
		{
			ImGui.Indent();
			ImGui.PushID("inputs");
			//Generator inputs are an inplace data def, so can be edited the same way as a data def window does.
			UpdateDataDefFields(generator.inputs.fields);
			ImGui.PopID();
			ImGui.Unindent();
		}
		if(ImGui.CollapsingHeader("Outputs"))
		{
			ImGui.Indent();
			ImGui.PushID("outputs");
			UpdateDataDefFields(generator.outputs.fields);
			ImGui.PopID();
			ImGui.Unindent();
		}

		if(ImGui.CollapsingHeader("Script"))
		{
			//TODO - Work on this
			if(ImGui.Button("Edit Script"))
			{
				if(generator.script_str == null)
				{
					generator.script_str = generator.script.toString();
				}
	
				SetCodeToEdit((_ =generator.script_str) => SetGeneratorScript(generator, _), generator.name);
			}
			ImGui.SameLine();
			if(ImGui.Button("Reopen Code Editor Window"))
			{
				ReopenCodeEditor();
			}
			
			ImGui.SetNextItemWidth(-1);
			if(generator.script_str == null)
			{
				generator.script_str = generator.script.toString();
			}
			
			ImGui.PushStyleColor(ImGui.Col.FrameBg, new ImGui.Vec4(0, 0, 0, 0.5));
			ImGui.PushStyleColor(ImGui.Col.Text, new ImGui.Vec4(0.85, 0.85, 0.85, 1));
			ImGui.InputTextMultiline("##Script", (_ = generator.script_str) => SetGeneratorScript(generator, _), 1024 * 32);
			ImGui.PopStyleColor(2);

			ImGui.Text("Script Compile:");
			if(gLastScriptErrors[generator.id] != null)
			{
				ImGui.SetNextItemWidth(-1);
				ImGui.InputTextMultiline("##ScriptError", (_ = gLastScriptErrors[generator.id]) => _, 1024 * 1);
			}
			else
			{
				ImGui.Text("No Script Errors Found");
			}
			
		}
	}
	ImGui.End();
}

function UpdateGeneratorInstanceWindow(close_func, generatorInstance)
{
	if(ImGui.Begin(`Generator Instance - ${bg.GetGeneratorFullName(generatorInstance.generator)}`, close_func))
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

		if(ImGui.Button("Open Generator Def Window"))
		{
			OpenWindow(generatorInstance.generator.id, UpdateGeneratorWindow, generatorInstance.generator);			
		}
		//TODO: Delete when sure V2 is ok
		//if(ImGui.TreeNodeEx("Inputs", ImGui.TreeNodeFlags.DefaultOpen))
		//{	
		//	UpdateGeneratorInputsImGui(generatorInstance.generator.inputs, generatorInstance.setInputs);
		//	ImGui.TreePop();
		//}

		if(ImGui.CollapsingHeader("Inputs"))
		{
			UpdateOverridableDataDef(generatorInstance.generator.inputs, generatorInstance.setInputs);
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
			if(generatorInstance.output && generatorInstance.output.outputs)
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

function UpdateGeneratorInstances()
{
	for(var i=0; i<gGeneratorInstances.length; ++i)
	{
		var generatorInstance = gGeneratorInstances[i];
		var close_func = (_ = generatorInstance.open) => generatorInstance.open = _;
		UpdateGeneratorInstanceWindow(close_func, generatorInstance);
	}

	//Remove all closed windows
	gGeneratorInstances = gGeneratorInstances.filter(item => item.open);
}

function CreateExplorerGeneratorNode(generator)
{
	return {
		id:generator.id,
		generator:generator,
		GetNodeName:function() { return generator.name; },
		GetNodeIcon:function() { return "f"; },
		GetNodeChildren:function()
		{ 
			var children = [];
			return children; 
		},
		UpdateNodeValue:function()
		{
			if(ImGui.Button("Open..."))
			{
				OpenWindow(generator.id, UpdateGeneratorWindow, generator);
			}
		}
	};
}

function CreateExplorerGeneratorCategoryNode(project, cat_name, category)
{
	return {
		project:project,
		id:cat_name,
		category:category,
		GetNodeName:function() { return cat_name; },
		GetNodeIcon:function() { return "n"; },
		GetNodeChildren:function()
		{ 
			var children = [];
			for([key, data] of Object.entries(category.children))
			{
				children.push( CreateExplorerGeneratorCategoryNode(project, key, data));
			}
		
			for(gen of category.objects)
			{
				children.push( CreateExplorerGeneratorNode(gen) );
			}
			return children; 
		}
	};
}

function CreateExplorerGeneratorsNode(project)
{
	return {
		project:project,
		id:"generators_" + project.id,
		GetNodeName:function() { return "Generators"; },
		GetNodeIcon:function() { return "w"; },
		GetNodeChildren:function()
		{
			var children = [];

			//Might be slow as shit
			var categories = BuildGraphOfCategories(project.generators);

			for([key, data] of Object.entries(categories.children))
			{
				children.push( CreateExplorerGeneratorCategoryNode(project, key, data));
			}

			for(gen of categories.objects)
			{
				children.push( CreateExplorerGeneratorNode(gen) );
			}

			return children;
		},
		UpdateContextMenu:function()
		{
			if(ImGui.CreateButton("Create New Generator..."))
			{
				//This is double registering if you do it with the global project
				var gen = bg.CreateEmptyProjectGenerator(project);
				OpenWindow(gen.id, UpdateGeneratorWindow, gen);
                ImGui.CloseCurrentPopup();
			}
		},
		UpdateNodeValue:function()
		{
			if(ImGui.CreateButton("Create..."))
			{
				//This is double registering if you do it with the global project
				var gen = bg.CreateEmptyProjectGenerator(project);
				OpenWindow(gen.id, UpdateGeneratorWindow, gen);
                ImGui.CloseCurrentPopup();
			}
		}
	};
}