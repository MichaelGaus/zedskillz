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
  noun: "A **noun** is a word that names a person, place, thing, or idea.\n\nTypes:\n- **Common noun** — general name: teacher, market, river\n- **Proper noun** — specific name, capitalized: Lusaka, Zambia, Kariba Dam\n- **Abstract noun** — idea/feeling: freedom, courage, love\n- **Collective noun** — group: team, family, herd\n\nExamples in Zambian context:\n- Person: *teacher*, *doctor*, *farmer*\n- Place: *Lusaka*, *Copperbelt*, *market*\n- Thing: *nshima*, *chitenge*, *mobile phone*\n- Idea: *democracy*, *education*, *hope*\n\nNouns are the building blocks of sentences — almost every sentence has at least one noun!",
  verb: "A **verb** is a word that describes an action or a state of being.\n\nTypes:\n- **Action verb** — describes what someone does: run, eat, study\n- **Linking verb** — connects subject to description: is, seems, becomes\n- **Helping verb** — helps the main verb: will run, has eaten, can study\n\nExamples in Zambian context:\n- The farmer *plants* maize (action)\n- Lusaka *is* the capital city (linking)\n- She *will study* for her ECZ exams (helping + action)\n\nVerb tenses tell us WHEN something happens:\n- Present: I *study* (now)\n- Past: I *studied* (yesterday)\n- Future: I *will study* (tomorrow)",
  adjective: "An **adjective** is a word that describes or modifies a noun — it tells us more about a person, place, or thing.\n\nExamples:\n- The *tall* man → tall describes the man\n- A *beautiful* sunset → beautiful describes the sunset\n- *Red* chitenge → red describes the chitenge\n\nTypes:\n- **Descriptive** — describes quality: tall, beautiful, red\n- **Quantitative** — tells how many: three, many, few\n- **Demonstrative** — points out: this, that, these, those\n- **Comparative** — compares: taller, more beautiful\n- **Superlative** — highest degree: tallest, most beautiful\n\nTip: Adjectives make your writing more interesting. Instead of 'The man walked,' try 'The tall, confident man walked briskly.'",
  pronoun: "A **pronoun** is a word that takes the place of a noun to avoid repetition.\n\nTypes:\n- **Personal** — I, you, he, she, it, we, they\n- **Possessive** — mine, yours, his, hers, ours, theirs\n- **Demonstrative** — this, that, these, those\n- **Relative** — who, which, that, whose\n- **Interrogative** — who, what, which, where, when, why\n\nExample without pronoun: 'Maria said Maria would bring Maria's book.'\nWith pronouns: 'Maria said *she* would bring *her* book.'\n\nIn Zambian languages, pronouns work differently. For example, in Bemba, 'ine' means 'I' and 'umo' means 'he/she.'",
  photosynthesis: "Photosynthesis - How plants make their food:\n\nPlants are like tiny kitchens! They use:\n\n- Sunlight (energy source) - captured by chlorophyll\n- Water (from the soil via roots)\n- Carbon dioxide (from the air)\n\nAnd they produce:\n- Glucose (their food/energy)\n- Oxygen (which we breathe - thank you, plants!)\n\nThis happens in the chloroplasts inside leaf cells.\n\nThe equation: 6CO2 + 6H2O + Light → C6H12O6 + 6O2\n\nThink of it this way: plants 'cook' their lunch using sunshine, water, and air, and they give us oxygen as a gift!\n\nWant me to go deeper or try a quiz on this?",
  fraction: "Let me explain fractions simply:\n\nA fraction represents a part of a whole. It has two numbers:\n\n- Numerator (top) - how many parts you have\n- Denominator (bottom) - total number of equal parts\n\nExample: If you cut a mango into 4 equal pieces and eat 1, you ate 1/4 of the mango.\n\nKey operations:\n- Adding: 1/4 + 2/4 = 3/4 (same denominator - just add numerators)\n- Multiplying: 1/2 × 1/3 = 1/6 (multiply both numerators and denominators)\n\nWant me to walk you through a specific fraction problem?",
};

