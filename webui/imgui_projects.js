var gCurrentProject = null;
var gAvailableProjects = [];

function UpdateProjectsList()
{
    for(var i=0; i<gAvailableProjects.length; ++i)
    {
        if(ImGui.MenuItem(gAvailableProjects[i].url))
        {
            LoadProjectFromURL(gAvailableProjects[i].url);
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
    fetch(project_json_url + "/project.json")
    .then(response => response.text())
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
            var file_name = project_json_url + "/" + project_data.files[i];
            var load_task = fetch(file_name)
                .then(response => response.text())
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
              gCurrentProject = bg.LoadProjectFromJSONFiles(project_data_files);
                OpenWindow(gCurrentProject.id + "_properties", UpdateProjectPropertiesWindow );
            }
        );
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
                    //TODO: Load other files referenced in here.
                    var project_data_files =
                    {
                        files:[
                            {
                                name:"project.json",
                                content:data
                            }
                        ]
                    };
                    gCurrentProject = bg.LoadProjectFromJSONFiles(project_data_files);
                    OpenWindow(gCurrentProject.id + "_properties", UpdateProjectPropertiesWindow );
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
		ImGui.Text("Id : " + project.id);
        ImGui.InputText("Name", (_ = project.name) => project.name = _, 256);
        if(ImGui.CollapsingHeader("Graphs"))
        {
            ImGui.Indent();
            if(ImGui.Button("New Graph... (NOT IMPL)"))
            {
                
            }
            ImGui.Unindent();
        }
        if(ImGui.CollapsingHeader("Generators"))
        {
            ImGui.Indent();
            if(ImGui.Button("New Generator..."))
            {
                var new_generator = bg.CreateEmptyProjectGenerator(gCurrentProject);
                new_generator.name = "Create New Generator";
            }
                        
            var flags = ImGui.TableFlags.Borders | ImGui.TableFlags.RowBg;
                    
            if (ImGui.BeginTable("generator_table", 3, flags))
            {
                ImGui.TableSetupColumn("Name");
                ImGui.TableSetupColumn("Description");
                ImGui.TableSetupColumn("Category");
                ImGui.TableHeadersRow();

                for (var row = 0; row < project.generators.length; row++)
                {
                    var gen = project.generators[row];
                    ImGui.PushID(gen.id);
                    ImGui.TableNextRow();
                    ImGui.TableSetColumnIndex(0);
                    if(ImGui.Button(gen.name))
                    {
                        OpenWindow(gen.id, UpdateGeneratorWindow, gen);
                    }
                    ImGui.TableSetColumnIndex(1);
                    ImGui.TextUnformatted(gen.description);
                    ImGui.TableSetColumnIndex(2);
                    ImGui.TextUnformatted(gen.category.join("/"));
                    ImGui.PopID();
                }
                ImGui.EndTable();
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
            gCurrentProject = bg.CreateProject("New Project");
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