

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
		UpdateProjectsMenu();
		if(ImGui.BeginMenu("Tests"))
		{
			UpdateTestsMenu();
			ImGui.EndMenu();
		}
		if (ImGui.BeginMenu("Tools"))
		{
			UpdateToolsMenu();
			ImGui.EndMenu();
		}
		if (ImGui.BeginMenu("View Options"))
		{
			UpdateViewOptions();
			ImGui.EndMenu();
		}
		if(ImGui.BeginMenu("Notes"))
		{
			UpdateNotesMenu();
			ImGui.EndMenu();
		}
		ImGui.EndMainMenuBar();
	}
	ImGui.End();

	UpdateGeneratorInstances();
	UpdateWindows();

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

function UpdateObjectImGui(object, name, open_by_default = true, skip_hidden = true)
{
	if(skip_hidden && name.startsWith("_"))
	{
		return;
	}

	var flags = open_by_default ? ImGui.TreeNodeFlags.DefaultOpen : ImGui.TreeNodeFlags.None;
	ImGui.PushID(name);
	if(object == null)
	{
		ImGui.Text(name + " : null");
	}
	else if(Array.isArray(object))
	{
		if(ImGui.TreeNodeEx(name + "[" + object.length + "]", flags))
		{
			for(var i=0; i<object.length; ++i)
			{
				UpdateObjectImGui(object[i], name + "[" + i + "]", open_by_default, skip_hidden);
			}
			ImGui.TreePop();
		}
	}
	else if(object instanceof Map)
	{
		if(ImGui.TreeNodeEx(name, flags))
		{
			for([key, val] of object) 
			{
				UpdateObjectImGui(val, key, open_by_default, skip_hidden);
			}
			ImGui.TreePop();
		}
	}
	else if(typeof(object) == 'object')
	{
		if(ImGui.TreeNodeEx(name, flags))
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
				UpdateObjectImGui(val, key, open_by_default, skip_hidden);
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


async function LoadArrayBuffer(url)
{
    var response = await fetch(url);
    return response.arrayBuffer();
}

async function AddFontFromFileTTF(url, size_pixels, font_cfg = null, glyph_ranges = null)
{
    font_cfg = font_cfg || new ImGui.FontConfig();
    font_cfg.Name = font_cfg.Name || `${url.split(/[\\\/]/).pop()}, ${size_pixels.toFixed(0)}px`;
    return ImGui.GetIO().Fonts.AddFontFromMemoryTTF(await LoadArrayBuffer(url), size_pixels, font_cfg, glyph_ranges);
}


var gIconFont;
function OnPageLoaded() 
{
	SetupCodeEditor();
	
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
		ImGui.GetIO().Fonts.AddFontDefault();
		var icon_glyph_ranges = ImGui.GetIO().Fonts.GetGlyphRangesChineseFull();
		gIconFont = await AddFontFromFileTTF("icomoon.ttf", 16.0, null, icon_glyph_ranges);
		
        //ImGui.StyleColorsClassic();
      
        const clear_color = new ImGui.ImVec4(0.45, 0.55, 0.60, 1.00);
		gRenderer = new THREE.WebGLRenderer({canvas:canvas});
		gRenderer.setSize( renderWidth, renderHeight );
        //gRenderer = bg.CreateRenderer(renderWidth, renderHeight, canvas);
		//gRenderScene = bg.CreateScene(renderWidth, renderHeight, canvas, function() {}, function() {});

        ImGui_Impl.Init(canvas);

		OpenWindow("explorer", UpdateExplorerWindow, null);

		LoadProjectFromURL("projects/global");
		LoadProjectFromURL("projects/Tests");
		
		var clock = new THREE.Clock();

		var animate = function (timestamp) 
		{
			requestAnimationFrame( animate );

			var dt = clock.getDelta();
			UpdateImgui(dt, timestamp);

			if(bg.errors.length > 0)
			{
				OpenWindow("errors", UpdateErrorsWindow, null);
			}

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
