var mm_relationshipDataDef = {
	version:1,
	name:"Relationship",
	fields:[
		{ name:"tags",			type:"list", 	elementType:{ type:"text" } },
		{ name:"friendship",	type:"norm",	min:0,	max:1 },
		{ name:"respect",		type:"norm",	min:0,	max:1 },
		{ name:"attraction",	type:"norm",	min:0,	max:1 }
	]
}

//High level, like 'work', 'family', 'friend'
var mm_relationshipTypeDataDef = {
	version:1,
	name:"RelationshipType",
	fields:[
		{ name:"types",			type:"list", 	min:1,	max:3,	elementType:{ type:"text" } }
	]
}

var mm_relationshipLinkDataDef = {
	version:1,
	name:"Relationship Link",
	fields:[
		{ name:"aToBRelationship",			type:"data",	dataType:mm_relationshipDataDef },
		{ name:"bToARelationship",			type:"data",	dataType:mm_relationshipDataDef },
		{ name:"aName",		type:"text" },
		{ name:"bName",		type:"text" },
	]
}

var mm_GraphEdgeDataDef = {
	version:1,
	name:"GraphEdge",
	fields:[
		{ name:"a",			type:"int", 	min:0,	max:100 },
		{ name:"b",			type:"int", 	min:0,	max:100 },
	]
}

var mm_GraphDataDef = {
	version:1,
	name:"Graph",
	fields:[
		{ name:"nodes",			type:"list", 	min:0,	max:100,	elementType:{ type:"text" } }, //node names
		{ name:"edges",			type:"list", 	min:0,	max:100,	elementType:{ type:"data", dataType:mm_GraphEdgeDataDef } }
	]
}

function MM_GraphToUML(graph)
{
	var uml = "";
	uml += "@startuml\n";
	uml += "graph G {\n";
	for(var e=0; e<graph.edges.length; ++e)
	{
		var edge = graph.edges[e];
		var a = graph.nodes[edge.a].id;
		var b = graph.nodes[edge.b].id;
		uml += `    "${a}" -- "${b}"\n`;
	}
	uml += "}\n";
	uml += "@enduml\n";
	return uml;
}

function MM_DiGraphToUML(graph)
{
	var uml = "";
	uml += "@startuml\n";
	uml += "digraph G {\n";
	for(var e=0; e<graph.edges.length; ++e)
	{
		var edge = graph.edges[e];
		var a = graph.nodes[edge.a].id;
		var b = graph.nodes[edge.b].id;
		uml += `    "${a}" -> "${b}"\n`;
	}
	uml += "}\n";
	uml += "@enduml\n";
	return uml;
}