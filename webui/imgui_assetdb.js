
function CreateExplorerAssetNode(project, asset_id, asset)
{
	return {
		project:project,
		id:"assetdb_" + asset_id,
		GetNodeName:function()
		{
			if(asset.data.name)
			{
				return `${asset_id} - (${asset.type}) - ${asset.data.name}`;
			}
			else
			{
			 	return `${asset_id} - (${asset.type})`;
			} 
		},
		GetNodeIcon:function() { return "n"; },
		GetNodeChildren:function()
		{ 
			var children = [];
			if(asset.type == "generator")
			{
				children.push( CreateExplorerGeneratorNode(project, asset.data) );
			}
			else if(asset.type == "data_def")
			{
				children.push( CreateExplorerDataDefNode(project, asset.data) );
			}
			else if(asset.type == "data_table")
			{
				children.push( CreateExplorerDataTableNode(project, asset.data) );
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

function CreateExplorerAssetDbNode(project)
{
	return {
		project:project,
		id:"assetdb_" + project.id,
		GetNodeName:function() { return "Asset Db"; },
		GetNodeIcon:function() { return "i"; },
		GetNodeChildren:function()
		{
			var children = [];

            for([id, asset] of Object.entries(project.assetDb.assets))
			{
				children.push( CreateExplorerAssetNode(project, id, asset));
			}

			return children;
		},
		UpdateContextMenu:function()
		{
		}
	};
}

function UpdateAssetDBPicker(v)
{
	ImGui.Button("Pick Asset");
}