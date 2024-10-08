AddNotes("Next",
`
Prob good to add some kind of 'info' struct that wraps name, category and id? Graphs, data defs and generators could all share code then.

* Serialisation *
Finish this. Graphs are not done at all yet.
Do a pass on the generator and graph structures, and see if all the data can be setup to just be JSON stringified immediately.
Would need to possibly do some kind of "_runtime" member or something that skips serialisation and has all the cached object refs in it, and the serialised data just stores ids etc.

* Data Def and other Generator refs *
As I work on the work flow it's more likely more generators will be in the .json format, and even the .js format will become loaded without refs to others as the file is loaded in isolation.
That means any refs in a generator need to be done by GUID and resolved at runtime.
I need to find a nice syntax/solution for that.
For performance I could cache these refs somewhere in a way that is easy to skip during serialisation, and easy to delete/rebuild as edits are done.

** Rename **
Field Type - bool,float,weight,distance etc
Field Def - a field type with data for min/max etc. Has a name and guid
Field Value - a value for a Field Def - within its bounds etc.
Data Def - A list of field def's. Used as structures for generator template inputs/outputs/etc. Used as standalone structures for building and sharing data. Also contains meta data, like name, version etc
Data Instance - A list of field values. Link to its Data Def
Data Map - A hashmap of field values, keyed by field name. Used by the generator scripts.

* UI *
Making async project loading blocking? With ui popup?
Make error window a generic logging window? Or keep the console for that?

* Long Term *
Split out project code managing a tree and links of objects with GUIDs from the generator lib itself.
That layer is abstract and could be re-used.
`);

AddNotes("Release Notes",
`
1/10/2024
Graph editor
  - Basic scrolling. Start of zooming.
  - Start of Tests window
  - Basic V1 fully working graph execution. (*^_^*)
  
1/9/2024
Graph editor
  - Value nodes show a field value as string
  - Clicking them shows a suitable field value editor

Need to work on 
  - linking for data defs
  - fix some field value imgui edits
  - make text wrap in nodes or clip
  - make the node graph as a whole scrollable, or zoomable 

18/8/2024
Graph editor 
  - can now delete links
  - can specify a func for whether links can be made.
  - graphs now specify links after nodes when setting up imgui graph

Adding code to create a gen graph execution context, and execution list.
Adding debug code to step through the execution.
Basics for graph gen and copy steps working.

14/7/2024
Graph editor - dragging nodes.
Basics of adding links with the mouse between pins of the same data type.
Next - for graph nodes.
  - deleting
  - resizing
Next - for linking
  - Don't link to own input
  - sub types for data defs and other types.
  - edit node - go straight to the right editor window

3/6/2024
Fixing up graphs and the imgui for them. Then will make sure they serialise too.
Made the code window a seperate popup window.

23/04/2024
Added Asset Db, a store of asset to guid. Each project gets one, and there's a global one. Will be how we save a ref (guid) to a project, then at runtime find the actual asset instance to use.
Added Data Tables, which use a data def to describe each data row. Added a 'picker' imgui ui for this, that queries the asset db.
Will start making all existing generators not use direct references, but use guid refs via the asset db. Then they can all be loaded via js import and still work.

Still have murder mystery as primary customer, but also thinking about a Beach Comber game, and running this lib in Unreal via a JS plugin.

Added some data tables for name data.
27/03/2024
Been working mainly on Murder Mystery server and app, but coming back to this as now I need to start embedding a Murder Mystery proc gen project into the server and start generating characters etc.
Coming back it's obvious I need to spend more time improving project loading/saving/workflow and fix up the UI more.
Breaking some stuff while I'm doing this.
Moving murder mystery generators into own project.

3/12/2023
Working on new node tree Explorer window.
Wanting to improve how data is stored and saved. If i keep all references out of where I store data, and just use ids, then can serialise it all easier.
Also rethinking the 'global' project. Still ok with having multiple libaries and letting them depend on each other, but bin the idea of a 'global' one and make all the stuff
it currently stores 'shared'. The global list of generators is just a kind of cache - and in fact could be a global map of data referenced by guid id, so data defs and graphs all go into the same list. 

8/10/2023
Did some more loading/saving. Updated the Next notes.
Have downloaded a copy of britt gen and started to make it a module for murder web. (Spent more of last few months doing Murder Web)

14/5/2023
Right clicking to add a graph node puts it where you right clicked.
Think I should get the graph node using a more generic 'graph' framework under the hood.
Added a debug mode to the NodeImgui graph stuff

11/4/2023
Updated so graph editor is a regular window, not a single bespoke graph editor test window.
Need to decide if the node x/y layout and other data lives within the graph itself. It probably should.

12/01/2023
I think I'll move all 'built in' generators to belong to a 'global' project, and allow projects to reference others.
To support that I'll allow multiple projects to be loaded, and update the UI to reflect that.

Perhaps Projects should be renamed to 'collections' or 'namespaces' or something. Hmmm

05/01/2023
Start of a working script editor via imgui text input.
can convert a function to text and back which is really cool. not sure how debuggable that is yet though, but at least it gives parsing errors.

04/01/2023
Start using GUIDs for all ids.
Rename Hierarchies to Graphs.

02/01/2023
Over Christmas did some project loading/saving. Still WIP

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