const viewMoreButton = document.querySelector('.view-more-button');
const selectedProjects = document.querySelector('#projectList');
const allProjects = document.querySelector('#allProjectsList');
const moreWork = document.querySelector('.more-work');
const workModeLabel = document.querySelector('#workModeLabel');
const viewMoreLabel = viewMoreButton?.querySelector('.view-more-label');
const extraProjects = [...selectedProjects?.querySelectorAll('.is-extra') || []];

if (viewMoreButton && selectedProjects && allProjects && moreWork && workModeLabel && viewMoreLabel && extraProjects.length) {
  extraProjects.forEach((project) => {
    project.hidden = false;
    allProjects.appendChild(project);
  });

  const setExpanded = (expanded) => {
    viewMoreButton.setAttribute('aria-expanded', String(expanded));
    selectedProjects.classList.toggle('is-selected', !expanded);
    allProjects.hidden = !expanded;
    allProjects.classList.toggle('is-expanded', expanded);
    moreWork.hidden = expanded;
    moreWork.setAttribute('aria-hidden', String(expanded));
    workModeLabel.textContent = expanded ? 'all projects' : 'selected work';
    viewMoreLabel.textContent = expanded ? 'View less' : 'View more';
  };

  setExpanded(false);
  viewMoreButton.addEventListener('click', () => {
    const nextExpanded = viewMoreButton.getAttribute('aria-expanded') !== 'true';
    setExpanded(nextExpanded);
  });
}
