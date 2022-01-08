var psychicPowerDataDef = {
	version:1,
	name:"Psychic Powers",
	fields:{
		//https://en.wikipedia.org/wiki/List_of_psychic_abilities
		apportation:{			type:"norm", min:0, max:1,	description:"The ability to undergo materialization, disappearance or teleportation of an object"},
		astralProjection:{		type:"norm", min:0, max:1,	description:"The ability to voluntarily project the astral body (consciousness), being associated with out-of-body experience, in which the astral body becomes separate from the physical body (djinn)"},
		auraReading:{			type:"norm", min:0, max:1,	description:"The ability to perceive 'energy fields' surrounding people, places and things."},
		clairaudience:{			type:"norm", min:0, max:1,	description:"The ability to acquire information by paranormal auditory means."},
		claircognizance:{		type:"norm", min:0, max:1,	description:"The ability to acquire psychic knowledge by means of intrinsic knowledge."},
		clairgustance:{			type:"norm", min:0, max:1,	description:"The ability to perceive an ethereal substance without contact."},
		clairsentience:{		type:"norm", min:0, max:1,	description:"The ability to acquire psychic knowledge by feeling."},
		clairvoyance:{			type:"norm", min:0, max:1,	description:"The ability to perceive person, object, location, and physical events through extrasensory perception."},
		conjuration:{			type:"norm", min:0, max:1,	description:"The ability to summon items from thin air."},
		divination:{			type:"norm", min:0, max:1,	description:"The ability to gain insight into a situation by way of an occultic standardized process."},
		energyManipulation:{	type:"norm", min:0, max:1,	description:"The ability to manipulate physical and non-physical energy with one's mind."},
		energyMedicine:{		type:"norm", min:0, max:1,	description:"The ability to heal with one's own empathic etheric, astral, mental or spiritual energy."},
		hydrokinesis:{			type:"norm", min:0, max:1,	description:"The ability to manipulate water."},
		levitation:{			type:"norm", min:0, max:1,	description:"The ability to undergo bodily uplift or fly by mystical means."},
		mediumship:{			type:"norm", min:0, max:1,	description:"The ability to communicate with spirits."},
		premonition:{			type:"norm", min:0, max:1,	description:"The ability to perceive future events."},
		psychicSurgery:{		type:"norm", min:0, max:1,	description:"The ability to remove disease or disorder within or over the body tissue via an 'energetic' incision that heals immediately afterwards."},
		telekinesis:{			type:"norm", min:0, max:1,	description:"The ability to manipulate objects by way of extrasensory perception."},
		pyrokinesis:{			type:"norm", min:0, max:1,	description:"The ability to manipulate fire with your mind."},
		remoteViewing:{			type:"norm", min:0, max:1,	description:"The ability to see a distant and unseen target using extrasensory perception."},
		retrocognition:{		type:"norm", min:0, max:1,	description:"The ability to perceive past events."},
		scrying:{				type:"norm", min:0, max:1,	description:"The ability to look into a suitable medium with a view to detect significant information."},
		telepathy:{				type:"norm", min:0, max:1,	description:"The ability to transfer thoughts mentally through extrasensory perception."}
	}
};

var scientificPossibilitiesDataDef = {
	version:1,
	name:"Scientific Possibilities",
	fields:{
		timeTravel:{			type:"bool", description:"Is time travel possible." },
		antiGravity:{			type:"bool", description:"Is anti-gravity possible." },
		fasterThanLight:{		type:"bool", description:"Is faster than light travel possible."},
		dimensionalTravel:{		type:"bool", description:"Can travel between multiple dimensions."},
		
		//This could be putting too much of a specific tech into this level?
		teleportation:{			type:"bool", description:"Is teleportation possible."},
		forceFields:{			type:"bool", description:"Are force fields possible."}
	}
}

var realityDataDef = {
	version:1,
	name:"Reality",
	fields:{
		mythicism:{				type:"norm", min:0, max:1, description:"How likely mythic beings are." },
		//is god a thing.
		afterlife:{				type:"bool" },
		
		psychicAbilityPower:{		type:"data", dataType:psychicPowerDataDef},
		scientificPossibilities:{	type:"data", dataType:scientificPossibilitiesDataDef},
		
		//Magic - the abilities to perform acts not observed in our reality.
		willedMagic:{			type:"norm", min:0, max:1, description:"How strong magic powered by willpower is in this reality." },
		technologicalMagic:{	type:"norm", min:0, max:1, description:"How strong magic powered by science is in this reality." },
		
		//Specific mythic abilities 
		
	}
}


var realityGenerator = {
	version:1,
	name:"Reality",
	category:["Universe"],
	inputs:{
		species:{		type:"data",		dataType:realityDataDef	}
	},
	outputs:{
		//model:{			type:"model"	}
	},
	script:function(inputs, outputs){
		outputs.data = inputs;
	}
}
bg.RegisterGenerator(realityGenerator);