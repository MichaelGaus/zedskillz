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
  metaphor: `# Metaphor — A Complete Guide

## What Is a Metaphor?

A **metaphor** is a figure of speech that compares two unrelated things by stating that one thing *is* another — without using the words "like" or "as." It creates a direct, imaginative connection between two concepts, allowing the reader to see one thing in terms of another. Unlike a literal statement, a metaphor invites you to think beyond the surface meaning and discover deeper similarities between the two things being compared.

Metaphors are one of the most powerful tools in language. They allow us to express complex ideas, emotions, and experiences in vivid, memorable ways. When we say "the classroom was a zoo," we are not claiming that animals were literally present — instead, we are painting a picture of chaos, noise, and wild energy that helps the listener instantly understand the situation.

## Why Metaphors Matter

Metaphors matter because they serve multiple essential functions in communication and thought:

1. **They make abstract ideas concrete:** Love, freedom, time — these are hard to describe directly. But when Shakespeare writes "Love is a burning flame," we immediately feel the heat, intensity, and consuming nature of love.

2. **They create vivid imagery:** Instead of saying "the man was very angry," a metaphor like "he was a volcano ready to erupt" gives the reader a powerful visual and emotional experience.

3. **They help us understand new concepts:** When learning something unfamiliar, we naturally compare it to something we already know. Scientists call this "mapping" — we map the structure of a familiar concept onto a new one. For example, "the internet is a highway" helps people understand data flow by mapping it onto something they've experienced.

4. **They make writing memorable:** Metaphors stick in the mind far longer than plain descriptions. Advertising, poetry, speeches, and storytelling all rely heavily on metaphors for this reason.

5. **They shape how we think:** Research in cognitive linguistics (by George Lakoff and Mark Johnson) shows that metaphors are not just decorative — they actually structure our thinking. We talk about "arguing is war" (we attack positions, defend claims, shoot down arguments), and this metaphorical framing influences how we actually behave in debates.

## How to Identify a Metaphor

To identify a metaphor, look for statements where something is described as being something else entirely. Here are key patterns:

- **Direct metaphor:** "Time is money" — time is directly equated with money.
- **Implied metaphor:** "She baked a fresh idea" — the creative process is compared to baking, but the comparison is implied rather than stated outright.
- **Extended metaphor:** A metaphor that runs through multiple lines or an entire poem. For instance, if a poem describes life as a journey throughout several stanzas, that is an extended metaphor.
- **Dead metaphor:** A metaphor that has become so common we no longer recognize it as figurative — "the leg of a table," "the foot of a mountain," "the eye of a storm."

## Common Examples of Metaphors

- "Her heart was stone" — she was cold and unfeeling, compared to a hard, unyielding rock
- "Time is money" — time has value, just like currency; wasting time is like wasting wealth
- "The world is a stage" — life is like a theatrical performance, with people playing roles
- "The classroom was a zoo" — the room was chaotic and wild, like an animal enclosure
- "He is a night owl" — he stays up late and is active at night, like an owl
- "Love is a rose" — love has beauty (the flower) but also pain (the thorns)

## Metaphors in Zambian Literature and Culture

In Zambian literature, metaphors are woven deeply into oral traditions, poetry, and modern storytelling. Here are some notable examples:

- The Zambezi River is often described as **"a sleeping giant"** — it appears calm and peaceful on the surface, but beneath lies immense power capable of raging floods, much like the Victoria Falls that thunder with raw energy.
- In Bemba storytelling, elders use metaphors like **"umuti wa mubili"** (medicine of the body) to describe education — it heals ignorance and strengthens the mind, just as medicine heals the physical body.
- Zambian poets frequently compare the Copperbelt to **"the heartbeat of the nation"** — the mines pulse with economic life, just as a heart pumps blood through the body, and without them the country would weaken.
- In everyday Zambian speech, someone struggling financially might say **"ndili mu madig"** (I am in a deep pit) — this metaphor of being trapped in a hole vividly expresses hardship and feeling unable to climb out.

## Metaphor vs. Simile — The Key Difference

This is a distinction that appears frequently in ECZ English exams, so it is essential to understand it clearly:

| Feature | Metaphor | Simile |
|---------|----------|--------|
| Comparison method | Direct — "A is B" | Indirect — "A is like B" or "A is as B" |
| Connector words | None (equates directly) | Uses "like" or "as" |
| Strength | Stronger, more dramatic | Gentler, more qualified |
| Example | "He is a cheetah" | "He runs like a cheetah" |
| Example | "Life is a journey" | "Life is like a journey" |

A metaphor makes a bold, direct claim: the two things ARE the same in some way. A simile softens the claim: they are SIMILAR in some way. Both are powerful, but metaphors tend to be more striking because they assert the comparison more forcefully.

## How to Use Metaphors in Your Writing

When writing essays, stories, or poems for your ECZ exams, using metaphors effectively can significantly improve your marks. Here are strategies:

1. **Start with a clear comparison:** Choose two things that share a meaningful similarity. Don't compare random things — the connection should make sense and reveal something deeper.

2. **Develop the metaphor:** Once you introduce a metaphor, extend it. If you say "school is a garden," then describe teachers as gardeners, students as seedlings, knowledge as water, and exams as seasons of harvest.

3. **Avoid mixed metaphors:** Don't combine incompatible metaphors. "We need to nip this volcano in the bud" mixes gardening (nip in the bud) with geology (volcano) — the result is confusing and unintentionally humorous.

4. **Use metaphors sparingly in formal writing:** In academic essays, one or two well-placed metaphors can strengthen your argument, but overusing them can make your writing seem unserious.

5. **Make your metaphors original:** Avoid clichés like "time is money" or "life is a rollercoaster." Create fresh comparisons that surprise and engage the reader.

## Practice Questions

Try these to test your understanding:

1. Identify the metaphor in: "The exam was a monster stalking the corridors of my mind."
2. Convert this simile to a metaphor: "Her voice was like silk."
3. Write an original metaphor describing a difficult situation at school.
4. Explain why "the leg of a table" is a dead metaphor.
5. In the metaphor "Zambia is a lion," what qualities are being transferred from the lion to the country?

Would you like me to provide answers to these practice questions, or would you like to explore another topic?`,

  simile: `# Simile — A Comprehensive Explanation

## What Is a Simile?

A **simile** is a figure of speech that compares two different things using the words "like" or "as." It creates an explicit, stated comparison that helps the reader understand one thing by relating it to something more familiar. Similes are one of the most common and accessible literary devices — they appear in everyday conversation, poetry, literature, songs, and even advertising.

The key identifying feature of a simile is the presence of "like" or "as" as the bridge between the two things being compared. This makes similes easy to spot, even for beginning students. When you see "like" or "as" creating a comparison (not just a literal resemblance), you are likely looking at a simile.

## How Similes Work

A simile works by drawing a parallel between two things that are different in kind but similar in some specific quality. The comparison highlights a shared characteristic — appearance, behavior, feeling, sound, or any other attribute. For example:

- "She sings *like* a bird" — her singing shares the quality of beauty and sweetness with a bird's song.
- "He is *as* brave as a lion" — his courage shares the boldness and fearlessness associated with lions.
- "The night was *as* dark as coal" — the darkness of the night shares the deep blackness of coal.

In each case, the simile takes something the reader can easily picture (a bird's song, a lion's bravery, coal's blackness) and maps it onto something the writer wants to describe more vividly (a person's singing, a person's courage, the nighttime).

## Types of Similes

Similes can be categorized in several useful ways:

1. **Descriptive similes:** These paint a picture of how something looks, sounds, feels, or behaves. Example: "The water sparkled like diamonds in the sunlight."

2. **Emotional similes:** These express feelings by comparing them to tangible experiences. Example: "Her heart pounded like a drum in her chest" conveys anxiety or excitement.

3. **Evaluative similes:** These express a judgment or opinion. Example: "His argument was as weak as a house of cards" — the comparison carries a negative evaluation.

4. **Humorous similes:** These use absurd or unexpected comparisons for comic effect. Example: "As useful as a chocolate teapot" — the absurdity creates humor.

5. **Proverbial similes:** These are so well-established they've become part of everyday language. Example: "As busy as a bee," "As cold as ice."

## Common Examples of Similes

- "She sings *like* a bird" — comparing the beauty of singing to a bird's song
- "He is *as* brave as a lion" — comparing courage to a lion's boldness
- "The night was *as* dark as coal" — comparing darkness to coal's black color
- "Her smile was *like* sunshine" — comparing warmth and brightness
- "He fought *like* a tiger" — comparing ferocity and determination
- "The rain fell *as* softly as a whisper" — comparing gentle sound
- "As slippery as an eel" — comparing difficulty of grasping (literally and figuratively)
- "As light as a feather" — comparing weightlessness
- "As stubborn as a mule" — comparing unwillingness to change direction

## Simile vs. Metaphor — Understanding the Difference

This comparison is critical for ECZ English exams and appears in nearly every literature paper:

| Feature | Simile | Metaphor |
|---------|--------|----------|
| Comparison method | Uses "like" or "as" | Direct equates (A IS B) |
| Explicitness | The comparison is openly stated | The comparison is implied directly |
| Intensity | Gentler, more qualified | Stronger, more dramatic |
| Example | "He runs *like* a cheetah" | "He *is* a cheetah" |
| Example | "Love *is like* a rose" | "Love *is* a rose" |
| How to convert | Remove "like"/"as" | Add "like"/"as" |

The difference is subtle but important. A simile acknowledges that two things are merely similar — "love is like a rose" means love shares some qualities with a rose. A metaphor asserts that they are identical in the relevant aspect — "love is a rose" claims that love actually IS a rose in essence (in terms of beauty, fragility, thorns/pain).

## Similes in Zambian Context

Similes appear frequently in Zambian oral traditions, literature, and daily speech:

- In Tonga storytelling: **"Mwana uleya like cimbwi"** (The child cries like a hyena) — comparing loud, persistent crying to the distinctive howl of a hyena.
- Describing the Copperbelt mines: **"The tunnels are as deep as the roots of an ancient tree"** — connecting the depth of mine shafts to something familiar and natural.
- ECZ exam poetry often includes similes comparing African landscapes to emotional states — e.g., **"Her sorrow was as vast as the Kalahari"** — the endless desert mirrors the boundless nature of grief.
- In everyday Zambian English: **"As hot as Lusaka in October"** — a locally grounded simile that every Zambian instantly understands, comparing intense heat to the peak summer temperatures.

## How to Use Similes in Your ECZ Exam Writing

1. **Be specific and original:** Avoid clichés. Instead of "as cold as ice," try "as cold as a January morning on the Copperbelt." Localized similes show creativity and cultural awareness.

2. **Ensure the comparison is meaningful:** The two things should genuinely share the quality you are highlighting. "Her eyes were like stars" works because both share brightness. "Her eyes were like potatoes" does not work because eyes and potatoes share no meaningful quality.

3. **Develop your simile:** After introducing a simile, you can extend it. If you say "the market was like a beehive," you might continue: "shoppers buzzed between stalls, workers swarmed around the bus station, and the whole place hummed with energy."

4. **Use similes to create mood:** A simile like "the silence was as heavy as a stone on my chest" creates an oppressive, suffocating mood. "The laughter bubbled like a fresh spring" creates a light, joyful mood. Choose similes that reinforce the emotional tone you want.

5. **Vary your similes:** In a single piece of writing, don't repeat the same type of comparison. Mix visual, auditory, emotional, and conceptual similes for richness.

## Practice Questions

1. Identify the simile in: "The old man's hands were as rough as sandpaper."
2. Convert this metaphor to a simile: "The city is a jungle."
3. Write three original similes using Zambian references.
4. Explain what quality is being compared in: "She danced like a butterfly."
5. Why is "as cold as ice" considered a cliché? How could you refresh it?

Feel free to ask me for answers or to explore any other topic in depth!`,

  noun: `# Nouns — The Building Blocks of Language

## What Is a Noun?

A **noun** is a word that names a person, place, thing, or idea. Nouns are arguably the most fundamental part of speech — almost every sentence in every language contains at least one noun. Without nouns, we would have no way to refer to the subjects and objects that make communication possible. You cannot talk about what happened, what you want, or what you see without using nouns to name those things.

Think of nouns as the "things" that language is built around. Verbs tell us what those things are doing. Adjectives describe what those things look like. But nouns are the things themselves — the people, places, objects, and concepts that form the foundation of every sentence.

## Types of Nouns

Understanding the different types of nouns is essential for both grammar exams and effective writing:

### 1. Common Nouns
Common nouns name general categories of people, places, things, or ideas. They are not capitalized unless they begin a sentence.

Examples: teacher, market, river, book, school, country, car, phone, meal, idea

In Zambia: farmer, teacher, market, village, road, maize, clinic, church, bus

### 2. Proper Nouns
Proper nouns name specific, individual people, places, organizations, or things. They are always capitalized, regardless of where they appear in a sentence.

Examples: Lusaka, Zambia, Kariba Dam, Victoria Falls, ZESCO, ECZ, University of Zambia, President Hichilema

Remember: If it names one specific entity, it is a proper noun and must be capitalized. This is a common mistake in ECZ exams — students often forget to capitalize "Zambia," "Lusaka," or "ECZ."

### 3. Abstract Nouns
Abstract nouns name ideas, feelings, qualities, or states that cannot be perceived with the five physical senses. You cannot touch, see, hear, smell, or taste them — they exist in the mind.

Examples: freedom, courage, love, justice, education, democracy, hope, happiness, anger, knowledge

In Zambian context: Ubuntu (community humanity), independence, development, tradition, culture

Abstract nouns are crucial in essay writing and literature analysis. When a poem discusses "hope," "freedom," or "justice," it is dealing with abstract nouns, and your analysis needs to explore what these concepts mean in context.

### 4. Collective Nouns
Collective nouns name a group of individuals considered as a single unit.

Examples: team, family, herd, flock, crowd, committee, audience, class, choir, swarm

In Zambia: a herd of cattle (on a farm in Southern Province), a flock of birds (at Lake Bangweulu), a crowd of voters (at a polling station), a team of footballers (at a Chipolopolo match)

Note: Collective nouns can be tricky with verb agreement. "The team is winning" (treating the team as one unit) vs. "The team are arguing" (treating the team members as individuals). In British/Zambian English, both can be correct depending on meaning.

### 5. Concrete Nouns
Concrete nouns name things that can be perceived through the five senses — you can touch, see, hear, smell, or taste them.

Examples: table, phone, music, perfume, bread, stone, rain, tree, dog, car

In Zambia: nshima, chitenge, mobile phone, maize, river, market stall, textbook, chalkboard

### 6. Compound Nouns
Compound nouns are made up of two or more words joined together to create a single noun.

Examples: toothbrush, classroom, smartphone, marketplace, mother-in-law, post office

In Zambia: mobile-money, bus-stop, market-place, grade-seven, exam-paper

## Noun Functions in Sentences

Nouns serve several critical roles in sentence structure:

- **Subject:** The noun that performs the action. "The **student** studied."
- **Object:** The noun that receives the action. "The teacher praised the **student**."
- **Complement:** The noun that completes a linking verb. "Lusaka is a **city**."
- **Appositive:** A noun that renames another noun right beside it. "Mr. Banda, the **principal**, spoke at assembly."

## Nouns in Zambian Languages

In Zambian languages like Bemba, Nyanja, and Tonga, nouns work differently from English. These languages use **noun class systems** — every noun belongs to a specific class, and the class determines the prefixes, pronouns, and verb agreements used with that noun. This is similar to gender in European languages (masculine/feminine/neuter), but Zambian languages typically have many more classes (often 15-20).

For example, in Bemba:
- Class 1 (umu-): umunthu (person), umulimi (farmer)
- Class 2 (aba-): abanthu (people), abalimi (farmers)
- Class 3 (umu-): umuti (tree/medicine)
- Class 6 (ama-): amati (trees/medicines)

Understanding noun classes helps you see why Bemba grammar works differently — the noun determines everything else in the sentence!

## Common Mistakes with Nouns (ECZ Exam Tips)

1. **Capitalizing common nouns:** "The City of Lusaka" is wrong — "city" is a common noun. It should be "The city of Lusaka." Only "Lusaka" gets capitalized.

2. **Confusing abstract and concrete:** "Happiness is a feeling" — "happiness" is abstract, "feeling" can be either. Be precise in your definitions.

3. **Wrong collective noun agreement:** "The crowd were cheering" vs. "The crowd was cheering" — both can work, but be consistent in your writing.

4. **Singular/plural errors:** "The childrens' books" is wrong — the plural of "child" is "children," and the possessive is "children's."

## Practice Questions

1. Identify all nouns in: "The brave farmer from Southern Province sold fresh maize at the Lusaka market."
2. Classify each noun as common, proper, abstract, collective, or concrete.
3. Write a sentence using one abstract noun and one concrete noun.
4. What is the abstract noun form of "brave"? (Answer: bravery)
5. Why is "Victoria Falls" a proper noun but "waterfall" a common noun?

Let me know if you want answers, more examples, or to explore another topic!`,

  verb: `# Verbs — The Engines of Every Sentence

## What Is a Verb?

A **verb** is a word that describes an action, an event, or a state of being. Verbs are the engines that drive sentences — without a verb, a sentence cannot express what is happening, what has happened, or what will happen. Every complete sentence must contain at least one verb; it is the one part of speech that no sentence can do without.

Verbs tell us what the subject of a sentence is doing (action verbs), what is happening to it (passive verbs), or what state it is in (linking verbs). They also carry crucial information about time (tense), completion (aspect), and who is performing the action (voice).

## Types of Verbs

### 1. Action Verbs (Dynamic Verbs)
Action verbs describe what someone or something does — a physical or mental activity that can be observed or imagined.

Examples: run, eat, study, write, jump, think, calculate, build, sing, dance

In Zambia: The farmer **plants** maize. The student **reads** the textbook. The driver **steers** the bus along the Great East Road. The footballer **scores** a goal for Chipolopolo.

### 2. Linking Verbs (State Verbs)
Linking verbs do not express action. Instead, they connect the subject to additional information about the subject — a description, identity, or state. The most common linking verb is "be" (am, is, are, was, were, been, being), but others include: seem, become, appear, feel, look, sound, taste, remain, grow.

Examples: Lusaka **is** the capital city. She **seems** tired. The water **becomes** cold at night. The market **looks** busy. The food **tastes** delicious.

Linking verbs are like bridges — they do not show action, they show a relationship between the subject and its description.

### 3. Helping Verbs (Auxiliary Verbs)
Helping verbs work alongside a main verb to express tense, mood, or voice. They "help" the main verb by adding grammatical information.

Common helping verbs: will, shall, can, may, must, should, would, could, might, has, have, had, do, does, did, is, am, are, was, were, been, being

Example: She **will study** for her ECZ exams. (will = helping verb, study = main verb)
Example: They **have completed** the assignment. (have = helping verb, completed = main verb)
Example: The book **was written** by Mr. Banda. (was = helping verb, written = main verb — passive voice)

### 4. Modal Verbs
Modal verbs are a special type of helping verb that express ability, possibility, permission, or obligation.

- **can/could:** ability or possibility — "She can speak three languages."
- **may/might:** permission or possibility — "You may enter the classroom."
- **must:** obligation or necessity — "Students must attend all ECZ exams."
- **shall/should:** intention or recommendation — "You should study every day."
- **will/would:** future intention or conditional — "I will help you with homework."

## Verb Tenses — When Actions Happen

Tense tells us the time of an action or state. English has twelve main tenses, but the most important for ECZ exams are:

### Simple Tenses
- **Simple Present:** I **study** every day. (habitual or ongoing)
- **Simple Past:** I **studied** yesterday. (completed action)
- **Simple Future:** I **will study** tomorrow. (planned action)

### Continuous (Progressive) Tenses
- **Present Continuous:** I **am studying** right now. (action in progress at this moment)
- **Past Continuous:** I **was studying** when the phone rang. (action in progress in the past)
- **Future Continuous:** I **will be studying** at 8 PM. (action in progress in the future)

### Perfect Tenses
- **Present Perfect:** I **have studied** all the chapters. (action completed at some point before now, with relevance to now)
- **Past Perfect:** I **had studied** before the exam started. (action completed before another past action)
- **Future Perfect:** I **will have studied** all topics by Friday. (action that will be completed before a future point)

### Perfect Continuous Tenses
- **Present Perfect Continuous:** I **have been studying** for three hours. (action started in past and still continuing)
- **Past Perfect Continuous:** I **had been studying** for hours before the exam. (ongoing action before a past point)

## Verb Agreement — Subject and Verb Must Match

One of the most common errors in ECZ exams is subject-verb disagreement. The verb must match the subject in number (singular or plural):

- Singular subject → singular verb: "The student **reads** the book."
- Plural subject → plural verb: "The students **read** the book."

Tricky cases:
- "Everyone **has** a book" — "everyone" is singular, so use "has" not "have."
- "The team **is** winning" — collective noun treated as one unit → singular verb.
- "Bread and butter **is** my breakfast" — compound subject treated as one thing → singular verb.
- "Bread and butter **are** on the table" — two separate items → plural verb.

## Active vs. Passive Voice

- **Active voice:** The subject performs the action. "The farmer **planted** the maize." — Clear, direct, strong.
- **Passive voice:** The subject receives the action. "The maize **was planted** by the farmer." — Used when the receiver is more important, or when the doer is unknown.

For ECZ essays, prefer active voice — it is more direct and engaging. Use passive voice when you want to emphasize the receiver of the action or when the doer is unknown or unimportant.

## Practice Questions

1. Identify the verb type (action, linking, or helping) in each sentence:
   a) "The river flows toward the dam."
   b) "She is a brilliant student."
   c) "They will finish the project tomorrow."

2. Convert to past tense: "The teacher explains the lesson clearly."

3. Rewrite in active voice: "The exam was passed by most students."

4. Fill in the correct verb form: "Every student _____ (have/has) a textbook."

5. Write a sentence using a modal verb to express obligation.

Want me to provide detailed answers, or shall we explore another concept?`,

  adjective: `# Adjectives — Painting Words with Detail

## What Is an Adjective?

An **adjective** is a word that describes or modifies a noun or pronoun. It tells us more about the quality, quantity, size, color, shape, origin, or nature of the thing being named. Adjectives are the "paint" of language — without them, writing is a bare sketch; with them, it becomes a rich, colorful portrait.

Consider the difference: "The man walked" vs. "The tall, confident man walked briskly through the bustling Lusaka market." The adjectives transform a flat statement into a vivid scene that the reader can picture, hear, and feel.

## Types of Adjectives

### 1. Descriptive (Qualitative) Adjectives
These describe the quality or characteristic of a noun — they answer "What kind?"

Examples: tall, beautiful, red, hot, cold, brave, smart, old, young, soft, hard

In Zambia: the **tall** baobab tree, the **beautiful** chitenge fabric, the **red** soil of the Copperbelt, the **hot** October sun in Lusaka, the **cold** morning breeze on the plateau

Descriptive adjectives are the most common type and the most powerful for creating vivid writing. When you write ECZ essays or stories, strong descriptive adjectives make your work stand out.

### 2. Quantitative Adjectives
These tell us how many or how much — they answer "How many?" or "How much?"

Examples: three, many, few, some, all, several, enough, each, every, no, numerous

In Zambia: **three** goats, **many** students, **few** resources, **several** provinces, **all** Zambians

### 3. Demonstrative Adjectives
These point out or identify specific nouns — they answer "Which one?"

Examples: this, that, these, those

Usage: **this** book (near, singular), **that** mountain (far, singular), **these** students (near, plural), **those** farms (far, plural)

### 4. Possessive Adjectives
These show ownership or relationship.

Examples: my, your, his, her, its, our, their

Usage: **my** homework, **your** classroom, **our** school, **their** village

### 5. Comparative and Superlative Adjectives
These express degrees of comparison:

- **Positive (base form):** tall, beautiful, smart
- **Comparative (comparing two):** taller, more beautiful, smarter
- **Superlative (comparing three or more):** tallest, most beautiful, smartest

Rules for forming comparative and superlative:
- Short adjectives (1-2 syllables): add -er / -est → tall → taller → tallest
- Long adjectives (3+ syllables): use more / most → beautiful → more beautiful → most beautiful
- Irregular: good → better → best; bad → worse → worst; far → farther → farthest

In Zambia: "Lusaka is **hotter** than Ndola." "The Victoria Falls is **the most spectacular** waterfall in Africa." "Kariba Dam is **the largest** dam in Zambia."

### 6. Proper Adjectives
These are formed from proper nouns and are always capitalized.

Examples: Zambian (from Zambia), African (from Africa), Bemba (from Bemba people), European (from Europe)

Usage: **Zambian** culture, **African** literature, **Bemba** traditions

## Order of Adjectives

When using multiple adjectives before a noun, they follow a specific order in English. Memorizing this order helps you avoid awkward phrasing in ECZ essays:

1. Determiner: a, an, the, this, my
2. Opinion: beautiful, ugly, delicious
3. Size: big, small, tall
4. Shape: round, square, flat
5. Age: old, new, young
6. Color: red, blue, green
7. Origin: Zambian, African, British
8. Material: wooden, cotton, metal
9. Purpose: reading (book), cooking (pot)

Example: "A beautiful large old red Zambian cotton reading cloth" — this follows the correct order. Swap any two and it sounds wrong!

## Adjectives vs. Adverbs — Don't Confuse Them!

A common ECZ exam mistake is using an adjective where an adverb is needed:

- **Adjective** modifies a noun: "She is **quick**" (quick describes she, a noun/pronoun)
- **Adverb** modifies a verb: "She runs **quickly**" (quickly describes runs, a verb)

Wrong: "She runs quick" — "quick" is an adjective, but it needs to modify the verb "runs," so it should be the adverb "quickly."

## How Adjectives Enhance Your Writing

1. **Create sensory experiences:** Instead of "the sunset," write "the golden, fiery sunset spread across the vast Zambian sky." The reader can see it.

2. **Build character:** "The old, wise teacher with kind eyes" vs. "The teacher." Adjectives reveal personality.

3. **Establish mood:** "The dark, cold, empty classroom" creates an eerie, lonely mood. "The bright, warm, welcoming classroom" creates a friendly, inviting mood.

4. **Show rather than tell:** "He was angry" tells. "His face was red, his voice was sharp, his fists were clenched" shows — and all through adjective choices.

## Practice Questions

1. Identify all adjectives in: "The brave young Zambian student carried a heavy old textbook to the busy classroom."
2. Write the comparative and superlative forms of: brave, difficult, good.
3. Place these adjectives in correct order: Italian, leather, old, beautiful, black (before "shoes").
4. Correct the error: "The driver steered careful through the busy road."
5. Write a paragraph about a Zambian market using at least eight descriptive adjectives.

Let me know if you need answers, more examples, or want to explore a different topic!`,

  pronoun: `# Pronouns — Avoiding Repetition and Building Clarity

## What Is a Pronoun?

A **pronoun** is a word that takes the place of a noun or noun phrase. Its primary function is to avoid the awkward repetition of naming the same person, place, thing, or idea over and over. Pronouns allow us to refer to something without constantly repeating its name, making our speech and writing smoother, more natural, and more efficient.

Without pronouns, communication would be extremely cumbersome. Consider this example:

Without pronouns: "Maria said Maria would bring Maria's book to Maria's class so Maria could study for Maria's exam."

With pronouns: "Maria said **she** would bring **her** book to **her** class so **she** could study for **her** exam."

The pronoun version is much more natural and readable. Pronouns are essential to fluent communication.

## Types of Pronouns

### 1. Personal Pronouns
Personal pronouns refer to specific people or things. They change form based on person (first, second, third), number (singular, plural), and case (subject, object).

| | Subject Case | Object Case |
|---|---|---|
| 1st person singular | I | me |
| 2nd person singular | you | you |
| 3rd person singular | he/she/it | him/her/it |
| 1st person plural | we | us |
| 2nd person plural | you | you |
| 3rd person plural | they | them |

Usage: "**I** gave **him** the book." "**She** called **us** yesterday." "**They** invited **me** to the ceremony."

### 2. Possessive Pronouns
Possessive pronouns show ownership without using a noun afterward.

Examples: mine, yours, his, hers, ours, theirs

Usage: "This book is **mine**." "The victory was **ours**." "The house is ** theirs**."

Note: Possessive pronouns are different from possessive adjectives (my, your, his, her, our, their). Possessive adjectives come before a noun: "**my** book." Possessive pronouns stand alone: "the book is **mine**."

### 3. Demonstrative Pronouns
Demonstrative pronouns point to specific things without naming them.

Examples: this, that, these, those

Usage: "**This** is my favorite subject." "**Those** are the exam papers." "**This** looks easier than **that**."

### 4. Relative Pronouns
Relative pronouns connect a relative clause to a main clause, providing more information about a noun.

Examples: who, whom, whose, which, that

Usage: "The teacher **who** taught us mathematics was excellent." "The book **that** I borrowed is on the table." "The student **whose** essay won the prize is my friend."

Who vs. Whom: "Who" is for subjects (who does the action). "Whom" is for objects (who receives the action). "**Who** wrote the letter?" vs. "To **whom** did you send the letter?"

### 5. Interrogative Pronouns
Interrogative pronouns are used to ask questions.

Examples: who, whom, whose, which, what

Usage: "**What** is your name?" "**Who** is the principal?" "**Which** book do you prefer?" "**Whose** bag is this?"

### 6. Reflexive Pronouns
Reflexive pronouns refer back to the subject of the sentence — they show that the subject performs an action on itself.

Examples: myself, yourself, himself, herself, itself, ourselves, yourselves, themselves

Usage: "I **myself** completed the assignment." "She **herself** baked the bread." "They **themselves** organized the event."

### 7. Indefinite Pronouns
Indefinite pronouns refer to nonspecific people or things.

Examples: everyone, somebody, nothing, anyone, each, few, many, several, all, some, none

Usage: "**Everyone** passed the exam." "**Some** prefer mathematics." "**Nothing** is impossible."

## Pronouns in Zambian Languages

In Zambian languages, pronouns operate within the noun class system. The pronoun form depends on the class of the noun it replaces. For example, in Bemba:

- "Ine" = I (first person)
- "Umo" = he/she (class 1 noun reference)
- "Ico" = it (class 7 noun reference)
- "Abo" = they (class 2 noun reference, plural people)

This is fundamentally different from English, where pronouns are based on gender (he/she/it) and number (singular/plural). In Bemba, a "he" pronoun and an "it" pronoun might look completely different depending on which noun class the noun belongs to. Understanding this helps Zambian students appreciate why English pronouns can feel both simpler (fewer forms) and more limited (only he/she/it) compared to their home languages.

## Common Pronoun Mistakes for ECZ Exams

1. **Subject/Object confusion:** "Him and me went to school" is wrong. It should be "He and I went to school" — both are subjects, so use subject case.

2. **Who/Whom confusion:** "Who did you call?" is wrong. It should be "Whom did you call?" — the pronoun is the object of "call."

3. **Pronoun reference ambiguity:** "When the teacher met the parent, she was happy." Who was happy — the teacher or the parent? Make the reference clear.

4. **Its/It's confusion:** "Its" = possessive pronoun (the dog **its** bone). "It's" = contraction of "it is" (**it's** raining). These are completely different!

5. **Their/There/They're:** "Their" = possessive (their books). "There" = location (over there). "They're" = contraction of "they are." Never mix these.

## Practice Questions

1. Identify all pronouns in: "She told them that she would bring her book, which was on the table."
2. Classify each pronoun by type (personal, possessive, relative, etc.).
3. Correct: "Me and him studied for the exam."
4. Choose: Who or Whom? "___ did the teacher praise?"
5. Explain the difference between "its" and "it's" with examples.

Would you like detailed answers, more practice, or to explore another topic?`,

  photosynthesis: `# Photosynthesis — How Plants Make Their Food

## Introduction

Photosynthesis is one of the most important biological processes on Earth. It is the process by which green plants, algae, and some bacteria convert light energy from the sun into chemical energy stored in glucose (sugar). This process not only feeds the plants themselves but also indirectly feeds almost every other living organism on the planet, including humans. Without photosynthesis, there would be no food chains, no oxygen to breathe, and no life as we know it.

Understanding photosynthesis is essential for your Biology and Science exams (ECZ curriculum), and it connects to many other topics: plant anatomy, cellular biology, ecology, energy cycles, and even climate change.

## What Plants Need for Photosynthesis

Plants require three key raw materials to perform photosynthesis:

### 1. Sunlight (Energy Source)
Sunlight provides the energy that drives the entire process. The light energy is captured by a green pigment called **chlorophyll**, which is found inside the chloroplasts of plant cells. Chlorophyll is what gives leaves their green color. It absorbs light primarily in the blue and red wavelengths and reflects green light, which is why leaves appear green to our eyes.

In Zambia, the abundant sunshine throughout most of the year makes photosynthesis highly efficient for local crops like maize, cassava, and vegetables. During the rainy season, clouds can reduce sunlight intensity, temporarily slowing photosynthesis rates.

### 2. Water (H2O)
Water is absorbed by the plant's roots from the soil and transported upward through the stem to the leaves via specialized tubes called **xylem vessels**. In the leaves, water molecules are split apart during the light-dependent reactions of photosynthesis. This splitting (called photolysis) releases oxygen as a byproduct and provides hydrogen atoms that will later be used to build glucose.

In Zambian agriculture, water availability is a critical factor. During drought years, plants cannot get enough water for photosynthesis, leading to reduced crop yields. This is why irrigation projects and water conservation are so important for Zambian farming.

### 3. Carbon Dioxide (CO2)
Carbon dioxide is a gas present in the air (about 0.04% of the atmosphere). It enters the leaves through tiny pores called **stomata** (singular: stoma), which are mostly found on the underside of leaves. The stomata can open and close to regulate gas exchange — when open, CO2 enters and oxygen exits; when closed, the plant conserves water but cannot photosynthesize efficiently.

Carbon dioxide levels are rising globally due to human activities (burning fossil fuels, deforestation), which actually increases photosynthesis rates slightly but also contributes to climate change — a complex trade-off that scientists are studying carefully.

## What Plants Produce

Photosynthesis produces two critical outputs:

### 1. Glucose (C6H12O6)
Glucose is a simple sugar that serves as the plant's primary energy source. The plant uses glucose in several ways:

- **Immediate energy:** Glucose can be broken down through cellular respiration to release energy for the plant's daily activities (growth, nutrient transport, reproduction).
- **Storage:** Excess glucose is converted into starch and stored in roots, stems, seeds, and fruits. When you eat maize (nshima), potatoes, or cassava, you are eating stored starch that the plant made through photosynthesis.
- **Building materials:** Glucose is converted into cellulose, which forms the structural walls of plant cells — giving stems and trunks their strength.

### 2. Oxygen (O2)
Oxygen is released as a byproduct of the light-dependent reactions. It exits the leaf through the same stomata that CO2 entered. This oxygen is what humans and animals breathe. In fact, nearly all the oxygen in Earth's atmosphere was produced by photosynthesis over billions of years. Every time you take a breath, you are benefiting from a plant's photosynthesis!

## The Chemical Equation

The overall balanced equation for photosynthesis is:

6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2

This means: six molecules of carbon dioxide plus six molecules of water, powered by light energy, produce one molecule of glucose and six molecules of oxygen.

## Where Photosynthesis Happens

Photosynthesis occurs inside **chloroplasts**, which are specialized organelles found primarily in the mesophyll cells of leaves. A typical leaf cell contains 40-50 chloroplasts. Each chloroplast has:

- **Outer and inner membranes** — protect the chloroplast's contents
- **Stroma** — the fluid interior where the light-independent reactions (Calvin cycle) occur
- **Thylakoids** — flattened disc-like sacs arranged in stacks called grana, where the light-dependent reactions occur; chlorophyll is embedded in the thylakoid membranes

## The Two Stages of Photosynthesis

### Stage 1: Light-Dependent Reactions
These reactions happen in the thylakoid membranes and require light directly:

1. Chlorophyll absorbs light energy
2. Water molecules are split (photolysis): H2O → 2H+ + O2 (oxygen released)
3. Energy from light is stored in two carrier molecules: ATP and NADPH
4. The hydrogen ions from water splitting will be used in Stage 2

### Stage 2: Light-Independent Reactions (Calvin Cycle)
These reactions happen in the stroma and do not require light directly (but they need the ATP and NADPH produced in Stage 1):

1. CO2 enters the Calvin cycle
2. Using energy from ATP and hydrogen from NADPH, CO2 is converted into glucose through a series of enzyme-catalyzed steps
3. The cycle must go through six turns to produce one glucose molecule

## Factors Affecting Photosynthesis Rate

Several environmental factors influence how quickly a plant can photosynthesize:

1. **Light intensity:** More light = faster photosynthesis (up to a saturation point where all chlorophyll is already being used)
2. **CO2 concentration:** More CO2 = faster photosynthesis (up to a saturation point)
3. **Temperature:** Optimal temperature needed — too cold slows enzymes, too hot denatures enzymes (around 25-35°C is ideal for most plants)
4. **Water availability:** Without water, photosynthesis stops completely
5. **Leaf surface area:** Larger leaves capture more light

In Zambia, these factors create interesting patterns. The warm climate generally supports high photosynthesis rates, but during the dry season (May-October), water scarcity becomes the limiting factor. During the rainy season, clouds can reduce light intensity. Understanding these limiting factors is crucial for Zambian agriculture and is a common ECZ exam topic.

## Why Photosynthesis Matters for Zambia

- **Agriculture:** All Zambian crops (maize, cassava, groundnuts, vegetables) depend on photosynthesis. Understanding the factors that affect it helps farmers improve yields through irrigation, shade management, and CO2 enhancement in greenhouse farming.
- **Forests:** Zambia's forests (miombo woodland) are massive carbon sinks through photosynthesis, absorbing CO2 and producing oxygen. Protecting forests maintains this vital service.
- **Climate change:** As global CO2 rises, understanding photosynthesis helps predict how plants will respond — will they absorb more CO2 and help slow warming, or will other factors limit them?
- **Food security:** Photosynthesis is the foundation of every food chain. Problems with photosynthesis (drought, disease, deforestation) directly threaten food production.

## Practice Questions

1. Name the three raw materials needed for photosynthesis and explain where each comes from.
2. Write the balanced equation for photosynthesis and explain what each component represents.
3. What is chlorophyll, and why is it essential for photosynthesis?
4. Explain the difference between the light-dependent and light-independent reactions.
5. Why does a plant stop photosynthesizing during a severe drought?
6. Describe two ways the plant uses the glucose it produces.
7. What are stomata, and why can they be both helpful and problematic for the plant?

Would you like detailed answers, a quiz, or to explore another topic in depth?`,

  fraction: `# Fractions — Understanding Parts of a Whole

## Introduction

Fractions are one of the most fundamental concepts in mathematics. They represent a part of a whole — when something is divided into equal pieces, a fraction tells us how many of those pieces we are considering. Understanding fractions is essential for everyday life (sharing food, measuring ingredients, calculating discounts) and for advanced mathematics (algebra, probability, ratios).

In the Zambian ECZ curriculum, fractions appear from primary school through secondary school, and misunderstanding them creates problems that cascade into every area of math. This guide covers everything you need to know, from basic definitions to advanced operations.

## What Is a Fraction?

A fraction represents a part of a whole. It is written as two numbers separated by a line (or slash):

**Numerator / Denominator**

- **Numerator** (top number): How many parts you have or are considering
- **Denominator** (bottom number): Total number of equal parts the whole is divided into

Example: If you cut a mango into 4 equal pieces and eat 1 piece, you ate **1/4** of the mango. The numerator (1) tells you you ate one piece. The denominator (4) tells you the mango was divided into four equal pieces.

The fraction line between them means "divided by" — so 1/4 literally means "1 divided by 4," which equals 0.25 in decimal form.

## Types of Fractions

### 1. Proper Fractions
The numerator is smaller than the denominator. The value is less than 1.

Examples: 1/4, 2/5, 3/8, 7/10

In context: If you walk **3/4** of the way to school, you have not yet arrived (less than the whole distance).

### 2. Improper Fractions
The numerator is equal to or greater than the denominator. The value is 1 or more.

Examples: 5/4, 7/3, 12/5, 8/8 (= 1 exactly)

In context: If you eat **5/4** of a mango, you ate more than one whole mango — you ate one whole mango plus one extra quarter.

### 3. Mixed Numbers
A whole number combined with a proper fraction. This is another way to write improper fractions.

Examples: 1 and 1/4 (same as 5/4), 2 and 1/3 (same as 7/3), 3 and 2/5 (same as 17/5)

Converting between improper fractions and mixed numbers:
- Improper to mixed: Divide numerator by denominator. 5 ÷ 4 = 1 remainder 1, so 5/4 = 1 and 1/4
- Mixed to improper: Multiply the whole number by the denominator, add the numerator, put over denominator. 1 and 1/4 = (1 × 4 + 1)/4 = 5/4

### 4. Equivalent Fractions
Fractions that look different but represent the same value. You create equivalent fractions by multiplying or dividing both numerator and denominator by the same number.

Examples: 1/2 = 2/4 = 3/6 = 4/8 = 5/10 = 50/100

This works because multiplying both parts by the same number is like cutting each piece into smaller sub-pieces — the total amount stays the same.

## Fraction Operations

### Adding Fractions

**Same denominator (easy):** Just add the numerators, keep the denominator.

1/4 + 2/4 = 3/4 (one quarter plus two quarters equals three quarters)

Think of it literally: if you have one quarter of a mango and someone gives you two more quarters, you now have three quarters of a mango.

**Different denominators (need common denominator):** Find a common denominator, convert both fractions, then add.

1/3 + 1/4 → Common denominator is 12 → 4/12 + 3/12 = 7/12

How to find common denominators: The easiest method is to multiply the two denominators together (3 × 4 = 12). This always works, though sometimes you can find a smaller common denominator for simpler answers.

### Subtracting Fractions

Same rule as addition — same denominator: subtract numerators directly. Different denominators: find common denominator first.

3/4 - 1/4 = 2/4 = 1/2
7/12 - 3/12 = 4/12 = 1/3

### Multiplying Fractions

Multiply the numerators together and the denominators together.

1/2 × 1/3 = (1×1)/(2×3) = 1/6

Why? If you take half of something, then take one-third of that half, you end up with one-sixth of the original. Picture it: divide a cake into 2 halves. Take one half. Now divide that half into 3 pieces. You have 1/6 of the whole cake.

**Multiplying by a whole number:** Treat the whole number as a fraction with denominator 1.

3 × 2/5 = 3/1 × 2/5 = 6/5 = 1 and 1/5

### Dividing Fractions

Flip the second fraction (find its reciprocal), then multiply.

1/2 ÷ 1/3 = 1/2 × 3/1 = 3/2 = 1 and 1/2

Why flip? Division asks "how many times does the divisor fit into the dividend?" How many 1/3s fit into 1/2? Three 1/3s fit into 1 whole, so 1.5 (3/2) 1/3s fit into 1/2. The flip-and-multiply method is a shortcut that always gives the correct answer.

## Simplifying Fractions

A fraction is simplified (in lowest terms) when the numerator and denominator have no common factors other than 1. To simplify, divide both by their greatest common factor (GCF).

8/12 → GCF of 8 and 12 is 4 → 8÷4 / 12÷4 = 2/3

Always simplify your final answer in ECZ exams unless the question asks for a specific denominator.

## Fractions in Zambian Daily Life

Fractions appear constantly in everyday Zambian life:

- **Sharing food:** If 5 people share 2 mangoes, each person gets 2/5 of a mango.
- **Cooking:** "Add half (1/2) a cup of cooking oil to the nshima recipe."
- **Money:** A 25% discount means you pay 3/4 of the original price.
- **Land:** In customary land allocation, a family might own 1/8 of a village's total land.
- **Time:** "Quarter (1/4) past three" means 3:15 — fifteen minutes is a quarter of an hour.
- **Market prices:** If tomatoes cost K5 per kg and you buy 1/2 kg, you pay K2.50.

## Practice Questions

1. Convert 3 and 2/5 to an improper fraction.
2. Simplify 12/18 to lowest terms.
3. Calculate: 1/3 + 1/6
4. Calculate: 2/5 × 3/4
5. Calculate: 3/4 ÷ 2/3
6. A farmer has 3/4 of a field planted with maize and 1/8 with groundnuts. How much of the field is planted? How much is unplanted?
7. Explain why 1/2 and 3/6 are equivalent fractions.

Would you like me to walk through each answer step by step, or explore another topic?`,
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

    // Build a context-aware follow-up response with expanded detail
    if (boldTerms.length > 0) {
      const focusTerm = boldTerms.find(
        (t) => lower.includes(t.toLowerCase())
      ) || boldTerms[0];

      return `# Going Deeper: ${focusTerm}

Great, let's dive deeper into **${focusTerm}**! Since we've already covered the basics, let me expand on the finer details, practical applications, and common misunderstandings surrounding this concept.

## What ${focusTerm} Really Means

${focusTerm} goes far beyond a simple textbook definition. At its core, it represents a principle or idea that has multiple layers of understanding. The surface-level definition gives you the basic idea, but the deeper you go, the more connections you discover to other concepts, real-world situations, and advanced applications. Understanding ${focusTerm} fully means being able to explain it to someone else, apply it in new contexts, and recognize it when it appears in unfamiliar settings.

## How ${focusTerm} Works in Practice

Let's think about how ${focusTerm} manifests in everyday Zambian life:

- **At school:** ${focusTerm} appears in your textbooks and exam questions, but it also shows up in classroom discussions, group projects, and even how you organize your study schedule. Recognizing when ${focusTerm} is relevant helps you answer questions more accurately and think more critically.

- **At the market or workplace:** Whether you are bargaining at the Lusaka market, managing a small business, or working on a community project, ${focusTerm} has practical implications. Understanding it helps you make better decisions, communicate more clearly, and solve problems more effectively.

- **At home:** ${focusTerm} might influence how you interact with family members, plan your daily routine, or even understand news stories you hear on ZNBC. Knowledge is not confined to the classroom — it enriches every part of your life.

## Common Mistakes and Misconceptions About ${focusTerm}

Students often make several predictable mistakes when dealing with ${focusTerm}. Being aware of these helps you avoid them:

1. **Over-simplification:** Reducing ${focusTerm} to a one-line definition without understanding the nuances. This leads to shallow answers in ECZ exams that miss key marks.

2. **Confusing ${focusTerm} with related concepts:** ${focusTerm} is often confused with similar ideas. The key distinction lies in [the specific defining characteristic]. If you can articulate how ${focusTerm} differs from its closest relatives, you truly understand it.

3. **Failure to apply:** Knowing the theory of ${focusTerm} but struggling to use it in practice. The best way to internalize any concept is to apply it repeatedly in different contexts until it becomes second nature.

4. **Memorizing without understanding:** Rote memorization gives you the words but not the meaning. When exam questions ask you to "explain" or "analyze," memorized definitions will not earn full marks — you need genuine understanding.

## Study Strategy for Mastering ${focusTerm}

When revising ${focusTerm} for your exams, follow this proven approach:

**Step 1: Define it clearly** — Write a definition in your own words, not the textbook's words. If you cannot explain it simply, you do not understand it well enough yet.

**Step 2: Create your own examples** — Come up with 3-5 original examples of ${focusTerm} from your daily life in Zambia. This forces you to think about how the concept actually works, not just what the book says.

**Step 3: Compare and contrast** — Find a concept that is similar to ${focusTerm} and explain how they are alike and how they differ. This deepens your understanding of both concepts.

**Step 4: Test yourself** — Write practice questions about ${focusTerm} and answer them without looking at your notes. Then check your answers and identify gaps.

**Step 5: Teach someone else** — Explain ${focusTerm} to a friend, sibling, or parent. If they can understand your explanation, you have mastered the concept.

## Connections to Other Topics

${focusTerm} does not exist in isolation. It connects to several other topics in your curriculum. Understanding these connections helps you see the bigger picture and answer cross-topic exam questions:

- ${focusTerm} relates to foundational principles that underpin multiple subjects
- The skills you develop while studying ${focusTerm} (critical thinking, analysis, application) transfer to other areas
- Exam questions often combine ${focusTerm} with related concepts, so knowing the connections gives you an advantage

Would you like me to:
1. Give you a practice quiz on ${focusTerm}
2. Show you how ${focusTerm} connects to other specific topics
3. Explain it in a Zambian language (Bemba/Nyanja/Tonga)
4. Walk through exam-style questions about ${focusTerm}

Just pick an option or ask anything else!`;
    }

    // No bold terms found — use the extracted topic with expanded detail
    if (previousTopic && previousTopic !== "New Chat" && previousTopic.length > 1) {
      return `# Expanding on ${previousTopic}

Let me expand on **${previousTopic}** for you! We touched on this earlier, but there is much more to explore. The more deeply you understand a concept, the better prepared you are for exams and for applying knowledge in real life.

## The Core Idea Behind ${previousTopic}

${previousTopic} is a concept that has several layers of understanding. At the most basic level, you learn the definition and can recognize examples. But as you dig deeper, you discover:

- **Why it matters:** ${previousTopic} is not just an abstract idea — it has real consequences and applications in the world. Understanding why it matters gives you motivation to learn it thoroughly and helps you remember it longer.

- **How it works in detail:** Beyond the surface explanation, ${previousTopic} has internal mechanics — specific steps, conditions, or principles that govern how it operates. Mastering these details allows you to predict outcomes, solve problems, and explain the concept confidently.

- **Where it appears:** ${previousTopic} shows up in multiple contexts — in textbooks, in exam questions, in real-life situations, and in related topics. The more contexts you can identify, the more versatile your understanding becomes.

## Key Details to Master

When studying ${previousTopic} for your ECZ exams, focus on these critical areas:

1. **The precise definition:** Many students lose marks because their definition is vague or incomplete. Make sure you can state the definition clearly and completely, including all essential components.

2. **Multiple examples:** Have at least 5 different examples of ${previousTopic} ready — from textbook contexts, from Zambian daily life, and from other subjects. Variety in examples shows depth of understanding.

3. **Comparisons with similar concepts:** Know how ${previousTopic} differs from concepts that students often confuse with it. Being able to articulate distinctions earns higher marks in analysis questions.

4. **Common misconceptions:** Be aware of what students typically get wrong about ${previousTopic} so you can avoid those same errors. This is especially important for multiple-choice questions where distractors are based on common mistakes.

5. **Real-world applications:** Connect ${previousTopic} to situations you encounter in Zambia — at school, at home, in the community, or in the news. This makes the concept memorable and demonstrates practical understanding.

## Study Strategy

When revising ${previousTopic}, follow this structured approach:

**Day 1:** Read about ${previousTopic} and write a clear definition in your own words. Create 3 examples from your own experience.

**Day 2:** Review your definition and examples. Add 2 more examples. Compare ${previousTopic} with a related concept and note the differences.

**Day 3:** Test yourself — write 5 practice questions and answer them without notes. Identify any gaps in your understanding and review those areas specifically.

**Day 4:** Teach ${previousTopic} to someone else. Their questions will reveal aspects you haven't fully grasped. Revise those weak points.

**Day 5:** Do a final review and attempt exam-style questions. Time yourself to practice working under exam conditions.

## How ${previousTopic} Connects to Your Curriculum

${previousTopic} links to several other topics you will encounter in your studies. These connections are important because:

- ECZ exam questions often combine multiple topics in a single question
- Understanding connections helps you transfer knowledge between subjects
- The analytical skills you develop with ${previousTopic} apply broadly

Want me to:
- Generate a detailed quiz on ${previousTopic} with ECZ-style questions
- Translate key terms into Bemba/Nyanja/Tonga
- Compare ${previousTopic} with related concepts in depth
- Walk through specific exam-style questions with full explanations

Keep asking questions — that's how learning works!`;
    }

    // Generic follow-up with expanded guidance
    return `# Let's Go Deeper!

You're building on what we discussed — that's excellent thinking! The desire to explore a topic more thoroughly is one of the most important qualities of a good student. Let me help you structure your deeper exploration.

## How to Explore a Topic in Depth

When you want to go deeper into something we've discussed, here are proven strategies that will help you get the most out of your learning:

**Strategy 1: Ask specific follow-up questions**
Instead of a general "tell me more," try targeted questions that force deeper thinking:
- "What is the difference between [concept A] and [concept B]?"
- "How does [the topic] apply in [a specific situation]?"
- "What would happen if [change one variable]?"
- "Why does [the topic] work the way it does?"
- "What are the limitations of [the topic]?"

**Strategy 2: Request different types of engagement**
I can help you learn in multiple ways:
- Detailed explanations with examples and context
- Practice quizzes (ECZ-style) to test your understanding
- Comparisons between related concepts
- Step-by-step walkthroughs of problems
- Translations into Bemba, Nyanja, or Tonga for key terms
- Real-world applications from Zambian contexts

**Strategy 3: Build connections**
The deepest understanding comes from connecting topics across subjects. For example:
- How does a science concept relate to a math formula?
- How does an English grammar rule appear in everyday speech?
- How does a historical event connect to current Zambian politics?

**Strategy 4: Apply what you've learned**
Try using the concept in a new situation:
- Write a paragraph that uses the concept
- Create your own example from daily Zambian life
- Solve a practice problem using the concept
- Explain the concept to a friend in simple terms

## What I Need From You

To give you the best possible in-depth explanation, please tell me:

1. **Which specific part** of our previous discussion interests you most? Is it a particular definition, an example, a connection to another topic, or an application?

2. **What angle** would you like to explore? Choose one:
   - More examples and real-world applications
   - A detailed quiz to test your understanding
   - A deeper theoretical explanation
   - A comparison with related concepts
   - Step-by-step problem solving

3. **Your grade level** — this helps me adjust the depth and complexity of my explanation to match your curriculum requirements

4. **The subject area** — knowing whether this is for English, Math, Science, or another subject helps me tailor the examples and terminology

Or simply ask a specific follow-up question like:
- "Give me three examples of [the topic] in everyday Zambian life"
- "How does [the topic] connect to [another subject]?"
- "What's the difference between [concept A] and [concept B]?"
- "Walk me through a practice problem about [the topic]"

I'm here to help you drill down as deep as you want — every question is welcome!`;
  }

  // ─── Translation requests ───────────────────────────────────────────
  if (lower.includes("translate") || lower.includes("bemba") || lower.includes("nyanja") || lower.includes("tonga")) {
    if (lower.includes("hello") || lower.includes("hi")) {
      return `# Translations of "Hello" in Zambian Languages

Understanding greetings in Zambian languages is an important part of cultural literacy. Zambia has over 70 ethnic groups and 73 languages, but the four most widely spoken are English, Bemba, Nyanja, and Tonga. Here are detailed translations and cultural context for common greetings:

## Bemba Greetings

- **Shani mwane** — Greeting to a male. This is the most common everyday greeting in Bemba. "Mwane" is a respectful term for a male, similar to "sir" in English. You would use this when greeting an older man, a colleague, or any male you want to show respect to.

- **Shani mwana** — Greeting to a female. Similar to "mwane" but for females. "Mwana" here does not mean "child" (which is its literal translation) — in greeting context, it is a respectful term for a woman.

- **Mwabombeni** — A more formal greeting meaning "well done" or "you have worked." This is often used as a morning greeting, acknowledging that someone has made it through the night or has been working. It shows respect and acknowledgment.

## Nyanja Greetings

- **Mwabonani** — The standard Nyanja greeting, meaning "hello" or "greetings to you all." This is widely used in Lusaka and the Eastern Province. Nyanja is the most commonly spoken language in the capital city, so understanding this greeting is particularly useful.

- **Mwabombeni** — Similar to Bemba, used as a formal/respectful greeting acknowledging someone's efforts.

- **Zikomo** — While technically meaning "thank you," this word is also used as a polite greeting response in Nyanja, especially in formal settings.

## Tonga Greetings

- **Mwaboni** — The standard Tonga greeting. Tonga is primarily spoken in Southern Province, around Livingstone and the Victoria Falls area. If you are visiting that region, knowing this greeting will be appreciated by locals.

- **Mwaboni mwane** — A more respectful version, adding the honorific "mwane."

- **Cakwela** — A greeting specifically asking "how did you sleep?" — similar to asking "did you have a good night?"

## Cultural Notes on Zambian Greetings

In Zambian culture, greetings are not optional — they are an essential part of social interaction. Skipping a greeting is considered rude and disrespectful. Here are important cultural guidelines:

1. **Always greet elders first:** In Zambian society, respect for elders is paramount. When entering a room or meeting a group, greet the oldest person first, then proceed to others.

2. **Use both hands:** When greeting someone with a handshake, it is respectful to use your right hand while lightly touching your right forearm with your left hand. This shows respect and sincerity.

3. **Greeting before business:** Never jump straight into a conversation about business or requests without first exchanging greetings. The greeting establishes the social relationship that makes further conversation acceptable.

4. **Respond to greetings:** If someone greets you, it is important to respond. A silence or nod is not sufficient — you should verbally respond with the appropriate greeting.

These greetings reflect the Zambian value of Ubuntu — the belief that our humanity is connected to others. Greetings acknowledge the other person's existence and worth, which is the foundation of community.

Would you like me to translate more phrases, or explore another topic?`;
    }
    if (lower.includes("thank")) {
      return `# Translations of "Thank You" in Zambian Languages

Expressing gratitude is universal, but how we say it varies across languages and cultures. In Zambia, showing appreciation is deeply valued, and knowing how to say "thank you" in multiple languages shows respect for different communities.

## Detailed Translations

### Bemba: Natotela
"Natotela" is the Bemba word for "thank you." It comes from the root word "tota" which means "to thank" or "to appreciate." The prefix "na-" indicates "I" (the speaker), so "natotela" literally means "I thank you."

Variations:
- **Natotela sana** — "Thank you very much." Adding "sana" intensifies the gratitude.
- **Natotela mukashi** — Thanking a woman specifically.
- **Natotela mulume** — Thanking a man specifically.

### Nyanja: Zikomo
"Zikomo" is perhaps the most widely recognized thank-you across Zambia, even among people who do not speak Nyanja fluently. It has become something of a national expression of gratitude.

Variations:
- **Zikomo kwambiri** — "Thank you very much." "Kwambiri" means "very much" or "a lot."
- **Zikomo chomene** — Another way to express deep gratitude.

Interesting note: "Zikomo" is also used as a greeting response and as a general expression of politeness, similar to how "cheers" works in British English — it covers multiple social situations.

### Tonga: Katwesi
"Katwesi" is the Tonga expression for gratitude. Tonga speakers are primarily found in Southern Province, around Livingstone and the Zambezi valley.

Variations:
- **Katwesi mwane** — A more respectful form of thanks, adding the honorific "mwane."

### Lozi: Tuhotela
Though not one of the three most common languages, Lozi is important in Western Province (Barotseland). "Tuhotela" is the Lozi way of saying thank you, and it is widely used in Mongu and surrounding areas.

## Cultural Context: How Zambians Express Gratitude

In Zambian culture, gratitude goes beyond words:

1. **Verbal thanks are expected:** After receiving help, food, or any kindness, verbal thanks are required. Silence after receiving something is considered rude.

2. **Clapping as thanks:** In some traditional settings, especially in rural areas, people express thanks by clapping their hands in a specific rhythm. This is particularly common during ceremonies and when addressing chiefs or elders.

3. **Reciprocity:** Zambian culture values reciprocity — if someone helps you, you are expected to help them in the future. Gratitude is not just a momentary expression but an ongoing social obligation.

4. **Thanking hosts:** After a meal at someone's home, it is important to thank the host specifically for the food. In Bemba, you might say "Natotela pa nsima" (thank you for the nshima).

Would you like more translations, or shall we explore another topic?`;
    }
    if (lower.includes("good morning")) {
      return `# "Good Morning" in Zambian Languages

Morning greetings in Zambian languages carry more cultural weight than their English equivalent. In Zambian culture, morning greetings are not just polite formulas — they are genuine inquiries about how someone's night went and show care for the person's well-being.

## Detailed Translations

### Bemba: Mwabombeni mwane / Mwabombeni mwana
In Bemba, "Mwabombeni" is the standard morning greeting. It literally means "you have worked" or "you have done well," acknowledging that the person has made it through the night and is present. This reflects the Bemba cultural value of acknowledging effort and survival.

- **Mwabombeni mwane** — Good morning (to a male), with respect
- **Mwabombeni mwana** — Good morning (to a female), with respect
- **Mwabombeni bane** — Good morning (to peers or younger people, less formal)

After the initial greeting, it is customary to ask:
- **Ulya shani?** — How did you sleep? (This is the genuine follow-up question showing real interest.)
- The expected response: **Nalya bwino** — I slept well.

### Nyanja: Mwabombeni
In Nyanja, "Mwabombeni" serves as both a general greeting and specifically a morning greeting. The structure is similar to Bemba, as many Zambian languages share greeting patterns.

- **Mwabombeni** — Good morning / Well done (general respectful greeting)
- Follow-up: **Mwalionse shani?** — How was your night?
- Response: **Nalionse bwino** — My night was good.

### Tonga: Mwaboni / Cakwela
In Tonga, morning greetings have a distinctive form:

- **Cakwela** — Specifically "How did you sleep?" (used as a morning greeting equivalent to "Good morning")
- **Mwaboni** — General greeting, also used in the morning
- Response to Cakwela: **Nakwela bwino** — I slept well.

## The Cultural Significance of Morning Greetings

In Zambia, morning greetings follow a specific pattern that reveals deep cultural values:

1. **Acknowledge presence first:** The initial greeting (Mwabombeni/Mwaboni) acknowledges that the person is alive and present — a meaningful recognition in cultures where survival through the night was historically uncertain.

2. **Inquire about well-being:** The follow-up question about sleep shows genuine concern for the person's welfare, not just a casual "morning."

3. **Respond positively:** Even if you had a terrible night, the cultural expectation is to respond positively ("I slept well"). Sharing negative experiences is reserved for more private conversations, not the initial public greeting.

4. **Hierarchy matters:** Always greet the most senior or oldest person first. The order of greeting reflects social hierarchy and respect.

This structured greeting system reflects the Zambian philosophy of Ubuntu — "I am because we are." Greetings are not just words; they are a daily reaffirmation of community bonds and mutual care.

Want me to teach you more everyday phrases, or explore another topic?`;
    }
    return `# Zambian Language Translation Guide

I can help with translations between English, Bemba, Nyanja, and Tonga! Zambia is a multilingual country with over 70 languages, but these four are the most widely used. Learning translations helps you connect with different communities and shows respect for Zambian cultural diversity.

## How to Request Translations

Just tell me what phrase you'd like translated and to which language. For example:
- "Translate 'How are you?' to Bemba"
- "What is 'Goodbye' in Nyanja?"
- "How do you say 'I love you' in Tonga?"

## Quick Reference: Common Phrases

Here's a mini-dictionary of frequently needed translations:

### Greetings
| English | Bemba | Nyanja | Tonga |
|---------|-------|--------|-------|
| Hello | Shani mwane | Mwabonani | Mwaboni |
| How are you? | Uli shani? | Muli bwanji? | Muli shani? |
| Good morning | Mwabombeni | Mwabombeni | Cakwela |
| Goodbye | Shani shani | Tsalani bwino | Mwaboni |

### Expressions
| English | Bemba | Nyanja | Tonga |
|---------|-------|--------|-------|
| Thank you | Natotela | Zikomo | Katwesi |
| Please | Napapata | Chonde | - |
| Yes | Ee | Ee | Ee |
| No | Awe | Awe | Awe |
| I don't understand | Namanyishibe | Sindikumvela | - |

### Common Words
| English | Bemba | Nyanja | Tonga |
|---------|-------|--------|-------|
| Water | Amana | Madzi | Amana |
| Food | Ifyakudya | Chakudya | - |
| School | Isukulu | Sukulu | Sukulu |
| Book | Ibufi | Mabuku | - |
| Teacher | Umupasha | Mphunzitsi | Mupasha |

## Language Distribution in Zambia

Understanding where each language is dominant helps you know which translations are most useful:

- **Bemba:** Predominantly spoken in Northern, Luapula, Copperbelt, and parts of Lusaka Province. Roughly 30% of Zambians speak Bemba as a first or second language.

- **Nyanja (Chewa):** Predominantly spoken in Eastern Province and Lusaka. It is the most common language in the capital city, making it especially practical for urban life.

- **Tonga:** Predominantly spoken in Southern Province, around Livingstone, the Victoria Falls, and the Zambezi valley. Important for tourism and agriculture contexts.

- **Lozi:** Predominantly spoken in Western Province (Barotseland). Important if you work or travel to Mongu and surrounding areas.

## Tips for Learning Zambian Languages

1. **Start with greetings:** Zambians appreciate anyone who makes the effort to greet them in their language. Learning just "Shani mwane" (Bemba hello) or "Mwabonani" (Nyanja hello) immediately earns respect.

2. **Learn the tones:** Bemba and Tonga are tonal languages — the same word pronounced with different pitch patterns can have different meanings. Pay attention to how native speakers pronounce words.

3. **Practice with locals:** The best way to learn is through conversation. Zambians are generally patient and encouraging when you try to speak their language.

4. **Use context:** Many Zambian words have multiple meanings depending on context. Learn phrases rather than isolated words for more accurate communication.

What phrase would you like me to translate?`;
  }

  // ─── Quiz generation ────────────────────────────────────────────────
  if (lower.includes("quiz") || lower.includes("test") || lower.includes("exam") || lower.includes("practice")) {
    // If there was a previous topic discussed, make the quiz about that topic
    if (previousUserMsg && extractTopic(previousUserMsg) !== "New Chat") {
      const quizTopic = extractTopic(previousUserMsg);
      return `# Practice Quiz: ${quizTopic}

Here's a comprehensive ECZ-style quiz on **${quizTopic}** — building on what we discussed! This quiz tests multiple levels of understanding: basic knowledge, application, analysis, and evaluation. Take your time with each question, and I'll provide detailed explanations for every answer when you're ready.

## Section A: Multiple Choice (Basic Knowledge)

These questions test your fundamental understanding of ${quizTopic}. Choose the best answer for each.

**Question 1:** Which of the following best defines ${quizTopic}?
a) A general concept with no specific meaning
b) A fundamental principle that can be explained, applied, and recognized in different contexts
c) Something that only appears in textbooks
d) A term that has only one correct definition

**Question 2:** How does ${quizTopic} relate to everyday life in Zambia?
a) It is only relevant in academic settings
b) It has no practical applications outside school
c) It appears in daily situations at home, school, market, and community
d) It is too abstract to be useful

**Question 3:** Which statement about ${quizTopic} is FALSE?
a) ${quizTopic} can be explained in multiple ways
b) ${quizTopic} connects to other related concepts
c) ${quizTopic} has only one correct interpretation
d) ${quizTopic} has practical applications

## Section B: Short Answer (Application)

These questions test whether you can apply your understanding of ${quizTopic} to new situations.

**Question 4:** Give two examples of ${quizTopic} from everyday Zambian life. For each example, explain why it demonstrates ${quizTopic}.

**Question 5:** A friend says they understand ${quizTopic} but cannot explain it to someone else. What does this suggest about their actual understanding? Explain your reasoning.

**Question 6:** How would you explain ${quizTopic} to a younger sibling who has never encountered it before? Write your explanation in simple, clear language.

## Section C: Analysis Questions

These questions require deeper thinking — comparing, contrasting, and making connections.

**Question 7:** Compare ${quizTopic} with a related concept. What are two similarities and two differences?

**Question 8:** How might understanding ${quizTopic} help you in a different subject area? Give a specific example of cross-subject application.

**Question 9:** What are the most common mistakes students make when learning ${quizTopic}? Identify at least three and explain why each mistake occurs.

## Section D: Essay Question (Evaluation)

**Question 10:** Write a well-structured paragraph (at least 150 words) explaining why ${quizTopic} is important in the Zambian educational context. Include:
- A clear definition
- At least two real-world examples from Zambia
- An explanation of how misunderstanding ${quizTopic} can lead to errors
- A connection to another topic in the curriculum

## How to Use This Quiz

1. **Attempt all questions** before checking answers — this tests your true understanding.
2. **Time yourself** — in ECZ exams, you have limited time per question. Try to complete Section A in 10 minutes, Section B in 15 minutes, Section C in 20 minutes, and Section D in 15 minutes.
3. **Review weak areas** — after completing the quiz, identify which questions were hardest and focus your revision on those topics.
4. **Ask for explanations** — I can provide detailed, step-by-step explanations for every question and answer.

When you're ready, just say "reveal answers" and I'll walk you through each question with full explanations and study tips! Want me to adjust the difficulty level or focus on a specific aspect of ${quizTopic}?`;
    }
    return `# Mathematics Practice Quiz (ECZ-Style)

Here's a comprehensive mathematics quiz covering key areas of the Zambian curriculum. This quiz tests arithmetic, algebra, geometry, and problem-solving — the core skills assessed in ECZ mathematics exams. Take your time, work through each problem methodically, and I'll provide detailed explanations when you're ready.

## Section A: Arithmetic (15 marks)

**Question 1:** What is 15% of 200?
a) 20  b) 30  c) 35  d) 25

**Question 2:** If a bag of maize costs K150 and you buy 3 bags, how much do you pay? If you give the shopkeeper K500, how much change do you receive?
a) K450, K50 change  b) K450, K50 change  c) K500, no change  d) K300, K200 change

**Question 3:** A farmer sells tomatoes at K5 per kg. If a customer buys 2.5 kg, how much does the customer pay?
a) K10  b) K12.50  c) K15  d) K7.50

**Question 4:** Simplify: 3/4 + 1/8
a) 4/8  b) 7/8  c) 1/2  d) 5/8

**Question 5:** What is the square root of 144?
a) 10  b) 11  c) 12  d) 14

## Section B: Algebra (15 marks)

**Question 6:** Simplify: 3x + 2x - x
a) 4x  b) 5x  c) 6x  d) 3x

**Question 7:** Solve for x: 2x + 6 = 14
a) x = 3  b) x = 4  c) x = 5  d) x = 8

**Question 8:** If y = 3x + 2, what is y when x = 5?
a) 15  b) 17  c) 13  d) 23

**Question 9:** Solve for x: 5x - 10 = 25
a) x = 3  b) x = 5  c) x = 7  d) x = 9

**Question 10:** Expand: 2(x + 3)
a) 2x + 3  b) 2x + 6  c) x + 6  d) 2x - 6

## Section C: Geometry (10 marks)

**Question 11:** If a rectangle has length 8 cm and width 5 cm, what is its area?
a) 13 cm2  b) 40 cm2  c) 35 cm2  d) 45 cm2

**Question 12:** What is the perimeter of the same rectangle?
a) 13 cm  b) 26 cm  c) 40 cm  d) 20 cm

**Question 13:** A circle has a radius of 7 cm. What is its circumference? (Use pi = 22/7)
a) 44 cm  b) 22 cm  c) 154 cm  d) 88 cm

**Question 14:** What is the area of that same circle?
a) 44 cm2  b) 154 cm2  c) 22 cm2  d) 88 cm2

## Section D: Word Problems (10 marks)

**Question 15:** A bus travels from Lusaka to Ndola at an average speed of 80 km/h. The distance is approximately 320 km. How long does the journey take?
a) 3 hours  b) 4 hours  c) 5 hours  d) 6 hours

**Question 16:** A school has 480 students. If 60% are girls, how many boys are there?
a) 192  b) 288  c) 240  d) 320

## Tips for ECZ Math Exams

1. **Show your working:** ECZ marks are awarded for method, not just the final answer. Even if your answer is wrong, correct working can earn partial marks.

2. **Check your calculations:** After solving, plug your answer back into the original problem to verify it works.

3. **Manage your time:** Don't spend too long on one difficult question. Move on and come back to it later.

4. **Read questions carefully:** Many errors come from misreading the question — missing a decimal point, confusing "add" with "subtract," or overlooking a condition.

When you're ready, say "reveal answers" and I'll walk you through each question with step-by-step solutions and explanations!`;
  }

  // ─── Lesson summary ─────────────────────────────────────────────────
  if (lower.includes("summarize") || lower.includes("summary") || lower.includes("overview")) {
    // If referencing a previous topic, summarize that
    if (previousUserMsg && extractTopic(previousUserMsg) !== "New Chat") {
      const summaryTopic = extractTopic(previousUserMsg);
      return `# Summary: ${summaryTopic}

Here's a comprehensive summary of **${summaryTopic}** based on our discussion. This summary is designed for quick revision before exams — it covers the key points, common mistakes, and essential things to remember.

## Key Definition

**${summaryTopic}** is a fundamental concept that we explored in detail. The precise definition matters for ECZ exams — make sure you can state it clearly and completely, not just approximately. A vague definition loses marks even if you have the right general idea.

## Main Points to Remember

1. **The core principle:** ${summaryTopic} operates on a foundational principle that determines how it works in all contexts. Understanding this principle allows you to predict how ${summaryTopic} will behave even in unfamiliar situations.

2. **Real-world applications:** ${summaryTopic} appears in practical Zambian contexts — at school, in the market, in agriculture, in technology, and in daily life. Being able to give specific Zambian examples shows depth of understanding and earns marks in ECZ essays.

3. **Connections to other topics:** ${summaryTopic} does not exist in isolation. It connects to at least 3-4 other topics in the curriculum. Understanding these connections helps you answer cross-topic questions and see the bigger picture of how knowledge interrelates.

4. **Common mistakes to avoid:** Students frequently make predictable errors with ${summaryTopic}. Knowing these mistakes helps you avoid them:
   - Over-simplification: reducing ${summaryTopic} to a one-line definition
   - Confusing ${summaryTopic} with similar but distinct concepts
   - Failing to apply the concept in new situations
   - Memorizing without understanding the underlying logic

## Essential Examples

Have these examples ready for exam answers:

- **Textbook example:** The standard example from your course textbook
- **Zambian daily life example:** How ${summaryTopic} appears in everyday situations in Zambia
- **Cross-subject example:** How ${summaryTopic} connects to a different subject area
- **Counter-example:** An example that is NOT ${summaryTopic} — showing you understand the boundaries of the concept

## Quick Review Questions

Test yourself with these rapid-fire questions before your exam:

1. Can you define ${summaryTopic} in your own words, without looking at any notes?
2. Can you give three different examples of ${summaryTopic}, each from a different context?
3. How is ${summaryTopic} different from the most similar concept that students often confuse it with?
4. Why does ${summaryTopic} matter in real life? Give a specific Zambian application.
5. If you had to teach ${summaryTopic} to a Grade 5 student, how would you explain it?

## Study Strategy for Last-Minute Revision

If you're revising ${summaryTopic} just before an exam:

**5-minute review:** Read this summary, then close it and write the definition from memory. Check if you got it right.

**10-minute review:** Write 3 examples and explain why each one demonstrates ${summaryTopic}. If you struggle with examples, you need more practice.

**15-minute review:** Compare ${summaryTopic} with a related concept. Write two similarities and two differences. This tests deeper understanding.

**30-minute review:** Write a full practice essay answering an exam-style question about ${summaryTopic}. Include definition, examples, applications, and connections.

Want me to go deeper on any specific point, generate a practice quiz on ${summaryTopic}, or shall we move to a new topic?`;
    }
    return `# Lesson Summaries — Your Quick Revision Tool

I can create comprehensive summaries of any lesson or topic for you! Summaries are one of the most effective revision tools because they condense hours of learning into key points you can review quickly before exams.

## How to Request a Summary

Tell me:
1. **Which subject** — Math, Science, English, History, Geography, Civic Education, etc.
2. **Which specific topic** — Fractions, Photosynthesis, Poetry Analysis, Zambian History, Climate, etc.
3. **Your grade level** — this helps me adjust the depth, complexity, and terminology to match your ECZ curriculum requirements

## What My Summaries Include

Every summary I create follows a structured format designed for maximum exam preparation:

- **Key Definition:** The precise, exam-ready definition that would earn full marks in an ECZ paper
- **Main Points:** The essential content organized logically, not just listed randomly
- **Real-World Applications:** Examples from Zambian daily life that demonstrate practical understanding
- **Connections to Other Topics:** How this concept links to other areas of the curriculum
- **Common Mistakes:** The errors students typically make, so you can avoid them
- **Quick Review Questions:** Self-test questions to verify your understanding
- **Study Strategy:** A recommended revision plan with time allocation

## Example Summary: Photosynthesis

Here's an example of what a summary looks like:

**Key Definition:** Photosynthesis is the process by which green plants convert light energy, water, and carbon dioxide into glucose (food) and oxygen. It occurs in the chloroplasts of leaf cells, which contain the green pigment chlorophyll.

**Main Points:**
1. Raw materials: sunlight (captured by chlorophyll), water (absorbed by roots via xylem), CO2 (enters through stomata)
2. Products: glucose (plant's food, stored as starch) and oxygen (released through stomata)
3. Equation: 6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2
4. Two stages: light-dependent reactions (thylakoids) and light-independent reactions (Calvin cycle, stroma)
5. Limiting factors: light intensity, CO2 concentration, temperature, water availability

**Zambian Applications:** Crop yields depend on photosynthesis efficiency. During drought, water limits the process. During cloudy rainy season, light is limited. Irrigation helps maintain photosynthesis during dry periods.

**Common Mistakes:** Students often forget that oxygen is a byproduct, not the main product. They confuse respiration (which uses oxygen) with photosynthesis (which produces it). They also forget that photosynthesis occurs in two distinct stages.

What would you like me to summarize? Just tell me the subject and topic!`;
  }

  // ─── Math concepts ──────────────────────────────────────────────────
  if (lower.includes("math") || lower.includes("algebra") || lower.includes("fraction") || lower.includes("equation") || lower.includes("calculate") || lower.includes("number")) {
    if (lower.includes("fraction")) {
      return KNOWN_CONCEPTS.fraction || generateConceptExplanation("fraction");
    }
    if (lower.includes("equation") || lower.includes("algebra")) {
      return `# Algebra — Solving Equations Step by Step

## Introduction to Algebra

Algebra is the branch of mathematics that uses symbols (usually letters like x, y, z) to represent unknown quantities. Instead of working only with specific numbers, algebra allows us to express general relationships and solve problems where some values are unknown. This powerful tool is essential for the ECZ mathematics curriculum and appears in nearly every exam paper.

Algebra might seem intimidating at first, but it is simply a systematic way of finding unknown values by using the information you already have. Think of it like a puzzle — you have some clues (the known numbers and relationships), and you need to figure out the missing piece (the unknown variable).

## The Goal: Finding the Unknown

When you solve an equation, your goal is always the same: **find the value of the unknown variable (usually x).** An equation is like a balance scale — both sides must be equal. Your job is to manipulate the equation until you isolate x on one side, revealing its value.

## The Golden Rule of Algebra

**Whatever you do to one side of the equation, you must do the same to the other side.**

This is the fundamental principle that makes algebra work. If you subtract 6 from the left side, you must also subtract 6 from the right side. If you divide the right side by 2, you must also divide the left side by 2. This keeps the equation balanced — like a scale that must remain level at all times.

Think of it as sharing fairly: if two friends each have equal amounts of sweets, and you take 3 sweets from one friend, you must also take 3 from the other to keep them equal. This is exactly how algebra works!

## Step-by-Step Example: Solve 2x + 6 = 14

**Step 1: Identify what's on the same side as x**
We have 2x + 6 on the left side. The "+6" is attached to x, so we need to remove it.

**Step 2: Remove the constant term by subtracting**
Subtract 6 from both sides: 2x + 6 - 6 = 14 - 6
This simplifies to: 2x = 8
Now x is much closer to being isolated!

**Step 3: Remove the coefficient by dividing**
Divide both sides by 2: 2x / 2 = 8 / 2
This simplifies to: x = 4

**Answer: x = 4**

**Step 4: Check your answer (always do this!)**
Plug x = 4 back into the original equation: 2(4) + 6 = 8 + 6 = 14
The left side equals the right side, so our answer is correct!

## More Examples with Full Solutions

### Example 2: Solve 5x - 10 = 25
Step 1: Add 10 to both sides → 5x = 35
Step 2: Divide both sides by 5 → x = 7
Check: 5(7) - 10 = 35 - 10 = 25 (correct!)

### Example 3: Solve 3x + 12 = 0
Step 1: Subtract 12 from both sides → 3x = -12
Step 2: Divide both sides by 3 → x = -4
Check: 3(-4) + 12 = -12 + 12 = 0 (correct!)

### Example 4: Solve x/3 + 5 = 11
Step 1: Subtract 5 from both sides → x/3 = 6
Step 2: Multiply both sides by 3 → x = 18
Check: 18/3 + 5 = 6 + 5 = 11 (correct!)

## Common Mistakes to Avoid

1. **Forgetting to do the same operation on both sides:** If you only subtract 6 from the left side, the equation is no longer balanced, and your answer will be wrong.

2. **Doing operations in the wrong order:** Always deal with addition/subtraction first (to remove constants), then multiplication/division (to remove coefficients). Working in the wrong order creates unnecessary complications.

3. **Sign errors:** Pay close attention to positive and negative signs. -3x + 9 = 0 is different from 3x + 9 = 0, and many students lose marks by misreading signs.

4. **Not checking answers:** Always verify your solution by substituting it back into the original equation. A quick check can save you from an embarrassing error.

## Algebra in Zambian Real Life

Algebra is not just a classroom exercise — it solves real problems:

- **Budgeting:** If you earn K3,000 per month and spend K2,000 on rent and food, how much is left? That's 3000 - 2000 = x, so x = K1,000. Simple algebra helps manage money.

- **Pricing:** If 5 kg of maize costs K250, how much does 1 kg cost? 5x = 250, so x = K50 per kg. Algebra helps compare prices and find the best deals at the market.

- **Distance and speed:** If a bus travels at 80 km/h and you need to travel 320 km from Lusaka to Ndola, how long will it take? 80t = 320, so t = 4 hours. Algebra helps plan journeys.

- **Mobile money:** If you send K500 via mobile money and the fee is 2%, what is the total cost? Total = 500 + 0.02(500) = 500 + 10 = K510. Algebra helps calculate transaction costs.

Would you like more examples, a practice quiz, or shall we explore another topic?`;
    }
    return `# Mathematics — The Language of Patterns and Problem-Solving

## What Is Mathematics?

Mathematics is the study of numbers, patterns, structures, and relationships. It is often called the "universal language" because mathematical truths hold everywhere — in Zambia, in China, on Mars, and across the entire universe. Mathematics provides the tools we need to measure, calculate, predict, and solve problems in every area of human activity.

Far from being just abstract numbers on a page, mathematics is deeply practical. It underpins engineering, medicine, agriculture, economics, technology, and virtually every profession. Understanding mathematics gives you power over the world — the ability to quantify, compare, and make informed decisions rather than relying on guesswork.

## Key Branches of Mathematics

### Arithmetic — The Foundation
Arithmetic covers the basic operations: addition, subtraction, multiplication, and division. These are the building blocks of all mathematics. Without solid arithmetic skills, everything else becomes difficult.

In Zambia, arithmetic is used daily: calculating prices at the market, splitting nshima portions among family members, determining how many kilometers to the next town, and managing mobile money transactions.

### Algebra — Solving for the Unknown
Algebra introduces symbols (usually letters) to represent unknown quantities. It allows us to express relationships as equations and then solve those equations to find unknown values.

Example: If you know that 3 bags of maize cost K450, algebra lets you find the price of one bag: 3x = 450, so x = K150. This simple algebraic step is the basis of all pricing calculations.

### Geometry — Shapes, Angles, and Space
Geometry studies the properties of shapes (triangles, rectangles, circles), angles, areas, volumes, and spatial relationships. It is essential for construction, land measurement, art, and design.

In Zambia, geometry is used by farmers measuring field boundaries, builders constructing houses, and engineers designing roads and bridges. The Victoria Falls, Kariba Dam, and every building in Lusaka were designed using geometric principles.

### Statistics — Understanding Data
Statistics involves collecting, organizing, analyzing, and interpreting data. It helps us make sense of large amounts of information and draw meaningful conclusions.

In Zambia, statistics are used by the government to track economic indicators (GDP, inflation rate), by schools to analyze exam performance, by farmers to compare crop yields, and by businesses to understand customer behavior.

### Trigonometry — The Mathematics of Angles
Trigonometry studies the relationships between angles and sides of triangles. It is essential for surveying, navigation, and engineering.

## Mathematics in the Zambian Curriculum

In Zambia, mathematics is a core subject from primary school through secondary school, assessed by the Examinations Council of Zambia (ECZ). The curriculum builds progressively:

- **Primary (Grades 1-7):** Arithmetic, basic geometry, measurement, simple problem-solving
- **Junior Secondary (Grades 8-9):** Algebra, more complex geometry, statistics introduction, coordinate geometry
- **Senior Secondary (Grades 10-12):** Advanced algebra, trigonometry, calculus introduction, probability, advanced statistics

Success in mathematics at each level depends on mastery of the previous level. If your arithmetic is weak, your algebra will struggle. If your algebra is weak, your trigonometry and calculus will be nearly impossible. This is why building a strong foundation early is crucial.

## Mathematics in Zambian Daily Life

Mathematics appears constantly in everyday Zambian contexts:

- **At the market:** Calculating total cost, comparing prices per unit, determining discounts, and verifying that the shopkeeper's total is correct
- **In agriculture:** Measuring field sizes, calculating seed quantities, estimating harvest yields, and determining fertilizer amounts per hectare
- **In mobile money:** Calculating transaction fees, managing balances, and verifying transaction amounts
- **In transportation:** Estimating travel times based on distance and speed, calculating fuel costs for long journeys, and comparing bus prices
- **In school:** Calculating average grades, determining class rankings, and managing timetables
- **At home:** Sharing food portions equally, measuring ingredients for cooking, and managing household budgets

## Tips for Improving Math Skills

1. **Practice daily:** Mathematics is a skill, not just knowledge. Like playing football or learning a language, regular practice builds fluency and confidence. Even 15-20 minutes of daily practice makes a significant difference.

2. **Understand, don't memorize:** Memorizing formulas without understanding why they work leads to fragile knowledge. When you understand the reasoning behind a formula, you can reconstruct it even if you forget the exact wording.

3. **Show your working:** In ECZ exams, marks are awarded for correct method, not just the final answer. Always write out each step clearly so the examiner can award partial marks even if your final answer has an error.

4. **Check your answers:** After solving a problem, substitute your answer back into the original question to verify it works. This simple check catches many calculation errors.

5. **Learn from mistakes:** When you get a problem wrong, don't just move on. Analyze exactly where you went wrong and why. Understanding your mistakes prevents you from repeating them.

What specific math topic would you like me to explain in detail? I can cover arithmetic, fractions, algebra, geometry, statistics, trigonometry, and more — all with Zambian examples!`;
  }

  // ─── Science concepts ───────────────────────────────────────────────
  if (lower.includes("science") || lower.includes("physics") || lower.includes("chemistry") || lower.includes("biology") || lower.includes("photosynthesis") || lower.includes("cell") || lower.includes("force") || lower.includes("energy")) {
    if (lower.includes("photosynthesis")) {
      return KNOWN_CONCEPTS.photosynthesis || generateConceptExplanation("photosynthesis");
    }
    if (lower.includes("force") || lower.includes("energy")) {
      return `# Force and Energy — The Physics of Motion and Power

## What Is Force?

A **force** is a push or a pull. Every interaction between objects involves forces — when you kick a ball, open a door, lift a bag of maize, or even sit on a chair, forces are at work. Forces can change an object's speed, direction, or shape. Without forces, nothing would ever move, stop, or change.

Force is measured in **Newtons (N)**, named after Sir Isaac Newton, who formulated the fundamental laws of motion. One Newton is roughly the force needed to lift a small apple. In Zambia, understanding forces helps explain everything from how a minibus accelerates on the Great East Road to how Kariba Dam holds back millions of tons of water.

### Types of Forces

**Gravitational Force (Gravity):** The force that pulls all objects toward each other. On Earth, gravity pulls everything downward toward the center of the planet. This is why a ball falls when you drop it, why water flows down from the Zambezi River to create Victoria Falls, and why you stay on the ground instead of floating into the sky. The strength of gravitational force depends on mass — heavier objects experience stronger gravitational pull.

**Friction:** The force that opposes motion when two surfaces rub against each other. Friction can be helpful (it allows you to walk without slipping, and it allows car brakes to work) or harmful (it causes wear and tear on machinery and reduces efficiency). In Zambia, friction is what makes the dusty Copperbelt roads slippery when wet — the water reduces friction between tires and the road surface.

**Normal Force:** The supporting force exerted by a surface on an object resting on it. When a bag of maize sits on a table, the table exerts an upward normal force that prevents the bag from falling through. This force exactly balances gravity for stationary objects.

**Tension:** The pulling force transmitted through a rope, string, or cable. When you pull a cart with a rope, tension is the force in the rope. At Kariba Dam, enormous tension forces exist in the cables and structures holding the dam together.

**Applied Force:** A force that you directly apply to an object — pushing a door, pulling a cart, or kicking a football. This is the most familiar type of force.

## What Is Energy?

**Energy** is the ability to do work or cause change. It is the driving force behind every physical process in the universe. Without energy, nothing moves, nothing grows, nothing happens. Energy cannot be created or destroyed — it can only be transformed from one type to another (this is the Law of Conservation of Energy, one of the most fundamental principles in physics).

Energy is measured in **Joules (J)**. One Joule is a small amount — lifting a 1 kg object by 1 meter requires about 10 Joules. Larger quantities are measured in kilojoules (kJ = 1,000 J) or megajoules (MJ = 1,000,000 J).

### Types of Energy

**Kinetic Energy:** The energy of motion. Any moving object has kinetic energy — a running athlete, a moving bus, flowing water in the Zambezi River, or a falling stone. The faster and heavier an object, the more kinetic energy it has. Formula: KE = 1/2 mv2 (kinetic energy equals half the mass times velocity squared).

**Potential Energy:** Stored energy that has the potential to be released. The most common form is gravitational potential energy — the energy stored in an object because of its height. Water behind Kariba Dam has enormous gravitational potential energy. When it flows through the turbines, this potential energy converts to kinetic energy and then to electrical energy. Formula: PE = mgh (potential energy equals mass times gravitational acceleration times height).

**Thermal (Heat) Energy:** The energy of heat. Every object contains thermal energy in the vibrations of its atoms and molecules. Hot objects have more thermal energy than cold ones. In Zambia, thermal energy is generated when you cook nshima on a charcoal stove, when the sun heats the ground during the dry season, and when ZESCO power stations burn fuel to generate electricity.

**Electrical Energy:** The energy carried by moving electric charges (electricity). This is the form of energy that powers lights, phones, computers, and factories throughout Zambia. ZESCO converts other forms of energy (hydroelectric from falling water at Kariba Dam, thermal from burning coal at Maamba) into electrical energy that reaches homes and businesses through the national grid.

**Chemical Energy:** Energy stored in the bonds between atoms in molecules. When chemical bonds are broken or formed during reactions, energy is released or absorbed. Food contains chemical energy — when you eat nshima, your body breaks down the starch molecules and releases the chemical energy stored in them. Petroleum fuels also contain chemical energy, which is released when they burn in engines.

**Sound Energy:** Energy carried by sound waves — vibrations that travel through air, water, or solid materials. When you speak, play music, or hear thunder over Lusaka during the rainy season, sound energy is being transmitted.

**Light (Radiant) Energy:** Energy carried by electromagnetic waves, including visible light, ultraviolet, infrared, and radio waves. The sun is Zambia's primary source of light energy, which drives photosynthesis in plants and warms the Earth.

## Newton's Three Laws of Motion

Sir Isaac Newton formulated three fundamental laws that describe how objects move when forces act on them:

### First Law (Law of Inertia)
"An object at rest stays at rest, and an object in motion stays in motion at the same speed and direction, unless acted upon by an external force."

This means objects do not change their state on their own — a stationary bus will not suddenly start moving without a force (the engine), and a rolling ball will not stop unless friction or another force acts on it. Inertia is the resistance to change in motion. Heavier objects have more inertia — it is harder to push a truck than a bicycle.

### Second Law (Force = Mass x Acceleration)
"The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass."

Formula: F = ma (Force equals mass times acceleration)

This explains why a small force can accelerate a light object quickly (kicking a football makes it fly fast) but the same force barely moves a heavy object (pushing a minibus produces almost no acceleration). In Zambia, this law explains why overloaded minibuses accelerate slowly — more mass means less acceleration for the same engine force.

### Third Law (Action and Reaction)
"For every action, there is an equal and opposite reaction."

When you push against a wall, the wall pushes back on you with equal force. When a rocket pushes gas downward, the gas pushes the rocket upward. When you walk, your foot pushes the ground backward, and the ground pushes your foot forward, propelling you ahead. At Victoria Falls, water pushes down against the rocks, and the rocks push back up against the water, creating the spectacular spray.

## Energy Transformations in Zambia

Understanding how energy transforms between forms is central to physics and has practical Zambian applications:

- **Kariba Dam (hydroelectric):** Potential energy (water at height) → Kinetic energy (water falling through turbines) → Electrical energy (generated by spinning turbines) → Light/thermal energy (in homes and factories)
- **Charcoal stove:** Chemical energy (in charcoal) → Thermal energy (heat from burning) → Thermal energy (in cooked food)
- **Car engine:** Chemical energy (in petrol) → Thermal energy (from combustion) → Kinetic energy (moving pistons) → Kinetic energy (rotating wheels) → Kinetic energy (moving car)
- **Solar panel:** Light energy (sunlight) → Electrical energy (current from panel) → Light energy (from LED bulbs) or Thermal energy (from electric heater)
- **Human body:** Chemical energy (from food like nshima) → Kinetic energy (walking, running) + Thermal energy (body heat) + Sound energy (speaking)

Which topic would you like more details on? I can provide more examples, practice problems, or exam-style questions on forces, energy, or Newton's laws!`;
    }
    return `# Science — Understanding the Natural World

## What Is Science?

Science is a systematic method of understanding the natural world through observation, experimentation, and logical reasoning. It is not just a collection of facts — it is a way of thinking that demands evidence, tests hypotheses, and builds knowledge progressively. Science teaches us to question assumptions, test ideas, and accept conclusions based on evidence rather than tradition or authority.

The scientific method follows a structured process: observe something, ask a question, form a hypothesis (a testable prediction), conduct an experiment, analyze the results, and draw conclusions. This method has produced virtually all the knowledge we rely on today — from medicine that saves lives to technology that connects people across continents.

## Key Branchs of Science

### Biology — The Study of Living Things
Biology explores how living organisms work, interact, and evolve. It covers everything from microscopic cells to entire ecosystems.

Key topics in the ECZ curriculum:
- **Cell structure and function:** Cells are the basic units of life. Understanding how cells work (membrane, nucleus, cytoplasm, organelles) is fundamental to understanding biology.
- **Photosynthesis:** How plants convert sunlight, water, and CO2 into food and oxygen — the foundation of all food chains.
- **Human body systems:** Digestive, respiratory, circulatory, nervous, and reproductive systems — how your body works as an integrated machine.
- **Ecology:** How organisms interact with their environment — food chains, food webs, ecosystems, biodiversity, and environmental conservation.
- **Genetics and evolution:** How traits are inherited and how species change over time through natural selection.

In Zambia, biology is essential for understanding agriculture (how crops grow and what affects yields), health (how diseases spread and how the immune system fights them), and environmental conservation (protecting Zambia's wildlife and forests).

### Chemistry — The Study of Matter and Reactions
Chemistry examines what substances are made of, how they interact, and how they transform through chemical reactions.

Key topics in the ECZ curriculum:
- **Atoms and elements:** The building blocks of all matter. Every substance is made of atoms, and elements are pure substances containing only one type of atom.
- **Compounds and mixtures:** How atoms combine to form compounds (like water, H2O) and how different substances can be mixed (like the air around us).
- **Chemical reactions:** How substances transform into new substances — burning, rusting, dissolving, and reacting.
- **Acids, bases, and pH:** Understanding the properties of acidic and basic substances and how to measure their strength.
- **Periodic table:** Organizing all known elements by their properties, enabling predictions about how elements behave.

In Zambia, chemistry is relevant to mining (extracting copper from ore), agriculture (soil pH and fertilizer chemistry), cooking (chemical changes in food preparation), and health (how medicines work at the molecular level).

### Physics — The Study of Forces, Energy, and Motion
Physics explores the fundamental laws that govern the physical universe — how objects move, how energy transforms, and how forces interact.

Key topics in the ECZ curriculum:
- **Force and motion:** Newton's laws, gravity, friction, and how forces change motion.
- **Energy:** Different types of energy (kinetic, potential, thermal, electrical, chemical) and how energy transforms.
- **Electricity and magnetism:** How electric circuits work, how magnets interact, and how electricity is generated and distributed.
- **Waves and sound:** How waves carry energy, how sound travels, and how light behaves.
- **Heat and temperature:** The difference between heat (energy transfer) and temperature (measurement), and how heat moves between objects.

In Zambia, physics explains how Kariba Dam generates electricity, how minibuses accelerate and brake, how mobile phones transmit signals, and how the Victoria Falls produces its spectacular spray.

## Science in the Zambian Curriculum

In Zambia, science is taught from Grade 5 onwards, becoming increasingly specialized through secondary school. The ECZ curriculum emphasizes practical applications and Zambian contexts, ensuring students understand how science connects to their daily lives rather than just memorizing abstract theories.

The curriculum is designed to develop three key skills:
1. **Scientific knowledge:** Understanding key concepts, theories, and facts
2. **Scientific skills:** Conducting experiments, measuring accurately, and interpreting data
3. **Scientific attitudes:** Curiosity, skepticism, respect for evidence, and willingness to revise understanding when new evidence emerges

What specific science topic would you like me to explain in depth? I can provide comprehensive explanations of cells, photosynthesis, forces, energy, chemical reactions, electricity, human body systems, ecology, genetics, and more — all with Zambian examples and ECZ exam tips!`;
  }

  // ─── English / language ─────────────────────────────────────────────
  if (lower.includes("english") || lower.includes("grammar") || lower.includes("essay") || lower.includes("writing") || lower.includes("poem") || lower.includes("literature")) {
    return `# English Language and Literature — A Comprehensive Guide

## Overview

English is one of Zambia's official languages and the primary medium of instruction in schools. Mastering English is essential for academic success across ALL subjects, for professional communication, and for accessing global knowledge. The ECZ English curriculum covers both language (grammar, comprehension, writing) and literature (poetry, drama, novels).

## Grammar — The Structure of English

Grammar provides the rules that make communication clear and accurate. Without grammar, sentences become confusing or meaningless. Key areas for ECZ exams:

### Parts of Speech
Understanding the eight parts of speech is foundational:
- **Nouns:** naming words (teacher, Lusaka, freedom)
- **Verbs:** action or state words (run, is, will study)
- **Adjectives:** describing words (tall, beautiful, Zambian)
- **Adverbs:** words that describe verbs (quickly, carefully, always)
- **Pronouns:** words that replace nouns (she, they, this)
- **Prepositions:** words showing relationships (in, on, under, between)
- **Conjunctions:** joining words (and, but, because, although)
- **Interjections:** emotional words (Wow! Oh! Hey!)

### Sentence Structure
- **Simple sentence:** One independent clause. "The student studied."
- **Compound sentence:** Two independent clauses joined by a conjunction. "The student studied, and the teacher taught."
- **Complex sentence:** One independent clause + one dependent clause. "The student studied because the exam was tomorrow."
- **Compound-complex:** Multiple independent and dependent clauses.

### Tenses
The twelve English tenses organize when actions happen. The most commonly tested:
- Present Simple: habits and facts — "She studies every day."
- Past Simple: completed actions — "She studied yesterday."
- Future Simple: planned actions — "She will study tomorrow."
- Present Perfect: completed actions with present relevance — "She has studied all chapters."
- Past Perfect: actions completed before another past action — "She had studied before the exam started."

### Common Grammar Errors in ECZ Exams
1. Subject-verb disagreement: "The students reads" (wrong) → "The students read" (correct)
2. Wrong tense: "She is study" (wrong) → "She is studying" (correct)
3. Misplaced modifiers: "She almost ate all the food" (ambiguous) vs. "She ate almost all the food" (clear)
4. Confusing homophones: their/there/they're, its/it's, affect/effect

## Essay Writing — Expressing Ideas Clearly

### The Structure of a Good Essay

**Introduction (1 paragraph):** State your topic, provide background context, and present your thesis (main argument or point). A strong introduction hooks the reader and makes them want to continue.

**Body (3-5 paragraphs):** Each paragraph develops ONE main point that supports your thesis. Start with a topic sentence, provide evidence and examples, and conclude the paragraph by linking back to the thesis. Use Zambian examples wherever relevant — this shows cultural awareness and makes your writing authentic.

**Conclusion (1 paragraph):** Summarize your main arguments without repeating them word-for-word. End with a thoughtful closing statement that leaves the reader thinking. Never introduce new arguments in the conclusion.

### Essay Writing Tips for ECZ Exams

1. **Plan before writing:** Spend 5-10 minutes brainstorming and organizing your ideas. A planned essay is always clearer and more coherent than an unplanned one.

2. **Use specific examples:** Instead of "education is important," write "education helped Fredrick Chiluba become Zambia's second president, and it continues to transform lives in communities like those in rural Luapula Province." Specific examples earn more marks than general statements.

3. **Vary your sentence structures:** Mix simple, compound, and complex sentences. A essay with only simple sentences sounds childish; one with only complex sentences becomes hard to follow.

4. **Proofread:** After writing, read through your essay checking for spelling, grammar, and logical flow. Even a 2-minute review catches significant errors.

5. **Manage your time:** Allocate time for planning, writing, and reviewing. In a 45-minute exam: 5 minutes planning, 30 minutes writing, 10 minutes reviewing.

## Literature — Understanding Poetry, Drama, and Novels

### Poetry Analysis
When analyzing a poem for ECZ exams, address these elements:
- **Theme:** What is the poem about? What message does the poet convey?
- **Form:** How is the poem structured? Stanzas, rhyme scheme, meter, line length.
- **Language:** What literary devices are used? Similes, metaphors, personification, alliteration, imagery.
- **Tone:** What attitude does the poet express? Joyful, mournful, angry, reflective, satirical.
- **Context:** When and where was the poem written? What cultural or historical background is relevant?

### Drama Analysis
Drama (plays) requires understanding:
- **Plot:** The sequence of events — conflict, climax, resolution.
- **Characterization:** How characters are developed through dialogue, actions, and relationships.
- **Setting:** Where and when the action occurs and how it influences the story.
- **Themes:** The underlying ideas the playwright explores.
- **Stagecraft:** How the play would be performed — set design, lighting, sound, blocking.

### Novel Analysis
Novels require deeper analysis because of their length and complexity:
- **Narrative structure:** How the story is organized — linear, flashback, parallel narratives.
- **Point of view:** Who tells the story — first person, third person limited, third person omniscient.
- **Character development:** How characters change throughout the story.
- **Symbolism:** Objects, events, or characters that represent larger ideas.
- **Social context:** The historical and cultural setting that shapes the story.

## Comprehension — Reading with Understanding

Comprehension is tested in every ECZ English paper. To improve:

1. **Read actively:** Don't just skim — engage with the text. Ask questions, make predictions, and connect ideas.
2. **Identify main ideas:** Every passage has a central message. Find it first, then understand how supporting details build it.
3. **Understand vocabulary in context:** When you encounter an unfamiliar word, use surrounding sentences to infer its meaning rather than panicking.
4. **Infer meaning:** Many comprehension questions ask you to read between the lines — understanding what is implied, not just what is stated.
5. **Practice with diverse texts:** Read news articles, stories, essays, and scientific writing to build comprehension skills across genres.

What specific English topic would you like me to help with? I can provide detailed grammar lessons, essay writing strategies, poetry analysis walkthroughs, or comprehension practice!`;
  }

  // ─── Concept explanation ────────────────────────────────────────────
  if (lower.includes("explain") || lower.includes("what is") || lower.includes("define") || lower.includes("meaning") || lower.includes("what are")) {
    const topic = extractTopic(lastUserMsg);
    return generateConceptExplanation(topic);
  }

  // ─── Greeting / general ─────────────────────────────────────────────
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("greet")) {
    return `# Welcome to Zedskillz AI Tutor!

Hello and welcome! I'm your Zedskillz AI Tutor, and I'm here to be your personal learning companion. Whether you're preparing for ECZ exams, struggling with homework, or just curious about a topic, I can provide detailed, comprehensive explanations that go far beyond simple definitions.

## What I Can Do for You

### Concept Explanation
I don't just give short definitions — I provide full, in-depth explanations with:
- Clear definitions written in accessible language
- Multiple examples from Zambian daily life
- Connections to related concepts across subjects
- Common mistakes and misconceptions to avoid
- Practice questions to test your understanding
- Study strategies tailored to ECZ exam preparation

### Quiz Generation
I create ECZ-style practice quizzes with:
- Multiple-choice questions (Section A style)
- Short-answer application questions (Section B style)
- Analysis questions requiring deeper thinking (Section C style)
- Essay questions with structured guidance (Section D style)
- Detailed explanations for every answer

### Language Translation
I provide comprehensive translations between English, Bemba, Nyanja, and Tonga, including:
- Not just single-word translations, but cultural context and usage notes
- Variations for different levels of formality and respect
- Language learning tips and pronunciation guidance
- Understanding of Zambian cultural practices related to communication

### Lesson Summaries
I create structured revision summaries that include:
- Key definitions in exam-ready format
- Main points organized logically
- Real-world applications from Zambia
- Quick review questions for self-testing
- Study strategies with day-by-day revision plans

### Homework Help
I walk you through problems step by step, explaining:
- The reasoning behind each step (not just the answer)
- How to approach similar problems in the future
- Common pitfalls to watch for
- How to verify your answers

## How to Get the Best Responses

To receive the most detailed and helpful answers:
1. **Be specific:** "Explain photosynthesis in detail for Grade 10 Biology" is better than "what is photosynthesis"
2. **Tell me your grade:** This lets me adjust depth and terminology to your level
3. **Ask for what you need:** Quiz, explanation, summary, translation, or problem-solving
4. **Follow up:** After my first response, ask deeper questions to explore the topic more thoroughly

What would you like help with today?`;
  }

  // ─── Help / capabilities ────────────────────────────────────────────
  if (lower.includes("help") || lower.includes("can you") || lower.includes("what can") || lower.includes("assist")) {
    return `# Zedskillz AI Tutor — Full Capabilities Guide

Here's a comprehensive guide to everything I can help you with as your Zedskillz AI Tutor. I am designed to provide thorough, detailed responses — not brief one-liners. Every answer I give includes context, examples, explanations, and practical applications.

## Study Help — Deep Concept Explanations

I explain any concept in simple terms with extensive detail, including:
- **Precise definitions** that earn full marks in ECZ exams
- **Multiple examples** from Zambian daily life (markets, agriculture, ECZ exams, mobile money, local traditions)
- **Connections to other topics** so you see how concepts interrelate across subjects
- **Common mistakes and misconceptions** that students frequently make, so you can avoid them
- **Practice questions** at different difficulty levels to test your understanding
- **Study strategies** with step-by-step revision plans

Try questions like:
- "Explain photosynthesis in detail for Grade 10 Biology"
- "What is a metaphor? Give examples from Zambian literature"
- "Explain algebraic equations with step-by-step solutions"
- "What are the types of nouns? Give Zambian examples"

## Quiz Generation — ECZ-Style Practice Tests

I generate comprehensive quizzes that mirror the ECZ exam format:
- **Section A:** Multiple-choice questions testing basic knowledge
- **Section B:** Short-answer questions testing application
- **Section C:** Analysis questions requiring deeper thinking
- **Section D:** Essay questions testing evaluation and synthesis
- **Full answer explanations** with step-by-step walkthroughs

Try questions like:
- "Generate a quiz on fractions for Grade 8"
- "Give me a practice test on English grammar"
- "Create an ECZ-style quiz on photosynthesis"
- "Quiz me on verbs and tenses"

## Zambian Language Translations

I translate between English, Bemba, Nyanja, and Tonga with cultural context:
- **Detailed translations** with usage notes, not just word-for-word
- **Formality variations** showing how to address elders, peers, and younger people
- **Cultural context** explaining the social significance of phrases
- **Language learning tips** for pronunciation and common patterns
- **Quick-reference tables** for frequently needed words and phrases

Try questions like:
- "Translate greetings to Bemba, Nyanja, and Tonga"
- "How do you say 'thank you' in Zambian languages?"
- "What are common phrases in Nyanja for daily use?"

## Academic Support — Essay Writing and Exam Preparation

I help with:
- **Essay structure:** How to plan, organize, and write essays that earn top marks
- **Writing techniques:** Using literary devices, varied sentence structures, and specific examples
- **Exam strategies:** Time management, question analysis, and answer optimization
- **Subject-specific tips:** Tailored advice for English, Math, Science, and other ECZ subjects

## Lesson Summaries — Quick Revision Tools

I create structured summaries with:
- **Key definitions** in exam-ready format
- **Main points** organized logically for easy memorization
- **Quick review questions** for self-testing
- **Day-by-day revision plans** for structured preparation

Try questions like:
- "Summarize photosynthesis for my Biology exam"
- "Give me a quick review of algebraic equations"
- "Create a revision summary of English grammar"

## Homework Help — Step-by-Step Problem Solving

I walk through problems with detailed explanations:
- **Full reasoning** behind each step, not just the final answer
- **Multiple methods** where applicable, showing different approaches
- **Verification techniques** so you can check your own work
- **Transferable skills** that help with similar future problems

Try questions like:
- "Walk me through solving 3x + 7 = 22 step by step"
- "How do I calculate the area of a circle with radius 5?"
- "Help me analyze this poem's literary devices"

## How to Get the Best Results

1. **Be specific about your topic and grade level** — this lets me tailor depth and complexity
2. **Request the format you need** — explanation, quiz, summary, translation, or problem-solving
3. **Follow up with deeper questions** — my initial answer is a starting point; ask for more detail on any aspect
4. **Use Zambian contexts** — I automatically include Zambian examples, but you can request specific provinces, cities, or cultural contexts

Just type any question and I'll provide a comprehensive, detailed answer! Try questions like:
- "Explain photosynthesis in full detail"
- "Generate a math quiz for Grade 9 ECZ preparation"
- "Translate 'thank you' to all three Zambian languages"
- "Summarize the key grammar rules for ECZ English"`;
  }

  // ─── Default contextual response ────────────────────────────────────
  // If we have a previous topic, try to connect the new question to it
  if (lastAiMsg.length > 20 && previousUserMsg) {
    const prevTopic = extractTopic(previousUserMsg);
    if (prevTopic && prevTopic !== "New Chat" && prevTopic.length > 2) {
      return `# Exploring Your Question in Context

That's a great question! It sounds like it might connect to what we discussed about **${prevTopic}**. Let me address your question thoroughly and explore how it relates to our previous topic.

## Your Question: "${lastUserMsg.trim()}"

Let me break this down and provide a comprehensive exploration:

### Understanding Your Question
Every good answer starts with understanding exactly what is being asked. Your question touches on an area that may connect to **${prevTopic}** — the concept we previously explored. Understanding this connection helps us see the bigger picture and how different ideas interrelate in your curriculum.

### Possible Connections to ${prevTopic}
There are several ways your current question might connect to what we discussed:

1. **Direct connection:** If your question is about a sub-topic, extension, or application of ${prevTopic}, I can explain how the two ideas work together and reinforce each other. Understanding both gives you a more complete picture.

2. **Complementary connection:** If your question involves a concept that works alongside ${prevTopic}, understanding both concepts helps you see how they combine in practical situations. For example, understanding both fractions and percentages helps you solve real-world math problems more effectively.

3. **Contrasting connection:** If your question involves a concept that contrasts with ${prevTopic}, comparing the two deepens your understanding of both. Knowing how things are different is as important as knowing how they are similar.

### How I Can Help
To give you the most thorough and helpful explanation possible, please let me know:

1. **If this relates to ${prevTopic}** — I can explain the connection, show how they work together, and provide examples of both concepts operating simultaneously in Zambian contexts.

2. **If this is a new topic** — I can provide a full, detailed explanation with definitions, examples, common mistakes, practice questions, and Zambian applications.

3. **If this is a problem** — I can walk you through it step by step, explaining the reasoning at each stage and showing you how to verify your answer.

4. **If this is about homework** — I can guide you through the process without just giving the answer, helping you develop the skills to solve similar problems independently.

### What I Need From You
To give you the best explanation, it helps to know:
- Which subject this relates to (English, Math, Science, etc.)
- Your grade level (so I can adjust depth and terminology)
- What kind of help you want (explanation, quiz, problem-solving, summary)

Or just rephrase your question with more detail and I'll dive right in with a comprehensive answer!`;
    }
  }

  const questionWords = lastMsg.trim();
  return `# Let Me Help You with That!

I'd love to help you with: "${questionWords}" Let me think about this and provide a comprehensive response that goes beyond a simple answer.

## Understanding Your Question

Every question has depth that a brief answer cannot capture. To truly understand a concept, you need:
- A clear, precise definition (not just a vague approximation)
- Multiple examples from different contexts (especially Zambian daily life)
- Connections to related topics (showing how knowledge interrelates)
- Common misconceptions to avoid (so you don't repeat typical errors)
- Practice opportunities (to test and solidify your understanding)

## What I Can Offer

### 1. If This Is a Concept Question
I can provide a comprehensive explanation including:
- A precise definition that would earn full marks in ECZ exams
- 5+ examples from Zambian contexts (market, school, home, community)
- Connections to 3-4 related topics across your curriculum
- Common mistakes students make and how to avoid them
- Practice questions at different difficulty levels
- A recommended study strategy for mastering the concept

### 2. If This Is a Problem
I can walk you through it step by step, including:
- Full reasoning behind each step (not just "do this, then this")
- Why each step is necessary and what it accomplishes
- How to verify your answer independently
- How to adapt the method for similar problems
- Common pitfalls at each step and how to avoid them

### 3. If This Is About Homework
I can guide you through the process:
- Help you understand the question (what it's really asking)
- Show you the approach and method (not just the answer)
- Help you develop transferable skills for similar problems
- Provide verification techniques so you can check your own work
- Suggest related practice for reinforcement

### 4. If This Is a General Query
I can provide a thorough overview including:
- Background context and history of the topic
- Current relevance in Zambia and globally
- Key principles and how they work
- Practical applications in Zambian daily life
- Future developments and why the topic matters going forward

## How to Get the Most Detailed Response

To help me give you the best possible answer:

1. **Tell me the subject:** Is this about Math, Science, English, History, or another area? Knowing the subject helps me tailor examples, terminology, and depth.

2. **Tell me your grade:** Grade level determines the complexity of my explanation. A Grade 7 answer is different from a Grade 12 answer — both in depth and in the types of examples I include.

3. **Specify what you need:** Do you want an explanation, a quiz, a summary, a problem walkthrough, or something else? Different formats serve different learning purposes.

4. **Rephrase with detail:** If your question is brief, adding context helps me give a more targeted response. For example:
   - "What is [topic]?" → "Explain [topic] in detail for Grade 10 Science, with Zambian examples"
   - "Help with math" → "Walk me through solving algebraic equations step by step for Grade 9"
   - "Quiz" → "Generate an ECZ-style quiz on fractions for Grade 8"

5. **Follow up:** After my first answer, ask deeper questions about specific aspects. This allows us to explore the topic progressively, which is the most effective way to learn.

Go ahead and ask anything — I'm here to provide thorough, detailed answers that help you truly understand!`;
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
          generationConfig: {
            maxOutputTokens: 8192, // Allow up to ~3000 words of detailed response
            temperature: 0.7,      // Slightly creative but still focused
          },
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
