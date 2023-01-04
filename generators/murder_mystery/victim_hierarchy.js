
var mm_victimGraph = bg.CreateGenerationGraph("Murder Mystery Victim");
//bg.RegisterGeneratorGraph(mm_victimGraph);

mm_victimGraph.victimCauseOfDeathNode = bg.CreateGenerationGraphNode(mm_victimGraph, mm_causeOfDeathGenerator);
mm_victimGraph.victimPersonNode = bg.CreateGenerationGraphNode(mm_victimGraph, mm_personGenerator);
mm_victimGraph.victimNode = bg.CreateGenerationGraphNode(mm_victimGraph, mm_victimGenerator);
//mm_victimGraph.cultureNode = bg.CreateGenerationGraphNode(intLifeformGraph, cultureGenerator);
//mm_victimGraph.nameNode = bg.CreateGenerationGraphNode(intLifeformGraph, nameV1Generator);
//mm_victimGraph.characterNode = bg.CreateGenerationGraphNode(intLifeformGraph, characterGenerator);

bg.CreateGenerationGraphLink(mm_victimGraph.victimPersonNode, "data", mm_victimGraph.victimNode, "person");
bg.CreateGenerationGraphLink(mm_victimGraph.victimCauseOfDeathNode, "data", mm_victimGraph.victimNode, "causeOfDeath");
//bg.CreateGenerationGraphLink(intLifeformGraph.cultureNode, "data", intLifeformGraph.characterNode, "culture");
//bg.CreateGenerationGraphLink(intLifeformGraph.nameNode, "data", intLifeformGraph.characterNode, "name");