"use client";

import { useEffect, useState } from "react";
import { FeedbackForm } from "@/components/FeedbackForm";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { type Department, type FeedbackFormData } from "@/schemas/feedback";

export default function Home() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (data: FeedbackFormData) => {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to submit feedback");
    }

    return response.json();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Navigation currentPage="home" />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Feedback Form */}
        <div className="flex justify-center">
          <FeedbackForm
            departments={departments}
            onSubmit={handleFeedbackSubmit}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
