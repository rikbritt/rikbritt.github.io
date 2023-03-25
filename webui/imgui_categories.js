function BuildGraphOfCategories(objects)
{
	var cat_root = 
	{
		children:{},
		objects:[]
	};

	for ([key, obj] of Object.entries(objects))
	{
		var cat = cat_root;
		var categories = obj.category;
		if(categories == null)
		{
			categories = [];
		}
		for(var c=0; c<categories.length; ++c)
		{
			var category = categories[c];
			if(cat.children[category] == null)
			{
				cat.children[category] = {
					children:{},
					objects:[]
				};
			}

			cat = cat.children[category];
		}
		
		cat.objects.push(obj);
	}

	return cat_root;
}
