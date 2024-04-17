
var mm_victimGraph = bg.CreateGenerationGraph("Murder Mystery Victim");
//bg.RegisterProjectGeneratorGraph(mm_victimGraph);

mm_victimGraph.victimCauseOfDeathNode = bg.CreateGenerationGraph_GeneratorNode(mm_victimGraph, mm_causeOfDeathGenerator);
mm_victimGraph.victimPersonNode = bg.CreateGenerationGraph_GeneratorNode(mm_victimGraph, mm_personGenerator);
mm_victimGraph.victimNode = bg.CreateGenerationGraph_GeneratorNode(mm_victimGraph, mm_victimGenerator);
//mm_victimGraph.cultureNode = bg.CreateGenerationGraph_GeneratorNode(intLifeformGraph, cultureGenerator);
//mm_victimGraph.nameNode = bg.CreateGenerationGraph_GeneratorNode(intLifeformGraph, nameV1Generator);
//mm_victimGraph.characterNode = bg.CreateGenerationGraph_GeneratorNode(intLifeformGraph, characterGenerator);

bg.CreateGenerationGraphLink(mm_victimGraph.victimPersonNode, "data", mm_victimGraph.victimNode, "person");
bg.CreateGenerationGraphLink(mm_victimGraph.victimCauseOfDeathNode, "data", mm_victimGraph.victimNode, "causeOfDeath");
//bg.CreateGenerationGraphLink(intLifeformGraph.cultureNode, "data", intLifeformGraph.characterNode, "culture");
//bg.CreateGenerationGraphLink(intLifeformGraph.nameNode, "data", intLifeformGraph.characterNode, "name");