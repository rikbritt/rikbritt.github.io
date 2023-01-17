//Editors for field types registered with bg.CreateFieldType
gFieldTypesImGui = {};

//imgui_edit_field_func = add imgui controls to edit the field setup (min/max/etc)
function SetupFieldTypeImGui(field_type, imgui_edit_field_func)
{
    if(bg.dataTypes[field_type] == null)
    {
		console.error(`Couldn't find field type '${field_type}`);
        return false;
    }

    gFieldTypesImGui[field_type] = 
    {
        edit_field_imgui:imgui_edit_field_func
    };

    return true;
}

function Field_FloatMinMaxEdit(field_name, field_data)
{
	ImGui.SliderFloat(field_name, (_ = field_data.min) => field_data.min = _, 0, 1000);
	ImGui.SliderFloat(field_name, (_ = field_data.max) => field_data.max = _, 0, 1000);		
}

SetupFieldTypeImGui("norm", function() { });
SetupFieldTypeImGui("float", Field_FloatMinMaxEdit);
SetupFieldTypeImGui("distance", Field_FloatMinMaxEdit);
SetupFieldTypeImGui("time", Field_FloatMinMaxEdit);