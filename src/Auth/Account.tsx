import { Navigate, Route, Routes } from 'react-router';
import { useLocation } from 'react-router-dom';
import { authorized } from 'Auth';
import { capitalize } from 'Utils';

import NavAccount from 'Layout/NavAcc';
import Dashboard from './MyAccount/Dashboard';
import Settings from './MyAccount/Settings';

function MyAccount () {
  if (!authorized()) return <Navigate to='/login' replace />;

  const { pathname } = useLocation();
  const splitter = pathname.split('/');

  const current = splitter[splitter.length - 1];
  const subtitle = capitalize(current);

  return (
    <div className='safearea'>
      <h1>My account</h1>
      <h2>{subtitle}</h2>
      <div>
        <nav>
          <NavAccount />
          <Routes>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='order/*'>
              <Route path='history' />
              <Route path='progress' />
            </Route>
            <Route path='tracking' />
            <Route path='payment' />
            <Route path='settings' element={<Settings />} />
          </Routes>
        </nav>
      </div>
    </div>
  );
}

export default MyAccount;
