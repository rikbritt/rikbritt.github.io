//Provides a way to find 'assets' by GUID.
//An asset is an instance of any kind of class
AssetDb = {}; //Namespace

AssetDb.CreateAssetDB = function()
{
    return {
        assets:{}
    }
}

AssetDb.GetAsset = function(db, guid, type_str = null)
{
    var asset = db.assets[guid];
    if(asset)
    {
        if(type_str == null || asset.type == type_str)
        {
            return asset.data;
        }
    }
    return null;
}

AssetDb.GetAssetType = function(guid)
{
    var asset = gAssetDb[guid];
    if(asset)
    {
        return asset.type;
    }
    return "";
}

//Can be used with only id
AssetDb.GetAssetName = function(asset_id, asset = null)
{
    if(asset == null)
    {
        asset = gAssetDb.assets[asset_id];
    }

    if(asset == null)
    {
        return `BROKEN ASSET`;
    }

    if(asset.data.name)
    {
        return `${asset.data.name} (${asset.type}) - ${asset_id}`;
    }
    else
    {
        return `${asset_id} (${asset.type})`;
    } 
}
    
AssetDb.GetAssetShortName = function(asset_id, asset = null)
{
    if(asset == null)
    {
        asset = gAssetDb.assets[asset_id];
    }

    if(asset == null)
    {
        return `BROKEN ASSET`;
    }

    if(asset.data.name)
    {
        return `${asset.data.name}`;
    }
    else
    {
        return `${asset_id}`;
    } 
}

AssetDb.AddAsset = function(db, guid, type_str, data)
{
    var existing = AssetDb.GetAsset(db, guid, type_str);
    if(existing != null)
    {
        //Error
    }
    else
    {
        db.assets[guid] = {
            type:type_str,
            data:data
        }
    }

    //Also add to global db
    if(db != gAssetDb)
    {
        AssetDb.AddAsset(gAssetDb, guid, type_str, data);
    }
}

//Global asset db, duplicates contents of all project dbs for ease
gAssetDb = AssetDb.CreateAssetDB();
