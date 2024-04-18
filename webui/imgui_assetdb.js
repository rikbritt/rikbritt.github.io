
function CreateExplorerAssetNode(asset_id, asset)
{
	return {
		id:"assetdb_" + asset_id,
		GetNodeName:function()
		{
			return AssetDb.GetAssetName(asset_id, asset);
		},
		GetNodeIcon:function() { return "n"; },
		GetNodeChildren:function()
		{ 
			var children = [];
			if(asset.type == "generator")
			{
				children.push( CreateExplorerGeneratorNode(asset.data) );
			}
			else if(asset.type == "data_def")
			{
				children.push( CreateExplorerDataDefNode(asset.data) );
			}
			else if(asset.type == "data_table")
			{
				children.push( CreateExplorerDataTableNode(asset.data) );
			}
			// for([key, data] of Object.entries(category.children))
			// {
			// 	children.push( CreateExplorerGraphCategoryNode(project, key, data));
			// }
		
			// for(data_def of category.objects)
			// {
			// 	children.push( CreateExplorerGraphNode(project, data_def) );
			// }
			return children; 
		}
	};
}

function CreateExplorerAssetDbNode(db, db_id)
{
	return {
		id:"assetdb_" + db_id,
		GetNodeName:function() { return "Asset Db"; },
		GetNodeIcon:function() { return "i"; },
		GetNodeChildren:function()
		{
			var children = [];

            for([id, asset] of Object.entries(db.assets))
			{
				children.push( CreateExplorerAssetNode(id, asset));
			}

			return children;
		},
		UpdateContextMenu:function()
		{
		}
	};
}

function UpdateAssetDBPicker(label, v, type)
{
	var curr_asset = v();
	ImGui.Text(label);
	ImGui.SameLine();
	if(curr_asset == null)
	{
		if(ImGui.Button(`Pick ${type} Asset`))
		{
			ImGui.OpenPopup("asset_picker");
		}
	}
	else
	{
		ImGui.Button(`${curr_asset}`);
	}

	if (ImGui.BeginPopupContextItem("asset_picker"))
	{
		for([id, asset] of Object.entries(gAssetDb.assets))
		{
			if(asset.type == type)
			{
				ImGui.Button(AssetDb.GetAssetName(id, asset));
			}
		}
		ImGui.EndPopup();
	}
}