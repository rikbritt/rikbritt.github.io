
var personalityCoreDataDef = {
	version:1,
	name:"Personality Core",
	fields:[
		{ name:"intelligence",			type:"norm",	min:0, max:1 },
		//The ability to acquire and apply knowledge and skills.		
		{ name:"imagination",			type:"norm",	min:0, max:1 },
		//the faculty or action of forming new ideas, or images or concepts of external objects not present to the senses.
		{ name:"sanity",				type:"norm",	min:0, max:1 },
		//the ability to think and behave in a normal and rational manner; sound mental health.
		//Hard to imagine sanity without wisdom.
		{ name:"wisdom",				type:"norm",	min:0, max:1 },
		// the ability to use your knowledge and experience to make good decisions and judgments		
		{ name:"willpower",				type:"norm",	min:0, max:1 },
		//Control exerted to do something or restrain impulses. The ability to delay gratification, resisting short-term temptations in order to meet long-term goals.
		{ name:"socialIntelligence",	type:"norm",	min:0, max:1 },
		//the ability to get along well with others, and to get them to cooperate with you.
		{ name:"aesthete",				type:"norm",	min:0, max:1 },
		//a person who has or professes to have refined sensitivity toward the beauties of art or nature.
		{ name:"ego",					type:"norm",	min:0, max:1 },
		//A person's sense of self-esteem or self-importance.
		//How much are you born with this? And how much learnt through experience?
		{ name:"neurotiscm",			type:"norm",	min:0, max:1 },
		//Neuroticism is a long-term tendency to be in a negative emotional state. People with neuroticism tend to have more depressed moods - they suffer from feelings of guilt, envy, anger, and anxiety more frequently and more severely than other individuals.
		//not calm
		{ name:"empathy",				type:"norm",	min:0, max:1 },
		{ name:"sympathy",				type:"norm",	min:0, max:1 },
		//Feelings of pity and sorrow for someone else's misfortune.
		{ name:"sociability",			type:"norm",	min:0, max:1 },
		//Willing to talk and engage in activities with other people; friendly.
		{ name:"honour",				type:"norm",	min:0, max:1 }
		//the quality of knowing and doing what is morally right.
	]
}
bg.RegisterProjectDataDef(bg.global_project, personalityCoreDataDef);

var personalityCoreWeightDataDef = bg.CreateWeightingDataDef(personalityCoreDataDef);

