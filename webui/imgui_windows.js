var gWindows = [];

function OpenWindow(win_id, update_func, data)
{
    for(var i=0; i<gWindows.length; ++i)
    {
        if(gWindows[i].id == win_id)
        {
            return;
        }
    }

    var win_data = 
    {
        id:win_id,
        data:data,
        Update:update_func
    };

    gWindows.push(win_data);
}

function CloseWindow(win_id)
{
    for(var i=0; i<gWindows.length; ++i)
    {
        if(gWindows[i].id == win_id)
        {
            gWindows.splice(i,1);
            return;
        }
    }
}

function IsWindowOpen(win_id)
{
    for(var i=0; i<gWindows.length; ++i)
    {
        if(gWindows[i].id == win_id)
        {
            return true;
        }
    }
    return false;
}

function UpdateWindows()
{
    for(var i=0; i<gWindows.length; ++i)
    {
        var win_open = true;
        ImGui.SetNextWindowSizeConstraints({x:200,y:200}, {x:1000000.0, y:1000000.0});
        gWindows[i].Update((_ = win_open) => win_open = _, gWindows[i].data);

        if(win_open == false)
        {
            gWindows.splice(i,1);
            --i;
        }
    }
}