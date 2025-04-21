var IMGUIKNOBS_PI = 3.14159265358979323846;

function ImAbs(v)
{
    return Math.abs(v);
}


function IsMouseDragPastThreshold(button, lock_threshold)
{
    var io = ImGui.GetIO();
    //IM_ASSERT(button >= 0 && button < IM_ARRAYSIZE(io.MouseDown));
    if (lock_threshold < 0.0)
        lock_threshold = io.MouseDragThreshold;
    return io.MouseDragMaxDistanceSqr[button] >= lock_threshold * lock_threshold;
}

// Convert a parametric position on a slider into a value v in the output space (the logical opposite of ScaleRatioFromValueT)
function ScaleValueFromRatioT(data_type, t, v_min, v_max, is_logarithmic, logarithmic_zero_epsilon, zero_deadzone_halfsize)
{
    if (v_min == v_max)
        return v_min;

    var is_floating_point = (data_type == ImGui.DataType.Float) || (data_type == ImGui.DataType.Double);

    var result;
    if (is_logarithmic)
    {
        // We special-case the extents because otherwise our fudging can lead to "mathematically correct" but non-intuitive behaviors like a fully-left slider not actually reaching the minimum value
        if (t <= 0.0)
            result = v_min;
        else if (t >= 1.0)
            result = v_max;
        else
        {
            var flipped = v_max < v_min; // Check if range is "backwards"

            // Fudge min/max to avoid getting silly results close to zero
            var v_min_fudged = (ImAbs(v_min) < logarithmic_zero_epsilon) ? ((v_min < 0.0) ? -logarithmic_zero_epsilon : logarithmic_zero_epsilon) : v_min;
            var v_max_fudged = (ImAbs(v_max) < logarithmic_zero_epsilon) ? ((v_max < 0.0) ? -logarithmic_zero_epsilon : logarithmic_zero_epsilon) : v_max;

            if (flipped)
                ImSwap(v_min_fudged, v_max_fudged);

            // Awkward special case - we need ranges of the form (-100 .. 0) to convert to (-100 .. -epsilon), not (-100 .. epsilon)
            if ((v_max == 0.0) && (v_min < 0.0))
                v_max_fudged = -logarithmic_zero_epsilon;

            var t_with_flip = flipped ? (1.0 - t) : t; // t, but flipped if necessary to account for us flipping the range

            if ((v_min * v_max) < 0.0) // Range crosses zero, so we have to do this in two parts
            {
                var zero_point_center = (-ImMin(v_min, v_max)) / ImAbs(v_max - v_min); // The zero point in parametric space
                var zero_point_snap_L = zero_point_center - zero_deadzone_halfsize;
                var zero_point_snap_R = zero_point_center + zero_deadzone_halfsize;
                if (t_with_flip >= zero_point_snap_L && t_with_flip <= zero_point_snap_R)
                    result = 0.0; // Special case to make getting exactly zero possible (the epsilon prevents it otherwise)
                else if (t_with_flip < zero_point_center)
                    result = -(logarithmic_zero_epsilon * ImPow(-v_min_fudged / logarithmic_zero_epsilon, (1.0 - (t_with_flip / zero_point_snap_L))));
                else
                    result = (logarithmic_zero_epsilon * ImPow(v_max_fudged / logarithmic_zero_epsilon, ((t_with_flip - zero_point_snap_R) / (1.0 - zero_point_snap_R))));
            }
            else if ((v_min < 0.0) || (v_max < 0.0)) // Entirely negative slider
                result = -(-v_max_fudged * ImPow(-v_min_fudged / -v_max_fudged, (1.0 - t_with_flip)));
            else
                result = (v_min_fudged * ImPow(v_max_fudged / v_min_fudged, t_with_flip));
        }
    }
    else
    {
        // Linear slider
        if (is_floating_point)
        {
            result = ImLerp(v_min, v_max, t);
        }
        else
        {
            // - For integer values we want the clicking position to match the grab box so we round above
            //   This code is carefully tuned to work with large values (e.g. high ranges of U64) while preserving this property..
            // - Not doing a *1.0 multiply at the end of a range as it tends to be lossy. While absolute aiming at a large s64/u64
            //   range is going to be imprecise anyway, with this check we at least make the edge values matches expected limits.
            if (t < 1.0)
            {
                var v_new_off_f = (v_max - v_min) * t;
                result = (v_min + (v_new_off_f + (v_min > v_max ? -0.5 : 0.5)));
            }
            else
            {
                result = v_max;
            }
        }
    }

    return result;
}

