
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

function UpdateDataDefWindow(close_func, data_def)
{
	if(ImGui.Begin(`Data Def - ${data_def.name}###${data_def.id}`, close_func))
	{
		ImGui.Text("Id : " + data_def.id);
		ImGui.InputText("Name", (_ = data_def.name) => data_def.name = _, 256);
    }
	ImGui.End();
}