var personalityDataDef = {
	version:1,
	name:"Personality",
	fields:[
		{ name:"core",					type:"data_def",	default_def:personalityCoreDataDef },
		
		//*** SYMPATHY ***
		//More details traits. Trim as needed. For now putting loads in
		{ name:"selfishness",			type:"norm",	min:0, max:1 },
		//Lacking consideration for other people; concerned chiefly with one's own personal profit or pleasure.
		//opposite of generous?
		{ name:"generousity",			type:"norm",	min:0, max:1 },
		//willing to give and share
		{ name:"cruelty",				type:"norm",	min:0, max:1 },
		//Behaviour which causes physical or mental harm to another. A desire to cause others to suffer
		{ name:"considerate",			type:"norm",	min:0, max:1 },
		//Careful not to inconvenience or harm others.
		{ name:"affection",				type:"norm",	min:0, max:1 },
		//having or displaying warmth or affection
		{ name:"dominance",				type:"norm",	min:0, max:1 },
		//desire for power and influence over others.
		{ name:"detachment",			type:"norm",	min:0, max:1 },
		//Emotional detachment, in psychology, refers to "inability to connect" or "mental assertiveness"
		{ name:"kindness",				type:"norm",	min:0, max:1 },
		//having or showing a friendly, generous, and considerate nature
		{ name:"confrontational",		type:"norm",	min:0, max:1 },
		//Tending to deal with situations in an aggressive way; hostile or argumentative.
		{ name:"supportive",			type:"norm",	min:0, max:1 },
		//help someone and be kind to them when they are having a difficult time
		{ name:"patience",				type:"norm",	min:0, max:1 },
		//the capacity to accept or tolerate delay, problems, or suffering without becoming annoyed or anxious.
		{ name:"competitive",			type:"norm",	min:0, max:1 },
		//having a strong desire to win or to be the best.
		
		//*** INTELLIGENCE ***
		{ name:"curiosity",				type:"norm",	min:0, max:1 },
		//A strong desire to know or learn something.
		//openness to experience
		{ name:"erceptive",			type:"norm",	min:0, max:1 },
		//having or showing sensitive insight - could be categorised for physical, emotional etc.
		{ name:"analytical",			type:"norm",	min:0, max:1 },
		//using analysis or logical reasoning.
		{ name:"practical",				type:"norm",	min:0, max:1 },
		//People who are practical look at things is a reasonable, level-headed way. They are likely to take a coat with them in case it is cold--they know they can take it off if it is too hot--they're just practical.
		{ name:"openMinded",			type:"norm",	min:0, max:1 },
		//willingness to try new things or to hear and consider new ideas.
		
		
		//*** WISDOM ***
		{ name:"spontaneous",			type:"norm",	min:0, max:1 },
		//performed or occurring as a result of a sudden impulse or inclination and without premeditation or external stimulus.
		//impulsive
		{ name:"philosophical",			type:"norm",	min:0, max:1 },
		//meeting trouble with level-headed detachment
		//calm
		{ name:"conscientious",			type:"norm",	min:0, max:1 },
		//Conscientiousness is the personality trait of being careful, or vigilant. Conscientiousness implies a desire to do a task well. Conscientious people are efficient and organized as opposed to easy-going and disorderly.
		{ name:"practical",				type:"norm",	min:0, max:1 },
		//concerned with the actual doing or use of something rather than with theory and ideas.
		
		//*** DISGUST *** - NOT CURRENTLY A CORE
		{ name:"disgust",				type:"norm",	min:0, max:1 },
		//How strong the feeling of disgust is when met with something they don't like.
		{ name:"vengeful",				type:"norm",	min:0, max:1 },
		//seeking to harm someone in return for a perceived injury.
		
		//*** AGREEABLENESS *** - NOT CURRENTLY A CORE
		{ name:"agreeableness",			type:"norm",	min:0, max:1 },
		//Agreeableness is a personality trait manifesting itself in individual behavioral characteristics that are perceived as kind, sympathetic, cooperative, warm and considerate.
		{ name:"sincere",				type:"norm",	min:0, max:1 },
		//open and genuine; not deceitful
		
		//*** SOCIAL INTELLIGENCE ***
		{ name:"charisma",				type:"norm",	min:0, max:1 },
		//compelling attractiveness or charm that can inspire devotion in others
		{ name:"charm",					type:"norm",	min:0, max:1 },
		//The power or quality of delighting, attracting, or fascinating others.
		{ name:"gullibility",			type:"norm",	min:0, max:1 },
		//Gullibility is a failure of social intelligence in which a person is easily tricked or manipulated into an ill-advised course of action. It is closely related to credulity, which is the tendency to believe unlikely propositions that are unsupported by evidence.
		{ name:"leadership",			type:"norm",	min:0, max:1 },
		//ability of an individual or organization to "lead" or guide other individuals, teams, or entire organizations
		{ name:"courteous",				type:"norm",	min:0, max:1 },
		//the showing of politeness in one's attitude and behaviour towards others and gracious good manners.
		//Not dependent on sympathy or empathy.
		{ name:"extraversion",			type:"norm",	min:0, max:1 },
		//A behavior where someone enjoys being around people more than being alone. An example of extraversion is when someone always likes to be around people and enjoys being the center of attention.
		{ name:"witty",					type:"norm",	min:0, max:1 },
		//combining clever conception and facetious expression
		//not boring
		{ name:"manipulative",			type:"norm",	min:0, max:1 },
		//exercising unscrupulous control or influence over a person or situation
		{ name:"loner",					type:"norm",	min:0, max:1 },
		//a person that prefers not to associate with others.
		//not tribal
		{ name:"conformity",			type:"norm",	min:0, max:1 },
		//behaviour in accordance with socially accepted conventions.
		{ name:"introversion",			type:"norm",	min:0, max:1 },
		//Introverts tend to be preoccupied with their own thoughts and feelings and minimize their contact with other people.
		{ name:"quiet",					type:"norm",	min:0, max:1 },
		//restrained in speech, manner, etc.; saying little.
		{ name:"selfConscious",			type:"norm",	min:0, max:1 },
		//feeling undue awareness of oneself, one's appearance, or one's actions.
		{ name:"inhibited",				type:"norm",	min:0, max:1 },
		//unable to act in a relaxed and natural way because of self-consciousness or mental restraint.
		
		//*** WILLPOWER ***
		{ name:"brave",					type:"norm",	min:0, max:1 },
		//ready to face and endure danger or pain; showing courage
		//courageous 
		//not cowardly
		{ name:"selfControl",			type:"norm",	min:0, max:1 },
		{ name:"persitent",				type:"norm",	min:0, max:1 },
		//continuing firmly or obstinately in an opinion or course of action in spite of difficulty or opposition.
		//diligent
		//stubborn
		{ name:"riskTaking",			type:"norm",	min:0, max:1 },
		{ name:"reserved",				type:"norm",	min:0, max:1 },
		//slow to reveal emotion or opinions
		{ name:"organised",				type:"norm",	min:0, max:1 },
		//Being efficient or methodical
		{ name:"serious",				type:"norm",	min:0, max:1 },
		//acting or speaking sincerely and in earnest, rather than in a joking or half-hearted manner
		{ name:"adaptable",				type:"norm",	min:0, max:1 },
		//capable of fitting a particular situation or use.
		//ready and able to change so as to adapt to different circumstances.
		//flexible
		{ name:"concentration",			type:"norm",	min:0, max:1 },
		//power of focusing all one's attention.
		{ name:"hardWorking",			type:"norm",	min:0, max:1 },
		//tending to work with energy and commitment; diligent.
		
		//*** IMAGINATION ***
		{ name:"creativity",			type:"norm",	min:0, max:1 },
		//The use of imagination or original ideas to create something; inventiveness.
		//resourceful
		{ name:"artistic",				type:"norm",	min:0, max:1 },
		//Creativity and skill?
		{ name:"frank",					type:"norm",	min:0, max:1 },
		//characterized by directness in manner or speech
		{ name:"inventive",				type:"norm",	min:0, max:1 },
		
		//*** SPIRITUALITY ***
		{ name:"spirituality",			type:"norm",	min:0, max:1 },
		//the quality of being concerned with the human spirit or soul as opposed to material or physical things.
		{ name:"faith",					type:"norm",	min:0, max:1 },
		//trust or confidence in someone or something. Emphasis on trust?

		//*** HONOUR ***
		{ name:"morality",				type:"norm",	min:0, max:1 },
		//sense of right and wrong
		{ name:"unscrupulous",			type:"norm",	min:0, max:1 },
		//having or showing no moral principles; not honest or fair
		{ name:"loyalty",				type:"norm",	min:0, max:1 },
		{ name:"faithful",				type:"norm",	min:0, max:1 },
		//having or showing true and constant support or loyalty.
		{ name:"reliable",				type:"norm",	min:0, max:1 },
		//trustworthy, dependable
		{ name:"honesty",				type:"norm",	min:0, max:1 },
		//the quality or fact of being honest; uprightness and fairness. 2. truthfulness, sincerity, or frankness
		
		//*** SANITY ***
		{ name:"scientific",			type:"norm",	min:0, max:1 },
		//based on or characterized by the methods and principles of science.
		
		//*** NEUROTICISM ***
		{ name:"anxiety",				type:"norm",	min:0, max:1 },
		//A feeling of worry, nervousness, or unease about something with an uncertain outcome.
		{ name:"aggression",			type:"norm",	min:0, max:1 },
		//feelings of anger or antipathy resulting in hostile or violent behaviour; readiness to attack or confront.
		{ name:"stable",				type:"norm",	min:0, max:1 },
		//sane and sensible; not easily upset or disturbed.
		{ name:"guilt",					type:"norm",	min:0, max:1 },
		
		//*** OPTIMISM ***
		{ name:"optimism",				type:"norm",	min:0, max:1 },
		//Hopefulness and confidence about the future or the success of something.
		//Sources:
		//Confidence in your own actions.
		//Belief you will succeed?
		//Willpower? Ego?
		{ name:"selfConfidence",		type:"norm",	min:0, max:1 },
		//a feeling of trust in one's abilities, qualities, and judgement.
		//Perhaps not dependent on optimism (which is general)
		{ name:"depression",			type:"norm",	min:0, max:1 },
		{ name:"arrogance",				type:"norm",	min:0, max:1 },
		//Having or revealing an exaggerated sense of one's own importance or abilities.
		//confidence mixed with something else?
		{ name:"joyful",				type:"norm",	min:0, max:1 },
		{ name:"playful",				type:"norm",	min:0, max:1 },
		//fond of games and amusement; light-hearted

		//*** EGO ***
		{ name:"vanity",				type:"norm",	min:0, max:1 },
		//Excessive pride in or admiration of one's own appearance or achievements.
		//narcissism
		//Depends on love for self? Ego?
		{ name:"ambition",				type:"norm",	min:0, max:1 },
		//having a strong desire for success or achievement
		{ name:"selfWorth",				type:"norm",	min:0, max:1 },
		//self esteem, ego?
		{ name:"sensitive",				type:"norm",	min:0, max:1 },
		//easily offended or upset.
		{ name:"controlling",			type:"norm",	min:0, max:1 }		
	]
}
bg.RegisterProjectDataDef(bg.global_project, personalityDataDef);

var personalityWeightDataDef = bg.CreateWeightingDataDef(personalityDataDef);