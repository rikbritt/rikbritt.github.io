var IMGUIKNOBS_PI = 3.14159265358979323846;

var ImGuiKnobFlags = {
    NoTitle : 1 << 0,
    NoInput : 1 << 1,
    ValueTooltip : 1 << 2,
    DragHorizontal : 1 << 3,
    DragVertical : 1 << 4,
    Logarithmic : 1 << 5,
    AlwaysClamp : 1 << 6
};

var ImGuiKnobVariant = {
    Tick : 1 << 0,
    Dot : 1 << 1,
    Wiper : 1 << 2,
    WiperOnly : 1 << 3,
    WiperDot : 1 << 4,
    Stepped : 1 << 5,
    Space : 1 << 6,
};

var ImGuiKnobs  = {};

class color_set {
    base;
    hovered;
    active;

    constructor(base, hovered, active)
    {
        this.base = base;
        this.hovered = hovered;
        this.active = active;
    }

    color_set(color) {
        base = color;
        hovered = color;
        active = color;
    }
};


var ImGuiKnobs_detail = {};

ImGuiKnobs_detail.draw_arc = function(center, radius, start_angle, end_angle, thickness, color) 
{
    var draw_list = ImGui.GetWindowDrawList();

    draw_list.PathArcTo(center, radius, start_angle, end_angle);
    draw_list.PathStroke(color, 0, thickness);
}

class ImGuiKnobs_knob {
    radius;
    value_changed;
    center;
    is_active;
    is_hovered;
    angle_min;
    angle_max;
    t;
    angle;
    angle_cos;
    angle_sin;

    constructor (_label,
            data_type,
            p_value,
            v_min,
            v_max,
            speed,
            _radius,
            format,
            flags,
            _angle_min,
            _angle_max)
        {
        this.radius = _radius;
        if (flags & ImGuiKnobFlags.Logarithmic) {
            var v = ImMax(ImMin(p_value, v_max), v_min);
            this.t = (ImLog(ImAbs(v)) - ImLog(ImAbs(v_min))) / (ImLog(ImAbs(v_max)) - ImLog(ImAbs(v_min)));
        } else {
            this.t = (p_value - v_min) / (v_max - v_min);
        }
        var screen_pos = ImGui.GetCursorScreenPos();

        // Handle dragging
        ImGui.InvisibleButton(_label, {x:this.radius * 2.0, y:this.radius * 2.0});

        // Handle drag: if DragVertical or DragHorizontal flags are set, only the given direction is
        // used, otherwise use the drag direction with the highest delta
        var io = ImGui.GetIO();
        var drag_vertical =
                !(flags & ImGuiKnobFlags.DragHorizontal) &&
                (flags & ImGuiKnobFlags.DragVertical || ImAbs(io.MouseDelta[ImGui.Axis.Y]) > ImAbs(io.MouseDelta[ImGui.Axis.X]));

        var gid = ImGui.GetID(_label);
        var drag_behaviour_flags = 0;
        if (drag_vertical) {
            drag_behaviour_flags |= ImGui.SliderFlags.Vertical;
        }
        if (flags & ImGuiKnobFlags.AlwaysClamp) {
            drag_behaviour_flags |= ImGui.SliderFlags.AlwaysClamp;
        }
        if (flags & ImGuiKnobFlags.Logarithmic) {
            drag_behaviour_flags |= ImGui.SliderFlags.Logarithmic;
        }
        this.value_changed = ImGui.DragBehavior(
                gid,
                data_type,
                p_value,
                speed,
                v_min,
                v_max,
                format,
                drag_behaviour_flags);

        this.angle_min = _angle_min < 0 ? IMGUIKNOBS_PI * 0.75 : _angle_min;
        this.angle_max = _angle_max < 0 ? IMGUIKNOBS_PI * 2.25 : _angle_max;

        this.center = {x:screen_pos.x + this.radius, y:screen_pos.y + this.radius};
        this.is_active = ImGui.IsItemActive();
        this.is_hovered = ImGui.IsItemHovered();
        this.angle = angle_min + (this.angle_max - this.angle_min) * t;
        this.angle_cos = cosf(this.angle);
        this.angle_sin = sinf(this.angle);
    }

