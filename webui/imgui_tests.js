
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
	
	var test_generator_a = "5789e50e-b882-4cf6-8b1d-958784541060";
	var test_generator_a_input = "add1d102-a471-4fab-ab9d-8d2a7eb99bb2";
	var test_generator_a_output = "4f97075a-51a2-45c9-9825-b8279cb09842";

	var test_data_def_a = "abc3b2ee-8934-4816-ab92-a546a7c36cbf";
	var test_data_def_a_field_a = "c6ab5452-b887-4b38-8a66-ee7b6bc83fcd";
	var test_data_def_a_field_b = "14015de8-17af-4ffd-8c80-606a1dda0879";
	
	var nodeA = bg.CreateGenerationGraph_GeneratorNode(testGenGraph, test_generator_a);
	bg.SetNodeLayoutPos(testGenGraph.layout, nodeA.id, 650, 300);
	var nodeB = bg.CreateGenerationGraph_GeneratorNode(testGenGraph, test_generator_a);
	bg.CreateGenerationGraphLink(testGenGraph, nodeA, test_generator_a_output, nodeB, test_generator_a_input);
	bg.SetNodeLayoutPos(testGenGraph.layout, nodeB.id, 1000, 300);

	var outputNode = bg.GetGraphNodesByType(testGenGraph, "output")[0];
	bg.SetNodeLayoutPos(testGenGraph.layout, outputNode.id, 1300, 300);

	//data def
	var test_def_node = bg.CreateGenerationGraph_DataDefNode(testGenGraph, test_data_def_a);
	bg.SetNodeLayoutPos(testGenGraph.layout, test_def_node.id, 350, 300);
	bg.CreateGenerationGraphLink(testGenGraph, test_def_node, test_def_node.id, nodeA, test_generator_a_input);

	//val nodes for the data def
	var bool_node = bg.CreateGenerationGraph_ValueNode(testGenGraph, "bool");
	bg.SetNodeLayoutPos(testGenGraph.layout, bool_node.id, 20, 300);
	bg.CreateGenerationGraphLink(testGenGraph, bool_node, bool_node.id, test_def_node, test_data_def_a_field_a);
	var float_node = bg.CreateGenerationGraph_ValueNode(testGenGraph, "float");
	bg.SetNodeLayoutPos(testGenGraph.layout, float_node.id, 20, 400);
	bg.CreateGenerationGraphLink(testGenGraph, float_node, float_node.id, test_def_node, test_data_def_a_field_b);

	var comment_node = bg.CreateGenerationGraph_CommentNode(testGenGraph);
	bg.SetNodeLayoutPos(testGenGraph.layout, comment_node.id, 50, 600);
	comment_node.comment = "Test Comment";

	// Note for now output nodes input pin is the same id as the node
	bg.CreateGenerationGraphLink(testGenGraph, nodeB, test_generator_a_output, outputNode, outputNode.id);
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

var gTests = [
	{
		name:"Copy Int Value Test",
		description:"Copy an int value through a graph",
		result:"-",
		output:null,
		type:"gen_graph",
		asset_id:"b8d42fa6-45e0-402d-ac02-6b9f8110a2f9",
		expected:6
	},
	{
		name:"Copy Float Value Test",
		description:"Copy a float value through a graph",
		result:"-",
		output:null,
		type:"gen_graph",
		asset_id:"89200431-6c57-4f47-9674-60818c10cabc",
		expected:1.23
	},
	{
		name:"Copy Through Data Def Test",
		description:"Copy an int value through a data def",
		result:"-",
		output:null,
		type:"gen_graph",
		asset_id:"dc3435f1-17a8-455f-86d6-d0898d706b52",
		expected:123
	},
	{
		name:"Read Data Def Int Test",
		description:"Copy an int value through a data def",
		result:"-",
		output:null,
		type:"gen_graph",
		asset_id:"a2c535d3-26b0-444c-b997-3fa3065bb784",
		expected:42
	}
];

function IsOutputMeetingExpectation(output, expected)
{
	if(typeof(output) != typeof(expected))
	{
		return false;
	}
	if(typeof(expected) == "number")
	{
		return Math.abs( output - expected ) < 0.0000001;
	}
	else
	{
		return output == expected;
	}
}

function RunTest(test)
{
	if(test.type == "gen_graph")
	{
		var gen_graph = AssetDb.GetAsset(gAssetDb, test.asset_id, "gen_graph");
		//todo - run it
		test.output = bg.ExecuteGeneratorGraph(gen_graph);
		if(IsOutputMeetingExpectation(test.output, test.expected))
		{
			test.result = "OK";
		}
		else
		{
			test.result = "FAIL";
		}
	}
}

function UpdateTestsWindow(close_func)
{
	if(ImGui.Begin(`Tests`, close_func))
	{
		if(ImGui.Button("Run All Tests"))
		{
			for(var i=0; i<gTests.length; ++i)
			{
				var test = gTests[i];
				RunTest(test);
			}
		}
		if(ImGui.BeginTable("tests_table", 6, ImGui.ImGuiTableFlags.Borders | ImGui.ImGuiTableFlags.RowBg | ImGui.ImGuiTableFlags.Resizable))
		{
			ImGui.TableSetupColumn("Result");
			ImGui.TableSetupColumn("Output");
			ImGui.TableSetupColumn("Control");
			ImGui.TableSetupColumn("Test");
			ImGui.TableSetupColumn("Description");
			ImGui.TableSetupColumn("Test Asset");
			ImGui.TableHeadersRow();
		
			for(var i=0; i<gTests.length; ++i)
			{
				var test = gTests[i];
				ImGui.PushID(i);
				ImGui.TableNextRow();
				ImGui.TableNextColumn();
				ImGui.Text(test.result);
				ImGui.TableNextColumn();
				if(test.output == null)
				{
					ImGui.Text("null");
				}
				else
				{
					ImGui.Text(test.output.toString());
				}
				ImGui.TableNextColumn();
				if(ImGui.SmallButton("Run"))
				{
					RunTest(test);
				}
				ImGui.TableNextColumn();
				ImGui.Text(test.name);
				ImGui.TableNextColumn();
				ImGui.Text(test.description);
				ImGui.TableNextColumn();
				ImGui.Text(AssetDb.GetAssetShortName(test.asset_id));
				if(ImGui.IsItemHovered())
				{
					ImGui.SetTooltip("Asset:" + test.asset_id);
				}
				ImGui.SameLine();
				if(ImGui.Button("Open"))
				{
					var gen_graph = AssetDb.GetAsset(gAssetDb, test.asset_id, "gen_graph");
					OpenWindow(test.asset_id, UpdateGenGraphWindow, gen_graph);
				}
				ImGui.PopID();
			}
		
			ImGui.EndTable();
		}
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
