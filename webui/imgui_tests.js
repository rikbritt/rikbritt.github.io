
function UpdateNodeTestWindow(close_func)
{
	if(ImGui.Begin("Node Test", close_func))
	{
		NodeImGui.BeginCanvas("test_canvas",  new ImGui.Vec2(-1,-1) );

		NodeImGui.BeginNode(
			"Bob",
			"Bobs Node",
			50,
			50
		);
		NodeImGui.InputPin("Input");
		NodeImGui.OutputPin("Output");
		NodeImGui.EndNode();

		
		NodeImGui.BeginNode(
			"Frank",
			"Franks Node",
			450,
			50
		);
		NodeImGui.InputPin("Input");
		NodeImGui.OutputPin("Output");

		NodeImGui.LinkNode(
			"Bob",
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
		OpenWindow("Tests_Nodes", UpdateTestsWindow);
	}

	if(ImGui.MenuItem("Zip Test"))
	{
		OpenWindow("Tests_Zip", UpdateZipTestWindow);
	}
}
