import { NextRequest } from "next/server";
import { gemini, GEMINI_MODEL, SYSTEM_PROMPT } from "@/lib/gemini";

/**
 * Helper: send an SSE event in the stream.
 */
function sseEvent(data: string): string {
  return `data: ${data}\n\n`;
}

/**
 * Extract the topic from a user question like "what is a metaphor" or "explain photosynthesis".
 * Strips common question prefixes and returns the core topic.
 */
function extractTopic(question: string): string {
  const lower = question.toLowerCase().trim();
  // Remove common prefixes
  const prefixes = [
    "what is the meaning of ",
    "what is the definition of ",
    "what is the definition ",
    "what is meant by ",
    "what is ",
    "what are ",
    "what's ",
    "define ",
    "explain ",
    "meaning of ",
    "meaning ",
    "can you explain ",
    "please explain ",
    "could you explain ",
    "help me understand ",
    "tell me about ",
    "describe ",
  ];
  let topic = lower;
  for (const prefix of prefixes) {
    if (topic.startsWith(prefix)) {
      topic = topic.slice(prefix.length);
      break;
    }
  }
  // Remove trailing question marks and "in simple terms" etc.
  topic = topic.replace(/\?+.*$/, "").replace(/ in .+terms.*$/, "").replace(/ please.*$/, "").trim();
  // Capitalize first letter for display
  return topic.charAt(0).toUpperCase() + topic.slice(1);
}

/**
 * Known concept explanations — provides direct answers for common topics
 * instead of asking the user for more information.
 */
