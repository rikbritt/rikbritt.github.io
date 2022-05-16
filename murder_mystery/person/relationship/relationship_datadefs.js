var mm_relationshipDataDef = {
	version:1,
	name:"Relationship",
	fields:{
		tags:{			type:"list", 	elementType:{ type:"text" } },
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

var mm_relationshipGraphEdgeDataDef = {
	version:1,
	name:"RelationshipGraphEdge",
	fields:{
		a:{			type:"int", 	min:0,	max:100 },
		b:{			type:"int", 	min:0,	max:100 },
	}
}

var mm_relationshipGraphDataDef = {
	version:1,
	name:"RelationshipGraph",
	fields:{
		nodes:{			type:"list", 	min:0,	max:100,	elementType:{ type:"text" } }, //node names
		edges:{			type:"list", 	min:0,	max:100,	elementType:{ type:"data", dataType:mm_relationshipGraphEdgeDataDef } }
	}
}