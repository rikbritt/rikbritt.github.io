
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
    ImGui.InputText("Name", (_ = field_name) => field_name, 128);
    ImGui.TableNextColumn();
    ImGui.Text(field_data.type);
    ImGui.TableNextColumn();

	if(field_data.type == "float" 
	|| field_data.type == "distance"
	|| field_data.type == "time")
	{
		ImGui.SliderFloat(field_name, (_ = field_data.min) => field_data.min = _, 0, 1000);
		ImGui.SliderFloat(field_name, (_ = field_data.max) => field_data.max = _, 0, 1000);		
	}
	else if(field_data.type == "int")
	{
		ImGui.SliderInt(field_name, (_ = field_data.min) => field_data.min = _, 0, 1000);
		ImGui.SliderInt(field_name, (_ = field_data.max) => field_data.max = _, 0, 1000);
	}
	else if(field_data.type == "data")
	{
        ImGui.Text("TODO - data");
		//if(ImGui.TreeNodeEx(field_name, ImGui.TreeNodeFlags.DefaultOpen))
		//{
		//	UpdateGeneratorInputsImGui(field_data.dataType.fields, getFunc());
		//	ImGui.TreePop();
		//}
	}
	else if(field_data.type == "bool")
	{
		//ImGui.Checkbox(field_name, (_ = getFunc()) => setFunc(_));
	}
	else if(field_data.type == "text")
	{
		//ImGui.InputText(field_name, (_ = getFunc()) => setFunc(_), 256);
	}
	else if(field_data.type == "list")
	{
        ImGui.Text("TODO - list");
		// var list = getFunc();
		// if(Array.isArray(list) == false)
		// {
		// 	ImGui.Text(`${field_name} is not a JS Array!`);
		// }
		// else
		// {
		// 	if(ImGui.TreeNodeEx(`${field_name} ${list.length} / ${field_data.max}`, ImGui.TreeNodeFlags.DefaultOpen))
		// 	{
		// 		for(var i=0; i<list.length; ++i)
		// 		{
		// 			ImGui.PushID(i);
		// 			if(ImGui.Button("Del"))
		// 			{
		// 				list.splice(i, 1);
		// 				--i;
		// 			}
		// 			else
		// 			{
		// 				ImGui.SameLine();
		// 				ImGui.Text(`${i} :`);
		// 				UpdateParamEditor(
		// 					field_data.elementType,
		// 					function() { var l = list; var idx = i; return function () { 
		// 						return l[idx];
		// 					 } }(),
		// 					function() { var l = list; var idx = i; return function (val) {
		// 						l[idx] = val;
		// 						return val;
		// 					} }(),
		// 					`${i}`
		// 				);
		// 			}
		// 			ImGui.PopID();
		// 		}
		// 		if(list.length < field_data.max && ImGui.Button("Add Element"))
		// 		{
		// 			list.push(GetParamDefault(field_data.elementType));
		// 		}
		// 	}
		// }
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
        ImGui.TableNextRow();
        ImGui.TableSetColumnIndex(0);
        UpdateDataDefField(key, data);
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