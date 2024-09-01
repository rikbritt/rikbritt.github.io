
//TODO: Del? Only V2 one being used?
function UpdateParamEditor(paramData, getFunc, setFunc, paramKey)
{
	// Use this instead?
	//UpdateEditorForFieldValue(paramKey, paramData, getFunc, setFunc);
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
