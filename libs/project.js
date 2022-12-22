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
		files:[
			{
				name:"project.json",
				content:JSON.stringify(project_json_data, null, 4)
			}
		]
	};
	
	for(var i=0; i<project.generatorHierarchies.length; ++i)
	{
		//add file entry to project_json_data.files
		//add output file entry and content;
	}

	return project_data_files;
}