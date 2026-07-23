import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini client for Zedskillz AI Tutor.
 * Uses the free-tier gemini-2.0-flash model.
 * Requires GEMINI_API_KEY in .env — falls back to a mock response if missing or invalid.
 *
 * IMPORTANT: Get a valid API key at https://aistudio.google.com/apikey
 * Valid keys start with "AIzaSy..." (about 39 characters).
 */
const apiKey = process.env.GEMINI_API_KEY;

// Instantiate if a key is provided — the API route will fall back to mock if it fails
export const gemini = apiKey
  ? new GoogleGenerativeAI(apiKey)
  : null;

export const GEMINI_MODEL = "gemini-2.0-flash";

export const SYSTEM_PROMPT =
  "You are ZedAI, an AI tutor for Zedskillz Hub — a Zambian educational platform. " +
  "You help students with their coursework, explain concepts in simple terms, and can " +
  "communicate in English, Bemba, Nyanja, and Tonga. Be encouraging, supportive, and " +
  "use local Zambian examples (e.g., agriculture, mobile money, ECZ exams) when relevant. " +
  "Keep responses concise but thorough. If asked about code, provide examples. " +
  "If asked to translate, provide the translation and the original. " +
  "Format your responses clearly — use bullet points, numbered steps, or short paragraphs when appropriate. " +
  "If a student asks about something outside education, gently redirect them to learning topics.";
