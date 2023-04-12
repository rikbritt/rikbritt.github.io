
var intLifeformGraph = bg.CreateGenerationGraph("Intelligent Lifeform");
//bg.RegisterGeneratorGraph(intLifeformGraph);

intLifeformGraph.speciesNode = bg.CreateGenerationGraph_GeneratorNode(intLifeformGraph, speciesGenerator);
intLifeformGraph.cultureNode = bg.CreateGenerationGraph_GeneratorNode(intLifeformGraph, cultureGenerator);
intLifeformGraph.nameNode = bg.CreateGenerationGraph_GeneratorNode(intLifeformGraph, nameV1Generator);
intLifeformGraph.characterNode = bg.CreateGenerationGraph_GeneratorNode(intLifeformGraph, characterGenerator);

bg.CreateGenerationGraphLink(intLifeformGraph.speciesNode, "data", intLifeformGraph.characterNode, "species");
bg.CreateGenerationGraphLink(intLifeformGraph.cultureNode, "data", intLifeformGraph.characterNode, "culture");
bg.CreateGenerationGraphLink(intLifeformGraph.nameNode, "data", intLifeformGraph.characterNode, "name");