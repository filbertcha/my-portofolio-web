import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolioData } from '../../hooks/usePortfolioData.js';
import { HeroSection } from '../../components/portfolio/HeroSection.jsx';
import { AboutSection } from '../../components/portfolio/AboutSection.jsx';
import { FeaturedProjects } from '../../components/portfolio/FeaturedProjects.jsx';
import { ExperienceSection } from '../../components/portfolio/ExperienceSection.jsx';
import { EducationSection } from '../../components/portfolio/EducationSection.jsx';
import { ContactSection } from '../../components/portfolio/ContactSection.jsx';
import { HomeSkeleton } from '../../components/portfolio/HomeSkeleton.jsx';
import { ErrorState } from '../../components/common/ErrorState.jsx';

export function HomePage() {
  const { data, loading, error, reload } = usePortfolioData();
  const location = useLocation();

  useEffect(() => {
    if (data.profile?.full_name) {
      document.title = `${data.profile.full_name} — ${data.profile.headline || 'Portfolio'}`;
    } else {
      document.title = 'Personal Portfolio';
    }
  }, [data.profile]);

  // Sections only exist after the API data has loaded, so scroll again once
  // the page is ready (e.g. when opening /#experience directly).
  useEffect(() => {
    if (loading || error || !location.hash) return undefined;
    const id = decodeURIComponent(location.hash.slice(1));
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [loading, error, location.hash]);

  if (loading) return <HomeSkeleton />;

  if (error) {
    return (
      <div className="pt-24">
        <ErrorState
          title="The portfolio could not be loaded"
          message="The API is not responding. Check that the backend and PostgreSQL are running, then try again."
          onRetry={reload}
        />
      </div>
    );
  }

  return (
    <>
      <HeroSection profile={data.profile} contact={data.contact} />
      <AboutSection
        profile={data.profile}
        contact={data.contact}
        projects={data.projects}
      />
      <FeaturedProjects projects={data.projects} />
      <ExperienceSection experiences={data.experiences} />
      <EducationSection education={data.education} />
      <ContactSection contact={data.contact} profile={data.profile} />
    </>
  );
}
