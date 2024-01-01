
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

function MoveFromTo(e, from, to, time, func, ease = 'linear')
{
    StopLoopingTween(e);
    e.cancelTweener();
    e.attr(from);
    e.addTween(to, ease, time, func, [e]);
}

function MoveTo(e, to, time, func, ease = 'linear')
{
    StopLoopingTween(e);
    e.cancelTweener();
    e.addTween(to, ease, time, func, [e]);
}

function MakeLoopingTween(e, ease, duration, from, to)
{
    e.cancelTweener();
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

function MakeItWobble(e, pos)
{
    if(pos == null)
    {
        pos = {x:e.x, y:e.y};
    }
    var x_rand = getRandomInt(6) + 4;
    var y_rand = getRandomInt(6) + 4;
    var a = {x:pos.x - Math.floor(x_rand * 0.5), y:pos.y - Math.floor(y_rand * 0.5) };
    var b = {x:pos.x + Math.floor(x_rand * 0.5), y:pos.y + Math.floor(y_rand * 0.5) };
    if(getRandomInt(2) == 1)
    {
        var x = a.x;
        a.x = b.x;
        b.x = x;
    }
    if(getRandomInt(2) == 1)
    {
        var y = a.y;
        a.y = b.y;
        b.y = y;
    }
    MakeLoopingTween(e, 'linear', 30, a, b );
}

function StopLoopingTween(e)
{
    if(e._looping_tween_data != null)
    {
        e._looping_tween_data.stop = true;
    }
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
