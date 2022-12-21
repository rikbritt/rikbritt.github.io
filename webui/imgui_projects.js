var gCurrentProject = null;

function UpdateProjectsList()
{
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


var gProjectPropertiesOpen = false;
function UpdateProjectPropertiesWindow( project )
{
    if(gProjectPropertiesOpen)
    {
        if(ImGui.Begin("Project Properties",  (_ = gProjectPropertiesOpen) => gProjectPropertiesOpen = _) ))
        {
            ImGui.InputText("Id", (_ = project.id) => project.id = _, 256);
            ImGui.InputText("Name", (_ = project.name) => project.name = _, 256);
        }
        ImGui.End();
    }
}