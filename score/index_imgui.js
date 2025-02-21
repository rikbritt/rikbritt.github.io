
var gRenderer = null;
var gScores = [

];
var gPlayers = [];
var cRecent = 2000;

function GetScore(pl)
{
	var sc =0;
	for(var s of gScores)
	{
		if(s.player==pl)
		{
			sc += s.score;
		}
	}
	return sc;
}

function GetLastScoreIndex(pl)
{
	var out=-1;
	for(var i=0; i<gScores.length; ++i)
	{
		if(gScores[i].player == pl)
		{
			out=i;
		}
	}
	return out;
}

function AddPlayer(name)
{
	var p ={
		name:name
	}
	gPlayers.push(p);
}

function GetTimeSinceScore(pl)
{
  var latest = 0;
  var i = GetLastScoreIndex(pl);
  if(i!=-1)
  {
    latest = gScores[i].time;
  }
  return Date.now() - latest;
}

function GetRecentScoreChange(pl)
{
	var timeSince = GetTimeSinceScore(pl);
	if(timeSince < cRecent)
	{
        var si = GetLastScoreIndex(pl);
		return gScores[si].score;
	}
	return 0;
}

function GetRecentScoreChangeStr(pl)
{
	var change = GetRecentScoreChange(pl);
	if(change == 0)
	{
		return "";
	}
	if(change > 0)
	{
		return "+" + change;
	}
	return "" + change;
}

AddPlayer("rik");
AddPlayer("Kieran");

function AddScore(pl, sc)
{
	var timeSince = GetTimeSinceScore(pl);
	if(timeSince < cRecent)
	{
        var si = GetLastScoreIndex(pl);
		gScores[si].score += sc;
		gScores[si].time = Date.now();
	}
	else
	{
        var entry ={
			score:sc,
			player:pl,
			time:Date.now()
		};
		gScores.push(entry);
	}
}

function AddScoreButton(pl, amt)
{
	ImGui.PushStyleVar(ImGui.StyleVar.FramePadding, {x:20,y:20});
	ImGui.PushID(pl);
	var txt = "" + amt;
	if(amt >0)
	{
		txt = "+" + txt;
	}
	ImGui.SetNextItemWidth(150);
	if(ImGui.Button(txt))
	{
		AddScore(pl, amt);
	}
	ImGui.PopID();
	ImGui.PopStyleVar();
	
}
function UpdateImgui(dt, timestamp)
{
	ImGui_Impl.NewFrame(timestamp);
	ImGui.NewFrame();

	ImGui.Begin("app", null, ImGui.WindowFlags.NoDecoration | ImGui.WindowFlags.NoMove);
	ImGui.SetWindowPos({x:0,y:0});
	ImGui.SetWindowSize(ImGui.GetMainViewport().Size);
	for(var i=0; i<gPlayers.length; ++i)
	{
		var p = gPlayers[i];
		AddScoreButton(i, 1);
		ImGui.SameLine();
	    AddScoreButton(i, 2);
		ImGui.SameLine();
    	AddScoreButton(i, 5);
		ImGui.SameLine();
	    AddScoreButton(i, 10);
		
		AddScoreButton(i, -1);
	    ImGui.SameLine();
		AddScoreButton(i, -2);
    	ImGui.SameLine();
	    AddScoreButton(i, -5);
	    ImGui.SameLine();
	    AddScoreButton(i, -10);
	
		ImGui.Text(p.name + " " +GetScore(i));
	
		ImGui.SameLine();
		ImGui.PushStyleColor(ImGui.Col.Text,ImGui.COL32(0, 255, 0, 255) )
        ImGui.Text(GetRecentScoreChangeStr(i));
		ImGui.PopStyleColor();


	    for(var s of gScores)
		{
			if(s.player==i)
			{
				ImGui.Text("" + s.score);
			}
		}
	}
	ImGui.End();

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
		ImGui.GetIO().Fonts.AddFontDefault();
		var icon_glyph_ranges = ImGui.GetIO().Fonts.GetGlyphRangesChineseFull();
		gIconFont = await AddFontFromFileTTF("../icomoon.ttf", 16.0, null, icon_glyph_ranges);
		
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
