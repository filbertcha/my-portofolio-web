import { useEffect, useState } from 'react';
import { ExternalLink, Save } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useResource } from '../../hooks/useResource.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field, Input } from '../../components/ui/Field.jsx';
import { SocialLinks } from '../../components/common/SocialLinks.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { ErrorState } from '../../components/common/ErrorState.jsx';

const blankContact = {
  email: '',
  phone: '',
  github_url: '',
  linkedin_url: '',
  website_url: '',
  location: '',
};

export function ContactPage() {
  const { data, loading, error, reload } = useResource(() => api.get('/admin/contacts'), []);
  const toast = useToast();

  const [form, setForm] = useState(blankContact);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = 'Contact — Admin';
  }, []);

  useEffect(() => {
    if (data) {
      setForm({
        email: data.email ?? '',
        phone: data.phone ?? '',
        github_url: data.github_url ?? '',
        linkedin_url: data.linkedin_url ?? '',
        website_url: data.website_url ?? '',
        location: data.location ?? '',
      });
    }
  }, [data]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrors({ email: 'Enter a valid email address' });
      return;
    }
    setErrors({});

    setSaving(true);
    try {
      await api.put('/admin/contacts', {
        email: form.email,
        phone: form.phone,
        github_url: form.github_url,
        linkedin_url: form.linkedin_url,
        website_url: form.website_url,
        location: form.location,
      });
      toast.success('Contact information updated successfully.');
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
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState title="Contact information could not be loaded" message={error.message} onRetry={reload} />
    );
  }

  return (
    <div>
      <PageHeader
        title="Contact"
        description="Public contact details and social links shown on your portfolio."
      >
        <Button type="submit" form="contact-form" loading={saving}>
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
        id="contact-form"
        onSubmit={handleSubmit}
        className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]"
      >
        <section className="admin-card p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-zinc-200">Contact details</h2>
          <p className="mt-0.5 text-xs text-zinc-600">
            Leave any field empty to hide it from the public contact section.
          </p>

          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" htmlFor="email" error={errors.email}>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => update('email', event.target.value)}
                  placeholder="hello@example.com"
                  invalid={Boolean(errors.email)}
                />
              </Field>
              <Field label="Phone" htmlFor="phone" error={errors.phone}>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(event) => update('phone', event.target.value)}
                  placeholder="+62 812 3456 7890"
                  invalid={Boolean(errors.phone)}
                />
              </Field>
            </div>

            <Field label="Location" htmlFor="contact_location" error={errors.location}>
              <Input
                id="contact_location"
                value={form.location}
                onChange={(event) => update('location', event.target.value)}
                placeholder="Jakarta, Indonesia"
                invalid={Boolean(errors.location)}
              />
            </Field>

            <div className="h-px bg-white/[0.06]" />

            <Field label="GitHub URL" htmlFor="github_url" error={errors.github_url}>
              <Input
                id="github_url"
                type="url"
                value={form.github_url}
                onChange={(event) => update('github_url', event.target.value)}
                placeholder="https://github.com/username"
                invalid={Boolean(errors.github_url)}
              />
            </Field>

            <Field label="LinkedIn URL" htmlFor="linkedin_url" error={errors.linkedin_url}>
              <Input
                id="linkedin_url"
                type="url"
                value={form.linkedin_url}
                onChange={(event) => update('linkedin_url', event.target.value)}
                placeholder="https://www.linkedin.com/in/username"
                invalid={Boolean(errors.linkedin_url)}
              />
            </Field>

            <Field
              label="Other professional link"
              htmlFor="website_url"
              error={errors.website_url}
              hint="A personal site, portfolio, or any other link you want to share."
            >
              <Input
                id="website_url"
                type="url"
                value={form.website_url}
                onChange={(event) => update('website_url', event.target.value)}
                placeholder="https://example.com"
                invalid={Boolean(errors.website_url)}
              />
            </Field>
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit" loading={saving}>
              <Save className="h-4 w-4" aria-hidden="true" />
              Save changes
            </Button>
          </div>
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="admin-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              Public links
            </p>
            {form.email || form.github_url || form.linkedin_url || form.website_url || form.phone ? (
              <div className="mt-4">
                <SocialLinks contact={form} />
                {form.email ? (
                  <p className="mt-4 truncate text-xs text-zinc-400">{form.email}</p>
                ) : null}
                {form.location ? (
                  <p className="mt-1 text-xs text-zinc-600">{form.location}</p>
                ) : null}
              </div>
            ) : (
              <p className="mt-3 text-xs leading-relaxed text-zinc-600">
                Add at least one contact detail to show a link on the public site.
              </p>
            )}
          </div>

          <div className="admin-card p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              Tip
            </p>
            <p className="mt-3 flex gap-2 text-[11px] leading-relaxed text-zinc-600">
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Only complete, valid links are shown to visitors. Empty fields are skipped instead of
              rendering broken buttons.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
