var mm_relationshipDataDef = {
	version:1,
	name:"Relationship",
	id:"64fb176f-ecb2-46d6-9633-b0eb57582c16",
	fields:[
		{ name:"tags",			type:"list", 	elementType:{ type:"text" } },
		{ name:"friendship",	type:"norm",	min:0,	max:1 },
		{ name:"respect",		type:"norm",	min:0,	max:1 },
		{ name:"attraction",	type:"norm",	min:0,	max:1 }
	]
}
bg.RegisterProjectDataDef(bg.global_project, mm_relationshipDataDef);

//High level, like 'work', 'family', 'friend'
var mm_relationshipTypeDataDef = {
	version:1,
	name:"RelationshipType",
	id:"bffb6cc3-5c82-46f3-8323-224e64acf320",
	fields:[
		{ name:"types",			type:"list", 	min:1,	max:3,	elementType:{ type:"text" } }
	]
}
bg.RegisterProjectDataDef(bg.global_project, mm_relationshipTypeDataDef);

var mm_relationshipLinkDataDef = {
	version:1,
	name:"Relationship Link",
	id:"53387eb0-b0ee-4edf-84fe-03436eb37032",
	fields:[
		{ name:"aToBRelationship",			type:"data_def",	default_def:"64fb176f-ecb2-46d6-9633-b0eb57582c16" },
		{ name:"bToARelationship",			type:"data_def",	default_def:"64fb176f-ecb2-46d6-9633-b0eb57582c16" },
		{ name:"aName",		type:"text" },
		{ name:"bName",		type:"text" },
	]
}
bg.RegisterProjectDataDef(bg.global_project, mm_relationshipLinkDataDef);

var mm_GraphEdgeDataDef = {
	version:1,
	name:"GraphEdge",
	id:"98c8c2ee-71c3-467d-b6ec-9114f85f9415",
	fields:[
		{ name:"a",			type:"int", 	min:0,	max:100 },
		{ name:"b",			type:"int", 	min:0,	max:100 },
	]
}
bg.RegisterProjectDataDef(bg.global_project, mm_GraphEdgeDataDef);

var mm_GraphDataDef = {
	version:1,
	name:"Graph",
	id:"13368b69-aa9f-479b-a200-32720bb63180",
	fields:[
		{ name:"nodes",			type:"list", 	min:0,	max:100,	elementType:{ type:"text" } }, //node names
		{ name:"edges",			type:"list", 	min:0,	max:100,	elementType:{ type:"data_def", default_def:"98c8c2ee-71c3-467d-b6ec-9114f85f9415" } }
	]
}
bg.RegisterProjectDataDef(bg.global_project, mm_GraphDataDef);
