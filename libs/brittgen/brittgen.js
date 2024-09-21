bg = {
	data:{}
};


bg.ToJson = function(obj)
{
	var hide_private_func = function(k,v)
	{
		if(k.startsWith('_'))
		{
			return undefined;
		}
		return v;
	}
	return JSON.stringify(obj, hide_private_func, 4);
}