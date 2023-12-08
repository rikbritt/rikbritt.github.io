var MeetHooks = 
{
    GameWindow:0,
    OldestLastSeenChat:0,
    LastMessageNumEntries:0,
    LastMessageTime:0,
    ReadLatestMessages:function()
    {
        var chat_windows = document.getElementsByClassName("z38b6");
        if(chat_windows.length == 0)
        {
            return false;
        }
        var chat_window = chat_windows[0];
        var chats = chat_window.getElementsByClassName("GDhqjd");
        var seen_player_chats = {};
        for(var i=0; i<chats.length; ++i) //iterate backwards
        {
            var c = (chats.length-1) - i;
            var sender_name = chats[c].attributes["data-sender-name"].value;
            if(seen_player_chats[sender_name] != null)
            {
                continue;
            }
            var time_stamp = parseInt(chats[c].attributes["data-timestamp"].value);
            if(time_stamp < this.OldestLastSeenChat) // < as current one may have add new messages added
            {
                //Processed all known chats
                break;
            }
            this.OldestLastSeenChat = time_stamp;
            seen_player_chats[sender_name] = time_stamp;
   
            if(time_stamp != this.LastMessageTime)
            {
                this.LastMessageTime = 0;
            }
            
            var messages = chats[c].getElementsByClassName("oIy2qc");
            if(messages.length == this.LastMessageNumEntries)
            {
                continue;
            }
                
            for(var m=this.LastMessageNumEntries; m<messages.length; ++m)
            {
                var message = messages[m].attributes["data-message-text"].value;
                this.GameWindow.postMessage({sender:sender_name, message:message, time_stamp:time_stamp}, "*");
                console.log(`Posting : ${sender_name} - ${message} - ${time_stamp}`);
            }
            
            this.LastMessageNumEntries = messages.length;
            this.LastMessageTime = time_stamp;
        }
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















