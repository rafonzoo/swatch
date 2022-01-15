import type { SWProduct } from '@scheme/prods';
import React, { useRef } from 'react';

import { reducedProducts } from '@scheme/prods';
import { db } from '@scheme';
import { useResize, useScroll } from 'Utils/hook';

import classes from 'Styles/Isolated/Shop/ShopFilter.module.scss';
import styles from 'Styles/Isolated/Shop/ShopContent.module.scss';

type FilterPropertyType = { type: string[]; value: string;};
const filterProps: FilterPropertyType[] = [];

const ProductFilter = ({ setProduct }: { setProduct: (data: SWProduct[]) => void }) => {
  const shopFilters = [
    {
      name: 'Collection',
      type: 'case:collection',
      items: [
        'Apple',
        'Nike',
        'Hermes'
      ]
    },
    {
      name: 'Case Material',
      type: 'case:material',
      items: [
        'Aluminum',
        'Stainless Steel'
      ]
    },
    {
      name: 'Case Finishes',
      type: 'case:finishes',
      items: [
        'Silver',
        'Starlight',
        'Green',
        'Blue',
        'Gold',
        'Space Black',
        'Graphite',
        'Product Red'
      ]
    },
    {
      name: 'Band Type',
      type: 'band:type',
      items: [
        'Solo Loop',
        'Braided Solo Loop',
        'Sport Band',
        'Sport Loop',
        'Leather',
        'Stainless Steels'
      ]
    }
  ];

  const navbar = useRef<HTMLElement|null>(null);

  const onClick = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    const currentTarget = e.currentTarget;
    const listElement = currentTarget.closest('li');
    const navsElement = currentTarget.closest('nav');

    const attrKeyPair = listElement?.dataset.type;
    const textContent = currentTarget.textContent;
    const attributes = attrKeyPair?.split(':');

    if (!listElement || !textContent || !attributes || !navsElement) {
      return;
    }

    e.currentTarget.classList.toggle('active');
    const currentFilter = { type: attributes, value: textContent };
    const filterSomeProps = (filter: FilterPropertyType) => {
      return currentFilter.value === filter.value;
    };

    if (!filterProps.some(filterSomeProps)) {
      filterProps.push(currentFilter);
    } else {
      filterProps.forEach((prop, index, array) => {
        if (prop.value === currentFilter.value) {
          filterProps.splice(array.indexOf(prop), 1);
        }
      });
    }

    // Define here. If no product filtered then return all product.
    // We're not showing empty product / empty array of product.
    let filteredProducts = await db.products.toArray();
    filterProps.forEach(filterKey => {
      const [attributeKey1, attributeKey2] = filterKey.type;
      filteredProducts = filteredProducts.filter(product => { // @ts-ignore
        return product.attributes[attributeKey1][attributeKey2] === filterKey.value;
      });
    });

    const disabledAnchors: string[] = [];
    const filterAnchor = navsElement.querySelectorAll<HTMLAnchorElement>('p a');
    Array.from(filterAnchor).forEach(anchor => {
      const listElementNext = anchor.closest('li');
      const attrKeyPairNext = listElementNext?.dataset.type;

      if (!listElementNext || !attrKeyPairNext || !anchor.textContent) {
        return;
      }

      const [keyOne, keyTwo] = attrKeyPairNext.split(':');
      for (let i = 0; i < filteredProducts.length; i++) {
        const prodAttributes = filteredProducts[i].attributes; // @ts-ignore
        const prodAttribute: string = prodAttributes[keyOne][keyTwo];

        if (!disabledAnchors.includes(prodAttribute)) {
          disabledAnchors.push(prodAttribute);
        }
      }

      const disabled = !disabledAnchors.includes(anchor.textContent);
      anchor.classList[disabled ? 'add' : 'remove']('disabled');
      anchor.tabIndex = disabled ? -1 : 0;
    });

    setProduct(reducedProducts(filteredProducts));
    document.querySelector(`.${styles.products}`)?.classList.add('loading');
  };

  const onCollapse = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    return innerWidth > 767 ? fullCollaption(e) : partialCollaption(e);
  };

  const onSticky = () => {
    if (navbar.current && innerWidth > 767) {
      const nav = navbar.current;
      const ul = nav.querySelector('ul');
      const { top } = nav.getBoundingClientRect();

      nav.classList.toggle('locked', top === 0);

      if (ul && !ul.classList.contains('hide')) {
        const anchors = ul.querySelectorAll<HTMLAnchorElement>('p > a');
        const visibilityToggle = (e: TransitionEvent) => {
          Array.from(anchors).forEach(a => a.removeAttribute('style'));
          ul.removeEventListener('transitionend', visibilityToggle);
        };

        Array.from(anchors).forEach(a => (a.style.visibility = 'visible'));

        ul.classList.add('hide');
        ul.addEventListener('transitionend', visibilityToggle);
      }
    }
  };

  useScroll(onSticky);
  useResize(onSticky);

  return (
    <nav ref={navbar} className={classes.nav}>
      <div className={classes.wrapper}>
        <ul className={`${classes.ul} hide`}>
          <p className={classes.close}>
            <a
              href='#'
              onClick={closeFilter}
              className={classes.button}
              aria-label='Close'
            >
              Close
            </a>
          </p>
          {shopFilters.map((series, index) => (
            <li className={classes.li + (index > 1 ? ' collapsed' : '') } key={index} data-type={series.type}>
              <div>
                <a href='#asd' onClick={onCollapse} className={classes.a}>{series.name}</a>
              </div>
              <div>{
                series.items.map((item, i) => (
                  <p className={classes.p} key={i}>
                    <a className={classes.a} onClick={onClick} href={`#${item}`}>{item}</a>
                  </p>
                ))
              }</div>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

function fullCollaption (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  const ul = e.currentTarget.closest('ul');
  const div = e.currentTarget.parentElement;

  e.preventDefault();
  ul && ul.classList.toggle('hide');

  if (!div || !ul || !div.nextElementSibling) {
    return;
  }

  const anchors = ul.querySelectorAll<HTMLAnchorElement>('#shop li p a');
  const isHide = ul.classList.contains('hide');

  Array.from(anchors).forEach(anchor => {
    if (isHide) {
      anchor.style.visibility = 'visible';
      setTimeout(() => anchor.removeAttribute('style'), 400);

      return;
    };
  });
};

function partialCollaption (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  e.preventDefault();

  const parent = e.currentTarget.parentElement;
  const li = parent?.closest('li');
  const div = li?.children[1] as HTMLDivElement;

  if (!parent || !li || !div) {
    return;
  }

  div.style.height = `${div.scrollHeight}px`;
  const expanded = li.classList.contains('collapsed');
  const anchors = li.querySelectorAll<HTMLAnchorElement>('p > a');

  expanded && Array.from(anchors).forEach(anchor => {
    anchor.style.visibility = 'visible';
    setTimeout(() => anchor.removeAttribute('style'), 500);
  });

  li.classList.toggle('collapsed');
  setTimeout(() => div.removeAttribute('style'), 250);
}

export function closeFilter (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  e.preventDefault();

  const nav = document.querySelector<HTMLDivElement>('#shop nav');
  const filter = document.querySelector<HTMLAnchorElement>(`.${classes.sticky} a`);

  nav && nav.classList.remove('show');
  filter && filter.focus();
};

export function openFilter (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  e.preventDefault();

  const nav = document.querySelector<HTMLDivElement>('#shop nav');
  const close = document.querySelector<HTMLDivElement>('nav ul > p > a');

  nav && nav.classList.add('show');
  close && close.focus();

  if (innerWidth > 767) {
    return;
  }

  let lastActive: HTMLElement|null = null;
  close?.addEventListener('keydown', e => {
    if (e.key === 'Tab' && e.shiftKey) {
      lastActive && lastActive.focus();
      e.preventDefault();
    }
  });

  const filterHead = document.querySelectorAll<HTMLDivElement>(`.${classes.li}>div:first-child`);
  const lastHead = filterHead[filterHead.length - 1];

  const preventKey = (e: KeyboardEvent) => {
    const target = e.currentTarget as HTMLAnchorElement;
    const parent = target.closest('li');

    if (!parent || innerWidth > 767) return;
    if (!parent.classList.contains('collapsed') && !e.shiftKey) {
      if (e.key === 'Tab' && close) {
        e.preventDefault();
        return (lastActive = target) && close.focus();
      }
    }
  };

  const target = lastHead.firstElementChild as HTMLAnchorElement;
  target?.addEventListener('keydown', preventKey);

  const next = lastHead.nextElementSibling;
  const link = next?.querySelectorAll('a');
  const focus = (e: KeyboardEvent) => {
    if ((!e.shiftKey) && e.key === 'Tab') {
      e.preventDefault(); close?.focus();
    }
  };

  if (!link) {
    return;
  }

  for (let i = 0; i < link.length; i++) {
    link[i].addEventListener('keydown', e => {
      const target = (e.currentTarget as HTMLDivElement);
      const index = Array.from(link).indexOf(link[i]);
      const active = target.classList.contains('active');

      if (active || index === link.length - 1) {
        return (lastActive = target) && focus(e);
      }
    });
  }
};

export default ProductFilter;
