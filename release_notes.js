AddNotes("Release Notes",
`
02/12/2022
Been working on this via VSCode and github.
Working on hierarchy editor - building up imgui node helpers.
Generators have new params using imgui table.
Worked with Chris P designing murder mystery gameplay a bit.
Setup some more mm data while on holiday in Malta :)

V13 - 20/07/2019
Looking at the Generator/Params/Hierarchy setup with fresh eyes.
Started a highlevel doc about the concepts here:
https://docs.google.com/document/d/1ZXevBsMZMcSX2CGhju0Npd3OpMkoeBgEER6ufSNiWno/edit#
Renamed Params to DataDef, contains fields.
This is because these structures are no longer just params used as generator inputs, but can also be outputs.

V12 - 13/2/2019
Working on murder myster career generator. Adding levels to careers.


V12 - 10/1/2019
Long break while changing jobs.
Coming back to this with the mind to generate a murder mystery scenario :)
Adding name / relationship / Scenarios generators etc

V11 - 3/8/2018
Let's start adding optional 'description' fields to parameters.
TODO: Want to make the hierarchy panel better and interactive.
Adding 'planet', 'universe' and 'reality' generator.
Added a param of psychic powers.
Added a 'autogenerate' flag that allows an input param to not be generated.
	This is useful if we want to only see overridden values in the generator.
Started to look at the name generator a little more seriously.
	Think I want to try an approach based on mouth shapes and ensuring the chosen letters flow between appropriate mouth shapes.
Starting add language data under bg.data
	This can be a shared pool where data across generators may live.
	

V10 - 24/7/2018
TODO: Testing Hierarchies breaks the Inputs panel

Had a break while thinking about planetoid voxel issue. Break went on a bit long!
Came back and eased into a little character/species gen. 

Decided to tackle some generation hierarchy stuff.
	
With generators I want to be able to test them in isolation. 
	This means manually specify all input params without invoking 'input' generators. 
	This is because those generators may have their own bugs etc and it's good to keep a generator isolated for testing purposes.

I also want to be able to test a generator in a full hierarchy of generators.
	As in run generators on the inputs too.
	Lets a hierarchy be tested.
	
So I've gone with generating hierarchies as the main case. 
	For the generator test bed it creates a 'test harness' hierarchy of a single chosen generator.
	
This allows me to setup a chain such as Species -> Character, but still test 'Species' or 'Character' in isolation.
	In this case if 'Character' is in isolation then the SpeciesParams are randomly chosen from within allowed min/max ranges.

I've also added paramtypes.js. I want the 'types' used by params to be extensible, so getting that in early is a good idea.
Started adding a hierarchy view using paper.js
Split the generator page into two scrollable sections. Output section at top and input/control section at the bottom.

V9 - 16/5/2018
TODO: Work on voxel terrain.

Starting to add some geodesic sphere generation.
Made HTML input UI show slider for int types.
Added tetrahedron generator.
Added triangle generator.

V8 - 4/5/2018
Allow some 'logic' code to run on generated models.
	First test for this - generate a cube and run some logic that rotates it.
	I want to maintain a gap between the generated world and the rendering - this isn't being done yet.
	The logic is directly manipulating the rendering. Instead I want the logic to change the node the
	rendering was built from - and for the rendering to be notified somehow that it should update itself.
	Needs thought.
	
Started adding a 'height map terrain' for fun. Going to use voxel based terrain going forward.
Added physics.js - mainly thinking of using this to animate models. I want everything to be as physics based as possible.
Added voxel tests. Just renders voxel data as simple boxes. So wasteful!


V7 - 27/4/2018
Aiming to improve object hierarchy / matrices etc.
Wired up some of the test bed render options. WIP
Added three_linetext.js with my linesegment based font / text rendering.
Added 'category' to generators. Just for a little organising.


V6 - 17/4/2018
Started adding paths.
Adding stone wall generator.
Starting to put my functions inside 'bg' (BrittGen) object for some kind of namespacing.
Temporarily removed 2D generators - I'll need to make the generator test bed know when to switch between paperJS rendering and threeJS - or I need to update all rendering to threeJS.
Wired up html controls to allow switching between generators.


V5 - 3/4/2018
Added three.js
Added threecsg.js
Added modular building generator

V4 - 29/3/2018

V3 - 29/3/2018
Added some vector libs.
Had a working example of the 'shape unite' function using paperJS unite code in secret.
Made paperJS flip the Y scale so + is upwards on Y when building models.
Added some folders to structure generators better.
Added tree/forest scene generators.

V2 - 27/3/2018
Got some basic HTML sliders for manually setting input values.

V1 - 9/3/2018
Generating a box, yay.
`);