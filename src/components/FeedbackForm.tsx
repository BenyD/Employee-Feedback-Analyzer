/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  feedbackFormSchema,
  type FeedbackFormData,
  type Department,
} from "@/schemas/feedback";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Star, Send, CheckCircle, User, Eye, EyeOff } from "lucide-react";

interface FeedbackFormProps {
  departments: Department[];
  onSubmit: (data: FeedbackFormData) => Promise<void>;
}

const StarRating = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
}) => {
  return (
    <div className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            <Star
              className={`h-6 w-6 ${
                rating <= value
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300 hover:text-yellow-200"
              } transition-colors`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {value === 1 && "Poor"}
          {value === 2 && "Fair"}
          {value === 3 && "Good"}
          {value === 4 && "Very Good"}
          {value === 5 && "Excellent"}
        </span>
      </div>
    </div>
  );
};

export function FeedbackForm({ departments, onSubmit }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      isAnonymous: true,
      name: "",
      departmentId: "",
      overallRating: 0,
      workEnvironmentRating: 0,
      managementRating: 0,
      compensationRating: 0,
      growthOpportunitiesRating: 0,
      comments: "",
      suggestions: "",
    },
  });

  const handleSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h3 className="text-2xl font-semibold text-gray-900">Thank You!</h3>
            <p className="text-gray-600">
              Your feedback has been submitted anonymously and will help us
              improve our workplace.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="mt-4"
            >
              Submit Another Response
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Employee Feedback
        </CardTitle>
        <CardDescription className="text-center">
          Help us improve our workplace by sharing your feedback
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Anonymous Toggle */}
            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }: { field: any }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base flex items-center gap-2">
                      {field.value ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      {field.value ? "Submit Anonymously" : "Submit with Name"}
                    </FormLabel>
                    <FormDescription>
                      {field.value
                        ? "Your feedback will be completely anonymous"
                        : "Your name will be associated with this feedback"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Name Field - Only show when not anonymous */}
            {!form.watch("isAnonymous") && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Your Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your name will be visible to HR teams
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Department Selection */}
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Overall Rating */}
            <FormField
              control={form.control}
              name="overallRating"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                    label="Overall Job Satisfaction *"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Work Environment Rating */}
            <FormField
              control={form.control}
              name="workEnvironmentRating"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                    label="Work Environment *"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Management Rating */}
            <FormField
              control={form.control}
              name="managementRating"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                    label="Management & Leadership *"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Compensation Rating */}
            <FormField
              control={form.control}
              name="compensationRating"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                    label="Compensation & Benefits *"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Growth Opportunities Rating */}
            <FormField
              control={form.control}
              name="growthOpportunitiesRating"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <StarRating
                    value={field.value}
                    onChange={field.onChange}
                    label="Growth & Development Opportunities *"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comments */}
            <FormField
              control={form.control}
              name="comments"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Comments *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please share your thoughts about your work experience, what's working well, and what could be improved..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your comments will be analyzed for sentiment and topics to
                    help identify key areas for improvement.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Suggestions */}
            <FormField
              control={form.control}
              name="suggestions"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Suggestions for Improvement</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Do you have any specific suggestions for how we can improve as an organization?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Share any specific ideas or recommendations you
                    have.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
