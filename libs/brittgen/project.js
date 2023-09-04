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
		dataDefs:[]
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
	if(bg.RegisterGenerator(generator, false /* don't add to global project*/))
	{
		project.generators.push(generator);
	}
}

bg.CreateEmptyProjectGenerator = function(project)
{
	var generator = bg.CreateEmptyGenerator();
	project.generators.push(generator);
	return generator;
}

bg.CreateEmptyProjectGraph = function(project)
{
	var graph = bg.CreateGraph();
	graph.name = "New Graph";
	graph.description = "";
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
		files:[],
		generators:[]
	};

	for(var i=0; i<project.generators.length; ++i)
	{
		project_json_data.generators.push(project.generators[i].id);
		//todo add generator file to save
	}

	var project_data_files =
	{
		files:[]
	};

	for(var i=0; i<project.generators.length; ++i)
	{
		var generator_json = bg.SaveGeneratorToJSON(project.generators[i]);
		project_data_files.files.push({
			name:"generator/" + project.generators[i].id + ".json",
			content:generator_json
		});
		project_json_data.files.push("generator/" + project.generators[i].id + ".json");
	}
	
	for(var i=0; i<project.generatorGraphs.length; ++i)
	{
		//add file entry to project_json_data.files
		//add output file entry and content;
		var graph_json = bg.SaveGraphToJSON(project.generatorGraphs[i]);
		project_data_files.files.push({
			name:"graph/" + project.generatorGraphs[i].id + ".json",
			content:graph_json
		});
		project_json_data.files.push("generator/" + project.generators[i].id + ".json");

	}

	project_data_files.files.push({
		name:"project.json",
		content:JSON.stringify(project_json_data, null, 4)
	});

	return project_data_files;
}

bg.LoadProjectFromJSONFiles = function(project_data_files)
{
	//Local helper
	var GetFile = function(file_name)
	{
		//todo
		
	}
	//get project.json
	for(var i=0; i<project_data_files.files.length; ++i)
	{
		if(project_data_files.files[i].name == "project.json")
		{
			var loaded_data = JSON.parse(project_data_files.files[i].content);
			var loaded_project = bg.GetProjectById(loaded_data.id);
			if(loaded_project == null)
			{
				loaded_project = bg.CreateProject(loaded_data.name, loaded_data.id);
			}
			else
			{
				loaded_project.name = loaded_data.name;
			}

			//Restore generators


			return loaded_project;
		}
	}
	return null;
}

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
			//Async load other files referenced in here.
			var loading_tasks = [];
			for(var i=0; i<project_data.files.length; ++i)
			{
				var file_name = project_root + "/" + project_data.files[i];
				var load_task = async_load_file_func(file_name)
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

			Promise.all(loading_tasks).then( () => 
				{
					var loaded_project = bg.LoadProjectFromJSONFiles(project_data_files);
					finished_func(loaded_project);
				}
			);
		}
	);
}

//Load from a project.json file, but provide a function that loads a file to a string
bg.LoadProjectFromJSONFile = function(project_json_file_name, load_file_func)
{

}