/**
 * Detect follow-up queries — phrases that indicate the user wants to
 * drill deeper into a previous topic rather than starting a new one.
 */
const FOLLOW_UP_PHRASES = [
  "tell me more",
  "more about",
  "elaborate",
  "go deeper",
  "expand on",
  "give me an example",
  "can you give",
  "show me",
  "dive deeper",
  "explain more",
  "in more detail",
  "another example",
  "what about",
  "and also",
  "further explain",
  "continue",
  "continuing",
  "that's interesting",
  "i understand",
  "i see",
  "thanks but",
  "now tell me",
  "what else",
  "can you also",
  "also explain",
  "like that",
  "same topic",
  "related to",
  "on that",
  "about that",
  "from that",
  "the same",
  "previous",
  "earlier",
  "you mentioned",
  "you said",
  "you talked about",
  "drill down",
  "build on",
  "clarify",
  "clarify that",
  "make it clearer",
  "simplify",
  "in simpler terms",
  "summarize that",
  "how does that",
  "why does",
  "why is",
  "what does",
  "how does",
  "how is",
  "what is the difference",
  "compare",
  "contrast",
];

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
  return `Great question! Let me explain **${topic}** for you.\n\n${topic} is an important concept to understand. Here's a breakdown:\n\n**Simple definition:** ${topic} refers to a specific idea, process, or thing that plays a role in its field of study.\n\n**Why it matters:** Understanding ${topic} helps you build foundational knowledge that connects to many other topics you'll encounter in school and in real life.\n\n**How to think about it:** Try connecting ${topic} to something familiar in your daily life in Zambia. Concepts become clearer when you can relate them to real examples.\n\n**Want to dive deeper?** Tell me:\n- Which subject area this relates to (English, Math, Science, etc.)\n- Your grade level\n\nAnd I'll give you a more detailed, tailored explanation with specific examples!`;
}

/**
 * Smart mock fallback - generates contextual responses when Gemini is unavailable.
 * NOW CONTEXT-AWARE: analyzes full conversation history to detect follow-up queries
 * and reference the previously discussed topic.
 */
