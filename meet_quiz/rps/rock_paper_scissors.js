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
        ShowMoves:6
    },
    State:0,
    TimeInState:0,
    OpponentMove:"",
    ForceOpponentMove:"",
    ForcePlayerMove:"",
    OpponentFightPos:{x:275, y:180},
    SetState:function(s)
    {
        this.State=s;
        this.TimeInState = 0;

        this.SetSceneDefaultVisibility();
        this.ShowOpponentDefaultVisibility();
        this.StopStateBasedTimeouts();
        
        switch(this.State)
        {
            case this.States.Intro:
            {
                ChatGame.AbortRound();

                HideSprite(this.Sprites.opponent_body);
                ShowSprite(this.Sprites.announcer);

                this.Sprites.game_title.attr({x:0, y:-200});
                this.Sprites.game_title.cancelTweener();
                ShowSprite(this.Sprites.game_title);
                this.Sprites.game_title.addTween({x:0, y:0}, 'linear', 50,
                    function() { 
                        MakeLoopingTween(this.Sprites.game_title, 'linear', 30, {y:-5}, {y:5} );
            
                        this.StartStateBoundTimeout(
                            function(){
                            }.bind(this),
                            1000
                        );
            
                    }.bind(this)
                );
                break;
            }
            case this.States.Tutorial:
            {
                HideSprite(this.Sprites.opponent_body);
                //ShowSprite(this.Sprites.msg_lets_do_this);
                ShowSprite(this.Sprites.announcer);

                this.ShowVotingChoices();
                this.Anim_ShowVotingChoices();
                break;
            }
            // case this.States.StartVoting:
            // {
            //     this.ShowVotingChoices();
            //     this.Anim_ShowVotingChoices(
            //         function() {
            //             ShowSprite(this.Sprites.numbers);
            //             StartAnimSpriteReel(this.Sprites.numbers, "nums", -1)
            //             this.Sprites.numbers.pauseAnimation();
            //             this.Countdown = 4;
            //         }.bind(this)
            //     );

            //     break;
            // }
            case this.States.Voting:
            {
                this.ShowVotingChoices();
                this.Anim_ShowVotingChoices(
                    function() {
                        ShowSprite(this.Sprites.numbers);
                        StartAnimSpriteReel(this.Sprites.numbers, "nums", -1)
                        this.Sprites.numbers.pauseAnimation();
                        
                        ChatGame.StartRound(
                            4,
                            ChatGame.AnswerModes.MultipleChoice,
                            ChatGame.ScoreModes.FirstRightAnswer,
                            ["rock", "paper", "scissors"],
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
        
                        // this.Sprites.rock_vote_count = MakeNumberSprite(round_answers.AnswerCounts["rock"]);
                        // this.Sprites.rock_vote_count.attr({x:this.Sprites.choice_rock_highlight.x, y:this.Sprites.choice_rock_highlight.y});
                        // this.Sprites.paper_vote_count = MakeNumberSprite(round_answers.AnswerCounts["paper"]);
                        // this.Sprites.paper_vote_count.attr({x:this.Sprites.choice_paper_highlight.x, y:this.Sprites.choice_paper_highlight.y});
                        // this.Sprites.scissors_vote_count = MakeNumberSprite(round_answers.AnswerCounts["scissors"]);
                        // this.Sprites.scissors_vote_count.attr({x:this.Sprites.choice_scissors_highlight.x, y:this.Sprites.choice_scissors_highlight.y});
        
                    }.bind(this),
                    1000
                );
                //if(round_answers.MostAnswered == "rock")
                //{
                //    MakeItFlash(this.Sprites.choice_rock_highlight);
                //}
                //else if(round_answers.MostAnswered == "paper")
                //{
                //    MakeItFlash(this.Sprites.choice_paper_highlight);
                //}
                //else if(round_answers.MostAnswered == "scissors")
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
                        var choices = ["rock", "paper", "scissors"]; 
                        this.OpponentMove = choices[getRandomInt(3)]; //not inclusive of 3
                        this.SetState(this.States.ShowMoves);
                    }.bind(this)
                );
                //AnimateSpriteArray(this.Sprites.opponent_count, 150);

                break;
            }
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

                if(this.OpponentMove == "rock")
                {
                    ShowSprite(this.Sprites.opponent_big_rock);
                }
                else if(this.OpponentMove == "paper")
                {
                    ShowSprite(this.Sprites.opponent_big_paper);
                }
                else if(this.OpponentMove == "scissors")
                {
                    ShowSprite(this.Sprites.opponent_big_scissors);
                }

                var player_hand_sprites = [this.Sprites.player_rock, this.Sprites.player_paper, this.Sprites.player_scissors];
                var player_hand_sprite = player_hand_sprites[getRandomInt(3)]; //not inclusive of 3
                
                player_hand_sprite.attr({rotation:30, x:500, y:300});
                ShowSprite(player_hand_sprite);
                player_hand_sprite.addTween({x:450, y:320, rotation:0}, 'linear', 20);
                break;
            }
        }
    },
    
    UpdateGame:function(dt)
    {
        this.TimeInState += dt;
        switch(this.State)
        {
            case this.States.Intro:
            {
                //document.getElementById("time_left").innerHTML = "Intro";
                //Intro anim changes to voting state itself
                if(this.Continue)
                {
                    //this.ShowOpponentDefaultVisibility();
                    //this.Sprites.opponent_body.attr({x:600, y:200});

                    //Move from side to centre
                    // this.Sprites.opponent_body.addTween(this.OpponentFightPos, 'linear', 100,
                    //     function() { 
                    //         this.StartStateBoundTimeout(
                    //         function(){
                    //             ShowSprite(this.Sprites.msg_lets_do_this);
                                
                    //             this.StartStateBoundTimeout(
                    //                 function(){
                    //                     HideSprite(this.Sprites.msg_lets_do_this);
                    //                     this.SetState(this.States.Tutorial);
                    //                 }.bind(this),
                    //                 2000
                    //             );
                    //         }.bind(this),
                    //         500
                    //     );
                    //     }.bind(this)
                    // );
                    
                    StopLoopingTween(this.Sprites.game_title);
                    this.Sprites.game_title.cancelTweener();
                    this.Sprites.game_title.addTween({x:0, y:-200}, 'linear', 50,
                        function() { 
                            this.SetState(this.States.Tutorial);
                        }.bind(this)
                    );

                    this.Continue = false;
                }
                break;
            }
            case this.States.Tutorial:
            {
                if(this.Continue)
                {
                    this.Anim_HideVotingChoices();
                    this.Anim_OpponentEnter( function() {
                        this.SetState(this.States.Voting);
                    }.bind(this));
                    this.Continue = false;
                }
                break;
            }
            // case this.States.StartVoting:
            // {
            //     if(this.Countdown > 0)
            //     {
            //         this.Countdown -= dt;
            //         var time_left = Math.floor(this.Countdown);
            //         this.Sprites.numbers.reelPosition(time_left);
            //         if(time_left == 0)
            //         {
            //             //this.SetState(this.States.Voting);
            //         }
            //     }
            //     break;
            // }
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
                    "opponent_mouth.png",
                    "opponent_body.png",
                    "opponent_hips.png",
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
                    "scene1bg_flash4.png"
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
        HideSprite(this.Sprites.msg_vote_now);
        HideSprite(this.Sprites.msg_vote_over);
        HideSprite(this.Sprites.hand_down_vfx_l);
        HideSprite(this.Sprites.hand_down_vfx_r);
        HideSprite(this.Sprites.msg_lets_do_this);
        HideSprite(this.Sprites.choice_scissors_highlight);
        HideSprite(this.Sprites.choice_paper_highlight);
        HideSprite(this.Sprites.choice_rock_highlight);
        HideSprite(this.Sprites.player_rock);
        HideSprite(this.Sprites.player_paper);
        HideSprite(this.Sprites.player_scissors);
        HideSprite(this.Sprites.numbers);
        HideSprite(this.Sprites.announcer);
    },
    ShowOpponentDefaultVisibility:function()
    {
        this.Sprites.opponent_body.attr(this.OpponentFightPos);
        ShowSprite(this.Sprites.opponent_body); //Makes children visible
        HideSprite(this.Sprites.opponent_head_react);
        ShowSprite(this.Sprites.opponent_l_arm);
        ShowSprite(this.Sprites.opponent_r_arm);
        HideSprite(this.Sprites.opponent_r_hand_receive_1);
        HideSprite(this.Sprites.opponent_big_rock);
        HideSprite(this.Sprites.opponent_big_paper);
        HideSprite(this.Sprites.opponent_big_scissors);
        StopAnimateSpriteArray(this.Sprites.opponent_count);
        HideSprite(this.Sprites.opponent_count);
        
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
        MoveFromTo(this.Sprites.choice_scissors_name, {x:30, y:400}, {x:64, y:250}, 70, function() { 
                MakeItWobble(this.Sprites.choice_scissors_name);
                if(cb)
                {
                    cb();
                }
             }.bind(this) );
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
    CreateAllSprites:function()
    {

        //https://github.com/talitapagani/craftytweener
        //480 / 270
        this.Sprites.intro_bg = Crafty.e('2D, DOM, Image').image("scene1bg.png");
        this.Sprites.game_title = Crafty.e('2D, DOM, Image, Tweener').image("title.png");
        
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
        this.Sprites.opponent_mouth = MakeSpriteWithOrigin("opponent_mouth.png", 0, 0);
        this.Sprites.opponent_head.attach(this.Sprites.opponent_mouth);
        this.Sprites.opponent_mouth.attr({x:-39, y:-88});
        this.Sprites.opponent_head.attr({x:-8, y:-70});
        this.Sprites.opponent_head_react.attr({x:-8, y:-76});
        this.Sprites.opponent_body.attach(this.Sprites.opponent_head);
        this.Sprites.opponent_body.attach(this.Sprites.opponent_head_react);

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


        
        this.Sprites.hand_down_vfx_r = MakeAnimSprite("vfx_1");
        AddAnimSpriteReel(this.Sprites.hand_down_vfx_r, "hand_down_vfx_r_play", 500, [[0,0],[1,0],[0,1],[1,1],[0,2]]);
        //StartAnimSpriteReel(this.Sprites.hand_down_vfx_r, "hand_down_vfx_r_play", -1);
        this.Sprites.hand_down_vfx_r.attr({x:275, y:0});

        this.Sprites.hand_down_vfx_l = MakeAnimSprite("vfx_1");
        AddAnimSpriteReel(this.Sprites.hand_down_vfx_l, "hand_down_vfx_l_play", 500, [[0,0],[1,0],[0,1],[1,1],[0,2]]);
        //StartAnimSpriteReel(this.Sprites.hand_down_vfx_l, "hand_down_vfx_l_play", -1);
        this.Sprites.hand_down_vfx_l.attr({x:220, y:256, rotation:180});

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
        MakeLoopingTween(this.Sprites.opponent_r_hand_receive_1, 'linear', 30, {rotation:-5}, {rotation:5} );
        MakeLoopingTween(this.Sprites.opponent_big_rock, 'linear', 30, {rotation:-5}, {rotation:5} );
        MakeLoopingTween(this.Sprites.opponent_big_paper, 'linear', 30, {rotation:-5}, {rotation:5} );
        MakeLoopingTween(this.Sprites.opponent_big_scissors, 'linear', 30, {rotation:-5}, {rotation:5} );

        //Last for opponent
        this.Sprites.opponent_body.attr({x:480, y:270});



        this.Sprites.announcer = MakeSpriteWithCentreOrigin("announcer.png");
        this.Sprites.announcer.attr({x:317, y:170});

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
        this.Sprites.numbers.attr({x:220, y:100});
        
        this.Sprites.msg_vote_now = MakeSpriteWithCentreOrigin("msg_vote_now.png").attr({x:240, y:148});
        MakeLoopingTween(this.Sprites.msg_vote_now, 'linear', 30, {x:240, y:148}, {x:240, y:142} );
        
        this.Sprites.msg_vote_over = MakeSpriteWithCentreOrigin("msg_vote_over.png").attr({x:240, y:148});
        MakeLoopingTween(this.Sprites.msg_vote_over, 'linear', 30, {x:240, y:148}, {x:240, y:142} );
        
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
        this.ForceOpponentMove = "paper";
    },
    Debug_OpponentDoScissors:function()
    {
        this.ForceOpponentMove = "scissors";
    },
    Debug_OpponentDoRock:function()
    {
        this.ForceOpponentMove = "rock";
    },
    Debug_OpponentDoRandom:function()
    {
        this.ForceOpponentMove = "";
    },
    Debug_PlayerDoPaper:function()
    {
        this.ForcePlayerMove = "paper";
    },
    Debug_PlayerDoScissors:function()
    {
        this.ForcePlayerMove = "scissors";
    },
    Debug_PlayerDoRock:function()
    {
        this.ForcePlayerMove = "rock";
    },
    Debug_StartCount:function()
    {
        this.SetState(this.States.OpponentCount);
    },
    State_Continue:function()
    {
        this.Continue = true;
    },
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

        switch(this.State)
        {
            case this.States.Intro:
            {
                controls += "<p>Welcome folks to the game.</p>";
                controls += CreateButton("Continue Intro", "State_Continue") + "<br>";
                break;
            }
            case this.States.Tutorial:
            {
                controls += "<p>Explain how the game works</p>";
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
        controls += "</div>";

        return controls;
    }
}
















