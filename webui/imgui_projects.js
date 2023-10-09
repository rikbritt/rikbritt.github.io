var gAvailableProjects = []; //List of projects that can be loaded, e.g. from URL

function UpdateProjectsList()
{
    for(var i=0; i<gAvailableProjects.length; ++i)
    {
        if(ImGui.MenuItem(gAvailableProjects[i].url))
        {
            LoadProjectFromURL(gAvailableProjects[i].url);
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
    var loaded_project = bg.LoadProjectFromJSONFileAsync(
        project_json_url, 
        function(file_name)
        {
            var load_task = fetch(file_name)
            .then(response => response.text());
            return load_task;
        },
        function(loaded_project)
        {
            
        }
    );


    // fetch(project_json_url + "/project.json")
    // .then(response => response.text())
    // .then((data) => {
    //     var project_data_files =
    //     {
    //         files:[
    //             {
    //                 name:"project.json",
    //                 content:data
    //             }
    //         ]
    //     };

    //     var project_data = JSON.parse(data);
    //     //Async load other files referenced in here.
    //     var loading_tasks = [];
    //     for(var i=0; i<project_data.files.length; ++i)
    //     {
    //         var file_name = project_json_url + "/" + project_data.files[i];
    //         var load_task = fetch(file_name)
    //             .then(response => response.text())
    //             .then((data2) => 
    //                 project_data_files.files.push(
    //                     {
    //                         name:file_name,
    //                         content:data2
    //                     }
    //                 )
    //             );

    //         loading_tasks.push(load_task);
    //     }

    //     Promise.all(loading_tasks).then( () => 
    //         {
    //             var loaded_project = bg.LoadProjectFromJSONFiles(project_data_files);
    //             //OpenProjectWindow(loaded_project);
    //         }
    //     );
    // });
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
                    var project_data_files =
                    {
                        files:[
                            {
                                name:"project.json",
                                content:data
                            }
                        ]
                    };

                    //Load other files referenced in here.
                    var project_file_data = JSON.parse(data);
                    var unzip_tasks = [];
                    for(var i=0; i<project_file_data.files.length; ++i)
                    {
                        var unzip_filename = project_file_data.files[i];
                        var unzip_task = zip.file(unzip_filename).async("string").then(
                            function(file_data)
                            {
                                project_data_files.files.push(
                                    {
                                        name:unzip_filename,
                                        content:file_data
                                    }
                                );
                            }
                        );
                        unzip_tasks.push(unzip_task);
                    }

                    Promise.all(unzip_tasks).then( () => 
                        {
                            var loaded_project = bg.LoadProjectFromJSONFiles(project_data_files);
                            //OpenProjectWindow(loaded_project);
                        }
                    );
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

//Add project info to a window
function UpdateProjectProperties( project )
{
    ImGui.PushID(project.id);
    ImGui.Text("Id : " + project.id);
    ImGui.InputText("Name", (_ = project.name) => project.name = _, 256);
    if(ImGui.CollapsingHeader("Graphs"))
    {
        ImGui.Indent();
        if(ImGui.Button("New Graph... (WIP)"))
        {
            bg.CreateEmptyProjectGraph(project);
        }

        UpdateGraphsTable(
            project.id + "_graphs", 
            project.generatorGraphs,
            function(graph)
            {
                OpenWindow(graph.id, UpdateGraphWindow, graph);
            }
        );
        ImGui.Unindent();
    }
    if(ImGui.CollapsingHeader("Data Defs"))
    {
        ImGui.Indent();
        if(ImGui.Button("New Data Def Type.."))
        {
            bg.CreateEmptyDataDef(project);
        }

        UpdateDataDefaTable(
            project.id + "_data_defs", 
            project.dataDefs,
            function(data_def)
            {
                OpenWindow(data_def.id, UpdateDataDefWindow, data_def);
            }
        );
        
        ImGui.Unindent();
    }
    if(ImGui.CollapsingHeader("Generators"))
    {
        ImGui.Indent();
        if(ImGui.Button("New Generator..."))
        {
            var new_generator = bg.CreateEmptyProjectGenerator(project);
            new_generator.name = "New Generator";
        }
        
        UpdateGeneratorsTable("generator_table", project.generators);
        ImGui.Unindent();
    }
    ImGui.PopID();
}


function UpdateProjectsMenu()
{
    if (ImGui.BeginMenu("Projects"))
    {
        if(ImGui.MenuItem("New Project"))
        {
            var created_project = bg.CreateProject("New Project");
            //OpenProjectWindow(created_project);
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
        for(var i=0; i<bg.projects.length; ++i)
        {
            var project = bg.projects[i];
            if(ImGui.BeginMenu(project.name))
            {
                if(ImGui.MenuItem("Save Project To Zip"))
                {
                    SaveProjectToZip(project);
                }

                ImGui.EndMenu();
            }
        }
        ImGui.EndMenu();
    }
}