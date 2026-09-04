const viewMoreButton = document.querySelector('.view-more-button');
const projectList = document.querySelector('#projectList');
const firstExtraProject = projectList?.querySelector('.is-extra');
const moreWork = document.querySelector('.more-work');
const workModeLabel = document.querySelector('#workModeLabel');
const viewMoreLabel = viewMoreButton?.querySelector('.view-more-label');

if (viewMoreButton && projectList && firstExtraProject && moreWork && workModeLabel && viewMoreLabel) {
  viewMoreButton.addEventListener('click', () => {
    const nextExpanded = viewMoreButton.getAttribute('aria-expanded') !== 'true';
    const extraProjects = projectList.querySelectorAll('.is-extra');

    viewMoreButton.setAttribute('aria-expanded', String(nextExpanded));
    projectList.classList.toggle('is-expanded', nextExpanded);
    moreWork.hidden = nextExpanded;
    workModeLabel.textContent = nextExpanded ? 'all projects' : 'selected work';
    viewMoreLabel.textContent = nextExpanded ? 'View less' : 'View more';

    extraProjects.forEach((project) => {
      project.hidden = !nextExpanded;
      if (nextExpanded) project.classList.add('is-visible');
    });

    if (nextExpanded) {
      requestAnimationFrame(() => {
        firstExtraProject.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
}
