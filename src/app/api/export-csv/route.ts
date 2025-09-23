/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Fetch all feedback data with department information
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
      .order("submitted_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch feedback data" },
        { status: 500 }
      );
    }

    // Prepare CSV data
    const csvData = feedbackData.map((item: any) => ({
      ID: item.id,
      "Submission Type": item.is_anonymous ? "Anonymous" : "Named",
      "Submitter Name": item.submitter_name || "N/A",
      Department: (item.departments as any)?.name || "Unknown",
      "Overall Rating": item.overall_rating,
      "Work Environment Rating": item.work_environment_rating,
      "Management Rating": item.management_rating,
      "Compensation Rating": item.compensation_rating,
      "Growth Opportunities Rating": item.growth_opportunities_rating,
      Comments: `"${(item.redacted_comments || "").replace(/"/g, '""')}"`,
      Suggestions: `"${(item.redacted_suggestions || "").replace(/"/g, '""')}"`,
      "Sentiment Score": item.sentiment_score,
      "Sentiment Label": item.sentiment_label,
      "Confidence Score": item.confidence_score,
      "Submitted At": new Date(item.submitted_at).toISOString(),
    }));

    // Create CSV content
    if (csvData.length === 0) {
      return NextResponse.json({ error: "No data to export" }, { status: 404 });
    }

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(","),
      ...csvData.map((row: any) => Object.values(row).join(",")),
    ].join("\n");

    // Return CSV file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="feedback-data-${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
