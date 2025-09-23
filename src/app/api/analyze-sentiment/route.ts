import { NextRequest, NextResponse } from "next/server";

async function analyzeSentiment(text: string): Promise<{
  sentiment_score: number;
  sentiment_label: string;
  confidence_score: number;
}> {
  const apiKey = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    // Fallback for demo - return neutral sentiment
    return {
      sentiment_score: 0.0,
      sentiment_label: "neutral",
      confidence_score: 0.5,
    };
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const result = await response.json();

    // Handle both single and batch responses
    const analysis = Array.isArray(result) ? result[0] : result;

    if (Array.isArray(analysis)) {
      // Find the highest confidence prediction
      const best = analysis.reduce((prev, current) =>
        prev.score > current.score ? prev : current
      );

      // Convert labels to our format
      let sentiment_label = "neutral";
      let sentiment_score = 0.0;

      if (best.label === "positive") {
        sentiment_label = "positive";
        sentiment_score = best.score;
      } else if (best.label === "negative") {
        sentiment_label = "negative";
        sentiment_score = -best.score;
      } else {
        // Neutral
        sentiment_label = "neutral";
        sentiment_score = 0.0;
      }

      return {
        sentiment_score,
        sentiment_label,
        confidence_score: best.score,
      };
    }

    // Fallback
    return {
      sentiment_score: 0.0,
      sentiment_label: "neutral",
      confidence_score: 0.5,
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return {
      sentiment_score: 0.0,
      sentiment_label: "neutral",
      confidence_score: 0.5,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const result = await analyzeSentiment(text);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
