import { NextRequest } from "next/server";
import { gemini, GEMINI_MODEL, SYSTEM_PROMPT } from "@/lib/gemini";

/**
 * Helper: send an SSE event in the stream.
 */
function sseEvent(data: string): string {
  return `data: ${data}\n\n`;
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

    // Check if Gemini is configured
    if (!gemini) {
      return new Response(
        sseEvent(
          JSON.stringify({
            content:
              "I'm not fully configured yet! The admin needs to add a `GEMINI_API_KEY` to the `.env` file. " +
              "You can get a free key at https://aistudio.google.com/apikey",
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

    // Convert messages to Gemini format
    const geminiHistory = messages
      .filter((m: { role: string }) => m.role !== "system")
      .map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

    // Start a chat session with system instruction
    const model = gemini.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    });

    const chat = model.startChat({
      history: geminiHistory.slice(0, -1), // All but the last message as history
    });

    // The last message is the current user prompt
    const lastMessage = messages[messages.length - 1];
    const userPrompt =
      lastMessage.role === "user"
        ? lastMessage.content
        : messages.filter((m: { role: string }) => m.role === "user").pop()?.content || "Hello";

    // Stream the response
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
                      "Sorry, I ran into a technical hiccup. Please try again.",
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
  } catch (error: unknown) {
    console.error("AI Chat API Error:", error);

    const errMsg =
      error instanceof Error ? error.message : "Unknown error";

    let message: string;
    if (errMsg.includes("429") || errMsg.includes("quota")) {
      message =
        "I'm a bit overwhelmed with requests right now! Please try again in a moment.";
    } else if (errMsg.includes("401") || errMsg.includes("API key")) {
      message =
        "My AI brain needs a fresh API key. Please let the admin know to update the `GEMINI_API_KEY` in `.env`.";
    } else {
      message =
        "Sorry, I ran into a technical hiccup. Could you please try asking your question again?";
    }

    return new Response(
      sseEvent(JSON.stringify({ content: message })) + sseEvent("[DONE]"),
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