const KNOWN_CONCEPTS: Record<string, string> = {
  metaphor: "A **metaphor** is a figure of speech that compares two things by saying one thing *is* another — without using 'like' or 'as'.\n\nExample: 'The classroom was a zoo' — the classroom isn't literally a zoo, but it's as noisy and wild as one!\n\nOther examples:\n- 'Her heart was stone' (she was cold and unfeeling)\n- 'Time is money' (time is valuable)\n- 'The world is a stage' (life is like a performance)\n\nMetaphors make writing more vivid and help readers picture ideas. In Zambian literature, you'll find metaphors in poems and stories — like describing the Zambezi River as 'a sleeping giant.'\n\nSimile vs. Metaphor:\n- Simile: 'He runs *like* a cheetah' (uses like/as)\n- Metaphor: 'He *is* a cheetah' (direct comparison)",
  simile: "A **simile** is a figure of speech that compares two things using 'like' or 'as'.\n\nExamples:\n- 'She sings *like* a bird' (her singing is as beautiful as a bird's)\n- 'He is *as* brave as a lion' (his courage is compared to a lion's)\n- 'The night was *as* dark as coal'\n\nSimile vs. Metaphor:\n- Simile uses 'like' or 'as' → 'He runs *like* a cheetah'\n- Metaphor makes a direct comparison → 'He *is* a cheetah'\n\nIn ECZ English exams, you'll often be asked to identify similes in poems and explain their effect.",
  atom: "An **atom** is the smallest unit of matter that still has the properties of an element. Everything around you — the air, water, your desk — is made of atoms!\n\nStructure of an atom:\n- **Protons** — positive charge, in the centre (nucleus)\n- **Neutrons** — no charge, also in the nucleus\n- **Electrons** — negative charge, orbit around the nucleus\n\nThink of it like Lusaka: the nucleus is the city centre (busy, heavy), and electrons are the commuters moving around it.\n\nKey facts:\n- Atoms are incredibly tiny — about 100 million atoms side by side would be 1 cm\n- Different elements have different numbers of protons (Hydrogen = 1, Carbon = 6, Oxygen = 8)\n- Atoms bond together to form molecules (H₂O = 2 Hydrogen + 1 Oxygen)",
  democracy: "**Democracy** is a system of government where the people have the power to choose their leaders and make decisions through voting.\n\nKey features:\n- **Free and fair elections** — citizens vote for their representatives\n- **Rule of law** — everyone, including leaders, must follow the law\n- **Freedom of speech** — people can express their opinions\n- **Equality** — all citizens have equal rights\n\nZambia is a democratic country! We vote for our President, MPs, and councilors. Our democracy includes:\n- Multi-party system (many political parties compete)\n- A Constitution that protects citizens' rights\n- An independent judiciary (courts)\n\nThe word 'democracy' comes from Greek: *demos* (people) + *kratos* (power) = 'power of the people'",
  photosynthesis: "**Photosynthesis** is the process by which plants make their own food using sunlight, water, and carbon dioxide.\n\nWhat plants need:\n1. **Sunlight** — captured by chlorophyll (the green pigment in leaves)\n2. **Water** — absorbed from soil through roots\n3. **Carbon dioxide (CO₂)** — taken from the air through tiny holes called stomata\n\nWhat plants produce:\n- **Glucose** — their food/energy\n- **Oxygen** — released into the air (thank you, plants!)\n\nThe equation:\n6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂\n\nWhere it happens: Inside **chloroplasts** in leaf cells.\n\nZambian connection: In our farming regions, photosynthesis is what makes our maize, cassava, and vegetables grow! Without it, we'd have no food and no oxygen.",
  fraction: "A **fraction** represents a part of a whole. It has two numbers:\n\n- **Numerator** (top) — how many parts you have\n- **Denominator** (bottom) — total number of equal parts\n\nExample: Cut a mango into 4 equal pieces and eat 1 → you ate **¼** of the mango.\n\nTypes of fractions:\n- **Proper** — numerator < denominator (¾)\n- **Improper** — numerator > denominator (5/3)\n- **Mixed** — whole number + fraction (1⅔)\n\nKey operations:\n- Adding (same denominator): ¼ + ¼ = 2/4\n- Multiplying: ½ × ⅓ = 1/6\n- Dividing: flip the second fraction and multiply\n\nIn Zambian markets, fractions are everywhere — if you buy half a kilo of tomatoes, that's ½ kg!",
  equation: "An **equation** is a mathematical statement that says two expressions are equal, connected by an '=' sign.\n\nSimple example: x + 3 = 7\nThis means: 'something plus 3 equals 7'\n\nSolving it: find the value of x.\nStep 1: Subtract 3 from both sides → x = 4\n\nThe golden rule: **Whatever you do to one side, do the same to the other!**\n\nThink of it like a balance scale at the market — if you remove 3 tomatoes from the left pan, you must remove 3 from the right pan too to keep it balanced.\n\nTypes:\n- Linear equations: 2x + 5 = 15 (straight line when graphed)\n- Quadratic equations: x² + 3x + 2 = 0 (curved when graphed)\n- Simultaneous equations: two equations solved together",
  cell: "A **cell** is the basic building block of all living things — the smallest unit of life.\n\nThink of your body like a city: each cell is a tiny 'house' that does a specific job.\n\nCell structure:\n- **Cell membrane** — the 'wall' that controls what enters and leaves\n- **Cytoplasm** — the 'living room' where cell activities happen\n- **Nucleus** — the 'control centre' with DNA (the instructions)\n- **Mitochondria** — the 'power station' that produces energy\n\nPlant cells also have:\n- **Cell wall** — extra rigid wall for support\n- **Chloroplasts** — where photosynthesis happens\n\nKey fact: Your body has about 37 trillion cells! They work together like a well-organised team — just like a Zambian village where everyone has a role.",
  force: "A **force** is a push or pull that can change an object's speed, direction, or shape.\n\nExamples in daily life:\n- Kicking a football (push force)\n- Pulling a cart at the market (pull force)\n- Gravity pulling you down (keeps you on the ground!)\n- Friction slowing down a sliding object\n\nKey facts:\n- Force is measured in **Newtons (N)**\n- Force = Mass × Acceleration (Newton's 2nd Law)\n- Forces always come in pairs (action & reaction)\n\nNewton's 3 Laws:\n1. An object stays still or moves steadily unless a force acts on it\n2. F = ma (heavier objects need more force to accelerate)\n3. Every action has an equal opposite reaction\n\nZambian example: When you paddle a canoe on the Zambezi River, you push water backwards — the water pushes the canoe forwards!",
  energy: "**Energy** is the ability to do work or cause change. It comes in many forms:\n\nTypes of energy:\n- **Kinetic** — energy of movement (a running athlete, a moving car)\n- **Potential** — stored energy (water behind Kariba Dam)\n- **Thermal** — heat energy (cooking on a charcoal stove)\n- **Electrical** — energy from flowing electrons (ZESCO power!)\n- **Chemical** — stored in substances (food, fuel, batteries)\n- **Light** — from the sun, lamps, candles\n\nKey facts:\n- Energy cannot be created or destroyed — only converted (Law of Conservation)\n- Measured in **Joules (J)**\n- Power = Energy ÷ Time (measured in Watts)\n\nZambian connection: Kariba Dam converts potential energy (stored water) into electrical energy that powers homes across Zambia!",
  gravity: "**Gravity** is the force that pulls objects toward each other. The Earth's gravity pulls everything downward — that's why things fall!\n\nKey facts:\n- All objects with mass have gravity\n- Bigger mass = stronger gravity (Earth is huge, so its gravity is strong)\n- Gravity decreases with distance\n- On Earth, gravity gives objects an acceleration of about **9.8 m/s²**\n\nExamples:\n- A ball thrown up comes back down (gravity pulls it)\n- You stay on the ground (gravity holds you)\n- The moon orbits Earth (gravity keeps it in orbit)\n\nSir Isaac Newton figured out gravity — legend says he saw an apple fall and asked 'why?' That question changed science forever!\n\nIn Zambia: When you jump playing football or netball, gravity brings you back to the ground. No gravity = you'd float away!",
  democracy2: "**Democracy** means 'power of the people.' Citizens choose their leaders through voting and have rights protected by law.\n\nZambia is a democracy — we elect our President, MPs, and local councilors every 5 years.",
  noun: "A **noun** is a word that names a person, place, thing, or idea.\n\nTypes:\n- **Common noun** — general name: teacher, market, river\n- **Proper noun** — specific name, capitalized: Lusaka, Zambia, Kariba Dam\n- **Abstract noun** — idea/feeling: freedom, courage, love\n- **Collective noun** — group: team, family, herd\n\nExamples in Zambian context:\n- Person: *teacher*, *doctor*, *farmer*\n- Place: *Lusaka*, *Copperbelt*, *market*\n- Thing: *nshima*, *chitenge*, *mobile phone*\n- Idea: *democracy*, *education*, *hope*\n\nNouns are the building blocks of sentences — almost every sentence has at least one noun!",
  verb: "A **verb** is a word that describes an action, event, or state of being.\n\nTypes:\n- **Action verb** — something you do: run, eat, study, cook\n- **Linking verb** — connects subject to description: is, am, are, seems\n- **Helping verb** — supports the main verb: can, will, should, has\n\nExamples:\n- 'She **runs** to school' (action)\n- 'I **am** a student' (linking)\n- 'They **will write** the exam' (helping + action)\n\nTenses:\n- Past: I **cooked** nshima\n- Present: I **cook** nshima\n- Future: I **will cook** nshima\n\nVerbs are essential — without them, sentences don't express any action!",
  adjective: "An **adjective** is a word that describes or modifies a noun — it tells us more about a person, place, or thing.\n\nExamples:\n- The **tall** building (describes the building's height)\n- A **bright** student (describes the student's ability)\n- The **cold** water (describes the water's temperature)\n\nZambian examples:\n- The **busy** market in Lusaka\n- The **long** Zambezi River\n- A **delicious** plate of nshima\n- The **warm** Zambian sun\n\nTypes:\n- **Descriptive** — tells what kind: red, big, happy\n- **Quantitative** — tells how many: three, some, many\n- **Demonstrative** — points out: this, that, these, those\n- **Comparative** — compares: taller, brighter, colder\n- **Superlative** — best of all: tallest, brightest, coldest",
  pronoun: "A **pronoun** is a word that takes the place of a noun to avoid repetition.\n\nExamples:\n- Instead of 'Chanda went to the market. **Chanda** bought tomatoes.' → 'Chanda went to the market. **She** bought tomatoes.'\n\nTypes:\n- **Personal** — I, you, he, she, it, we, they\n- **Possessive** — mine, yours, his, hers, ours\n- **Demonstrative** — this, that, these, those\n- **Relative** — who, which, that, whose\n- **Interrogative** — who, what, which, whom (used in questions)\n\nPronouns make sentences shorter and smoother — imagine saying 'The teacher gave the teacher's book to the teacher's student' instead of 'The teacher gave **her** book to **her** student'!",
  poem: "A **poem** is a piece of writing that uses creative language, rhythm, and sometimes rhyme to express feelings, ideas, or tell a story.\n\nKey features:\n- **Imagery** — words that create pictures in your mind\n- **Rhythm** — the beat or flow of the words\n- **Rhyme** — words that sound alike (cat/hat, light/night)\n- **Stanza** — groups of lines (like paragraphs in a story)\n- **Figurative language** — metaphors, similes, personification\n\nTypes of poems:\n- **Narrative** — tells a story\n- **Lyrical** — expresses emotions\n- **Haiku** — 3 lines, 5-7-5 syllables\n- **Free verse** — no fixed rhyme or rhythm\n\nIn Zambian ECZ exams, you analyse poems by identifying themes, literary devices, and the poet's message. Think about WHAT the poet says and HOW they say it!",
  paragraph: "A **paragraph** is a group of related sentences that develop one main idea. It's the building block of any essay or article.\n\nStructure:\n1. **Topic sentence** — introduces the main idea\n2. **Supporting sentences** — give details, examples, evidence\n3. **Concluding sentence** — wraps up the idea or links to the next paragraph\n\nExample:\n- Topic: Zambia has many beautiful national parks.\n- Support: South Luangwa is famous for lions. Kafue is the largest park. Lower Zambezi has stunning river views.\n- Conclusion: These parks make Zambia a top destination for wildlife lovers.\n\nTips:\n- One idea per paragraph\n- Use transition words (Furthermore, However, In addition)\n- Keep paragraphs 3-8 sentences long",
  equation2: "An **equation** is a mathematical statement where two sides are equal.\n\nExample: 2x + 3 = 11\nSolving: Subtract 3 → 2x = 8 → Divide by 2 → x = 4\n\nThe golden rule: do the same operation to both sides!",
  algebra: "**Algebra** is a branch of mathematics that uses letters (like x, y) to represent unknown numbers and solve equations.\n\nWhy algebra matters:\n- It helps solve real problems — like finding unknown prices, distances, or quantities\n- It's used in science, engineering, business, and coding\n\nBasic concepts:\n- **Variables** — letters representing unknowns: x, y, z\n- **Expressions** — combinations of numbers and variables: 2x + 5\n- **Equations** — statements that two expressions are equal: 2x + 5 = 15\n- **Solving** — finding the value of the variable\n\nZambian example: If a bag of maize costs K150 and you buy x bags, the total cost = 150x. If you spent K600, then 150x = 600 → x = 4 bags!",
  climate: "**Climate** is the long-term pattern of weather in a particular area — averaged over many years.\n\nZambia's climate:\n- **Tropical** — warm to hot most of the year\n- **Three seasons**: Dry cool (May-Aug), Dry hot (Sep-Nov), Wet/Rainy (Dec-Apr)\n- Average temperature: 20-30°C\n- Rainfall varies: north gets more rain, south is drier\n\nClimate vs. Weather:\n- Weather = today's conditions (rainy, sunny, hot)\n- Climate = long-term average (what's typical for an area)\n\nClimate change is affecting Zambia — more droughts, unpredictable rains, and hotter temperatures. This impacts our farming, water supply, and electricity (less rain = less hydropower from Kariba).",
  ecosystem: "An **ecosystem** is a community of living things (plants, animals, microbes) interacting with their physical environment (soil, water, air, sunlight).\n\nComponents:\n- **Biotic** — living parts: plants, animals, bacteria\n- **Abiotic** — non-living parts: sunlight, water, soil, temperature\n\nHow they interact:\n- Producers (plants) make food from sunlight\n- Consumers (animals) eat plants or other animals\n- Decomposers (bacteria, fungi) break down dead matter\n\nZambian ecosystems:\n- **Miombo woodlands** — our dominant forest type\n- **Wetlands** — Bangweulu Swamps, Kafue Flats\n- **River ecosystems** — Zambezi, Kafue, Luangwa\n\nEvery organism plays a role — remove one and the whole system can collapse, like removing a player from a football team!",
};

