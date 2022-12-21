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
        name:name
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
	var project_data_files =
	{
		files:[
			{
				name:"project.json",
				content:JSON.stringify(project, null, 4)
			}
		]
	};
	return project_data_files;
}