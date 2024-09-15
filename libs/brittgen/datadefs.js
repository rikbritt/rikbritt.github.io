
bg.dataDefs = [];

bg.UpgradeDataDef = function(data_def)
{
	if(data_def.id == null)
	{
		data_def.id = bg.GUIDFromStr(data_def.name);
	}
	if(data_def.fields == null)
	{
		data_def.fields = [];
	}
	if(data_def.category == null)
	{
		data_def.category = [];
	}
	for(var field of data_def.fields)
	{
		if(field.id == null)
		{
			field.id = bg.GUIDFromStr(field.name);
		}
	}
}

bg.ValidateDataDef = function(data_def)
{
	if(data_def.name == null)
	{
		console.error("Failed to register data def without a name");
		return false;
	}
	return true;
}

//Take a func to make an instance - or just a template to copy?
bg.RegisterProjectDataDef = function(project, data_def)
{
	bg.UpgradeDataDef(data_def);
	if(bg.ValidateDataDef(data_def))
	{
		project.dataDefs.push(data_def);
		AssetDb.AddAsset(project.assetDb, data_def.id, "data_def", data_def);
		return true;
	}
	return false;
}

bg.CreateEmptyDataDef = function(project)
{
	var data_def = {
		version:1,
		id:bg.CreateGUID(),
		name:"New Data Def",
		fields:[]
	};

	bg.RegisterProjectDataDef(project, data_def);

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

bg.GetDataDefFieldById = function(data_def, id)
{
	for(var i=0; i<data_def.fields.length; ++i)
	{
		var field = data_def.fields[i];
		if(field.id == id)
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

bg.BuildDataDefValues = function(data_def, seed, inputs, autoGenerate, overidden)
{
	if(seed == undefined)
	{
		seed = 1;
	}
	
	if(autoGenerate == undefined)
	{
		autoGenerate = true;
	}
	
	var builtData = {};
	var fieldName = ""; //Required because this func is recursive and JS is weird with scope.
	var fieldDef = "";
	builtData.seed = seed;

	//Keep track of which fields were actually overriden
	if(overidden == undefined)
	{
		overidden = this.CreateEmptyOveriddenTables(data_def, {});
		builtData._overidden = overidden;
	}
	//builtData._def = data_def;
	
	for(var i=0; i<data_def.fields.length; ++i)
	{
		var fieldDef = data_def.fields[i];
		var fieldName = fieldDef.name;
		var fieldValue = null;
		
		if(fieldDef.value != undefined)
		{
			//If a value has already been generated/set, then use it
			fieldValue = fieldDef.value;
		}
		else if(autoGenerate)
		{
			if(inputs != undefined && (inputs[i] != undefined || inputs[fieldName] != undefined))
			{
				if(Array.isArray(inputs))
				{
					fieldValue = inputs[i];
				}
				else
				{
					fieldValue = inputs[fieldName];
				}

				if(fieldDef.type == "data_data") //TODO - do this with field types
				{
					var paramSeed = bg.SeedFromString(fieldName) + seed;
					var field_data_def = AssetDb.GetAsset(gAssetDb, fieldDef.default_def, "data_def");
					fieldValue = bg.BuildDataDefValues(field_data_def.fields, paramSeed, fieldValue, fieldDef.autoGenerate, overidden[fieldName]);
				}
				else
				{
					overidden[fieldName] = true;
				}
			}
			else if(fieldDef.default != undefined)
			{
				fieldValue = fieldDef.default; //If there's a default value, use it. Otherwise this is undefined.
			}
			else if(fieldDef.script != undefined)
			{
				fieldValue = fieldDef.script(builtData);
			}

			else
			{
				//We need to generate the param value. Use the name as part of the seed
				var paramSeed = bg.SeedFromString(fieldName) + seed;
				fieldValue = bg.GenerateFieldValue(fieldDef, paramSeed);
			}
		}
		
		//#TODO: Check fieldValue is set.
		if(fieldValue != undefined)
		{
			builtData[fieldName] = fieldValue;
		}
	}
	
	return builtData;
}