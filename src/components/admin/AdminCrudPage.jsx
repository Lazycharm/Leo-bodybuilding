import { useState } from "react";
import { useLanguage } from "../../lib/i18n";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Search, Pencil, Trash2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminCrudPage({
  title,
  entityName,
  entity,
  queryKey,
  columns,
  formFields,
  defaultValues = {},
  filterFn = null,
  sortField = "-created_at",
}) {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(defaultValues);
  const [saving, setSaving] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: filterFn || (() => entity.list(sortField, 100)),
  });

  const filtered = items.filter((item) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return columns.some((col) => {
      const val = item[col.field];
      return val && String(val).toLowerCase().includes(searchLower);
    });
  });

  const openCreate = () => {
    setEditItem(null);
    setForm(defaultValues);
    setDialogOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    const formData = {};
    formFields.forEach((f) => {
      formData[f.field] = item[f.field] ?? (f.type === "boolean" ? false : f.type === "array" ? [] : "");
    });
    setForm(formData);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      if (editItem) {
        await entity.update(editItem.id, form);
        toast({ title: lang === "ar" ? "تم التحديث" : "Updated!" });
      } else {
        await entity.create(form);
        toast({ title: lang === "ar" ? "تم الإنشاء" : "Created!" });
      }

      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: lang === "ar" ? "تعذر الحفظ" : "Unable to save",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t("common.confirm_delete"))) return;

    try {
      await entity.delete(id);
      toast({ title: lang === "ar" ? "تم الحذف" : "Deleted!" });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    } catch (error) {
      toast({
        title: lang === "ar" ? "تعذر الحذف" : "Unable to delete",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const renderField = (field) => {
    const val = form[field.field];
    const onChange = (v) => setForm({ ...form, [field.field]: v });

    if (field.type === "select") {
      return (
        <select value={val || ""} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none">
          <option value="">{lang === "ar" ? "اختر" : "Select"}</option>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    }
    if (field.type === "boolean") {
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!val} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded border-border accent-primary" />
          <span className="text-sm text-foreground">{field.label}</span>
        </label>
      );
    }
    if (field.type === "textarea") {
      return <textarea value={val || ""} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none resize-none" placeholder={field.label} />;
    }
    if (field.type === "number") {
      return <input type="number" value={val || ""} onChange={(e) => onChange(Number(e.target.value))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none" placeholder={field.label} />;
    }
    if (field.type === "array") {
      return <input type="text" value={Array.isArray(val) ? val.join(", ") : val || ""} onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none" placeholder={`${field.label} (comma separated)`} />;
    }
    return <input type={field.type || "text"} value={val || ""} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none" placeholder={field.label} />;
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-heading font-black text-foreground">{title}</h1>
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm">
          <Plus className="w-4 h-4 me-2" />
          {t("common.create")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("common.search")}
          className="w-full ps-10 pe-4 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((col) => (
                  <th key={col.field} className="text-start px-4 py-3 text-muted-foreground font-medium text-xs tracking-wider">
                    {col.label}
                  </th>
                ))}
                <th className="text-start px-4 py-3 text-muted-foreground font-medium text-xs tracking-wider">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">{t("common.loading")}</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">{t("common.no_data")}</td></tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    {columns.map((col) => (
                      <td key={col.field} className="px-4 py-3 text-foreground">
                        {col.render ? col.render(item[col.field], item) : String(item[col.field] ?? "")}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground font-heading">
              {editItem ? t("common.edit") : t("common.create")} {title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {formFields.map((field) => (
              <div key={field.field}>
                {field.type !== "boolean" && (
                  <label className="block text-xs font-medium text-muted-foreground mb-1">{field.label}</label>
                )}
                {renderField(field)}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{t("common.cancel")}</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              <Save className="w-4 h-4 me-2" />
              {saving ? t("common.loading") : t("common.save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}