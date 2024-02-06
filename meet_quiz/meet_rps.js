var MeetHooks = 
{
    GameWindow:0,
    OldestLastSeenChat:0,
    LastMessageTimeByName:{},
    ReadLatestMessages:function()
    {
        var chat_windows = document.getElementsByClassName("z38b6");
        if(chat_windows.length == 0)
        {
            return false;
        }
        var messages = chat_windows[0].__jscontroller.yQ.messages.messages;
        messages.forEach(function(value, key) {
            var sender_name = value.message.oa.Ph[3].Ph[0];
            var time_stamp = Date.now(); //parseInt(value.message.oa.Ph[6]);//parseInt(key.split("/").pop());
            if(this.LastMessageTimeByName[sender_name] == null)
            {
                this.LastMessageTimeByName[sender_name] = 0;
            }
            if(time_stamp > this.LastMessageTimeByName[sender_name]) // < as current one may have add new messages added
            {
                var message = value.message.oa.Ph[1];
                console.log(`Posting : ${sender_name} - ${message} - ${time_stamp}`);
                this.LastMessageTimeByName[sender_name] = time_stamp;
                this.GameWindow.postMessage({sender:sender_name, message:message, time_stamp:time_stamp}, "*");
            }
        }.bind(this));

        return true;
    }
};



function ReadyToStart()
{
    if(GetGameToPlay == undefined)
    {
        return false;
    }

    var iframe_exists = document.getElementsByTagName("iframe").length > 0;
    if(iframe_exists)
    {
        return true;
    }
    return false;
}

var setup = setInterval(
    function()
    {
        if(true)//ReadyToStart())
        {
            
            setInterval(
                function()
                {
                    MeetHooks.ReadLatestMessages();
                },
                100
            );

            clearInterval(setup);
        }
    },
    1000
);


MeetHooks.GameWindow = window.open("https://sharp-ritchie-6a571f.netlify.app/meet_quiz/rps/game.html", "game", "status=0,location=0,toolbar=0,menubar=0,addressbar=0,width=1280,height=720");
MeetHooks.ControlWindow = window.open("https://sharp-ritchie-6a571f.netlify.app/meet_quiz/framework/game_control.html", "game_control", "status=0,location=0,toolbar=0,menubar=0,addressbar=0,width=400,height=800");
//Done from here to minimise popup blocks
setTimeout(
    function()
    {
        MeetHooks.GameWindow.postMessage({type:"func", name:"SetControlWindow", arg:"game_control"}, "*");
        MeetHooks.ControlWindow.postMessage({type:"func", name:"SetGameWindow", arg:"game"}, "*");
    },
    2000
);