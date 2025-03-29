
var gRenderer = null;
var gScores = [

];
var gPlayers = [];
var cRecent = 2000;
var gChosenTab = "Scores";
var cButtonHeight = 60;
var gCanvasWidth = 0;
var gCanvasHeight = 0;
var gFontScale = 1.5;

var gActiveSetter = null;
function EditText(setter)
{
	gActiveSetter = setter;
	document.getElementById("in").value = setter();
	document.getElementById("in").style.display = "block";
	document.getElementById("in").focus();
}

function OnText(c) 
{
	if(gActiveSetter)
	{
		gActiveSetter(c);
	}
	document.getElementById("in").style.display = "none";
}


function GetStorageData(name, defaultVal)
{
	var storedVal = window.localStorage.getItem(name);
	var parsed = null;
	try
	{
		  parsed = JSON.parse(storedVal);
	}
	catch(e)
	{
	  
	}
	
	if(!Array.isArray(parsed))
	{
		return defaultVal;
	}
	return parsed;
}

gScores = GetStorageData("scores", []);

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

function GetPeakScore(pl)
{
	var peak = 0;
	var sc = 0;
	for(var s of gScores)
	{
		if(s.player==pl)
		{
			sc += s.score;
			if(sc > peak)
			{
				peak = sc;
			}
		}
	}
	return peak;
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

function GetMostEntries()
{
	var entries=[];
	for(var i=0; i<gPlayers.length; ++i)
	{
		entries.push(0);
	}

	for(var i=0; i<gScores.length; ++i)
	{
		entries[gScores[i].player]++;
	}

	var biggest=0;
	for(var i=0; i<entries.length; ++i)
	{
		if(entries[i] > biggest)
		{
			biggest = entries[i];
		}
	}

	return biggest;
}

function RemovePlayer(idx)
{
	gPlayers.splice(idx, 1);

	//Fix gScores - first remove player entries
	gScores = gScores.filter( item => !(item.player == idx));

	// Then fix indices
	for(var score of gScores)
	{
		if(score.player > idx)
		{
			--score.player;
		}
	}
}

function AddPlayer(name, col, db)
{
	var p ={
		name:name,
		colour:col
	}
	db.push(p);
}

var playersDefault = [];
AddPlayer("Rik", new ImGui.Vec4(0.8, 0.0, 0.0, 1.0), playersDefault);
AddPlayer("Kieran", new ImGui.Vec4(0.0, 0.8, 0.0, 1.0), playersDefault);
AddPlayer("Elin", new ImGui.Vec4(0.0, 0.0, 0.8, 1.0), playersDefault);
AddPlayer("Cathryn", new ImGui.Vec4(0.6, 0.6, 0.0, 1.0), playersDefault);
gPlayers = GetStorageData("players", playersDefault);

function SavePlayers()
{
	window.localStorage.setItem("players", JSON.stringify(gPlayers));
}

function SaveScores()
{
	window.localStorage.setItem("scores", JSON.stringify(gScores));
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

function GetRecentScoreChangeT(pl)
{
	var timeSince = GetTimeSinceScore(pl);
	if(timeSince >= cRecent)
	{
		return 0;
	}
	return 1 - (timeSince / cRecent);
}

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

	SaveScores();
}

function TouchButton(label, width = 0, col = null)
{
	if(col != null)
	{
		ImGui.PushStyleColor(ImGui.Col.Button, col);
	}
	ImGui.PushStyleVar(ImGui.StyleVar.FramePadding, {x:10,y:cButtonHeight/3});
	var ret = ImGui.Button(label, {x:width,y:cButtonHeight});
	ImGui.PopStyleVar();
	if(col != null)
	{
		ImGui.PopStyleColor();
	}
	return ret;
}

function AddScoreButton(pl, amt, width)
{
	ImGui.PushID(pl);
	var player = gPlayers[pl];
	var txt = "" + amt;
	var col = player.colour;
	if(amt >0)
	{
		txt = "+" + txt;
		col = new ImGui.Vec4(1, 1, 1, 0.2);
	}
	else
	{
		col = new ImGui.Vec4(0, 0, 0, 0.2);
	}
	
	if(TouchButton(txt, width, col))
	{
		AddScore(pl, amt);
	}
	ImGui.PopID();
}

function UpdateScores()
{
	ImGui.Separator();
	var childWidth = gCanvasWidth - (ImGui.GetStyle().WindowPadding.x * 2);
	var scoringHeight = 180;
	var totalPlayersHeight = scoringHeight * gPlayers.length;
	var availHeight = gCanvasHeight - 90;
	
	ImGui.BeginChild("players", new ImGui.Vec2(childWidth, availHeight), false);
	if(totalPlayersHeight >= availHeight)
	{
		childWidth -= 16;
	}
	var scoreButtonWidth = (childWidth / 4) - 10;
	for(var i=0; i<gPlayers.length; ++i)
	{
		ImGui.PushID(i);
		
		var p = gPlayers[i];

		var bgColFade = 0.7;
		var bgCol = new ImGui.Vec4(p.colour.x * bgColFade, p.colour.y * bgColFade, p.colour.z * bgColFade, p.colour.w);
		ImGui.PushStyleColor(ImGui.Col.ChildBg, ImGui.ColorConvertFloat4ToU32(bgCol));
		ImGui.PushStyleColor(ImGui.Col.Border, ImGui.ColorConvertFloat4ToU32(p.colour));
		ImGui.PushStyleVar(ImGui.StyleVar.ChildBorderSize, 4);
		ImGui.BeginChild("p"+i, new ImGui.Vec2(childWidth, scoringHeight), true);
		
		AddScoreButton(i, 1, scoreButtonWidth);
		ImGui.SameLine();
		AddScoreButton(i, 2, scoreButtonWidth);
		ImGui.SameLine();
		AddScoreButton(i, 5, scoreButtonWidth);
		ImGui.SameLine();
		AddScoreButton(i, 10, scoreButtonWidth);
			
		AddScoreButton(i, -1, scoreButtonWidth);
		ImGui.SameLine();
		AddScoreButton(i, -2, scoreButtonWidth);
		ImGui.SameLine();
		AddScoreButton(i, -5, scoreButtonWidth);
		ImGui.SameLine();
		AddScoreButton(i, -10, scoreButtonWidth);
		
		ImGui.SetWindowFontScale(2);
		var playerText = p.name + " " +GetScore(i);
		var sz = ImGui.CalcTextSize(playerText);
		ImGui.Text("");
		ImGui.SameLine((childWidth/2) - (sz.x / 2));
		ImGui.Text(playerText);
			
		ImGui.SameLine();
		var recentT = GetRecentScoreChangeT(i);
		ImGui.PushStyleColor(ImGui.Col.Text,ImGui.COL32(0, 255, 0, 255 * recentT) );
		ImGui.Text(GetRecentScoreChangeStr(i));
		ImGui.PopStyleColor();
		ImGui.SetWindowFontScale(gFontScale);

		ImGui.EndChild();
		ImGui.PopStyleColor();
		ImGui.PopStyleColor();
		ImGui.PopStyleVar();
		
		ImGui.PopID();
	}	
	ImGui.EndChild();
}

function UpdateGraph()
{
	var pointSize = 2;
	var lineThick = 2;
	var graphPadding = 20;
	var w = gCanvasWidth - (graphPadding * 2);
	var h=400;
	var biggestScore = 0;
	var numEntries = gScores.length;
	var entX = w / numEntries;
	var dl = ImGui.GetWindowDrawList();
	var yStart = ImGui.GetCursorPosY() + 20;
	var yEnd = yStart + gCanvasHeight - 120;
	var yHeight = yEnd - yStart;
	var totals=[];
	var lastYPlayer = [];
	for(var i=0; i<gPlayers.length; ++i)
	{
		totals.push(0);
		lastYPlayer.push(yEnd);
		var playerPeakScore = GetPeakScore(i);
		if(playerPeakScore > biggestScore)
		{
			biggestScore = playerPeakScore;
		}
	}


	var x = graphPadding;
	var startPos = {x:x, y:yEnd};
	x += entX;

	for(var score of gScores)
	{
		var prevY = 0;
		totals[score.player] += score.score;

		var pos = {x:x, y:0};
		for(var i=0; i<gPlayers.length; ++i)
		{
			var player = gPlayers[i];
			var yNorm = totals[i] / biggestScore;
			var y = yEnd - (yNorm * yHeight);
			pos.y = y;
			dl.AddLine({x:x-entX, y:lastYPlayer[i]}, pos, ImGui.ColorConvertFloat4ToU32(player.colour), lineThick);
			dl.AddCircleFilled(pos, pointSize, ImGui.ColorConvertFloat4ToU32(player.colour));
			lastYPlayer[i] = y;
		}
		x += entX;
	}

	// Start pos
	dl.AddCircleFilled(startPos, pointSize, ImGui.ColorConvertFloat4ToU32(gPlayers[0].colour));
}

function UpdateHistory()
{
	if(ImGui.BeginChild("scorhis"))
	{
		var flags = ImGui.TableFlags.Borders | ImGui.TableFlags.RowBg;
		if (ImGui.BeginTable("sctb", 3 + gPlayers.length, flags))
		{
			ImGui.TableSetupColumn("Name");
			ImGui.TableSetupColumn("Total");
			ImGui.TableSetupColumn("Change");
			for(var i=0; i<gPlayers.length; ++i)
			{
				ImGui.TableSetupColumn(gPlayers[i].name);
			}
			ImGui.TableHeadersRow();

			var totals=[];
			for(var i=0; i<gPlayers.length; ++i)
			{
				totals.push(0);
			}

			for(var s of gScores)
			{
				if(s.score == 0)
				{
					continue;
				}
				totals[s.player] += s.score;

				ImGui.TableNextRow();
				ImGui.TableNextColumn();
				ImGui.Text(gPlayers[s.player].name);
				ImGui.TableNextColumn();
				ImGui.Text("" + totals[s.player]);
				ImGui.TableNextColumn();
				ImGui.Text("" + s.score);
				
				for(var i=0; i<gPlayers.length; ++i)
				{
					ImGui.TableNextColumn();
					ImGui.Text("" + totals[i]);
				}
			}
			ImGui.EndTable();
		}
		ImGui.EndChild();
	}

	/*
	for(var i=0; i<gPlayers.length; ++i)
	{
		var p = gPlayers[i];
			
		ImGui.SetWindowFontScale(2);
		ImGui.Text(p.name + " " +GetScore(i));
		ImGui.SetWindowFontScale(1);
		
		
		for(var s of gScores)
		{
			if(s.player==i)
			{
				ImGui.Text("" + s.score);
			}	
		}
		ImGui.Separator();
	}*/
}

function UpdateSettings()
{
	ImGui.PushStyleColor(ImGui.Col.Button, new ImGui.Vec4(0.4, 0, 0, 1));
	if(TouchButton("Reset All"))
	{
		gScores=[];
		window.localStorage.clear();
	}
	ImGui.PopStyleColor();
	ImGui.SameLine();
	if(TouchButton("Reset Scores"))
	{
		gScores=[];
		SaveScores();
	}
	ImGui.SameLine();
	if(TouchButton("Add Player"))
	{
		AddPlayer("New Player", new ImGui.Vec4(1.0, 0.0, 1.0, 1.0), gPlayers);
	}

	var flags = ImGui.TableFlags.Borders | ImGui.TableFlags.RowBg | ImGui.TableFlags.ScrollY;
	var size = {x:0, y:(ImGui.GetWindowSize().y - ImGui.GetCursorPos().y)-10 };
	if (ImGui.BeginTable("players_table", 2, flags))
	{
		ImGui.TableSetupColumn("Name");
		ImGui.TableSetupColumn("Colour");
		ImGui.TableSetupScrollFreeze(0, 1);
		ImGui.TableHeadersRow();

		for(var i=0; i<gPlayers.length; ++i)
		{
			var player = gPlayers[i];
			ImGui.PushID(i);
			ImGui.TableNextRow();
			ImGui.TableNextColumn();
			if(TouchButton(player.name + "##Name"))
			{
				var p = player;
				EditText( (_ = p.name) => p.name = _  );
				//todo - SavePlayers();
			}
			ImGui.PushStyleColor(ImGui.Col.Button, new ImGui.Vec4(0.4, 0, 0, 1));
			if(TouchButton("Remove"))
			{
				RemovePlayer(i);
				SavePlayers();
			}
			ImGui.PopStyleColor();
			
			ImGui.TableNextColumn();
			ImGui.SetNextItemWidth(150);
			var colorFlags = ImGui.ColorEditFlags.PickerHueWheel | ImGui.ColorEditFlags.NoInputs;
			if(ImGui.ColorPicker4("##col", player.colour, colorFlags))
			{
				SavePlayers();
			}
			ImGui.PopID();
		}
		ImGui.EndTable();
	}
}

function UpdateImgui(dt, timestamp)
{
	ImGui_Impl.NewFrame(timestamp);
	ImGui.NewFrame();

	const canvas = document.getElementById("output");
	gCanvasWidth = canvas.clientWidth;
	gCanvasHeight = canvas.clientHeight;
	
	ImGui.Begin("app", null, ImGui.WindowFlags.NoDecoration | ImGui.WindowFlags.NoMove);
	ImGui.SetWindowPos({x:0,y:0});
	ImGui.SetWindowSize(ImGui.GetMainViewport().Size);
	
	var tabs = [
		{ name:"Scores", func:function() { UpdateScores(); } },
		{ name:"Settings", func:function() { UpdateSettings(); } },
		{ name:"History", func:function() { UpdateHistory(); } },
		{ name:"Graph", func:function() { UpdateGraph(); } },
	];
	var tabButtonWidth = (gCanvasWidth / tabs.length) - 10;
	var firstButton = true;
	for(var tab of tabs)
	{
		if(firstButton)
		{
			firstButton = false;
		}
		else
		{
			ImGui.SameLine();
		}
		if(TouchButton(tab.name, tabButtonWidth))
		{
			gChosenTab = tab.name;
		}
	}
	ImGui.Separator();
	for(var tab of tabs)
	{
		if(gChosenTab == tab.name)
		{
			tab.func();
		}
	}


	
	// if (ImGui.BeginTabBar("##tabs", ImGui.TabBarFlags.None))
    // {
	// 	if(ImGui.BeginTabItem("Scores"))
	// 	{
	// 		UpdateScores();
	// 		ImGui.EndTabItem();
	// 	}
	// 	if(ImGui.BeginTabItem("Settings"))
	// 	{
	// 		if(ImGui.Button("Restart Game"))
	// 		{
	// 			gScores=[];
	// 			window.localStorage.clear();
	// 		}
	// 		ImGui.EndTabItem();
	// 	}
	// 	if(ImGui.BeginTabItem("History"))
	// 	{
	// 		UpdateHistory();
	// 		ImGui.EndTabItem();
	// 	}
	// 	if(ImGui.BeginTabItem("Graph"))
	// 	{
	// 		UpdateGraph();
	// 		ImGui.EndTabItem();
	// 	}
	// 	ImGui.EndTabBar();
	// }
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
