
var gRenderer = null;

function UpdateMechWindow(mech)
{
	ImGui.Begin("Mech##" + mech.id)
	ImGui.PushID(mech.id);

	ImGui.Text("Mech");
	ImGui.Text(mech.id);

	if(mech.graph_layout == null)
	{
		mech.graph_layout = {};
	}

	var contentArea = ImGui.GetContentRegionAvail();
	NodeImGui.BeginCanvas("graph_" + mech.id,  new ImGui.Vec2(contentArea.x, contentArea.y), mech.graph_layout);

	if(NodeImGui.BeginNode(
		"test",
		"Test"
	))
	{
		//graph_instance._selected_node = node;
	}

	// Example drawing in node inner canvas
	NodeImGui.AddInnerCanvas(
		function(draw, pos, size) 
		{
			draw.AddLine(pos, {x:pos.x + size.x, y:pos.y + size.y}, 0xFFFFFFFF );
		}, 150
	);

	NodeImGui.EndNode();

	NodeImGui.EndCanvas();

	ImGui.PopID();
	ImGui.End();
}

function UpdateImgui(dt, timestamp)
{
	ImGui_Impl.NewFrame(timestamp);
	ImGui.NewFrame();

	const canvas = document.getElementById("output");
	gCanvasWidth = canvas.clientWidth;
	gCanvasHeight = canvas.clientHeight;
	
	ImGui.Begin("app", null, ImGui.WindowFlags.NoDecoration | ImGui.WindowFlags.NoMove | ImGui.WindowFlags.NoBringToFrontOnFocus);
	ImGui.SetWindowPos({x:0,y:0});
	ImGui.SetWindowSize(ImGui.GetMainViewport().Size);
	
    ImGui.Text("Mech App");
	if(ImGui.Button("Create Mech"))
	{
		mechJS.CreateRandomMech(gSim);
	}

	ImGui.End();

	for(var mech of gSim.mechs)
	{
		UpdateMechWindow(mech);
	}


	ImGui.EndFrame();
}

var gRenderImGui = true;


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
var gSim = null;
function OnPageLoaded() 
{
	gSim = mechJS.CreateSim();
	
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
		//var icon_glyph_ranges = ImGui.GetIO().Fonts.GetGlyphRangesChineseFull();
		//gIconFont = await AddFontFromFileTTF("../icomoon.ttf", 16.0, null, icon_glyph_ranges);
		
        //ImGui.StyleColorsClassic();
      
        const clear_color = new ImGui.ImVec4(0.45, 0.55, 0.60, 1.00);
		//gRenderer = new THREE.WebGLRenderer({canvas:canvas});
		//gRenderer.setSize( renderWidth, renderHeight );
        //gRenderer = bg.CreateRenderer(renderWidth, renderHeight, canvas);
		//gRenderScene = bg.CreateScene(renderWidth, renderHeight, canvas, function() {}, function() {});

        ImGui_Impl.Init(canvas);


		//var clock = new THREE.Clock();

		var animate = function (timestamp) 
		{
			requestAnimationFrame( animate );

			//var dt = clock.getDelta();
			UpdateImgui(0.03, timestamp);

			
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
