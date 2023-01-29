
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

function UpdateDataDefField(field_name, field_data)
{
	ImGui.SetNextItemWidth(-1);
    ImGui.InputText("##Name", (_ = field_name) => field_name, 128);
    ImGui.TableNextColumn();
    ImGui.Text(field_data.type);
	
	var selected = 0;
	function GetFieldTypeName(data, i, out_str)
	{
		out_str[0] = data[Object.keys(data)[i]].dataTypeId;
		return true;
	}
	if(ImGui.Combo("Field Type (TODO)", (_ = selected) => selected = _, GetFieldTypeName, bg.dataTypes, Object.keys(bg.dataTypes).length))
	{
		var default_vals_for_type = bg.CreateFieldTypeDefInstance(bg.dataTypes[Object.keys(bg.dataTypes)[selected]].dataTypeId);

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
}

function UpdateDataDefFields(fields)
{
	ImGui.BeginTable("DataDefFields", 3, ImGui.ImGuiTableFlags.Borders | ImGui.ImGuiTableFlags.RowBg);

	ImGui.TableSetupColumn("Field");
	ImGui.TableSetupColumn("Type");
	ImGui.TableSetupColumn("-");
	ImGui.TableHeadersRow();

	for([key, data] of Object.entries(fields))
	{
		ImGui.PushID(key);
        ImGui.TableNextRow();
        ImGui.TableSetColumnIndex(0);
        UpdateDataDefField(key, data);
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