const viewMoreButton = document.querySelector('.view-more-button');
const projectList = document.querySelector('#projectList');
const moreWork = document.querySelector('.more-work');
const workModeLabel = document.querySelector('#workModeLabel');
const viewMoreLabel = viewMoreButton?.querySelector('.view-more-label');
const extraProjects = [...projectList?.querySelectorAll('.is-extra') || []];
const firstRevealed = extraProjects[0];

if (viewMoreButton && projectList && moreWork && workModeLabel && viewMoreLabel && extraProjects.length) {
  const setExpanded = (expanded) => {
    viewMoreButton.setAttribute('aria-expanded', String(expanded));
    projectList.classList.toggle('is-expanded', expanded);
    extraProjects.forEach((project) => {
      project.hidden = !expanded;
    });
    moreWork.hidden = expanded;
    moreWork.setAttribute('aria-hidden', String(expanded));
    workModeLabel.textContent = expanded ? 'all projects' : 'selected work';
    viewMoreLabel.textContent = expanded ? 'View less' : 'View more';
    if (expanded) {
      projectList.after(viewMoreButton);
      requestAnimationFrame(() => {
        // End the scroll above the first newly revealed project, keeping a
        // strip of the last featured project visible for context and letting
        // the grid gap act as margin before the new projects begin.
        const rowGap = parseFloat(getComputedStyle(projectList).rowGap) || 0;
        const firstRowBottom = firstRevealed.getBoundingClientRect().top + window.scrollY - rowGap;
        window.scrollTo({ top: Math.max(0, firstRowBottom - 150), behavior: 'smooth' });
      });
    } else {
      moreWork.after(viewMoreButton);
    }
  };

  setExpanded(false);
  viewMoreButton.addEventListener('click', () => {
    const nextExpanded = viewMoreButton.getAttribute('aria-expanded') !== 'true';
    setExpanded(nextExpanded);
    if (!nextExpanded) {
      requestAnimationFrame(() => {
        viewMoreButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  });
}
