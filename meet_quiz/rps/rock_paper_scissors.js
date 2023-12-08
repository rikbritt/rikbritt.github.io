


// Page
var rps_inject = `
<div class="game">
<style>
.game div {
  image-rendering: optimizeSpeed;             /* Older versions of FF          */
  image-rendering: -moz-crisp-edges;          /* FF 6.0+                       */
  image-rendering: -webkit-optimize-contrast; /* Safari                        */
  image-rendering: -o-crisp-edges;            /* OS X & Windows Opera (12.02+) */
  image-rendering: pixelated;                 /* Awesome future-browsers       */
  -ms-interpolation-mode: nearest-neighbor;   /* IE                            */
}
.rps-game-timer {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, 0px);
    font-family: 'Asap Condensed';
    font-size: 50px;
    color: red;
    font-weight: bold;
}

.rps-game-player-answer {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, 0px);
    font-family: 'Asap Condensed';
    font-size: 96px;
    color: red;
    font-weight: bold;
    width: 100%;
    text-align: center;
}

.rps-game-enemy-answer {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, 0px);
    font-family: 'Asap Condensed';
    font-size: 50px;
    color: red;
    font-weight: bold;
    width: 100%;
    text-align: center;
}

.rps-game-result {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, 0px);
    font-family: 'Asap Condensed';
    font-size: 96px;
    color: green;
    font-weight: bold;
    width: 100%;
    text-align: center;
}

.rps-game-boss-head {
    /* background-image: url("boss_head.png"); */
    background-image: url("data:image/svg+xml,%3Csvg width='256' height='256' xmlns='http://www.w3.org/2000/svg'%3E%3Cg id='Layer_1'%3E%3Ctitle%3ELayer 1%3C/title%3E%3Cellipse ry='126' rx='126' id='svg_1' cy='128' cx='128' stroke='%23000' fill='%23f4c1c1'/%3E%3Cellipse stroke='%23000' ry='23' rx='75' id='svg_2' cy='183' cx='131' fill='%23ffffff'/%3E%3Cline id='svg_3' y2='102' x2='129' y1='56' x1='43' stroke='%23000' fill='none'/%3E%3Cline id='svg_4' y2='100' x2='148' y1='55' x1='203' stroke='%23000' fill='none'/%3E%3C/g%3E%3C/svg%3E");
    width: 256px;
    height: 256px;
    left: 50%;
    position: relative;
    transform: translate(-50%, 0px);
}

.rps-game-scene-bg {
    width: 100%;
    height: 100%;
}

.rps-game-scene-bg img
{
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
}
</style>

    <div class="game">
        <div id="scene_bg" class="rps-game-scene-bg"><img src="scene1bg.png"/></div>
    </div>
    <div id="rps_game" class="game" style="display:none;">
        <div id="rps_head" class="rps-game-boss-head"></div>
        <div id="time_left" class="rps-game-timer">0</div>
        <div id="enemy_answered" class="rps-game-enemy-answer"></div>
        <div id="most_answered" class="rps-game-player-answer"></div>
        <div id="result" class="rps-game-result"></div>
    </div>
    <div id="crafty_game" class="game"></div>
    <div class="overlay">
    <div class="overlay-current-mode" id="overlay_answer_mode">Answer</div>
        <div class="overlay-players-container">
            <div class="flex-container" id="players">
                <!-- <div class="flex-items"><div class="player-name">Bob F</div></div> -->
            </div>
        </div>
    </div>
</div>
`;

var gWinWidth = window.innerWidth;
var gWinHeight = window.innerHeight;
var gVW = 480;
var gVH = 270;

function CentreOrigin(e)
{
    e.attr({x:-e.w / 2, y:-e.h / 2});
}

function MakeSpriteWithCentreOrigin(url)
{
    var o = Crafty.e('2D, DOM, Tweener');
    var e = Crafty.e('2D, DOM, Image').image(url);
    o.attach(e);
    CentreOrigin(e);
    return o;
}

function MakeSpriteWithOrigin(url, x, y)
{
    var o = Crafty.e('2D, DOM, Tweener');
    var e = Crafty.e('2D, DOM, Image').image(url);
    o.attach(e);
    e.attr({x:-x, y:-y});
    return o;
}

