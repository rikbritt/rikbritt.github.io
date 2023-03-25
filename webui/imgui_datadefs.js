
function UpdateDataDefsListInternal( defs_list, selected_func )
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

function UpdateDataDefsList()
{
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
		UpdateDataDefsListInternal(
			bg.dataDefs,
            function(data_def)
            {
                OpenWindow(data_def.id, UpdateDataDefWindow, data_def);
            }
			//selected_func
		);
		ImGui.EndMenu();
	}
	// if(gCurrentProject && ImGui.BeginMenu("Project Param Types"))
	// {
	// 	UpdateDataDefsListInternal(
	// 		gCurrentProject.generators,
	// 		selected_func
	// 	);
	// 	ImGui.EndMenu();
	// }
}

function UpdateDataDefsTreeForProject(project, selected_func)
{
	//TODO: Add categories to the data defs and display those in the tree
	var sorted_def_ids = GetSortedObjectKeys(project.dataDefs);
	var leaf_node_flags = ImGui.TreeNodeFlags.Leaf | ImGui.TreeNodeFlags.NoTreePushOnOpen | ImGui.TreeNodeFlags.SpanAvailWidth;
	for(var i=0; i<sorted_def_ids.length; ++i)
	{
		var data_def_id = sorted_def_ids[i];
		ImGui.TreeNodeEx(i, leaf_node_flags, project.dataDefs[data_def_id].name);
		if(ImGui.IsItemClicked())
		{
			selected_func(project.dataDefs[data_def_id]);
		}
	}
}

function BuildDataDefsByCategory(data_defs)
{
	var cat_root = 
	{
		children:{},
		data_defs:[]
	};

	for ([key, data_def] of Object.entries(data_defs))
	{
		var cat = cat_root;
		var def_categories = data_def.category;
		if(def_categories == null)
		{
			def_categories = [];
		}
		for(var c=0; c<def_categories.length; ++c)
		{
			var category = def_categories[c];
			if(cat.children[category] == null)
			{
				cat.children[category] = {
					children:{},
					data_defs:[]
				};
			}

			cat = cat.children[category];
		}
		
		cat.data_defs.push(data_def);
	}

	return cat_root;
}

function UpdateDataDefsTable_AddCatRow(cat, cat_name, is_root)
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
			UpdateDataDefsTable_AddCatRow(data, key, false);
		}
		for(data_def of cat.data_defs)
		{
			ImGui.TableNextRow();
			ImGui.TableSetColumnIndex(0);
			if(ImGui.Button(data_def.name))
			{
				//OpenWindow(data_def.id, UpdateGeneratorWindow, data_def);
			}
			ImGui.TableSetColumnIndex(1);
			if(data_def.description != null)
			{
				ImGui.TextUnformatted(data_def.description);
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

function UpdateDataDefaTable(id, data_defs)
{
	//Mighg be slow as shit
	var categories = BuildDataDefsByCategory(data_defs);

	var flags = ImGui.TableFlags.Borders | ImGui.TableFlags.RowBg;
	if (ImGui.BeginTable(id, 2, flags))
	{
		ImGui.TableSetupColumn("Name");
		ImGui.TableSetupColumn("Description");
		ImGui.TableHeadersRow();

		UpdateDataDefsTable_AddCatRow(categories, "DataDefs", true);
		
		ImGui.EndTable();
	}
}

function GetFieldTypeName(data, i, out_str)
{
	out_str[0] = data[Object.keys(data)[i]].fieldTypeId;
	return true;
}

function UpdateDataDefField(fields, field_data)
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
		delete fields[field_data.name];
	}
}


var g_new_field_type = 0;
function UpdateDataDefFields(fields)
{
	ImGui.BeginTable("DataDefFields", 3, ImGui.ImGuiTableFlags.Borders | ImGui.ImGuiTableFlags.RowBg | ImGui.ImGuiTableFlags.Resizable);

	ImGui.TableSetupColumn("Field");
	ImGui.TableSetupColumn("Type");
	ImGui.TableSetupColumn("-");
	ImGui.TableHeadersRow();

	for(var i=0; i<fields.length; ++i)
	{
		var field = fields[i];
		ImGui.PushID(i);
        ImGui.TableNextRow();
        ImGui.TableSetColumnIndex(0);
        UpdateDataDefField(fields, field);
		ImGui.PopID();
    }

	ImGui.EndTable();

	var field_types_list = Object.keys(bg.fieldTypes);
	ImGui.Combo("##Field Type To Make", (_ = g_new_field_type) => g_new_field_type = _, GetFieldTypeName, bg.fieldTypes, field_types_list.length);
	
    if(ImGui.Button("Add Field (TODO)"))
    {

    }
}

function UpdateDataDefWindow(close_func, data_def)
{
	if(ImGui.Begin(`Data Def - ${data_def.name}###${data_def.id}`, close_func))
	{
		ImGui.Text("Id : " + data_def.id);
		ImGui.InputText("Name", (_ = data_def.name) => data_def.name = _, 256);
        UpdateDataDefFields(data_def.fields);
    }
	ImGui.End();
}