
var demo_inject = `
<div>Demo
</div>
`;

var DemoGame =
{
    NextQuestion:0,
    SetState:function(s)
    {
    },
    StartGame:function()
    {
    },
    UpdateGame:function(dt)
    {
    },
    OnRoundEnd:function(round)
    {
    },
    GetHTMLToInject:function()
    {
        return demo_inject;
    },
    GetGameControls:function()
    {
        var controls = "<div>";
        
        controls += "<h2>Demo Game</h2>";
        controls += CreateButton("Start Round", "Debug_StartRound") + "<br>";
        controls += CreateButton("End Round", "Debug_EndRound") + "<br>";
        controls += "</div>";

        return controls;
    }
}


