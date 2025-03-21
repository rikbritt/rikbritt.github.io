bg.CreateGraph = function()
{
    return {
        id:bg.CreateGUID(),
        name:"New Graph",
        description:"",
		category:[],
        nodes:[],
        edges:[]
    };
}

bg.CreateGraphFromList = function(list)
{
    var g = bg.CreateGraph();
    for(var i=0; i<list.length; ++i)
    {
        bg.AddGraphNode(g, list[i].id, { listEntry:list[i] });
    }
    return g;
}

bg.AddGraphNode = function(graph, node_id, node_data)
{
    //validate
    var existing = bg.GetGraphNodeById(graph, node_id);
    if(existing != null)
    {
        return existing;
    }

    var node = {
        id:node_id,
        data:node_data
    };
    graph.nodes.push(node);
    return node;
}

bg.GetGraphNodeById = function(graph, node_id)
{
    for(var node of graph.nodes)
    {
        if(node.id == node_id)
        {
            return node;
        }
    }
    return null;
}

bg.GetGraphNodesByType = function(graph, node_type)
{
    return graph.nodes.filter( (node) => node.type == node_type );
}

//TODO: Inefficient but I think it has to store the edges by id and not index
// bg.AddGraphEdgeByIdx = function(graph, from_idx, to_idx)
// {
//     graph.edges.push({a:from_idx, a_sub:-1, b:to_idx, b_sub:-1});
// }

bg.AddGraphSubEdgeById = function(graph, from_id, from_sub_id, to_id, to_sub_id)
{
    graph.edges.push({a:from_id, a_sub:from_sub_id, b:to_id, b_sub:to_sub_id});
}

bg.RemoveGraphSubEdgeById = function(graph, from_id, from_sub_id, to_id, to_sub_id)
{
    graph.edges = graph.edges.filter( (edge) => !(edge.a == from_id && edge.a_sub == from_sub_id && edge.b == to_id && edge.b_sub == to_sub_id) );
}

bg.AddGraphEdgeById = function(graph, from_id, to_id)
{
    graph.edges.push({a:from_id, a_sub:-1, b:to_id, b_sub:-1});
}

bg.ForEachGraphNode = function(graph, func)
{
    if(!graph || !graph.nodes)
    {
        return;
    }
    for(var n of graph.nodes)
    {
        func(n);
    }
}

bg.ForEachGraphNodeOfType = function(graph, type, func)
{
    if(!graph || !graph.nodes)
    {
        return;
    }
    for(var n of graph.nodes)
    {
        if(n.data.type == type)
        {
            func(n);
        }
    }
}

bg.ForEachGraphEdgeIntoNode = function(graph, node_id, func)
{
    if(!graph || !graph.edges)
    {
        return;
    }
    for(var e of graph.edges)
    {
        if(e.b == node_id)
        {
            func(e.a, e.a_sub, e.b, e.b_sub);
        }
    }
}

bg.ForEachGraphEdgeOutOfNode = function(graph, node_id, func)
{
    if(!graph || !graph.edges)
    {
        return;
    }
    for(var e of graph.edges)
    {
        if(e.a == node_id)
        {
            func(e.a, e.a_sub, e.b, e.b_sub);
        }
    }
}

bg.GetEdgesIntoNode = function(graph, node_id)
{
    var edges = [];
    for(var e of graph.edges)
    {
        if(e.b == node_id)
        {
            edges.push(e);
        }
    }
    return edges;
}

bg.ForEachGraphNodeOfTypeIntoNode = function(graph, to_node_id, type, func)
{
    if(!graph || !graph.edges)
    {
        return;
    }
    for(var e of graph.edges)
    {
        if(e.b == to_node_id)
        {
            var in_node = bg.GetGraphNodeById(graph, e.a);
            if(in_node.data.type == type)
            {
                func(in_node);
            }
        }
    }
}

// Each node connected outwardly from the start node, by the type of connected node
bg.ForEachGraphNodeOfTypeOutOfNode = function(graph, start_node_id, type, func)
{
    if(!graph || !graph.edges)
    {
        return;
    }
    for(var e of graph.edges)
    {
        if(e.a == start_node_id)
        {
            var out_node = bg.GetGraphNodeById(graph, e.b);
            if(out_node.data.type == type)
            {
                func(out_node);
            }
        }
    }
}

