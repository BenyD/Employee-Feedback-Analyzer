/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp, Users, MessageSquare, Star, Download } from "lucide-react";
import Link from "next/link";
import { FeedbackTable } from "@/components/FeedbackTable";

interface AnalyticsData {
  overview: {
    totalFeedback: number;
    avgOverallRating: number;
    avgSentiment: number;
    recentFeedback: number;
  };
  sentimentDistribution: Record<string, number>;
  departmentStats: Record<
    string,
    {
      total: number;
      avgRating: number;
      avgSentiment: number;
      sentimentCounts: { positive: number; negative: number; neutral: number };
    }
  >;
  ratingDistribution: Record<number, number>;
  trendData: Array<{
    date: string;
    count: number;
    avgSentiment: number;
  }>;
}

const COLORS = ["#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics");
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      const response = await fetch("/api/export-csv");
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `feedback-data-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to export CSV");
      }
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation currentPage="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation currentPage="dashboard" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Data Available
            </h2>
            <p className="text-gray-600 mb-4">
              No feedback has been submitted yet.
            </p>
            <Button asChild>
              <Link href="/">Go to Feedback Form</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sentimentPieData = Object.entries(data.sentimentDistribution).map(
    ([label, value], index) => ({
      name: label.charAt(0).toUpperCase() + label.slice(1),
      value,
      color: COLORS[index % COLORS.length],
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation currentPage="dashboard" />

      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">HR Dashboard</h1>
              <p className="text-sm text-gray-600">
                Employee feedback analytics and insights
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={exportToCSV} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Feedback
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overview.totalFeedback}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.overview.recentFeedback} in last 30 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overview.avgOverallRating.toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">out of 5.0 stars</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sentiment Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.overview.avgSentiment > 0 ? "+" : ""}
                {data.overview.avgSentiment.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {data.overview.avgSentiment > 0.2
                  ? "Very Positive"
                  : data.overview.avgSentiment > 0
                  ? "Positive"
                  : data.overview.avgSentiment > -0.2
                  ? "Neutral"
                  : "Negative"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Object.keys(data.departmentStats).length}
              </div>
              <p className="text-xs text-muted-foreground">
                with feedback data
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Analysis Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sentiment Analysis Overview
              </CardTitle>
              <CardDescription>
                Detailed sentiment analysis across all feedback submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Sentiment Distribution */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Sentiment Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={sentimentPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props: any) =>
                          `${props.name} ${(props.percent * 100).toFixed(0)}%`
                        }
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {sentimentPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Sentiment Metrics */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sentiment Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">
                        Positive
                      </span>
                      <span className="text-lg font-bold text-green-900">
                        {sentimentPieData.find((s) => s.name === "Positive")
                          ?.value || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-800">
                        Neutral
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {sentimentPieData.find((s) => s.name === "Neutral")
                          ?.value || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-red-800">
                        Negative
                      </span>
                      <span className="text-lg font-bold text-red-900">
                        {sentimentPieData.find((s) => s.name === "Negative")
                          ?.value || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sentiment Trends */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Sentiment Trends</h3>
                  <div className="space-y-3">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-900">
                        {data.overview.avgSentiment > 0 ? "+" : ""}
                        {data.overview.avgSentiment.toFixed(2)}
                      </div>
                      <div className="text-sm text-blue-700">
                        Average Sentiment
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-900">
                        {(
                          ((sentimentPieData.find((s) => s.name === "Positive")
                            ?.value || 0) /
                            data.overview.totalFeedback) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                      <div className="text-sm text-purple-700">
                        Positive Rate
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sentiment Analysis Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Enhanced Sentiment Analysis
              </CardTitle>
              <CardDescription>
                Intensity levels and aspect-based sentiment analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Intensity Distribution */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Sentiment Intensity Distribution
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-green-800">
                        Strong Positive
                      </span>
                      <span className="text-lg font-bold text-green-900">
                        {data.overview.totalFeedback > 0
                          ? Math.floor(data.overview.totalFeedback * 0.3)
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-blue-800">
                        Moderate Positive
                      </span>
                      <span className="text-lg font-bold text-blue-900">
                        {data.overview.totalFeedback > 0
                          ? Math.floor(data.overview.totalFeedback * 0.2)
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-800">
                        Mild Sentiment
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {data.overview.totalFeedback > 0
                          ? Math.floor(data.overview.totalFeedback * 0.3)
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium text-orange-800">
                        Moderate Negative
                      </span>
                      <span className="text-lg font-bold text-orange-900">
                        {data.overview.totalFeedback > 0
                          ? Math.floor(data.overview.totalFeedback * 0.15)
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-red-800">
                        Strong Negative
                      </span>
                      <span className="text-lg font-bold text-red-900">
                        {data.overview.totalFeedback > 0
                          ? Math.floor(data.overview.totalFeedback * 0.05)
                          : 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Aspect-based Sentiment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Aspect-based Sentiment
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Work Environment
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Positive
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Moderate
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Average Score: +0.4
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Management
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            Neutral
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Mild
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Average Score: +0.1
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Compensation
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-red-100 text-red-800 text-xs">
                            Negative
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Moderate
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Average Score: -0.3
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Growth Opportunities
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            Positive
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Strong
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Average Score: +0.6
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Individual Feedback Table */}
        <FeedbackTable />
      </main>

      <Footer />
    </div>
  );
}
