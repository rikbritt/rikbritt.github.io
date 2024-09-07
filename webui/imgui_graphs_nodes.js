
//   ██████  ███████ ███    ██ ███████ ██████   █████  ████████  ██████  ██████  
//  ██       ██      ████   ██ ██      ██   ██ ██   ██    ██    ██    ██ ██   ██ 
//  ██   ███ █████   ██ ██  ██ █████   ██████  ███████    ██    ██    ██ ██████  
//  ██    ██ ██      ██  ██ ██ ██      ██   ██ ██   ██    ██    ██    ██ ██   ██ 
//   ██████  ███████ ██   ████ ███████ ██   ██ ██   ██    ██     ██████  ██   ██ 
//                                                                               


GenGraphImGui.MakeDataDefPinType = function(data_def)
{
	return `data_def.${data_def.name}.${data_def.id}`;
}


GenGraphImGui.GetFieldPinType = function(field)
{
	if(field.type == "data_def")
	{
		var data_def = AssetDb.GetAsset(gAssetDb, field.id, field.type);
		return `data_def.${data_def.name}.${data_def.id}`;
	}
	else
	{
		return field.type;
	}
}

GenGraphImGui.RegisterGraphEditorNodeType(
	"generator",
	function(graph_instance, node)
	{
		return `${bg.GetGenerationGraphNodeName(node)} (${node.type})`;
	},
	function(graph_instance)
	{
		if(ImGui.BeginMenu("Add Generator..."))
		{
			UpdateGeneratorsList(
				function(selected)
				{
					var node = bg.CreateGenerationGraph_GeneratorNode(graph_instance, selected.id);
					NodeImGui.SetNodePosToPopup(node.id);
				}
			);
			ImGui.EndMenu();
		}
	},
	function(graph_instance, selected_graph_node)
	{
		var generator = AssetDb.GetAsset(gAssetDb, selected_graph_node.asset_id, selected_graph_node.type);
		ImGui.Text("Node id : " + selected_graph_node.id);
		ImGui.Text("Generator id : " + generator.id);
		ImGui.Text("Generator Name : " + generator.name);
	},
	function(graph_instance, node)
	{
		var generator = AssetDb.GetAsset(gAssetDb, node.asset_id, node.type);
		for(field of generator.inputs.fields)
		{
			GenGraphImGui.InputPin(graph_instance, field.id, field.name, GenGraphImGui.GetFieldPinType(field));
		}

		for(field of generator.outputs.fields)
		{
			GenGraphImGui.OutputPin(graph_instance, field.id, field.name, GenGraphImGui.GetFieldPinType(field));
		}
	}
);


//  ██████   █████  ████████  █████  ██████  ███████ ███████ 
//  ██   ██ ██   ██    ██    ██   ██ ██   ██ ██      ██      
//  ██   ██ ███████    ██    ███████ ██   ██ █████   █████   
//  ██   ██ ██   ██    ██    ██   ██ ██   ██ ██      ██      
//  ██████  ██   ██    ██    ██   ██ ██████  ███████ ██      
//                                                           

GenGraphImGui.RegisterGraphEditorNodeType(
	"data_def",
	function(graph_instance, node)
	{
		return `${bg.GetGenerationGraphNodeName(node)} (${node.type})`;
	},
	function(graph_instance)
	{
		if(ImGui.BeginMenu("Add Data Def..."))
		{
			UpdateDataDefsList(
				function(selected)
				{
					var node = bg.CreateGenerationGraph_DataDefNode(graph_instance, selected.id);
					NodeImGui.SetNodePosToPopup(node.id);
				}
			);
			ImGui.EndMenu();
		}
	},
	function(graph_instance, selected_graph_node)
	{
	},
	function(graph_instance, node)
	{
		NodeImGui.NodeColour(new ImGui.ImColor(0.25, 0.38, 0.55, 1.00));
		var data_def = AssetDb.GetAsset(gAssetDb, node.asset_id, node.type);

		var data_def_type = GenGraphImGui.MakeDataDefPinType(data_def);

		GenGraphImGui.InputPin(graph_instance, "", "This Data Def", data_def_type);
		for(var j=0; j<data_def.fields.length; ++j)
		{
			var field = data_def.fields[j];
			GenGraphImGui.InputPin(graph_instance, field.id, field.name, field.type);
		}
		connection = NodeImGui.OutputPin("", "", data_def_type);
		for(var j=0; j<data_def.fields.length; ++j)
		{
			var field = data_def.fields[j];
			GenGraphImGui.OutputPin(graph_instance, field.id, "", field.type);
		}
	}
);