function ScaleRatioFromValueT(data_type, v, v_min, v_max, is_logarithmic, logarithmic_zero_epsilon, zero_deadzone_halfsize)
{
    if (v_min == v_max)
        return 0.0;

    var v_clamped = (v_min < v_max) ? ImClamp(v, v_min, v_max) : ImClamp(v, v_max, v_min);
    if (is_logarithmic)
    {
        var flipped = v_max < v_min;

        if (flipped) // Handle the case where the range is backwards
            ImSwap(v_min, v_max);

        // Fudge min/max to avoid getting close to log(0)
        var v_min_fudged = (ImAbs(v_min) < logarithmic_zero_epsilon) ? ((v_min < 0.0) ? -logarithmic_zero_epsilon : logarithmic_zero_epsilon) : v_min;
        var v_max_fudged = (ImAbs(v_max) < logarithmic_zero_epsilon) ? ((v_max < 0.0) ? -logarithmic_zero_epsilon : logarithmic_zero_epsilon) : v_max;

        // Awkward special cases - we need ranges of the form (-100 .. 0) to convert to (-100 .. -epsilon), not (-100 .. epsilon)
        if ((v_min == 0.0) && (v_max < 0.0))
            v_min_fudged = -logarithmic_zero_epsilon;
        else if ((v_max == 0.0) && (v_min < 0.0))
            v_max_fudged = -logarithmic_zero_epsilon;

        var result;

        if (v_clamped <= v_min_fudged)
            result = 0.0; // Workaround for values that are in-range but below our fudge
        else if (v_clamped >= v_max_fudged)
            result = 1.0; // Workaround for values that are in-range but above our fudge
        else if ((v_min * v_max) < 0.0) // Range crosses zero, so split into two portions
        {
            var zero_point_center = (-v_min) / (v_max - v_min); // The zero point in parametric space.  There's an argument we should take the logarithmic nature into account when calculating this, but for now this should do (and the most common case of a symmetrical range works fine)
            var zero_point_snap_L = zero_point_center - zero_deadzone_halfsize;
            var zero_point_snap_R = zero_point_center + zero_deadzone_halfsize;
            if (v == 0.0)
                result = zero_point_center; // Special case for exactly zero
            else if (v < 0.0)
                result = (1.0 - (ImLog(-v_clamped / logarithmic_zero_epsilon) / ImLog(-v_min_fudged / logarithmic_zero_epsilon))) * zero_point_snap_L;
            else
                result = zero_point_snap_R + ((ImLog(v_clamped / logarithmic_zero_epsilon) / ImLog(v_max_fudged / logarithmic_zero_epsilon)) * (1.0 - zero_point_snap_R));
        }
        else if ((v_min < 0.0) || (v_max < 0.0)) // Entirely negative slider
            result = 1.0 - (ImLog(-v_clamped / -v_max_fudged) / ImLog(-v_min_fudged / -v_max_fudged));
        else
            result = (ImLog(v_clamped / v_min_fudged) / ImLog(v_max_fudged / v_min_fudged));

        return flipped ? (1.0 - result) : result;
    }

    // Linear slider
    return ((v_clamped - v_min) / (v_max - v_min));
}

var DragCurrentAccumDirty = false;
var DragCurrentAccum = 0.0;

