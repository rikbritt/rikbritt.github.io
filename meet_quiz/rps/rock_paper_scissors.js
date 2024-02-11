var gWinWidth = window.innerWidth;
var gWinHeight = window.innerHeight;
var gVW = 480;
var gVH = 270;

var RockPaperScissors = 
{
    States:
    {
        Intro:0,
        Tutorial:1,
        //StartVoting:2,
        Voting:3,
        RoundOver:4,
        OpponentCount:5,
        ShowMoves:6,
        OpponentKO:7,
        PlayerKO:8
    },
    Words:
    {
        Rock:"r",
        Paper:"p",
        Scissors:"s"
    },
    State:0,
    TimeInState:0,
    OpponentHealth:4,
    PlayerHealth:4,
    OpponentMove:"",
    ForceOpponentMove:"",
    ForcePlayerMove:"",

    //   ######  ######## ########  ######  ########    ###    ######## ######## 
    //  ##    ## ##          ##    ##    ##    ##      ## ##      ##    ##       
    //  ##       ##          ##    ##          ##     ##   ##     ##    ##       
    //   ######  ######      ##     ######     ##    ##     ##    ##    ######   
    //        ## ##          ##          ##    ##    #########    ##    ##       
    //  ##    ## ##          ##    ##    ##    ##    ##     ##    ##    ##       
    //   ######  ########    ##     ######     ##    ##     ##    ##    ######## 
    SetState:function(s)
    {
        this.State=s;
        this.TimeInState = 0;
        this.SubState = 0;
        this.Continue = false;
        this.Instructions = "";

        this.SetSceneDefaultVisibility();
        this.ShowOpponentDefaultVisibility();
        this.StopStateBasedTimeouts();
        
        switch(this.State)
        {
            //  #### ##    ## ######## ########   #######  
            //   ##  ###   ##    ##    ##     ## ##     ## 
            //   ##  ####  ##    ##    ##     ## ##     ## 
            //   ##  ## ## ##    ##    ########  ##     ## 
            //   ##  ##  ####    ##    ##   ##   ##     ## 
            //   ##  ##   ###    ##    ##    ##  ##     ## 
            //  #### ##    ##    ##    ##     ##  #######  

            case this.States.Intro:
            {
                ChatGame.AbortRound();
                this.Instructions = "Welcome folks to the game.";

                HideSprite(this.Sprites.opponent_body);
                HideSprite(this.Sprites.health_bar_back);
                //ShowSprite(this.Sprites.announcer);

                ShowSprite(this.Sprites.game_title);
                MoveFromTo(this.Sprites.game_title, {x:0, y:-200}, {x:0, y:0}, 50,
                    function() { 
                        MakeLoopingTween(this.Sprites.game_title, 'linear', 30, {y:-5}, {y:5} );
            
                        ShowSprite(this.Sprites.hand_down_vfx_l);
                        ShowSprite(this.Sprites.hand_down_vfx_r);
                        StartAnimSpriteReel(this.Sprites.hand_down_vfx_r, "hand_down_vfx_r_play", 1);
                        StartAnimSpriteReel(this.Sprites.hand_down_vfx_l, "hand_down_vfx_l_play", 1);

                        this.StartStateBoundTimeout(
                            function(){
                            }.bind(this),
                            1000
                        );
            
                    }.bind(this)
                );
                break;
            }

            //  ######## ##     ## ########  #######  ########  ####    ###    ##       
            //     ##    ##     ##    ##    ##     ## ##     ##  ##    ## ##   ##       
            //     ##    ##     ##    ##    ##     ## ##     ##  ##   ##   ##  ##       
            //     ##    ##     ##    ##    ##     ## ########   ##  ##     ## ##       
            //     ##    ##     ##    ##    ##     ## ##   ##    ##  ######### ##       
            //     ##    ##     ##    ##    ##     ## ##    ##   ##  ##     ## ##       
            //     ##     #######     ##     #######  ##     ## #### ##     ## ######## 

            case this.States.Tutorial:
            {
                this.Instructions = 'Explain how the game works';
                HideSprite(this.Sprites.opponent_body);
                HideSprite(this.Sprites.health_bar_back);
                //ShowSprite(this.Sprites.msg_lets_do_this);
                //ShowSprite(this.Sprites.announcer);
                ShowSprite(this.Sprites.instructions);
                MoveFromTo(this.Sprites.instructions, {x:400, y:0}, {x:0, y:0}, 40);

                this.ShowVotingChoices();
                this.Anim_ShowVotingChoices();
                break;
            }
            
            //  ##     ##  #######  ######## #### ##    ##  ######   
            //  ##     ## ##     ##    ##     ##  ###   ## ##    ##  
            //  ##     ## ##     ##    ##     ##  ####  ## ##        
            //  ##     ## ##     ##    ##     ##  ## ## ## ##   #### 
            //   ##   ##  ##     ##    ##     ##  ##  #### ##    ##  
            //    ## ##   ##     ##    ##     ##  ##   ### ##    ##  
            //     ###     #######     ##    #### ##    ##  ######   

            case this.States.Voting:
            {
                this.ShowVotingChoices();
                ShowSprite(this.Sprites.get_ready_to_vote);
                StartAnimSpriteReel(this.Sprites.numbers, "nums", -1)
                this.Sprites.numbers.pauseAnimation();
                this.Anim_ShowVotingChoices(
                    function() {
                        HideSprite(this.Sprites.get_ready_to_vote);
                        //ShowSprite(this.Sprites.vote_now);
                        ShowSprite(this.Sprites.msg_vote_now);
                        
                        ShowSprite(this.Sprites.numbers);
                        
                        ChatGame.StartRound(
                            4,
                            ChatGame.AnswerModes.MultipleChoice,
                            ChatGame.ScoreModes.FirstRightAnswer,
                            ["r", "p", "s"],
                            true //wipe previous messages
                        );
                    }.bind(this)
                );


                //this.ShowVotingChoices();
                //ShowSprite(this.Sprites.msg_vote_now);
                //StopFlashing(this.Sprites.choice_rock_highlight);
                //StopFlashing(this.Sprites.choice_paper_highlight);
                //StopFlashing(this.Sprites.choice_scissors_highlight);

                //document.getElementById("most_answered").innerHTML = "";
                //document.getElementById("enemy_answered").innerHTML = "";
                //document.getElementById("result").innerHTML = "";

                break;
            }

            //  ########   #######  ##     ## ##    ## ########        #######  ##     ## ######## ########  
            //  ##     ## ##     ## ##     ## ###   ## ##     ##      ##     ## ##     ## ##       ##     ## 
            //  ##     ## ##     ## ##     ## ####  ## ##     ##      ##     ## ##     ## ##       ##     ## 
            //  ########  ##     ## ##     ## ## ## ## ##     ##      ##     ## ##     ## ######   ########  
            //  ##   ##   ##     ## ##     ## ##  #### ##     ##      ##     ##  ##   ##  ##       ##   ##   
            //  ##    ##  ##     ## ##     ## ##   ### ##     ##      ##     ##   ## ##   ##       ##    ##  
            //  ##     ##  #######   #######  ##    ## ########        #######     ###    ######## ##     ## 

            case this.States.RoundOver:
            {
                this.ShowVotingChoices();
                this.Anim_HideVotingChoices();
                ShowSprite(this.Sprites.msg_vote_over);
                setTimeout(
                    function()
                    {
                        this.SetState(this.States.OpponentCount);
                        // HideSprite(this.Sprites.msg_vote_over);
                        // var round_answers = ChatGame.GetRoundAnswers();
                
                        // if(this.Sprites.rock_vote_count)
                        // {
                        //     this.Sprites.rock_vote_count.destroy();
                        // }
                        // if(this.Sprites.paper_vote_count)
                        // {
                        //     this.Sprites.paper_vote_count.destroy();
                        // }
                        // if(this.Sprites.scissors_vote_count)
                        // {
                        //     this.Sprites.scissors_vote_count.destroy();
                        // }
        
                        // this.Sprites.rock_vote_count = MakeNumberSprite(round_answers.AnswerCounts[this.Words.Rock]);
                        // this.Sprites.rock_vote_count.attr({x:this.Sprites.choice_rock_highlight.x, y:this.Sprites.choice_rock_highlight.y});
                        // this.Sprites.paper_vote_count = MakeNumberSprite(round_answers.AnswerCounts[this.Words.Paper]);
                        // this.Sprites.paper_vote_count.attr({x:this.Sprites.choice_paper_highlight.x, y:this.Sprites.choice_paper_highlight.y});
                        // this.Sprites.scissors_vote_count = MakeNumberSprite(round_answers.AnswerCounts[this.Words.Scissors]);
                        // this.Sprites.scissors_vote_count.attr({x:this.Sprites.choice_scissors_highlight.x, y:this.Sprites.choice_scissors_highlight.y});
        
                    }.bind(this),
                    1000
                );
                //if(round_answers.MostAnswered == this.Words.Rock)
                //{
                //    MakeItFlash(this.Sprites.choice_rock_highlight);
                //}
                //else if(round_answers.MostAnswered == this.Words.Paper)
                //{
                //    MakeItFlash(this.Sprites.choice_paper_highlight);
                //}
                //else if(round_answers.MostAnswered == this.Words.Scissors)
                //{
                //    MakeItFlash(this.Sprites.choice_scissors_highlight);
                //}
                break;
            }
            case this.States.OpponentCount:
            {
                HideSprite(this.Sprites.opponent_l_arm);
                HideSprite(this.Sprites.opponent_r_arm);
                ShowSprite(this.Sprites.opponent_count);
                
                AnimateSpriteArrayFrames(
                    this.Sprites.opponent_count, 
                    150,
                     [0,1,2,3,4,5,5,4,3,3,4,5,5,4,3,3,4,5,5,4,3,3,4,5],
                    function() {
                        ShowSprite(this.Sprites.hand_down_vfx_l);
                        ShowSprite(this.Sprites.hand_down_vfx_r);
                        StartAnimSpriteReel(this.Sprites.hand_down_vfx_r, "hand_down_vfx_r_play", 1);
                        StartAnimSpriteReel(this.Sprites.hand_down_vfx_l, "hand_down_vfx_l_play", 1);
                        var choices = [this.Words.Rock, this.Words.Paper, this.Words.Scissors]; 
                        this.OpponentMove = choices[getRandomInt(3)]; //not inclusive of 3
                        this.SetState(this.States.ShowMoves);
                    }.bind(this)
                );
                //AnimateSpriteArray(this.Sprites.opponent_count, 150);

                break;
            }

            //   ######  ##     ##  #######  ##      ##      ##     ##  #######  ##     ## ########  ######  
            //  ##    ## ##     ## ##     ## ##  ##  ##      ###   ### ##     ## ##     ## ##       ##    ## 
            //  ##       ##     ## ##     ## ##  ##  ##      #### #### ##     ## ##     ## ##       ##       
            //   ######  ######### ##     ## ##  ##  ##      ## ### ## ##     ## ##     ## ######    ######  
            //        ## ##     ## ##     ## ##  ##  ##      ##     ## ##     ##  ##   ##  ##             ## 
            //  ##    ## ##     ## ##     ## ##  ##  ##      ##     ## ##     ##   ## ##   ##       ##    ## 
            //   ######  ##     ##  #######   ###  ###       ##     ##  #######     ###    ########  ######  

            case this.States.ShowMoves:
            {
                HideSprite(this.Sprites.opponent_l_arm);
                HideSprite(this.Sprites.opponent_r_arm);
                ShowSprite(this.Sprites.opponent_r_hand_receive_1);
                HideSprite(this.Sprites.opponent_head);
                ShowSprite(this.Sprites.opponent_head_react);
                ShowSprite(this.Sprites.hand_down_vfx_l);
                ShowSprite(this.Sprites.hand_down_vfx_r);

                if(this.ForceOpponentMove != "")
                {
                    this.OpponentMove = this.ForceOpponentMove;
                }

                var opponent_hand_sprite;
                if(this.OpponentMove == this.Words.Rock)
                {
                    opponent_hand_sprite = this.Sprites.opponent_big_rock;
                }
                else if(this.OpponentMove == this.Words.Paper)
                {
                    opponent_hand_sprite = this.Sprites.opponent_big_paper;
                }
                else if(this.OpponentMove == this.Words.Scissors)
                {
                    opponent_hand_sprite = this.Sprites.opponent_big_scissors;
                }
                ShowSprite(opponent_hand_sprite);


                var round_answers = ChatGame.GetRoundAnswers();
                var player_hand_sprite;
                if(round_answers.MostAnswered == "")
                {
                    round_answers.MostAnswered = "p"; //fallback
                }
                if(round_answers.MostAnswered == this.Words.Rock)
                {
                    player_hand_sprite = this.Sprites.player_rock;
                }
                else if(round_answers.MostAnswered == this.Words.Paper)
                {
                    player_hand_sprite = this.Sprites.player_paper;
                }
                else if(round_answers.MostAnswered == this.Words.Scissors)
                {
                    player_hand_sprite = this.Sprites.player_scissors;
                }

                ShowSprite(player_hand_sprite);
                MoveFromTo(player_hand_sprite, {rotation:30, x:500, y:300}, {x:300, y:320, rotation:0}, 20);

                var player_won = false;
                var opponent_won = false;
                if( (round_answers.MostAnswered == this.Words.Rock && this.OpponentMove == this.Words.Scissors)
                    || (round_answers.MostAnswered == this.Words.Paper && this.OpponentMove == this.Words.Rock)
                    || (round_answers.MostAnswered == this.Words.Scissors && this.OpponentMove == this.Words.Paper) )
                {
                    player_won = true;
                    this.OpponentHealth -= 1;
                }
                else if( (this.OpponentMove == this.Words.Rock && round_answers.MostAnswered == this.Words.Scissors)
                    || (this.OpponentMove == this.Words.Paper && round_answers.MostAnswered == this.Words.Rock)
                    || (this.OpponentMove == this.Words.Scissors && round_answers.MostAnswered == this.Words.Paper) )
                {
                    opponent_won = true;
                    this.PlayerHealth -= 1;
                }

                if(player_won)
                {
                    HideSprite(this.Sprites.opponent_head);
                    HideSprite(this.Sprites.opponent_head_react);
                    HideSprite(this.Sprites.opponent_head_laugh);
                    ShowSprite(this.Sprites.opponent_head_pain);
                }
                else if(opponent_won)
                {
                    HideSprite(this.Sprites.opponent_head);
                    HideSprite(this.Sprites.opponent_head_react);
                    HideSprite(this.Sprites.opponent_head_laugh);
                    ShowSprite(this.Sprites.opponent_head_grin);
                    this.StartStateBoundTimeout(
                        function() {
                            HideSprite(this.Sprites.opponent_head_grin);
                            ShowSprite(this.Sprites.opponent_head_laugh);
                        }.bind(this),
                        1000
                    );
                }
                else
                {
                    //tie
                }
                this.StartStateBoundTimeout(
                    function() {
                        if(player_won)
                        {
                            ShowSprite(this.Sprites.player_won);
                        }
                        else if(opponent_won)
                        {
                            ShowSprite(this.Sprites.opponent_won);
                        }
                        else
                        {
                            ShowSprite(this.Sprites.tie);
                        }

                        MoveTo(player_hand_sprite, {x:100, y:500, rotation:-20}, 50);
                        MoveToRelative(opponent_hand_sprite, {x: 0, y:20, rotation:25}, 50);
                        this.StartStateBoundTimeout(
                            function() {
                                this.SetState(this.States.Voting);
                            }.bind(this),
                            1000
                        );
                    }.bind(this),
                    1000
                );
                break;
            }

            //   #######  ########  ########       ##     ##  #######  
            //  ##     ## ##     ## ##     ##      ##    ##  ##     ## 
            //  ##     ## ##     ## ##     ##      ##   ##   ##     ## 
            //  ##     ## ########  ########       #####     ##     ## 
            //  ##     ## ##        ##             ##   ##   ##     ## 
            //  ##     ## ##        ##             ##    ##  ##     ## 
            //   #######  ##        ##             ##     ##  #######  

            case this.States.OpponentKO:
            {
                HideSprite(this.Sprites.opponent_body);
                ShowSprite(this.Sprites.opponent_ko_1);
                MoveFromTo(this.Sprites.opponent_ko_1, {x:350, y:150, rotation:0}, {x:380, y:125}, 20,
                    function()
                    {
                        MoveTo(this.Sprites.opponent_ko_1, {x:420, y:250, rotation:45}, 20,
                            function()
                            {
                                MoveTo(this.Sprites.opponent_ko_1, {x:425, y:260, rotation:55}, 5);
                                ShowSprite(this.Sprites.hand_down_vfx_l);
                                //ShowSprite(this.Sprites.hand_down_vfx_r);
                                //this.Sprites.hand_down_vfx_r.attr({x:275 + 95, y:0 + 120});
                                this.Sprites.hand_down_vfx_l.attr({x:220 + 95, y:256 + 120, rotation:180});
                                //StartAnimSpriteReel(this.Sprites.hand_down_vfx_r, "hand_down_vfx_r_play", 1);
                                StartAnimSpriteReel(this.Sprites.hand_down_vfx_l, "hand_down_vfx_l_play", 1);

                            }.bind(this)
                        );
                    }.bind(this)
                );
                break;
            }

            //  ########  ##          ###    ##    ## ######## ########       ##     ##  #######  
            //  ##     ## ##         ## ##    ##  ##  ##       ##     ##      ##    ##  ##     ## 
            //  ##     ## ##        ##   ##    ####   ##       ##     ##      ##   ##   ##     ## 
            //  ########  ##       ##     ##    ##    ######   ########       #####     ##     ## 
            //  ##        ##       #########    ##    ##       ##   ##        ##   ##   ##     ## 
            //  ##        ##       ##     ##    ##    ##       ##    ##       ##    ##  ##     ## 
            //  ##        ######## ##     ##    ##    ######## ##     ##      ##     ##  #######  

            case this.States.PlayerKO:
            {
                HideSprite(this.Sprites.opponent_mouth);
                ShowSprite(this.Sprites.opponent_mouth_smile);
                ShowSprite(this.Sprites.opponent_win_arms);
                HideSprite(this.Sprites.opponent_l_arm);
                HideSprite(this.Sprites.opponent_r_arm);
                break;
            }
        }
    },
    
    //  ##     ## ########  ########     ###    ######## ######## 
    //  ##     ## ##     ## ##     ##   ## ##      ##    ##       
    //  ##     ## ##     ## ##     ##  ##   ##     ##    ##       
    //  ##     ## ########  ##     ## ##     ##    ##    ######   
    //  ##     ## ##        ##     ## #########    ##    ##       
    //  ##     ## ##        ##     ## ##     ##    ##    ##       
    //   #######  ##        ########  ##     ##    ##    ######## 

    UpdateGame:function(dt)
    {
        this.TimeInState += dt;
        if(this.Sprites.health_left)
        {
            this.Sprites.health_left.reelPosition(this.PlayerHealth);
            this.Sprites.health_right.reelPosition(this.OpponentHealth);
        }
        switch(this.State)
        {
            case this.States.Intro:
            {
                //Intro anim changes to voting state itself
                if(this.Continue)
                {                    
                    StopLoopingTween(this.Sprites.game_title);
                    MoveTo(this.Sprites.game_title, {x:0, y:-200}, 50, 
                        function() { 
                            this.SetState(this.States.Tutorial);
                        }.bind(this)
                    );
                }
                break;
            }
            //  ######## ##     ## ########  #######  ########  ####    ###    ##       
            //     ##    ##     ##    ##    ##     ## ##     ##  ##    ## ##   ##       
            //     ##    ##     ##    ##    ##     ## ##     ##  ##   ##   ##  ##       
            //     ##    ##     ##    ##    ##     ## ########   ##  ##     ## ##       
            //     ##    ##     ##    ##    ##     ## ##   ##    ##  ######### ##       
            //     ##    ##     ##    ##    ##     ## ##    ##   ##  ##     ## ##       
            //     ##     #######     ##     #######  ##     ## #### ##     ## ######## 

            case this.States.Tutorial:
            {
                if(this.Continue)
                {
                    if(this.SubState == 1) {
                        this.Instructions = 'Welcome the opponent!';
                        this.Anim_HideVotingChoices();
                        MoveTo(this.Sprites.instructions, {x:400, y:0}, 25, null);
                        this.Anim_OpponentEnter( function() {
                            ShowSprite(this.Sprites.instructions_opponent);
                            MoveFromTo(this.Sprites.instructions_opponent, {x:400, y:0}, {x:0, y:0}, 25);

                            ShowSprite(this.Sprites.health_bar_back);
                            MoveFromTo(this.Sprites.health_bar_back, {x:0, y:-100}, {x:0, y:0}, 25);
                        }.bind(this));
                    }
                    else if(this.SubState == 2)
                    {
                        MoveTo(this.Sprites.instructions_opponent, {x:-400, y:0}, 25,
                            function()
                            {
                                this.SetState(this.States.Voting);
                            }.bind(this)
                        );
                    }
                }
                break;
            }
            case this.States.Voting:
            {
                var time_left = Math.floor(ChatGame.TimeLeftInRound) + 1;
                this.Sprites.numbers.reelPosition(time_left);
                //ChatGame.TimeLeftInRound.toFixed(1);
                break;
            }
            case this.States.RoundOver:
            {
                if(this.TimeInState > 4)
                {
                    this.SetState(this.States.Voting);
                }
                break;
            }
        };
        
        this.Continue = false;
    },
    OnRoundEnd:function(round)
    {
        this.SetState(this.States.RoundOver);
    },
    NextTimeoutId:0,
    StateTimeouts:{},
    StopStateBasedTimeouts:function()
    {
        for([key, value] of Object.entries(this.StateTimeouts))
        {
            clearTimeout(value);
        }
        this.StateTimeouts = {};
    },
    RemoveStateBasedTimeout:function(i)
    {
        if(this.StateTimeouts[i] != null)
        {
            delete this.StateTimeouts[i];
        }
    },
    StartStateBoundTimeout:function(f, time)
    {
        var timeout_id = this.NextTimeoutId;
        this.NextTimeoutId += 1;

        var i = setTimeout(
            function()
            {
                this.RemoveStateBasedTimeout(timeout_id);
                f();
            }.bind(this), 
            time
        );
        this.StateTimeouts[timeout_id] = i;
    },
    Sprites:{},
    StartGame:function()
    {
        Crafty.init(gVW, gVH, document.getElementById("crafty_game"));
        var scale = 2.0;
        var stageStyle = Crafty.stage.elem.style;
            stageStyle.transformOrigin = stageStyle.webkitTransformOrigin = stageStyle.mozTransformOrigin = "50% 0";
            stageStyle.transform = stageStyle.webkitTransform = stageStyle.mozTransform = "scale(" + scale + ")";

            //https://github.com/talitapagani/craftytweener/tree/master
        Crafty.background('#FFFFFF');

        //  ##        #######     ###    ########   
        //  ##       ##     ##   ## ##   ##     ##  
        //  ##       ##     ##  ##   ##  ##     ##  
        //  ##       ##     ## ##     ## ##     ##  
        //  ##       ##     ## ######### ##     ##  
        //  ##       ##     ## ##     ## ##     ##  
        //  ########  #######  ##     ## ########  
        //  
        //   ######  ########  ########  #### ######## ########  ######  
        //  ##    ## ##     ## ##     ##  ##     ##    ##       ##    ## 
        //  ##       ##     ## ##     ##  ##     ##    ##       ##       
        //   ######  ########  ########   ##     ##    ######    ######  
        //        ## ##        ##   ##    ##     ##    ##             ## 
        //  ##    ## ##        ##    ##   ##     ##    ##       ##    ## 
        //   ######  ##        ##     ## ####    ##    ########  ######  

        Crafty.load(
            {
                "images":[
                    "title.png",
                    "num_0.png",
                    "num_1.png",
                    "num_2.png",
                    "num_3.png",
                    "num_4.png",
                    "num_5.png",
                    "num_6.png",
                    "num_7.png",
                    "num_8.png",
                    "num_9.png",
                    "announcer.png",
                    "opponent_head.png",
                    "opponent_head_react.png",
                    "opponent_head_grin.png",
                    "opponent_head_pain.png",
                    "opponent_mouth.png",
                    "opponent_mouth_smile.png",
                    "opponent_body.png",
                    "opponent_hips.png",
                    "opponent_win_arms.png",
                    "opponent_l_arm.png",
                    "opponent_r_arm.png",
                    "opponent_l_hand_rest.png",
                    "opponent_r_hand_receive_1.png",
                    "opponent_r_hand_rest.png",
                    "opponent_l_leg.png",
                    "opponent_r_leg.png",
                    "opponent_big_rock.png",
                    "opponent_big_paper.png",
                    "opponent_big_scissors.png",
                    "opponent_count_1.png",
                    "opponent_count_2.png",
                    "opponent_count_3.png",
                    "opponent_count_4.png",
                    "opponent_count_5.png",
                    "opponent_count_6.png",
                    "opponent_ko_1.png",
                    "choice_scissors.png",
                    "choice_scissors_highlight.png",
                    "choice_scissors_name.png",
                    "choice_paper.png",
                    "choice_paper_highlight.png",
                    "choice_paper_name.png",
                    "choice_rock.png",
                    "choice_rock_highlight.png",
                    "choice_rock_name.png",
                    "msg_vote_now.png",
                    "msg_vote_over.png",
                    "msg_lets_do_this.png",
                    "player_rock.png",
                    "player_paper.png",
                    "player_scissors.png",
                    "scene1bg.png",
                    "scene1bg_light1.png",
                    "scene1bg_light2.png",
                    "scene1bg_flash1.png",
                    "scene1bg_flash2.png",
                    "scene1bg_flash3.png",
                    "scene1bg_flash4.png",
                    "instructions.png",
                    "instructions_opponent.png",
                    "get_ready_to_vote.png",
                    "opponent_won.png",
                    "player_won.png",
                    "tie.png",
                    "vote_now.png",
                    "health_bar_back.png"
                ],
                "sprites":{
                    "vfx_1.png":{
                        tile:256,
                        tileh:256,
                        map: { vfx_1:[0,0] }
                    },
                    "numbers.png":{
                        tile:42,
                        tileh:64,
                        map: { numbers:[0,0] }
                    },
                    "opponent_head_laugh.png":{
                        tile:91,
                        tileh:105,
                        map: { opponent_head_laugh:[0,0] }
                    },
                    "health_left.png":{
                        tile:480,
                        tileh:48,
                        map: { health_left:[0,0] }
                    },
                    "health_right.png":{
                        tile:480,
                        tileh:48,
                        map: { health_right:[0,0] }
                    }
                }
            },
            function()
            {
                this.CreateAllSprites();

                // * * * * INITIAL GAME STATE IS SET HERE! * * * * 
                this.SetState(this.States.Intro);
                //this.SetState(this.States.OpponentDoRock);
            }.bind(this)
        );
    },
    SetSceneDefaultVisibility:function()
    {
        HideSprite(this.Sprites.game_title);
        HideSprite(this.Sprites.choice_scissors);
        HideSprite(this.Sprites.choice_paper);
        HideSprite(this.Sprites.choice_rock);
        HideSprite(this.Sprites.choice_scissors_name);
        HideSprite(this.Sprites.choice_paper_name);
        HideSprite(this.Sprites.choice_rock_name);
        HideSprite(this.Sprites.get_ready_to_vote);
        HideSprite(this.Sprites.vote_now);
        HideSprite(this.Sprites.msg_vote_now);
        HideSprite(this.Sprites.msg_vote_over);
        HideSprite(this.Sprites.hand_down_vfx_l);
        HideSprite(this.Sprites.hand_down_vfx_r);
        this.Sprites.hand_down_vfx_r.attr({x:275, y:0});
        this.Sprites.hand_down_vfx_l.attr({x:220, y:256, rotation:180});
        HideSprite(this.Sprites.msg_lets_do_this);
        HideSprite(this.Sprites.choice_scissors_highlight);
        HideSprite(this.Sprites.choice_paper_highlight);
        HideSprite(this.Sprites.choice_rock_highlight);
        HideSprite(this.Sprites.player_rock);
        HideSprite(this.Sprites.player_paper);
        HideSprite(this.Sprites.player_scissors);
        HideSprite(this.Sprites.numbers);
        HideSprite(this.Sprites.instructions);
        HideSprite(this.Sprites.instructions_opponent);
        HideSprite(this.Sprites.player_won);
        HideSprite(this.Sprites.opponent_won);
        HideSprite(this.Sprites.tie);
        ShowSprite(this.Sprites.health_bar_back);
        //HideSprite(this.Sprites.announcer);
    },
    ShowOpponentDefaultVisibility:function()
    {
        this.Sprites.opponent_body.attr(this.OpponentFightPos);
        this.Sprites.opponent_big_rock.attr(this.Sprites.opponent_big_rock.DefaultPos);
        this.Sprites.opponent_big_paper.attr(this.Sprites.opponent_big_paper.DefaultPos);
        this.Sprites.opponent_big_scissors.attr(this.Sprites.opponent_big_scissors.DefaultPos);
        ShowSprite(this.Sprites.opponent_body); //Makes children visible
        HideSprite(this.Sprites.opponent_head_react);
        HideSprite(this.Sprites.opponent_head_grin);
        HideSprite(this.Sprites.opponent_head_laugh);
        HideSprite(this.Sprites.opponent_head_pain);
        HideSprite(this.Sprites.opponent_mouth_smile);
        ShowSprite(this.Sprites.opponent_l_arm);
        ShowSprite(this.Sprites.opponent_r_arm);
        HideSprite(this.Sprites.opponent_win_arms);
        HideSprite(this.Sprites.opponent_r_hand_receive_1);
        HideSprite(this.Sprites.opponent_big_rock);
        HideSprite(this.Sprites.opponent_big_paper);
        HideSprite(this.Sprites.opponent_big_scissors);
        StopAnimateSpriteArray(this.Sprites.opponent_count);
        HideSprite(this.Sprites.opponent_count);
        HideSprite(this.Sprites.opponent_ko_1);        
    },
    ShowVotingChoices:function()
    {
        ShowSprite(this.Sprites.choice_scissors);
        HideSprite(this.Sprites.choice_scissors_highlight);
        ShowSprite(this.Sprites.choice_paper);
        HideSprite(this.Sprites.choice_paper_highlight);
        ShowSprite(this.Sprites.choice_rock);
        HideSprite(this.Sprites.choice_rock_highlight);
        
        ShowSprite(this.Sprites.choice_scissors_name);
        ShowSprite(this.Sprites.choice_paper_name);
        ShowSprite(this.Sprites.choice_rock_name);
    },
    Anim_ShowVotingChoices:function(cb)
    {
        MoveFromTo(this.Sprites.choice_rock, {x:30, y:-200}, {x:64, y:45}, 70, function() { 
                MakeItWobble(this.Sprites.choice_rock); }.bind(this) );
        MoveFromTo(this.Sprites.choice_rock_name, {x:30, y:-200}, {x:64, y:75}, 70, function() { 
                MakeItWobble(this.Sprites.choice_rock_name); }.bind(this) );

        MoveFromTo(this.Sprites.choice_paper, {x:-100, y:128}, {x:64, y:128}, 70, function() { 
            MakeItWobble(this.Sprites.choice_paper); }.bind(this) );
        MoveFromTo(this.Sprites.choice_paper_name, {x:-100, y:128}, {x:64, y:155}, 70, function() { 
                MakeItWobble(this.Sprites.choice_paper_name); }.bind(this) );

        MoveFromTo(this.Sprites.choice_scissors, {x:30, y:400}, {x:64, y:218}, 70, function() {
                MakeItWobble(this.Sprites.choice_scissors); }.bind(this) );
        MoveFromTo(this.Sprites.choice_scissors_name, {x:30, y:400}, {x:64, y:250}, 70,
            function() { 
                MakeItWobble(this.Sprites.choice_scissors_name);
                if(cb)
                {
                    cb();
                }
            }.bind(this)
        );
    },
    Anim_HideVotingChoices:function()
    {
        MoveTo(this.Sprites.choice_rock, {x:30, y:-200}, 70 );
        MoveTo(this.Sprites.choice_rock_name, {x:30, y:-200}, 70 );

        MoveTo(this.Sprites.choice_paper, {x:-100, y:128}, 70 );
        MoveTo(this.Sprites.choice_paper_name, {x:-100, y:128}, 70);

        MoveTo(this.Sprites.choice_scissors, {x:30, y:400}, 70 );
        MoveTo(this.Sprites.choice_scissors_name, {x:30, y:400}, 70 );
    },
    Anim_OpponentEnter:function(cb = null)
    {
        this.ShowOpponentDefaultVisibility();
        this.Sprites.opponent_body.attr({x:600, y:200});

        //Move from side to centre
        MoveFromTo(this.Sprites.opponent_body, {x:600, y:200}, this.OpponentFightPos, 70, cb);
    },

    //   ######  ######## ######## ##     ## ########   
    //  ##    ## ##          ##    ##     ## ##     ##  
    //  ##       ##          ##    ##     ## ##     ##  
    //   ######  ######      ##    ##     ## ########   
    //        ## ##          ##    ##     ## ##         
    //  ##    ## ##          ##    ##     ## ##         
    //   ######  ########    ##     #######  ##        
    //  
    //   ######  ########  ########  #### ######## ########  ######  
    //  ##    ## ##     ## ##     ##  ##     ##    ##       ##    ## 
    //  ##       ##     ## ##     ##  ##     ##    ##       ##       
    //   ######  ########  ########   ##     ##    ######    ######  
    //        ## ##        ##   ##    ##     ##    ##             ## 
    //  ##    ## ##        ##    ##   ##     ##    ##       ##    ## 
    //   ######  ##        ##     ## ####    ##    ########  ######  

    OpponentFightPos:{x:325, y:180},
    CreateAllSprites:function()
    {

        //https://github.com/talitapagani/craftytweener
        //480 / 270
        this.Sprites.intro_bg = Crafty.e('2D, DOM, Image').image("scene1bg.png");
        this.Sprites.instructions = MakeSpriteWithOrigin("instructions.png", 0, 0);
        this.Sprites.bg_flash_1 = Crafty.e('2D, DOM, Image').image("scene1bg_flash1.png");
        setInterval(function() {
            this.Sprites.bg_flash_1.visible = true;
            setTimeout(function() { this.Sprites.bg_flash_1.visible = false; }.bind(this), 100);
        }.bind(this), 934);
        this.Sprites.bg_flash_2 = Crafty.e('2D, DOM, Image').image("scene1bg_flash2.png");
        setInterval(function() {
            this.Sprites.bg_flash_2.visible = true;
            setTimeout(function() { this.Sprites.bg_flash_2.visible = false; }.bind(this), 120);
        }.bind(this), 1734);
        this.Sprites.bg_flash_3 = Crafty.e('2D, DOM, Image').image("scene1bg_flash3.png");
        setInterval(function() {
            this.Sprites.bg_flash_3.visible = true;
            setTimeout(function() { this.Sprites.bg_flash_3.visible = false; }.bind(this), 120);
        }.bind(this), 1434);
        this.Sprites.bg_flash_4 = Crafty.e('2D, DOM, Image').image("scene1bg_flash4.png");
        setInterval(function() {
            this.Sprites.bg_flash_4.visible = true;
            setTimeout(function() { this.Sprites.bg_flash_4.visible = false; }.bind(this), 110);
        }.bind(this), 1234);
        
        this.Sprites.health_bar_back = MakeSpriteWithOrigin("health_bar_back.png", 0, 0);
        this.Sprites.health_left = MakeAnimSprite("health_left");
        AddAnimSpriteReel(this.Sprites.health_left, "health_left", 500, [[0,0], [0,1], [0,2], [0,3], [0,4]]);
        StartAnimSpriteReel(this.Sprites.health_left, "health_left", -1);
        this.Sprites.health_left.pauseAnimation();
        this.Sprites.health_right = MakeAnimSprite("health_right");
        AddAnimSpriteReel(this.Sprites.health_right, "health_right", 500, [[0,0], [0,1], [0,2], [0,3], [0,4]]);
        StartAnimSpriteReel(this.Sprites.health_right, "health_right", -1);
        this.Sprites.health_right.pauseAnimation();

        this.Sprites.health_bar_back.attach(this.Sprites.health_left);
        this.Sprites.health_bar_back.attach(this.Sprites.health_right);


        this.Sprites.opponent_origin = Crafty.e('2D, DOM, Tweener');
        this.Sprites.opponent_body = MakeSpriteWithOrigin("opponent_body.png", 52, 80);

        this.Sprites.opponent_hips = MakeSpriteWithOrigin("opponent_hips.png", 33, 12);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_hips);

        this.Sprites.opponent_l_leg = MakeSpriteWithOrigin("opponent_l_leg.png", 54, 9);
        this.Sprites.opponent_hips.attach(this.Sprites.opponent_l_leg);
        this.Sprites.opponent_l_leg.attr({x:-18, y:16});

        this.Sprites.opponent_r_leg = MakeSpriteWithOrigin("opponent_r_leg.png", 17, 10);
        this.Sprites.opponent_hips.attach(this.Sprites.opponent_r_leg);
        this.Sprites.opponent_r_leg.attr({x:16, y:16});

        this.Sprites.opponent_win_arms = MakeSpriteWithOrigin("opponent_win_arms.png", 190, 120);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_win_arms);
        this.Sprites.opponent_win_arms.attr({x:-8, y:-54});

        this.Sprites.opponent_l_arm = MakeSpriteWithOrigin("opponent_l_arm.png", 27, 11);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_l_arm);
        
        this.Sprites.opponent_l_hand_rest = MakeSpriteWithOrigin("opponent_l_hand_rest.png", 16, 7);
        this.Sprites.opponent_l_arm.attach(this.Sprites.opponent_l_hand_rest);
        this.Sprites.opponent_l_hand_rest.attr({x:-9, y:71});
        this.Sprites.opponent_l_arm.attr({x:-48, y:-64});

        this.Sprites.opponent_r_hand_receive_1 = MakeSpriteWithOrigin("opponent_r_hand_receive_1.png", 89, 14);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_r_hand_receive_1);
        this.Sprites.opponent_r_hand_receive_1.attr({x:48, y:-62});
        HideSprite(this.Sprites.opponent_r_hand_receive_1);

        this.Sprites.opponent_r_arm = MakeSpriteWithOrigin("opponent_r_arm.png", 9, 13);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_r_arm);

        this.Sprites.opponent_r_hand_rest = MakeSpriteWithOrigin("opponent_r_hand_rest.png", 26, 12);
        this.Sprites.opponent_r_arm.attach(this.Sprites.opponent_r_hand_rest);
        this.Sprites.opponent_r_hand_rest.attr({x:30, y:71});
        this.Sprites.opponent_r_arm.attr({x:45, y:-62});


        this.Sprites.opponent_head = MakeSpriteWithOrigin("opponent_head.png", 39, 88);
        this.Sprites.opponent_head_react = MakeSpriteWithOrigin("opponent_head_react.png", 35, 102);
        this.Sprites.opponent_head_grin = MakeSpriteWithOrigin("opponent_head_grin.png", 52, 90);
        this.Sprites.opponent_head_pain = MakeSpriteWithOrigin("opponent_head_pain.png", 46, 85);
        this.Sprites.opponent_head_laugh = MakeAnimSprite("opponent_head_laugh");
        AddAnimSpriteReel(this.Sprites.opponent_head_laugh, "opponent_head_laugh_play", 650, [[0,0],[1,0],[2,0],[2,0],[1,0],[2,0],[1,0],[2,0],[2,0],[2,0],[1,0]]);
        StartAnimSpriteReel(this.Sprites.opponent_head_laugh, "opponent_head_laugh_play", -1);
        this.Sprites.opponent_mouth = MakeSpriteWithOrigin("opponent_mouth.png", 0, 0);
        this.Sprites.opponent_mouth_smile = MakeSpriteWithOrigin("opponent_mouth_smile.png", 0, 0);
        this.Sprites.opponent_head.attach(this.Sprites.opponent_mouth);
        this.Sprites.opponent_mouth.attr({x:-39, y:-88});
        this.Sprites.opponent_head.attach(this.Sprites.opponent_mouth_smile);
        this.Sprites.opponent_mouth_smile.attr({x:-39, y:-88});
        this.Sprites.opponent_head.attr({x:-8, y:-70});
        this.Sprites.opponent_head_react.attr({x:-8, y:-76});
        this.Sprites.opponent_head_grin.attr({x:-8, y:-70});
        this.Sprites.opponent_head_pain.attr({x:-8, y:-70});
        this.Sprites.opponent_head_laugh.attr({x:-55, y:-165});
        this.Sprites.opponent_body.attach(this.Sprites.opponent_head);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_head_react);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_head_pain);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_head_grin);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_head_laugh);

        this.Sprites.opponent_count = [];
        this.Sprites.opponent_count.push( MakeSpriteWithOrigin("opponent_count_1.png", 0, 0));
        this.Sprites.opponent_count.push( MakeSpriteWithOrigin("opponent_count_2.png", 0, 0));
        this.Sprites.opponent_count.push( MakeSpriteWithOrigin("opponent_count_3.png", 0, 0));
        this.Sprites.opponent_count.push( MakeSpriteWithOrigin("opponent_count_4.png", 0, 0));
        this.Sprites.opponent_count.push( MakeSpriteWithOrigin("opponent_count_5.png", 0, 0));
        this.Sprites.opponent_count.push( MakeSpriteWithOrigin("opponent_count_6.png", 0, 0));
        for(var count_spr of this.Sprites.opponent_count)
        {
            this.Sprites.opponent_body.attach(count_spr);
            count_spr.attr({x:-108, y:-126});
        }

        this.Sprites.opponent_ko_1 = MakeSpriteWithOrigin("opponent_ko_1.png", 135, 125);
        this.Sprites.opponent_ko_1.attr({x:350, y:150});
        
        this.Sprites.hand_down_vfx_r = MakeAnimSprite("vfx_1");
        AddAnimSpriteReel(this.Sprites.hand_down_vfx_r, "hand_down_vfx_r_play", 500, [[0,0],[1,0],[0,1],[1,1],[0,2]]);
        //StartAnimSpriteReel(this.Sprites.hand_down_vfx_r, "hand_down_vfx_r_play", -1);
        this.Sprites.hand_down_vfx_r.attr({x:275, y:0});

        this.Sprites.hand_down_vfx_l = MakeAnimSprite("vfx_1");
        AddAnimSpriteReel(this.Sprites.hand_down_vfx_l, "hand_down_vfx_l_play", 500, [[0,0],[1,0],[0,1],[1,1],[0,2]]);
        //StartAnimSpriteReel(this.Sprites.hand_down_vfx_l, "hand_down_vfx_l_play", -1);
        this.Sprites.hand_down_vfx_l.attr({x:220, y:256, rotation:180});

        this.Sprites.game_title = Crafty.e('2D, DOM, Image, Tweener').image("title.png");
        this.Sprites.instructions_opponent = MakeSpriteWithOrigin("instructions_opponent.png", 0, 0);
        this.Sprites.get_ready_to_vote = MakeSpriteWithOrigin("get_ready_to_vote.png", 0, 0);
        this.Sprites.vote_now = MakeSpriteWithOrigin("vote_now.png", 0, 0);


        this.Sprites.opponent_big_rock = MakeSpriteWithOrigin("opponent_big_rock.png", 50, 55);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_big_rock);
        this.Sprites.opponent_big_rock.attr({x:-10, y:-45});

        this.Sprites.opponent_big_paper = MakeSpriteWithOrigin("opponent_big_paper.png", 90, 75);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_big_paper);
        this.Sprites.opponent_big_paper.attr({x:-10, y:-45});

        this.Sprites.opponent_big_scissors = MakeSpriteWithOrigin("opponent_big_scissors.png", 90, 65);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_big_scissors);
        this.Sprites.opponent_big_scissors.attr({x:-10, y:-45});

        this.Sprites.msg_lets_do_this = MakeSpriteWithCentreOrigin("msg_lets_do_this.png");
        this.Sprites.msg_lets_do_this.attr({x:100, y:90});

        MakeLoopingTween(this.Sprites.opponent_l_arm, 'linear', 30, {rotation:0}, {rotation:15} );
        MakeLoopingTween(this.Sprites.opponent_r_arm, 'linear', 30, {rotation:0}, {rotation:-15} );
        MakeLoopingTween(this.Sprites.opponent_l_hand_rest, 'linear', 30, {rotation:15}, {rotation:-30} );
        MakeLoopingTween(this.Sprites.opponent_r_hand_rest, 'linear', 30, {rotation:-15}, {rotation:30} );
        MakeLoopingTween(this.Sprites.opponent_head, 'linear', 30, {rotation:-5}, {rotation:5} );
        MakeLoopingTween(this.Sprites.opponent_head_react, 'linear', 30, {rotation:-2}, {rotation:2} );
        MakeLoopingTween(this.Sprites.opponent_head_grin, 'linear', 30, {rotation:-2}, {rotation:2});
        MakeLoopingTween(this.Sprites.opponent_r_hand_receive_1, 'linear', 30, {rotation:-5}, {rotation:5} );
        MakeLoopingTween(this.Sprites.opponent_big_rock, 'linear', 30, {rotation:-5}, {rotation:5} );
        MakeLoopingTween(this.Sprites.opponent_big_paper, 'linear', 30, {rotation:-5}, {rotation:5} );
        MakeLoopingTween(this.Sprites.opponent_big_scissors, 'linear', 30, {rotation:-5}, {rotation:5} );

        //Last for opponent
        this.Sprites.opponent_body.attr({x:480, y:270});



        //this.Sprites.announcer = MakeSpriteWithCentreOrigin("announcer.png");
        //this.Sprites.announcer.attr({x:317, y:170});

        this.Sprites.bg_light1 = Crafty.e('2D, DOM, Image').image("scene1bg_light1.png");
        this.Sprites.bg_light2 = Crafty.e('2D, DOM, Image').image("scene1bg_light2.png");
        
        this.Sprites.player_rock = MakeSpriteWithOrigin("player_rock.png", 328, 254);
        this.Sprites.player_rock.attr({x:450, y:300});
        //MakeLoopingTween(this.Sprites.player_rock, 'linear', 30, {rotation:-5}, {rotation:5} );
        
        this.Sprites.player_paper = MakeSpriteWithOrigin("player_paper.png", 328, 254);
        this.Sprites.player_paper.attr({x:450, y:300});
        //MakeLoopingTween(this.Sprites.player_paper, 'linear', 30, {rotation:-5}, {rotation:5} );
        
        this.Sprites.player_scissors = MakeSpriteWithOrigin("player_scissors.png", 328, 254);
        this.Sprites.player_scissors.attr({x:450, y:300});
        //MakeLoopingTween(this.Sprites.player_scissors, 'linear', 30, {rotation:-5}, {rotation:5} );

        this.Sprites.player_won = MakeSpriteWithOrigin("player_won.png", 0, 0);
        this.Sprites.opponent_won = MakeSpriteWithOrigin("opponent_won.png", 0, 0);
        this.Sprites.tie = MakeSpriteWithOrigin("tie.png", 0, 0);


        //Voting        
        this.Sprites.choice_rock = MakeSpriteWithCentreOrigin("choice_rock.png");
        this.Sprites.choice_rock_highlight = MakeSpriteWithCentreOrigin("choice_rock_highlight.png");
        this.Sprites.choice_rock_name = MakeSpriteWithCentreOrigin("choice_rock_name.png");
        this.Sprites.choice_rock.attach(this.Sprites.choice_rock_highlight);
        this.Sprites.choice_rock.attr({x:134, y:218});
        MakeItWobble(this.Sprites.choice_rock, {x:64, y:45});
        MakeItWobble(this.Sprites.choice_rock_name, {x:64, y:75});

        this.Sprites.choice_paper = MakeSpriteWithCentreOrigin("choice_paper.png");
        this.Sprites.choice_paper_highlight = MakeSpriteWithCentreOrigin("choice_paper_highlight.png");
        this.Sprites.choice_paper_name = MakeSpriteWithCentreOrigin("choice_paper_name.png");
        this.Sprites.choice_paper.attach(this.Sprites.choice_paper_highlight);
        this.Sprites.choice_paper.attr({x:240, y:218});
        MakeItWobble(this.Sprites.choice_paper, {x:64, y:128});
        MakeItWobble(this.Sprites.choice_paper_name, {x:64, y:155});


        this.Sprites.choice_scissors = MakeSpriteWithCentreOrigin("choice_scissors.png");
        this.Sprites.choice_scissors_highlight = MakeSpriteWithCentreOrigin("choice_scissors_highlight.png");
        this.Sprites.choice_scissors_name = MakeSpriteWithCentreOrigin("choice_scissors_name.png");
        this.Sprites.choice_scissors.attach(this.Sprites.choice_scissors_highlight);
        this.Sprites.choice_scissors.attr({x:330, y:218});
        MakeItWobble(this.Sprites.choice_scissors, {x:64, y:218});
        MakeItWobble(this.Sprites.choice_scissors_name, {x:64, y:250});

        this.Sprites.numbers = MakeAnimSprite("numbers");
        AddAnimSpriteReel(this.Sprites.numbers, "nums", 500, [[0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0], [8,0], [9,0]]);
        //StartAnimSpriteReel(this.Sprites.numbers, "nums", -1);
        this.Sprites.numbers.attr({x:220, y:120});
        
        this.Sprites.msg_vote_now = MakeSpriteWithCentreOrigin("msg_vote_now.png").attr({x:240, y:148});
        MakeLoopingTween(this.Sprites.msg_vote_now, 'linear', 30, {x:240, y:98}, {x:240, y:92} );
        
        this.Sprites.msg_vote_over = MakeSpriteWithCentreOrigin("msg_vote_over.png").attr({x:240, y:148});
        MakeLoopingTween(this.Sprites.msg_vote_over, 'linear', 30, {x:240, y:148}, {x:240, y:142} );
        
        this.Sprites.opponent_body.attr(this.OpponentFightPos);

        //Store default WS positions
        for (var [spr_id, spr] of Object.entries(this.Sprites)) {
            spr.DefaultPos = {x:spr.x, y:spr.y, rotation:spr.rotation};
        }
    },
    Debug_JumpToIntro:function()
    {
        this.SetState(this.States.Intro);
    },
    Debug_JumpToIntro:function()
    {
        this.SetState(this.States.Intro);
    },
    Debug_JumpToVoting:function()
    {
        this.SetState(this.States.Voting);
    },
    Debug_JumpToTutorial:function()
    {
        this.SetState(this.States.Tutorial);
    },
    Debug_JumpToRoundOver:function()
    {
        this.SetState(this.States.RoundOver);
    },
    Debug_OpponentDoPaper:function()
    {
        this.ForceOpponentMove = this.Words.Paper;
    },
    Debug_OpponentDoScissors:function()
    {
        this.ForceOpponentMove = this.Words.Scissors;
    },
    Debug_OpponentDoRock:function()
    {
        this.ForceOpponentMove = this.Words.Rock;
    },
    Debug_OpponentDoRandom:function()
    {
        this.ForceOpponentMove = "";
    },
    Debug_PlayerDoPaper:function()
    {
        this.ForcePlayerMove = this.Words.Paper;
    },
    Debug_PlayerDoScissors:function()
    {
        this.ForcePlayerMove = this.Words.Scissors;
    },
    Debug_PlayerDoRock:function()
    {
        this.ForcePlayerMove = this.Words.Rock;
    },
    Debug_StartCount:function()
    {
        this.SetState(this.States.OpponentCount);
    },
    Debug_PlayerKO:function()
    {
        this.PlayerHealth = 0;
        this.OpponentHealth = 4;
        this.SetState(this.States.PlayerKO);
    },
    Debug_OpponentKO:function()
    {
        this.PlayerHealth = 4;
        this.OpponentHealth = 0;
        this.SetState(this.States.OpponentKO);
    },
    Debug_SetFullHealth:function()
    {
        this.PlayerHealth = 4;
        this.OpponentHealth = 0;
    },
    Debug_SetPlayer1Health:function()
    {
        this.PlayerHealth = 1;
        this.OpponentHealth = 4;
    },
    Debug_SetOpponent1Health:function()
    {
        this.PlayerHealth = 4;
        this.OpponentHealth = 1;
    },
    Continue:false,
    SubState:0,
    State_Continue:function()
    {
        this.Continue = true;
        this.SubState += 1;
    },
    //   ######   #######  ##    ## ######## ########   #######  ##        ######  
    //  ##    ## ##     ## ###   ##    ##    ##     ## ##     ## ##       ##    ## 
    //  ##       ##     ## ####  ##    ##    ##     ## ##     ## ##       ##       
    //  ##       ##     ## ## ## ##    ##    ########  ##     ## ##        ######  
    //  ##       ##     ## ##  ####    ##    ##   ##   ##     ## ##             ## 
    //  ##    ## ##     ## ##   ###    ##    ##    ##  ##     ## ##       ##    ## 
    //   ######   #######  ##    ##    ##    ##     ##  #######  ########  ######  

    Instructions:"",
    GetGameControls:function()
    {
        var controls = "<div>";
        
        controls += "<h2>Rock Paper Scissors Controls</h2>";
        var state_name = "?";
        for (const [key, value] of Object.entries(this.States)) {
            if(value == this.State)
            {
                state_name = key;
                break;
            }
        }
        controls += `<p>${state_name}</p>`;

        if(this.Instructions != "")
        {
            controls += `<p class="instructions">${this.Instructions}</p>`;
        }

        switch(this.State)
        {
            case this.States.Intro:
            {
                controls += CreateButton("Continue Intro", "State_Continue") + "<br>";
                break;
            }
            case this.States.Tutorial:
            {
                controls += CreateButton("Continue Game", "State_Continue") + "<br>";
                break;
            }
        }

        controls += "<h2>Jump To State...</h2>";
        controls += CreateButton("Intro", "Debug_JumpToIntro") + "<br>";
        controls += CreateButton("Tutorial", "Debug_JumpToTutorial") + "<br>";
        controls += CreateButton("Voting", "Debug_JumpToVoting") + "<br>";
        controls += CreateButton("Round Over", "Debug_JumpToRoundOver") + "<br>";
        controls += CreateButton("Start Count", "Debug_StartCount") + "<br>";
        controls += CreateButton("Set Opponent Do Rock", "Debug_OpponentDoRock") + "<br>";
        controls += CreateButton("Set Opponent Do Paper", "Debug_OpponentDoPaper") + "<br>";
        controls += CreateButton("Set Opponent Do Scissors", "Debug_OpponentDoScissors") + "<br>";
        controls += CreateButton("Set Opponent To Random", "Debug_OpponentDoRandom") + "<br>";
        controls += CreateButton("Set Player Do Rock", "Debug_PlayerDoRock") + "<br>";
        controls += CreateButton("Set Player Do Paper", "Debug_PlayerDoPaper") + "<br>";
        controls += CreateButton("Set Player Do Scissors", "Debug_PlayerDoScissors") + "<br>";
        controls += CreateButton("Opponent KO", "Debug_OpponentKO") + "<br>";
        controls += CreateButton("Player KO", "Debug_PlayerKO") + "<br>";
        controls += "<h2>Set Var</h2>";
        controls += CreateButton("Set Full Health", "Debug_SetFullHealth") + "<br>";
        controls += CreateButton("Set Player 1 Health", "Debug_SetPlayer1Health") + "<br>";
        controls += CreateButton("Set Opponent 1 Health", "Debug_SetOpponent1Health") + "<br>";
        controls += "</div>";

        return controls;
    }
}
















