var IMGUIKNOBS_PI = 3.14159265358979323846;

var ImGuiKnobFlags = {
    NoTitle = 1 << 0,
    NoInput = 1 << 1,
    ValueTooltip = 1 << 2,
    DragHorizontal = 1 << 3,
    DragVertical = 1 << 4,
    Logarithmic = 1 << 5,
    AlwaysClamp = 1 << 6
};

var ImGuiKnobVariant = {
    Tick = 1 << 0,
    Dot = 1 << 1,
    Wiper = 1 << 2,
    WiperOnly = 1 << 3,
    WiperDot = 1 << 4,
    Stepped = 1 << 5,
    Space = 1 << 6,
};

var ImGuiKnobs  = {};

    // struct color_set {
    //     ImColor base;
    //     ImColor hovered;
    //     ImColor active;

    //     color_set(ImColor base, ImColor hovered, ImColor active)
    //         : base(base), hovered(hovered), active(active) {}

    //     color_set(ImColor color) {
    //         base = color;
    //         hovered = color;
    //         active = color;
    //     }
    // };


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
        if (flags & ImGuiKnobFlags_Logarithmic) {
            var v = ImMax(ImMin(p_value, v_max), v_min);
            this.t = (ImLog(ImAbs(v)) - ImLog(ImAbs(v_min))) / (ImLog(ImAbs(v_max)) - ImLog(ImAbs(v_min)));
        } else {
            this.t = (p_value - v_min) / (v_max - v_min);
        }
        var screen_pos = ImGui.GetCursorScreenPos();

        // Handle dragging
        ImGui.InvisibleButton(_label, {x:radius * 2.0, y:radius * 2.0});

        // Handle drag: if DragVertical or DragHorizontal flags are set, only the given direction is
        // used, otherwise use the drag direction with the highest delta
        var io = ImGui.GetIO();
        var drag_vertical =
                !(flags & ImGuiKnobFlags_DragHorizontal) &&
                (flags & ImGuiKnobFlags_DragVertical || ImAbs(io.MouseDelta[ImGuiAxis_Y]) > ImAbs(io.MouseDelta[ImGuiAxis_X]));

        var gid = ImGui.GetID(_label);
        var drag_behaviour_flags = 0;
        if (drag_vertical) {
            drag_behaviour_flags |= ImGuiSliderFlags_Vertical;
        }
        if (flags & ImGuiKnobFlags_AlwaysClamp) {
            drag_behaviour_flags |= ImGuiSliderFlags_AlwaysClamp;
        }
        if (flags & ImGuiKnobFlags_Logarithmic) {
            drag_behaviour_flags |= ImGuiSliderFlags_Logarithmic;
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

        this.center = {x:screen_pos[0] + radius, y:screen_pos[1] + radius};
        this.is_active = ImGui.IsItemActive();
        this.is_hovered = ImGui.IsItemHovered();
        this.angle = angle_min + (angle_max - angle_min) * t;
        this.angle_cos = cosf(angle);
        this.angle_sin = sinf(angle);
    }

    draw_dot( size, radius, angle, color, filled, segments)
    {
        var dot_size = size * this.radius;
        var dot_radius = radius * this.radius;

        ImGui.GetWindowDrawList().AddCircleFilled(
                {x:center[0] + cosf(angle) * dot_radius,
                    y:center[1] + sinf(angle) * dot_radius},
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
                {x:center[0] + angle_cos * tick_end, y:center[1] + angle_sin * tick_end},
                {x:center[0] + angle_cos * tick_start,
                    y:center[1] + angle_sin * tick_start},
                is_active ? color.active : (is_hovered ? color.hovered : color.base),
                width * radius);
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
                angle_max) {
            if (flags & ImGuiKnobFlags_Logarithmic && v_min <= 0.0 && v_max >= 0.0) {
                // we must handle the cornercase if a client specifies a logarithmic range that contains zero
                // for this we clamp lower limit to avoid hitting zero like it is done in ImGui::SliderBehaviorT
                const bool is_floating_point = (data_type == ImGuiDataType_Float) || (data_type == ImGuiDataType_Double);
                const int decimal_precision = is_floating_point ? ImParseFormatPrecision(format, 3) : 1;
                v_min = ImPow(0.1f, (float) decimal_precision);
                v_max = ImMax(v_min, v_max); // this ensures that in the cornercase v_max is still at least ge v_min
                *p_value = ImMax(ImMin(*p_value, v_max), v_min); // this ensures that in the cornercase p_value is within the range
            }

            auto speed = _speed == 0 ? (v_max - v_min) / 250.f : _speed;
            ImGui::PushID(label);
            auto width = size == 0 ? ImGui::GetTextLineHeight() * 4.0f : size * ImGui::GetIO().FontGlobalScale;
            ImGui::PushItemWidth(width);

            ImGui::BeginGroup();

            // There's an issue with `SameLine` and Groups, see
            // https://github.com/ocornut/imgui/issues/4190. This is probably not the best
            // solution, but seems to work for now
            ImGui::GetCurrentWindow()->DC.CurrLineTextBaseOffset = 0;

            // Draw title
            if (!(flags & ImGuiKnobFlags_NoTitle)) {
                auto title_size = ImGui::CalcTextSize(label, NULL, false, width);

                // Center title
                ImGui::SetCursorPosX(ImGui::GetCursorPosX() +
                                        (width - title_size[0]) * 0.5f);

                ImGui::Text("%s", label);
            }

            // Draw knob
            knob<DataType> k(label, data_type, p_value, v_min, v_max, speed, width * 0.5f, format, flags, angle_min, angle_max);

            // Draw tooltip
            if (flags & ImGuiKnobFlags_ValueTooltip &&
                (ImGui::IsItemHovered(ImGuiHoveredFlags_AllowWhenDisabled) ||
                    ImGui::IsItemActive())) {
                ImGui::BeginTooltip();
                ImGui::Text(format, *p_value);
                ImGui::EndTooltip();
            }

            // Draw input
            if (!(flags & ImGuiKnobFlags_NoInput)) {
                ImGuiSliderFlags drag_scalar_flags = 0;
                if (flags & ImGuiKnobFlags_AlwaysClamp) {
                    drag_scalar_flags |= ImGuiSliderFlags_AlwaysClamp;
                }
                if (flags & ImGuiKnobFlags_Logarithmic) {
                    drag_scalar_flags |= ImGuiSliderFlags_Logarithmic;
                }
                auto changed = ImGui::DragScalar("###knob_drag", data_type, p_value, speed, &v_min, &v_max, format, drag_scalar_flags);
                if (changed) {
                    k.value_changed = true;
                }
            }

            ImGui::EndGroup();
            ImGui::PopItemWidth();
            ImGui::PopID();

            return k;
        }

        color_set GetPrimaryColorSet() {
            auto *colors = ImGui::GetStyle().Colors;

            return {colors[ImGuiCol_ButtonActive], colors[ImGuiCol_ButtonHovered], colors[ImGuiCol_ButtonHovered]};
        }

        color_set GetSecondaryColorSet() {
            auto *colors = ImGui::GetStyle().Colors;
            auto active = ImVec4(colors[ImGuiCol_ButtonActive].x * 0.5f,
                                    colors[ImGuiCol_ButtonActive].y * 0.5f,
                                    colors[ImGuiCol_ButtonActive].z * 0.5f,
                                    colors[ImGuiCol_ButtonActive].w);

            auto hovered = ImVec4(colors[ImGuiCol_ButtonHovered].x * 0.5f,
                                    colors[ImGuiCol_ButtonHovered].y * 0.5f,
                                    colors[ImGuiCol_ButtonHovered].z * 0.5f,
                                    colors[ImGuiCol_ButtonHovered].w);

            return {active, hovered, hovered};
        }

        color_set GetTrackColorSet() {
            auto *colors = ImGui::GetStyle().Colors;

            return {colors[ImGuiCol_Button], colors[ImGuiCol_Button], colors[ImGuiCol_Button]};
        }
    }// namespace detail

    template<typename DataType>
    bool BaseKnob(
            const char *label,
            ImGuiDataType data_type,
            DataType *p_value,
            DataType v_min,
            DataType v_max,
            float speed,
            const char *format,
            ImGuiKnobVariant variant,
            float size,
            ImGuiKnobFlags flags,
            int steps,
            float angle_min,
            float angle_max) {
        auto knob = detail::knob_with_drag(
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
            case ImGuiKnobVariant_Tick: {
                knob.draw_circle(0.85f, detail::GetSecondaryColorSet(), true, 32);
                knob.draw_tick(0.5f, 0.85f, 0.08f, knob.angle, detail::GetPrimaryColorSet());
                break;
            }
            case ImGuiKnobVariant_Dot: {
                knob.draw_circle(0.85f, detail::GetSecondaryColorSet(), true, 32);
                knob.draw_dot(0.12f, 0.6f, knob.angle, detail::GetPrimaryColorSet(), true, 12);
                break;
            }

            case ImGuiKnobVariant_Wiper: {
                knob.draw_circle(0.7f, detail::GetSecondaryColorSet(), true, 32);
                knob.draw_arc(0.8f, 0.41f, knob.angle_min, knob.angle_max, detail::GetTrackColorSet());

                if (knob.t > 0.01f) {
                    knob.draw_arc(0.8f, 0.43f, knob.angle_min, knob.angle, detail::GetPrimaryColorSet());
                }
                break;
            }
            case ImGuiKnobVariant_WiperOnly: {
                knob.draw_arc(0.8f, 0.41f, knob.angle_min, knob.angle_max, detail::GetTrackColorSet());

                if (knob.t > 0.01) {
                    knob.draw_arc(0.8f, 0.43f, knob.angle_min, knob.angle, detail::GetPrimaryColorSet());
                }
                break;
            }
            case ImGuiKnobVariant_WiperDot: {
                knob.draw_circle(0.6f, detail::GetSecondaryColorSet(), true, 32);
                knob.draw_arc(0.85f, 0.41f, knob.angle_min, knob.angle_max, detail::GetTrackColorSet());
                knob.draw_dot(0.1f, 0.85f, knob.angle, detail::GetPrimaryColorSet(), true, 12);
                break;
            }
            case ImGuiKnobVariant_Stepped: {
                for (auto n = 0.f; n < steps; n++) {
                    auto a = n / (steps - 1);
                    auto angle = knob.angle_min + (knob.angle_max - knob.angle_min) * a;
                    knob.draw_tick(0.7f, 0.9f, 0.04f, angle, detail::GetPrimaryColorSet());
                }

                knob.draw_circle(0.6f, detail::GetSecondaryColorSet(), true, 32);
                knob.draw_dot(0.12f, 0.4f, knob.angle, detail::GetPrimaryColorSet(), true, 12);
                break;
            }
            case ImGuiKnobVariant_Space: {
                knob.draw_circle(0.3f - knob.t * 0.1f, detail::GetSecondaryColorSet(), true, 16);

                if (knob.t > 0.01f) {
                    knob.draw_arc(0.4f, 0.15f, knob.angle_min - 1.0f, knob.angle - 1.0f, detail::GetPrimaryColorSet());
                    knob.draw_arc(0.6f, 0.15f, knob.angle_min + 1.0f, knob.angle + 1.0f, detail::GetPrimaryColorSet());
                    knob.draw_arc(0.8f, 0.15f, knob.angle_min + 3.0f, knob.angle + 3.0f, detail::GetPrimaryColorSet());
                }
                break;
            }
        }

        return knob.value_changed;
    }
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
        ImGuiDataType_Float,
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
            /*ImGuiKnobVariant*/    variant = ImGuiKnobVariant_Tick,
            /*float           */    size = 0,
            /*ImGuiKnobFlags  */    flags = 0,
            /*int             */    steps = 10,
            /*float           */    angle_min = -1,
            /*float           */    angle_max = -1
        )
{

    return BaseKnob(
        label,
        ImGuiDataType_S32,
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