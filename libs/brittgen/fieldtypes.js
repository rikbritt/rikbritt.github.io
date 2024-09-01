
//Field Types are registered here.
//Allows the system to be extended with new types in one place.

//A Field Type is a data type like float, int, weight, distance, time, etc.
//A Field Def is a definition of a field type, and holds name, min/max info etc.
//A Field value is a value for a field def.


bg.fieldTypes = {};
bg.CreateFieldType = function(
	field_type_id, 				//Unique id for this field type
	generate_value_func, 		// Given a field def and a seed, make a value
	default_instance_data_func,	// Make a default value, for an optional field def
	default_def_data,
	to_string_func = null
)
{
	if(bg.fieldTypes[field_type_id] != null)
	{
		//Field already exists
		bg.LogError(`Field Type with Id ${field_type_id} is already registered`);
		return;
	}
	if(to_string_func == null)
	{
		to_string_func = function(v)
		{
			return `${v}`;
		};
	}
	var field_type = 
	{
		fieldTypeId:field_type_id,
		generateValueFunc:generate_value_func,
		defaultInstanceDataFunc:default_instance_data_func,
		defaultDefData:default_def_data,
		toString:to_string_func
	};
	
	bg.fieldTypes[field_type_id] = field_type;
	
	return field_type;
}

// Make a default value - Ignoring seeds and min/max
bg.CreateDefaultFieldValue = function(field_type_id)
{
	var field_type = bg.fieldTypes[field_type_id];
	if(field_type == null)
	{
		//error
		return null;
	}
	return field_type.defaultInstanceDataFunc(field_type.defaultDefData);
}

bg.CreateDefaultFieldDef = function(field_type_id)
{
	var field_type = bg.fieldTypes[field_type_id];
	if(field_type == null)
	{
		//error
		return null;
	}
	return Object.assign({}, field_type.defaultDefData);
}

bg.FieldValueToString = function(field_type_id, val)
{
	var field_type = bg.fieldTypes[field_type_id];
	if(field_type == null)
	{
		//error
		return "";
	}
	return field_type.toString(val);
}

bg.GenerateFieldValue = function(field_def, seed)
{
	var field_type = bg.fieldTypes[field_def.type];
	if(field_type != null)
	{
		return field_type.generateValueFunc(field_def, seed);
	}
	
	return "UNKNOWN FIELD TYPE '" + field_def.type + "'";
}

bg.CreateFieldType(
	"bool",
	function(field_def, seed) {
		return bg.GetRandomBool(seed);
	},
	function(field_def) {
		return false;
	},
	{},
	function(v)
	{
		return v ? "true" : "false";
	}
);

bg.GenerateFloatBasedDataValue = function(field_def, seed) 
{
	return bg.GetRandomBellFloatFromSeed(seed, field_def.min, field_def.max);
};

bg.GenerateFloatBasedDefaultInstance = function(field_def)
{
	if(field_def)
	{
		return field_def.min;
	}
	return 0;
}

bg.CreateFieldType(
	"float",
	bg.GenerateFloatBasedDataValue,
	bg.GenerateFloatBasedDefaultInstance,
	{
		min:0,
		max:100
	},
	null // default to string func
);

bg.CreateFieldType(
	"norm", //normalised
	function(field_def, seed) {
		return bg.GetRandomBellFloatFromSeed(seed, 0, 1);
	},
	function(field_def) {
		return 0;
	},
	{},
	null // default to string func
);

//"earths"	- How many Planet Earth's of mass.
bg.CreateFieldType(
	"mass",
	bg.GenerateFloatBasedDataValue,
	bg.GenerateFloatBasedDefaultInstance,
	{
		min:0,
		max:100
	}
);

bg.CreateFieldType(
	"weight", //NOT how heavy something is. That would be 'mass'. This is for weighting values. -1 to +1
	bg.GenerateFloatBasedDataValue,
	bg.GenerateFloatBasedDefaultInstance,
	{
		min:0,
		max:100
	},
	null // default to string func
);

//"m"		- Metres
//"km"		- Kilometers
bg.CreateFieldType(
	"distance",
	bg.GenerateFloatBasedDataValue,
	bg.GenerateFloatBasedDefaultInstance,
	{
		min:0,
		max:100,
		units:"m"
	},
	null // default to string func
);

