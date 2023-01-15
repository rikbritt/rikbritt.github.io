
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
	if(paramData.type == "float" 
	|| paramData.type == "distance"
	|| paramData.type == "time")
	{
		ImGui.SliderFloat(paramKey, (_ = getFunc()) => setFunc(_), paramData.min, paramData.max);		
	}
	else if(paramData.type == "int")
	{
		ImGui.SliderInt(paramKey, (_ = getFunc()) => setFunc(_), paramData.min, paramData.max);
	}
	else if(paramData.type == "data")
	{
		if(ImGui.TreeNodeEx(paramKey, ImGui.TreeNodeFlags.DefaultOpen))
		{
			UpdateGeneratorInputsImGui(paramData.dataType.fields, getFunc());
			ImGui.TreePop();
		}
	}
	else if(paramData.type == "bool")
	{
		ImGui.Checkbox(paramKey, (_ = getFunc()) => setFunc(_));
	}
	else if(paramData.type == "text")
	{
		ImGui.InputText(paramKey, (_ = getFunc()) => setFunc(_), 256);
	}
	else if(paramData.type == "list")
	{
		var list = getFunc();
		if(Array.isArray(list) == false)
		{
			ImGui.Text(`${paramKey} is not a JS Array!`);
		}
		else
		{
			if(ImGui.TreeNodeEx(`${paramKey} ${list.length} / ${paramData.max}`, ImGui.TreeNodeFlags.DefaultOpen))
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
							paramData.elementType,
							function() { var l = list; var idx = i; return function () { 
								return l[idx];
							 } }(),
							function() { var l = list; var idx = i; return function (val) {
								l[idx] = val;
								return val;
							} }(),
							`${i}`
						);
					}
					ImGui.PopID();
				}
				if(list.length < paramData.max && ImGui.Button("Add Element"))
				{
					list.push(GetParamDefault(paramData.elementType));
				}
			}
		}
	}
	else
	{
		ImGui.Text(`Unknown param type '${paramData.type}' for '${paramKey}'`);
	}
}
