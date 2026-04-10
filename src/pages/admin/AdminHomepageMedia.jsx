import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Save, UploadCloud } from "lucide-react";
import { entities } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useHomepageMedia } from "@/hooks/useHomepageMedia";
import { useLanguage } from "@/lib/i18n";
import { uploadImageFile } from "@/lib/supabaseClient";

const defaultForm = {
  hero_image_url: "",
  gents_image_url: "",
  ladies_image_url: "",
  male_trainer_image_url: "",
  female_trainer_image_url: "",
  gallery_preview_images: [],
};

function HomepageImageField({
  label,
  value,
  onChange,
  onUpload,
  uploading,
  lang,
  placeholder = "https://...",
}) {
  const inputClassName = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <input type="url" value={value} onChange={(event) => onChange(event.target.value)} className={inputClassName} placeholder={placeholder} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          <span>{uploading ? (lang === "ar" ? "جارٍ الرفع..." : "Uploading...") : (lang === "ar" ? "رفع صورة" : "Upload image")}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              onUpload(event.target.files);
              event.target.value = "";
            }}
          />
        </label>

        <span className="text-xs text-muted-foreground">
          {lang === "ar" ? "ألصق رابطًا أو ارفع صورة مباشرة إلى التخزين." : "Paste a URL or upload directly to storage."}
        </span>
      </div>

      {value ? (
        <div className="overflow-hidden rounded-xl border border-border bg-background p-1">
          <img src={value} alt={label} className="h-28 w-full rounded-lg object-cover" />
        </div>
      ) : null}
    </div>
  );
}

