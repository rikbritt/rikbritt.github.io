//Editors for field types registered with bg.CreateFieldType
gFieldTypesImGui = {};

//imgui_edit_field_func = add imgui controls to edit the field setup (min/max/etc)
//imgui_edit_val_func = add imgui contrlols to edit a value of an instance of the field
function SetupFieldTypeImGui(field_type, imgui_edit_field_func, imgui_edit_val_func)
{
    if(bg.dataTypes[field_type] == null)
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
    ImGui.SliderFloat(field_name, (_ = get_func()) => set_func(_), field_data.min, field_data.max);		
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
    ImGui.SliderInt(field_name, (_ = get_func()) => set_func(_), field_data.min, field_data.max);
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

SetupFieldTypeImGui("color", 
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
					if(ImGui.Button("Del"))
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
					list.push(GetParamDefault(field_data.elementType));
				}
			}
		}
    }
);
 
SetupFieldTypeImGui("data", 
    function(field_name, field_data) {
        ImGui.Text("TODO - data");
        //if(ImGui.TreeNodeEx(field_name, ImGui.TreeNodeFlags.DefaultOpen))
        //{
        //	UpdateGeneratorInputsImGui(field_data.dataType.fields, getFunc());
        //	ImGui.TreePop();
        //}
    },
    function(field_name, field_data, get_func, set_func)
    {
		if(ImGui.TreeNodeEx(field_name, ImGui.TreeNodeFlags.DefaultOpen))
		{
			UpdateGeneratorInputsImGui(field_data.dataType.fields, get_func());
			ImGui.TreePop();
		}
    }
 );