function MakeAnimSprite(sprite_name)
{
    var e = Crafty.e(`2D, DOM, Image, ${sprite_name}, SpriteAnimation`);
    return e;
}

function AddAnimSpriteReel(e, reel_name, reel_interval, reel_data)
{
    return e.reel(reel_name, reel_interval, reel_data);
}

function StartAnimSpriteReel(e, name, loop)
{
    e.animate(name, loop);
}


function MakeNumberSprite(num)
{
    var o = Crafty.e('2D, DOM, Tweener');
    var num_str = num.toString();
    if(num_str == "")
    {
        num_str = "0";
    }
    var num_spacing = 30;
    var num_numbers = num_str.length;
    for (var i = 0; i < num_str.length; i++) 
    {
        var num_url = `num_${num_str.charAt(i)}.png`;
        var e = Crafty.e('2D, DOM, Image').image(num_url);
        var x = (i * num_spacing) - ((num_numbers * num_spacing) / 2);
        o.attach(e);
        e.attr({x:x, y:0});
    }
    return o;
}

function MakeLoopingTween(e, ease, duration, from, to)
{
    var data = { e:e, duration:duration, ease:ease, from:from, to:to, to_next:true, stop:false};
    e._looping_tween_data = data;
    var bounce_f = function(e)
    {
        var d = e._looping_tween_data;
        if(d.stop)
        {
            return;
        }
        if(d.to_next)
        {
            d.to_next = false;
            d.e.addTween(d.to, d.ease, d.duration, bounce_f, [e]);
        }
        else
        {
            d.to_next = true;
            d.e.addTween(d.from, d.ease, d.duration, bounce_f, [e]);
        }
    }
    bounce_f(e);
}

function StopLoopingTween(e)
{
    e._looping_tween_data.stop = true;
}

function MakeItFlash(e, interval)
{
    e.flash_interval = setInterval(
        function()
        {
            e._children[0].visible = !e._children[0].visible;
        },
        interval
    );
}

function AnimateSpriteArrayFrames(e, time, frames_array, finished_cb)
{
    if(e[0].anim_data != null)
    {
        StopAnimateSpriteArray(e);
    }

    HideSprite(e);
    
    e[0].anim_data = {
        interval:-1,
        frame:0,
        frames:frames_array,
        cb:finished_cb
    };

    e[0].anim_data.interval = setInterval(
        function()
        {
            HideSprite(e);
            var anim_data = e[0].anim_data;
            var frame_idx = anim_data.frames[anim_data.frame];
            ShowSprite(e[frame_idx]);
            anim_data.frame += 1;
            if(anim_data.frame >= anim_data.frames.length)
            {
                StopAnimateSpriteArray(e);
                if(anim_data.cb != null)
                {
                    anim_data.cb();
                }   
            }
        },
        time
    );
}

function AnimateSpriteArray(e, time, loop = false)
{
    if(e[0].anim_data == null)
    {
        HideSprite(e);

        e[0].anim_data = {
            interval:-1,
            frame:0,
            loop:loop
        };

        e[0].anim_data.interval = setInterval(
            function()
            {
                HideSprite(e);
                var anim_data = e[0].anim_data;
                ShowSprite(e[anim_data.frame]);
                anim_data.frame += 1;
                if(anim_data.frame >= e.length)
                {
                    if(anim_data.loop)
                    {
                        anim_data.frame = 0;
                    }
                    else
                    {
                        StopAnimateSpriteArray(e);
                    }
                }
            },
            time
        );
    }
}

function StopAnimateSpriteArray(e)
{
    if(e[0].anim_data != null)
    {
        clearInterval(e[0].anim_data.interval);
        e[0].anim_data = null;
    }
}

function StopFlashing(e)
{
    if(e.flash_interval)
    {
        clearInterval(e.flash_interval);
        e._children[0].visible = false;
        e.flash_interval = null;
    }
}

function HideSprite(e)
{
    if(Array.isArray(e))
    {
        for(var i=0; i<e.length; ++i)
        {
            HideSprite(e[i]);
        }
    }
    else
    {
        e.visible = false;
        var children = e._children;
        for(var i=0; i<children.length; ++i)
        {
            HideSprite(children[i]);
        }
        //e._children[0].visible = false;
    }
}