//"years"	- Years
//"my"		- Million Years
bg.CreateFieldType(
	"time",
	bg.GenerateFloatBasedDataValue,
	bg.GenerateFloatBasedDefaultInstance,
	{
		min:0,
		max:100
	},
	null // default to string func
);

//"m/s"		- Metres Per Second
bg.CreateFieldType(
	"accel",
	bg.GenerateFloatBasedDataValue,
	bg.GenerateFloatBasedDefaultInstance,
	{
		min:0,
		max:100
	},
	null // default to string func
);

bg.GenerateIntBasedDataValue = function(field_def, seed)
{
	if(field_def != null)
	{
		return bg.GetRandomIntFromSeed(seed, field_def.min, field_def.max);
	}
	return 0;
};

bg.GenerateIntBasedDefaultInstance = function(field_def)
{
	return field_def.min;
}

bg.CreateFieldType(
	"int",
	bg.GenerateIntBasedDataValue,
	bg.GenerateIntBasedDefaultInstance,
	{
		min:0,
		max:100
	},
	null // default to string func
);

bg.CreateFieldType(
	"colour",
	function(seed, field_def) {
		return "Red"; //todo
	},
	function(field_def) {
		return "Red"; //todo
	},
	{},
	null // default to string func
);

bg.CreateFieldType(
	"list",
	function(field_def, seed) {
		if(field_def.min == undefined)
		{
			field_def.min = 0;
		}
		if(field_def.max == undefined)
		{
			field_def.max = 100;
		}
		var numItems = bg.GetRandomIntFromSeed(seed, field_def.min, field_def.max);
		var list = [];
		for(var i=0; i<numItems; ++i)
		{
			list.push( bg.GenerateFieldValue( field_def.elementType, seed+i));
		}

		return list;
	},
	function(field_def) {
		return [];
	},
	{
		elementType:"?", //todo
		min:0,
		max:10
	},
	function(v)
	{
		return "todo : list to string";
	}
)

bg.CreateFieldType(
	"text",
	function(field_def, seed) {
		return "Hello World";
	},
	function(field_def) {
		return "Hi";
	},
	{},
	null // default to string func
);

bg.CreateFieldTypeDefInstance = function(field_type_id)
{
	var copied_default = Object.assign({}, bg.fieldTypes[field_type_id].defaultData);
	copied_default.type = field_type_id;
	copied_default.name = "?";
	return copied_default;
}

bg.CreateFieldTypeInstance = function(field_type_def)
{
	var instance_data = bg.fieldTypes[field_type_def.type].defaultInstanceDataFunc(field_type_def);
	return instance_data;
}


bg.CreateFieldType(
	"data_def",
	function(field_def, seed) {
		var data_def = AssetDb.GetAsset(gAssetDb, field_def.default_def, "data_def");

		//var data_def_in = field_def.value;
		//if(data_def_in == undefined){
		//	data_def_in = field_def.dataType;
		//}

		return bg.BuildDataDefValues(data_def, seed, null, field_def.autoGenerate);
	},
	function(field_def) {
		if(field_def != null)
		{
			var data_def = AssetDb.GetAsset(gAssetDb, field_def.default_def, "data_def");
			return Array(data_def.fields.length).fill(null);
		}
		return [];
	},
	{
		dataType:{} //todo
	},
	function(v)
	{
		return "todo : data_def to string";
	}
);

bg.CreateFieldType(
	"data_table",
	function(field_def, seed) {
		var data_table = AssetDb.GetAsset(gAssetDb, field_def.default_id, "data_table");
		return data_table;
	},
	function(field_def) {
		if(field_def != null)
		{
			var data_table = AssetDb.GetAsset(gAssetDb, field_def.default_id, "data_table");
			return data_table;
		}
		return {};
	},
	{
		default_id:null
	},
	function(v)
	{
		return "todo : data_table to string";
	}
)

bg.CreateFieldType(
	"model",
	function(field_def, seed) {
		return null;
	},
	function(field_def) {
		return null;
	},
	{
	},
	function(v)
	{
		return "todo : model to string";
	}
)