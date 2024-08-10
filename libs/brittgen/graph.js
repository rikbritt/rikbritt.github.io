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

bg.AddGraphLayout = function(graph)
{
    if(graph.layout == null)
    {
        graph.layout = [];
        for(var i=0; i<graph.nodes.length; ++i)
        {
            graph.layout.push(
                {
                    node_id:graph.nodes[i].id,
                    x:i*10,
                    y:0
                }
            );
        }
    }
}

bg.FindOrCreateNodeLayout = function(graph_layout, node_id)
{
    // for(var i=0; i<graph_layout.length; ++i)
    // {
    //     if(graph_layout[i].node_id == node_id)
    //     {
    //         return graph_layout[i];
    //     }
    // }

    // var new_node_layout =
    // {
    //     node_id:node_id,
    //     x:10,
    //     y:10
    // }
    // graph_layout.push(new_node_layout);

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