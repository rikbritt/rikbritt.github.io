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

AssetDb.GetAssetName = function(asset)
{
    if(asset.data.name)
    {
        return `${asset_id} - (${asset.type}) - ${asset.data.name}`;
    }
    else
    {
        return `${asset_id} - (${asset.type})`;
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
