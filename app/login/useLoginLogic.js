"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function useLoginLogic() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      const user = data.user;
      if (!user) throw new Error("Login failed: no user");

      // ✅ Fetch role
      const { data: profile, error: profileError } = await supabase
        .from("profiles_new")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile?.role) throw new Error("User role not found");

      // Redirect
      router.push(profile.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    error,
    loading,
    showPassword,
    setShowPassword,
    setError,
    handleChange,
    handleLogin,
    router,
  };
}
