import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { APIError } from "openai";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Validate each message has role and content
    for (const msg of messages) {
      if (!msg.role || typeof msg.content !== "string") {
        return NextResponse.json(
          { error: "Each message must have a 'role' and 'content' string" },
          { status: 400 }
        );
      }
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "YOUR_OPENAI_API_KEY") {
      return NextResponse.json(
        {
          role: "assistant",
          content:
            "I'm not fully configured yet! The admin needs to set up an OpenAI API key in the `.env` file. Until then, I can still help with general questions — just know I'm running in demo mode.",
        },
        { status: 200 }
      );
    }

    const completion = await openai.chat.completions.create({
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
    });

    const reply = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return NextResponse.json({
      role: "assistant",
      content: reply,
    });
  } catch (error: unknown) {
    console.error("AI Chat API Error:", error);

    const apiError = error instanceof APIError ? error : null;

    // Handle rate limiting
    if (apiError?.status === 429) {
      return NextResponse.json(
        {
          role: "assistant",
          content:
            "I'm a bit overwhelmed with requests right now! Please try again in a moment.",
        },
        { status: 200 }
      );
    }

    // Handle authentication errors
    if (apiError?.status === 401) {
      return NextResponse.json(
        {
          role: "assistant",
          content:
            "My AI brain needs a fresh API key. Please let the admin know to update the configuration.",
        },
        { status: 200 }
      );
    }

    // Generic fallback
    return NextResponse.json(
      {
        role: "assistant",
        content:
          "Sorry, I ran into a technical hiccup. Could you please try asking your question again?",
      },
      { status: 200 }
    );
  }
}
