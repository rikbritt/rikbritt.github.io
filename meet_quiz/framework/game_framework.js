function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes.
    return div.firstChild;
  }
  
function text_truncate(str, length, ending) {
    if (length == null) {
      length = 100;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  };

var ChatGame = 
{
    ScoreModes:
    {
        FirstRightAnswer:
        {
            ProcessAnswerScore:function(player, valid, message)
            {
                if(valid)
                {
                    if(player.GotAnswerThisRound == false)
                    {
                        player.SetScore(player.Score + 1);
                        player.GotAnswerThisRound = true;
                    }
                }
            }
        },
        LastAnswerRightAtRoundEnd:
        {
            //todo
        }
    },
    AnswerModes:
    {
        Custom:{
            Description:"?"
        },
        MultipleChoice:
        {
            Description:"Multiple Choice",
            ProcessAnswer:function(player, message)
            {
                //Check allowed list
                var valid = false;

                for(var w=0; w<ChatGame.CurrentRound.WordList.length; ++w)
                {
                    if(message.toLowerCase() == ChatGame.CurrentRound.WordList[w].toLowerCase())
                    {
                        valid = true;
                        break;
                    }
                }

                if(valid)
                {
                    player.SetMessage(message);
                }

                return valid;
            }
        },
        MultipleChoiceFirstAnswer:{
            Description:"Multiple Choice - First Answer Only"
        }
    },
    MeetChatFound:false,
    TimeLeftInRound:10,
    RoundTime:10,
    Players:
    {
        AddPlayer:function(name)
        {
            var player_div = createElementFromHTML(`
            <div class="player-item" style="z-index:${1000 - this.PlayerList.length}">
                <div class="player-background">
                    <div class="player-name">${text_truncate(name, 16, "..")}</div>
                    <div class="player-msg"></div>
                    <div class="player-score"></div>
                </div>
            </div>
            `);
            var player = {
                Name:name,
                div:player_div,
                background_div:player_div.getElementsByClassName("player-background")[0],
                LastMessage:"",
                LastMessageTime:0,
                LastMessageNumEntries:0,
                Score:0,
                GotAnswerThisRound:false,
                MessageHistory:[],
                SetMessage:function(msg)
                {
                    this.LastMessage = msg;
                    if(msg == "")
                    {
                        this.div.getElementsByClassName("player-msg")[0].innerHTML = "";
                    }
                    else if(ChatGame.CurrentRound && ChatGame.CurrentRound.HideAnswers)
                    {
                        this.div.getElementsByClassName("player-msg")[0].innerHTML = "&#10003;";
                    }
                    else
                    {
                        this.div.getElementsByClassName("player-msg")[0].innerHTML = msg;
                    }
                    this.UpdateClasses();
                },
                UpdateClasses:function()
                {
                    this.background_div.classList.remove("player-not-answered");
                    this.background_div.classList.remove("player-answered");
                    this.background_div.classList.remove("player-wait");
                    if(ChatGame.CurrentRound == null)
                    {
                        this.background_div.classList.add("player-wait");
                    }
                    else if(this.LastMessage == "")
                    {
                        this.background_div.classList.add("player-not-answered");
                    }
                    else
                    {
                        this.background_div.classList.add("player-answered");
                    }
                },
                SetScore:function(amount)
                {
                    this.Score = amount;
                    this.div.getElementsByClassName("player-score")[0].innerHTML = this.Score.toString();
                }
            };

            this.PlayerList.push(player);
            player.UpdateClasses();

            document.getElementById("players").appendChild(player_div);
            return player;
        },
        GetOrAddPlayer:function(name)
        {
            for(var i=0; i<this.PlayerList.length;++i)
            {
                var player = this.PlayerList[i];
                if(player.Name == name)
                {
                    return player;
                }
            }
            return this.AddPlayer(name);
        },
        PlayerList:[]
    },
    CurrentGame:null,
    CurrentRound:null,
    Started:false, //If false then the game hasn't been started yet, so we wait for that initial button click
    StartGame:function(game)
    {
        this.CurrentGame = game;
        //game.StartGame(); //Not until this.Started is true
    },
    StartRound:function(
        round_time, //How long the round will take
        answer_mode,
        score_mode,
        word_list = [],  //List of valid words. Words on this list will be set as players last entry
        wipe_old = true,
        hide_answers = true
    )
    {
        this.CurrentRound = {
            WordList:word_list,
            FirstValidAnswerPlayer:null,
            HideAnswers:hide_answers,
            AnswerMode:answer_mode,
            ScoreMode:score_mode
        }
        this.RoundTime = round_time;
        this.TimeLeftInRound = round_time;
        for(var i=0; i<this.Players.PlayerList.length;++i)
        {
            this.Players.PlayerList[i].GotAnswerThisRound = false;
        }
        if(wipe_old)
        {
            for(var i=0; i<this.Players.PlayerList.length;++i)
            {
                this.Players.PlayerList[i].SetMessage("");
            }
        }

        document.getElementById("overlay_answer_mode").innerText = answer_mode.Description;
    },
    UpdateGame:function(dt)
    {
        this.UpdateGameControls();

        //Update number of players
        if(this.GetNewChatsAndPlayers() == false)
        {
            return;
        }

        if(this.Started == false)
        {
            return;
        }

        if(this.TimeLeftInRound > 0)
        {
            this.TimeLeftInRound -= dt;
            if(this.TimeLeftInRound <= 0)
            {
                this.TimeLeftInRound = 0;
                for(var i=0; i<this.Players.PlayerList.length;++i)
                {
                    //this.Players.PlayerList[i].SetMessage("");
                    this.Players.PlayerList[i].UpdateClasses();
                }
                var ended_round = this.CurrentRound;
                this.CurrentRound = null;
                this.CurrentGame.OnRoundEnd(ended_round);
            }
        }
        this.CurrentGame.UpdateGame(dt);
    },
    StartGameClicked:function()
    {
        this.Started = true;
        this.CurrentGame.StartGame();
    },
    CreateButton:function(text, js)
    {
        return createElementFromHTML(`<button onclick="${js}">${text}</button>`);
    },
    OldestLastSeenChat:0,
    GetNewChatsAndPlayers:function()
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
            var player = this.Players.GetOrAddPlayer(sender_name);
            if(player)
            {
               
                if(time_stamp != player.LastMessageTime)
                {
                    player.LastMessageTime = 0;
                }
                //if(time_stamp > player.LastMessageTime)
                //{
                //    player.LastMessageNumEntries = 0;
                //}
                var messages = chats[c].getElementsByClassName("oIy2qc");
                if(messages.length == player.LastMessageNumEntries)
                {
                    continue;
                }
                    
                if(this.CurrentRound != null)
                {
                    for(var m=player.LastMessageNumEntries; m<messages.length; ++m)
                    {
                        var message = messages[m].attributes["data-message-text"].value;

                        var valid = this.CurrentRound.AnswerMode.ProcessAnswer(player, message);
                        this.CurrentRound.ScoreMode.ProcessAnswerScore(player, valid, message);
                        //Check allowed list
                        // var valid = false;
                        // if(this.CurrentRound.WordList.length == 0)
                        // {
                        //     valid = true;
                        // }
                        // else
                        // {
                        //     for(var w=0; w<this.CurrentRound.WordList.length; ++w)
                        //     {
                        //         if(message.toLowerCase() == this.CurrentRound.WordList[w].toLowerCase())
                        //         {
                        //             valid = true;
                        //         }
                        //     }
                        // }
                        // if(valid)
                        // {
                        //     player.SetMessage(message);
                        //     if(this.CurrentRound.FirstValidAnswerPlayer == null)
                        //     {
                        //         this.CurrentRound.FirstValidAnswerPlayer = player;
                        //     }
                        // }

                        player.MessageHistory.push( { message:message, time_stamp:time_stamp, valid:valid} );

                        console.log(sender_name + " sent " + message + " at " + time_stamp + " valid:" + valid);
                    }
                }
                else
                {
                    console.log(" NO ACTIVE ROUND : Ignoring sender_name message");
                }
                player.LastMessageNumEntries = messages.length;
                player.LastMessageTime = time_stamp;
            }
        }
        return true;
    },
    MostAnswered:"",
    MostAnsweredCount:0,
    CalcMostAnswered:function()
    {
        var answer_counts = {};
        this.MostAnsweredCount = 0;
        this.MostAnswered = "";
        for(var i=0; i<this.Players.PlayerList.length;++i)
        {
            var player_message = this.Players.PlayerList[i].LastMessage;
            if(player_message != "")
            {
                if(answer_counts[player_message] == null)
                {
                    answer_counts[player_message] = 0;
                }
                answer_counts[player_message] += 1;
                if(answer_counts[player_message] > this.MostAnsweredCount)
                {
                    this.MostAnsweredCount = answer_counts[player_message];
                    this.MostAnswered = player_message;
                }
            }
        }
    }
};


