//Might make sense to only have one project loaded at a time?
bg.projects = [];
bg.projectsById = {};

//leave id null to generate a guid
bg.CreateProject = function(name, id)
{
	if(id == null)
	{
		id = bg.CreateGUID();
	}

	if(bg.projectsById[id] != null)
	{
		console.error("Already have a project registered with id " + id);
		return null;
	}

    var project = {
        id:id,
        name:name,
		generatorGraphs:[],
		generators:[],
		dataDefs:[],
		dataTables:[],
		assetDb:AssetDb.CreateAssetDB()
	};

	bg.projects.push(project);
	bg.projectsById[id] = project;

	return project;
}

//Create global hardcoded project 
bg.global_project = bg.CreateProject("global", "e1763683-2d73-48ff-b886-513d71dc8b76");

bg.GetProjectById = function(id)
{
	return bg.projectsById[id];
}

bg.RegisterProjectGenerator = function(project, generator)
{
	//Auto upgrade to latest version
	bg.UpgradeGenerator(generator);
	if(bg.ValidateGenerator(generator))
	{
		project.generators.push(generator);
		AssetDb.AddAsset(project.assetDb, generator.id, "generator", generator);
	}
}

bg.CreateEmptyProjectGenerator = function(project)
{
	var generator = bg.CreateEmptyGenerator();
	bg.RegisterProjectGenerator(project, generator);
	return generator;
}

bg.CreateEmptyProjectGraph = function(project)
{
	var graph = bg.CreateGraph();
	project.generatorGraphs.push(graph);
	return graph;
}

bg.UnloadProject = function(id)
{
	delete bg.projectsById[id];
	for(var i=0; i<bg.projects.length; ++i)
	{
		if(bg.projects.id == id)
		{
			bg.projects.splice(i, 1);
			break;
		}
	}
}

//Returns a structure of JSON text for each file in folders
bg.SaveProjectAsJSONFiles = function(project)
{
	var project_json_data = {
		id:project.id,
		name:project.name,
		version:1,
		files:[]
	};

	var project_data_files =
	{
		files:[]
	};

	//Save Data Defs
	for([key, data] of Object.entries(project.dataDefs))
	{
		var data_def_json = bg.SaveDataDefToJSON(data);
		var file_name = "datadefs/" + key + ".json";
		project_data_files.files.push({
			name:file_name,
			content:data_def_json
		});
		project_json_data.files.push(file_name);
	}

	//Save Generators
	for(var i=0; i<project.generators.length; ++i)
	{
		var generator_json = bg.SaveGeneratorToJSON(project.generators[i]);
		var file_name = "generators/" + project.generators[i].id + ".json";
		project_data_files.files.push({
			name:file_name,
			content:generator_json
		});
		project_json_data.files.push(file_name);
	}
	
	//Save Graphs
	for(var i=0; i<project.generatorGraphs.length; ++i)
	{
		//add file entry to project_json_data.files
		//add output file entry and content;
		var graph_json = bg.SaveGraphToJSON(project.generatorGraphs[i]);
		var file_name = "graphs/" + project.generatorGraphs[i].id + ".json";
		project_data_files.files.push({
			name:file_name,
			content:graph_json
		});
		project_json_data.files.push(file_name);

	}

	project_data_files.files.push({
		name:"project.json",
		content:JSON.stringify(project_json_data, null, 4)
	});

	return project_data_files;
}

bg.LoadProjectFromJSONFiles = async function(project_data_files, project_root = "")
{
	var loaded_project = null;
	//First scan, find project json file
	for(var i=0; i<project_data_files.files.length; ++i)
	{
		if(project_data_files.files[i].name == "project.json")
		{
			var loaded_data = JSON.parse(project_data_files.files[i].content);
			loaded_project = bg.GetProjectById(loaded_data.id);
			if(loaded_project == null)
			{
				loaded_project = bg.CreateProject(loaded_data.name, loaded_data.id);
			}
			else
			{
				loaded_project.name = loaded_data.name;
			}
			break;
		}
	}

	if(loaded_project != null)
	{
		//Now load all the files
		//TODO - FOR NOW ASSUMING FIRST LOAD / PROJECT NOT LOADED
		for(var i=0; i<project_data_files.files.length; ++i)
		{
			if(project_data_files.files[i].content == undefined)
			{
				//Skip anything that has not loaded
				continue;
			}

			var file_name = project_data_files.files[i].name;
			if(file_name.startsWith("generators/"))
			{
				if(file_name.endsWith(".js"))
				{
					try
					{
						var loaded = await import("data:text/javascript, " + project_data_files.files[i].content);
						var generator = bg.LoadGeneratorFromObject(loaded.generator);
						bg.RegisterProjectGenerator(loaded_project, generator);
						//loaded_project.generators.push(generator);
					}
					catch
					{

					}
				}
				else
				{
					var generator = bg.LoadGeneratorFromJSON(project_data_files.files[i].content);
					bg.RegisterProjectGenerator(loaded_project, generator);
					//loaded_project.generators.push(generator);
				}
			}
			else if(file_name.startsWith("graphs/"))
			{
				var graph = bg.LoadGraphFromJSON(project_data_files.files[i].content);
				loaded_project.generatorGraphs.push(graph);
			}
			else if(file_name.startsWith("datadefs/"))
			{
				var data_def = bg.LoadDataDefFromJSON(project_data_files.files[i].content);
				loaded_project.dataDefs[data_def.id] = data_def;
			}
		}
	}
	return loaded_project;
}

//Asynchronously loads all the project files and adds it to the global projects list
bg.LoadProjectFromJSONFileAsync = function(project_root, async_load_file_func, finished_func)
{
	var json_load = async_load_file_func(project_root + "/project.json")
		.then((data) => {
			var project_data_files =
			{
				files:[
					{
						name:"project.json",
						content:data
					}
				]
			};

			var project_data = JSON.parse(data);
			if(project_data) //todo - add error handler?
			{
				//Async load other files referenced in here.
				var loading_tasks = [];
				for(var i=0; i<project_data.files.length; ++i)
				{
					let file_name = project_data.files[i];
					let full_file_name = project_root + "/" + file_name;
					var load_task = async_load_file_func(full_file_name)
						.then((data2) => 
							project_data_files.files.push(
								{
									name:file_name,
									content:data2
								}
							)
						);

					loading_tasks.push(load_task);
				}
			}
			Promise.all(loading_tasks).then( () => 
				{
					var loaded_project = bg.LoadProjectFromJSONFiles(project_data_files, project_root);
					if(finished_func)
					{
						finished_func(loaded_project);
					}
				}
			);
		}
	);
}

//Load from a project.json file, but provide a function that loads a file to a string
bg.LoadProjectFromJSONFile = function(project_root, load_file_func)
{
	var project_json_str = load_file_func(project_root + "/project.json");

	var project_data_files =
	{
		files:[
			{
				name:"project.json",
				content:project_json_str
			}
		]
	};

	var project_data = JSON.parse(project_json_str);
	
	for(var i=0; i<project_data.files.length; ++i)
	{
		var file_name = project_root + "/" + project_data.files[i];
		var loaded_file_str = load_file_func(file_name);
		
		project_data_files.files.push(
			{
				name:file_name,
				content:loaded_file_str
			}
		);
	}
	
	var loaded_project = bg.LoadProjectFromJSONFiles(project_data_files, project_root);
	return loaded_project;
}