function ShowSprite(e)
{
    if(Array.isArray(e))
    {
        for(var i=0; i<e.length; ++i)
        {
            ShowSprite(e[i]);
        }
    }
    else
    {
        e.visible = true;
        var children = e._children;
        for(var i=0; i<children.length; ++i)
        {
            ShowSprite(children[i]);
        }
        //e._children[0].visible = true;
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

var RockPaperScissors = 
{
    States:
    {
        Intro:0,
        Voting:1,
        RoundOver:2,
        OpponentCount:3,
        ShowMoves:4
    },
    State:0,
    TimeInState:0,
    OpponentMove:"",
    ForceOpponentMove:"",
    ForcePlayerMove:"",
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

                this.Sprites.opponent_body.attr({x:327, y:167});
                HideSprite(this.Sprites.opponent_body);

                this.Sprites.game_title.attr({x:0, y:-200});
                this.Sprites.game_title.cancelTweener();
                ShowSprite(this.Sprites.game_title);
                this.Sprites.game_title.addTween({x:0, y:0}, 'linear', 50,
                    function() { 
                        MakeLoopingTween(this.Sprites.game_title, 'linear', 30, {y:-5}, {y:5} );
            
                        this.StartStateBoundTimeout(
                            function(){
                                this.ShowOpponentDefaultVisibility();

                                //Move from door to centre
                                this.Sprites.opponent_body.addTween({x:240, y:175}, 'linear', 100,
                                    function() { 
                                        this.StartStateBoundTimeout(
                                        function(){
                                            ShowSprite(this.Sprites.msg_lets_do_this);
                                            
                                            this.StartStateBoundTimeout(
                                                function(){
                                                    HideSprite(this.Sprites.msg_lets_do_this);
                                                    this.SetState(this.States.Voting);
                                                }.bind(this),
                                                2000
                                            );
                                        }.bind(this),
                                        500
                                    );
                                    }.bind(this));
                            }.bind(this),
                            1000
                        );
            
                        this.StartStateBoundTimeout(
                            function(){
                                StopLoopingTween(this.Sprites.game_title);
                                //Move from door to centre
                                this.Sprites.game_title.addTween({x:0, y:-200}, 'linear', 50,
                                    function() { 
                                    }.bind(this));
                            }.bind(this),
                            3000
                        );
                    }.bind(this)
                );
                break;
            }
            case this.States.Voting:
            {
                ShowSprite(this.Sprites.choice_scissors);
                HideSprite(this.Sprites.choice_scissors_highlight);
                ShowSprite(this.Sprites.choice_paper);
                HideSprite(this.Sprites.choice_paper_highlight);
                ShowSprite(this.Sprites.choice_rock);
                HideSprite(this.Sprites.choice_rock_highlight);
                ShowSprite(this.Sprites.msg_vote_now);
                
                ShowSprite(this.Sprites.choice_scissors_name);
                ShowSprite(this.Sprites.choice_paper_name);
                ShowSprite(this.Sprites.choice_rock_name);
                
                //StopFlashing(this.Sprites.choice_rock_highlight);
                //StopFlashing(this.Sprites.choice_paper_highlight);
                //StopFlashing(this.Sprites.choice_scissors_highlight);

                document.getElementById("most_answered").innerHTML = "";
                document.getElementById("enemy_answered").innerHTML = "";
                document.getElementById("result").innerHTML = "";
                ChatGame.StartRound(
                    3,
                    ChatGame.AnswerModes.MultipleChoice,
                    ChatGame.ScoreModes.FirstRightAnswer,
                    ["rock", "paper", "scissors"],
                    true //wipe previous messages
                );
                break;
            }
            case this.States.RoundOver:
            {
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
                this.Sprites.opponent_body.attr({x:240, y:175});
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
                this.Sprites.opponent_body.attr({x:240, y:175});
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
            stageStyle.transformOrigin = stageStyle.webkitTransformOrigin = stageStyle.mozTransformOrigin = "0 0";
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
                    "player_scissors.png"
                ],
                "sprites":{
                    "vfx_1.png":{
                        tile:256,
                        tileh:256,
                        map: { vfx_1:[0,0] }
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

        document.getElementById("rps_game").style.display = "block";
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
    },
    ShowOpponentDefaultVisibility:function()
    {
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
        this.Sprites.opponent_body.attr({x:327, y:167});

        
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
        this.Sprites.choice_scissors = MakeSpriteWithCentreOrigin("choice_scissors.png");
        this.Sprites.choice_scissors_highlight = MakeSpriteWithCentreOrigin("choice_scissors_highlight.png");
        this.Sprites.choice_scissors_name = MakeSpriteWithCentreOrigin("choice_scissors_name.png");
        this.Sprites.choice_scissors.attach(this.Sprites.choice_scissors_highlight);
        this.Sprites.choice_scissors.attr({x:330, y:218});
        MakeLoopingTween(this.Sprites.choice_scissors, 'linear', 30, {x:330, y:218}, {x:334, y:222} );
        MakeLoopingTween(this.Sprites.choice_scissors_name, 'linear', 30, {x:334, y:228}, {x:330, y:233} );


        this.Sprites.choice_paper = MakeSpriteWithCentreOrigin("choice_paper.png");
        this.Sprites.choice_paper_highlight = MakeSpriteWithCentreOrigin("choice_paper_highlight.png");
        this.Sprites.choice_paper_name = MakeSpriteWithCentreOrigin("choice_paper_name.png");
        this.Sprites.choice_paper.attach(this.Sprites.choice_paper_highlight);
        this.Sprites.choice_paper.attr({x:240, y:218});
        MakeLoopingTween(this.Sprites.choice_paper, 'linear', 30, {x:240, y:218}, {x:238, y:223} );
        MakeLoopingTween(this.Sprites.choice_paper_name, 'linear', 30, {x:240, y:234}, {x:238, y:227} );


        this.Sprites.choice_rock = MakeSpriteWithCentreOrigin("choice_rock.png");
        this.Sprites.choice_rock_highlight = MakeSpriteWithCentreOrigin("choice_rock_highlight.png");
        this.Sprites.choice_rock_name = MakeSpriteWithCentreOrigin("choice_rock_name.png");
        this.Sprites.choice_rock.attach(this.Sprites.choice_rock_highlight);
        this.Sprites.choice_rock.attr({x:134, y:218});
        MakeLoopingTween(this.Sprites.choice_rock, 'linear', 30, {x:134, y:218}, {x:138, y:212} );
        MakeLoopingTween(this.Sprites.choice_rock_name, 'linear', 30, {x:136, y:229}, {x:132, y:235} );
        
        this.Sprites.msg_vote_now = MakeSpriteWithCentreOrigin("msg_vote_now.png").attr({x:240, y:148});
        MakeLoopingTween(this.Sprites.msg_vote_now, 'linear', 30, {x:240, y:148}, {x:240, y:142} );
        
        this.Sprites.msg_vote_over = MakeSpriteWithCentreOrigin("msg_vote_over.png").attr({x:240, y:148});
        MakeLoopingTween(this.Sprites.msg_vote_over, 'linear', 30, {x:240, y:148}, {x:240, y:142} );
        
    },
    UpdateGame:function(dt)
    {
        this.TimeInState += dt;
        switch(this.State)
        {
            case this.States.Intro:
            {
                document.getElementById("time_left").innerHTML = "Intro";
                //Intro anim changes to voting state itself
                break;
            }
            case this.States.Voting:
            {
                document.getElementById("time_left").innerHTML = ChatGame.TimeLeftInRound.toFixed(1);
                break;
            }
            case this.States.RoundOver:
            {
                //if(this.TimeInState > 2)
                //{
                //    this.SetState(this.States.Voting);
                //}
                break;
            }
        };
        
    },
    OnRoundEnd:function(round)
    {
        this.SetState(this.States.RoundOver);
    },
    GetHTMLToInject:function()
    {
        return rps_inject;
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
    GetGameControls:function()
    {
        var controls = "<div>";
        
        controls += "<h2>Rock Paper Scissors Controls</h2>";
        controls += "<button>Replay Intro</button>";

        controls += "<h2>Jump To State...</h2>";
        controls += CreateButton("Intro", "Debug_JumpToIntro") + "<br>";
        controls += CreateButton("Voting", "Debug_JumpToVoting") + "<br>";
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
















