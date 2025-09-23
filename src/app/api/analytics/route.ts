/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    // Get overall statistics
    const { data: overallStats, error: overallError } =
      await supabaseAdmin.from("feedback_submissions").select(`
        id,
        overall_rating,
        work_environment_rating,
        management_rating,
        compensation_rating,
        growth_opportunities_rating,
        sentiment_score,
        sentiment_label,
        submitted_at,
        departments(name)
      `);

    if (overallError) {
      console.error("Database error:", overallError);
      return NextResponse.json(
        { error: "Failed to fetch analytics data" },
        { status: 500 }
      );
    }

    // Calculate overall metrics
    const totalFeedback = overallStats.length;
    const avgOverallRating =
      overallStats.reduce(
        (sum: number, item: any) => sum + item.overall_rating,
        0
      ) / totalFeedback;
    const avgSentiment =
      overallStats.reduce(
        (sum: number, item: any) => sum + (item.sentiment_score || 0),
        0
      ) / totalFeedback;

    // Sentiment distribution
    const sentimentDistribution = overallStats.reduce(
      (acc: Record<string, number>, item: any) => {
        const label = item.sentiment_label || "neutral";
        acc[label] = (acc[label] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Department-wise statistics
    const departmentStats = overallStats.reduce(
      (acc: Record<string, any>, item: any) => {
        const deptName =
          (item.departments as unknown as { name: string } | null)?.name ||
          "Unknown";
        if (!acc[deptName]) {
          acc[deptName] = {
            total: 0,
            avgRating: 0,
            avgSentiment: 0,
            sentimentCounts: { positive: 0, negative: 0, neutral: 0 },
          };
        }

        acc[deptName].total += 1;
        acc[deptName].avgRating += item.overall_rating;
        acc[deptName].avgSentiment += item.sentiment_score || 0;

        const sentiment = item.sentiment_label || "neutral";
        if (sentiment in acc[deptName].sentimentCounts) {
          (acc[deptName].sentimentCounts as Record<string, number>)[
            sentiment
          ] += 1;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          total: number;
          avgRating: number;
          avgSentiment: number;
          sentimentCounts: {
            positive: number;
            negative: number;
            neutral: number;
          };
        }
      >
    );

    // Calculate averages for each department
    Object.keys(departmentStats).forEach((dept) => {
      const stats = departmentStats[dept];
      stats.avgRating = stats.avgRating / stats.total;
      stats.avgSentiment = stats.avgSentiment / stats.total;
    });

    // Rating distribution
    const ratingDistribution = overallStats.reduce(
      (acc: Record<number, number>, item: any) => {
        acc[item.overall_rating] = (acc[item.overall_rating] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    // Recent feedback (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentFeedback = overallStats.filter(
      (item: any) => new Date(item.submitted_at) >= thirtyDaysAgo
    );

    // Trend data (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trendData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayFeedback = overallStats.filter((item: any) => {
        const itemDate = new Date(item.submitted_at);
        return itemDate >= dayStart && itemDate <= dayEnd;
      });

      trendData.push({
        date: date.toISOString().split("T")[0],
        count: dayFeedback.length,
        avgSentiment:
          dayFeedback.length > 0
            ? dayFeedback.reduce(
                (sum: number, item: any) => sum + (item.sentiment_score || 0),
                0
              ) / dayFeedback.length
            : 0,
      });
    }

    return NextResponse.json({
      overview: {
        totalFeedback,
        avgOverallRating: Math.round(avgOverallRating * 100) / 100,
        avgSentiment: Math.round(avgSentiment * 100) / 100,
        recentFeedback: recentFeedback.length,
      },
      sentimentDistribution,
      departmentStats,
      ratingDistribution,
      trendData,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
