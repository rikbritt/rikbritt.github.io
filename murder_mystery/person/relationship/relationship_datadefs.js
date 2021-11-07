var mm_relationshipDataDef = {
	version:1,
	name:"Relationship",
	fields:{
		type:{			type:"text" },
		friendship:{	type:"norm",	min:0,	max:1 },
		respect:{		type:"norm",	min:0,	max:1 },
		attraction:{	type:"norm",	min:0,	max:1 },
		fromName:{		type:"text" },
		toName:{		type:"text" },
	}
}
