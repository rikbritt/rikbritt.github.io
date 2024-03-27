
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
var mm_serviceCareer = { name:"Service" };
var mm_sportCareer = { name:"Sport" };
var mm_criminalCareer = { name:"Criminal" };
var mm_artCareer = { name:"Art" };
var mm_1percentCareer = { };
var mm_parodyCareer = { };

//int = How *Interesting* the job is for a player. Subjective I know.
//earn = How much this job typically earns relative to others.
//fromYear = Year from which this job exists.
//title = Title like Dr, Professor etc.

var mm_data_careers = [
	{ 
		name:"Architect",         	type:mm_profCr,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		]
	},
	{
		name:"Doctor",              type:mm_profCr,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
		access:["medicine"]
	},
	{ name:"Pilot",                 type:mm_profCr,	
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
		access:["plane"],
		skills:["flying"]
	},
	{ name:"Politician",            type:mm_profCr,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
		skills:["politics"]
	},
	{ name:"Psychiatrist",          type:mm_profCr,		yearFrom:1800,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
		skills:["mind"],
		access:["medicine"]
	},
	{ name:"Judge",                 type:mm_profCr,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
		skills:["politics", "law"]
	},
	{ name:"Dentist",       	type:mm_profCr,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
		skills:["anatomy"],
		access:["medicine"]
	},
	{ name:"Lady Parts Doctor", type:mm_profCr,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
	},
	{ name:"CEO",               type:mm_profCr,		int:0.5,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
	},
		
	{ name:"Priest",			type:mm_commCr,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],	
	},
		
	
	{ name:"Soldier",					type:mm_serviceCareer,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
		skills:["fighting"],
		access:["gun"]	},

	{ name:"Footballer",				type:mm_sportCareer,
		levels:[
			{	success:0.4,	earn:0.2,	fame:0.2	},
			{	success:0.8,	earn:0.6,	fame:0.4	},
			{	success:1.0,	earn:0.9,	fame:1.0	},
		],
	},

	
	{ name:"Drug Dealer",				type:mm_criminalCareer,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
	},
	{ name:"Prostitute",				type:mm_criminalCareer,
		levels:[
			{	success:0.8,	earn:0.1,	fame:0.1	},
			{	success:1.0,	earn:0.2,	fame:0.2	},
		],
	},

	{ name:"Actor",						type:mm_artCareer,
		levels:[
			{	success:0.3,	earn:0.1,	fame:0.0	},
			{	success:0.8,	earn:0.4,	fame:0.4	},
			{	success:1.0,	earn:0.9,	fame:1.0	},
		],
	},

	
	{ name:"Millionaire Playboy/Girl",		type:mm_1percentCareer,
		levels:[
			{	success:0.8,	earn:0.8,	fame:0.5	},
			{	success:1.0,	earn:0.8,	fame:0.8	},
		],
	},

	{ name:"Magazine Editor",				type:mm_1percentCareer,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
	},
	{ name:"Fasion Designer",				type:mm_1percentCareer,
		levels:[
			{	success:0.8,	earn:0.4,	fame:0.0	},
			{	success:1.0,	earn:0.6,	fame:0.2	},
		],
	},
	{ name:"Pop Star",						type:mm_1percentCareer,
		levels:[
			{	success:0.8,	earn:0.7,	fame:0.5	},
			{	success:1.0,	earn:0.8,	fame:1.0	},
		],
	},
		
	{ name:"Orange President Of America",	type:mm_parodyCareer,
		levels:[
			{	success:1.0,	earn:0.9,	fame:1.0	},
		],
	},
	{ name:"Insane Dictator",				type:mm_parodyCareer,
		levels:[
			{	success:1.0,	earn:0.9,	fame:0.8	},
		],
	},
];