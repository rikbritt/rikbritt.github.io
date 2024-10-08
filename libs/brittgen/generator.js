
bg.generators = [];
bg.generatorsById = {};
bg.GENERATOR_CURRENT_VERSION = 3;

bg.ValidateGenerator = function(generator)
{
	if(generator.version != bg.GENERATOR_CURRENT_VERSION)
	{
		console.error("Generator is wrong version");
		return false;
	}
	return true;
}

//Will add to a global list of generators, and by default add to the global project
// bg.RegisterGenerator = function(generator, add_to_global = true)
// {
// 	var id = generator.id;
// 	if(generator.version==1)
// 	{
// 		if(generator.name == null)
// 		{
// 			console.error("Failed to register generator without a name");
// 			return false;
// 		}
// 		id = bg.GUIDFromStr(generator.name);
// 	}
// 	else if(generator.version == 2)
// 	{
// 		id = bg.GUIDFromStr(generator.id);
// 	}
// 	else
// 	{
// 		if(generator.id == null)
// 		{
// 			console.error("Failed to register generator without an id");
// 			return false;
// 		}
// 	}

// 	if(bg.generatorsById[id] != null)
// 	{
// 		console.error("Already have a generator registered with id " + id);
// 		return false;
// 	}

// 	if(generator.inputs.name != "inputs")
// 	{
// 		console.error("Generator '" + generator.name + "' inputs have name '" + generator.inputs.name + "' instead of 'inputs'");
// 	}
// 	generator.inputs.id = bg.GUIDFromStr(id + "inputs");
// 	if(bg.IsValidDataDef(generator.inputs) == false)
// 	{
// 		console.error("Generator '" + generator.name + "' inputs are not a data def");
// 		return false;
// 	}

// 	if(generator.outputs.name != "outputs")
// 	{
// 		console.error("Generator '" + generator.name + "' outputs have name '" + generator.outputs.name + "' instead of 'outputs'");
// 	}
// 	generator.outputs.id = bg.GUIDFromStr(id + "outputs");
// 	if(bg.IsValidDataDef(generator.outputs) == false)
// 	{
// 		console.error("Generator '" + generator.name + "' outputs are not a data def");
// 		return false;
// 	}

// 	//Set missing input ids
// 	for(var i=0; i<generator.inputs.fields.length; ++i)
// 	{
// 		var field = generator.inputs.fields[i];
// 		if(field.id == null)
// 		{
// 			field.id = bg.GUIDFromStr(field.name);
// 		}
// 	}

// 	//Set missing output ids
// 	for(var i=0; i<generator.outputs.fields.length; ++i)
// 	{
// 		var field = generator.outputs.fields[i];
// 		if(field.id == null)
// 		{
// 			field.id = bg.GUIDFromStr(field.name);
// 		}
// 	}

// 	//Check for missing description
// 	if(generator.description == null)
// 	{
// 		generator.description = "";
// 	}

// 	//Build string rep for script function
// 	if(generator.script_str == null)
// 	{
// 		generator.script_str = generator.script.toString();
// 	}

// 	generator.id = id;
// 	bg.generators.push(generator);
// 	bg.generatorsById[id] = generator;

// 	if(add_to_global)
// 	{
// 		bg.global_project.generators.push(generator);
// 	}

// 	return true;
// }

//id should normally be null so it makes a new one
bg.CreateEmptyGenerator = function(id = null)
{
	var generator = {
		id:id
	}
	bg.UpgradeGenerator(generator);
	bg.ValidateGenerator(generator);
	return generator;
}

//Take a generator object and upgrade it to the latest version standard
bg.UpgradeGenerator = function(generator)
{
	if(generator.id == null)
	{
		generator.id = bg.CreateGUID();
	}
	
	if(generator.name == null)
	{
		generator.name = "";
	}
	if(generator.description == null)
	{
		generator.description = "";
	}
	if(generator.category == null)
	{
		generator.category = [];
	}
	if(generator.inputs == null)
	{
		generator.inputs = {
			name:"inputs",
			version:1,
			fields:[
				//system:{		type:"data_def",		default_def:galaxyDataDef	}
			],
		};
	}
	bg.UpgradeDataDef(generator.inputs);
	if(generator.outputs == null)
	{
		generator.outputs = {
			name:"outputs",
			version:1,
			fields:[
				//system:{		type:"data_def",		default_def:galaxyDataDef	}
			],
		};
	}
	bg.UpgradeDataDef(generator.outputs);
	if(generator.script == null)
	{
		generator.script = function(inputs, outputs){
			outputs.data = inputs;
		}
	}
	generator.version = bg.GENERATOR_CURRENT_VERSION;
	return generator;
}

