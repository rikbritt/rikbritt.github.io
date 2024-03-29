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
    
AssetDb.AddAsset = function(db, guid, type_str, data)
{
    var existing = db.GetAsset(guid, type_str);
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
}