function generateMockResponse(messages: { role: string; content: string }[]): string {
  const userMessages = messages.filter((m) => m.role === "user");
  const aiMessages = messages.filter((m) => m.role === "ai" || m.role === "assistant" || m.role === "model");

  const lastUserMsg = userMessages[userMessages.length - 1]?.content || "";
  const previousUserMsg = userMessages.length > 1 ? userMessages[userMessages.length - 2]?.content : "";
  const lastAiMsg = aiMessages.length > 0 ? aiMessages[aiMessages.length - 1]?.content || "" : "";

  const lower = lastUserMsg.toLowerCase().trim();

  // ─── CONTEXT-AWARE: Detect follow-up queries ────────────────────────
  // If the user is trying to drill down from a previous topic, we reference
  // the last AI response to maintain conversation continuity.
  const isFollowUp = FOLLOW_UP_PHRASES.some(
    (phrase) => lower.includes(phrase)
  );

  // Also detect follow-up by checking if the user message is short and vague
  // (like just "yes", "ok", "more", "continue") — these almost always
  // refer to the previous topic
  const shortVagueFollowups = [
    "more", "yes", "ok", "okay", "continue", "please", "go on",
    "and?", "then?", "next", "sure", "great", "cool", "awesome",
    "indeed", "right", "exactly", "true", "correct", "good",
  ];
  const isShortFollowUp = shortVagueFollowups.includes(lower) && lastAiMsg.length > 0;

  if (isFollowUp || isShortFollowUp) {
    // Extract the topic from the previous AI response or user message
    const previousTopic = extractTopic(previousUserMsg || lastAiMsg.split("\n")[0] || "");

    // Find bold terms in the last AI response (these are likely the key concepts)
    const boldTerms = (lastAiMsg.match(/\*\*([^*]+)\*\*/g) || [])
      .map((m) => m.replace(/\*\*/g, ""))
      .filter((t) => t.length > 1 && t.length < 40);

    // Build a context-aware follow-up response
    if (boldTerms.length > 0) {
      const focusTerm = boldTerms.find(
        (t) => lower.includes(t.toLowerCase())
      ) || boldTerms[0];

      return `Great, let's dive deeper into **${focusTerm}**!\n\nFrom what we discussed, ${focusTerm} is a key concept. Here's a more detailed breakdown:\n\n**What ${focusTerm} really means:** ${focusTerm} goes beyond a simple definition — it connects to several related ideas.\n\n**Real-world example:** Think about how ${focusTerm} works in everyday Zambian life. Whether you're at school, at the market, or at home, ${focusTerm} shows up in practical ways.\n\n**Common mistakes to avoid:** Students often confuse ${focusTerm} with similar concepts. Remember the key distinction we covered earlier.\n\n**Practice tip:** Try writing your own example of ${focusTerm}. When you can create your own example, you truly understand the concept!\n\nWould you like me to:\n1. Give you a practice quiz on ${focusTerm}\n2. Show you how ${focusTerm} connects to other topics\n3. Explain it in a Zambian language (Bemba/Nyanja/Tonga)\n\nJust pick an option or ask anything else!`;
    }

    // No bold terms found — use the extracted topic
    if (previousTopic && previousTopic !== "New Chat" && previousTopic.length > 1) {
      return `Let me expand on **${previousTopic}** for you!\n\nWe touched on this earlier — here's a deeper look:\n\n**Core idea:** ${previousTopic} is a concept that has several layers of understanding. The more you explore it, the clearer it becomes.\n\n**Key details:**\n- The foundation: what makes ${previousTopic} work\n- The application: how you'll use ${previousTopic} in practice\n- The connections: how ${previousTopic} links to other topics in your curriculum\n\n**Study strategy:** When revising ${previousTopic} for your exams, focus on:\n1. Understanding the definition clearly\n2. Being able to give examples\n3. Knowing how it differs from related concepts\n\nWant me to:\n- Generate a quiz on ${previousTopic}\n- Translate key terms into Bemba/Nyanja/Tonga\n- Compare ${previousTopic} with related concepts\n\nKeep asking questions — that's how learning works!`;
    }

    // Generic follow-up when we can't extract a specific topic
    return `You're building on what we discussed — great thinking!\n\nTo help you go deeper, could you tell me:\n\n1. **Which part** of our previous discussion interests you most?\n2. **What angle** would you like to explore — more examples, a quiz, or a deeper explanation?\n3. **Your grade level** — so I can adjust the depth\n\nOr simply ask a specific follow-up question like:\n- \"Give me an example of [the topic]\"\n- \"How does [the topic] connect to [something else]?\"\n- \"What's the difference between [concept A] and [concept B]?\"\n\nI'm here to help you drill down as deep as you want!`;
  }

  // ─── Translation requests ───────────────────────────────────────────
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

  // ─── Quiz generation ────────────────────────────────────────────────
  if (lower.includes("quiz") || lower.includes("test") || lower.includes("exam") || lower.includes("practice")) {
    // If there was a previous topic discussed, make the quiz about that topic
    if (previousUserMsg && extractTopic(previousUserMsg) !== "New Chat") {
      const quizTopic = extractTopic(previousUserMsg);
      return `Here's a practice quiz on **${quizTopic}** — building on what we discussed!\n\n1. Which of the following best describes ${quizTopic}?\n   a) Option A  b) Option B  c) Option C  d) Option D\n\n2. Give an example of ${quizTopic} in everyday Zambian life.\n\n3. How does ${quizTopic} differ from related concepts?\n\n4. True or False: ${quizTopic} is only relevant in one subject area.\n\nTake your time! When you're ready, I'll reveal the answers and explain each one. Want me to adjust the difficulty?`;
    }
    return "Here's a quick practice quiz for you:\n\nMathematics Quiz (ECZ-style)\n\n1. What is 15% of 200?\n   a) 20  b) 30  c) 35  d) 25\n\n2. If a rectangle has length 8cm and width 5cm, what is its area?\n   a) 13cm2  b) 40cm2  c) 35cm2  d) 45cm2\n\n3. Simplify: 3x + 2x - x\n   a) 4x  b) 5x  c) 6x  d) 3x\n\nTake your time! When you're ready, I'll reveal the answers and explain each one.";
  }

  // ─── Lesson summary ─────────────────────────────────────────────────
  if (lower.includes("summarize") || lower.includes("summary") || lower.includes("overview")) {
    // If referencing a previous topic, summarize that
    if (previousUserMsg && extractTopic(previousUserMsg) !== "New Chat") {
      const summaryTopic = extractTopic(previousUserMsg);
      return `Here's a summary of **${summaryTopic}** based on our discussion:\n\n**Key Definition:** ${summaryTopic} is a fundamental concept that we explored together.\n\n**Main Points:**\n- The core meaning and definition\n- Real-world examples from Zambia\n- How it connects to other topics\n- Common mistakes to avoid\n\n**Quick Review Questions:**\n1. Can you define ${summaryTopic} in your own words?\n2. Give an example from daily life\n3. How is ${summaryTopic} different from similar concepts?\n\nWant me to go deeper on any specific point, or shall we move to a new topic?`;
    }
    return "I'd be happy to summarize a lesson for you! Could you tell me:\n\n1. Which subject - Math, Science, English, etc.\n2. Which topic - Fractions, Photosynthesis, Poetry, etc.\n3. Grade level - so I can adjust the depth\n\nFor example, here's a quick summary of Photosynthesis:\n\nPlants use sunlight, water, and carbon dioxide to make their own food (glucose). This process happens in the leaves, specifically in chloroplasts which contain chlorophyll - the green pigment that captures light energy. The by-product is oxygen, which we breathe!\n\nWhat would you like me to summarize?";
  }

  // ─── Math concepts ──────────────────────────────────────────────────
  if (lower.includes("math") || lower.includes("algebra") || lower.includes("fraction") || lower.includes("equation") || lower.includes("calculate") || lower.includes("number")) {
    if (lower.includes("fraction")) {
      return "Let me explain fractions simply:\n\nA fraction represents a part of a whole. It has two numbers:\n\n- Numerator (top) - how many parts you have\n- Denominator (bottom) - total number of equal parts\n\nExample: If you cut a mango into 4 equal pieces and eat 1, you ate 1/4 of the mango.\n\nKey operations:\n- Adding: 1/4 + 2/4 = 3/4 (same denominator - just add numerators)\n- Multiplying: 1/2 × 1/3 = 1/6 (multiply both numerators and denominators)\n\nWant me to walk you through a specific fraction problem?";
    }
    if (lower.includes("equation") || lower.includes("algebra")) {
      return "Solving simple equations step by step:\n\nThe goal: find the value of the unknown variable (usually x).\n\nExample: Solve 2x + 6 = 14\n\nStep 1: Subtract 6 from both sides → 2x = 8\nStep 2: Divide both sides by 2 → x = 4\n\nAnswer: x = 4\n\nCheck: 2(4) + 6 = 8 + 6 = 14 (Correct!)\n\nThe key rule: whatever you do to one side, do the same to the other. Like sharing Equal sweets between two friends fairly!\n\nWant to try another one?";
    }
    return "Mathematics is the study of numbers, patterns, and relationships. It includes:\n\n- Arithmetic - basic operations (add, subtract, multiply, divide)\n- Algebra - solving equations with unknowns (like finding x)\n- Geometry - shapes, angles, areas\n- Statistics - collecting and analyzing data\n\nIn Zambia, math is a core subject in the ECZ curriculum from primary through secondary. It's used everywhere - from calculating prices at the market to measuring land for farming.\n\nWhat specific math topic would you like me to explain?";
  }

  // ─── Science concepts ───────────────────────────────────────────────
  if (lower.includes("science") || lower.includes("physics") || lower.includes("chemistry") || lower.includes("biology") || lower.includes("photosynthesis") || lower.includes("cell") || lower.includes("force") || lower.includes("energy")) {
    if (lower.includes("photosynthesis")) {
      return "Photosynthesis - How plants make their food:\n\nPlants are like tiny kitchens! They use:\n\n- Sunlight (energy source) - captured by chlorophyll\n- Water (from the soil via roots)\n- Carbon dioxide (from the air)\n\nAnd they produce:\n- Glucose (their food/energy)\n- Oxygen (which we breathe - thank you, plants!)\n\nThis happens in the chloroplasts inside leaf cells.\n\nThe equation: 6CO2 + 6H2O + Light → C6H12O6 + 6O2\n\nThink of it this way: plants 'cook' their lunch using sunshine, water, and air, and they give us oxygen as a gift!\n\nWant me to go deeper or try a quiz on this?";
    }
    if (lower.includes("force") || lower.includes("energy")) {
      return "Force and Energy explained:\n\n- Force is a push or pull. When you kick a ball, you apply force. Gravity is a force that pulls things down.\n\n- Energy is the ability to do work. Types include:\n  - Kinetic (movement - like a running athlete)\n  - Potential (stored - like water behind Kariba Dam)\n  - Thermal (heat - like cooking on a charcoal stove)\n  - Electrical - like the power from ZESCO\n\nNewton's 3 Laws of Motion:\n1. An object stays still or moves steadily unless a force acts on it\n2. Force = Mass × Acceleration (F = ma)\n3. Every action has an equal opposite reaction\n\nWhich topic would you like more details on?";
    }
    return "Science helps us understand the natural world through observation and experimentation. Key branches:\n\n- Biology - living things (cells, ecosystems, human body)\n- Chemistry - matter and reactions (atoms, compounds, mixing substances)\n- Physics - forces, energy, electricity, motion\n\nIn the Zambian curriculum, science is taught from Grade 5 onwards, preparing students for ECZ exams.\n\nWhat specific science topic would you like me to explain? I can cover cells, photosynthesis, forces, chemical reactions, and more!";
  }

  // ─── English / language ─────────────────────────────────────────────
  if (lower.includes("english") || lower.includes("grammar") || lower.includes("essay") || lower.includes("writing") || lower.includes("poem") || lower.includes("literature")) {
    return "I can help with English Language and Literature! Here are areas I cover:\n\n- Grammar - sentence structure, tenses, punctuation\n- Essay Writing - how to plan, structure, and write a good essay\n- Comprehension - understanding and analyzing passages\n- Literature - poetry, drama, novels (set texts for ECZ)\n\nQuick tip for essay writing:\n1. Plan - brainstorm ideas first\n2. Structure - Introduction, Body, Conclusion\n3. Proofread - check for spelling and grammar errors\n\nWhat specific English topic do you need help with?";
  }

  // ─── Concept explanation ────────────────────────────────────────────
  if (lower.includes("explain") || lower.includes("what is") || lower.includes("define") || lower.includes("meaning") || lower.includes("what are")) {
    const topic = extractTopic(lastUserMsg);
    return generateConceptExplanation(topic);
  }

  // ─── Greeting / general ─────────────────────────────────────────────
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("greet")) {
    return "Hello! Welcome to Zedskillz!\n\nI'm your AI Tutor and I'm here to help you learn. Here's what I can do:\n\n- Explain concepts in simple terms with Zambian examples\n- Generate quizzes for practice (ECZ-style)\n- Translate phrases to Bemba, Nyanja, or Tonga\n- Summarize lessons so you can review quickly\n- Help with homework - step by step\n\nWhat would you like help with today?";
  }

  // ─── Help / capabilities ────────────────────────────────────────────
  if (lower.includes("help") || lower.includes("can you") || lower.includes("what can") || lower.includes("assist")) {
    return "Here's what I can help you with as your Zedskillz AI Tutor:\n\nStudy Help:\n- Explain any concept in simple terms\n- Walk through problems step by step\n- Create practice quizzes\n\nZambian Languages:\n- Translate to Bemba, Nyanja, Tonga\n- Learn everyday phrases\n\nAcademic Support:\n- Summarize lessons and topics\n- Help with essay writing\n- Prepare for ECZ exams\n\nJust Ask:\nType any question and I'll do my best to help. Try questions like:\n- \"Explain photosynthesis\"\n- \"Generate a math quiz\"\n- \"Translate 'thank you' to Bemba\"";
  }

  // ─── Default contextual response ────────────────────────────────────
  // If we have a previous topic, try to connect the new question to it
  if (lastAiMsg.length > 20 && previousUserMsg) {
    const prevTopic = extractTopic(previousUserMsg);
    if (prevTopic && prevTopic !== "New Chat" && prevTopic.length > 2) {
      return `That's a great question! It sounds like it might connect to what we discussed about **${prevTopic}**.\n\nLet me address your question: "${lastUserMsg.trim()}"\n\nHere's what I can offer:\n\n1. **If this relates to ${prevTopic}** — I can explain the connection and how they work together\n2. **If this is a new topic** — I can explain it in simple terms with Zambian examples\n3. **If this is a problem** — I can walk you through it step by step\n\nTo give you the best explanation, tell me:\n- Which subject this relates to\n- Your grade level\n\nOr just rephrase your question and I'll dive right in!`;
    }
  }

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

