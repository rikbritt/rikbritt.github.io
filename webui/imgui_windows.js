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
        ImGui.SetNextWindowSizeConstraints({x:100,y:100}, {x:-1, y:-1});
        gWindows[i].Update((_ = win_open) => win_open = _, gWindows[i].data);

        if(win_open == false)
        {
            gWindows.splice(i,1);
            --i;
        }
    }
}