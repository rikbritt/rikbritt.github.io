
bg.generators = [];
bg.generatorsById = {};

//Will add to a global list of generators, and by default add to the global project
bg.RegisterGenerator = function(generator, add_to_global = true)
{
	var id = generator.id;
	if(generator.version==1)
	{
		if(generator.name == null)
		{
			console.error("Failed to register generator without a name");
			return false;
		}
		id = bg.GUIDFromStr(generator.name);
	}
	else if(generator.version == 2)
	{
		id = bg.GUIDFromStr(generator.id);
	}
	else
	{
		if(generator.id == null)
		{
			console.error("Failed to register generator without an id");
			return false;
		}
	}

	if(bg.generatorsById[id] != null)
	{
		console.error("Already have a generator registered with id " + id);
		return false;
	}

	if(generator.inputs.name != "inputs")
	{
		console.error("Generator '" + generator.name + "' inputs have name '" + generator.inputs.name + "' instead of 'inputs'");
	}
	generator.inputs.id = bg.GUIDFromStr(id + "inputs");
	if(bg.IsValidDataDef(generator.inputs) == false)
	{
		console.error("Generator '" + generator.name + "' inputs are not a data def");
		return false;
	}

	if(generator.outputs.name != "outputs")
	{
		console.error("Generator '" + generator.name + "' outputs have name '" + generator.outputs.name + "' instead of 'outputs'");
	}
	generator.outputs.id = bg.GUIDFromStr(id + "outputs");
	if(bg.IsValidDataDef(generator.outputs) == false)
	{
		console.error("Generator '" + generator.name + "' outputs are not a data def");
		return false;
	}

	//Set missing input ids
	for(var i=0; i<generator.inputs.fields.length; ++i)
	{
		var field = generator.inputs.fields[i];
		if(field.id == null)
		{
			field.id = bg.GUIDFromStr(field.name);
		}
	}

	//Set missing output ids
	for(var i=0; i<generator.outputs.fields.length; ++i)
	{
		var field = generator.outputs.fields[i];
		if(field.id == null)
		{
			field.id = bg.GUIDFromStr(field.name);
		}
	}

	//Check for missing description
	if(generator.description == null)
	{
		generator.description = "";
	}

	//Build string rep for script function
	if(generator.script_str == null)
	{
		generator.script_str = generator.script.toString();
	}

	generator.id = id;
	bg.generators.push(generator);
	bg.generatorsById[id] = generator;

	if(add_to_global)
	{
		bg.global_project.generators.push(generator);
	}

	return true;
}

//id should normally be null so it makes a new one
bg.CreateEmptyGenerator = function(id)
{
	if(id == null)
	{
		id = bg.CreateGUID();
	}
	var generator = {
		id:id,
		name:"",
		description:"",
		version:3,
		category:[],
		inputs:{
			name:"inputs",
			version:1,
			fields:[
				//system:{		type:"data",		dataType:galaxyDataDef	}
			],
		},
		outputs:{
			name:"outputs",
			version:1,
			fields:[
				//data:{ type:"data", dataType:galaxyDataDef }
			],
		},
		script:function(inputs, outputs){
			outputs.data = inputs;
		}
	};
	bg.RegisterGenerator(generator);
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

bg.GetGeneratorOutputByName = function(generator, name)
{
	return bg.GetDataDefFieldByName(generator.outputs, name);
}

//TODO - prob needs fixing
bg.CreateWeightingDataDef = function(dataDefIn)
{
	var weightDataDefOut = {
		version:1,
		name:dataDefIn.name + " Weight",
		fields:[]
	};
	
	for(var i=0; i<dataDefIn.fields.length; ++i)
	{
		var fieldDef = dataDefIn.fields[i];
		//currently ignore everything other than a normalised value.
		if(fieldDef.type == "norm")
		{
			weightDataDefOut.fields.push(
				{
					name:fieldDef.name,
					type:"weight",
					min:-1,
					max:1
				}
			);
		}
	}
	return weightDataDefOut;
}

//TODO - Write a description for this!
bg.CreateEmptyOveriddenTables = function(data_def, overidden)
{
	for(var i=0; i<data_def.fields.length; ++i)
	{
		var fieldDef = data_def.fields[i];
		var fieldName = fieldDef.name;
		if(fieldDef.type == "data")
		{
			overidden[fieldName] = this.CreateEmptyOveriddenTables(fieldDef.dataType, {} );
		}
	}
	return overidden;
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
			if(inputs != undefined && inputs[i] != undefined)
			{
				fieldValue = inputs[i];
				if(fieldDef.type == "data")
				{
					var paramSeed = bg.SeedFromString(fieldName) + seed;
					fieldValue = bg.BuildDataDefValues(fieldDef.dataType.fields, paramSeed, fieldValue, fieldDef.autoGenerate, overidden[fieldName]);
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

//Treat the passed in generator and it's data as const.
bg.RunGenerator = function(generator, seed, inputs)
{
	if(generator.version != 1)
	{
		console.error("Unknown generator version" + generator.version);
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

bg.SaveGeneratorToJS = function(generator)
{
	var generator_json = JSON.stringify(generator, null, 4);
	generator_json = generator_json.replaceAll("\n", "\n\t\t");
	var generator_script_func = generator.script.toString();
	var gen_js = `bg.LoadGenerator(\n    ${generator_json},\n    ${generator_script_func}\n)`;
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