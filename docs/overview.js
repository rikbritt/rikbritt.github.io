AddNotes("Overview", 
`
A generic procedural generation system.
Each 'generator' runs a script with access to libraries of useful generation functions.
A seed framework for random generation that allows generators to be changes without necessarily changing entirely the output.
`);

AddNotes("Glossary", 
`
-- Project
A collection of Generators and Generator Hierarchies

-- Generator
Defines a generator. Declares inputs, outputs and a generation script.

-- Generator Instance
A instance of a generator. May have overriden input values.

-- Param Type
A structure of values. Can be used as a generator input.
A value within can be another param type.

-- Generator Hieratchy
A graph of generator instances. Inputs and outputs of these can be linked together.

`);