
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
	var curr_asset_id = v();
	ImGui.Text(label);
	ImGui.SameLine();
	if(curr_asset_id == null)
	{
		if(ImGui.Button(`Pick ${type} Asset`))
		{
			ImGui.OpenPopup("asset_picker");
		}
	}
	else
	{
		if(ImGui.Button(`${AssetDb.GetAssetName(curr_asset_id)}`))
		{
			ImGui.OpenPopup("asset_picker");
		}
	}

	if (ImGui.BeginPopupContextItem("asset_picker"))
	{
		for([id, asset] of Object.entries(gAssetDb.assets))
		{
			if(asset.type == type)
			{
				if(ImGui.Button(AssetDb.GetAssetName(id, asset)))
				{
					v(id);
					ImGui.CloseCurrentPopup();
				}
			}
		}
		ImGui.EndPopup();
	}
}

var gAsssetDbSearch = "";
function UpdateAssetDbWindow( close_func, data )
{        
    if(ImGui.Begin("Asset Db", close_func))
    {
		ImGui.InputText("Search Id", (_ = gAsssetDbSearch) => gAsssetDbSearch = _, 256);

		var asset = AssetDb.GetAsset(gAssetDb, gAsssetDbSearch);
		if(asset == null)
		{
			ImGui.Text("No Asset Found");
		}
		else
		{
			ImGui.Text(AssetDb.GetAssetName(gAsssetDbSearch));
			ImGui.Text(AssetDb.GetAssetType(gAsssetDbSearch));
		}
        ImGui.End();
    }
}