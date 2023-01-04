
var testGraph = bg.CreateGenerationGraph("Test Graph");
//bg.RegisterGeneratorGraph(testGraph);

var speciesNode = bg.CreateGenerationGraphNode(testGraph, speciesGenerator);
var nameNode = bg.CreateGenerationGraphNode(testGraph, nameV1Generator);
var characterNode = bg.CreateGenerationGraphNode(testGraph, characterGenerator);
bg.CreateGenerationGraphLink(speciesNode, "data", characterNode, "species");
bg.CreateGenerationGraphLink(nameNode, "data", characterNode, "name");