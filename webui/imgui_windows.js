var gWindows = [];

function OpenWindow(win_id, update_func)
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
        Update:update_func
    };

    gWindows.push(win_data);
}


function UpdateWindows()
{
    for(var i=0; i<gWindows.length; ++i)
    {
        var win_open = true;
        gWindows[i].Update((_ = win_open) => win_open = _);

        if(win_open == false)
        {
            gWindows.splice(i,1);
            --i;
        }
    }
}