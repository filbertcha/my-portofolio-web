import { useEffect, useState } from 'react';
import { MapPin, Save } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useResource } from '../../hooks/useResource.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field, Input, Textarea } from '../../components/ui/Field.jsx';
import { ImageUploadField } from '../../components/ui/ImageUploadField.jsx';
import { ProfileAvatar } from '../../components/common/ProfileAvatar.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { ErrorState } from '../../components/common/ErrorState.jsx';

const blankProfile = {
  full_name: '',
  headline: '',
  about: '',
  profile_image: null,
  location: '',
};

export function ProfilePage() {
  const { data, loading, error, reload } = useResource(() => api.get('/admin/profile'), []);
  const toast = useToast();

  const [form, setForm] = useState(blankProfile);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = 'Profile — Admin';
  }, []);

  useEffect(() => {
    if (data) {
      setForm({
        full_name: data.full_name ?? '',
        headline: data.headline ?? '',
        about: data.about ?? '',
        profile_image: data.profile_image ?? null,
        location: data.location ?? '',
      });
    }
  }, [data]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!form.full_name.trim()) {
      setErrors({ full_name: 'Full name is required' });
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      await api.put('/admin/profile', {
        full_name: form.full_name,
        headline: form.headline,
        about: form.about,
        profile_image: form.profile_image,
        location: form.location,
      });
      toast.success('Profile updated successfully.');
      reload();
    } catch (saveError) {
      setFormError(saveError.message);
      setErrors(saveError.errors || {});
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-16 w-64" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Profile could not be loaded" message={error.message} onRetry={reload} />;
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="The name, headline, and introduction shown on your homepage."
      >
        <Button type="submit" form="profile-form" loading={saving}>
          <Save className="h-4 w-4" aria-hidden="true" />
          Save changes
        </Button>
      </PageHeader>

      {formError ? (
        <div
          className="mb-5 rounded-xl border border-rose-400/20 bg-rose-500/[0.07] px-4 py-3 text-sm text-rose-200"
          role="alert"
        >
          {formError}
        </div>
      ) : null}

      <form
        id="profile-form"
        onSubmit={handleSubmit}
        className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]"
      >
        <div className="space-y-5">
          <section className="admin-card p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-zinc-200">Basic information</h2>
            <p className="mt-0.5 text-xs text-zinc-600">
              This is the first thing visitors see when they open your site.
            </p>

            <div className="mt-5">
              <ImageUploadField
                label="Profile photo"
                value={form.profile_image}
                onChange={(value) => update('profile_image', value)}
                hint="A square portrait works best. JPEG, PNG, WebP, or GIF — up to 5 MB."
                error={errors.profile_image}
              />
            </div>

            <div className="mt-5 space-y-4">
              <Field label="Full name" htmlFor="full_name" required error={errors.full_name}>
                <Input
                  id="full_name"
                  value={form.full_name}
                  onChange={(event) => update('full_name', event.target.value)}
                  placeholder="Your full name"
                  invalid={Boolean(errors.full_name)}
                  maxLength={150}
                />
              </Field>

              <Field label="Headline" htmlFor="headline" error={errors.headline} hint="A short professional title, e.g. Full-Stack Developer.">
                <Input
                  id="headline"
                  value={form.headline}
                  onChange={(event) => update('headline', event.target.value)}
                  placeholder="Full-Stack Developer · Backend & Database Enthusiast"
                  invalid={Boolean(errors.headline)}
                  maxLength={255}
                />
              </Field>

              <Field label="Location" htmlFor="profile_location" error={errors.location}>
                <Input
                  id="profile_location"
                  value={form.location}
                  onChange={(event) => update('location', event.target.value)}
                  placeholder="Jakarta, Indonesia"
                  invalid={Boolean(errors.location)}
                  maxLength={150}
                />
              </Field>
            </div>
          </section>

          <section className="admin-card p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-zinc-200">About me</h2>
            <p className="mt-0.5 text-xs text-zinc-600">
              A short introduction for the About section. Separate paragraphs with a blank line.
            </p>
            <Field className="mt-5" htmlFor="about" error={errors.about}>
              <Textarea
                id="about"
                rows={10}
                value={form.about}
                onChange={(event) => update('about', event.target.value)}
                placeholder="Tell visitors who you are, what you work on, and what you care about."
                invalid={Boolean(errors.about)}
              />
            </Field>
          </section>

          <div className="flex justify-end">
            <Button type="submit" loading={saving}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save changes
            </Button>
          </div>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="admin-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              Live preview
            </p>
            <div className="mt-5 flex flex-col items-center text-center">
              <ProfileAvatar
                profile={form}
                className="h-24 w-24"
                textClassName="text-2xl"
              />
              <p className="mt-4 text-base font-semibold text-zinc-100">
                {form.full_name || 'Your Name'}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                {form.headline || 'Your professional headline'}
              </p>
              {form.location ? (
                <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                  <MapPin className="h-3 w-3" aria-hidden="true" />
                  {form.location}
                </p>
              ) : null}
            </div>

            <div className="mt-5 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
              <p className="text-[11px] leading-relaxed text-zinc-600">
                Changes are saved to PostgreSQL and appear on the public website after you save.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
