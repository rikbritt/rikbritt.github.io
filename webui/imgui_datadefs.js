


function UpdateDataDefsList(selected_func)
{
	if(selected_func == null)
	{
		selected_func = function(data_def)
		{
			OpenWindow(data_def.id, UpdateDataDefWindow, data_def);
		};
	}
	UpdateProjectItemsMenuList(selected_func, "Data Defs", "dataDefs");
}

function UpdateDataDefsTreeForProject(project, selected_func)
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

function GetFieldTypeName(data, i, out_str)
{
	out_str[0] = data[Object.keys(data)[i]].fieldTypeId;
	return true;
}

//Return true = delete this entry
function UpdateDataDefField(fields, field_data)
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
        if(UpdateDataDefField(fields, field))
		{
			fields.splice(i,1);
			--i;
		}
		ImGui.PopID();
    }

	ImGui.EndTable();

	var field_types_list = Object.keys(bg.fieldTypes);
	
    if(ImGui.Button("Add Field"))
    {
		var chosen_field = bg.fieldTypes[field_types_list[g_new_field_type]];
		var field_entry = Object.assign({}, chosen_field.defaultDefData);
		field_entry.name = "New Field";
		field_entry.type = field_types_list[g_new_field_type];
		fields.push(field_entry);
    }
	ImGui.SameLine();
	ImGui.Combo("##Field Type To Make", (_ = g_new_field_type) => g_new_field_type = _, GetFieldTypeName, bg.fieldTypes, field_types_list.length);
}

function UpdateDataDefWindow(close_func, data_def)
{
	if(ImGui.Begin(`Data Def - ${data_def.name}###${data_def.id}`, close_func))
	{
		ImGui.Text("Id : " + data_def.id);
		ImGui.InputText("Name", (_ = data_def.name) => data_def.name = _, 256);
		if(data_def.description == undefined)
		{
			data_def.description = "";
		}
		ImGui.InputText("Description", (_ = data_def.description) => data_def.description = _, 256);

		if(data_def.category == undefined)
		{
			data_def.category = [];
		}
		var category_str = data_def.category.join("/");
		if(ImGui.InputText("Categories", (_ = category_str) => category_str = _, 256))
		{
			data_def.category = category_str.split("/");
		}
        UpdateDataDefFields(data_def.fields);

		if(ImGui.Button("Save To Clipboard"))
		{
			var json = bg.SaveDataDefToJSON(data_def);
			ImGui.SetClipboardText(json);
		}
    }
	ImGui.End();
}

function CreateExplorerDataDefNode(data_def)
{
	return {
		id:data_def.id,
		data_def:data_def,
		GetNodeName:function() { return data_def.name; },
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
				OpenWindow(data_def.id, UpdateDataDefWindow, data_def);
			}
		}
	};
}

function CreateExplorerDataDefCategoryNode(project, cat_name, category)
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
				children.push( CreateExplorerDataDefCategoryNode(project, key, data));
			}
		
			for(data_def of category.objects)
			{
				children.push( CreateExplorerDataDefNode(data_def) );
			}
			return children; 
		}
	};
}

function CreateExplorerDataDefsNode(project)
{
	return {
		project:project,
		id:"datadefs_" + project.id,
		GetNodeName:function() { return "Data Defs"; },
		GetNodeIcon:function() { return "q"; },
		GetNodeChildren:function()
		{
			var children = [];

			//Might be slow as shit
			var categories = BuildGraphOfCategories(project.dataDefs);

			for([key, data] of Object.entries(categories.children))
			{
				children.push( CreateExplorerDataDefCategoryNode(project, key, data));
			}

			for(gen of categories.objects)
			{
				children.push( CreateExplorerDataDefNode(gen) );
			}

			return children;
		},
		UpdateContextMenu:function()
		{
			if(ImGui.Button("Create New Data Def..."))
			{
				var data_def = bg.CreateEmptyDataDef(project);
				OpenWindow(data_def.id, UpdateDataDefWindow, data_def);
                ImGui.CloseCurrentPopup();
			}
		}
	};
}