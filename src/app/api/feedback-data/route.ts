/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Fetch feedback data with department information
    const { data: feedbackData, error } = await supabaseAdmin
      .from("feedback_submissions")
      .select(
        `
        id,
        is_anonymous,
        submitter_name,
        overall_rating,
        work_environment_rating,
        management_rating,
        compensation_rating,
        growth_opportunities_rating,
        redacted_comments,
        redacted_suggestions,
        sentiment_score,
        sentiment_label,
        confidence_score,
        submitted_at,
        departments(name)
      `
      )
      .order("submitted_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch feedback data" },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count } = await supabaseAdmin
      .from("feedback_submissions")
      .select("*", { count: "exact", head: true });

    // For demo purposes, we'll use the redacted comments directly
    const decryptedData = feedbackData.map((item: any) => {
      // In production, you would decrypt the encrypted comments here
      // For demo, we'll use the redacted versions
      const decryptedComments = item.redacted_comments;
      const decryptedSuggestions = item.redacted_suggestions;

      return {
        id: item.id,
        isAnonymous: item.is_anonymous,
        submitterName: item.submitter_name,
        department:
          (item.departments as unknown as { name: string } | null)?.name ||
          "Unknown",
        overallRating: item.overall_rating,
        workEnvironmentRating: item.work_environment_rating,
        managementRating: item.management_rating,
        compensationRating: item.compensation_rating,
        growthOpportunitiesRating: item.growth_opportunities_rating,
        comments: decryptedComments,
        suggestions: decryptedSuggestions,
        sentimentScore: item.sentiment_score,
        sentimentLabel: item.sentiment_label,
        confidenceScore: item.confidence_score,
        submittedAt: item.submitted_at,
      };
    });

    return NextResponse.json({
      data: decryptedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
