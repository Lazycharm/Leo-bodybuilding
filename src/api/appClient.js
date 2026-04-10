import { supabase, ensureSupabaseConfigured } from "@/lib/supabaseClient";
import { createEntityService, normalizeRecord } from "@/services/entityService";

const entityTableMap = {
  Announcement: "announcements",
  Booking: "bookings",
  ClassSchedule: "class_schedules",
  GalleryItem: "gallery_items",
  HealthProgram: "health_programs",
  Inquiry: "inquiries",
  Membership: "memberships",
  MembershipPlan: "membership_plans",
  Program: "programs",
  Testimonial: "testimonials",
  Trainer: "trainers",
  User: "profiles",
};

function getDisplayNameFromAuthUser(authUser) {
  return (
    authUser?.user_metadata?.full_name ||
    authUser?.user_metadata?.name ||
    authUser?.email?.split("@")[0] ||
    "Member"
  );
}

function normalizeUserProfile(profile, authUser) {
  return normalizeRecord({
    id: profile?.id || authUser?.id,
    email: profile?.email || authUser?.email || "",
    full_name: profile?.full_name || getDisplayNameFromAuthUser(authUser),
    phone: profile?.phone || authUser?.phone || null,
    role: profile?.role || authUser?.user_metadata?.role || "member",
    avatar_url: profile?.avatar_url || authUser?.user_metadata?.avatar_url || null,
    created_at: profile?.created_at || authUser?.created_at || null,
    updated_at: profile?.updated_at || profile?.created_at || authUser?.updated_at || null,
  });
}

export async function ensureProfile(authUser) {
  if (!supabase || !authUser) {
    return null;
  }

  const { data: existingProfile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (existingProfile) {
    return normalizeUserProfile(existingProfile, authUser);
  }

  const profilePayload = {
    id: authUser.id,
    email: authUser.email || "",
    full_name: getDisplayNameFromAuthUser(authUser),
    role: authUser?.user_metadata?.role || "member",
    phone: authUser?.user_metadata?.phone || null,
    avatar_url: authUser?.user_metadata?.avatar_url || null,
  };

  const { data: insertedProfile, error: insertError } = await supabase
    .from("profiles")
    .insert(profilePayload)
    .select("*")
    .single();

  if (insertError) {
    throw insertError;
  }

  return normalizeUserProfile(insertedProfile, authUser);
}

export const entities = Object.fromEntries(
  Object.entries(entityTableMap).map(([entityName, tableName]) => [
    entityName,
    createEntityService(tableName),
  ]),
);

export const appClient = {
  auth: {
    async me() {
      ensureSupabaseConfigured();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (!user) {
        throw Object.assign(new Error("Authentication required"), { status: 401 });
      }

      return ensureProfile(user);
    },

    async logout(redirectTo = "/") {
      if (supabase) {
        await supabase.auth.signOut();
      }

      if (redirectTo) {
        window.location.assign(redirectTo);
      }
    },

    redirectToLogin(fromUrl = `${window.location.pathname}${window.location.search}`) {
      const url = new URL("/auth", window.location.origin);
      if (fromUrl) {
        url.searchParams.set("redirectTo", fromUrl);
      }
      window.location.assign(url.toString());
    },
  },

  entities,
};
