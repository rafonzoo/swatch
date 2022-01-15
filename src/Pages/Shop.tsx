import type { SWProduct } from '@scheme/prods';

import { useEffect, useState } from 'react';
import { db } from '@scheme';
import { reducedProducts } from '@scheme/prods';
import ProductFilter from './Product/Filter';
import ProductArchive from './Product/Archive';
import styles from 'Styles/Isolated/Shop/Shop.module.scss';

const Shop = () => {
  const [data, setData] = useState([] as SWProduct[]);

  useEffect(() => {
    const response = db.products.toArray();
    response.then(d => setData(reducedProducts(d)));
  }, []);

  return (
    <div id='shop' className={`component ${styles.shop}`}>
      <div className={styles.div}>
        <h1 className={styles.h1}>Swatch shop</h1>
        <p className={styles.p}>
          Easiest way to purchase Apple Watch
          <span> with&nbsp;Apple Care+ and delivery free.</span>
        </p>
      </div>
      <div>
        <ProductFilter setProduct={setData} />
        <div>
          <ProductArchive product={data} />
        </div>
      </div>
    </div>
  );
};

export default Shop;
