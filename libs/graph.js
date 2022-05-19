bg.CreateGraph = function()
{
    return {
        nodes:[],
        edges:[]
    };
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