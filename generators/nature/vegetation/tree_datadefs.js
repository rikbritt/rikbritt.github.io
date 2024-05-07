var treeTypeDataDef = {
	version:1,
	name:"Tree Type",
	id:"721ff5d7-2c4d-4772-b456-7ba392149ed5",
	fields:[
		{ name:"trunkBaseDiameter",	type:"distance",	units:"m",	min:0.1, max:5 }
	]
}

bg.RegisterProjectDataDef(bg.global_project, treeTypeDataDef);