
var intLifeformHierarchy = bg.CreateGenerationHierarchy("Intelligent Lifeform");
bg.RegisterGeneratorHierarchy(intLifeformHierarchy);

intLifeformHierarchy.speciesNode = bg.CreateGenerationHierarchyNode(intLifeformHierarchy, speciesGenerator);
intLifeformHierarchy.cultureNode = bg.CreateGenerationHierarchyNode(intLifeformHierarchy, cultureGenerator);
intLifeformHierarchy.nameNode = bg.CreateGenerationHierarchyNode(intLifeformHierarchy, nameV1Generator);
intLifeformHierarchy.characterNode = bg.CreateGenerationHierarchyNode(intLifeformHierarchy, characterGenerator);

bg.CreateGenerationHierarchyLink(intLifeformHierarchy.speciesNode, "data", intLifeformHierarchy.characterNode, "species");
bg.CreateGenerationHierarchyLink(intLifeformHierarchy.cultureNode, "data", intLifeformHierarchy.characterNode, "culture");
bg.CreateGenerationHierarchyLink(intLifeformHierarchy.nameNode, "data", intLifeformHierarchy.characterNode, "name");