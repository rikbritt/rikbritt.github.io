


// Page
var quiz_inject = `
<div>
<style>


.quiz-game {
    margin: auto;
    overflow: auto;
}

.quiz-game-anim-background {
    background: linear-gradient(315deg, rgba(101,0,94,1) 3%, rgba(60,132,206,1) 38%, rgba(48,238,226,1) 68%, rgba(255,25,25,1) 98%);
    animation: gradient 60s ease infinite;
    background-size: 400% 400%;
    background-attachment: fixed;
}

@keyframes gradient {
    0% {
        background-position: 0% 0%;
    }
    50% {
        background-position: 100% 100%;
    }
    100% {
        background-position: 0% 0%;
    }
}

.quiz-question {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, 0px);
    font-family: 'Asap Condensed';
    font-size: 64px;
    color: red;
    font-weight: bold;
    width: 100%;
    text-align: center;
    background-color: #ffffff75;
}

.timer-circle {
    stroke-dashoffset: 420;
    stroke-dasharray: 440;
    transition: all 0.1s linear;
}

</style>

    <div id="quiz_game" class="game quiz-game" style="display:none;">
        <div class="game-timer">
            <svg width="160" height="160" xmlns="http://www.w3.org/2000/svg" style="left: 50%;
            position: relative;
            transform: translate(-50%,0px) scale(-1, 1) rotate(-90deg);">
                <g>
                <circle id="timer_circle" class="timer-circle" r="70" cy="81" cx="81" stroke-width="16" stroke="#6fdb6f" fill="none"/>
                </g>
            </svg>
            <div id="quiz_time_left" class="game-timer-num">0</div>
        </div>
        <div id="quiz_question" class="quiz-question"></div>
        
    </div>
</div>
`;

var QuizData = {
    Questions:[
        {Question:"In What World<br>Is This Good?", Choices:["Yes", "No"], Answer:"Yes"},
        {Question:"Is Chocolate Good?", Choices:["Yes", "No"], Answer:"Yes"},
        {Question:"Do Bears Poop?", Choices:["Yes", "No"], Answer:"Yes"},
        {Question:"Name Thing", Choices:["A", "B", "C"], Answer:"B"},
        {Question:"Say Paper", Answer:"B"},
    ],
    Background:false
}

var QuizGame =
{
    NextQuestion:0,
    SetState:function(s)
    {
    },
    StartGame:function()
    {
        document.getElementById("quiz_game").style.display = "block";
        if(this.QuizData.Background)
        {
            document.getElementById("quiz_game").classList.add("quiz-game-anim-background");
        }
        this.StartNextQuestion();
    },
    UpdateGame:function(dt)
    {
        document.getElementById("quiz_time_left").innerHTML = ChatGame.TimeLeftInRound.toFixed(1);

        var time_left_norm = 1.0 - (ChatGame.TimeLeftInRound / ChatGame.RoundTime);
        document.getElementById("timer_circle").style.strokeDashoffset = 440 * time_left_norm;
        var lerp_col = lerpColor(0x6fdb6f, 0xff0000, time_left_norm);
        document.getElementById("timer_circle").style.stroke = lerp_col;
    },
    OnRoundEnd:function(round)
    {
        if(round.FirstValidAnswerPlayer == null)
        {
            document.getElementById("quiz_question").innerHTML = "No Winner!";
        }
        else
        {
            document.getElementById("quiz_question").innerHTML = "Winner : " + round.FirstValidAnswerPlayer.Name;
        }
        this.StartNextQuestion();
    },
    StartNextQuestion:function()
    {
        if(this.NextQuestion >= this.QuizData.Questions.length)
        {
            document.getElementById("quiz_question").innerHTML = "End!";
        }
        else
        {
            document.getElementById("quiz_question").innerHTML = this.QuizData.Questions[this.NextQuestion].Question;
            ChatGame.StartRound(
                3,
                ChatGame.AnswerModes.MultipleChoice,
                ChatGame.ScoreModes.FirstRightAnswer,
                this.QuizData.Questions[this.NextQuestion].Choices,
                true //wipe previous messages
            );
            this.NextQuestion += 1;
        }
    },
    GetHTMLToInject:function()
    {
        return quiz_inject;
    },
    GetGameControls:function()
    {
        return createElementFromHTML("<div>Quiz Controls</div>");
    }
}














