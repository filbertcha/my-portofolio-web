import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { resolveAssetUrl } from '../../utils/format.js';
import { Button } from './Button.jsx';

export function ImageUploadField({ value, onChange, label = 'Image', hint, error }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const preview = resolveAssetUrl(value);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setMessage(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const data = await api.upload('/admin/uploads', formData);
      onChange(data.url);
    } catch (uploadError) {
      setMessage(uploadError.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-900">
          {preview ? (
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-700">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {value ? 'Replace' : 'Upload image'}
            </Button>
            {value ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(null)}
                disabled={uploading}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </Button>
            ) : null}
          </div>
          <p className="text-[11px] text-zinc-600">
            {hint ?? 'JPEG, PNG, WebP, or GIF — up to 5 MB.'}
          </p>
          {message ? <p className="text-xs text-rose-300">{message}</p> : null}
          {error ? <p className="text-xs text-rose-300">{error}</p> : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
