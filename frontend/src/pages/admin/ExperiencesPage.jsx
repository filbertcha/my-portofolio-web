import { useEffect, useState } from 'react';
import { BriefcaseBusiness, Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useResource } from '../../hooks/useResource.js';
import { useToast } from '../../context/ToastContext.jsx';
import { PageHeader } from '../../components/ui/PageHeader.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Field, Input, Select, Switch, Textarea } from '../../components/ui/Field.jsx';
import { ErrorState } from '../../components/common/ErrorState.jsx';
import { formatDateRange } from '../../utils/format.js';
import { experiencePayload } from '../../utils/payloads.js';

const blankExperience = {
  company: '',
  position: '',
  employment_type: 'Full-time',
  location: '',
  start_date: '',
  end_date: '',
  is_current: false,
  description: '',
  technologies: '',
  is_published: false,
  sort_order: 0,
};

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Internship',
  'Freelance',
  'Contract',
  'Volunteer',
];

function ExperienceForm({ open, item, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(blankExperience);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (item) {
      setForm({
        company: item.company ?? '',
        position: item.position ?? '',
        employment_type: item.employment_type ?? '',
        location: item.location ?? '',
        start_date: item.start_date ?? '',
        end_date: item.end_date ?? '',
        is_current: Boolean(item.is_current),
        description: item.description ?? '',
        technologies: (item.technologies ?? []).join(', '),
        is_published: Boolean(item.is_published),
        sort_order: item.sort_order ?? 0,
      });
    } else {
      setForm(blankExperience);
    }
    setErrors({});
    setFormError(null);
  }, [open, item]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    const nextErrors = {};
    if (!form.company.trim()) nextErrors.company = 'Company is required';
    if (!form.position.trim()) nextErrors.position = 'Position is required';
    if (!form.start_date) nextErrors.start_date = 'Start date is required';
    if (!form.description.trim()) nextErrors.description = 'Description is required';
    if (!form.is_current && form.end_date && form.end_date < form.start_date) {
      nextErrors.end_date = 'End date cannot be before start date';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    try {
      const payload = experiencePayload(form);
      if (item) {
        await api.put(`/admin/experiences/${item.id}`, payload);
        toast.success('Experience updated successfully.');
      } else {
        await api.post('/admin/experiences', payload);
        toast.success('Experience created successfully.');
      }
      onSaved();
    } catch (saveError) {
      setFormError(saveError.message);
      setErrors(saveError.errors || {});
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item ? 'Edit experience' : 'Add experience'}
      description="Roles that should appear in your career timeline."
      size="lg"
      footer={
        <>
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="experience-form" size="sm" loading={saving}>
            {item ? 'Save changes' : 'Add experience'}
          </Button>
        </>
      }
    >
      <form id="experience-form" onSubmit={handleSubmit} className="space-y-4">
        {formError ? (
          <div
            className="rounded-xl border border-rose-400/20 bg-rose-500/[0.07] px-3.5 py-3 text-xs text-rose-200"
            role="alert"
          >
            {formError}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company" htmlFor="company" required error={errors.company}>
            <Input
              id="company"
              value={form.company}
              onChange={(event) => update('company', event.target.value)}
              placeholder="Company or organization"
              invalid={Boolean(errors.company)}
              autoFocus
            />
          </Field>
          <Field label="Position" htmlFor="position" required error={errors.position}>
            <Input
              id="position"
              value={form.position}
              onChange={(event) => update('position', event.target.value)}
              placeholder="Job title"
              invalid={Boolean(errors.position)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Employment type" htmlFor="employment_type" error={errors.employment_type}>
            <Select
              id="employment_type"
              value={form.employment_type}
              onChange={(event) => update('employment_type', event.target.value)}
              invalid={Boolean(errors.employment_type)}
            >
              <option value="">Not specified</option>
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Location" htmlFor="location" error={errors.location}>
            <Input
              id="location"
              value={form.location}
              onChange={(event) => update('location', event.target.value)}
              placeholder="e.g. Jakarta, Indonesia"
              invalid={Boolean(errors.location)}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start date" htmlFor="start_date" required error={errors.start_date}>
            <Input
              id="start_date"
              type="date"
              value={form.start_date}
              onChange={(event) => update('start_date', event.target.value)}
              invalid={Boolean(errors.start_date)}
            />
          </Field>
          <Field label="End date" htmlFor="end_date" error={errors.end_date}>
            <Input
              id="end_date"
              type="date"
              value={form.end_date}
              onChange={(event) => update('end_date', event.target.value)}
              disabled={form.is_current}
              invalid={Boolean(errors.end_date)}
            />
          </Field>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
          <Switch
            id="is_current"
            checked={form.is_current}
            onChange={(value) => {
              update('is_current', value);
              if (value) update('end_date', '');
            }}
            label="Currently working here"
            description="Displayed as “Present” on the public timeline."
          />
        </div>

        <Field label="Description" htmlFor="description" required error={errors.description}>
          <Textarea
            id="description"
            rows={5}
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            placeholder="Responsibilities, achievements, and what you learned."
            invalid={Boolean(errors.description)}
          />
        </Field>

        <Field
          label="Technologies"
          htmlFor="technologies"
          hint="Comma separated, e.g. React.js, Node.js, PostgreSQL"
          error={errors.technologies}
        >
          <Input
            id="technologies"
            value={form.technologies}
            onChange={(event) => update('technologies', event.target.value)}
            placeholder="React.js, Express.js, PostgreSQL"
            invalid={Boolean(errors.technologies)}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Sort order" htmlFor="sort_order" error={errors.sort_order} hint="Lower numbers appear first.">
            <Input
              id="sort_order"
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(event) => update('sort_order', Number(event.target.value))}
              invalid={Boolean(errors.sort_order)}
            />
          </Field>
          <div className="flex items-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3">
            <Switch
              id="is_published"
              checked={form.is_published}
              onChange={(value) => update('is_published', value)}
              label="Published"
              description="Show on the public site."
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}

export function ExperiencesPage() {
  const { data, loading, error, reload } = useResource(() => api.get('/admin/experiences'), []);
  const toast = useToast();

  const [editor, setEditor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const experiences = data ?? [];

  useEffect(() => {
    document.title = 'Experience — Admin';
  }, []);

  const togglePublished = async (experience) => {
    setBusyId(experience.id);
    try {
      await api.put(
        `/admin/experiences/${experience.id}`,
        experiencePayload(experience, { is_published: !experience.is_published }),
      );
      toast.success(
        experience.is_published
          ? 'Experience hidden from the public site.'
          : 'Experience published.',
      );
      reload();
    } catch (publishError) {
      toast.error(publishError.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/experiences/${deleteTarget.id}`);
      toast.success('Experience deleted.');
      setDeleteTarget(null);
      reload();
    } catch (deleteError) {
      toast.error(deleteError.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Experience"
        description="Manage the roles shown in your career timeline."
      >
        <Button onClick={() => setEditor({ item: null })}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add experience
        </Button>
      </PageHeader>

      {loading ? (
        <div className="admin-card space-y-3 p-5">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-14 w-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Experience could not be loaded" message={error.message} onRetry={reload} />
      ) : experiences.length === 0 ? (
        <EmptyState
          icon={BriefcaseBusiness}
          title="No experience yet"
          description="Add a role to start building your professional timeline."
          action={
            <Button size="sm" onClick={() => setEditor({ item: null })}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add experience
            </Button>
          }
        />
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-[0.15em] text-zinc-600">
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Period</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {experiences.map((experience) => (
                  <tr key={experience.id} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-5 py-3">
                      <p className="font-medium text-zinc-200">{experience.position}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">{experience.company}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-zinc-500">
                      {formatDateRange(
                        experience.start_date,
                        experience.end_date,
                        experience.is_current,
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-500">
                      {experience.employment_type || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={experience.is_published ? 'success' : 'warning'}>
                        {experience.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                      {experience.sort_order}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => togglePublished(experience)}
                          loading={busyId === experience.id}
                          title={experience.is_published ? 'Unpublish' : 'Publish'}
                          aria-label={
                            experience.is_published ? 'Unpublish experience' : 'Publish experience'
                          }
                          className="h-8 w-8"
                        >
                          {experience.is_published ? (
                            <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditor({ item: experience })}
                          title="Edit"
                          aria-label="Edit experience"
                          className="h-8 w-8"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(experience)}
                          title="Delete"
                          aria-label="Delete experience"
                          className="h-8 w-8 hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ExperienceForm
        open={Boolean(editor)}
        item={editor?.item}
        onClose={() => setEditor(null)}
        onSaved={() => {
          setEditor(null);
          reload();
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete experience?"
        description={
          deleteTarget
            ? `The role at "${deleteTarget.company}" will be permanently removed. This action cannot be undone.`
            : ''
        }
      />
    </div>
  );
}