ImGui.DragBehaviorT = function(data_type, v, v_speed, v_min, v_max, format, power)
{
    var io = ImGui.GetIO();
    
    // Default tweak speed
    var has_min_max = (v_min != v_max) && (v_max - v_max < FLT_MAX);
    if (v_speed == 0.0 && has_min_max)
        v_speed = ((v_max - v_min) *  (1.0 / 100.0));
    // Inputs accumulates into g.DragCurrentAccum, which is flushed into the current value as soon as it makes a difference with our precision settings
    var adjust_delta = 0.0;
    if (/* g.ActiveIdSource == ImGuiInputSource_Mouse && */ IsMousePosValid() && io.MouseDragMaxDistanceSqr[0] > 1.0*1.0)
    {
        adjust_delta = io.MouseDelta.x;
        if (io.KeyAlt)
            adjust_delta *= 1.0/100.0;
        if (io.KeyShift)
            adjust_delta *= 10.0;
    }
    // else if (g.ActiveIdSource == ImGuiInputSource_Nav)
    // {
    //     var decimal_precision = (data_type == ImGuiDataType_Float || data_type == ImGuiDataType_Double) ? ImParseFormatPrecision(format, 3) : 0;
    //     adjust_delta = GetNavInputAmount2d(ImGuiNavDirSourceFlags_Keyboard|ImGuiNavDirSourceFlags_PadDPad, ImGuiInputReadMode_RepeatFast, 1.0/10.0, 10.0).x;
    //     v_speed = ImMax(v_speed, GetMinimumStepAtDecimalPrecision(decimal_precision));
    // }
    adjust_delta *= v_speed;
    // Clear current value on activation
    // Avoid altering values and clamping when we are _already_ past the limits and heading in the same direction, so e.g. if range is 0..255, current value is 300 and we are pushing to the right side, keep the 300.
    var is_just_activated = io.MouseClicked[0];//g.ActiveIdIsJustActivated;
    var is_already_past_limits_and_pushing_outward = has_min_max && ((v >= v_max && adjust_delta > 0.0) || (v <= v_min && adjust_delta < 0.0));
    if (is_just_activated || is_already_past_limits_and_pushing_outward)
    {
        DragCurrentAccum = 0.0;
        DragCurrentAccumDirty = false;
    }
    else if (adjust_delta != 0.0)
    {
        DragCurrentAccum += adjust_delta;
        DragCurrentAccumDirty = true;
    }
    if (!DragCurrentAccumDirty)
        return false;

    var v_cur = v;
    var v_old_ref_for_accum_remainder = 0.0;
    var is_power = (power != 1.0 && (data_type == ImGuiDataType_Float || data_type == ImGuiDataType_Double) && has_min_max);
    if (is_power)
    {
        // Offset + round to user desired precision, with a curve on the v_min..v_max range to get more precision on one side of the range
        var v_old_norm_curved = ImPow((v_cur - v_min) / (v_max - v_min), 1.0 / power);
        var v_new_norm_curved = v_old_norm_curved + DragCurrentAccum / (v_max - v_min));
        v_cur = v_min + ImPow(ImSaturate(v_new_norm_curved), power) * (v_max - v_min);
        v_old_ref_for_accum_remainder = v_old_norm_curved;
    }
    else
    {
        v_cur += DragCurrentAccum;
    }
    // Round to user desired precision based on format string
    //v_cur = RoundScalarWithFormatT(format, data_type, v_cur);
    // Preserve remainder after rounding has been applied. This also allow slow tweaking of values.
    DragCurrentAccumDirty = false;
    if (is_power)
    {
        var v_cur_norm_curved = ImPow((v_cur - v_min) / (v_max - v_min), 1.0 / power);
        DragCurrentAccum -= (float)(v_cur_norm_curved - v_old_ref_for_accum_remainder);
    }
    else
    {
        DragCurrentAccum -= (float)(v_cur - v);
    }
    // Lose zero sign for float/double
    if (v_cur == -0)
        v_cur = 0;
    // Clamp values (handle overflow/wrap-around)
    if (v != v_cur && has_min_max)
    {
        if (v_cur < v_min || (v_cur > v && adjust_delta < 0.0))
            v_cur = v_min;
        if (v_cur > v_max || (v_cur < v && adjust_delta > 0.0))
            v_cur = v_max;
    }
    // Apply result
    if (v == v_cur)
        return false;

    v = v_cur;
    return true;
}

