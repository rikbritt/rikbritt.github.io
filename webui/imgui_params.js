
function GetParamDefault(paramData)
{
	if(paramData.type == "float" 
	|| paramData.type == "distance"
	|| paramData.type == "time"
	|| paramData.type == "int")
	{
		return paramData.min;
	}
	else if(paramData.type == "data")
	{
		return {};
	}
	else if(paramData.type == "bool")
	{
		return false;
	}
	else if(paramData.type == "text")
	{
		return "";
	}
	else if(paramData.type == "list")
	{
		return [];
	}
	else
	{
		return null;
	}
}

function UpdateParamEditor(paramData, getFunc, setFunc, paramKey)
{
    var field_imgui = gFieldTypesImGui[paramData.type];
	if(field_imgui != null)
	{
		field_imgui.edit_value_imgui(paramKey, paramData, getFunc, setFunc);
	}
	else
	{
		ImGui.Text(`Unknown param type '${paramData.type}' for '${paramKey}'`);
	}
}
