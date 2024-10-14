function UpdateDataTablesList( selected_func ) 
{
	if(selected_func == null)
	{
		selected_func = function(data_table)
		{
			OpenWindow(data_table.id, UpdateDataTableWindow, data_table);
		};
	}
	UpdateProjectItemsMenuList(selected_func, "Data Tables", "dataTables");
}

function UpdateDataTablesTreeForProject(project, selected_func)
{
	//TODO: Add categories to the data defs and display those in the tree
	var leaf_node_flags = ImGui.TreeNodeFlags.Leaf | ImGui.TreeNodeFlags.NoTreePushOnOpen | ImGui.TreeNodeFlags.SpanAvailWidth;
	for(var i=0; i<project.dataDefs.length; ++i)
	{
		ImGui.TreeNodeEx(i, leaf_node_flags, project.dataDefs[i].name);
		if(ImGui.IsItemClicked())
		{
			selected_func(project.dataDefs[i]);
		}
	}
}


function UpdateDataTablesTable_AddCatRow(cat, cat_name, is_root, selected_func)
{
	ImGui.PushID(cat_name);
	var open = true;
	if(is_root == false)
	{
		ImGui.TableNextRow();
		ImGui.TableSetColumnIndex(0);
		open = ImGui.TreeNodeEx(cat_name, ImGui.TreeNodeFlags.SpanFullWidth);
		ImGui.TableSetColumnIndex(1);
		ImGui.TextUnformatted("-");
	}
	if(open)
	{
		for([key, data] of Object.entries(cat.children))
		{
			UpdateDataTablesTable_AddCatRow(data, key, false, selected_func);
		}
		for(data_table of cat.objects)
		{
			ImGui.TableNextRow();
			ImGui.TableSetColumnIndex(0);
			if(ImGui.Button(data_table.name))
			{
				selected_func(data_table);
			}
			ImGui.TableSetColumnIndex(1);
			if(data_table.description != null)
			{
				ImGui.TextUnformatted(data_table.description);
			}
			else
			{
				ImGui.TextUnformatted("-");
			}
		}

		if(is_root == false)
		{
			ImGui.TreePop();
		}
	}
	ImGui.PopID();
}

function UpdateDataTablesTable(id, data_tables, selected_func)
{
	//Mighg be slow as shit
	var categories = BuildGraphOfCategories(data_tables);

	var flags = ImGui.TableFlags.Borders | ImGui.TableFlags.RowBg;
	if (ImGui.BeginTable(id, 2, flags))
	{
		ImGui.TableSetupColumn("Name");
		ImGui.TableSetupColumn("Description");
		ImGui.TableHeadersRow();

		UpdateDataTablesTable_AddCatRow(categories, "DataTables", true, selected_func);
		
		ImGui.EndTable();
	}
}

function GetFieldTypeName(data, i, out_str)
{
	out_str[0] = data[Object.keys(data)[i]].fieldTypeId;
	return true;
}

