var mm_causeOfDeath = {
	objectsUsed:[]
}




var mm_causeOfDeathGenerator = {
	version:1,
	name:"Cause Of Death",
	category:["Murder Mystery"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			{ name:"data",		type:"text"	}
		],
	},
	script:function(inputs, outputs){
		
		var causes = [
			"shot",
			"poisoned",
			"blunt force trauma",
			"suffocation",
			"drowning",
			"frozen",
			"burned",
			"stabbing",
			"decapitation",
			"overdose",
			"heart attack",
			"impalation",
			"torture"
		];
		//outputs.data = "Impaling On Unicorn Spike";
		outputs.data = bg.GetRandomArrayEntry(inputs.seed, causes);
		
	}
}
bg.RegisterProjectGenerator(bg.global_project, mm_causeOfDeathGenerator);