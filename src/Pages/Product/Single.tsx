import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { db } from '@scheme';
import { SWProduct } from '@scheme/prods';
import styles from 'Styles/Isolated/Product/Single.module.scss';
import { images } from 'Assets';

const ProductSingle = () => {
  const navigate = useNavigate();

  const [product, setProduct] = useState<SWProduct|null>(null);
  const slugify = location.href.split('/product/')[1];

  useEffect(() => {
    if (slugify.length === 0) {
      return navigate('/404', { replace: true });
    }

    db.products.where('slug').equals(slugify).toArray().then(p => {
      const [currentProduct] = p;

      if (!currentProduct) {
        return navigate('/404', { replace: true });
      }

      setTimeout(() => setProduct(currentProduct), 1000);
    });
  }, [location.href]);

  const Skeleton = (
    <div>Loading...</div>
  );

  const Content = product && (
    <div className={styles.container}>
      <section className={styles.section}>
        <div className={styles.wrapper}>
          <div className={styles.mediaWrapper}>
            <figure className={styles.media}>
              <img src={images(product.images)} alt=""/>
            </figure>
          </div>
          <div className={styles.content}>
            <div className={styles.eyebrow}>
              <p>New</p>
              <p>{product.attributes.case.collection} Edition</p>
            </div>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.options}>
              <div className='component'>
                <hr className={styles.hr}/>
                <h2>Band Colors</h2>
                <div className={styles.swatches}>
                  <h3>Color - {product.attributes.band.color}</h3>
                  {product.swatch.images.map((img, i) => (
                    <button key={i} className={`${(product.swatch.current === i && 'current') || ''}`}>
                      <img src={images(`swatches-color/${img}.jpg`)} alt=""/>
                    </button>
                  ))}
                  <p>
                    See even more band types. Try different case materials.
                    Express your personal style in the Apple Watch Studio.
                    Only at Apple.
                  </p>
                </div>
              </div>
              <div className='component'>
                <hr className={styles.hr}/>
                <h2>Case Size</h2>
                <p>This page isn`t complete yet.</p>
              </div>
            </div>
            <button disabled={true} className={styles.button}>Add to your cart</button>
          </div>
        </div>
      </section>
    </div>
  );

  return (product && Content) || Skeleton;
};

export default ProductSingle;
