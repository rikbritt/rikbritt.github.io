//Might make sense to only have one project loaded at a time?
bg.projects = [];
bg.projectsById = {};

bg.CreateProject = function(id, name)
{
	if(bg.projectsById[id] != null)
	{
		console.error("Already have a project registered with id " + id);
		return null;
	}

    var project = {
        id:id,
        name:name,
		generatorGraphs:[],
		generators:[]
    };

	bg.projects.push(project);
	bg.projectsById[id] = project;

	return project;
}

bg.GetProjectById = function(id)
{
	return bg.projectsById[id];
}

bg.RegisterProjectGenerator = function(project, generator)
{
	if(bg.RegisterGenerator(generator))
	{
		project.generators.push(generator);
	}
}

bg.CreateEmptyProjectGenerator = function(project)
{
	var generator = bg.CreateEmptyGenerator("new_generator");
	project.generators.push(generator);
	return generator;
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
				loaded_project = bg.CreateProject(loaded_data.id, loaded_data.name);
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