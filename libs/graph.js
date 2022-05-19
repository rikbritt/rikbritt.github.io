bg.CreateGraph = function()
{
    return {
        nodes:[],
        edges:[]
    };
}

bg.AddGraphNode = function(graph, node_id)
{
    graph.nodes.push(node_id);
}

bg.AddGraphEdge = function(graph, from_idx, to_idx)
{
    graph.edges.push({a:from_idx, b:to_idx});
}