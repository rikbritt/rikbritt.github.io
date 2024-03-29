
function CreateExplorerAssetDbNode(project)
{
	return {
		project:project,
		id:"assetdb_" + project.id,
		GetNodeName:function() { return "Asset Db"; },
		GetNodeIcon:function() { return "q"; },
		GetNodeChildren:function()
		{
			var children = [];

			//Might be slow as shit
			// var categories = BuildGraphOfCategories(project.dataDefs);

			// for([key, data] of Object.entries(categories.children))
			// {
			// 	children.push( CreateExplorerDataDefCategoryNode(project, key, data));
			// }

			// for(gen of categories.objects)
			// {
			// 	children.push( CreateExplorerDataDefNode(project, gen) );
			// }

			return children;
		},
		UpdateContextMenu:function()
		{
			// if(ImGui.Button("Create New Data Def..."))
			// {
			// 	var data_def = bg.CreateEmptyDataDef(project);
			// 	OpenWindow(data_def.id, UpdateDataDefWindow, data_def);
            //     ImGui.CloseCurrentPopup();
			// }
		}
	};
}