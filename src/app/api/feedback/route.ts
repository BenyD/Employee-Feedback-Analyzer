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

    // Analyze sentiment with enhanced features
    const combinedText = `${validatedData.comments} ${
      validatedData.suggestions || ""
    }`;

    // Call the enhanced sentiment analysis API
    const sentimentResponse = await fetch(
      `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/api/analyze-sentiment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: combinedText }),
      }
    );

    const sentimentAnalysis = await sentimentResponse.json();

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
        confidence_score: sentimentAnalysis.confidence_score,
        sentiment_intensity: sentimentAnalysis.sentiment_intensity,
        work_environment_sentiment:
          sentimentAnalysis.aspect_sentiments.work_environment.score,
        work_environment_sentiment_label:
          sentimentAnalysis.aspect_sentiments.work_environment.label,
        work_environment_intensity:
          sentimentAnalysis.aspect_sentiments.work_environment.intensity,
        management_sentiment:
          sentimentAnalysis.aspect_sentiments.management.score,
        management_sentiment_label:
          sentimentAnalysis.aspect_sentiments.management.label,
        management_intensity:
          sentimentAnalysis.aspect_sentiments.management.intensity,
        compensation_sentiment:
          sentimentAnalysis.aspect_sentiments.compensation.score,
        compensation_sentiment_label:
          sentimentAnalysis.aspect_sentiments.compensation.label,
        compensation_intensity:
          sentimentAnalysis.aspect_sentiments.compensation.intensity,
        growth_opportunities_sentiment:
          sentimentAnalysis.aspect_sentiments.growth_opportunities.score,
        growth_opportunities_sentiment_label:
          sentimentAnalysis.aspect_sentiments.growth_opportunities.label,
        growth_opportunities_intensity:
          sentimentAnalysis.aspect_sentiments.growth_opportunities.intensity,
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
