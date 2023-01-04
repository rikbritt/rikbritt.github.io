
var intLifeformGraph = bg.CreateGenerationGraph("Intelligent Lifeform");
//bg.RegisterGeneratorGraph(intLifeformGraph);

intLifeformGraph.speciesNode = bg.CreateGenerationGraphNode(intLifeformGraph, speciesGenerator);
intLifeformGraph.cultureNode = bg.CreateGenerationGraphNode(intLifeformGraph, cultureGenerator);
intLifeformGraph.nameNode = bg.CreateGenerationGraphNode(intLifeformGraph, nameV1Generator);
intLifeformGraph.characterNode = bg.CreateGenerationGraphNode(intLifeformGraph, characterGenerator);

bg.CreateGenerationGraphLink(intLifeformGraph.speciesNode, "data", intLifeformGraph.characterNode, "species");
bg.CreateGenerationGraphLink(intLifeformGraph.cultureNode, "data", intLifeformGraph.characterNode, "culture");
bg.CreateGenerationGraphLink(intLifeformGraph.nameNode, "data", intLifeformGraph.characterNode, "name");