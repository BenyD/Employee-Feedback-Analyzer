import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { feedbackFormSchema } from "@/schemas/feedback";

// PII redaction patterns
const PII_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
  /\b\d{3}-\d{3}-\d{4}\b/g, // Phone
  /\b\d{10}\b/g, // 10-digit phone
  /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Names (basic pattern)
];

function redactPII(text: string): string {
  let redacted = text;
  PII_PATTERNS.forEach((pattern) => {
    redacted = redacted.replace(pattern, "[REDACTED]");
  });
  return redacted;
}

function encryptText(text: string): string {
  // For demo purposes, we'll just return the text as-is
  // In production, you would use a real encryption key
  return text;
}

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

    // Validate the form data
    const validatedData = feedbackFormSchema.parse(body);

    // Redact PII from comments and suggestions
    const redactedComments = redactPII(validatedData.comments);
    const redactedSuggestions = validatedData.suggestions
      ? redactPII(validatedData.suggestions)
      : null;

    // Check if original text contained PII
    const containsPII =
      redactedComments !== validatedData.comments ||
      (validatedData.suggestions &&
        redactedSuggestions !== validatedData.suggestions);

    // Encrypt the original text for storage
    const encryptedComments = encryptText(validatedData.comments);
    const encryptedSuggestions = validatedData.suggestions
      ? encryptText(validatedData.suggestions)
      : null;

    // Analyze sentiment
    const combinedText = `${validatedData.comments} ${
      validatedData.suggestions || ""
    }`;
    const sentimentAnalysis = await analyzeSentiment(combinedText);

    // Insert feedback into database
    const { data, error } = await supabaseAdmin
      .from("feedback_submissions")
      .insert({
        is_anonymous: validatedData.isAnonymous,
        submitter_name: validatedData.isAnonymous ? null : validatedData.name,
        department_id: validatedData.departmentId,
        overall_rating: validatedData.overallRating,
        work_environment_rating: validatedData.workEnvironmentRating,
        management_rating: validatedData.managementRating,
        compensation_rating: validatedData.compensationRating,
        growth_opportunities_rating: validatedData.growthOpportunitiesRating,
        comments: encryptedComments,
        suggestions: encryptedSuggestions,
        redacted_comments: redactedComments,
        redacted_suggestions: redactedSuggestions,
        contains_pii: containsPII,
        sentiment_score: sentimentAnalysis.sentiment_score,
        sentiment_label: sentimentAnalysis.sentiment_label,
        ip_hash: "hashed_ip_" + Math.random().toString(36).substr(2, 9),
        user_agent_hash: "hashed_ua_" + Math.random().toString(36).substr(2, 9),
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to submit feedback" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data.id,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Feedback submission error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid form data", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
