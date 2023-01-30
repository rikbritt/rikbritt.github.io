
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

function UpdateDataDefField(fields, field_name, field_data)
{
	var delete_field = false;
	if(ImGui.SmallButton("X"))
	{
		delete_field = true;
	}
	ImGui.SameLine();
	ImGui.SetNextItemWidth(-1);
	var new_name = field_name;
    if(ImGui.InputText("##Name", (_ = field_name) => new_name = _, 128))
	{
		if(fields[new_name] == null)
		{
			fields[new_name] = field_data;
			delete fields[field_name];
			field_name = new_name;
		}
	}
    ImGui.TableNextColumn();
	
	var dataTypesList = Object.keys(bg.dataTypes);
	var selected = -1;
	for(var i=0; i<dataTypesList.length;++i)
	{
		if(bg.dataTypes[dataTypesList[i]].dataTypeId == field_data.type)
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
	function GetFieldTypeName(data, i, out_str)
	{
		out_str[0] = data[Object.keys(data)[i]].dataTypeId;
		return true;
	}
	ImGui.SetNextItemWidth(-1);
	if(ImGui.Combo("##Field Type", (_ = selected) => selected = _, GetFieldTypeName, bg.dataTypes, dataTypesList.length))
	{
		var default_vals_for_type = bg.CreateFieldTypeDefInstance(bg.dataTypes[dataTypesList[selected]].dataTypeId);

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
		field_imgui.edit_field_imgui(field_name, field_data);
	}
	else
	{
		ImGui.Text(`Unknown field type '${field_data.type}' for '${field_name}'`);
	}

	if(delete_field)
	{
		delete fields[field_name];
	}
}

function UpdateDataDefFields(fields)
{
	ImGui.BeginTable("DataDefFields", 3, ImGui.ImGuiTableFlags.Borders | ImGui.ImGuiTableFlags.RowBg | ImGui.ImGuiTableFlags.Resizable);

	ImGui.TableSetupColumn("Field");
	ImGui.TableSetupColumn("Type");
	ImGui.TableSetupColumn("-");
	ImGui.TableHeadersRow();

	var sorted_fields = GetSortedObjectKeys(fields);
	for(var i=0; i<sorted_fields.length; ++i)
	{
		var key = sorted_fields[i];
		var data = fields[key];
		ImGui.PushID(i);
        ImGui.TableNextRow();
        ImGui.TableSetColumnIndex(0);
        UpdateDataDefField(fields, key, data);
		ImGui.PopID();
    }

	ImGui.EndTable();
    if(ImGui.Button("Add Field (TODO"))
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