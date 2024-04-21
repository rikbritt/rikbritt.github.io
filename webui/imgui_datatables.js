
function UpdateDataTablesListInternal( defs_list, selected_func )
{
	//Default behaviour - add generator to instances list
	// if(selected_func == null)
	// {
	// 	selected_func = function(selected_generator)
	// 	{
	// 		gGeneratorInstances.push(
	// 			{
	// 				open:true,
	// 				seed:0,
	// 				generator:selected_generator,
	// 				setInputs:{},
	// 				output:{}
	// 			}
	// 		);
	// 	};
	// }
	
	//for(var i=0; i<defs_list.length; ++i)
	for([key, data] of Object.entries(defs_list))
	{
		if(ImGui.MenuItem(key))
		{
            if(selected_func)
            {
			    selected_func(data);
            }
		}
	}
}

function UpdateDataTablesList(selected_func)
{
	if(selected_func == null)
	{
		selected_func = function(data_table)
		{
			OpenWindow(data_table.id, UpdateDataTableWindow, data_table);
		};
	}
	for(var i=0; i<bg.projects.length; ++i)
	{
		var project = bg.projects[i];
		
		if(ImGui.BeginMenu("Project Data Defs (todo)"))
		{
			ImGui.EndMenu();
		}
	}

	if(ImGui.BeginMenu("Global Data Defs (to remove)"))
	{
		UpdateDataTablesListInternal(
			bg.dataDefs,
			selected_func
		);
		ImGui.EndMenu();
	}
	// if(gCurrentProject && ImGui.BeginMenu("Project Param Types"))
	// {
	// 	UpdateDataTablesListInternal(
	// 		gCurrentProject.generators,
	// 		selected_func
	// 	);
	// 	ImGui.EndMenu();
	// }
}

function UpdateDataTablesTreeForProject(project, selected_func)
{
	//TODO: Add categories to the data defs and display those in the tree
	var sorted_def_ids = GetSortedObjectKeys(project.dataDefs);
	var leaf_node_flags = ImGui.TreeNodeFlags.Leaf | ImGui.TreeNodeFlags.NoTreePushOnOpen | ImGui.TreeNodeFlags.SpanAvailWidth;
	for(var i=0; i<sorted_def_ids.length; ++i)
	{
		var data_table_id = sorted_def_ids[i];
		ImGui.TreeNodeEx(i, leaf_node_flags, project.dataDefs[data_table_id].name);
		if(ImGui.IsItemClicked())
		{
			selected_func(project.dataDefs[data_table_id]);
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
	if(ImGui.SmallButton("X"))
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
			var data_def = AssetDb.GetAsset(gAssetDb, data_table.data_def, "data_def");
			
			ImGui.BeginTable("DataTableFields", data_def.fields.length, ImGui.ImGuiTableFlags.Borders | ImGui.ImGuiTableFlags.RowBg | ImGui.ImGuiTableFlags.Resizable);

			for(var i=0; i<data_def.fields.length; ++i)
			{
				var field = data_def.fields[i];
				ImGui.TableSetupColumn(field.name);
			}
			ImGui.TableHeadersRow();

			// for(var i=0; i<fields.length; ++i)
			// {
			// 	var field = fields[i];
			// 	ImGui.PushID(i);
			// 	ImGui.TableNextRow();
			// 	ImGui.TableSetColumnIndex(0);
			// 	ImGui.Text(field[0]);
			// 	ImGui.TableSetColumnIndex(1);
			// 	ImGui.Text(field[1]);
			// 	ImGui.PopID();
			// }

			ImGui.EndTable();
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
				children.push( CreateExplorerDataTableCategoryNode(project, key, data));
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
				children.push( CreateExplorerDataTableCategoryNode(project, key, data));
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
		}
	};
}