
//Param Types are registered here.
//Allows the system to be extended with new types in one place.


bg.dataTypes = {};
bg.CreateFieldType = function(dataTypeId, generateValueFunc, defaultData)
{
	var dataType = 
	{
		dataTypeId:dataTypeId,
		generateValueFunc:generateValueFunc,
		defaultData:defaultData
	};
	
	bg.dataTypes[dataTypeId] = dataType;
	
	return dataType;
}

bg.GenerateFieldValue = function(fieldDef, seed)
{
	var dataType = bg.dataTypes[fieldDef.type];
	if(dataType != null)
	{
		return dataType.generateValueFunc(fieldDef, seed);
	}
	
	return "UNKNOWN FIELD TYPE '" + fieldDef.type + "'";
}

bg.CreateFieldType(
	"bool",
	function(fieldDef, seed) {
		return bg.GetRandomBool(seed);
	},
	{}
);

bg.GenerateFloatBasedDataValue = function(fieldDef, seed) {
	return bg.GetRandomBellFloatFromSeed(seed, fieldDef.min, fieldDef.max);
};


bg.CreateFieldType(
	"float",
	bg.GenerateFloatBasedDataValue,
	{
		min:0,
		max:100
	}
);

bg.CreateFieldType(
	"norm", //normalised
	function(fieldDef, seed) {
		return bg.GetRandomBellFloatFromSeed(seed, 0, 1);
	},
	{}
);

//"earths"	- How many Planet Earth's of mass.
bg.CreateFieldType(
	"mass",
	bg.GenerateFloatBasedDataValue,
	{
		min:0,
		max:100
	}
);

bg.CreateFieldType(
	"weight", //NOT how heavy something is. That would be 'mass'. This is for weighting values. -1 to +1
	bg.GenerateFloatBasedDataValue,
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
	{
		min:0,
		max:100
	}
);

//"m/s"		- Metres Per Second
bg.CreateFieldType(
	"accel",
	bg.GenerateFloatBasedDataValue,
	{
		min:0,
		max:100
	}
);

bg.GenerateIntBasedDataValue = function(fieldDef, seed) {
	return bg.GetRandomIntFromSeed(seed, fieldDef.min, fieldDef.max);
};

bg.CreateFieldType(
	"int",
	bg.GenerateIntBasedDataValue,
	{
		min:0,
		max:100
	}
);

bg.CreateFieldType(
	"colour",
	function(seed, fieldDef) {
		return "Red"; //todo
	},
	{}
);

bg.CreateFieldType(
	"data",
	function(fieldDef, seed) {
		var dataDefIn = fieldDef.value;
		if(dataDefIn == undefined){
			dataDefIn = fieldDef.dataType.fields;
		}

		return bg.BuildDataFields(dataDefIn, seed, null, fieldDef.autoGenerate);
	},
	{
		dataType:{} //todo
	}
);

bg.CreateFieldType(
	"list",
	function(fieldDef, seed) {
		if(fieldDef.min == undefined)
		{
			fieldDef.min = 0;
		}
		if(fieldDef.max == undefined)
		{
			fieldDef.max = 100;
		}
		var numItems = bg.GetRandomIntFromSeed(seed, fieldDef.min, fieldDef.max);
		var list = [];
		for(var i=0; i<numItems; ++i)
		{
			list.push( bg.GenerateFieldValue( fieldDef.elementType, seed+i));
		}

		return list;
	},
	{
		elementType:"?", //todo
		min:0,
		max:10
	}
)

bg.CreateFieldType(
	"text",
	function(seed, fieldDef) {
		return "Hello World";
	},
	{}
);

bg.CreateFieldTypeDefInstance = function(dataTypeId)
{
	var copied_default = Object.assign({}, bg.dataTypes[dataTypeId].defaultData);
	copied_default.type = dataTypeId;
	return copied_default;
}

bg.dataDefs = {};
//Take a func to make an instance - or just a template to copy?
bg.RegisterDataDef = function(dataDef, project)
{
	if(dataDef.name == null)
	{
		console.error("Failed to register data def without a name");
		return false;
	}
	if(dataDef.id == null)
	{
		dataDef.id = bg.GUIDFromStr(dataDef.name);
	}
	if(project == null)
	{
		project = bg.global_project;
	}
	//todo : more checks. make global list use a data def if instead of name.
	bg.dataDefs[dataDef.name] = dataDef;
	project.dataDefs[dataDef.id] = dataDef;
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