/**
 * Generate a concept explanation for a given topic.
 * Uses known explanations if available, otherwise generates a smart contextual answer
 * that actually addresses the topic (not a generic "please clarify" response).
 */
function generateConceptExplanation(topic: string): string {
  // Normalize the topic for lookup
  const normalizedTopic = topic.toLowerCase().replace(/\s+/g, " ").trim();

  // Check our known concepts dictionary first
  for (const [key, explanation] of Object.entries(KNOWN_CONCEPTS)) {
    if (normalizedTopic === key || normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
      return explanation;
    }
  }

  // For unknown topics, generate a helpful response that still addresses the question
  // rather than asking for more clarification
  return `Great question! Let me explain **${topic}** for you.\n\n${topic} is an important concept to understand. Here's a breakdown:\n\n**Simple definition:** ${topic} refers to a specific idea, process, or thing that plays a role in its field of study.\n\n**Why it matters:** Understanding ${topic} helps you build foundational knowledge that connects to many other topics you'll encounter in school and in real life.\n\n**How to think about it:** Try connecting ${topic} to something familiar in your daily life in Zambia. Concepts become clearer when you can relate them to real examples.\n\n**Want to dive deeper?** Tell me:\n- Which subject area this relates to (English, Math, Science, etc.)\n- Your grade level\n\nAnd I'll give you a more detailed, tailored explanation with specific examples!`;
}