//  ██████   █████  ████████  █████  ████████  █████  ██████  ██      ███████ 
//  ██   ██ ██   ██    ██    ██   ██    ██    ██   ██ ██   ██ ██      ██      
//  ██   ██ ███████    ██    ███████    ██    ███████ ██████  ██      █████   
//  ██   ██ ██   ██    ██    ██   ██    ██    ██   ██ ██   ██ ██      ██      
//  ██████  ██   ██    ██    ██   ██    ██    ██   ██ ██████  ███████ ███████ 
//                                                                            

GenGraphImGui.RegisterGraphEditorNodeType(
	"data_table",
	function(graph_instance, node)
	{
		return `${bg.GetGenerationGraphNodeName(node)} (${node.type})`;
	},
	function(graph_instance)
	{
		if(ImGui.BeginMenu("Add Data Table"))
		{
			UpdateDataTablesList(
				function(selected)
				{
					var node = bg.CreateGenerationGraph_DataTableNode(graph_instance, selected);
					NodeImGui.SetNodePosToPopup(node.id);
				}
			);
			ImGui.EndMenu();
		}
	},
	function(graph_instance, selected_graph_node)
	{
		var data_table = AssetDb.GetAsset(gAssetDb, selected_graph_node.asset_id, selected_graph_node.type);
		UpdateDataTableImGuiTable(data_table);
	},
	function(graph_instance, node)
	{
		NodeImGui.NodeColour(new ImGui.ImColor(0.33, 0.48, 0.24, 1.00));
		var data_table = AssetDb.GetAsset(gAssetDb, node.asset_id, node.type);
		NodeImGui.OutputPin(data_table.id, data_table.name, "data_table");
	}
);


//   ██████  ███████ ███    ██  ██████  ██████   █████  ██████  ██   ██ 
//  ██       ██      ████   ██ ██       ██   ██ ██   ██ ██   ██ ██   ██ 
//  ██   ███ █████   ██ ██  ██ ██   ███ ██████  ███████ ██████  ███████ 
//  ██    ██ ██      ██  ██ ██ ██    ██ ██   ██ ██   ██ ██      ██   ██ 
//   ██████  ███████ ██   ████  ██████  ██   ██ ██   ██ ██      ██   ██ 
//                                                                      

GenGraphImGui.RegisterGraphEditorNodeType(
	"gen_graph",
	function(graph_instance, node)
	{
		return `${bg.GetGenerationGraphNodeName(node)} (${node.type})`;
	},
	function(graph_instance)
	{
		if(ImGui.BeginMenu("Add Generator Graph"))
		{
			UpdateGeneratorGraphsList(
				function(selected)
				{
					var node = bg.CreateGenerationGraph_GenGraphNode(graph_instance, selected);
					NodeImGui.SetNodePosToPopup(node.id);
				}
			);
			ImGui.EndMenu();
		}
	},
	function(graph_instance, selected_graph_node)
	{

	},
	function(graph_instance, node)
	{
		NodeImGui.NodeColour(new ImGui.ImColor(0.33, 0.48, 0.24, 1.00));
	}
);


//   ██████  ██    ██ ████████ ██████  ██    ██ ████████ 
//  ██    ██ ██    ██    ██    ██   ██ ██    ██    ██    
//  ██    ██ ██    ██    ██    ██████  ██    ██    ██    
//  ██    ██ ██    ██    ██    ██      ██    ██    ██    
//   ██████   ██████     ██    ██       ██████     ██    
//                                                       

