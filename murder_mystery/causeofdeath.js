var mm_causeOfDeath = {
	objectsUsed:[]
}




var mm_causeOfDeathGenerator = {
	version:1,
	name:"Cause Of Death",
	category:["Murder Mystery"],
	inputs:{
	},
	outputs:{
		data:{		type:"text"	}
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
bg.RegisterGenerator(mm_causeOfDeathGenerator);