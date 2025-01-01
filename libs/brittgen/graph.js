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
    return null
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
    var a_idx = graph.nodes.findIndex( n => n.id == from_id);
    var b_idx = graph.nodes.findIndex( n => n.id == to_id);
    graph.edges.push({a:a_idx, a_sub:-1, b:b_idx, b_sub:-1});
}

bg.ForEachGraphEdgeIntoNode = function(graph, node_id, func)
{
    for(var e of graph.edges)
    {
        if(e.b == node_id)
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
		var a = graph.nodes[edge.a].id;
		var b = graph.nodes[edge.b].id;
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
		var a = graph.nodes[edge.a].id;
		var b = graph.nodes[edge.b].id;
		uml += `    "${a}" -> "${b}"\n`;
	}
	uml += "}\n";
	uml += "@enduml\n";
	return uml;
}