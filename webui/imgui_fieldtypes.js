//Editors for field types registered with bg.CreateFieldType
gFieldTypesImGui = {};

function UpdateEditorForValue(name, field_type_id, field_data, get_func, set_func)
{
    var field_imgui = gFieldTypesImGui[field_type_id];
	if(field_imgui != null)
	{
		field_imgui.edit_value_imgui(name, field_data, get_func, set_func);
	}
	else
	{
		ImGui.Text(`Unknown value type '${field_data.type}' for '${name}'`);
	}
}

//imgui_edit_field_func = add imgui controls to edit the field setup (min/max/etc)
//imgui_edit_val_func = add imgui contrlols to edit a value of an instance of the field
function SetupFieldTypeImGui(field_type, imgui_edit_field_func, imgui_edit_val_func)
{
    if(bg.fieldTypes[field_type] == null)
    {
		console.error(`Couldn't find field type '${field_type}`);
        return false;
    }

    gFieldTypesImGui[field_type] = 
    {
        edit_field_imgui:imgui_edit_field_func,
        edit_value_imgui:imgui_edit_val_func
    };

    return true;
}

function Field_FloatMinMaxEdit(field_name, field_data)
{
    var width = ImGui.CalcItemWidth()/2;
    ImGui.SetNextItemWidth(width);
	ImGui.SliderFloat(`Min##${field_name}`, (_ = field_data.min) => field_data.min = _, 0, 1000);
    ImGui.SameLine();
    ImGui.SetNextItemWidth(width);
	ImGui.SliderFloat(`Max##${field_name}`, (_ = field_data.max) => field_data.max = _, 0, 1000);		
}

function FieldVal_FloatEdit(field_name, field_data, get_func, set_func)
{
    ImGui.SetNextItemWidth(-1);
    ImGui.SliderFloat(`##${field_name}`, (_ = get_func()) => set_func(_), field_data.min, field_data.max);		
}

function Field_IntMinMaxEdit(field_name, field_data)
{
    var width = ImGui.CalcItemWidth()/2;
    ImGui.SetNextItemWidth(width);
	ImGui.SliderInt(`Min##${field_name}`, (_ = field_data.min) => field_data.min = _, 0, 1000);
    ImGui.SameLine();
    ImGui.SetNextItemWidth(width);
	ImGui.SliderInt(`Max##${field_name}`, (_ = field_data.max) => field_data.max = _, 0, 1000);		
}
function FieldVal_IntEdit(field_name, field_data, get_func, set_func)
{
    ImGui.SetNextItemWidth(-1);
    ImGui.SliderInt(`##${field_name}`, (_ = get_func()) => set_func(_), field_data.min, field_data.max);
}

SetupFieldTypeImGui("norm", function() { });
SetupFieldTypeImGui("bool",
    function() { },
    function(field_name, field_data, get_func, set_func)
    {
        ImGui.Checkbox(field_name, (_ = get_func()) => set_func(_));
    }
);

SetupFieldTypeImGui("text", 
    function() { },
    function(field_name, field_data, get_func, set_func)
    {
		ImGui.InputText(field_name, (_ = get_func()) => set_func(_), 256);
    }
);

SetupFieldTypeImGui("colour", 
    function() { },
    function(field_name, field_data, get_func, set_func)
    {
		ImGui.Text("TODO");
    }
);

SetupFieldTypeImGui("float", Field_FloatMinMaxEdit, FieldVal_FloatEdit);
SetupFieldTypeImGui("distance", Field_FloatMinMaxEdit, FieldVal_FloatEdit);
SetupFieldTypeImGui("weight", Field_FloatMinMaxEdit, FieldVal_FloatEdit);
SetupFieldTypeImGui("mass", Field_FloatMinMaxEdit, FieldVal_FloatEdit);
SetupFieldTypeImGui("accel", Field_FloatMinMaxEdit, FieldVal_FloatEdit);
SetupFieldTypeImGui("time", Field_FloatMinMaxEdit, FieldVal_FloatEdit);
SetupFieldTypeImGui("int", Field_IntMinMaxEdit, FieldVal_IntEdit);
SetupFieldTypeImGui("list", 
    function(field_name, field_data) 
    {
        ImGui.SliderInt(`Min##${field_name}`, (_ = field_data.min) => field_data.min = _, 0, 1000);
        ImGui.SliderInt(`Max##${field_name}`, (_ = field_data.max) => field_data.max = _, 0, 1000);	
        ImGui.Text("TODO - Element Type. Add a combo box here? TextInput?");
    },
    function(field_name, field_data, get_func, set_func)
    {
        
		var list = get_func();
		if(Array.isArray(list) == false)
		{
			ImGui.Text(`${field_name} is not a JS Array!`);
		}
		else
		{
			if(ImGui.TreeNodeEx(`${field_name} ${list.length} / ${field_data.max}`, ImGui.TreeNodeFlags.DefaultOpen))
			{
				for(var i=0; i<list.length; ++i)
				{
					ImGui.PushID(i);
					if(ImGui.DeleteButton("Del"))
					{
						list.splice(i, 1);
						--i;
					}
					else
					{
						ImGui.SameLine();
						ImGui.Text(`${i} :`);
						UpdateParamEditor(
							field_data.elementType,
							function() 
                            { 
                                var l = list; 
                                var idx = i; 
                                return function () 
                                { 
								    return l[idx];
							    } 
                            }(),
							function()
                            { 
                                var l = list; 
                                var idx = i; 
                                return function (val) 
                                {
								    l[idx] = val;
								    return val;
							    }
                            }(),
							`${i}`
						);
					}
					ImGui.PopID();
				}
				if(list.length < field_data.max && ImGui.Button("Add Element"))
				{
					list.push(bg.CreateFieldTypeInstance(field_data.elementType));
				}
			}
		}
    }
);
 
SetupFieldTypeImGui("data_def", 
    function(field_name, field_data) {
		UpdateAssetDBPicker("Default", (_ = field_data.default_def) => field_data.default_def = _, "data_def");
    },
    function(field_name, field_data, get_func, set_func)
    {
		if(ImGui.TreeNodeEx(field_name, ImGui.TreeNodeFlags.DefaultOpen))
		{
            ImGui.Text("TODO - data def");
            //Use v2?
			//UpdateGeneratorInputsImGui(field_data.dataType.fields, get_func());
			ImGui.TreePop();
		}
    }
 );

 
SetupFieldTypeImGui("data_table", 
    function(field_name, field_data)
    {
		UpdateAssetDBPicker("Default", (_ = field_data.default_id) => field_data.default_id = _, "data_table");
    },
    function(field_name, field_data, get_func, set_func)
    {
        if(ImGui.TreeNodeEx(field_name, ImGui.TreeNodeFlags.DefaultOpen))
        {
            ImGui.Text(`TODO - data table`);
            //Use v2?
            //UpdateGeneratorInputsImGui(field_data.dataType.fields, get_func());
            ImGui.TreePop();
        }
    }
);


SetupFieldTypeImGui("model", 
    function(field_name, field_data)
    {
        ImGui.Text("TODO - Model");
    },
    function(field_name, field_data, get_func, set_func)
    {
        if(ImGui.TreeNodeEx(field_name, ImGui.TreeNodeFlags.DefaultOpen))
        {
            ImGui.Text(`TODO - data table`);
            //Use v2?
            //UpdateGeneratorInputsImGui(field_data.dataType.fields, get_func());
            ImGui.TreePop();
        }
    }
);
