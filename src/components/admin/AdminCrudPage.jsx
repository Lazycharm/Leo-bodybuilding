import { useState } from "react";
import { useLanguage } from "../../lib/i18n";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Plus, Save, Search, Trash2, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uploadImageFile } from "@/lib/supabaseClient";

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
  const [uploadingField, setUploadingField] = useState("");

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

  const updateFormField = (fieldName, value) => {
    setForm((current) => ({ ...current, [fieldName]: value }));
  };

  const openCreate = () => {
    setEditItem(null);
    setForm({ ...defaultValues });
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

      await queryClient.invalidateQueries({ queryKey: [queryKey] });
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
      await queryClient.invalidateQueries({ queryKey: [queryKey] });
    } catch (error) {
      toast({
        title: lang === "ar" ? "تعذر الحذف" : "Unable to delete",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (field, files) => {
    const selectedFile = files?.[0];

    if (!selectedFile) {
      return;
    }

    setUploadingField(field.field);

    try {
      const uploadedUrl = await uploadImageFile(selectedFile, `${entityName.toLowerCase()}/${field.field}`);
      updateFormField(field.field, uploadedUrl);
      toast({ title: lang === "ar" ? "تم رفع الصورة" : "Image uploaded" });
    } catch (error) {
      toast({
        title: lang === "ar" ? "تعذر رفع الصورة" : "Unable to upload image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingField("");
    }
  };

  const renderField = (field) => {
    const val = form[field.field];
    const onChange = (value) => updateFormField(field.field, value);
    const inputClassName = "w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:border-primary focus:outline-none";
    const isImageField =
      field.type === "image" || (/image|photo/i.test(field.label || "") && /_url$/i.test(field.field));

    if (field.type === "select") {
      return (
        <select value={val || ""} onChange={(e) => onChange(e.target.value)} className={inputClassName}>
          <option value="">{lang === "ar" ? "اختر" : "Select"}</option>
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
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

    if (isImageField) {
      return (
        <div className="space-y-3">
          <input type="url" value={val || ""} onChange={(e) => onChange(e.target.value)} className={inputClassName} placeholder={field.label} />
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              {uploadingField === field.field ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              <span>{uploadingField === field.field ? (lang === "ar" ? "جارٍ الرفع..." : "Uploading...") : (lang === "ar" ? "رفع صورة" : "Upload image")}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  handleImageUpload(field, event.target.files);
                  event.target.value = "";
                }}
              />
            </label>
            <span className="text-xs text-muted-foreground">
              {lang === "ar" ? "يمكنك لصق رابط أو رفع صورة مباشرة." : "You can paste a URL or upload a file directly."}
            </span>
          </div>
          {val ? (
            <div className="overflow-hidden rounded-lg border border-border bg-background p-1">
              <img src={val} alt={field.label} className="h-28 w-full rounded-md object-cover" />
            </div>
          ) : null}
        </div>
      );
    }

    if (field.type === "textarea") {
      return <textarea value={val || ""} onChange={(e) => onChange(e.target.value)} rows={3} className={`${inputClassName} resize-none`} placeholder={field.label} />;
    }

    if (field.type === "number") {
      return <input type="number" value={val ?? ""} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} className={inputClassName} placeholder={field.label} />;
    }

    if (field.type === "array") {
      return <input type="text" value={Array.isArray(val) ? val.join(", ") : val || ""} onChange={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} className={inputClassName} placeholder={`${field.label} (comma separated)`} />;
    }

    return <input type={field.type || "text"} value={val || ""} onChange={(e) => onChange(e.target.value)} className={inputClassName} placeholder={field.label} />;
  };

  return (
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-heading font-black text-foreground">{title}</h1>
        <Button onClick={openCreate} className="bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90">
          <Plus className="me-2 h-4 w-4" />
          {t("common.create")}
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("common.search")}
          className="w-full rounded-lg border border-border bg-card py-2.5 pe-4 ps-10 text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {columns.map((col) => (
                  <th key={col.field} className="px-4 py-3 text-start text-xs font-medium tracking-wider text-muted-foreground">
                    {col.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-start text-xs font-medium tracking-wider text-muted-foreground">{t("common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                    {t("common.loading")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-muted-foreground">
                    {t("common.no_data")}
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-muted/30">
                    {columns.map((col) => (
                      <td key={col.field} className="px-4 py-3 text-foreground">
                        {col.render ? col.render(item[col.field], item) : String(item[col.field] ?? "")}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(item)} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-auto border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-heading text-foreground">
              {editItem ? t("common.edit") : t("common.create")} {title}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            {formFields.map((field) => (
              <div key={field.field}>
                {field.type !== "boolean" && (
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</label>
                )}
                {renderField(field)}
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary font-bold text-primary-foreground hover:bg-primary/90">
              <Save className="me-2 h-4 w-4" />
              {saving ? t("common.loading") : t("common.save")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}