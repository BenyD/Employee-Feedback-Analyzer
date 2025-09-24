import { NextRequest, NextResponse } from "next/server";

interface EnhancedSentimentResult {
  sentiment_score: number;
  sentiment_label: string;
  confidence_score: number;
  sentiment_intensity: string;
  aspect_sentiments: {
    work_environment: {
      score: number;
      label: string;
      intensity: string;
    };
    management: {
      score: number;
      label: string;
      intensity: string;
    };
    compensation: {
      score: number;
      label: string;
      intensity: string;
    };
    growth_opportunities: {
      score: number;
      label: string;
      intensity: string;
    };
  };
}

// Keywords for aspect-based analysis
const ASPECT_KEYWORDS = {
  work_environment: [
    "office",
    "environment",
    "culture",
    "atmosphere",
    "colleagues",
    "team",
    "workplace",
    "space",
    "facilities",
    "equipment",
    "tools",
    "desk",
    "cubicle",
    "meeting room",
  ],
  management: [
    "manager",
    "boss",
    "supervisor",
    "leadership",
    "management",
    "director",
    "executive",
    "supervision",
    "guidance",
    "support",
    "communication",
    "decision",
    "authority",
  ],
  compensation: [
    "salary",
    "pay",
    "wage",
    "compensation",
    "benefits",
    "bonus",
    "raise",
    "promotion",
    "money",
    "income",
    "earnings",
    "financial",
    "pension",
    "insurance",
    "vacation",
  ],
  growth_opportunities: [
    "career",
    "growth",
    "development",
    "promotion",
    "learning",
    "training",
    "education",
    "skills",
    "advancement",
    "opportunity",
    "future",
    "progress",
    "improvement",
  ],
};

function determineIntensity(score: number, confidence: number): string {
  const absScore = Math.abs(score);
  const adjustedScore = absScore * confidence;

  if (adjustedScore >= 0.8) return "extreme";
  if (adjustedScore >= 0.6) return "strong";
  if (adjustedScore >= 0.3) return "moderate";
  return "mild";
}

function analyzeAspectSentiment(
  text: string,
  aspect: keyof typeof ASPECT_KEYWORDS
): {
  score: number;
  label: string;
  intensity: string;
} {
  const keywords = ASPECT_KEYWORDS[aspect];
  const lowerText = text.toLowerCase();

  // Count keyword mentions
  const keywordCount = keywords.filter((keyword) =>
    lowerText.includes(keyword)
  ).length;

  // Simple sentiment analysis based on positive/negative words
  const positiveWords = [
    "good",
    "great",
    "excellent",
    "amazing",
    "wonderful",
    "fantastic",
    "love",
    "enjoy",
    "satisfied",
    "happy",
  ];
  const negativeWords = [
    "bad",
    "terrible",
    "awful",
    "hate",
    "disappointed",
    "frustrated",
    "angry",
    "upset",
    "unhappy",
    "poor",
  ];

  const positiveCount = positiveWords.filter((word) =>
    lowerText.includes(word)
  ).length;
  const negativeCount = negativeWords.filter((word) =>
    lowerText.includes(word)
  ).length;

  // Calculate score based on keyword relevance and sentiment
  let score = 0;
  if (keywordCount > 0) {
    const sentimentRatio =
      (positiveCount - negativeCount) /
      Math.max(positiveCount + negativeCount, 1);
    score = sentimentRatio * Math.min(keywordCount / 3, 1); // Cap at 1.0
  }

  // Determine label and intensity
  let label = "neutral";
  if (score > 0.2) label = "positive";
  else if (score < -0.2) label = "negative";

  const intensity = determineIntensity(score, 0.8); // Assume good confidence for aspect analysis

  return { score, label, intensity };
}

async function analyzeSentiment(
  text: string
): Promise<EnhancedSentimentResult> {
  const apiKey = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;

  // Analyze aspect-based sentiments
  const aspectSentiments = {
    work_environment: analyzeAspectSentiment(text, "work_environment"),
    management: analyzeAspectSentiment(text, "management"),
    compensation: analyzeAspectSentiment(text, "compensation"),
    growth_opportunities: analyzeAspectSentiment(text, "growth_opportunities"),
  };

  if (!apiKey) {
    // Fallback for demo - return neutral sentiment with aspect analysis
    return {
      sentiment_score: 0.0,
      sentiment_label: "neutral",
      confidence_score: 0.5,
      sentiment_intensity: "mild",
      aspect_sentiments: aspectSentiments,
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

      const intensity = determineIntensity(sentiment_score, best.score);

      return {
        sentiment_score,
        sentiment_label,
        confidence_score: best.score,
        sentiment_intensity: intensity,
        aspect_sentiments: aspectSentiments,
      };
    }

    // Fallback
    return {
      sentiment_score: 0.0,
      sentiment_label: "neutral",
      confidence_score: 0.5,
      sentiment_intensity: "mild",
      aspect_sentiments: aspectSentiments,
    };
  } catch (error) {
    console.error("Sentiment analysis error:", error);
    return {
      sentiment_score: 0.0,
      sentiment_label: "neutral",
      confidence_score: 0.5,
      sentiment_intensity: "mild",
      aspect_sentiments: aspectSentiments,
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
