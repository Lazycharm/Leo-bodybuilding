import React, { createContext, useContext, useEffect, useState } from "react";
import { ensureProfile } from "@/api/appClient";
import { ensureSupabaseConfigured, isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({
    authProvider: "supabase",
    configured: isSupabaseConfigured,
  });

  useEffect(() => {
    checkAppState();

    if (!supabase) {
      return undefined;
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        return;
      }

      try {
        const profile = await ensureProfile(session.user);
        setUser(profile);
        setIsAuthenticated(true);
        setAuthError(null);
      } catch (error) {
        setAuthError({
          type: "auth_error",
          message: error.message || "Unable to load your account.",
        });
      } finally {
        setIsLoadingAuth(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const checkAppState = async () => {
    setIsLoadingPublicSettings(true);
    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      setAppPublicSettings({
        authProvider: "supabase",
        configured: isSupabaseConfigured,
      });

      if (!supabase) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      if (!session?.user) {
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      const profile = await ensureProfile(session.user);
      setUser(profile);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError({
        type: "auth_error",
        message: error.message || "Unable to initialize authentication.",
      });
    } finally {
      setIsLoadingPublicSettings(false);
      setIsLoadingAuth(false);
    }
  };

  const signIn = async ({ email, password }) => {
    ensureSupabaseConfigured();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const profile = await ensureProfile(authUser);
    setUser(profile);
    setIsAuthenticated(true);
    setAuthError(null);

    return profile;
  };

  const signUp = async ({ email, password, fullName }) => {
    ensureSupabaseConfigured();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "member",
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data?.session?.user) {
      await ensureProfile(data.session.user);
    }

    return data;
  };

  const resetPassword = async (email) => {
    ensureSupabaseConfigured();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });

    if (error) {
      throw error;
    }
  };

  const logout = async (shouldRedirect = true) => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setUser(null);
    setIsAuthenticated(false);

    if (shouldRedirect) {
      window.location.assign("/");
    }
  };

  const navigateToLogin = (redirectTo = `${window.location.pathname}${window.location.search}`) => {
    const nextUrl = new URL("/auth", window.location.origin);
    if (redirectTo) {
      nextUrl.searchParams.set("redirectTo", redirectTo);
    }
    window.location.assign(nextUrl.toString());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
        signIn,
        signUp,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
