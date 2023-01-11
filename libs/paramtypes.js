
//Param Types are registered here.
//Allows the system to be extended with new types in one place.


bg.dataTypes = {};
bg.CreateFieldType = function(dataTypeId, generateValueFunc)
{
	var dataType = 
	{
		dataTypeId:dataTypeId,
		generateValueFunc:generateValueFunc
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
	}
);

bg.GenerateFloatBasedDataValue = function(fieldDef, seed) {
	return bg.GetRandomBellFloatFromSeed(seed, fieldDef.min, fieldDef.max);
};


bg.CreateFieldType(
	"float",
	bg.GenerateFloatBasedDataValue
);

bg.CreateFieldType(
	"norm", //normalised
	bg.GenerateFloatBasedDataValue
);

//"earths"	- How many Planet Earth's of mass.
bg.CreateFieldType(
	"mass",
	bg.GenerateFloatBasedDataValue
);

bg.CreateFieldType(
	"weight", //NOT how heavy something is. That would be 'mass'. This is for weighting values. -1 to +1
	bg.GenerateFloatBasedDataValue
);

//"m"		- Metres
//"km"		- Kilometers
bg.CreateFieldType(
	"distance",
	bg.GenerateFloatBasedDataValue
);

//"years"	- Years
//"my"		- Million Years
bg.CreateFieldType(
	"time",
	bg.GenerateFloatBasedDataValue
);

//"m/s"		- Metres Per Second
bg.CreateFieldType(
	"accel",
	bg.GenerateFloatBasedDataValue
);

bg.GenerateIntBasedDataValue = function(fieldDef, seed) {
	return bg.GetRandomIntFromSeed(seed, fieldDef.min, fieldDef.max);
};

bg.CreateFieldType(
	"int",
	bg.GenerateIntBasedDataValue
);

bg.CreateFieldType(
	"colour",
	function(seed, fieldDef) {
		return "Red";
	}
);

bg.CreateFieldType(
	"data",
	function(fieldDef, seed) {
		var dataDefIn = fieldDef.value;
		if(dataDefIn == undefined){
			dataDefIn = fieldDef.dataType.fields;
		}

		return bg.BuildDataFields(dataDefIn, seed, null, fieldDef.autoGenerate);
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
	}
)

bg.CreateFieldType(
	"text",
	function(seed, fieldDef) {
		return "Hello World";
	}
);

bg.dataDefs = {};
//Take a func to make an instance - or just a template to copy?
bg.RegisterDataDef = function(dataDef)
{
	if(dataDef.name == null)
	{
		console.error("Failed to register data def without a name");
		return false;
	}
	//todo : more checks
	bg.dataDefs[dataDef.name] = dataDef;
	return true;
}