// Page
var pre_game_inject = `
<div>
<style>
@import url('https://fonts.googleapis.com/css2?family=Asap+Condensed&display=swap');

#body {
    width: 100%;
    height: 100%;
    margin: 0px;
}
.overlay {    
    width: 100%;
    height: 100%;
    position: absolute;
    top:0px;
    left:0px;
    margin: 0px;
    padding: 0px;
    overflow: hidden;
    pointer-events: none;
    z-index: 1;
    flex-direction: column-reverse;
    flex-wrap: wrap-reverse;
    display: flex;
}

.overlay-current-mode
{
    z-index: 2000;
    width: 100%;
    text-align: center;
    background-color: white;
    font-size: 48px;
    font-family: 'Asap Condensed';
}

.overlay-players-container {
    display: flex;
    flex-direction: row;
    align-content: flex-end;
    flex-wrap: wrap;
}

.game {    
    width: 100%;
    height: 100%;
    position: absolute;
    top:0px;
    left:0px;
    margin: 0px;
    padding: 0px;
    pointer-events: none;
    z-index: 1;
}

.flex-container {
  flex:1;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-content: center;
  align-items: flex-start;
  align-content: flex-start;
}

.player-item {
    display: block;
    flex-grow: 0;
    flex-shrink: 1;
    flex-basis: auto;
    align-self: auto;
    order: 0;
    width: 64px;
    height: 80px;
}

.player-background {
    position: relative;
    height: 256px;
    top: -16px;
}
.player-not-answered {
    /* background-image: url("player_not_answered.png"); */
    background-image: url("data:image/svg+xml,%3Csvg width='64' height='256' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse fill='%23cccccc' stroke='%23000' cx='32' cy='18' id='svg_1' rx='16' ry='16'/%3E%3Cpath id='svg_2' d='m23.88163,31.87338c-6.26959,0.94044 -15.92324,2.05673 -19.85932,6.75893c-3.93608,4.70219 -5.19153,192.16148 -4.54376,219.23908c7.60974,1.65854 52.73399,1.97202 64.35354,0.2095c-0.64777,-17.04625 1.72736,-214.15796 -2.68216,-220.23243c-4.40952,-6.07447 -18.76536,-5.38329 -22.19283,-5.89189' opacity='NaN' stroke='%23000' fill='%23cccccc'/%3E%3C/g%3E%3C/svg%3E");
}

.player-answered {
    /* background-image: url("player_answered.png"); */
    background-image: url("data:image/svg+xml,%3Csvg width='64' height='256' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse fill='%2356ffaa' stroke='%23000' cx='32' cy='17.68652' id='svg_1' rx='16' ry='16'/%3E%3Cpath id='svg_2' d='m23.88163,31.87338c-6.26959,0.94044 -15.92324,2.05673 -19.85932,6.75893c-3.93608,4.70219 -5.19153,192.16148 -4.54376,219.23908c7.60974,1.65854 52.73399,1.97202 64.35354,0.2095c-0.64777,-17.04625 1.72736,-214.15796 -2.68216,-220.23243c-4.40952,-6.07447 -18.76536,-5.38329 -22.19283,-5.89189' opacity='NaN' stroke='%23000' fill='%2356ffaa'/%3E%3C/g%3E%3C/svg%3E");
}

.player-wait {
    /* background-image: url("player_wait.png"); */
    background-image: url("data:image/svg+xml,%3Csvg width='64' height='256' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse fill='%2356ffff' stroke='%23000' cx='32' cy='17.68652' id='svg_1' rx='16' ry='16'/%3E%3Cpath id='svg_2' d='m23.88163,31.87338c-6.26959,0.94044 -15.92324,2.05673 -19.85932,6.75893c-3.93608,4.70219 -5.19153,192.16148 -4.54376,219.23908c7.60974,1.65854 52.73399,1.97202 64.35354,0.2095c-0.64777,-17.04625 1.72736,-214.15796 -2.68216,-220.23243c-4.40952,-6.07447 -18.76536,-5.38329 -22.19283,-5.89189' opacity='NaN' stroke='%23000' fill='%2356ffff'/%3E%3C/g%3E%3C/svg%3E");
}
.player-name {
    font-family: 'Asap Condensed';
    font-weight: bold;
    top: 35px;
    position: relative;
    text-align: center;
    font-size: 12px;
    overflow-wrap: break-word;
    margin-left: 8px;
    margin-right: 8px;
    hyphens: manual;
    hyphenate-character: '-';
}

.player-msg {
    font-family:'Asap Condensed';
    top: 30px;
    position: relative;
    text-align: center;
}

.player-score {
    font-family: 'Asap Condensed';
    top: 10px;
    position: absolute;
    text-align: center;
    width: 100%;
}


.game-timer {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, 0px);
}

.game-timer-num {
    position: absolute;
    top: 50px;
    left: 50%;
    transform: translate(-50%, 0px);
    font-family: 'Asap Condensed';
    font-size: 50px;
    color: white;
    font-weight: bold;
}

.GDhqjd {
    font-weight: bold;
}

.oIy2qc {
    font-weight: normal;
}
</style>
</div>
`;


