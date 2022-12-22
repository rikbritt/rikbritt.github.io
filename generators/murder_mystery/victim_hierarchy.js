
var mm_victimHierarchy = bg.CreateGenerationHierarchy("Murder Mystery Victim");
//bg.RegisterGeneratorHierarchy(mm_victimHierarchy);

mm_victimHierarchy.victimCauseOfDeathNode = bg.CreateGenerationHierarchyNode(mm_victimHierarchy, mm_causeOfDeathGenerator);
mm_victimHierarchy.victimPersonNode = bg.CreateGenerationHierarchyNode(mm_victimHierarchy, mm_personGenerator);
mm_victimHierarchy.victimNode = bg.CreateGenerationHierarchyNode(mm_victimHierarchy, mm_victimGenerator);
//mm_victimHierarchy.cultureNode = bg.CreateGenerationHierarchyNode(intLifeformHierarchy, cultureGenerator);
//mm_victimHierarchy.nameNode = bg.CreateGenerationHierarchyNode(intLifeformHierarchy, nameV1Generator);
//mm_victimHierarchy.characterNode = bg.CreateGenerationHierarchyNode(intLifeformHierarchy, characterGenerator);

bg.CreateGenerationHierarchyLink(mm_victimHierarchy.victimPersonNode, "data", mm_victimHierarchy.victimNode, "person");
bg.CreateGenerationHierarchyLink(mm_victimHierarchy.victimCauseOfDeathNode, "data", mm_victimHierarchy.victimNode, "causeOfDeath");
//bg.CreateGenerationHierarchyLink(intLifeformHierarchy.cultureNode, "data", intLifeformHierarchy.characterNode, "culture");
//bg.CreateGenerationHierarchyLink(intLifeformHierarchy.nameNode, "data", intLifeformHierarchy.characterNode, "name");