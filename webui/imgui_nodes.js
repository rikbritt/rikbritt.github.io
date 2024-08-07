
function fmodf(a, b) { return a - (Math.floor(a / b) * b); }

var NodeImGui = {
	Debug:true,
	Canvases:{},
	GetOrCreateCanvas : function(id)
	{
		var canvas = NodeImGui.Canvases[id];
		if(canvas == null)
		{
			//Data in here will persist across frames
			canvas =
			{
				dragging_node:null,
				dragging_node_offset:{x:0,y:0}, //Offset to where you clicked on the node
				dragging_pin_connection:null,
				context_menu_open:false,
				context_menu_pos:{x:0,y:0},
				selected_node_a:{name:"A", idx:0, input_pin:0,output_pin:0},
				selected_node_b:{name:"B", idx:0, input_pin:0,output_pin:0},
				c_x:0,
				c_y:0
			};
			NodeImGui.Canvases[id] = canvas;
		}
		return canvas;
	},
	Colours:{
		bg_col: new ImGui.ImColor(0.0, 0.0, 0.0, 1.00),
		title_bg_col: new ImGui.ImColor(0.4, 0.1, 0.1, 1.00),
		title_txt_col: new ImGui.ImColor(1.0, 1.0, 1.0, 1.00),
		title_hovered_txt_col: new ImGui.ImColor(1.0, 1.0, 0.5, 1.00),
		pin_col: new ImGui.ImColor(1.0, 1.0, 1.0, 1.00),
		pin_inner_col: new ImGui.ImColor(0.0, 0.0, 0.0, 1.00),
		link_col: new ImGui.ImColor(0.7, 0.7, 0.7, 1.00),
		link_hovered_col: new ImGui.ImColor(1.0, 1.0, 1.0, 1.00)
	},
	BeginCanvas : function(id, size, layout)
	{
		NodeImGui.Current_CanvasImGuiId = ImGui.GetID(id);
		NodeImGui.Current_Canvas = this.GetOrCreateCanvas(id);

		NodeImGui.Current_Canvas.Layout = layout;
		NodeImGui.Current_Canvas.Nodes = {};
		NodeImGui.Current_Canvas.NodesDrawOrder = [];
		NodeImGui.Current_Canvas.Links = [];
		NodeImGui.Current_Canvas.Current_NodeImGuiId = 0;
		NodeImGui.Current_Canvas.Current_Node = null;
		NodeImGui.Current_Canvas.Hovered_Node = null;
		NodeImGui.Current_Canvas.Hovered_Input = -1;
		NodeImGui.Current_Canvas.Hovered_Output = -1;
		NodeImGui.Current_Canvas.Scrolling = {x:0, y:0};

        ImGui.BeginChild(id, size);
		var cusor_pos = ImGui.GetCursorScreenPos();
		ImGui.InvisibleButton("canvas", size, ImGui.ButtonFlags.MouseButtonLeft | ImGui.ButtonFlags.MouseButtonRight);
		NodeImGui.Current_Canvas.Hovered = ImGui.IsItemHovered();
		ImGui.SetCursorScreenPos(cusor_pos);
	},
	BeginNode : function(id, name)
	{
		var canvas = NodeImGui.Current_Canvas;
		canvas.Current_NodeImGuiId = ImGui.GetID(id);
		canvas.Current_Node = NodeImGui.GetOrCreateNode(id);
		canvas.NodesDrawOrder.push(canvas.Current_Node);
		canvas.Current_Node.id = id;
		canvas.Current_Node.name = name;

		var node_layout = bg.FindOrCreateNodeLayout(canvas.Layout, id);
		canvas.Current_Node.x = node_layout.x;
		canvas.Current_Node.y = node_layout.y;
		canvas.Current_Node.input_pins = [];
		canvas.Current_Node.output_pins = [];

		var draw_info = {
			screen_pos: this.Internal_GetNodeScreenPos(canvas.Current_Node),
			node_title_size: this.Internal_GetNodeTitleSize(canvas.Current_Node),
			node_border:5,
			line_space:20,
			pin_radius:8
		};
		canvas.Current_Node.draw_info = draw_info;

		var node_screen_pos = draw_info.screen_pos;
		var node_title_size = draw_info.node_title_size;

		//Check if mouse is over the title bar area
		if(NodeImGui.Current_Canvas.Hovered && ImGui.IsMouseHoveringRect(node_screen_pos, {x:node_screen_pos.x + node_title_size.x, y:node_screen_pos.y + node_title_size.y}))
		{
			NodeImGui.Current_Canvas.Hovered_Node = canvas.Current_Node;

			//First frame drag starts, set which node we're dragging
			if(ImGui.IsMouseClicked(0))
			{
				NodeImGui.Current_Canvas.dragging_node = canvas.Current_Node;
				var mp = NodeImGui.Internal_GetMousePos();
				NodeImGui.Current_Canvas.dragging_node_offset.x = mp.x - canvas.Current_Node.x;
				NodeImGui.Current_Canvas.dragging_node_offset.y = mp.y - canvas.Current_Node.y;
			}
		}
	},
	SetNodePosToPopup : function(id)
	{
		var canvas = NodeImGui.Current_Canvas;
		var node = NodeImGui.GetOrCreateNode(id);
		var node_layout = bg.FindOrCreateNodeLayout(canvas.Layout, id);
		node_layout.x = canvas.context_menu_pos.x;
		node_layout.y = canvas.context_menu_pos.y;
	},
	GetOrCreateNode : function(id)
	{
		var canvas = NodeImGui.Current_Canvas;
		var node_imgui_id = ImGui.GetID(id);
		var node = canvas.Nodes[node_imgui_id];
		if(node == null)
		{
			node = {};
			canvas.Nodes[node_imgui_id] = node;
		}
		var node_layout = bg.FindOrCreateNodeLayout(canvas.Layout, id);
		return node;
	},
	InputPin : function(pin_id, pin_name, pin_data_type = "", can_connect_func = null)
	{
		if(pin_name == null)
		{
			pin_name = pin_id;
		}
		var node = NodeImGui.Current_Canvas.Current_Node;
		var input_pin = {
			id:pin_id,
			name:pin_name,
			data_type:pin_data_type
		};
		node.input_pins.push(input_pin);

		var input_pin_idx = node.input_pins.length - 1;
		var pin_rect = NodeImGui.Internal_CalcInputPinHitRect(node, input_pin_idx);
		input_pin.pin_rect = pin_rect;
		
		var pin_mid_y = pin_rect.y + (pin_rect.h / 2.0);
		input_pin.pin_circle_pos = {x:pin_rect.x + node.draw_info.pin_radius, y:pin_mid_y};
		input_pin.x = input_pin.pin_circle_pos.x;
		input_pin.y = input_pin.pin_circle_pos.y;

		var canvas = NodeImGui.Current_Canvas;
		var new_connection = null;
		if(canvas.Hovered && ImGui.IsMouseHoveringRect({x:pin_rect.x, y:pin_rect.y}, {x:pin_rect.x + pin_rect.w, y:pin_rect.y + pin_rect.h}))
		{
			canvas.Hovered_Input = input_pin_idx;
			canvas.Hovered_Input_Node = node;

			if(NodeImGui.Current_Canvas.dragging_pin_connection != null)
			{
				if( ImGui.IsMouseReleased(0))
				{
					var potential_connection = {...canvas.dragging_pin_connection}; //clone
					potential_connection.input_idx = input_pin_idx;
					potential_connection.input_node = node;
					if(NodeImGui.Internal_CanConnect(potential_connection))
					{
						new_connection = potential_connection;
						NodeImGui.Current_Canvas.dragging_pin_connection = null;
					}
				}
			}
			else if(ImGui.IsMouseClicked(0))
			{
				NodeImGui.Current_Canvas.dragging_pin_connection = {
					input_idx:input_pin_idx,
					input_node:node,
					output_idx:-1,
					output_node:null,
					can_connect_func:can_connect_func
				};
			}
		}

		return new_connection;
	},
	OutputPin : function(pin_id, pin_name, pin_data_type = "", can_connect_func = null)
	{
		if(pin_name == null)
		{
			pin_name = pin_id;
		}
		var node = NodeImGui.Current_Canvas.Current_Node;
		var output_pin = 
		{
			id:pin_id,
			name:pin_name,
			data_type:pin_data_type
		};
		node.output_pins.push(output_pin);
		var output_pin_idx = node.output_pins.length - 1;
		var pin_rect = NodeImGui.Internal_CalcOutputPinHitRect(node, output_pin_idx);
		output_pin.pin_rect = pin_rect;
		
		var pin_mid_y = pin_rect.y + (pin_rect.h / 2.0);
		output_pin.pin_circle_pos = {x:pin_rect.x + pin_rect.w - node.draw_info.pin_radius, y:pin_mid_y};
		output_pin.x = output_pin.pin_circle_pos.x;
		output_pin.y = output_pin.pin_circle_pos.y;

		var canvas = NodeImGui.Current_Canvas;
		var new_connection = null;
		if(canvas.Hovered && ImGui.IsMouseHoveringRect({x:pin_rect.x, y:pin_rect.y}, {x:pin_rect.x + pin_rect.w, y:pin_rect.y + pin_rect.h}))
		{
			canvas.Hovered_Output = output_pin_idx;
			canvas.Hovered_Output_Node = node;

			if(NodeImGui.Current_Canvas.dragging_pin_connection != null)
			{
				if(ImGui.IsMouseReleased(0))
				{
					var potential_connection = {...canvas.dragging_pin_connection}; //clone
					potential_connection.output_idx = output_pin_idx;
					potential_connection.output_node = node;
					if(NodeImGui.Internal_CanConnect(potential_connection))
					{
						new_connection = potential_connection;
						NodeImGui.Current_Canvas.dragging_pin_connection = null;
					}
				}
			}
			else if(ImGui.IsMouseClicked(0))
			{
				NodeImGui.Current_Canvas.dragging_pin_connection = {
					input_idx:-1,
					input_node:null,
					output_idx:output_pin_idx,
					output_node:node,
					can_connect_func:can_connect_func
				};
			}
		}
		return new_connection;
	},
	LinkNodes : function(from_id, from_pin, to_id, to_pin)
	{
		var canvas = NodeImGui.Current_Canvas;
		var from_imgui_id = ImGui.GetID(from_id);
		var to_imgui_id = ImGui.GetID(to_id);

		var link = 
		{
			from_imgui_id:from_imgui_id,
			from_pin:from_pin,
			to_pin:to_pin,
			to_imgui_id:to_imgui_id,
			hovered:false
		};

		var ret = true;

		var cp4 = NodeImGui.Internal_GetLinkCPs(link);
		var link_middle_pos = bg.CubicBezier2D( 0.5, cp4[0], cp4[1], cp4[2], cp4[3] );
		if(canvas.Hovered && ImGui.IsMouseHoveringRect({x:link_middle_pos.x - 4, y:link_middle_pos.y - 4},
			 {x:link_middle_pos.x + 4, y:link_middle_pos.y + 4}))
		{
			link.hovered = true;
			if(ImGui.IsMouseClicked(0))
			{
				if(ImGui.GetIO().KeyShift)
				{
					ret = false;
				}
			}
		}

		NodeImGui.Current_Canvas.Links.push(link);

		return ret;
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
		return 270;
	},
	Internal_GetNodeTitleSize : function(node)
	{
		var title_height = 25;
		return {
			x:NodeImGui.Internal_GetNodeWidth(node),
			y:title_height
		};
	},
	//Top left coord for the pin
	Internal_CalcInputPinPos : function(node, pin_idx)
	{
		var node_title_size = node.draw_info.node_title_size;
		var node_screen_pos = node.draw_info.screen_pos;

		var title_height = node_title_size.y;
		var node_inner_x = node_screen_pos.x + node.draw_info.node_border;
		var node_inner_y = node_screen_pos.y + title_height + node.draw_info.node_border;
		var text_y = node_inner_y + (pin_idx * node.draw_info.line_space); 
		var pin_x = node_inner_x;
		var pin_y = text_y;// + (ImGui.GetTextLineHeight() / 2.0);
		return {x:pin_x, y:pin_y};
	},
	//Middle of the pin circle
	Internal_CalcInputPinCentrePos : function(node, pin_idx)
	{
		var pin_pos = NodeImGui.Internal_CalcInputPinPos(node, pin_idx);
		return {x:pin_pos.x + node.draw_info.pin_radius, y:pin_pos.y + node.draw_info.pin_radius};
	},
	Internal_CalcInputPinHitRect : function(node, pin_idx)
	{
		var draw_info = node.draw_info;
		var ret = NodeImGui.Internal_CalcInputPinPos(node, pin_idx);
		var pin_text =  node.input_pins[pin_idx].name;
		var text_width = ImGui.CalcTextSize(pin_text).x;
		ret.w = text_width + (draw_info.pin_radius * 2);
		ret.h = ImGui.GetTextLineHeight();
		return ret;
	},
	Internal_CalcOutputPinPos : function(node, pin_idx)
	{
		var draw_info = node.draw_info;
		var node_title_size = draw_info.node_title_size;
		var node_screen_pos = draw_info.screen_pos;

		var pin_text =  node.output_pins[pin_idx].name;
		var text_width = ImGui.CalcTextSize(pin_text).x;
		var title_height = node_title_size.y;
		var node_inner_x = node_screen_pos.x + draw_info.node_border;
		var node_inner_y = node_screen_pos.y + title_height + draw_info.node_border;
		var text_y = node_inner_y + (pin_idx * draw_info.line_space); 
		var pin_x = node_inner_x + draw_info.node_title_size.x - text_width - draw_info.node_border - (draw_info.pin_radius * 2);
		var pin_y = text_y;
		return {x:pin_x, y:pin_y};
	},
	//Middle of the pin circle
	Internal_CalcOutputPinCentrePos : function(node, pin_idx)
	{
		var pin_rect = NodeImGui.Internal_CalcOutputPinHitRect(node, pin_idx);
		return {x:pin_rect.x + pin_rect.w - node.draw_info.pin_radius, y:pin_rect.y + node.draw_info.pin_radius};
	},
	Internal_CalcOutputPinHitRect : function(node, pin_idx)
	{
		var draw_info = node.draw_info;
		var ret = NodeImGui.Internal_CalcOutputPinPos(node, pin_idx);
		
		var node_screen_pos = draw_info.screen_pos;
		var node_inner_x = node_screen_pos.x + draw_info.node_border;
		var pin_right = node_inner_x + draw_info.node_title_size.x - draw_info.node_border;
		ret.w = pin_right - ret.x;

		ret.h = ImGui.GetTextLineHeight();
		return ret;
	},
	Internal_CalcNodeScreenPos : function(node)
	{
		var node_x = node.x;
		var node_y = node.y;
		var x = ImGui.GetWindowPos().x + NodeImGui.Current_Canvas.Scrolling.x;
		var y = ImGui.GetWindowPos().y + NodeImGui.Current_Canvas.Scrolling.y;
		node_x += x;
		node_y += y;
		return {x:node_x, y:node_y};
	},
	Internal_CalcNodeInnerPos : function(node)
	{
		var node_screen_pos = x = NodeImGui.Internal_CalcNodeScreenPos(node);
		var node_title_size = NodeImGui.Internal_GetNodeTitleSize(node);
		var title_height = node_title_size.y;
		var node_inner_x = node_screen_pos.x + node.draw_info.node_border;
		var node_inner_y = node_screen_pos.y + title_height + node.draw_info.node_border;
		return {x:node_inner_x, y:node_inner_y};
	},
	Internal_AddPinTooltip : function(node, pin)
	{
		ImGui.BeginTooltip();
		ImGui.PushTextWrapPos(ImGui.GetFontSize() * 35.0);
		ImGui.TextUnformatted(pin.name);
		ImGui.TextUnformatted(`<${pin.data_type}>`);
		ImGui.PopTextWrapPos();
		ImGui.EndTooltip();
	},
	//Note - doesn't check a node against itself, just pin types
	Internal_CanConnectPins : function(out_pin, in_pin)
	{
		if(out_pin == null || in_pin == null)
		{
			return false;
		}
		return out_pin.data_type == in_pin.data_type;
	},
	Internal_CanConnect : function(connection)
	{
		if(connection.output_node == null)
		{
			return false;
		}

		if(connection.input_node == null)
		{
			return false;
		}

		// Don't link a node to itself
		if(connection.input_node.id == connection.output_node.id)
		{
			return false;
		}
		var in_pin = connection.input_node.input_pins[connection.input_idx];
		var out_pin = connection.output_node.output_pins[connection.output_idx];

		if(connection.can_connect_func)
		{
			if(connection.can_connect_func(connection) == false)
			{
				return false;
			}
		}

		return NodeImGui.Internal_CanConnectPins(out_pin, in_pin)
	},
	Internal_GetPinTextColour : function(node, input_pin_idx, output_pin_idx)
	{
		var canvas = NodeImGui.Current_Canvas;
		var pin_hovered = (canvas.Hovered_Input_Node == node && canvas.Hovered_Input == input_pin_idx)
						|| (canvas.Hovered_Output_Node == node && canvas.Hovered_Output == output_pin_idx);

		var pin_text_col = (new ImGui.ImColor(1.0, 1.0, 1.0, 1.00)).toImU32();
		if(canvas.dragging_pin_connection != null)
		{
			var can_connect = false;
			if(canvas.dragging_pin_connection.output_node != null && input_pin_idx >= 0)
			{
				var potential_connection = {...canvas.dragging_pin_connection}; //clone
				potential_connection.input_idx = input_pin_idx;
				potential_connection.input_node = node;
				if(NodeImGui.Internal_CanConnect(potential_connection))
				{
					can_connect = true;
				}
			}
			else if(canvas.dragging_pin_connection.input_node != null && output_pin_idx >= 0)
			{
				var potential_connection = {...canvas.dragging_pin_connection}; //clone
				potential_connection.output_idx = output_pin_idx;
				potential_connection.output_node = node;
				if(NodeImGui.Internal_CanConnect(potential_connection))
				{
					can_connect = true;
				}
			}
			if(can_connect)
			{
				pin_text_col = (new ImGui.ImColor(0.00, 1.00, 0.25, 1.00)).toImU32();
			}
			else
			{
				pin_text_col = (new ImGui.ImColor(1.00, 0.15, 0.25, 1.00)).toImU32();
			}
		}
		if(pin_hovered)
		{
			pin_text_col = (new ImGui.ImColor(1.0, 0.5, 0.5, 1.00)).toImU32();
		}
		return pin_text_col;
	},
	Internal_DrawNode : function(node)
	{
		var node_x = node.x;
		var node_y = node.y;

		var dl = ImGui.GetWindowDrawList();
		var draw_info = node.draw_info;
		var canvas = NodeImGui.Current_Canvas;

		var num_inputs = node.input_pins.length;
		var num_outputs = node.output_pins.length;
		var max_pins = num_inputs > num_outputs ? num_inputs : num_outputs;

		var x = ImGui.GetWindowPos().x + canvas.Scrolling.x;
		var y = ImGui.GetWindowPos().y + canvas.Scrolling.y;
		node_x += x;
		node_y += y;
		var node_title_size = NodeImGui.Internal_GetNodeTitleSize(node);
		var node_w = node_title_size.x;
		var title_height = node_title_size.y;

		var node_inner_pos = NodeImGui.Internal_CalcNodeInnerPos(node)
		var node_inner_x = node_inner_pos.x;
		var node_inner_y = node_inner_pos.y;
		var node_h = (max_pins * draw_info.line_space) + title_height + (draw_info.node_border * 1);

		var bg_col = NodeImGui.Colours.bg_col;
		var title_bg_col = NodeImGui.Colours.title_bg_col;
		var title_txt_col = NodeImGui.Colours.title_txt_col;
		var title_hovered_txt_col = NodeImGui.Colours.title_hovered_txt_col;
		var pin_col = NodeImGui.Colours.pin_col;
		var pin_inner_col = NodeImGui.Colours.pin_inner_col;

		//background
		dl.AddRectFilled(new ImGui.Vec2(node_x, node_y), new ImGui.Vec2(node_x + node_w, node_y + node_h), bg_col.toImU32());
		//title bar
		dl.AddRectFilled(new ImGui.Vec2(node_x, node_y), new ImGui.Vec2(node_x + node_w, node_y + title_height), title_bg_col.toImU32());
		dl.AddText({x:node_inner_x, y:node_y + draw_info.node_border}, canvas.Hovered_Node == node ? title_hovered_txt_col.toImU32() : title_txt_col.toImU32(), node.name);

		for(var i=0; i<num_inputs;++i)
		{
			var pin_rect = node.input_pins[i].pin_rect;
			var pin_circle_pos = node.input_pins[i].pin_circle_pos;

			//var c= canvas.Hovered_Node == node && canvas.Hovered_Input == i ? title_txt_col.toImU32() : title_bg_col.toImU32();
			//dl.AddRectFilled(new ImGui.Vec2(pin_rect.x, pin_rect.y), new ImGui.Vec2(pin_rect.x + pin_rect.w, pin_rect.y + pin_rect.h), c);

			dl.AddCircleFilled(pin_circle_pos, draw_info.pin_radius * 0.8, pin_col.toImU32(), 8);
			dl.AddCircleFilled(pin_circle_pos, draw_info.pin_radius * 0.6, pin_inner_col.toImU32(), 8);

			var pin_text =  node.input_pins[i].name;
			var pin_text_pos = {x:pin_rect.x + (draw_info.pin_radius * 2.0), y:pin_rect.y};
			var pin_hovered = canvas.Hovered_Input_Node == node && canvas.Hovered_Input == i;

			var pin_text_col = NodeImGui.Internal_GetPinTextColour(node, i, -1);
			dl.AddText(pin_text_pos, pin_text_col, pin_text);

			if(pin_hovered)
			{
				NodeImGui.Internal_AddPinTooltip(node, node.input_pins[i]);
			}
		}

		for(var i=0; i<num_outputs;++i)
		{
			var pin_rect = node.output_pins[i].pin_rect;
			var pin_circle_pos = node.output_pins[i].pin_circle_pos;
			
			//var c= canvas.Hovered_Node == node && canvas.Hovered_Output == i ? title_txt_col.toImU32() : title_bg_col.toImU32();
			//dl.AddRectFilled(new ImGui.Vec2(pin_rect.x, pin_rect.y), new ImGui.Vec2(pin_rect.x + pin_rect.w, pin_rect.y + pin_rect.h), c);

			dl.AddCircleFilled(pin_circle_pos, draw_info.pin_radius * 0.8, pin_col.toImU32(), 8);
			dl.AddCircleFilled(pin_circle_pos, draw_info.pin_radius * 0.6, pin_inner_col.toImU32(), 8);
			
			var pin_text =  node.output_pins[i].name;
			var pin_text_pos = {x:pin_rect.x, y:pin_rect.y};
			var pin_hovered = canvas.Hovered_Output_Node == node && canvas.Hovered_Output == i;
			var pin_text_col = NodeImGui.Internal_GetPinTextColour(node, -1, i);
			dl.AddText(pin_text_pos, pin_text_col, pin_text);

			if(pin_hovered)
			{
				NodeImGui.Internal_AddPinTooltip(node, node.output_pins[i]);
			}
		}
	},
	Internal_GetLinkCPs : function(link)
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
		var cp4 = [    
			{x:out_pin.x, y:out_pin.y},     
			{x:out_pin.x + 60, y:out_pin.y},
			{x:in_pin.x - 60, y:in_pin.y},
			{x:in_pin.x, y:in_pin.y}
		];

		return cp4;
	},
	Internal_DrawLink : function(link)
	{
		var canvas = NodeImGui.Current_Canvas;
		var link_col = NodeImGui.Colours.link_col;
		if(link.hovered)
		{
			link_col = NodeImGui.Colours.link_hovered_col;
		}
		var link_thickness = 2.0;
		var sz = {value:150}
		var x = ImGui.GetWindowPos().x + 50;
		var y = ImGui.GetWindowPos().y + 50;

		var cp4 = NodeImGui.Internal_GetLinkCPs(link);

		var dl = ImGui.GetWindowDrawList();
		var curve_segments = 32;
		dl.AddBezierCubic(cp4[0], cp4[1], cp4[2], cp4[3], link_col.toImU32(), link_thickness, curve_segments);

		var link_middle_pos = bg.CubicBezier2D( 0.5, cp4[0], cp4[1], cp4[2], cp4[3] );
		dl.AddCircleFilled(link_middle_pos, 5.0, link_col.toImU32(), 8);
	},
	Internal_GetMousePos : function()
	{
		var mouse_pos = ImGui.GetMousePos();
		var canvas_p0 = ImGui.GetCursorScreenPos();
		mouse_pos.x -= canvas_p0.x;
		mouse_pos.y -= canvas_p0.y;
		return mouse_pos;
	},
	BeginPopupContextWindow : function()
	{
		var canvas = NodeImGui.Current_Canvas;
		var mp = NodeImGui.Internal_GetMousePos(); //Capture before popup
		var open = ImGui.BeginPopupContextWindow();
		if(open && canvas.context_menu_open != open)
		{
			canvas.context_menu_pos = mp;
		}
		canvas.context_menu_open = open;
		return open;
	},
	EndPopup : function()
	{
		ImGui.EndPopup();
	},
	EndCanvas : function()
	{
		var canvas = NodeImGui.Current_Canvas;
		var dl = ImGui.GetWindowDrawList();
		var canvas_sz = ImGui.GetContentRegionAvail();
		var canvas_p0 = ImGui.GetCursorScreenPos();
		var canvas_p1 = new ImGui.Vec2(canvas_p0.x + canvas_sz.x, canvas_p0.y + canvas_sz.y);
		var mp = NodeImGui.Internal_GetMousePos();

		//When mouse is released, stop dragging
		if(ImGui.IsMouseDown(0) == false)
		{
			canvas.dragging_node = null;
			canvas.dragging_pin_connection = null;
		}

		//Update Node Dragging
		if(canvas.dragging_node != null)
		{
			var node_layout = bg.FindOrCreateNodeLayout(canvas.Layout, canvas.dragging_node.id);
			node_layout.x = mp.x - canvas.dragging_node_offset.x;
			node_layout.y = mp.y - canvas.dragging_node_offset.y;
		}

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
		for(var i=0; i<canvas.NodesDrawOrder.length; ++i)
        {
			var node = canvas.NodesDrawOrder[i];
			NodeImGui.Internal_DrawNode(node);
		}

		//Draw Links
		for(var i=0; i<canvas.Links.length; ++i)
		{
			NodeImGui.Internal_DrawLink(canvas.Links[i]);
		}

		//Draw Debug
		if(NodeImGui.Debug)
		{
			dl.AddText(new ImGui.Vec2(canvas_p0.x + 20, canvas_p0.y + 20),0xffffffff, "Node Debug Text " + mp.x + " " + mp.y + "\n" + canvas.context_menu_pos.x + " " + canvas.context_menu_pos.y);
		}


		//Draw Pin Linking
		if(canvas.dragging_pin_connection != null)
		{
			var from_pos = {x:canvas_p0.x + mp.x, y:canvas_p0.y + mp.y};
			var to_pos = {x:canvas_p0.x + mp.x, y:canvas_p0.y + mp.y};
			if(canvas.dragging_pin_connection.input_node != null)
			{
				to_pos = NodeImGui.Internal_CalcInputPinCentrePos(canvas.dragging_pin_connection.input_node, canvas.dragging_pin_connection.input_idx);
			}
			if(canvas.dragging_pin_connection.output_node != null)
			{
				from_pos = NodeImGui.Internal_CalcOutputPinCentrePos(canvas.dragging_pin_connection.output_node, canvas.dragging_pin_connection.output_idx);
			}
			dl.AddLine(from_pos, to_pos, ImGui.COL32(255, 255, 255, 255));
		}

		NodeImGui.Current_Canvas = null;
        ImGui.EndChild();
	}
};