//Return true = delete this entry
function UpdateDataTableField(fields, field_data)
{
	var delete_field = false;
	if(ImGui.DeleteButton("X"))
	{
		delete_field = true;
	}
	ImGui.SameLine();
	ImGui.SetNextItemWidth(-1);
    if(ImGui.InputText("##Name", (_ = field_data.name) => field_data.name = _, 128))
	{
	}
    ImGui.TableNextColumn();
	
	var field_types_list = Object.keys(bg.fieldTypes);
	var selected = -1;
	for(var i=0; i<field_types_list.length;++i)
	{
		if(bg.fieldTypes[field_types_list[i]].fieldTypeId == field_data.type)
		{
			selected = i;
			break;
		}
	}
	if(selected == -1)
	{
		ImGui.Text("Unknown : " + field_data.type);
		selected = 0;
	}
	ImGui.SetNextItemWidth(-1);
	if(ImGui.Combo("##Field Type", (_ = selected) => selected = _, GetFieldTypeName, bg.fieldTypes, field_types_list.length))
	{
		var default_vals_for_type = bg.CreateFieldTypeDefInstance(bg.fieldTypes[field_types_list[selected]].fieldTypeId);
		default_vals_for_type.name = field_data.name;

		//Remove existing keys
		var curr_keys = Object.keys(field_data);
		for(var i=0; i<curr_keys.length; ++i)
		{
			delete field_data[curr_keys[i]];
		}

		//Copy new ones
		var new_keys = Object.keys(default_vals_for_type);
		for(var i=0; i<new_keys.length; ++i)
		{
			field_data[new_keys[i]] = default_vals_for_type[new_keys[i]];
		}
	}
    ImGui.TableNextColumn();

	
    var field_imgui = gFieldTypesImGui[field_data.type];
	if(field_imgui != null)
	{
		field_imgui.edit_field_imgui(field_data.name, field_data);
	}
	else
	{
		ImGui.Text(`Unknown field type '${field_data.type}' for '${field_data.name}'`);
	}

	if(delete_field)
	{
		return true;
	}
	return false;
}


// var g_new_field_type = 0;
// function UpdateDataTableFields(fields)
// {
// 	ImGui.BeginTable("DataTableFields", 3, ImGui.ImGuiTableFlags.Borders | ImGui.ImGuiTableFlags.RowBg | ImGui.ImGuiTableFlags.Resizable);

// 	ImGui.TableSetupColumn("Field");
// 	ImGui.TableSetupColumn("Type");
// 	ImGui.TableSetupColumn("-");
// 	ImGui.TableHeadersRow();

// 	for(var i=0; i<fields.length; ++i)
// 	{
// 		var field = fields[i];
// 		ImGui.PushID(i);
//         ImGui.TableNextRow();
//         ImGui.TableSetColumnIndex(0);
//         if(UpdateDataTableField(fields, field))
// 		{
// 			fields.splice(i,1);
// 			--i;
// 		}
// 		ImGui.PopID();
//     }

// 	ImGui.EndTable();

// 	var field_types_list = Object.keys(bg.fieldTypes);
// 	ImGui.Combo("##Field Type To Make", (_ = g_new_field_type) => g_new_field_type = _, GetFieldTypeName, bg.fieldTypes, field_types_list.length);
	
//     if(ImGui.Button("Add Field"))
//     {
// 		var chosen_field = bg.fieldTypes[field_types_list[g_new_field_type]];
// 		var field_entry = Object.assign({}, chosen_field.defaultDefData);
// 		field_entry.name = "New Field";
// 		field_entry.type = field_types_list[g_new_field_type];
// 		fields.push(field_entry);
//     }
// }

function UpdateDataTableImGuiTable(data_table)
{
	var data_def = AssetDb.GetAsset(gAssetDb, data_table.data_def, "data_def");
	if(data_def.fields.length > 16)
	{
		ImGui.Text("Too many fields in data def!");
	}
	else
	{
		ImGui.BeginTable("DataTableFields", data_def.fields.length, ImGui.ImGuiTableFlags.Borders | ImGui.ImGuiTableFlags.RowBg | ImGui.ImGuiTableFlags.Resizable);
	
		for(var i=0; i<data_def.fields.length; ++i)
		{
			var field = data_def.fields[i];
			ImGui.TableSetupColumn(field.name);
		}
		ImGui.TableHeadersRow();
	
		for(var i=0; i<data_table.data.length; ++i)
		{
			 var row_data = data_table.data[i];
			 ImGui.PushID(i);
			 ImGui.TableNextRow();
			
			for(var j=0; j<data_def.fields.length; ++j)
			{
				var field = data_def.fields[j];
				ImGui.TableSetColumnIndex(j);
				ImGui.Text( row_data[j] ); //will need more work
			}
			 ImGui.PopID();
		}
	
		ImGui.EndTable();
	}
}

