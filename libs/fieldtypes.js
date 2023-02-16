
//Field Types are registered here.
//Allows the system to be extended with new types in one place.

//A Field Type is a data type like float, int, weight, distance, time, etc.
//A Field Def is a definition of a field type, and holds name, min/max info etc.
//A Field value is a value for a field def.


bg.fieldTypes = {};
bg.CreateFieldType = function(field_type_id, generate_value_func, default_instance_data_func, default_def_data)
{
	var field_type = 
	{
		fieldTypeId:field_type_id,
		generateValueFunc:generate_value_func,
		defaultInstanceDataFunc:default_instance_data_func,
		defaultDefData:default_def_data
	};
	
	bg.fieldTypes[field_type_id] = field_type;
	
	return field_type;
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
	{}
);

bg.GenerateFloatBasedDataValue = function(field_def, seed) 
{
	return bg.GetRandomBellFloatFromSeed(seed, field_def.min, field_def.max);
};

bg.GenerateFloatBasedDefaultInstance = function(field_def)
{
	return field_def.min;
}

bg.CreateFieldType(
	"float",
	bg.GenerateFloatBasedDataValue,
	bg.GenerateFloatBasedDefaultInstance,
	{
		min:0,
		max:100
	}
);

bg.CreateFieldType(
	"norm", //normalised
	function(field_def, seed) {
		return bg.GetRandomBellFloatFromSeed(seed, 0, 1);
	},
	function(field_def) {
		return 0;
	},
	{}
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
	}
);

//"m"		- Metres
//"km"		- Kilometers
bg.CreateFieldType(
	"distance",
	bg.GenerateFloatBasedDataValue,
	bg.GenerateFloatBasedDefaultInstance,
	{
		min:0,
		max:100
	}
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
	}
);

//"m/s"		- Metres Per Second
bg.CreateFieldType(
	"accel",
	bg.GenerateFloatBasedDataValue,
	bg.GenerateFloatBasedDefaultInstance,
	{
		min:0,
		max:100
	}
);

bg.GenerateIntBasedDataValue = function(field_def, seed) {
	return bg.GetRandomIntFromSeed(seed, field_def.min, field_def.max);
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
	}
);

bg.CreateFieldType(
	"colour",
	function(seed, field_def) {
		return "Red"; //todo
	},
	function(field_def) {
		return "Red"; //todo
	},
	{}
);

bg.CreateFieldType(
	"data",
	function(field_def, seed) {
		var dataDefIn = field_def.value;
		if(dataDefIn == undefined){
			dataDefIn = field_def.dataType.fields;
		}

		return bg.BuildDataDefValues(dataDefIn, seed, null, field_def.autoGenerate);
	},
	function(field_def) {
		return Array(field_def.dataType.fields.length).fill(null);
	},
	{
		dataType:{} //todo
	}
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
	{}
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
