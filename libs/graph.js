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

bg.AddGraphEdge = function(graph, from_idx, to_idx)
{
    graph.edges.push({a:from_idx, b:to_idx});
}