    draw_dot( size, radius, angle, color, filled, segments)
    {
        var dot_size = size * this.radius;
        var dot_radius = radius * this.radius;

        ImGui.GetWindowDrawList().AddCircleFilled(
                {x:center.x + cosf(angle) * dot_radius,
                    y:center.y + sinf(angle) * dot_radius},
                dot_size,
                is_active ? color.active : (is_hovered ? color.hovered : color.base),
                segments);
    }

    draw_tick(start, end, width, angle, color)
    {
        var tick_start = start * radius;
        var tick_end = end * radius;
        var angle_cos = cosf(angle);
        var angle_sin = sinf(angle);

        ImGui.GetWindowDrawList().AddLine(
                {x:center.x + angle_cos * tick_end, y:center.y + angle_sin * tick_end},
                {x:center.x + angle_cos * tick_start,
                    y:center.y + angle_sin * tick_start},
                is_active ? color.active : (is_hovered ? color.hovered : color.base),
                width * this.radius);
    }

    draw_circle(size, color, filled, segments) 
    {
        var circle_radius = size * radius;

        ImGui.GetWindowDrawList().AddCircleFilled(
                center,
                circle_radius,
                is_active ? color.active : (is_hovered ? color.hovered : color.base));
    }

    draw_arc(radius, size, start_angle, end_angle, color)
    {
        var track_radius = radius * this.radius;
        var track_size = size * this.radius * 0.5 + 0.0001;

        ImGuiKnobs_detail.draw_arc(center, track_radius, start_angle, end_angle, track_size, is_active ? color.active : (is_hovered ? color.hovered : color.base));
    }
};

ImGuiKnobs_detail.knob_with_drag = function(
                label,
                data_type,
                p_value,
                v_min,
                v_max,
                _speed,
                format,
                size,
                flags,
                angle_min,
                angle_max)
{
    if (flags & ImGuiKnobFlags.Logarithmic && v_min <= 0.0 && v_max >= 0.0)
    {
        // we must handle the cornercase if a client specifies a logarithmic range that contains zero
        // for this we clamp lower limit to avoid hitting zero like it is done in ImGui.SliderBehaviorT
        var is_floating_point = (data_type == ImGui.DataType.Float) || (data_type == ImGui.DataType.Double);
        var decimal_precision = is_floating_point ? ImParseFormatPrecision(format, 3) : 1;
        v_min = ImPow(0.1, decimal_precision);
        v_max = ImMax(v_min, v_max); // this ensures that in the cornercase v_max is still at least ge v_min
        p_value = ImMax(ImMin(p_value, v_max), v_min); // this ensures that in the cornercase p_value is within the range
    }

    var speed = _speed == 0 ? (v_max - v_min) / 250 : _speed;
    ImGui.PushID(label);
    var width = size == 0 ? ImGui.GetTextLineHeight() * 4.0 : size * ImGui.GetIO().FontGlobalScale;
    ImGui.PushItemWidth(width);

    ImGui.BeginGroup();

    // There's an issue with `SameLine` and Groups, see
    // https://github.com/ocornut/imgui/issues/4190. This is probably not the best
    // solution, but seems to work for now
    //ImGui.GetCurrentWindow().DC.CurrLineTextBaseOffset = 0;

    // Draw title
    if (!(flags & ImGuiKnobFlags.NoTitle)) {
        var title_size = ImGui.CalcTextSize(label, null, false, width);

        // Center title
        ImGui.SetCursorPosX(ImGui.GetCursorPosX() +
                                (width - title_size.x) * 0.5);

        ImGui.Text("%s", label);
    }

    // Draw knob
    var k = new ImGuiKnobs_knob(label, data_type, p_value, v_min, v_max, speed, width * 0.5, format, flags, angle_min, angle_max);

    // Draw tooltip
    if (flags & ImGuiKnobFlags.ValueTooltip &&
        (ImGui.IsItemHovered(ImGui.HoveredFlags.AllowWhenDisabled) ||
            ImGui.IsItemActive())) {
        ImGui.BeginTooltip();
        ImGui.Text(format, p_value);
        ImGui.EndTooltip();
    }

    // Draw input
    if (!(flags & ImGuiKnobFlags.NoInput)) {
        var drag_scalar_flags = 0;
        if (flags & ImGuiKnobFlags.AlwaysClamp) {
            drag_scalar_flags |= ImGui.SliderFlags.AlwaysClamp;
        }
        if (flags & ImGuiKnobFlags.Logarithmic) {
            drag_scalar_flags |= ImGui.SliderFlags.Logarithmic;
        }
        var changed = ImGui.DragScalar("###knob_drag", data_type, p_value, speed, v_min, v_max, format, drag_scalar_flags);
        if (changed) {
            k.value_changed = true;
        }
    }

    ImGui.EndGroup();
    ImGui.PopItemWidth();
    ImGui.PopID();

    return k;
}

