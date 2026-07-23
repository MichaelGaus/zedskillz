import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";
import { APIError } from "openai";

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
      return new Response(sseEvent(JSON.stringify({ error: "Messages array is required" })), {
        status: 400,
        headers: { "Content-Type": "text/event-stream" },
      });
    }

    for (const msg of messages) {
      if (!msg.role || typeof msg.content !== "string") {
        return new Response(
          sseEvent(JSON.stringify({ error: "Each message must have a 'role' and 'content' string" })),
          { status: 400, headers: { "Content-Type": "text/event-stream" } }
        );
      }
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY") {
      return new Response(
        sseEvent(
          JSON.stringify({
            content:
              "I'm not fully configured yet! The admin needs to set up an OpenAI API key in the `.env` file.",
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

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are ZedAI, an AI tutor for Zedskillz Hub — a Zambian educational platform. " +
            "You help students with their coursework, explain concepts in simple terms, and can " +
            "communicate in English, Bemba, Nyanja, and Tonga. Be encouraging, supportive, and " +
            "use local Zambian examples (e.g., agriculture, mobile money, ECZ exams) when relevant. " +
            "Keep responses concise but thorough. If asked about code, provide examples. " +
            "If asked to translate, provide the translation and the original.",
        },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: true,
    });

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(sseEvent(JSON.stringify({ content: delta }))));
            }
          }
          controller.enqueue(encoder.encode(sseEvent("[DONE]")));
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          try {
            controller.enqueue(
              encoder.encode(
                sseEvent(
                  JSON.stringify({
                    error: "Sorry, I ran into a technical hiccup. Please try again.",
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

    const apiError = error instanceof APIError ? error : null;

    let message: string;
    if (apiError?.status === 429) {
      message = "I'm a bit overwhelmed with requests right now! Please try again in a moment.";
    } else if (apiError?.status === 401) {
      message = "My AI brain needs a fresh API key. Please let the admin know to update the configuration.";
    } else {
      message = "Sorry, I ran into a technical hiccup. Could you please try asking your question again?";
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
