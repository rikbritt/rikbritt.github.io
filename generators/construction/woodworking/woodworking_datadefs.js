//Information for general wood working. Standard wood sizes etc.
var woodWorkingDataDef = {
	version:1,
	name:"Wood Working",
	fields:{
		standardLumberSizes:{	type:"distance", units:"m", min:0.5, max:20	}, //would be nice to make this tend toward whole units
		plankWidth:{ 			type:"distance", units:"m", min:0.05, max:0.4 }
	}
}

bg.RegisterDataDef(woodWorkingDataDef);