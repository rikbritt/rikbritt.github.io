
var string_data_table_def = {
	version:1,
	name:"String Data Table Def",
	description:"Used for data tables that are just a string array",
	category:["DataTableDefs"],
	fields:[
		{ name:"String", 	type:"text"	}
	]
}

bg.RegisterProjectDataTable(bg.global_project, string_data_table_def);