
function fmodf(a, b) { return a - (Math.floor(a / b) * b); }

var NodeImGui = {
	Canvases:{},
	BeginCanvas : function(id, size)
	{
        ImGui.BeginChild(id, size);
		NodeImGui.Current_CanvasImGuiId = ImGui.GetID(id);
		NodeImGui.Current_Canvas = NodeImGui.Canvases[NodeImGui.Current_CanvasImGuiId];
		if(NodeImGui.Current_Canvas == null)
		{
			NodeImGui.Current_Canvas = {};
			NodeImGui.Canvases[NodeImGui.Current_CanvasImGuiId] = NodeImGui.Current_Canvas;
		}

		NodeImGui.Current_Canvas.Nodes = {};
		NodeImGui.Current_Canvas.Links = [];
		NodeImGui.Current_Canvas.Current_NodeImGuiId = 0;
		NodeImGui.Current_Canvas.Current_Node = null;
		NodeImGui.Current_Canvas.Scrolling = {x:0, y:0};
	},
	BeginNode : function(id, name, node_x, node_y)
	{
		var canvas = NodeImGui.Current_Canvas;
		canvas.Current_NodeImGuiId = ImGui.GetID(id);
		canvas.Current_Node = canvas.Nodes[canvas.Current_NodeImGuiId];
		if(canvas.Current_Node == null)
		{
			canvas.Current_Node = {};
			canvas.Nodes[canvas.Current_NodeImGuiId] = canvas.Current_Node;
		}
		canvas.Current_Node.id = id;
		canvas.Current_Node.name = name;
		canvas.Current_Node.x = node_x;
		canvas.Current_Node.y = node_y;
		canvas.Current_Node.input_pins = [];
		canvas.Current_Node.output_pins = [];

		//Check if mouse is over the title bar area
		var node_screen_pos = this.Internal_GetNodeScreenPos(canvas.Current_Node);
		var node_title_size = this.Internal_GetNodeTitleSize(node);

		canvas.Current_Node.title_hovered = ImGui.IsMouseHoveringRect(node_screen_pos, node_title_size);
		//var mouse_screen_pos = ImGui.GetCursorPos();

	},
	InputPin : function(pin_id)
	{
		NodeImGui.Current_Canvas.Current_Node.input_pins.push(
			{
				id:pin_id
			}
		);
	},
	OutputPin : function(pin_id)
	{
		NodeImGui.Current_Canvas.Current_Node.output_pins.push(
			{
				id:pin_id
			}
		);
	},
	LinkNode : function(from_id, from_pin, to_pin)
	{
		var from_imgui_id = ImGui.GetID(from_id);
		NodeImGui.Current_Canvas.Links.push(
			{
				from_imgui_id:from_imgui_id,
				from_pin:from_pin,
				to_pin:to_pin,
				to_imgui_id:NodeImGui.Current_Canvas.Current_NodeImGuiId
			}
		);
	},
	EndNode : function()
	{
		NodeImGui.Current_Canvas.Current_Node = null;
	},
	Internal_GetNodeScreenPos : function(node)
	{
		return {
			x : node.x + ImGui.GetWindowPos().x + NodeImGui.Current_Canvas.Scrolling.x,
			y : node.y + ImGui.GetWindowPos().y + NodeImGui.Current_Canvas.Scrolling.y,
		};
	},
	Internal_GetNodeWidth : function(node)
	{
		return 170;
	},
	Internal_GetNodeTitleSize : function(node)
	{
		var title_height = 25;
		return {
			x:Internal_GetNodeWidth(node),
			y:title_height
		};
	},
	Internal_DrawNode : function(node)
	{
		var node_x = node.x;
		var node_y = node.y;

		var dl = ImGui.GetWindowDrawList();

		var num_inputs = node.input_pins.length;
		var num_outputs = node.output_pins.length;
		var max_pins = num_inputs > num_outputs ? num_inputs : num_outputs;
		var line_space = 20;

		var x = ImGui.GetWindowPos().x + NodeImGui.Current_Canvas.Scrolling.x;
		var y = ImGui.GetWindowPos().y + NodeImGui.Current_Canvas.Scrolling.y;
		node_x += x;
		node_y += y;
		var node_border = 5;
		var node_title_size = this.Internal_GetNodeTitleSize(node);
		var node_w = node_title_size.x;
		var title_height = node_title_size.y;
		var pin_diam = 8;
		var node_inner_x = node_x + node_border;
		var node_inner_y = node_y + title_height + node_border;
		var node_h = (max_pins * line_space) + title_height + (node_border * 1);

		var bg_col = new ImGui.ImColor(0.15, 0.15, 0.25, 1.00);
		var title_bg_col = new ImGui.ImColor(0.3, 0.3, 0.4, 1.00);
		var title_txt_col = new ImGui.ImColor(1.0, 1.0, 1.0, 1.00);
		var title_hovered_txt_col = new ImGui.ImColor(1.0, 0.5, 0.5, 1.00);
		var pin_col = new ImGui.ImColor(1.0, 1.0, 1.0, 1.00);
		var pin_inner_col = new ImGui.ImColor(0.0, 0.0, 0.0, 1.00);

		//background
		dl.AddRectFilled(new ImGui.Vec2(node_x, node_y), new ImGui.Vec2(node_x + node_w, node_y + node_h), bg_col.toImU32());
		//title bar
		dl.AddRectFilled(new ImGui.Vec2(node_x, node_y), new ImGui.Vec2(node_x + node_w, node_y + title_height), title_bg_col.toImU32());
		dl.AddText({x:node_inner_x, y:node_y+node_border}, node.title_hovered ? title_hovered_txt_col.toImU32() : title_txt_col.toImU32(), node.name);


		for(var i=0; i<num_inputs;++i)
		{
			var pin_text =  node.input_pins[i].id;
			var text_x = node_inner_x + pin_diam;
			var text_y = node_inner_y + (i*line_space); 
			var pin_x = node_inner_x;
			var pin_y = text_y + (ImGui.GetTextLineHeight() / 2.0);
			node.input_pins[i].x = pin_x;
			node.input_pins[i].y = pin_y;
			dl.AddCircleFilled({x:pin_x,y:pin_y}, pin_diam * 0.8, pin_col.toImU32(), 8);
			dl.AddCircleFilled({x:pin_x,y:pin_y}, pin_diam * 0.6, pin_inner_col.toImU32(), 8);
			dl.AddText({x:text_x, y:text_y}, title_txt_col.toImU32(), pin_text);
		}

		for(var i=0; i<num_outputs;++i)
		{
			var pin_text =  node.output_pins[i].id;
			var text_width = ImGui.CalcTextSize(pin_text).x;
			var text_y = node_inner_y + (i*line_space); 
			var text_x = node_x + node_w - node_border - text_width - pin_diam;
			var pin_y = text_y + (ImGui.GetTextLineHeight() / 2.0);
			var pin_x = node_x + node_w - node_border;
			node.output_pins[i].x = pin_x;
			node.output_pins[i].y = pin_y;
			dl.AddCircleFilled({x:pin_x,y:pin_y}, pin_diam * 0.8, pin_col.toImU32(), 8);
			dl.AddCircleFilled({x:pin_x,y:pin_y}, pin_diam * 0.6, pin_inner_col.toImU32(), 8);
			dl.AddText({x:text_x, y:text_y}, title_txt_col.toImU32(), pin_text);
		}
	},
	Internal_DrawLink : function(link)
	{
		var canvas = NodeImGui.Current_Canvas;
		var from_node = canvas.Nodes[link.from_imgui_id];
		var to_node = canvas.Nodes[link.to_imgui_id];

		var out_pin = null;
		for(var i=0; i<from_node.output_pins.length; ++i)
		{
			var from_out_pin = from_node.output_pins[i];
			if(from_out_pin.id == link.from_pin)
			{
				out_pin = from_out_pin;
				break;
			}
		}
		
		var in_pin = null;
		for(var i=0; i<to_node.input_pins.length; ++i)
		{
			var to_in_pin = to_node.input_pins[i];
			if(to_in_pin.id == link.to_pin)
			{
				in_pin = to_in_pin;
				break;
			}
		}

		var link_col = new ImGui.ImColor(0.7, 0.7, 0.7, 1.00);
		var link_thickness = 2.0;
		var sz = {value:150}
		var x = ImGui.GetWindowPos().x + 50;
		var y = ImGui.GetWindowPos().y + 50;
		var cp4 = [    
			{x:out_pin.x, y:out_pin.y},     
			{x:out_pin.x + 60, y:out_pin.y},
			{x:in_pin.x - 60, y:in_pin.y},
			{x:in_pin.x, y:in_pin.y}
		];

		var dl = ImGui.GetWindowDrawList();
		var curve_segments = 32;
		dl.AddBezierCubic(cp4[0], cp4[1], cp4[2], cp4[3], link_col.toImU32(), link_thickness, curve_segments);

	},
	EndCanvas : function()
	{
		var canvas = NodeImGui.Current_Canvas;
		var dl = ImGui.GetWindowDrawList();
		var canvas_sz = ImGui.GetContentRegionAvail();
		var canvas_p0 = ImGui.GetCursorScreenPos();
		var canvas_p1 = new ImGui.Vec2(canvas_p0.x + canvas_sz.x, canvas_p0.y + canvas_sz.y);

		//Draw BG
		dl.AddRectFilled(canvas_p0, canvas_p1, ImGui.COL32(50, 50, 50, 255));

		//Draw BG Grid
		var GRID_STEP = 64.0;
		for (var x = fmodf(canvas.Scrolling.x, GRID_STEP); x < canvas_sz.x; x += GRID_STEP)
		{
			dl.AddLine(new ImGui.Vec2(canvas_p0.x + x, canvas_p0.y), new ImGui.Vec2(canvas_p0.x + x, canvas_p1.y), ImGui.COL32(200, 200, 200, 40));
		}

		for (let y = fmodf(canvas.Scrolling.y, GRID_STEP); y < canvas_sz.y; y += GRID_STEP)
		{
			dl.AddLine(new ImGui.Vec2(canvas_p0.x, canvas_p0.y + y), new ImGui.Vec2(canvas_p1.x, canvas_p0.y + y), ImGui.COL32(200, 200, 200, 40));
		}
	
		//Draw Nodes
		for([node_id, node] of Object.entries(canvas.Nodes))
        {
			NodeImGui.Internal_DrawNode(node);
		}

		//Draw Links
		for(var i=0; i<canvas.Links.length; ++i)
		{
			NodeImGui.Internal_DrawLink(canvas.Links[i]);
		}

		NodeImGui.Current_Canvas = null;
        ImGui.EndChild();
	}
};