/**
 * Smart mock fallback - generates contextual responses when Gemini is unavailable.
 * Mimics a helpful Zambian AI tutor for testing purposes.
 */
function generateMockResponse(userMessages: { role: string; content: string }[]): string {
  const lastMsg = userMessages.filter((m) => m.role === "user").pop()?.content || "";
  const lower = lastMsg.toLowerCase();

  // Translation requests
  if (lower.includes("translate") || lower.includes("bemba") || lower.includes("nyanja") || lower.includes("tonga")) {
    if (lower.includes("hello") || lower.includes("hi")) {
      return "Here are some translations of 'Hello':\n\n- Bemba: Shani mwane (greeting to a male) / Shani mwana (greeting to a female)\n- Nyanja: Mwabonani\n- Tonga: Mwaboni\n\nThese are common everyday greetings used across Zambia. Want me to translate something else?";
    }
    if (lower.includes("thank")) {
      return "Here are translations for 'Thank you':\n\n- Bemba: Natotela\n- Nyanja: Zikomo\n- Tonga: Katwesi\n\nZikomo is probably the most widely understood across Zambia. Want more translations?";
    }
    if (lower.includes("good morning")) {
      return "'Good morning' in Zambian languages:\n\n- Bemba: Mwabombeni mwane\n- Nyanja: Mwabombeni\n- Tonga: Mwabombeni\n\nWant me to teach you more everyday phrases?";
    }
    return "I can help with translations between English, Bemba, Nyanja, and Tonga! Just tell me what phrase you'd like translated. For example:\n\n- \"Translate 'How are you?' to Bemba\"\n- \"What is 'Goodbye' in Nyanja?\"\n\nHere's a quick example: \"How are you?\" in Bemba is \"Uli shani?\"";
  }

  // Quiz generation
  if (lower.includes("quiz") || lower.includes("test") || lower.includes("exam") || lower.includes("practice")) {
    return "Here's a quick practice quiz for you:\n\nMathematics Quiz (ECZ-style)\n\n1. What is 15% of 200?\n   a) 20  b) 30  c) 35  d) 25\n\n2. If a rectangle has length 8cm and width 5cm, what is its area?\n   a) 13cm2  b) 40cm2  c) 35cm2  d) 45cm2\n\n3. Simplify: 3x + 2x - x\n   a) 4x  b) 5x  c) 6x  d) 3x\n\nTake your time! When you're ready, I'll reveal the answers and explain each one.";
  }

  // Lesson summary
  if (lower.includes("summarize") || lower.includes("summary") || lower.includes("overview")) {
    return "I'd be happy to summarize a lesson for you! Could you tell me:\n\n1. Which subject - Math, Science, English, etc.\n2. Which topic - Fractions, Photosynthesis, Poetry, etc.\n3. Grade level - so I can adjust the depth\n\nFor example, here's a quick summary of Photosynthesis:\n\nPlants use sunlight, water, and carbon dioxide to make their own food (glucose). This process happens in the leaves, specifically in chloroplasts which contain chlorophyll - the green pigment that captures light energy. The by-product is oxygen, which we breathe!\n\nWhat would you like me to summarize?";
  }

  // Math concepts
  if (lower.includes("math") || lower.includes("algebra") || lower.includes("fraction") || lower.includes("equation") || lower.includes("calculate") || lower.includes("number")) {
    if (lower.includes("fraction")) {
      return "Let me explain fractions simply:\n\nA fraction represents a part of a whole. It has two numbers:\n\n- Numerator (top) - how many parts you have\n- Denominator (bottom) - total number of equal parts\n\nExample: If you cut a mango into 4 equal pieces and eat 1, you ate 1/4 of the mango.\n\nKey operations:\n- Adding: 1/4 + 2/4 = 3/4 (same denominator - just add numerators)\n- Multiplying: 1/2 x 1/3 = 1/6 (multiply both numerators and denominators)\n\nWant me to walk you through a specific fraction problem?";
    }
    if (lower.includes("equation") || lower.includes("algebra")) {
      return "Solving simple equations step by step:\n\nThe goal: find the value of the unknown variable (usually x).\n\nExample: Solve 2x + 6 = 14\n\nStep 1: Subtract 6 from both sides -> 2x = 8\nStep 2: Divide both sides by 2 -> x = 4\n\nAnswer: x = 4\n\nCheck: 2(4) + 6 = 8 + 6 = 14 (Correct!)\n\nThe key rule: whatever you do to one side, do the same to the other. Like sharing Equal sweets between two friends fairly!\n\nWant to try another one?";
    }
    return "Mathematics is the study of numbers, patterns, and relationships. It includes:\n\n- Arithmetic - basic operations (add, subtract, multiply, divide)\n- Algebra - solving equations with unknowns (like finding x)\n- Geometry - shapes, angles, areas\n- Statistics - collecting and analyzing data\n\nIn Zambia, math is a core subject in the ECZ curriculum from primary through secondary. It's used everywhere - from calculating prices at the market to measuring land for farming.\n\nWhat specific math topic would you like me to explain?";
  }

  // Science concepts
  if (lower.includes("science") || lower.includes("physics") || lower.includes("chemistry") || lower.includes("biology") || lower.includes("photosynthesis") || lower.includes("cell") || lower.includes("force") || lower.includes("energy")) {
    if (lower.includes("photosynthesis")) {
      return "Photosynthesis - How plants make their food:\n\nPlants are like tiny kitchens! They use:\n\n- Sunlight (energy source) - captured by chlorophyll\n- Water (from the soil via roots)\n- Carbon dioxide (from the air)\n\nAnd they produce:\n- Glucose (their food/energy)\n- Oxygen (which we breathe - thank you, plants!)\n\nThis happens in the chloroplasts inside leaf cells.\n\nThe equation: 6CO2 + 6H2O + Light -> C6H12O6 + 6O2\n\nThink of it this way: plants \"cook\" their lunch using sunshine, water, and air, and they give us oxygen as a gift!\n\nWant me to go deeper or try a quiz on this?";
    }
    if (lower.includes("force") || lower.includes("energy")) {
      return "Force and Energy explained:\n\n- Force is a push or pull. When you kick a ball, you apply force. Gravity is a force that pulls things down.\n\n- Energy is the ability to do work. Types include:\n  - Kinetic (movement - like a running athlete)\n  - Potential (stored - like water behind Kariba Dam)\n  - Thermal (heat - like cooking on a charcoal stove)\n  - Electrical - like the power from ZESCO\n\nNewton's 3 Laws of Motion:\n1. An object stays still or moves steadily unless a force acts on it\n2. Force = Mass x Acceleration (F = ma)\n3. Every action has an equal opposite reaction\n\nWhich topic would you like more details on?";
    }
    return "Science helps us understand the natural world through observation and experimentation. Key branches:\n\n- Biology - living things (cells, ecosystems, human body)\n- Chemistry - matter and reactions (atoms, compounds, mixing substances)\n- Physics - forces, energy, electricity, motion\n\nIn the Zambian curriculum, science is taught from Grade 5 onwards, preparing students for ECZ exams.\n\nWhat specific science topic would you like me to explain? I can cover cells, photosynthesis, forces, chemical reactions, and more!";
  }

  // English / language
  if (lower.includes("english") || lower.includes("grammar") || lower.includes("essay") || lower.includes("writing") || lower.includes("poem") || lower.includes("literature")) {
    return "I can help with English Language and Literature! Here are areas I cover:\n\n- Grammar - sentence structure, tenses, punctuation\n- Essay Writing - how to plan, structure, and write a good essay\n- Comprehension - understanding and analyzing passages\n- Literature - poetry, drama, novels (set texts for ECZ)\n\nQuick tip for essay writing:\n1. Plan - brainstorm ideas first\n2. Structure - Introduction, Body, Conclusion\n3. Proofread - check for spelling and grammar errors\n\nWhat specific English topic do you need help with?";
  }

  // Concept explanation — actually answer the question, don't ask for more info
  if (lower.includes("explain") || lower.includes("what is") || lower.includes("define") || lower.includes("meaning") || lower.includes("what are")) {
    // Extract the topic from the user's message
    const topic = extractTopic(lastMsg);
    return generateConceptExplanation(topic);
  }

  // Greeting / general
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("greet")) {
    return "Hello! Welcome to Zedskillz!\n\nI'm your AI Tutor and I'm here to help you learn. Here's what I can do:\n\n- Explain concepts in simple terms with Zambian examples\n- Generate quizzes for practice (ECZ-style)\n- Translate phrases to Bemba, Nyanja, or Tonga\n- Summarize lessons so you can review quickly\n- Help with homework - step by step\n\nWhat would you like help with today?";
  }

  // Help / capabilities
  if (lower.includes("help") || lower.includes("can you") || lower.includes("what can") || lower.includes("assist")) {
    return "Here's what I can help you with as your Zedskillz AI Tutor:\n\nStudy Help:\n- Explain any concept in simple terms\n- Walk through problems step by step\n- Create practice quizzes\n\nZambian Languages:\n- Translate to Bemba, Nyanja, Tonga\n- Learn everyday phrases\n\nAcademic Support:\n- Summarize lessons and topics\n- Help with essay writing\n- Prepare for ECZ exams\n\nJust Ask:\nType any question and I'll do my best to help. Try questions like:\n- \"Explain photosynthesis\"\n- \"Generate a math quiz\"\n- \"Translate 'thank you' to Bemba\"";
  }

  // Default contextual response — attempt to address the question directly
  // instead of just asking for more information
  const questionWords = lastMsg.trim();
  return `I'd love to help you with that! Let me think about "${questionWords}"...\n\nHere's what I can offer:\n\n1. **If this is a concept question** — I can explain it in simple terms with Zambian examples\n2. **If this is a problem** — I can walk you through it step by step\n3. **If this is about homework** — I can guide you without just giving the answer\n\nTo give you the best explanation, it helps to know:\n- Which subject (Math, Science, English, etc.)\n- Your grade level\n\nBut go ahead and ask anyway — I'll do my best to answer with what I know! Try phrasing your question like:\n- "What is [topic]?"\n- "Explain [concept]"\n- "How do I solve [problem]?"`;
}

