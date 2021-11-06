
//ISTJ - The Duty Fulfiller
//Serious and quiet, interested in security and peaceful living.
//Extremely thorough, responsible, and dependable. 
//Well-developed powers of concentration. 
//Usually interested in supporting and promoting traditions and establishments. 
//Well-organized and hard working, they work steadily towards identified goals. 
//They can usually accomplish any task once they have set their mind to it.

var dutyFulfillerGenerator = {
	version:1,
	name:"Duty Fulfiller",
	category:"Character / Personality",
	inputs:{
		personalityCore:{		type:"data",		dataType:personalityCoreDataDef	}
	},
	outputs:{
		data:{		type:"data",		dataType:personalityDataDef	}
	},
	script:function(inputs, outputs){
		var personalityCoreWeighting = { }
		var personalityWeighting = {
			quiet:1,
			organised:1,
			serious:1,
			concentration:1,
			hardWorking:1,
			playful:-0.5
		};
		outputs.data = bg.BuildDataFields(personalityDataDef.fields, 0, {});
	}
}
bg.RegisterGenerator(dutyFulfillerGenerator);