ImGuiKnobs_detail.GetPrimaryColorSet = function()
{
    var colors = ImGui.GetStyle().Colors;

    return new color_set(colors[ImGuiCol_ButtonActive], colors[ImGuiCol_ButtonHovered], colors[ImGuiCol_ButtonHovered]);
}

ImGuiKnobs_detail.GetSecondaryColorSet = function()
{
    var colors = ImGui.GetStyle().Colors;
    var active = new ImVec4(colors[ImGuiCol_ButtonActive].x * 0.5,
                            colors[ImGuiCol_ButtonActive].y * 0.5,
                            colors[ImGuiCol_ButtonActive].z * 0.5,
                            colors[ImGuiCol_ButtonActive].w);

    var hovered = new ImVec4(colors[ImGuiCol_ButtonHovered].x * 0.5,
                            colors[ImGuiCol_ButtonHovered].y * 0.5,
                            colors[ImGuiCol_ButtonHovered].z * 0.5,
                            colors[ImGuiCol_ButtonHovered].w);

    return new color_set(active, hovered, hovered);
}

ImGuiKnobs_detail.GetTrackColorSet = function()
{
    var colors = ImGui.GetStyle().Colors;

    return new color_set(colors[ImGuiCol_Button], colors[ImGuiCol_Button], colors[ImGuiCol_Button]);
}