bg.GetGeneratorFullName = function(generator)
{
	var name = generator.name;
	if(generator.category != null)
	{
		name = generator.category.join(" / ") + " / " + name;
	}
	
	return name;
}

bg.GetGeneratorById = function(id)
{
	return bg.generatorsById[id];
}

bg.GetGeneratorInputByName = function(generator, name)
{
	return bg.GetDataDefFieldByName(generator.inputs, name);
}

bg.GetGeneratorInputById = function(generator, id)
{
	return bg.GetDataDefFieldById(generator.inputs, id);
}

bg.GetGeneratorOutputByName = function(generator, name)
{
	return bg.GetDataDefFieldByName(generator.outputs, name);
}

bg.GetGeneratorOutputById = function(generator, id)
{
	return bg.GetDataDefFieldById(generator.outputs, id);
}

//TODO - Write a description for this!
bg.CreateEmptyOveriddenTables = function(data_def, overidden)
{
	for(var i=0; i<data_def.fields.length; ++i)
	{
		var fieldDef = data_def.fields[i];
		var fieldName = fieldDef.name;
		if(fieldDef.type == "data_def") //TODO - do this with field types
		{
			var field_data_def = AssetDb.GetAsset(gAssetDb, fieldDef.default_def, "data_def");
			overidden[fieldName] = this.CreateEmptyOveriddenTables(field_data_def, {} );
		}
	}
	return overidden;
}

bg.SetGeneratorScript = function(generator, script_str, on_error)
{
	try 
	{
		generator.script = Function('return ' + script_str)();
		generator.script_str = script_str;
	} 
	catch (error) 
	{
		on_error(error.toString());
	}
}


//Treat the passed in generator and it's data as const.
bg.RunGenerator = function(generator, seed, inputs)
{
	if(generator.version != bg.GENERATOR_CURRENT_VERSION)
	{
		console.error("Generator not on current version" + generator.version);
		return;
	}
	
	if(seed == undefined)
	{
		seed = 1;
	}
	
	//#TODO: Build a graph
	
	//Make values for all inputs
	var builtInputs = bg.BuildDataDefValues(generator.inputs, seed, inputs);
	
	console.log("Built '" + generator.name + "' Inputs:");
	console.log(JSON.stringify(builtInputs, null, '\t'));
	
	Math.seedrandom(seed);
	var outputs = {};
	try
	{
		generator.script(builtInputs, outputs);
	}
	catch(err)
	{
		//outputs.error = err.message;
		outputs.error = err.stack;
	}
	
	//#TODO: Check outputs - each named output must exist.
	
	console.log("Generator '" + generator.name + "' Outputs:");
	console.log(JSON.stringify(outputs, null, '\t'));
	
	return { builtInputs:builtInputs, outputs:outputs };
}

bg.SetIfNotOverriden = function(overidden, override_val, generated_val)
{
	return overidden ? override_val : generated_val;
}

bg.SaveGeneratorToJSON = function(generator)
{
	//TODO: Make this as simple as possible by making sure all the directly
	//serialisable data can just be converted directly to JSON and back
	var data = {
		id:generator.id,
		version:generator.version,
		name:generator.name,
		category:generator.category,
		inputs:generator.inputs,
		outputs:generator.outputs,
		script:generator.script_str
	}

	var data_json = JSON.stringify(data, null, 4);
	return data_json;
}

//Load a generator for the currently loading project
bg.LoadGeneratorFromObject = function(generator_data)
{
	var generator = bg.UpgradeGenerator(generator_data);
	return generator;
}

bg.SaveGeneratorToJS = function(generator)
{
	var generator_json = JSON.stringify(generator, null, 4);
	generator_json = generator_json.replaceAll("\n", "\n    ");
	var generator_script_func = generator.script.toString();
	generator_script_func = generator_script_func.replaceAll("\t", "    ");
	// -6 for ;, for space and a \n
	var gen_js = generator_json.slice(0, -6) + `,\n    script:${generator_script_func}\n }`
	return gen_js;
}

bg.LoadGeneratorFromJSON = function(json_str)
{
	var loaded_data = JSON.parse(json_str);
	var generator = bg.CreateEmptyGenerator(loaded_data.id);
	generator.name = loaded_data.name;
	generator.version = loaded_data.version;
	generator.category = loaded_data.category;
	generator.inputs = loaded_data.inputs;
	generator.outputs = loaded_data.outputs;
	generator.script_str = loaded_data.script;

	return generator;
}