"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestAuthPage() {
  const [status, setStatus] = useState<any>({});
  const [error, setError] = useState<string>("");
  const [testEmail, setTestEmail] = useState("test-user@example.com");
  const [testPassword] = useState("password123");

  const supabase = createClient();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      // Check current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      // Check current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      // Check Supabase URL and key
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      setStatus({
        session: session ? "Active" : "None",
        sessionError: sessionError?.message || "None",
        user: user?.email || "None",
        userError: userError?.message || "None",
        supabaseUrl: supabaseUrl ? "Set" : "Missing",
        supabaseAnonKey: supabaseAnonKey ? "Set" : "Missing",
        supabaseUrlValue: supabaseUrl
          ? supabaseUrl.substring(0, 30) + "..."
          : "Not set",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const testSignIn = async () => {
    setError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error) {
        setError(`Sign in error: ${error.message}`);
        console.error("Full error:", error);
      } else {
        setStatus((prev: any) => ({
          ...prev,
          signInResult: "Success",
          user: data.user?.email,
        }));
        checkStatus();
      }
    } catch (err) {
      setError(
        `Exception: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      console.error("Full exception:", err);
    }
  };

  const testSignUp = async () => {
    setError("");
    try {
      const randomEmail = `test${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: randomEmail,
        password: testPassword,
        options: {
          data: {
            first_name: "Test",
            last_name: "User",
          },
        },
      });

      if (error) {
        setError(`Sign up error: ${error.message}`);
        console.error("Full error:", error);
      } else {
        setStatus((prev: any) => ({
          ...prev,
          signUpResult: "Success",
          newUser: data.user?.email,
        }));
      }
    } catch (err) {
      setError(
        `Exception: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      console.error("Full exception:", err);
    }
  };

  const testSignOut = async () => {
    setError("");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(`Sign out error: ${error.message}`);
      } else {
        setStatus((prev: any) => ({ ...prev, signOutResult: "Success" }));
        checkStatus();
      }
    } catch (err) {
      setError(
        `Exception: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const createTestUser = async () => {
    setError("");
    try {
      const response = await fetch("/api/create-test-user");
      const data = await response.json();

      if (!response.ok) {
        setError(`Failed to create test user: ${data.error} - ${data.details}`);
      } else {
        setStatus((prev: any) => ({
          ...prev,
          testUserCreated: data.message,
          testUserEmail: data.email,
          testUserPassword: data.password,
        }));
      }
    } catch (err) {
      setError(
        `Exception creating test user: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  const testDatabaseConnection = async () => {
    setError("");
    try {
      // Test profiles table
      const { count: profilesCount, error: profilesError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Test user_progress table
      const { count: progressCount, error: progressError } = await supabase
        .from("user_progress")
        .select("*", { count: "exact", head: true });

      setStatus((prev: any) => ({
        ...prev,
        profilesAccess: profilesError
          ? `Error: ${profilesError.message}`
          : "Success",
        profilesCount: profilesCount || 0,
        progressAccess: progressError
          ? `Error: ${progressError.message}`
          : "Success",
        progressCount: progressCount || 0,
      }));
    } catch (err) {
      setError(
        `Database test exception: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>

        {/* Status Display */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>
          <div className="space-y-2">
            {Object.entries(status).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}:</span>
                <span className="text-gray-600">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Test Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <button
              onClick={checkStatus}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Status
            </button>

            <button
              onClick={testSignIn}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Test Sign In ({testEmail})
            </button>

            <button
              onClick={async () => {
                setError("");
                try {
                  const response = await fetch("/api/confirm-and-signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: testEmail,
                      password: testPassword,
                    }),
                  });
                  const data = await response.json();

                  if (!response.ok) {
                    setError(
                      `Debug signin: ${data.error} - ${data.details} (Code: ${data.code})`
                    );
                  } else {
                    setStatus((prev: any) => ({
                      ...prev,
                      debugSignIn: data.message,
                      debugSession: data.session,
                      debugUser: data.user,
                    }));
                  }
                } catch (err) {
                  setError(
                    `Exception: ${err instanceof Error ? err.message : "Unknown error"}`
                  );
                }
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Debug Sign In (Shows detailed errors)
            </button>

            <button
              onClick={testSignUp}
              className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Test Sign Up (Random Email)
            </button>

            <button
              onClick={testSignOut}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Test Sign Out
            </button>

            <button
              onClick={createTestUser}
              className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Create Test User (Admin API)
            </button>

            <button
              onClick={async () => {
                setError("");
                try {
                  const response = await fetch(
                    "/api/create-test-user-standard"
                  );
                  const data = await response.json();

                  if (!response.ok) {
                    setError(
                      `Standard signup failed: ${data.error} - ${data.details}`
                    );
                  } else {
                    setStatus((prev: any) => ({
                      ...prev,
                      standardUserCreated: data.message,
                      standardEmail: data.email,
                      standardPassword: data.password,
                      standardSession: data.session,
                    }));
                    // Update the test email for sign in
                    setTestEmail(data.email);
                  }
                } catch (err) {
                  setError(
                    `Exception: ${err instanceof Error ? err.message : "Unknown error"}`
                  );
                }
              }}
              className="w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Create Test User (Standard Signup)
            </button>

            <button
              onClick={async () => {
                setError("");
                try {
                  const response = await fetch("/api/reset-user-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: testEmail,
                      newPassword: "password123",
                    }),
                  });
                  const data = await response.json();

                  if (!response.ok) {
                    setError(
                      `Password reset failed: ${data.error} - ${data.details}`
                    );
                  } else {
                    setStatus((prev: any) => ({
                      ...prev,
                      passwordReset: `Password reset for ${data.email}`,
                      resetSuccess: true,
                    }));
                  }
                } catch (err) {
                  setError(
                    `Exception: ${err instanceof Error ? err.message : "Unknown error"}`
                  );
                }
              }}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Reset Password for Test User
            </button>

            <div className="w-full p-2 bg-gray-100 rounded text-sm">
              <p>
                <strong>Current Test Email:</strong> {testEmail}
              </p>
              {status.standardEmail && (
                <p>
                  <strong>Created User:</strong> {status.standardEmail}
                </p>
              )}
            </div>

            <button
              onClick={testDatabaseConnection}
              className="w-full bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              Test Database Connection
            </button>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            This page tests various authentication functions. Check the browser
            console for detailed error logs.
          </p>
        </div>
      </div>
    </div>
  );
}
