
var testGraphLayout = [];
{
	var bob_layout = bg.FindOrCreateNodeLayout(testGraphLayout, "0");
	bob_layout.x = 50;
	bob_layout.y = 50;
	var frank_layout = bg.FindOrCreateNodeLayout(testGraphLayout, "1");
	frank_layout.x = 450;
	frank_layout.y = 50;
}
function UpdateNodeTestWindow(close_func)
{
	if(ImGui.Begin("Node Test", close_func))
	{
		NodeImGui.BeginCanvas("test_canvas",  new ImGui.Vec2(-1,-1), testGraphLayout );

		NodeImGui.BeginNode(
			"0",
			"Bobs Node"
		);
		NodeImGui.InputPin("Input");
		NodeImGui.OutputPin("Output");
		NodeImGui.EndNode();

		
		NodeImGui.BeginNode(
			"1",
			"Franks Node"
		);
		NodeImGui.InputPin("Input");
		NodeImGui.OutputPin("Output");

		NodeImGui.LinkToCurrentNode(
			"0",
			"Output",
			"Input"
		);
		NodeImGui.EndNode();

		NodeImGui.EndCanvas();
	}
	ImGui.End();
}

function UpdateZipTestWindow(close_func)
{
	if(ImGui.Begin("Zip Test", close_func))
	{
		if(ImGui.Button("Load"))
		{
			var new_zip = new JSZip();
			// more files !
			JSZipUtils.getBinaryContent('projects/test.zip', function(err, data) {
				if(err) {
					throw err; // or handle err
				}
			
				JSZip.loadAsync(data).then(
					function (zip) 
					{
						// ...
						console.log("hi");
					}
				);
			});
		}
	}
}

function UpdateTestsWindow(close_func)
{
	if(ImGui.Begin(`Tests`, close_func))
	{
	}
	ImGui.End();
}

function UpdateTestsMenu()
{
	if(ImGui.MenuItem("Show Tests Window"))
	{
		OpenWindow("Tests", UpdateTestsWindow);
	}

	if(ImGui.MenuItem("Show Nodes UI Test Window"))
	{
		OpenWindow("Tests_Nodes", UpdateNodeTestWindow);
	}

	if(ImGui.MenuItem("Zip Test"))
	{
		OpenWindow("Tests_Zip", UpdateZipTestWindow);
	}
}
