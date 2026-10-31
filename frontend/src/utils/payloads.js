export function projectPayload(project, overrides = {}) {
  return {
    title: project.title,
    slug: project.slug,
    short_description: project.short_description,
    description: project.description ?? null,
    image_url: project.image_url ?? null,
    github_url: project.github_url ?? null,
    demo_url: project.demo_url ?? null,
    technologies: (project.technologies ?? []).map((technology) =>
      typeof technology === 'string' ? technology : technology.name,
    ),
    is_featured: Boolean(project.is_featured),
    is_published: Boolean(project.is_published),
    sort_order: Number(project.sort_order) || 0,
    start_date: project.start_date || null,
    end_date: project.is_current ? null : project.end_date || null,
    ...overrides,
  };
}

export function experiencePayload(experience, overrides = {}) {
  return {
    company: experience.company,
    position: experience.position,
    employment_type: experience.employment_type || null,
    location: experience.location || null,
    start_date: experience.start_date,
    end_date: experience.is_current ? null : experience.end_date || null,
    is_current: Boolean(experience.is_current),
    description: experience.description,
    technologies: Array.isArray(experience.technologies)
      ? experience.technologies
      : String(experience.technologies || '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
    is_published: Boolean(experience.is_published),
    sort_order: Number(experience.sort_order) || 0,
    ...overrides,
  };
}

export function educationPayload(education, overrides = {}) {
  return {
    institution: education.institution,
    degree: education.degree || null,
    major: education.major,
    start_date: education.start_date || null,
    end_date: education.is_current ? null : education.end_date || null,
    is_current: Boolean(education.is_current),
    description: education.description || null,
    is_published: Boolean(education.is_published),
    sort_order: Number(education.sort_order) || 0,
    ...overrides,
  };
}
