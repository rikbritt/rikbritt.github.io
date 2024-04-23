
bg.UpgradeDataTable = function(data_table)
{

}

bg.ValidateDataTable = function(data_table)
{
    return true;
}

bg.RegisterProjectDataTable = function(project, data_table)
{
	bg.UpgradeDataTable(data_table);
	if(bg.ValidateDataTable(data_table))
	{
		project.dataTables[data_table.id] = data_table;
		AssetDb.AddAsset(project.assetDb, data_table.id, "data_table", data_table);
		return true;
	}
	return false;
}

bg.CreateEmptyDataTable = function(project)
{
	var data_table = {
		version:1,
		id:bg.CreateGUID(),
		name:"New Data Table",
		category:[],
		data_def:null,
		data:[]
	};

	bg.RegisterProjectDataTable(project, data_table);

	return data_table;
}