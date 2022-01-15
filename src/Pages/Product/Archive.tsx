import type { SWProduct } from '@scheme/prods';

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { openFilter } from './Filter';
import { db } from '@scheme';
import { images } from 'Assets';
import { lazyImage } from 'Utils';
import classes from 'Styles/Isolated/Shop/ShopFilter.module.scss';
import styles from 'Styles/Isolated/Shop/ShopContent.module.scss';

const ProductArchive = ({ product }: { product: SWProduct[] }) => {
  const [choosenProduct, setChoosenProduct] = useState(product);
  const image = useRef<Array<HTMLImageElement>>([]);
  const ul = useRef<HTMLUListElement|null>(null);

  useEffect(() => {
    if (product.length === 1) {
      const [currentProd] = product;
      const getByTitle = db.products
        .where('title')
        .equals(currentProd.title);

      getByTitle.toArray().then(prod => {
        const [newProd] = prod.filter(x => {
          const { band } = x.attributes;
          const { band: bands, case: caseX } = currentProd.attributes;

          return (
            band.color.includes(caseX.finishes) &&
            band.type === bands.type
          );
        });

        setChoosenProduct([newProd || currentProd]);
      });
    } else {
      setChoosenProduct(product);
    }

    const { current } = ul;
    lazyImage(image.current, () => {
      if (current && current.classList.contains('loading')) {
        current.classList.remove('loading');
      }
    });
  }, [product, choosenProduct]);

  const reference = (el: HTMLImageElement|null, index: number) => {
    return el && (image.current[index] = el);
  };

  const filter = (
    <div className={classes.sticky}>
      <div className='safearea'>
        <a aria-label='Toggle filter' title='Toggle filter' href="#" onClick={openFilter}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list">
            <line x1="8" y1="6" x2="21" y2="6"/>
            <line x1="8" y1="12" x2="21" y2="12"/>
            <line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/>
            <line x1="3" y1="12" x2="3.01" y2="12"/>
            <line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          Filter
        </a>
        <div>
          <span>View</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className='component'>
      {filter}
      <div className={styles.safearea}>
        <ul ref={ul} className={styles.products}>
          {choosenProduct.map((p, index) => {
            const swatches: string[] = [];

            for (let c = 0; c < 4; c++) {
              if (p.swatch.images[c]) {
                swatches.push(p.swatch.images[c]);
              }
            }

            const showPlus = p.swatch.images.length > swatches.length;
            return (
              <li key={index} className={styles.product}>
                <Link to={'/product/' + p.slug} className={styles.link}>
                  <div className={styles.image + ' placeholder'}>
                    <img
                      className='lazy'
                      ref={el => reference(el, index)}
                      data-src={images(p.images)}
                      alt={p.attributes.band.type}
                    />
                  </div>
                  <div className={styles.context}>
                    <h2 className={styles.title}>{p.title}</h2>
                    <p className={styles.price}>
                      From ${p.price} <br/>
                      or ${p.price - 50} w/ RFZ disc.*
                    </p>
                    <div className={styles.swatch}>
                      {swatches.map((s, i) => (
                        <img
                          className='lazy'
                          width='16'
                          height='16'
                          key={i}
                          data-src={images(`swatches-color/${s}.jpg`)}
                          alt={s.split('/')[1]}
                        />
                      ))}
                      {showPlus && (<span className={styles.more}>+</span>)}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ProductArchive;
