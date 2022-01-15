import { Link } from 'react-router-dom';

export type SWMenus = {
  label: string,
  url: string
}

function NavAccount ({ navmenu = [] }: { navmenu?: SWMenus[] }) {
  const menus = [
    {
      label: 'Dashboard',
      url: '/account/dashboard'
    },
    // {
    //   label: 'Order',
    //   url: '/account/order'
    // },
    {
      label: 'Settings',
      url: '/account/settings'
    },
    ...navmenu
  ];

  return (
    <ul>
      {menus.map((menu, index) => (
        <li key={index}>
          <Link to={menu.url}>{menu.label}</Link>
        </li>
      ))}
    </ul>
  );
}

export default NavAccount;