ImGui.DragBehavior = function(id, data_type, v, v_speed, v_min, v_max, format, power)
{
    // if (g.ActiveId == id)
    // {
    //     if (g.ActiveIdSource == ImGuiInputSource_Mouse && !io.MouseDown[0])
    //         ClearActiveID();
    //     else if (g.ActiveIdSource == ImGuiInputSource_Nav && g.NavActivatePressedId == id && !g.ActiveIdIsJustActivated)
    //         ClearActiveID();
    // }
    // if (g.ActiveId != id)
    //     return false;

    if (!ImGui.IsItemActive())
    {
        return false;
    }

    switch (data_type)
    {
    case ImGuiDataType_S32:    return ImGui.DragBehaviorT /*<ImS32, ImS32, float >*/(data_type, v,  v_speed, v_min ? v_min : IM_S32_MIN, v_max ? v_max : IM_S32_MAX, format, power);
    case ImGuiDataType_U32:    return ImGui.DragBehaviorT /*<ImU32, ImS32, float >*/(data_type, v,  v_speed, v_min ? v_min : IM_U32_MIN, v_max ? v_max : IM_U32_MAX, format, power);
    case ImGuiDataType_S64:    return ImGui.DragBehaviorT /*<ImS64, ImS64, double>*/(data_type, v,  v_speed, v_min ? v_min : IM_S64_MIN, v_max ? v_max : IM_S64_MAX, format, power);
    case ImGuiDataType_U64:    return ImGui.DragBehaviorT /*<ImU64, ImS64, double>*/(data_type, v,  v_speed, v_min ? v_min : IM_U64_MIN, v_max ? v_max : IM_U64_MAX, format, power);
    case ImGuiDataType_Float:  return ImGui.DragBehaviorT /*<float, float, float >*/(data_type, v,  v_speed, v_min ? v_min : -FLT_MAX,   v_max ? v_max : FLT_MAX,    format, power);
    case ImGuiDataType_Double: return ImGui.DragBehaviorT /*<double,double,double>*/(data_type, v,  v_speed, v_min ? v_min : -DBL_MAX,   v_max ? v_max : DBL_MAX,    format, power);
    case ImGuiDataType_COUNT:  break;
    }
    //IM_ASSERT(0);
    return false;
}

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
        var value = p_value();
        this.radius = _radius;
        if (flags & ImGuiKnobFlags.Logarithmic) {
            var v = ImMax(ImMin(value, v_max), v_min);
            this.t = (ImLog(ImAbs(v)) - ImLog(ImAbs(v_min))) / (ImLog(ImAbs(v_max)) - ImLog(ImAbs(v_min)));
        } else {
            this.t = (value - v_min) / (v_max - v_min);
        }
        var screen_pos = ImGui.GetCursorScreenPos();

        // Handle dragging
        ImGui.InvisibleButton(_label, {x:this.radius * 2.0, y:this.radius * 2.0});

        // Handle drag: if DragVertical or DragHorizontal flags are set, only the given direction is
        // used, otherwise use the drag direction with the highest delta
        var io = ImGui.GetIO();
        var drag_vertical =
                !(flags & ImGuiKnobFlags.DragHorizontal) &&
                (flags & ImGuiKnobFlags.DragVertical || ImAbs(io.MouseDelta.y) > ImAbs(io.MouseDelta.x));

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
        this.angle = this.angle_min + (this.angle_max - this.angle_min) * this.t;
        this.angle_cos = Math.cos(this.angle);
        this.angle_sin = Math.sin(this.angle);
    }

    draw_dot( size, radius, angle, color, filled, segments)
    {
        var dot_size = size * this.radius;
        var dot_radius = radius * this.radius;

        ImGui.GetWindowDrawList().AddCircleFilled(
                {x:this.center.x + Math.cos(angle) * dot_radius,
                    y:this.center.y + Math.sin(angle) * dot_radius},
                dot_size,
                ImGui.GetColorU32(this.is_active ? color.active : (this.is_hovered ? color.hovered : color.base)),
                segments
        );
    }

    draw_tick(start, end, width, angle, color)
    {
        var tick_start = start * this.radius;
        var tick_end = end * this.radius;
        var angle_cos = Math.cos(angle);
        var angle_sin = Math.sin(angle);

        ImGui.GetWindowDrawList().AddLine(
                {x:this.center.x + angle_cos * tick_end, 
                    y:this.center.y + angle_sin * tick_end},
                {x:this.center.x + angle_cos * tick_start,
                    y:this.center.y + angle_sin * tick_start},
                ImGui.GetColorU32(this.is_active ? color.active : (this.is_hovered ? color.hovered : color.base)),
                width * this.radius
            );
    }

    draw_circle(size, color, filled, segments) 
    {
        var circle_radius = size * this.radius;

        ImGui.GetWindowDrawList().AddCircleFilled(
                this.center,
                circle_radius,
                ImGui.GetColorU32(this.is_active ? color.active : (this.is_hovered ? color.hovered : color.base))
        );
    }

    draw_arc(radius, size, start_angle, end_angle, color)
    {
        var track_radius = radius * this.radius;
        var track_size = size * this.radius * 0.5 + 0.0001;

        ImGuiKnobs_detail.draw_arc(
            this.center, 
            track_radius, 
            start_angle, 
            end_angle, 
            track_size, 
            ImGui.GetColorU32(this.is_active ? color.active : (this.is_hovered ? color.hovered : color.base))
        );
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
        var value = p_value();
        var value_inRange = ImMax(ImMin(value, v_max), v_min); // this ensures that in the cornercase p_value is within the range
        if(value != value_inRange)
        {
            p_value(value_inRange);
        }
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

        ImGui.Text(label);
    }

    // Draw knob
    var k = new ImGuiKnobs_knob(label, data_type, p_value, v_min, v_max, speed, width * 0.5, format, flags, angle_min, angle_max);

    // Draw tooltip
    if (flags & ImGuiKnobFlags.ValueTooltip &&
        (ImGui.IsItemHovered(ImGui.HoveredFlags.AllowWhenDisabled) ||
            ImGui.IsItemActive())) {
        ImGui.BeginTooltip();
        ImGui.Text(format, p_value());
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
        var data = new Float32Array([p_value()]);
        var changed = ImGui.DragScalar("###knob_drag", /*data_type,*/ data, speed, v_min, v_max, format, drag_scalar_flags);
        if (changed) {
            k.value_changed = true;
            p_value(data[0]);
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

    return new color_set(colors[ImGui.Col.ButtonActive], colors[ImGui.Col.ButtonHovered], colors[ImGui.Col.ButtonHovered]);
}

ImGuiKnobs_detail.GetSecondaryColorSet = function()
{
    var colors = ImGui.GetStyle().Colors;
    var active = new ImGui.ImVec4(colors[ImGui.Col.ButtonActive].x * 0.5,
                            colors[ImGui.Col.ButtonActive].y * 0.5,
                            colors[ImGui.Col.ButtonActive].z * 0.5,
                            colors[ImGui.Col.ButtonActive].w);

    var hovered = new ImGui.ImVec4(colors[ImGui.Col.ButtonHovered].x * 0.5,
                            colors[ImGui.Col.ButtonHovered].y * 0.5,
                            colors[ImGui.Col.ButtonHovered].z * 0.5,
                            colors[ImGui.Col.ButtonHovered].w);

    return new color_set(active, hovered, hovered);
}

ImGuiKnobs_detail.GetTrackColorSet = function()
{
    var colors = ImGui.GetStyle().Colors;

    return new color_set(colors[ImGui.Col.Button], colors[ImGui.Col.Button], colors[ImGui.Col.Button]);
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


ImGuiKnobs_detail.testVal = 0;
function UpdateKnobTestWindow()
{
    ImGui.Begin("Knob Test");

    ImGuiKnobs.KnobInt("Knob Test", (_ = ImGuiKnobs_detail.testVal) => ImGuiKnobs_detail.testVal = _, 0, 100 );
    ImGui.End();
}