var mm_relationshipDataDef = {
	version:1,
	name:"Relationship",
	fields:{
		type:{			type:"text" },
		friendship:{	type:"norm",	min:0,	max:1 },
		respect:{		type:"norm",	min:0,	max:1 },
		attraction:{	type:"norm",	min:0,	max:1 }
	}
}

//High level, like 'work', 'family', 'friend'
var mm_relationshipTypeDataDef = {
	version:1,
	name:"RelationshipType",
	fields:{
		types:{			type:"list", 	min:1,	max:3,	elementType:{ type:"text" } }
	}
}

var mm_relationshipLinkDataDef = {
	version:1,
	name:"Relationship Link",
	fields:{
		aToBRelationship:{			type:"data",	dataType:mm_relationshipDataDef },
		bToARelationship:{			type:"data",	dataType:mm_relationshipDataDef },
		aName:{		type:"text" },
		bName:{		type:"text" },
	}
}