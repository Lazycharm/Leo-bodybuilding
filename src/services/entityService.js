import { ensureSupabaseConfigured, supabase } from "@/lib/supabaseClient";

const fieldAliases = {
  created_date: "created_at",
  updated_date: "updated_at",
};

function normalizeFieldName(fieldName) {
  return fieldAliases[fieldName] || fieldName;
}

function normalizeRecord(record) {
  if (!record) return record;

  return {
    ...record,
    created_date: record.created_date ?? record.created_at ?? null,
    updated_date: record.updated_date ?? record.updated_at ?? null,
  };
}

function applyFilters(query, filters = {}) {
  return Object.entries(filters).reduce((currentQuery, [key, value]) => {
    if (value === undefined || value === null || value === "") {
      return currentQuery;
    }

    const column = normalizeFieldName(key);

    if (Array.isArray(value)) {
      return currentQuery.in(column, value);
    }

    return currentQuery.eq(column, value);
  }, query);
}

function getSortConfig(sortField = "-created_at") {
  const fallback = "created_at";
  const value = String(sortField || fallback).trim();
  const descending = value.startsWith("-");
  const cleanField = value.replace(/^-/, "") || fallback;

  return {
    column: normalizeFieldName(cleanField),
    ascending: !descending,
  };
}

export function createEntityService(tableName, options = {}) {
  const selectClause = options.select || "*";

  return {
    async list(sortField = "-created_at", limit = 100) {
      if (!supabase) return [];

      const { column, ascending } = getSortConfig(sortField);
      let query = supabase.from(tableName).select(selectClause);

      if (column) {
        query = query.order(column, { ascending });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map(normalizeRecord);
    },

    async filter(filters = {}, sortField = "-created_at", limit = 100) {
      if (!supabase) return [];

      const { column, ascending } = getSortConfig(sortField);
      let query = supabase.from(tableName).select(selectClause);

      query = applyFilters(query, filters);

      if (column) {
        query = query.order(column, { ascending });
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map(normalizeRecord);
    },

    async get(id) {
      if (!supabase) return null;

      const { data, error } = await supabase
        .from(tableName)
        .select(selectClause)
        .eq("id", id)
        .single();

      if (error) throw error;
      return normalizeRecord(data);
    },

    async create(values) {
      ensureSupabaseConfigured();

      const { data, error } = await supabase
        .from(tableName)
        .insert(values)
        .select(selectClause)
        .single();

      if (error) throw error;
      return normalizeRecord(data);
    },

    async update(id, values) {
      ensureSupabaseConfigured();

      const { data, error } = await supabase
        .from(tableName)
        .update(values)
        .eq("id", id)
        .select(selectClause)
        .single();

      if (error) throw error;
      return normalizeRecord(data);
    },

    async delete(id) {
      ensureSupabaseConfigured();

      const { error } = await supabase.from(tableName).delete().eq("id", id);

      if (error) throw error;
      return true;
    },
  };
}

export { normalizeRecord };