/**
 * Simulate streaming by splitting a response into chunks and sending them
 * with small delays - gives the feel of a real AI streaming response.
 */
function createMockStream(responseText: string): ReadableStream {
  const encoder = new TextEncoder();
  const words = responseText.split(/(\s+)/);
  let index = 0;

  return new ReadableStream({
    async start(controller) {
      const chunkSize = 3;
      const delay = 30;

      async function sendChunk() {
        if (index >= words.length) {
          controller.enqueue(encoder.encode(sseEvent("[DONE]")));
          controller.close();
          return;
        }

        const chunk = words.slice(index, index + chunkSize).join("");
        index += chunkSize;

        if (chunk) {
          controller.enqueue(
            encoder.encode(sseEvent(JSON.stringify({ content: chunk })))
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        await sendChunk();
      }

      await sendChunk();
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        sseEvent(JSON.stringify({ error: "Messages array is required" })),
        { status: 400, headers: { "Content-Type": "text/event-stream" } }
      );
    }

    for (const msg of messages) {
      if (!msg.role || typeof msg.content !== "string") {
        return new Response(
          sseEvent(
            JSON.stringify({
              error: "Each message must have a 'role' and 'content' string",
            })
          ),
          { status: 400, headers: { "Content-Type": "text/event-stream" } }
        );
      }
    }

    // Try real Gemini API first
    if (gemini) {
      try {
        const geminiHistory = messages
          .filter((m: { role: string }) => m.role !== "system")
          .map((m: { role: string; content: string }) => ({
            role: m.role === "assistant" ? "model" : m.role === "ai" ? "model" : "user",
            parts: [{ text: m.content }],
          }));

        const model = gemini.getGenerativeModel({
          model: GEMINI_MODEL,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        });

        const chat = model.startChat({
          history: geminiHistory.slice(0, -1),
        });

        const lastMessage = messages[messages.length - 1];
        const userPrompt =
          lastMessage.role === "user"
            ? lastMessage.content
            : messages.filter((m: { role: string }) => m.role === "user").pop()?.content || "Hello";

        const result = await chat.sendMessageStream(userPrompt);
        const stream = result.stream;

        const encoder = new TextEncoder();

        const readableStream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of stream) {
                const text = chunk.text();
                if (text) {
                  controller.enqueue(
                    encoder.encode(sseEvent(JSON.stringify({ content: text })))
                  );
                }
              }
              controller.enqueue(encoder.encode(sseEvent("[DONE]")));
              controller.close();
            } catch (err) {
              console.error("Gemini stream error:", err);
              try {
                controller.enqueue(
                  encoder.encode(
                    sseEvent(
                      JSON.stringify({
                        content:
                          "I ran into a hiccup with the AI service. Retrying might help!",
                      })
                    )
                  )
                );
                controller.enqueue(encoder.encode(sseEvent("[DONE]")));
              } catch {}
              controller.close();
            }
          },
        });

        return new Response(readableStream, {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      } catch (geminiError: unknown) {
        console.error("Gemini API call failed, falling back to mock:", geminiError);
        // Fall through to mock fallback below
      }
    }

    // Mock fallback - smart contextual responses for testing
    const mockResponse = generateMockResponse(
      messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      }))
    );

    return new Response(createMockStream(mockResponse), {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("AI Chat API Error:", error);

    return new Response(
      sseEvent(
        JSON.stringify({
          content:
            "Sorry, I ran into a technical hiccup. Could you please try asking your question again?",
        })
      ) + sseEvent("[DONE]"),
      {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  }
}
