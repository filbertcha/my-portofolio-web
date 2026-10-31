import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Info, Save } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useResource } from '../../hooks/useResource.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Field, Input, Switch, Textarea } from '../../components/ui/Field.jsx';
import { ImageUploadField } from '../../components/ui/ImageUploadField.jsx';
import { TechnologyInput } from '../../components/admin/TechnologyInput.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';
import { ErrorState } from '../../components/common/ErrorState.jsx';
import { slugify } from '../../utils/format.js';
import { projectPayload } from '../../utils/payloads.js';

const emptyProject = {
  title: '',
  slug: '',
  short_description: '',
  description: '',
  image_url: null,
  github_url: '',
  demo_url: '',
  technologies: [],
  is_featured: false,
  is_published: false,
  sort_order: 0,
  start_date: '',
  end_date: '',
};

export function ProjectFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const { data, loading, error, reload } = useResource(
    () =>
      Promise.all([
        isEdit ? api.get(`/admin/projects/${id}`) : Promise.resolve(null),
        api.get('/admin/technologies'),
      ]),
    [id],
  );

  const [form, setForm] = useState(emptyProject);
  const [suggestions, setSuggestions] = useState([]);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.title = isEdit ? 'Edit project — Admin' : 'New project — Admin';
  }, [isEdit]);

  useEffect(() => {
    if (!data) return;
    const [project, technologies] = data;
    setSuggestions(technologies ?? []);

    if (project) {
      setForm({
        ...emptyProject,
        ...project,
        github_url: project.github_url ?? '',
        demo_url: project.demo_url ?? '',
        description: project.description ?? '',
        start_date: project.start_date ?? '',
        end_date: project.end_date ?? '',
        technologies: (project.technologies ?? []).map((technology) => technology.name),
      });
      setSlugTouched(true);
    }
  }, [data]);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleTitleChange = (value) => {
    setForm((current) => ({
      ...current,
      title: value,
      slug: slugTouched ? current.slug : slugify(value),
    }));
  };

  const validate = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Title is required';
    if (!form.short_description.trim()) {
      errors.short_description = 'A short description is required';
    }
    if (form.technologies.length === 0) {
      errors.technologies = 'Add at least one technology';
    }
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      errors.end_date = 'End date cannot be before start date';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSaving(true);
    try {
      const payload = projectPayload(form);
      if (isEdit) {
        await api.put(`/admin/projects/${id}`, payload);
        toast.success('Project updated successfully.');
      } else {
        await api.post('/admin/projects', payload);
        toast.success('Project created successfully.');
      }
      navigate('/admin/projects');
    } catch (saveError) {
      setFormError(saveError.message);
      setFieldErrors(saveError.errors || {});
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="Loading project" />;

  if (error) {
    return (
      <ErrorState title="Project could not be loaded" message={error.message} onRetry={reload} />
    );
  }

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Edit project' : 'New project'}
        description={
          isEdit
            ? 'Update this project and its publication status.'
            : 'Add a project to your portfolio. You can keep it as a draft until it is ready.'
        }
      >
        <Button as={Link} to="/admin/projects" variant="secondary" size="md">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Cancel
        </Button>
        <Button type="submit" form="project-form" loading={saving}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {isEdit ? 'Save changes' : 'Create project'}
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
        id="project-form"
        onSubmit={handleSubmit}
        className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]"
      >
        <div className="space-y-5">
          <section className="admin-card p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-zinc-200">Project details</h2>
            <p className="mt-0.5 text-xs text-zinc-600">The main information visitors will see.</p>

            <div className="mt-5 space-y-4">
              <Field label="Title" htmlFor="title" required error={fieldErrors.title}>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => handleTitleChange(event.target.value)}
                  placeholder="e.g. CukurQ"
                  invalid={Boolean(fieldErrors.title)}
                  maxLength={200}
                  autoFocus
                />
              </Field>

              <Field
                label="Slug"
                htmlFor="slug"
                error={fieldErrors.slug}
                hint={`Public URL: /projects/${form.slug || 'your-project-slug'}`}
              >
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    update('slug', event.target.value);
                  }}
                  placeholder="cukurq"
                  invalid={Boolean(fieldErrors.slug)}
                  maxLength={220}
                />
              </Field>

              <Field
                label="Short description"
                htmlFor="short_description"
                required
                error={fieldErrors.short_description}
                hint={`${form.short_description.length}/500 characters`}
              >
                <Textarea
                  id="short_description"
                  rows={3}
                  value={form.short_description}
                  onChange={(event) => update('short_description', event.target.value)}
                  placeholder="A one or two sentence summary shown on project cards."
                  invalid={Boolean(fieldErrors.short_description)}
                  maxLength={500}
                />
              </Field>
            </div>
          </section>

          <section className="admin-card p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-zinc-200">Full description</h2>
            <p className="mt-0.5 text-xs text-zinc-600">
              Explain the problem, your approach, and the outcome. Separate paragraphs with a blank
              line.
            </p>
            <Field className="mt-5" htmlFor="description" error={fieldErrors.description}>
              <Textarea
                id="description"
                rows={12}
                value={form.description}
                onChange={(event) => update('description', event.target.value)}
                placeholder="What does this project do? What was interesting about building it?"
                invalid={Boolean(fieldErrors.description)}
              />
            </Field>
          </section>

          <section className="admin-card p-5 sm:p-6">
            <h2 className="text-sm font-semibold text-zinc-200">Project image</h2>
            <p className="mt-0.5 text-xs text-zinc-600">
              Upload a thumbnail. If left empty, a styled placeholder is used.
            </p>
            <div className="mt-5">
              <ImageUploadField
                value={form.image_url}
                onChange={(value) => update('image_url', value)}
                error={fieldErrors.image_url}
              />
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="admin-card p-5">
            <h2 className="text-sm font-semibold text-zinc-200">Publishing</h2>
            <div className="mt-4 space-y-4">
              <Switch
                id="is_published"
                checked={form.is_published}
                onChange={(value) => update('is_published', value)}
                label="Published"
                description="Show this project on the public website."
              />
              <div className="h-px bg-white/[0.06]" />
              <Switch
                id="is_featured"
                checked={form.is_featured}
                onChange={(value) => update('is_featured', value)}
                label="Featured"
                description="Highlight it in the featured projects section."
              />
              <div className="h-px bg-white/[0.06]" />
              <Field label="Sort order" htmlFor="sort_order" error={fieldErrors.sort_order} hint="Lower numbers appear first.">
                <Input
                  id="sort_order"
                  type="number"
                  min="0"
                  max="9999"
                  value={form.sort_order}
                  onChange={(event) => update('sort_order', Number(event.target.value))}
                  invalid={Boolean(fieldErrors.sort_order)}
                />
              </Field>
            </div>
          </section>

          <section className="admin-card p-5">
            <h2 className="text-sm font-semibold text-zinc-200">Technologies</h2>
            <p className="mt-0.5 text-xs text-zinc-600">
              Press Enter or comma to add each technology.
            </p>
            <div className="mt-4">
              <TechnologyInput
                value={form.technologies}
                onChange={(value) => update('technologies', value)}
                suggestions={suggestions}
                error={Boolean(fieldErrors.technologies)}
              />
              {fieldErrors.technologies ? (
                <p className="mt-1.5 text-xs text-rose-300">{fieldErrors.technologies}</p>
              ) : null}
            </div>
          </section>

          <section className="admin-card p-5">
            <h2 className="text-sm font-semibold text-zinc-200">Links</h2>
            <div className="mt-4 space-y-3">
              <Field label="GitHub URL" htmlFor="github_url" error={fieldErrors.github_url}>
                <Input
                  id="github_url"
                  type="url"
                  value={form.github_url}
                  onChange={(event) => update('github_url', event.target.value)}
                  placeholder="https://github.com/…"
                  invalid={Boolean(fieldErrors.github_url)}
                />
              </Field>
              <Field label="Demo URL" htmlFor="demo_url" error={fieldErrors.demo_url}>
                <Input
                  id="demo_url"
                  type="url"
                  value={form.demo_url}
                  onChange={(event) => update('demo_url', event.target.value)}
                  placeholder="https://…"
                  invalid={Boolean(fieldErrors.demo_url)}
                />
              </Field>
            </div>
          </section>

          <section className="admin-card p-5">
            <h2 className="text-sm font-semibold text-zinc-200">Timeline</h2>
            <div className="mt-4 space-y-3">
              <Field label="Start date" htmlFor="start_date" error={fieldErrors.start_date}>
                <Input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(event) => update('start_date', event.target.value)}
                  invalid={Boolean(fieldErrors.start_date)}
                />
              </Field>
              <Field label="End date" htmlFor="end_date" error={fieldErrors.end_date} hint="Leave empty if the project is ongoing.">
                <Input
                  id="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(event) => update('end_date', event.target.value)}
                  invalid={Boolean(fieldErrors.end_date)}
                />
              </Field>
            </div>
          </section>

          <div className="flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden="true" />
            <p className="text-[11px] leading-relaxed text-zinc-600">
              Drafts are only visible here. Published projects appear in the public API
              immediately after saving.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