BaseKnob = function(
            label,
            data_type,
            p_value,
            v_min,
            v_max,
            speed,
            format,
            variant,
            size,
            flags,
            steps,
            angle_min,
            angle_max)
{
    var knob = ImGuiKnobs_detail.knob_with_drag(
            label,
            data_type,
            p_value,
            v_min,
            v_max,
            speed,
            format,
            size,
            flags,
            angle_min,
            angle_max);

    switch (variant) {
        case ImGuiKnobVariant.Tick: {
            knob.draw_circle(0.85, ImGuiKnobs_detail.GetSecondaryColorSet(), true, 32);
            knob.draw_tick(0.5, 0.85, 0.08, knob.angle, ImGuiKnobs_detail.GetPrimaryColorSet());
            break;
        }
        case ImGuiKnobVariant.Dot: {
            knob.draw_circle(0.85, ImGuiKnobs_detail.GetSecondaryColorSet(), true, 32);
            knob.draw_dot(0.12, 0.6, knob.angle, ImGuiKnobs_detail.GetPrimaryColorSet(), true, 12);
            break;
        }

        case ImGuiKnobVariant.Wiper: {
            knob.draw_circle(0.7, ImGuiKnobs_detail.GetSecondaryColorSet(), true, 32);
            knob.draw_arc(0.8, 0.41, knob.angle_min, knob.angle_max, ImGuiKnobs_detail.GetTrackColorSet());

            if (knob.t > 0.01) {
                knob.draw_arc(0.8, 0.43, knob.angle_min, knob.angle, ImGuiKnobs_detail.GetPrimaryColorSet());
            }
            break;
        }
        case ImGuiKnobVariant.WiperOnly: {
            knob.draw_arc(0.8, 0.41, knob.angle_min, knob.angle_max, ImGuiKnobs_detail.GetTrackColorSet());

            if (knob.t > 0.01) {
                knob.draw_arc(0.8, 0.43, knob.angle_min, knob.angle, ImGuiKnobs_detail.GetPrimaryColorSet());
            }
            break;
        }
        case ImGuiKnobVariant.WiperDot: {
            knob.draw_circle(0.6, ImGuiKnobs_detail.GetSecondaryColorSet(), true, 32);
            knob.draw_arc(0.85, 0.41, knob.angle_min, knob.angle_max, ImGuiKnobs_detail.GetTrackColorSet());
            knob.draw_dot(0.1, 0.85, knob.angle, ImGuiKnobs_detail.GetPrimaryColorSet(), true, 12);
            break;
        }
        case ImGuiKnobVariant.Stepped: {
            for (var n = 0.0; n < steps; n++) {
                var a = n / (steps - 1);
                var angle = knob.angle_min + (knob.angle_max - knob.angle_min) * a;
                knob.draw_tick(0.7, 0.9, 0.04, angle, ImGuiKnobs_detail.GetPrimaryColorSet());
            }

            knob.draw_circle(0.6, ImGuiKnobs_detail.GetSecondaryColorSet(), true, 32);
            knob.draw_dot(0.12, 0.4, knob.angle, ImGuiKnobs_detail.GetPrimaryColorSet(), true, 12);
            break;
        }
        case ImGuiKnobVariant.Space: {
            knob.draw_circle(0.3 - knob.t * 0.1, ImGuiKnobs_detail.GetSecondaryColorSet(), true, 16);

            if (knob.t > 0.01) {
                knob.draw_arc(0.4, 0.15, knob.angle_min - 1.0, knob.angle - 1.0, ImGuiKnobs_detail.GetPrimaryColorSet());
                knob.draw_arc(0.6, 0.15, knob.angle_min + 1.0, knob.angle + 1.0, ImGuiKnobs_detail.GetPrimaryColorSet());
                knob.draw_arc(0.8, 0.15, knob.angle_min + 3.0, knob.angle + 3.0, ImGuiKnobs_detail.GetPrimaryColorSet());
            }
            break;
        }
    }

    return knob.value_changed;
}

ImGuiKnobs.Knob = function(
            /*const char * */       label,
            /*float *      */       p_value,
            /*float        */       v_min,
            /*float        */       v_max,
            /*float        */       speed = 0,
            /*const char * */       format = "%.3f",
            /*ImGuiKnobVariant */   variant = ImGuiKnobVariant.Tick,
            /*float        */       size = 0,
            /*ImGuiKnobFlags */     flags = 0,
            /*int          */       steps = 10,
            /*float        */       angle_min = -1,
            /*float        */       angle_max = -1
)
{
    return BaseKnob(
        label,
        ImGui.DataType.Float,
        p_value,
        v_min,
        v_max,
        speed,
        format,
        variant,
        size,
        flags,
        steps,
        angle_min,
        angle_max);
}

ImGuiKnobs.KnobInt = function(
            /*const char *    */    label,
            /*int *           */    p_value,
            /*int             */    v_min,
            /*int             */    v_max,
            /*float           */    speed = 0,
            /*const char *    */    format = "%i",
            /*ImGuiKnobVariant*/    variant = ImGuiKnobVariant.Tick,
            /*float           */    size = 0,
            /*ImGuiKnobFlags  */    flags = 0,
            /*int             */    steps = 10,
            /*float           */    angle_min = -1,
            /*float           */    angle_max = -1
        )
{

    return BaseKnob(
        label,
        ImGui.DataType.S32,
        p_value,
        v_min,
        v_max,
        speed,
        format,
        variant,
        size,
        flags,
        steps,
        angle_min,
        angle_max);
}