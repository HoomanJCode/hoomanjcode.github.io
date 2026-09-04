const viewMoreButton = document.querySelector('.view-more-button');
const projectList = document.querySelector('#projectList');
const workSection = document.querySelector('#work');
const workModeLabel = document.querySelector('#workModeLabel');
const viewMoreLabel = viewMoreButton?.querySelector('.view-more-label');

if (viewMoreButton && projectList && workSection && workModeLabel && viewMoreLabel) {
  viewMoreButton.addEventListener('click', () => {
    const nextExpanded = viewMoreButton.getAttribute('aria-expanded') !== 'true';
    const extraProjects = projectList.querySelectorAll('.is-extra');

    viewMoreButton.setAttribute('aria-expanded', String(nextExpanded));
    projectList.classList.toggle('is-expanded', nextExpanded);
    workModeLabel.textContent = nextExpanded ? 'all projects' : 'selected work';
    viewMoreLabel.textContent = nextExpanded ? 'View less' : 'View more';

    extraProjects.forEach((project) => {
      project.hidden = !nextExpanded;
      if (nextExpanded) project.classList.add('is-visible');
    });

    if (nextExpanded) {
      requestAnimationFrame(() => {
        workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
}
