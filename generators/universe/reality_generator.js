var psychicPowerDataDef = {
	version:1,
	name:"Psychic Powers",
	fields:[
		//https://en.wikipedia.org/wiki/List_of_psychic_abilities
		{ name:"apportation",			type:"norm", min:0, max:1,	description:"The ability to undergo materialization, disappearance or teleportation of an object"},
		{ name:"astralProjection",		type:"norm", min:0, max:1,	description:"The ability to voluntarily project the astral body (consciousness), being associated with out-of-body experience, in which the astral body becomes separate from the physical body (djinn)"},
		{ name:"auraReading",			type:"norm", min:0, max:1,	description:"The ability to perceive 'energy fields' surrounding people, places and things."},
		{ name:"clairaudience",			type:"norm", min:0, max:1,	description:"The ability to acquire information by paranormal auditory means."},
		{ name:"claircognizance",		type:"norm", min:0, max:1,	description:"The ability to acquire psychic knowledge by means of intrinsic knowledge."},
		{ name:"clairgustance",			type:"norm", min:0, max:1,	description:"The ability to perceive an ethereal substance without contact."},
		{ name:"clairsentience",		type:"norm", min:0, max:1,	description:"The ability to acquire psychic knowledge by feeling."},
		{ name:"clairvoyance",			type:"norm", min:0, max:1,	description:"The ability to perceive person, object, location, and physical events through extrasensory perception."},
		{ name:"conjuration",			type:"norm", min:0, max:1,	description:"The ability to summon items from thin air."},
		{ name:"divination",			type:"norm", min:0, max:1,	description:"The ability to gain insight into a situation by way of an occultic standardized process."},
		{ name:"energyManipulation",	type:"norm", min:0, max:1,	description:"The ability to manipulate physical and non-physical energy with one's mind."},
		{ name:"energyMedicine",		type:"norm", min:0, max:1,	description:"The ability to heal with one's own empathic etheric, astral, mental or spiritual energy."},
		{ name:"hydrokinesis",			type:"norm", min:0, max:1,	description:"The ability to manipulate water."},
		{ name:"levitation",			type:"norm", min:0, max:1,	description:"The ability to undergo bodily uplift or fly by mystical means."},
		{ name:"mediumship",			type:"norm", min:0, max:1,	description:"The ability to communicate with spirits."},
		{ name:"premonition",			type:"norm", min:0, max:1,	description:"The ability to perceive future events."},
		{ name:"psychicSurgery",		type:"norm", min:0, max:1,	description:"The ability to remove disease or disorder within or over the body tissue via an 'energetic' incision that heals immediately afterwards."},
		{ name:"telekinesis",			type:"norm", min:0, max:1,	description:"The ability to manipulate objects by way of extrasensory perception."},
		{ name:"pyrokinesis",			type:"norm", min:0, max:1,	description:"The ability to manipulate fire with your mind."},
		{ name:"remoteViewing",			type:"norm", min:0, max:1,	description:"The ability to see a distant and unseen target using extrasensory perception."},
		{ name:"retrocognition",		type:"norm", min:0, max:1,	description:"The ability to perceive past events."},
		{ name:"scrying",				type:"norm", min:0, max:1,	description:"The ability to look into a suitable medium with a view to detect significant information."},
		{ name:"telepathy",				type:"norm", min:0, max:1,	description:"The ability to transfer thoughts mentally through extrasensory perception."}
	]
};

var scientificPossibilitiesDataDef = {
	version:1,
	name:"Scientific Possibilities",
	fields:[
		{ name:"timeTravel",			type:"bool", description:"Is time travel possible." },
		{ name:"antiGravity",			type:"bool", description:"Is anti-gravity possible." },
		{ name:"fasterThanLight",		type:"bool", description:"Is faster than light travel possible."},
		{ name:"dimensionalTravel",		type:"bool", description:"Can travel between multiple dimensions."},
		
		//This could be putting too much of a specific tech into this level?
		{ name:"teleportation",			type:"bool", description:"Is teleportation possible."},
		{ name:"forceFields",			type:"bool", description:"Are force fields possible."}
	]
}

var realityDataDef = {
	version:1,
	name:"Reality",
	id:"6a8e97b3-3acd-4b6e-9db4-ada5a4da53f6",
	fields:[
		{ name:"mythicism",				type:"norm", min:0, max:1, description:"How likely mythic beings are." },
		//is god a thing.
		{ name:"afterlife",				type:"bool" },
		
		{ name:"psychicAbilityPower",		type:"data_def", default_def:psychicPowerDataDef},
		{ name:"scientificPossibilities",	type:"data_def", default_def:scientificPossibilitiesDataDef},
		
		//Magic - the abilities to perform acts not observed in our reality.
		{ name:"willedMagic",			type:"norm", min:0, max:1, description:"How strong magic powered by willpower is in this reality." },
		{ name:"technologicalMagic",	type:"norm", min:0, max:1, description:"How strong magic powered by science is in this reality." },
		
		//Specific mythic abilities 
		
	]
}
bg.RegisterProjectDataDef(bg.global_project, realityDataDef);


var realityGenerator = {
	version:1,
	name:"Reality",
	description:"WIP - idea is that it generates all the key information for a 'reality'\nLike whether magic exists, psychic powers, if there's an afterlife etc",
	category:["Universe"],
	inputs:{
		name:"inputs",
		version:1,
		fields:[
			{ name:"reality",		type:"data_def",		default_def:"6a8e97b3-3acd-4b6e-9db4-ada5a4da53f6"	}
		],
	},
	outputs:{
		name:"outputs",
		version:1,
		fields:[
			//{ name:"data",		type:"text"	}
		],
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
	}
}
bg.RegisterProjectGenerator(bg.global_project, realityGenerator);