function UpdateDataTableWindow(close_func, data_table)
{
	if(ImGui.Begin(`Data Table - ${data_table.name}###${data_table.id}`, close_func))
	{
		ImGui.Text("Id : " + data_table.id);
		ImGui.InputText("Name", (_ = data_table.name) => data_table.name = _, 256);
		if(data_table.description == undefined)
		{
			data_table.description = "";
		}
		ImGui.InputText("Description", (_ = data_table.description) => data_table.description = _, 256);

		if(data_table.category == undefined)
		{
			data_table.category = [];
		}
		var category_str = data_table.category.join("/");
		if(ImGui.InputText("Categories", (_ = category_str) => category_str = _, 256))
		{
			data_table.category = category_str.split("/");
		}

		UpdateAssetDBPicker("Table Data Def", (_ = data_table.data_def) => data_table.data_def = _, "data_def");
        //UpdateDataTableFields(data_table.fields);

		if(data_table.data_def != null)
		{
			UpdateDataTableImGuiTable(data_table);
			if(ImGui.Button("Add Row"))
			{
				data_table.data.push( Array.from(''.repeat(data_def.fields.length) ) );
			}
			if(ImGui.Button("Add Row"))
			{
				data_table.data.push( Array.from(''.repeat(data_def.fields.length) ) );
			}
		}

		if(ImGui.Button("Save To Clipboard"))
		{
			var json = bg.SaveDataTableToJSON(data_table);
			ImGui.SetClipboardText(json);
		}
    }
	ImGui.End();
}

function CreateExplorerDataTableNode(data_table)
{
	return {
		id:data_table.id,
		data_table:data_table,
		GetNodeName:function() { return data_table.name; },
		GetNodeIcon:function() { return "f"; },
		GetNodeChildren:function()
		{ 
			var children = [];
			return children; 
		},
		UpdateNodeValue:function()
		{
			if(ImGui.Button("Open..."))
			{
				OpenWindow(data_table.id, UpdateDataTableWindow, data_table);
			}
		}
	};
}

function CreateExplorerDataTablesCategoryNode(project, cat_name, category)
{
	return {
		project:project,
		id:cat_name,
		category:category,
		GetNodeName:function() { return cat_name; },
		GetNodeIcon:function() { return "n"; },
		GetNodeChildren:function()
		{ 
			var children = [];
			for([key, data] of Object.entries(category.children))
			{
				children.push( CreateExplorerDataTablesCategoryNode(project, key, data));
			}
		
			for(data_table of category.objects)
			{
				children.push( CreateExplorerDataTableNode(data_table) );
			}
			return children; 
		}
	};
}

function CreateExplorerDataTablesNode(project)
{
	return {
		project:project,
		id:"datatables_" + project.id,
		GetNodeName:function() { return "Data Tables"; },
		GetNodeIcon:function() { return "q"; },
		GetNodeChildren:function()
		{
			var children = [];

			//Might be slow as shit
			var categories = BuildGraphOfCategories(project.dataTables);

			for([key, data] of Object.entries(categories.children))
			{
				children.push( CreateExplorerDataTablesCategoryNode(project, key, data));
			}

			for(gen of categories.objects)
			{
				children.push( CreateExplorerDataTableNode(gen) );
			}

			return children;
		},
		UpdateContextMenu:function()
		{
			if(ImGui.Button("Create New Data Table..."))
			{
				var data_table = bg.CreateEmptyDataTable(project);
				OpenWindow(data_table.id, UpdateDataTableWindow, data_table);
                ImGui.CloseCurrentPopup();
			}
		},
		UpdateNodeValue:function()
		{
			if(ImGui.Button("Create..."))
			{
				var data_table = bg.CreateEmptyDataTable(project);
				OpenWindow(data_table.id, UpdateDataTableWindow, data_table);
                ImGui.CloseCurrentPopup();
			}
		}
	};
}