GenGraphImGui.RegisterGraphEditorNodeType(
	"output",
	function(graph_instance, node)
	{
		return "Output";
	},
	function(graph_instance)
	{
	},
	function(graph_instance, selected_graph_node)
	{
		ImGui.Text("Output Node");
	},
	function(graph_instance, node)
	{
		// TODO check pin id
		GenGraphImGui.InputPin(graph_instance, node.id, "Output", "any");
	}
);

//  ██    ██  █████  ██      ██    ██ ███████ 
//  ██    ██ ██   ██ ██      ██    ██ ██      
//  ██    ██ ███████ ██      ██    ██ █████   
//   ██  ██  ██   ██ ██      ██    ██ ██      
//    ████   ██   ██ ███████  ██████  ███████ 
//                                            

GenGraphImGui.RegisterGraphEditorNodeType(
	"value",
	function(graph_instance, node)
	{
		return "Value";
	},
	function(graph_instance)
	{
		if(ImGui.BeginMenu("Add Value"))
		{
			var fieldTypes = GetSortedObjectKeys(bg.fieldTypes);
			for(var fieldTypeId of fieldTypes)
			{
				if(ImGui.MenuItem(fieldTypeId))
				{
					var node = bg.CreateGenerationGraph_ValueNode(graph_instance, fieldTypeId);
					NodeImGui.SetNodePosToPopup(node.id);
				}
			}
			ImGui.EndMenu();
		}
	},
	function(graph_instance, selected_graph_node)
	{
		var field_types_list = Object.keys(bg.fieldTypes);
		var field_type_idx = field_types_list.indexOf(selected_graph_node.fieldTypeId);
		if(ImGui.Combo("##Field Type To Make", (_ = field_type_idx) => field_type_idx = _, GetFieldTypeName, bg.fieldTypes, field_types_list.length))
		{
			selected_graph_node.fieldTypeId = field_types_list[field_type_idx];
			selected_graph_node.value = bg.CreateDefaultFieldValue(selected_graph_node.fieldTypeId);
			selected_graph_node.fieldData = bg.CreateDefaultFieldDef(selected_graph_node.fieldTypeId);
		}
		
		UpdateEditorForValue(
			"Value", 
			selected_graph_node.fieldTypeId,
			selected_graph_node.fieldData,
			function() { 
				return selected_graph_node.value;
			}, 
			function(v) {
				 selected_graph_node.value = v;
				 return v;
			}
		);
	},
	function(graph_instance, node)
	{
		NodeImGui.NodeColour(new ImGui.ImColor(0.15, 0.2, 0.55, 1.00));
		NodeImGui.OutputPin(node.id, "Value", node.fieldTypeId);
		NodeImGui.AddInfoText(`Value : ${bg.FieldValueToString(node.fieldTypeId, node.value)}`);
	}
);


// 
//  ██████  ██████  ███    ███ ███    ███ ███████ ███    ██ ████████ 
// ██      ██    ██ ████  ████ ████  ████ ██      ████   ██    ██    
// ██      ██    ██ ██ ████ ██ ██ ████ ██ █████   ██ ██  ██    ██    
// ██      ██    ██ ██  ██  ██ ██  ██  ██ ██      ██  ██ ██    ██    
//  ██████  ██████  ██      ██ ██      ██ ███████ ██   ████    ██    
//																   

GenGraphImGui.RegisterGraphEditorNodeType(
	"comment",
	function(graph_instance, node)
	{
		return "Comment";
	},
	function(graph_instance)
	{
		if(ImGui.MenuItem("Add Note / Comment"))
		{
			var node = bg.CreateGenerationGraph_CommentNode(graph_instance);
			NodeImGui.SetNodePosToPopup(node.id);
		}
	},
	function(graph_instance, selected_graph_node)
	{
		ImGui.InputText("Comment", (_ = selected_graph_node.comment) => selected_graph_node.comment = _, 256);
	},
	function(graph_instance, node)
	{
		NodeImGui.NodeColour(new ImGui.ImColor(0.65, 0.58, 0.26, 1.00));
		NodeImGui.AddInfoText(node.comment);
	}
);