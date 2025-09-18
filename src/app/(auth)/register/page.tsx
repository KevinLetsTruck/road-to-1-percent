"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/types/database";
import { CheckCircle, ArrowRight, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      // Sign in the user immediately after registration
      const { data: signInData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

      if (signInError) throw signInError;

      if (signInData.user) {
        // Create profile
        const profileData: Database['public']['Tables']['profiles']['Insert'] = {
          id: signInData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
        };
        const { error: profileError } = await supabase.from("profiles").insert(profileData);

        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Continue even if profile creation fails
        }

        // Create user progress record
        const { error: progressError } = await supabase
          .from("user_progress")
          .insert({
            user_id: signInData.user.id,
          });

        if (progressError) {
          console.error("Progress creation error:", progressError);
          // Continue even if progress creation fails
        }

        // Redirect directly to comprehensive assessment
        router.push("/dashboard/comprehensive-assessment");
      } else {
        throw new Error("Failed to sign in after registration");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Data-driven assessments",
    "Personalized roadmap",
    "Community support",
    "Expert mentorship",
    "Progress tracking",
    "Industry insights",
  ];

  return (
    <div className="min-h-screen bg-navy-gradient flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="order-2 md:order-1">
            <h1 className="text-4xl font-bold text-gray-100 mb-4">
              Join the Elite 1%
            </h1>
            <p className="text-lg text-gray-400 mb-8">
              Transform your trucking career with proven strategies and
              dedicated support.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center space-x-8">
              <div>
                <p className="text-3xl font-bold text-orange-500">500+</p>
                <p className="text-sm text-gray-400">Active Members</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-500">87%</p>
                <p className="text-sm text-gray-400">Success Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-500">4.9</p>
                <p className="text-sm text-gray-400">Rating</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="order-1 md:order-2">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">
                Create Your Account
              </h2>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      First Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Last Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Min. 6 characters"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-2xl font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Start Your Journey
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-orange-500 hover:text-orange-400 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            © 2025{" "}
            <a
              href="https://letstrucktribe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              Letstrucktribe.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