export default function AdminHomepageMedia() {
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: homepageMedia, isLoading } = useHomepageMedia();
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState("");

  useEffect(() => {
    if (homepageMedia) {
      setForm({
        hero_image_url: homepageMedia.hero_image_url || "",
        gents_image_url: homepageMedia.gents_image_url || "",
        ladies_image_url: homepageMedia.ladies_image_url || "",
        male_trainer_image_url: homepageMedia.male_trainer_image_url || "",
        female_trainer_image_url: homepageMedia.female_trainer_image_url || "",
        gallery_preview_images: homepageMedia.gallery_preview_images || [],
      });
    }
  }, [homepageMedia]);

  const previewImages = useMemo(
    () => [
      form.hero_image_url,
      form.gents_image_url,
      form.ladies_image_url,
      form.male_trainer_image_url,
      form.female_trainer_image_url,
      ...(form.gallery_preview_images || []),
    ].filter(Boolean),
    [form],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleFileUpload = async (field, files, options = {}) => {
    const selectedFiles = Array.from(files || []);

    if (!selectedFiles.length) {
      return;
    }

    setUploadingField(field);

    try {
      const uploadedUrls = await Promise.all(
        selectedFiles.map((file, index) => uploadImageFile(file, `homepage-media/${field}-${index + 1}`)),
      );

      setForm((current) => ({
        ...current,
        [field]: options.multiple
          ? Array.from(new Set([...(current[field] || []), ...uploadedUrls]))
          : uploadedUrls[0],
      }));

      toast({
        title: lang === "ar" ? "تم رفع الصورة" : "Image uploaded",
        description: options.multiple
          ? lang === "ar"
            ? `تمت إضافة ${uploadedUrls.length} صورة.`
            : `${uploadedUrls.length} image(s) added.`
          : undefined,
      });
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

  const handleSave = async () => {
    setSaving(true);

    try {
      const payload = {
        setting_key: "homepage_media",
        ...form,
      };

      if (homepageMedia?.id) {
        await entities.SiteSetting.update(homepageMedia.id, payload);
      } else {
        await entities.SiteSetting.create(payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["homepage-media"] });
      toast({ title: lang === "ar" ? "تم حفظ صور الصفحة الرئيسية" : "Homepage images saved" });
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

  const inputClassName = "w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-black text-foreground">{t("admin.homepage_media")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {lang === "ar"
              ? "غيّر صور الهيرو وأقسام السيدات والرجال وصور المعاينة الافتراضية للصفحة الرئيسية عبر الرابط أو الرفع المباشر."
              : "Update homepage images by pasting a URL or uploading directly from your device."}
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-primary font-bold text-primary-foreground hover:bg-primary/90">
          <Save className="me-2 h-4 w-4" />
          {saving ? t("common.loading") : t("common.save")}
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
        {lang === "ar"
          ? "ملاحظة: يمكنك الآن رفع الصور مباشرة. كما أن صور المدربين والمعرض يمكن تعديلها من صفحات الإدارة الخاصة بهم مع نفس خيار الرفع."
          : "Note: you can now upload images directly here. Trainer and gallery admin pages also support direct uploads."}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <HomepageImageField
          label="Hero Image"
          value={form.hero_image_url}
          onChange={(value) => updateField("hero_image_url", value)}
          onUpload={(files) => handleFileUpload("hero_image_url", files)}
          uploading={uploadingField === "hero_image_url"}
          lang={lang}
        />

        <HomepageImageField
          label="Men's Section Image"
          value={form.gents_image_url}
          onChange={(value) => updateField("gents_image_url", value)}
          onUpload={(files) => handleFileUpload("gents_image_url", files)}
          uploading={uploadingField === "gents_image_url"}
          lang={lang}
        />

        <HomepageImageField
          label="Women's Section Image"
          value={form.ladies_image_url}
          onChange={(value) => updateField("ladies_image_url", value)}
          onUpload={(files) => handleFileUpload("ladies_image_url", files)}
          uploading={uploadingField === "ladies_image_url"}
          lang={lang}
        />

        <HomepageImageField
          label="Fallback Male Trainer Image"
          value={form.male_trainer_image_url}
          onChange={(value) => updateField("male_trainer_image_url", value)}
          onUpload={(files) => handleFileUpload("male_trainer_image_url", files)}
          uploading={uploadingField === "male_trainer_image_url"}
          lang={lang}
        />

        <div className="md:col-span-2">
          <HomepageImageField
            label="Fallback Female Trainer Image"
            value={form.female_trainer_image_url}
            onChange={(value) => updateField("female_trainer_image_url", value)}
            onUpload={(files) => handleFileUpload("female_trainer_image_url", files)}
            uploading={uploadingField === "female_trainer_image_url"}
            lang={lang}
          />
        </div>

        <div className="space-y-3 md:col-span-2">
          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Gallery Preview Image URLs</span>
            <textarea
              value={(form.gallery_preview_images || []).join(", ")}
              onChange={(event) => updateField("gallery_preview_images", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))}
              className={`${inputClassName} min-h-28 resize-y`}
              placeholder="https://image-1, https://image-2, https://image-3"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
              {uploadingField === "gallery_preview_images" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
              <span>{uploadingField === "gallery_preview_images" ? (lang === "ar" ? "جارٍ الرفع..." : "Uploading...") : (lang === "ar" ? "رفع صور المعرض" : "Upload gallery images")}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  handleFileUpload("gallery_preview_images", event.target.files, { multiple: true });
                  event.target.value = "";
                }}
              />
            </label>

            <span className="text-xs text-muted-foreground">
              {lang === "ar" ? "يمكنك رفع أكثر من صورة وسيتم إضافتها تلقائياً إلى المعرض." : "Upload one or more images and they will be added to the gallery preview list."}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2 text-foreground">
          <ImagePlus className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-lg font-bold">{lang === "ar" ? "معاينة الصور" : "Image preview"}</h2>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
        ) : previewImages.length === 0 ? (
          <p className="text-sm text-muted-foreground">{lang === "ar" ? "أضف روابط أو ارفع صوراً لرؤية المعاينة هنا." : "Add URLs or upload images to preview them here."}</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {previewImages.map((url, index) => (
              <div key={`${url}-${index}`} className="overflow-hidden rounded-xl border border-border bg-background">
                <img src={url} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
