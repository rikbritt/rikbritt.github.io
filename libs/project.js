bg.projects = [];
bg.projectsById = {};

bg.CreateProject = function(id, name)
{
	if(bg.projectsById[id] != null)
	{
		console.error("Already have a project registered with id " + id);
	}

    var project = {
        id:id,
        name:name
    };

	bg.projects.push(project);
	bg.projectsById[id] = project;
}