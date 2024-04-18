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

-- Generator Graph
A graph of generator instances. Inputs and outputs of these can be linked together.



-- Field Type
A Field Type is a data type like float, int, weight, distance, time, etc.

-- Field Def
A Field Def is a definition of a field type, and holds name, min/max info etc.

-- Field Value
A Field value is a value for a field def.

-- Data Def (was calling them Param Type)
A list of field def's. Used as structures for generator template inputs/outputs/etc. Used as standalone structures for building and sharing data. Also contains meta data, like name, version etc

-- Data Instance
A list of field values. Link to its Data Def

-- Data Table
A table of values. Constant data. Can be used by generator scripts
Uses a data def to define each rows data

-- Data Map
A hashmap of field values, keyed by field name. Used by the generator scripts.

`);