/**
 * Ensure Gemini chat history has proper alternating roles.
 * Gemini requires: first message must be "user", then alternating "user"/"model".
 * This function:
 * 1. Filters out greeting messages that start with "model" role
 * 2. Merges consecutive same-role messages
 * 3. Ensures history starts with "user"
 * 4. Returns the cleaned history + the last user message separately
 */
function sanitizeGeminiHistory(
  messages: { role: string; content: string }[]
): { history: { role: "user" | "model"; parts: { text: string }[] }[]; lastUserMessage: string } {
  // Convert roles
  const converted = messages.map((m) => ({
    role: m.role === "ai" || m.role === "assistant" ? "model" : m.role === "system" ? "system" : "user",
    content: m.content,
  }));

  // Filter out system messages
  const filtered = converted.filter((m) => m.role !== "system");

  // Ensure alternation: merge consecutive same-role messages
  const merged: { role: "user" | "model"; content: string }[] = [];
  for (const msg of filtered) {
    if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
      // Merge with previous message of same role
      merged[merged.length - 1].content += "\n\n" + msg.content;
    } else {
      merged.push({ role: msg.role as "user" | "model", content: msg.content });
    }
  }

  // Ensure history starts with "user" role — skip initial "model" messages
  // (these are usually the AI greeting that the user didn't explicitly request)
  while (merged.length > 0 && merged[0].role !== "user") {
    merged.shift();
  }

  // We need at least 2 messages for history (1 user + 1 model)
  // and the last message should be the user's current question
  const lastUserMsg = merged.filter((m) => m.role === "user").pop()?.content || "Hello";

  // History is everything except the last user message
  const historyMessages = merged.slice(0, -1);

  const history = historyMessages.map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  return { history, lastUserMessage: lastUserMsg };
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
        const { history, lastUserMessage } = sanitizeGeminiHistory(
          messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          }))
        );

        const model = gemini.getGenerativeModel({
          model: GEMINI_MODEL,
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        });

        // Only start chat with history if there are previous exchanges
        const chat = model.startChat(
          history.length > 0
            ? { history }
            : {}
        );

        const result = await chat.sendMessageStream(lastUserMessage);
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
          error: "An unexpected error occurred. Please try again.",
        })
      ),
      {
        status: 500,
        headers: { "Content-Type": "text/event-stream" },
      }
    );
  }
}
