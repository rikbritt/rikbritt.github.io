bg.data.language = {};

bg.data.language.mouthShapesByName = 
{
	aei:{
		sounds:["a","e","i"]
	},
	l:{
		sounds:["l"]
	},
	o:{
		sounds:["o"]
	},
	cdg:{
		sounds:["c","d","g","k","n","s","t","x","y","z"]
	},
	fv:{
		sounds:["f","v"]
	},
	qw:{
		sounds:["q","w"]
	},
	bmp:{
		sounds:["b","m","p"]
	},
	u:{
		sounds:["u"]
	},
	e:{
		sounds:["e"]
	},
	r:{
		sounds:["r"]
	},
	th:{
		sounds:["th"]
	},
	chjsh:{
		sounds:["ch","j","sh"]
	}
};

bg.data.language.mouthShapes = [];

for([key, data] of Object.entries(bg.data.language.mouthShapesByName)) {
	bg.data.language.mouthShapes.push(data);
}

bg.data.language.vowels =
[
	{
		letter:"a",
		mouthShape:bg.data.language.mouthShapesByName.aei
	},
	{
		letter:"e",
		mouthShape:bg.data.language.mouthShapesByName.aei
	},
	{
		letter:"i",
		mouthShape:bg.data.language.mouthShapesByName.aei
	},
	{
		letter:"o",
		mouthShape:bg.data.language.mouthShapesByName.o
	},
	{
		letter:"u",
		mouthShape:bg.data.language.mouthShapesByName.u
	}
];


bg.data.language.consonants =
[
	{
		letter:"b",
		mouthShape:bg.data.language.mouthShapesByName.bmp
	},
	{
		letter:"c",
		mouthShape:bg.data.language.mouthShapesByName.cdg
	},
	{
		letter:"d",
		mouthShape:bg.data.language.mouthShapesByName.cdg
	},
	{
		letter:"f",
		mouthShape:bg.data.language.mouthShapesByName.fv
	},
	{
		letter:"g",
		mouthShape:bg.data.language.mouthShapesByName.cdg
	},
	{
		letter:"h",
		mouthShape:null
	},
	{
		letter:"j",
		mouthShape:bg.data.language.mouthShapesByName.chjsh
	},
	{
		letter:"k",
		mouthShape:bg.data.language.mouthShapesByName.cdg
	},
	{
		letter:"l",
		mouthShape:bg.data.language.mouthShapesByName.l
	},
	{
		letter:"m",
		mouthShape:bg.data.language.mouthShapesByName.bmp
	},
	{
		letter:"n",
		mouthShape:bg.data.language.mouthShapesByName.cdg
	},
	{
		letter:"o",
		mouthShape:bg.data.language.mouthShapesByName.o
	},
	{
		letter:"p",
		mouthShape:bg.data.language.mouthShapesByName.bmp
	},
	{
		letter:"q",
		mouthShape:bg.data.language.mouthShapesByName.qw
	},
	{
		letter:"r",
		mouthShape:bg.data.language.mouthShapesByName.r
	},
	{
		letter:"s",
		mouthShape:bg.data.language.mouthShapesByName.cdg
	},
	{
		letter:"t",
		mouthShape:bg.data.language.mouthShapesByName.cdg
	},
	{
		letter:"v",
		mouthShape:bg.data.language.mouthShapesByName.fv
	},
	{
		letter:"w",
		mouthShape:bg.data.language.mouthShapesByName.qw
	},
	{
		letter:"x",
		mouthShape:bg.data.language.mouthShapesByName.cdg
	},
	{
		letter:"y",
		mouthShape:bg.data.language.mouthShapesByName.cdg
	},
	{
		letter:"z",
		mouthShape:bg.data.language.mouthShapesByName.cdg
	}
];

//https://en.wikipedia.org/wiki/English_phonology#Phonotactics
//Onsets

//All single consonant phonemes except /ŋ/

//Stop plus approximant other than /j/:
//pl			play
//bl			blood
//cl / kl		clean
//gl			glove
//pr			prize
//br			bring
//tr			tree
//dr			dream
//cr /kr		crowd
//gr			green
//tw			twin
//dw			dwarf
//gw			language
//kw /qu		quick
//pw			puissance

//Voiceless fricative or /v/ plus approximant other than /j/:[2]
//fl			floor
//sl			sleep
//thl			thlipsis
//fr			friend
//thr			three
//shr			shrimp
//hw / wh		what
//sw			swing
//thw			thwart
//vw			reservoir



