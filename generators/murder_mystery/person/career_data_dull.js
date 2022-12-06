
//categories:
//Education level.
//Job Interest / Excitement.
//Liklihood according to era.
//tools etc a career gives you access to.
//other careers/jobs you interact with typically.
//male/female variations

//todo: Flat list. Make the career generator filter the list down by things like the above.

var mm_profCr = {	name:"Professional" };
var mm_bizCr = {	name:"Business" };
var mm_parodyCr = { name:"Parody"};
var mm_commCr = {	name:"Community" };
var mm_vehCr = {	name:"Driving" };
var mm_noCareer = { name:"Unskilled" };
var mm_1percentCarrer = { };
var mm_parodyCareer = { };

//int = How *Interesting* the job is for a player. Subjective I know.
//earn = How much this job typically earns relative to others.
//fromYear = Year from which this job exists.

var mm_data_careers = [
	{ name:"Architect",         	type:mm_profCr,		earn:0.5	},
	{ name:"Cartographer",      	type:mm_profCr	},
	{ name:"Doctor",                type:mm_profCr,		earn:0.6	},
	{ name:"Engineer",              type:mm_profCr,		earn:0.4	},
	{ name:"Nuclear Scientist",     type:mm_profCr, 	earn:0.6,	yearFrom:1970	},
	{ name:"Pilot",                 type:mm_profCr,		earn:0.5,
		access:["plane"]
	},
	{ name:"Politician",            type:mm_profCr,		earn:0.5,
		skills:["politics"]
	},
	{ name:"Therapist",             type:mm_profCr,		earn:0.4
		skills:["mind"],
		access:["mind"]
	},
	{ name:"Psychiatrist",          type:mm_profCr,		earn:0.6,	yearFrom:1800,
		skills:["mind"]
		access:["medicine"]
	},
	{ name:"Marriage Counciler",    type:mm_profCr	},
	{ name:"Divorce Lawyer",        type:mm_profCr	},
	{ name:"Lawyer",                type:mm_profCr,		earn:0.5	},
	{ name:"Judge",                 type:mm_profCr,		earn:0.6
		skills:["politics", "law"]
	},
	{ name:"Software Engineer",     type:mm_profCr,		yearFrom:1970,
		skills:["computer"]	},
	{ name:"Web Developer", 	type:mm_profCr,		yearFrom:1990	},
	{ name:"Game Designer", 	type:mm_profCr	},
	{ name:"Mathematician", 	type:mm_profCr	},
	{ name:"Vetinarian",    	type:mm_profCr	},
	{ name:"Dentist",       	type:mm_profCr,
		skills:["anatomy"],
		access:["medicine"]
	},
	{ name:"Lady Parts Doctor", type:mm_profCr	},
	{ name:"Optician",          type:mm_profCr	},
	{ name:"Pharmacist",        type:mm_profCr	},
	{ name:"Radiologist",       type:mm_profCr	},
	{ name:"Surgeon",           type:mm_profCr	},
	{ name:"Astronomer",        type:mm_profCr	},
	{ name:"CEO",               type:mm_profCr,		int:0.5	},
	
	{ name:"Accountant",        type:mm_bizCr, earn:0.5                     },
	{ name:"IRS / Tax",         type:mm_bizCr, earn:0.5                     },
	{ name:"Banker",            type:mm_bizCr, earn:0.5                     },
	{ name:"Ins Claim Checker", type:mm_bizCr, earn:0.5                     },
	{ name:"Loans",             type:mm_bizCr, earn:0.5                     },
	
	{ name:"Cowboy",            type:mm_parodyCr,	earn:0.2,	yearFrom:1700, yearTo:1900,
		skills:["fighting"],
		access:["gun"]
	},
	
	
	{ name:"Fundraiser",		type:mm_commCr	},
	{ name:"Priest",			type:mm_commCr	},
	{ name:"Activist",			type:mm_commCr	},
		
	{ name:"Bus Driver",		type:mm_vehCr,	int:0.0		},
	{ name:"Taxi Driver",		type:mm_vehCr,	int:0.2	},
	{ name:"Train Driver",		type:mm_vehCr	},
	{ name:"Tram Driver",		type:mm_vehCr	},
	{ name:"Ferry Driver",		type:mm_vehCr	},
	{ name:"Coach Driver",		type:mm_vehCr	},
	{ name:"Lorry Driver",		type:mm_vehCr	},
	
	{ name:"Cleaner",			type:mm_noCareer,	int:0.0	},
	{ name:"Unemployed", 		type:mm_noCareer,	int:0.0	},
	{ name:"Bartender",			type:mm_noCareer,	int:0.0	},
	{ name:"Dishwasher", 		type:mm_noCareer,	int:0.0	},
	
	{ name:"Builder",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Butcher",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Chef",						type:mm_tradeCareer,	earn:0.2		},
	{ name:"Baker",						type:mm_tradeCareer,	earn:0.2		},
	{ name:"Electrician",				type:mm_tradeCareer,	earn:0.2		},
	{ name:"Pest Control",				type:mm_tradeCareer,	earn:0.2		},
	{ name:"Painter",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Plumber",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Carpenter",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Coroner",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Miner",						type:mm_tradeCareer,	earn:0.2		},
	{ name:"Teacher",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Librarian",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Zoo Worker",				type:mm_tradeCareer,	earn:0.2		},
	{ name:"Translator",				type:mm_tradeCareer,	earn:0.2		},
	{ name:"Nurse",						type:mm_tradeCareer,	earn:0.2		},
	{ name:"Farmer",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Hunter",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Lumberjack",				type:mm_tradeCareer,	earn:0.2		},
	{ name:"Waiter",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Fitness Instructor",		type:mm_tradeCareer,	earn:0.2		},
	{ name:"Yoga Instructor",			type:mm_tradeCareer,	earn:0.2		},
	{ name:"Masseuse",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Locksmith",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Handiman",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Car Salesman",				type:mm_tradeCareer,	earn:0.2		},
	{ name:"Salesman",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Secretary",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Groundskeeper",				type:mm_tradeCareer,	earn:0.2		},
	{ name:"Tree Surgeon",				type:mm_tradeCareer,	earn:0.2		},
	{ name:"Postman",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Barber / Hairdresser",		type:mm_tradeCareer,	earn:0.2		},
	{ name:"Nanny",						type:mm_tradeCareer,	earn:0.2		},
	{ name:"Carnie",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"JCB Operator",				type:mm_tradeCareer,	earn:0.2		},
	{ name:"Jewller",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Tailor",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Welder",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Bailiff",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Fisherman",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Model",						type:mm_tradeCareer,	earn:0.2		},
	{ name:"Realtor",					type:mm_tradeCareer,	earn:0.2		},
	{ name:"Travel Agent",				type:mm_tradeCareer,	earn:0.2		},
	
	{ name:"Soldier",					type:mm_serviceCareer,
		skills:["fighting"],
		access:["gun"]	},
	{ name:"Special Forces",			type:mm_serviceCareer	},
	{ name:"Navy Officer",				type:mm_serviceCareer	},
	{ name:"Spy",						type:mm_serviceCareer	},
	{ name:"Policeman",					type:mm_serviceCareer	},
	{ name:"Security Guard",			type:mm_serviceCareer	},
	{ name:"Coast Guard",				type:mm_serviceCareer	},
	{ name:"Customs Agent",				type:mm_serviceCareer	},
	{ name:"Health Inspector",			type:mm_serviceCareer	},
	{ name:"Probation Officer",			type:mm_serviceCareer	},
	{ name:"Bomb Disposal",				type:mm_serviceCareer	},
	{ name:"Museum Curator",			type:mm_serviceCareer	},
	{ name:"Zoo Manager",				type:mm_serviceCareer	},
	{ name:"Fireman",					type:mm_serviceCareer	},
	{ name:"Forest Ranger",				type:mm_serviceCareer	},
	
	{ name:"Footballer",				type:mm_sportCareer		},
	{ name:"Rugby Player",				type:mm_sportCareer		},
	{ name:"Baseball Player",			type:mm_sportCareer		},
	{ name:"MMA Fighter",				type:mm_sportCareer		},
	{ name:"Boxer",						type:mm_sportCareer		},
	{ name:"Referee",					type:mm_sportCareer		},
	
	{ name:"Drug Dealer",				type:mm_criminalCareer	 },
	{ name:"Loan Shark",				type:mm_criminalCareer	 },
	{ name:"Prostitute",				type:mm_criminalCareer	 },
	{ name:"Hells Angels Biker",		type:mm_criminalCareer	 },
	{ name:"Cat Burglar",				type:mm_criminalCareer	 },
	
	{ name:"Actor",						type:mm_artCareer	},
	{ name:"Artist",					type:mm_artCareer	},
	{ name:"Dancer",					type:mm_artCareer	},
	{ name:"Mime",						type:mm_artCareer	},
	{ name:"Sculptor",					type:mm_artCareer	},
	{ name:"Singer",					type:mm_artCareer	},
	{ name:"Musician",					type:mm_artCareer	},
	{ name:"DJ",						type:mm_artCareer	},
	{ name:"Composer",					type:mm_artCareer	},
	{ name:"Poet",						type:mm_artCareer	},
	{ name:"Song Writer",				type:mm_artCareer	},
	{ name:"Rapper",					type:mm_artCareer	},
	{ name:"Photographer",				type:mm_artCareer	},
	{ name:"Talent Scout",				type:mm_artCareer	},
	{ name:"Author",					type:mm_artCareer	},
	{ name:"Comic Book Artist",			type:mm_artCareer	},
		
	{ name:"News Anchor / Reporter",		type:mm_mediaCareer	},
	{ name:"Camera Man",					type:mm_mediaCareer	},
	{ name:"Makeup Artist", alt:"Artists",	type:mm_mediaCareer	},
	{ name:"Stunt Man",						type:mm_mediaCareer	},
	{ name:"Documentary Presenter",			type:mm_mediaCareer	},
	{ name:"Journalist",					type:mm_mediaCareer	},
	
	{ name:"Millionaire Playboy/Girl",		type:mm_1percentCarrer	},
	{ name:"World Famous Actor" ,			type:mm_1percentCarrer	},
	{ name:"Newspaper Editor",				type:mm_1percentCarrer	},
	{ name:"Magazine Editor",				type:mm_1percentCarrer	},
	{ name:"Fasion Designer",				type:mm_1percentCarrer	},
	{ name:"Pop Star",						type:mm_1percentCarrer	},
	{ name:"Rock Star",						type:mm_1percentCarrer	},
	{ name:"Rap Star",						type:mm_1percentCarrer	},
	{ name:"Football Manager",				type:mm_1percentCarrer	},
	{ name:"Silicon Valley CEO" ,			type:mm_1percentCarrer	},
		
	{ name:"Orange President Of America",	type:mm_parodyCareer	},
	{ name:"Insane Dictator",				type:mm_parodyCareer	},
];