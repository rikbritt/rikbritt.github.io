AddNotes("Overview", 
`
A generic procedural generation system.
Each 'generator' runs a script with access to libraries of useful generation functions.
A seed framework for random generation that allows generators to be changes without necessarily changing entirely the output.
`);

AddNotes("Glossary", 
`
-- Project
A collection of Generators and Generator Graphs

-- Generator
Defines a generator. Declares inputs, outputs and a generation script.

-- Generator Instance
A instance of a generator. May have overriden input values.

-- Data Def (was calling them Param Type)
A structure of values. Can be used as a generator input.
A value within can be another data def.

-- Fields
Individual values, like int, bool, etc. Can be a data def field.

-- Generator Graph
A graph of generator instances. Inputs and outputs of these can be linked together.

`);