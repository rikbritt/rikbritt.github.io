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
		generatorHierarchies:[],
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
	var generator = bg.CreateEmptyProjectGenerator("new_generator");
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
		files:[
			{
				name:"project.json",
				content:JSON.stringify(project_json_data, null, 4)
			}
		]
	};

	for(var i=0; i<project.generators.length; ++i)
	{
		var generator_json = SaveGeneratorToJSON(project.generators[i]);
		project_data_files.files.push({
			name:project.generators[i].id + ".json",
			content:generator_json
		});
	}
	
	for(var i=0; i<project.generatorHierarchies.length; ++i)
	{
		//add file entry to project_json_data.files
		//add output file entry and content;
	}

	return project_data_files;
}

bg.LoadProjectFromJSONFiles = function(project_data_files)
{
	//get project.json
	for(var i=0; i<project_data_files.files.length; ++i)
	{
		if(project_data_files.files[i].name == "project.json")
		{
			var loaded_data = JSON.parse(project_data_files.files[i].content);
			var existing_project = bg.GetProjectById(loaded_data.id);
			if(existing_project == null)
			{
				return bg.CreateProject(loaded_data.id, loaded_data.name);
			}
			else
			{
				existing_project.name = loaded_data.name;
			}
			return existing_project;
		}
	}
	return null;
}