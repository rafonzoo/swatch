import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from 'Styles/Isolated/Nav.module.scss';

function Navbar ({ auth }: { auth: boolean}) {
  const menuElement = useRef<HTMLDivElement|null>(null);
  let authMenu = [
    {
      label: 'Login',
      url: '/login'
    },
    {
      label: 'Register',
      url: '/register'
    }
  ];

  if (auth) {
    authMenu = [
      {
        label: 'My account',
        url: '/account/dashboard'
      },
      {
        label: 'logout',
        url: '/logout'
      }
    ];
  }

  const menus = [
    {
      label: 'Home',
      url: '/'
    },
    {
      label: 'Shop',
      url: '/product/shop'
    },
    ...authMenu
  ];

  const collapse = (e: React.MouseEvent) => {
    if (e.currentTarget.nodeName === 'BUTTON') {
      e.preventDefault();
    }

    const { current } = menuElement;
    const rootNav = current?.closest('nav');

    if (!current || !rootNav || innerWidth > 767) {
      return;
    }

    rootNav.classList.toggle('show');
    const running = () => {
      current.classList.remove('running');
      rootNav.removeEventListener('transitionend', running);
    };

    rootNav.addEventListener('transitionend', running);
    current.classList.add('running');

    if (rootNav.classList.contains('show')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.removeAttribute('style');
    }

    return scrollTo(0, 0);
  };

  return (
    <nav id='nav' className={styles.nav}>
      <div className={styles.safearea}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <Link to='/' className={styles.link}>
              <svg xmlns="http://www.w3.org/2000/svg" width="29" height="28" viewBox="0 0 29 28" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M8.0592 21.9973L2.5 22L11.3572 9.72278L19.3463 3L8.0592 21.9973ZM16.4413 9.72278L11.3572 20.1886L16.1203 14.2837L19.8537 21.9124H26.5L16.4413 9.72278Z" fill="#18181B"/>
              </svg>
                Swatch
            </Link>
          </div>
          <div className={styles.cart}></div>
          <div className={styles.toggle}>
            <button onClick={collapse} className={styles.button} aria-label='Menu'></button>
          </div>
          <div className={styles.menu} ref={menuElement}>
            <ul className={styles.list}>
              {menus.map((menu, index) => (
                <li key={index}>
                  <Link onClick={collapse} to={menu.url}>{menu.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
