import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { authorized } from 'Auth';

import Navbar from 'Layout/Navbar';
import Home from './Home';
import Login from 'Auth/Login';
import Register from 'Auth/Register';
import Logout from 'Auth/Logout';
import MyAccount from 'Auth/Account';
import Shop from './Shop';
import ProductSingle from './Product/Single';
import NotFound from './404';

function App () {
  const [isAuth, setAuth] = useState(authorized());

  return (
    <main>
      <Navbar auth={isAuth} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='*' element={<NotFound />} />
        <Route path='404' element={<NotFound />} />
        <Route path='login' element={<Login setAuth={setAuth} />} />
        <Route path='register' element={<Register setAuth={setAuth} />} />
        <Route path='logout' element={<Logout setAuth={setAuth} />} />
        <Route path='account/*' element={<MyAccount />} />

        <Route path='product'>
          <Route path='shop' element={<Shop />} />
          <Route path=':slug' element={<ProductSingle />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
