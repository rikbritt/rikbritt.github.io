
var gShowNodeTestWindow = false;
function UpdateNodeTestWindow()
{
	if(gShowNodeTestWindow)
	{
        if(ImGui.Begin("Node Test",  (_ = gShowNodeTestWindow) => gShowNodeTestWindow = _))
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
}

var gShowZipTestWindow=false;
function UpdateZipTestWindow()
{
	if(gShowZipTestWindow)
	{
        if(ImGui.Begin("Zip Test",  (_ = gShowZipTestWindow) => gShowZipTestWindow = _))
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
}

function UpdateTestWindows()
{
	UpdateNodeTestWindow();
    UpdateZipTestWindow();
}

function UpdateTestsMenu()
{
	if(ImGui.MenuItem("Nodes Test"))
	{
		gShowNodeTestWindow = true;
	}

	if(ImGui.MenuItem("Zip Test"))
	{
		gShowZipTestWindow = true;
	}
}