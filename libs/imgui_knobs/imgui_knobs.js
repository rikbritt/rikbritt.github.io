

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
        ) { }

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
        ) { }