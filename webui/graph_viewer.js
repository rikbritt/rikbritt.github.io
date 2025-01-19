function CreateGraphViewerWindow(graphData)
{
    var win = window.open("graph_viewer.html", "graph_viewer", "status=0,location=0,toolbar=0,menubar=0,addressbar=0,width=1280,height=720");
    if(win != 0)
    {
        setTimeout(() => {
            win.postMessage(graphData, "*");
        }, 1000);
    }
}