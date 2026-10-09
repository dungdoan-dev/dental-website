"use client";

import { Editor } from "@tinymce/tinymce-react";

export function TinyMceEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key"}
      cloudChannel="8"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 480,
        min_height: 320,
        max_height: 760,
        menubar: false,
        plugins: ["lists", "link", "table", "image", "code", "autoresize", "wordcount"],
        toolbar: "undo redo | blocks | bold italic underline | alignleft aligncenter alignright | bullist numlist | blockquote | link image table | removeformat | code",
        block_formats: "Đoạn văn=p; Tiêu đề 2=h2; Tiêu đề 3=h3; Tiêu đề 4=h4",
        statusbar: true,
        promotion: false,
        branding: false,
        content_style: "body { font-family: Arial, sans-serif; font-size: 15px; line-height: 1.75; color: #334155; padding: 8px 16px; } h2 { color: #123e5a; } h3 { color: #123e5a; }",
        link_default_target: "_blank",
        link_assume_external_targets: true,
        table_default_attributes: { border: "1" },
        automatic_uploads: true,
        images_upload_handler: async (blobInfo: { blob: () => Blob; filename: () => string }, progress: (percent: number) => void) => {
          const body = new FormData();
          body.append("file", blobInfo.blob(), blobInfo.filename());
          progress(0);
          const response = await fetch("/api/admin/upload", { method: "POST", body });
          const result = await response.json() as { path?: string; error?: string };
          if (!response.ok || !result.path) throw new Error(result.error || "Không thể tải ảnh lên.");
          progress(100);
          return result.path;
        },
      }}
    />
  );
}