bg.GetFirstNodeOfTypeOutOfNode = function(graph, start_node_id, type)
{
    var out_node = null;
    bg.ForEachGraphNodeOfTypeOutOfNode(graph, start_node_id, type, function(n)
    {
        if(out_node == null)
        {
            out_node = n;
        }
    });
    return out_node;
}

bg.AddGraphLayout = function(graph)
{
    if(graph.layout == null)
    {
        graph.layout = {};
        for(var i=0; i<graph.nodes.length; ++i)
        {
            var node = graph.nodes[i];
            var node_layout = bg.FindOrCreateNodeLayout(graph.layout, node.id);
            node_layout.x = i*10;
            node_layout.y = 0;
        }
    }
}

bg.FindOrCreateNodeLayout = function(graph_layout, node_id)
{
    if(graph_layout[node_id] == undefined)
    {
        var new_node_layout =
        {
            x:10,
            y:10
        }
        graph_layout[node_id] = new_node_layout;
    }

    return graph_layout[node_id];
}

bg.SetNodeLayoutPos = function(graph_layout, node_id, x, y)
{
    var layout = bg.FindOrCreateNodeLayout(graph_layout, node_id);
    layout.x = x;
    layout.y = y;    
}

bg.GraphToUML = function(graph)
{
	var uml = "";
	uml += "@startuml\n";
	uml += "graph G {\n";
	for(var e=0; e<graph.edges.length; ++e)
	{
		var edge = graph.edges[e];
		var a = edge.a;
		var b = edge.b;
		uml += `    "${a}" -- "${b}"\n`;
	}
	uml += "}\n";
	uml += "@enduml\n";
	return uml;
}

bg.DiGraphToUML = function(graph)
{
	var uml = "";
	uml += "@startuml\n";
	uml += "digraph G {\n";
	for(var e=0; e<graph.edges.length; ++e)
	{
		var edge = graph.edges[e];
		var a = edge.a;
		var b = edge.b;
		uml += `    "${a}" -> "${b}"\n`;
	}
	uml += "}\n";
	uml += "@enduml\n";
	return uml;
}

bg.DiGraphToWithNodeData = function(graph, node_data_func, node_style_func)
{
	var uml = "";
	uml += "digraph G {\n";
    uml += `    graph [ rankdir = "LR" ];`;
    for(var n of graph.nodes)
    {
        var node_data = node_data_func ? node_data_func(n) : {};
        var node_style = node_style_func ? node_style_func(n) : "";
        uml += `    "${n.id}"[shape = "record"`;
        if(node_data.length > 0)
        {
            uml += `, label="${n.id} |${node_data.join("|")}"`;
        }
        if(node_style != "")
        {
            uml += ", " + node_style;
        }
        uml += `]\n`;
    }
	for(var e=0; e<graph.edges.length; ++e)
	{
		var edge = graph.edges[e];
		var a = edge.a;
		var b = edge.b;
		uml += `    "${a}" -> "${b}"\n`;
	}
	uml += "}\n";
	return uml;
}

bg.DiGraphToUMLWithNodeData = function(graph, node_data_func, node_style_func)
{
	var uml = "";
	uml += "@startuml\n";
	uml += bg.DiGraphToWithNodeData(graph, node_data_func, node_style_func);
	uml += "@enduml\n";
	return uml;
}

// Converts edge node idx to ids
bg.SerializeGraph = function(graph)
{
    var edgesById = [];
    for(var edge of graph.edges)
    {
        edgesById.push(
            {
                a:edge.a,
                a_sub:edge.a_sub, 
                b:edge.b,
                b_sub:edge.b_sub
            }
        );
    }

    var original_edges = graph.edges;
    graph.edges = edgesById;
    var serialized = JSON.stringify(graph);
    graph.edges = original_edges;
    return serialized;
}

bg.DeserializeGraph = function(graph_json)
{
    var graph = JSON.parse(graph_json);
    var edges = [];
    for(var edge of graph.edges)
    {
        edges.push(
            {
                a:graph.nodes.findIndex( n => n.id == edge.a),
                a_sub:edge.a_sub, 
                b:graph.nodes.findIndex( n => n.id == edge.b),
                b_sub:edge.b_sub
            }
        );
    }
    graph.edges = edges;
    return graph;
}