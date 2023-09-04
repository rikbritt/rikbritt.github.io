bg.CreateGraph = function()
{
    return {
        id:bg.CreateGUID(),
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
    graph.nodes.push({
        id:node_id,
        data:node_data
    });
}

bg.AddGraphEdgeByIdx = function(graph, from_idx, to_idx)
{
    graph.edges.push({a:from_idx, b:to_idx});
}

bg.AddGraphEdgeById = function(graph, from_id, to_id)
{
    var a_idx = graph.nodes.findIndex( n => n.id == from_id);
    var b_idx = graph.nodes.findIndex( n => n.id == to_id);
    graph.edges.push({a:a_idx, b:b_idx});
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

bg.FindOrCreateNodeLayout = function(graph_layout, node_idx)
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

    while(graph_layout.length < node_idx+1)
    {
        var new_node_layout =
        {
            x:10,
            y:10
        }
        graph_layout.push(new_node_layout);
    }

    return graph_layout[node_idx];
}