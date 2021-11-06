
var testHierarchy = bg.CreateGenerationHierarchy("Test Hierarchy");
bg.RegisterGeneratorHierarchy(testHierarchy);

var speciesNode = bg.CreateGenerationHierarchyNode(testHierarchy, speciesGenerator);
var nameNode = bg.CreateGenerationHierarchyNode(testHierarchy, nameV1Generator);
var characterNode = bg.CreateGenerationHierarchyNode(testHierarchy, characterGenerator);
bg.CreateGenerationHierarchyLink(speciesNode, "data", characterNode, "species");
bg.CreateGenerationHierarchyLink(nameNode, "data", characterNode, "name");