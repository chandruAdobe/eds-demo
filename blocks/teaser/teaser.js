import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the teaser
 * @param {Element} block The teaser block element
 */
export default async function decorate(block) {
  // load teaser as fragment
  const teaserMeta = getMetadata('teaser');
  const teaserPath = teaserMeta
    ? new URL(teaserMeta, window.location).pathname
    : '/teaser';
  const fragment = await loadFragment(teaserPath);

  // decorate teaser DOM
  block.textContent = '';
  const teaser = document.createElement('div');
  while (fragment.firstElementChild) teaser.append(fragment.firstElementChild);

  block.append(teaser);
}
