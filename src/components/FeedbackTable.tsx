"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye, EyeOff, Star } from "lucide-react";

interface FeedbackItem {
  id: string;
  isAnonymous: boolean;
  submitterName: string | null;
  department: string;
  overallRating: number;
  workEnvironmentRating: number;
  managementRating: number;
  compensationRating: number;
  growthOpportunitiesRating: number;
  comments: string;
  suggestions: string;
  sentimentScore: number;
  sentimentLabel: string;
  confidenceScore: number;
  sentimentIntensity: string;
  workEnvironmentSentiment: number;
  workEnvironmentSentimentLabel: string;
  workEnvironmentIntensity: string;
  managementSentiment: number;
  managementSentimentLabel: string;
  managementIntensity: string;
  compensationSentiment: number;
  compensationSentimentLabel: string;
  compensationIntensity: string;
  growthOpportunitiesSentiment: number;
  growthOpportunitiesSentimentLabel: string;
  growthOpportunitiesIntensity: string;
  submittedAt: string;
}

interface FeedbackData {
  data: FeedbackItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function FeedbackTable() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const fetchFeedbackData = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/feedback-data?page=${page}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setFeedbackData(data);
      }
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackData(currentPage);
  }, [currentPage]);

  const toggleRowExpansion = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Individual Feedback</CardTitle>
          <CardDescription>Loading feedback submissions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!feedbackData || feedbackData.data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Individual Feedback</CardTitle>
          <CardDescription>No feedback submissions found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No feedback has been submitted yet.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Feedback</CardTitle>
        <CardDescription>
          View individual feedback submissions ({feedbackData.pagination.total}{" "}
          total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Submitter</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Overall Rating</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feedbackData.data.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow>
                    <TableCell>
                      <Badge
                        variant={item.isAnonymous ? "secondary" : "default"}
                        className="text-xs"
                      >
                        {item.isAnonymous ? (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Anonymous
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            Named
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.isAnonymous
                        ? "Anonymous"
                        : item.submitterName || "N/A"}
                    </TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium">
                          {item.overallRating}
                        </span>
                        <div className="flex">
                          {renderStars(item.overallRating)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${getSentimentColor(
                          item.sentimentLabel
                        )}`}
                      >
                        {item.sentimentLabel.charAt(0).toUpperCase() +
                          item.sentimentLabel.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleRowExpansion(item.id)}
                        className="hover:bg-blue-50 hover:border-blue-300"
                      >
                        {expandedRows.has(item.id)
                          ? "Hide Details"
                          : "View Details"}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedRows.has(item.id) && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50">
                        <div className="p-4 space-y-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Work Environment
                              </label>
                              <div className="flex items-center space-x-1">
                                <span className="text-sm">
                                  {item.workEnvironmentRating}
                                </span>
                                <div className="flex">
                                  {renderStars(item.workEnvironmentRating)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Management
                              </label>
                              <div className="flex items-center space-x-1">
                                <span className="text-sm">
                                  {item.managementRating}
                                </span>
                                <div className="flex">
                                  {renderStars(item.managementRating)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Compensation
                              </label>
                              <div className="flex items-center space-x-1">
                                <span className="text-sm">
                                  {item.compensationRating}
                                </span>
                                <div className="flex">
                                  {renderStars(item.compensationRating)}
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Growth Opportunities
                              </label>
                              <div className="flex items-center space-x-1">
                                <span className="text-sm">
                                  {item.growthOpportunitiesRating}
                                </span>
                                <div className="flex">
                                  {renderStars(item.growthOpportunitiesRating)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              Comments
                            </label>
                            <p className="text-sm text-gray-800 mt-1 p-3 bg-white rounded border max-w-full break-words whitespace-pre-wrap">
                              {item.comments || "No comments provided"}
                            </p>
                          </div>
                          {item.suggestions && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Suggestions
                              </label>
                              <p className="text-sm text-gray-800 mt-1 p-3 bg-white rounded border max-w-full break-words whitespace-pre-wrap">
                                {item.suggestions}
                              </p>
                            </div>
                          )}
                          {/* Enhanced Sentiment Analysis */}
                          <div className="border-t pt-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">
                              Enhanced Sentiment Analysis
                            </h4>

                            {/* Overall Sentiment */}
                            <div className="mb-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Overall Sentiment
                                </span>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    className={`text-xs ${getSentimentColor(
                                      item.sentimentLabel
                                    )}`}
                                  >
                                    {item.sentimentLabel
                                      .charAt(0)
                                      .toUpperCase() +
                                      item.sentimentLabel.slice(1)}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {item.sentimentIntensity || "N/A"}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>
                                  Score:{" "}
                                  {item.sentimentScore?.toFixed(2) || "N/A"}
                                </span>
                                <span>
                                  Confidence:{" "}
                                  {(item.confidenceScore * 100)?.toFixed(1) ||
                                    "N/A"}
                                  %
                                </span>
                              </div>
                            </div>

                            {/* Aspect-based Sentiment */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="p-3 bg-white rounded border">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-600">
                                      Work Environment
                                    </span>
                                    <div className="flex items-center space-x-1">
                                      <Badge
                                        className={`text-xs ${getSentimentColor(
                                          item.workEnvironmentSentimentLabel
                                        )}`}
                                      >
                                        {item.workEnvironmentSentimentLabel
                                          ?.charAt(0)
                                          .toUpperCase() +
                                          item.workEnvironmentSentimentLabel?.slice(
                                            1
                                          ) || "N/A"}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {item.workEnvironmentIntensity || "N/A"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Score:{" "}
                                    {item.workEnvironmentSentiment?.toFixed(
                                      2
                                    ) || "N/A"}
                                  </div>
                                </div>

                                <div className="p-3 bg-white rounded border">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-600">
                                      Management
                                    </span>
                                    <div className="flex items-center space-x-1">
                                      <Badge
                                        className={`text-xs ${getSentimentColor(
                                          item.managementSentimentLabel
                                        )}`}
                                      >
                                        {item.managementSentimentLabel
                                          ?.charAt(0)
                                          .toUpperCase() +
                                          item.managementSentimentLabel?.slice(
                                            1
                                          ) || "N/A"}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {item.managementIntensity || "N/A"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Score:{" "}
                                    {item.managementSentiment?.toFixed(2) ||
                                      "N/A"}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="p-3 bg-white rounded border">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-600">
                                      Compensation
                                    </span>
                                    <div className="flex items-center space-x-1">
                                      <Badge
                                        className={`text-xs ${getSentimentColor(
                                          item.compensationSentimentLabel
                                        )}`}
                                      >
                                        {item.compensationSentimentLabel
                                          ?.charAt(0)
                                          .toUpperCase() +
                                          item.compensationSentimentLabel?.slice(
                                            1
                                          ) || "N/A"}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {item.compensationIntensity || "N/A"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Score:{" "}
                                    {item.compensationSentiment?.toFixed(2) ||
                                      "N/A"}
                                  </div>
                                </div>

                                <div className="p-3 bg-white rounded border">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-600">
                                      Growth Opportunities
                                    </span>
                                    <div className="flex items-center space-x-1">
                                      <Badge
                                        className={`text-xs ${getSentimentColor(
                                          item.growthOpportunitiesSentimentLabel
                                        )}`}
                                      >
                                        {item.growthOpportunitiesSentimentLabel
                                          ?.charAt(0)
                                          .toUpperCase() +
                                          item.growthOpportunitiesSentimentLabel?.slice(
                                            1
                                          ) || "N/A"}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {item.growthOpportunitiesIntensity ||
                                          "N/A"}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    Score:{" "}
                                    {item.growthOpportunitiesSentiment?.toFixed(
                                      2
                                    ) || "N/A"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {feedbackData.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, feedbackData.pagination.total)} of{" "}
              {feedbackData.pagination.total} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {feedbackData.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === feedbackData.pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
