
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
	var can_link_func = function(connection_data)
	{
		return true;
	}

	if(ImGui.Begin("Node Test", close_func))
	{
		NodeImGui.BeginCanvas("test_canvas",  new ImGui.Vec2(-1,-1), testGraphLayout );

		NodeImGui.BeginNode(
			"0",
			"Bobs Node"
		);
		NodeImGui.InputPin("bob_in_1", "Input", "data", can_link_func);
		NodeImGui.OutputPin("bob_out_1", "Output", "data", can_link_func);
		NodeImGui.AddInfoText("Hello there");
		NodeImGui.EndNode();

		
		NodeImGui.BeginNode(
			"1",
			"Franks Node"
		);
		NodeImGui.InputPin("frank_in_1", "Input", "data", can_link_func);
		NodeImGui.OutputPin("frank_out_1", "Output", "data", can_link_func);

		// Do all linking after nodes are all defined
		if(NodeImGui.LinkNodes(
			"0",
			"bob_out_1",
			"1",
			"frank_in_1"
		) == false)
		{
			alert("Break Link");
		}
		NodeImGui.EndNode();

		NodeImGui.EndCanvas();
	}
	ImGui.End();
}

var testGenGraphLayout = [];
var testGenGraph = null;
function SetupGenGraphTestWindow()
{
	testGenGraph = bg.CreateEmptyProjectGraph(bg.global_project);
	bg.AddGraphLayout(testGenGraph);
	
	var generator = AssetDb.GetAsset(gAssetDb, "5789e50e-b882-4cf6-8b1d-958784541060", "generator");
	var nodeA = bg.CreateGenerationGraph_GeneratorNode(testGenGraph, generator);
	var nodeB = bg.CreateGenerationGraph_GeneratorNode(testGenGraph, generator);
	bg.CreateGenerationGraphLink(testGenGraph, nodeA, "4f97075a-51a2-45c9-9825-b8279cb09842", nodeB, "add1d102-a471-4fab-ab9d-8d2a7eb99bb2");
	bg.SetNodeLayoutPos(testGenGraph.layout, nodeB.id, 450, 50);

	var outputNode = bg.GetGraphNodesByType(testGenGraph, "output")[0];
	bg.SetNodeLayoutPos(testGenGraph.layout, outputNode.id, 900, 50);

	//data def
	var test_def_node = bg.CreateGenerationGraph_DataDefNode(testGenGraph, "abc3b2ee-8934-4816-ab92-a546a7c36cbf");
	bg.SetNodeLayoutPos(testGenGraph.layout, test_def_node.id, 500, 300);

	//val nodes for the data def
	var bool_node_a = bg.CreateGenerationGraph_ValueNode(testGenGraph, "bool");
	bg.SetNodeLayoutPos(testGenGraph.layout, bool_node_a.id, 50, 300);
	var bool_node_b = bg.CreateGenerationGraph_ValueNode(testGenGraph, "bool");
	bg.SetNodeLayoutPos(testGenGraph.layout, bool_node_b.id, 50, 400);

	// Note for now output nodes input pin is the same id as the node
	bg.CreateGenerationGraphLink(testGenGraph, nodeB, "4f97075a-51a2-45c9-9825-b8279cb09842", outputNode, outputNode.id);
}

function UpdateGenGraphTestWindow(close_func)
{
	if(ImGui.Begin("Gen Graph Test", close_func))
	{
		UpdateGenGraphEditor(testGenGraph);
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

	if(ImGui.MenuItem("Show Gen Graph Test Window"))
	{
		SetupGenGraphTestWindow();
		OpenWindow("Tests_GenGraph", UpdateGenGraphTestWindow);
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
