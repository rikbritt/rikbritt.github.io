
bg.dataDefs = {};

//Take a func to make an instance - or just a template to copy?
bg.RegisterDataDef = function(data_def, project)
{
	if(data_def.name == null)
	{
		console.error("Failed to register data def without a name");
		return false;
	}
	if(data_def.id == null)
	{
		data_def.id = bg.GUIDFromStr(data_def.name);
	}
	if(project == null)
	{
		project = bg.global_project;
	}
	//todo : more checks. make global list use a data def if instead of name.
	bg.dataDefs[data_def.name] = data_def;
	project.dataDefs[data_def.id] = data_def;
	return true;
}

bg.CreateEmptyDataDef = function(project)
{
	var data_def = {
		version:1,
		id:bg.CreateGUID(),
		name:"New Data Def",
		fields:[]
	};

	if(project)
	{
		project.dataDefs[data_def.id] = data_def;
	}

	return data_def;
}

bg.IsValidDataDef = function(data_def)
{
	if(data_def.version == null)
	{
		console.error("Missing version");
		return false;
	}

	if(data_def.id == null)
	{
		console.error("Missing id");
		return false;
	}

	if(data_def.name == null)
	{
		console.error("Missing name");
		return false;
	}
	
	if(data_def.fields == null)
	{
		console.error("Missing fields");
		return false;
	}

	if(Array.isArray(data_def.fields) == false )
	{
		console.error("data def field are not an array");
		return false;
	}
	return true;
}

bg.GetDataDefFieldByName = function(data_def, name)
{
	for(var i=0; i<data_def.fields.length; ++i)
	{
		var field = data_def.fields[i];
		if(field.name == name)
		{
			return field;
		}
	}
	return null;
}

bg.SaveDataDefToJSON = function(data_def)
{
	var data_json = JSON.stringify(data_def, null, 4);
	return data_json;
}

bg.LoadDataDefFromJSON = function(json_str)
{
	var loaded_data = JSON.parse(json_str);
	return loaded_data;
}