var post_game_inject = `
<div>
    <div class="overlay">
        <div class="overlay-current-mode" id="overlay_answer_mode">Answer</div>
        <div class="overlay-players-container">
            <div class="flex-container" id="players">
                <!-- <div class="flex-items"><div class="player-name">Bob F</div></div> -->
            </div>
        </div>
    </div>
    <div class="game-control">
        <h1>Game Control</h1>
        <div id="game_controls">
            Loading
        </div>
    </div>
</div>
`;

const lerpColor = function(pFrom, pTo, pRatio) {
    const ar = (pFrom & 0xFF0000) >> 16,
          ag = (pFrom & 0x00FF00) >> 8,
          ab = (pFrom & 0x0000FF),

          br = (pTo & 0xFF0000) >> 16,
          bg = (pTo & 0x00FF00) >> 8,
          bb = (pTo & 0x0000FF),

          rr = ar + pRatio * (br - ar),
          rg = ag + pRatio * (bg - ag),
          rb = ab + pRatio * (bb - ab);

    //return (rr << 16) + (rg << 8) + (rb | 0);
    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
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
        if(ReadyToStart())
        {
            var game_to_play = GetGameToPlay();
            var pre_game_inject_div = createElementFromHTML(pre_game_inject);
            document.getElementsByTagName("body")[0].appendChild(pre_game_inject_div);

            var game_inject = game_to_play.GetHTMLToInject();
            var game_inject_div = createElementFromHTML(game_inject);
            document.getElementsByTagName("body")[0].appendChild(game_inject_div);

            var post_game_inject_div = createElementFromHTML(post_game_inject);
            document.getElementsByTagName("body")[0].appendChild(post_game_inject_div);

            ChatGame.StartGame(
                game_to_play
            );
            
            setInterval(
                function()
                {
                    var dt = 100 / 1000.0;
                    ChatGame.UpdateGame(dt);
                },
                100
            );

            clearInterval(setup);
        }
    },
    1000
);















