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
    graph.nodes.push({
        id:node_id,
        data:node_data
    });
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

bg.AddGraphEdgeById = function(graph, from_id, to_id)
{
    var a_idx = graph.nodes.findIndex( n => n.id == from_id);
    var b_idx = graph.nodes.findIndex( n => n.id == to_id);
    graph.edges.push({a:a_idx, a_sub:-1, b:b_idx, b_sub:-1});
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