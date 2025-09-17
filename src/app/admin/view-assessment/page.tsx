"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  User,
  FileText,
  TrendingUp,
  Award,
  ArrowLeft,
  Calendar,
  Mail,
  Shield,
  Target,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface UserAssessment {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  is_test_user: boolean;
  assessment_date: string;
  total_spi_score: number;
  tier: string;
  standout_strength_1: string;
  standout_strength_2: string;
  spi_score: number;
  current_tier: string;
}

export default function ViewAssessment() {
  const [users, setUsers] = useState<UserAssessment[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserAssessment | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Get all users first
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, email, first_name, last_name, created_at, is_test_user")
        .order("created_at", { ascending: false });

      if (userError) throw userError;

      // Get user progress data separately
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("user_id, spi_score, current_tier");

      // Get comprehensive assessments data separately
      const { data: assessmentData } = await supabase
        .from("comprehensive_assessments")
        .select(
          "user_id, assessment_date, total_spi_score, tier, standout_strength_1, standout_strength_2"
        )
        .order("assessment_date", { ascending: false });

        // Process the data to combine everything
        const processedUsers =
          userData?.map((user) => {
            const progress =
              progressData?.find((p) => p.user_id === user.id) || {};
            const assessment =
              assessmentData?.find((a) => a.user_id === user.id) || {};

            return {
              id: user.id,
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              created_at: user.created_at,
              is_test_user: user.is_test_user,
              assessment_date: (assessment as any)?.assessment_date,
              total_spi_score: (assessment as any)?.total_spi_score,
              tier: (assessment as any)?.tier,
              standout_strength_1: (assessment as any)?.standout_strength_1,
              standout_strength_2: (assessment as any)?.standout_strength_2,
              spi_score: (progress as any)?.spi_score || 0,
              current_tier: (progress as any)?.current_tier,
            };
          }) || [];

      setUsers(processedUsers);
    } catch (err) {
      console.error("Error loading users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "1%":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "9%":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      case "90%":
        return "text-orange-600 bg-orange-100 dark:bg-orange-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
          <p className="mt-4 text-red-600">{error}</p>
          <button
            onClick={loadUsers}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            View User Assessments
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Search and view complete assessment results for any user
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      selectedUser?.id === user.id
                        ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-700"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user.email}
                          </p>
                          {user.is_test_user && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                              Test
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {user.first_name} {user.last_name}
                        </p>
                        {user.spi_score > 0 && (
                          <div className="flex items-center mt-2">
                            <TrendingUp className="h-3 w-3 text-gray-400 mr-1" />
                            <span
                              className={`text-xs font-medium ${getScoreColor(user.spi_score)}`}
                            >
                              SPI: {user.spi_score}
                            </span>
                          </div>
                        )}
                      </div>
                      {user.spi_score > 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assessment Details */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {selectedUser.first_name} {selectedUser.last_name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {selectedUser.email}
                      </p>
                    </div>
                    {selectedUser.is_test_user && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400">
                        Test User
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {selectedUser.spi_score > 0 ? (
                    <div className="space-y-6">
                      {/* SPI Score */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Success Probability Index
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              Overall assessment score
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-3xl font-bold ${getScoreColor(selectedUser.spi_score)}`}
                            >
                              {selectedUser.spi_score}
                            </div>
                            <div
                              className={`text-sm font-medium ${getTierColor(selectedUser.current_tier)} px-2 py-1 rounded`}
                            >
                              {selectedUser.current_tier} Tier
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Assessment Details */}
                      {selectedUser.assessment_date && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Assessment Date
                              </h4>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                              {new Date(
                                selectedUser.assessment_date
                              ).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <Target className="h-5 w-5 text-gray-400 mr-2" />
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Assessment Tier
                              </h4>
                            </div>
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getTierColor(selectedUser.tier)}`}
                            >
                              {selectedUser.tier}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Standout Strengths */}
                      {(selectedUser.standout_strength_1 ||
                        selectedUser.standout_strength_2) && (
                        <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex items-center mb-3">
                            <Award className="h-5 w-5 text-gray-400 mr-2" />
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Standout Strengths
                            </h4>
                          </div>
                          <div className="space-y-2">
                            {selectedUser.standout_strength_1 && (
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {selectedUser.standout_strength_1}
                                </span>
                              </div>
                            )}
                            {selectedUser.standout_strength_2 && (
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-gray-700 dark:text-gray-300">
                                  {selectedUser.standout_strength_2}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* User Info */}
                      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            User Information
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Member since:
                            </span>
                            <p className="text-gray-900 dark:text-white">
                              {new Date(
                                selectedUser.created_at
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">
                              Account type:
                            </span>
                            <p className="text-gray-900 dark:text-white">
                              {selectedUser.is_test_user
                                ? "Test Account"
                                : "Regular Account"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Assessment Completed
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This user hasn't completed their assessment yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a User
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a user from the list to view their complete
                    assessment results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
