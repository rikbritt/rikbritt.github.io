var gCurrentProject = null;
var gAvailableProjects = [];

function UpdateProjectsList()
{
    for(var i=0; i<gAvailableProjects.length; ++i)
    {
        if(ImGui.MenuItem(gAvailableProjects.url))
        {
            LoadProjectFromURL(gAvailableProjects.url);
        }
    }

    for(var i=0; i<bg.projects.length; ++i)
    {
        if(ImGui.MenuItem(bg.projects[i].name))
        {
            gCurrentProject = bg.projects[i];
        }
    }
}

function AddProjectToListFromURL(project_folder_url)
{
    gAvailableProjects.push(
        {
            url:project_folder_url
        }
    );
}

function LoadProjectFromURL(project_json_url)
{
    fetch(project_json_url)
    .then(response => response.text())
    .then((data) => {
      console.log(data)
    });
}

function LoadProjectFromZip(file_blob)
{
    JSZip.loadAsync(file_blob) // 1) read the Blob
    .then(
        function(zip) 
        {
            zip.file("project.json").async("string").then(
                function (data) 
                {
                    var loaded_data = JSON.parse(data);
                    var existing_project = bg.GetProjectById(loaded_data.id);
                    if(existing_project == null)
                    {
                        gCurrentProject = bg.CreateProject(loaded_data.id, loaded_data.name);
                    }
                    else
                    {
                        existing_project.name = loaded_data.name;
                    }
                  }
            );
        },
        function (e) 
        {
        }
    );
}

function SaveProjectToZip( project )
{
    var project_files = bg.SaveProjectAsJSONFiles( project );
    var zip = new JSZip();
    for(var i=0; i<project_files.files.length; ++i)
    {
        var file = project_files.files[i];
        zip.file(file.name, file.content);
    }
    zip.generateAsync({type:"blob"})
        .then(
            function (blob) 
            {
                saveAs(blob, "project.zip");
            }
        );
}

function UpdateProjectPropertiesWindow( close_func, project )
{
    if(project == null)
    {
        project = gCurrentProject;
    }

    if(ImGui.Begin("Project Properties", close_func ))
    {
        ImGui.InputText("Id", (_ = project.id) => project.id = _, 256);
        ImGui.InputText("Name", (_ = project.name) => project.name = _, 256);
        if(ImGui.CollapsingHeader("Hierarchies"))
        {
            ImGui.Indent();
            if(ImGui.Button("New Hierarchy... (NOT IMPL)"))
            {
                
            }
            ImGui.Unindent();
        }
        if(ImGui.CollapsingHeader("Generators"))
        {
            ImGui.Indent();
            if(ImGui.Button("New Generator... (NOT IMPL)"))
            {

            }
            ImGui.Unindent();
        }
    }
    ImGui.End();
}


function UpdateProjectsMenu()
{
    if (ImGui.BeginMenu("Project (" + (gCurrentProject==null ? "None" : gCurrentProject.name) + ")"))
    {
        if(ImGui.MenuItem("New Project"))
        {
            gCurrentProject = bg.CreateProject("new", "New Project");
        }
        if(ImGui.BeginMenu("Open Project..."))
        {
            if(ImGui.MenuItem("From File..."))
            {
                var input = document.createElement("input");
                input.type = "file";
                input.setAttribute("false", true);
                input.setAttribute("accept", "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed");
                input.onchange = function (event)
                {
                    if(this.files.length > 0)
                    {
                        LoadProjectFromZip(this.files[0]);
                    }
                };
                input.click();
            }
            UpdateProjectsList();
            ImGui.EndMenu();
        }
        if(gCurrentProject && ImGui.MenuItem("Save Project To Zip"))
        {
            SaveProjectToZip(gCurrentProject);
        }
        if(gCurrentProject && ImGui.MenuItem("Project Properties"))
        {
            OpenWindow(gCurrentProject.id + "_properties", UpdateProjectPropertiesWindow );
        }
        ImGui.EndMenu();
    }
}