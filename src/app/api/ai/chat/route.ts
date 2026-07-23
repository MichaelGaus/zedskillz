import { NextRequest } from "next/server";
import { gemini, GEMINI_MODEL, SYSTEM_PROMPT } from "@/lib/gemini";

/**
 * Helper: send an SSE event in the stream.
 */
function sseEvent(data: string): string {
  return `data: ${data}\n\n`;
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

  // Concept explanation
  if (lower.includes("explain") || lower.includes("what is") || lower.includes("define") || lower.includes("meaning")) {
    return "I'd love to explain that concept! Could you tell me:\n\n1. The specific term you want explained\n2. The subject area (math, science, English, etc.)\n3. Your grade level - so I can match the explanation to your level\n\nFor example, I can explain concepts like:\n- \"What is an atom?\" (Chemistry)\n- \"What is democracy?\" (Social Studies)\n- \"What is a metaphor?\" (English Literature)\n\nJust ask and I'll break it down in simple terms with real examples!";
  }

  // Greeting / general
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("greet")) {
    return "Hello! Welcome to Zedskillz!\n\nI'm your AI Tutor and I'm here to help you learn. Here's what I can do:\n\n- Explain concepts in simple terms with Zambian examples\n- Generate quizzes for practice (ECZ-style)\n- Translate phrases to Bemba, Nyanja, or Tonga\n- Summarize lessons so you can review quickly\n- Help with homework - step by step\n\nWhat would you like help with today?";
  }

  // Help / capabilities
  if (lower.includes("help") || lower.includes("can you") || lower.includes("what can") || lower.includes("assist")) {
    return "Here's what I can help you with as your Zedskillz AI Tutor:\n\nStudy Help:\n- Explain any concept in simple terms\n- Walk through problems step by step\n- Create practice quizzes\n\nZambian Languages:\n- Translate to Bemba, Nyanja, Tonga\n- Learn everyday phrases\n\nAcademic Support:\n- Summarize lessons and topics\n- Help with essay writing\n- Prepare for ECZ exams\n\nJust Ask:\nType any question and I'll do my best to help. Try questions like:\n- \"Explain photosynthesis\"\n- \"Generate a math quiz\"\n- \"Translate 'thank you' to Bemba\"";
  }

  // Default contextual response
  return "Great question! Let me help you with that.\n\nBased on what you've asked, here's my approach:\n\n1. I'll try to break down the topic clearly\n2. Use examples that relate to everyday life in Zambia\n3. Give you practical steps to follow\n\nCould you give me a bit more detail? For example:\n- Which subject is this about?\n- Which grade level are you in?\n- Any specific part you're struggling with?\n\nThe more specific your question, the better I can help. I'm here to make learning easier for you!";
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
