import type React from 'react';
import type { SWUserAccount } from '@scheme/users';

import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { addUser } from '@controls/users';
import { serialize } from 'Utils';
import { authorized } from 'Auth';

function Register ({ setAuth }: { setAuth(state: boolean): void }) {
  if (authorized()) return <Navigate to='/' replace />;

  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [isSuccess, setSuccess] = useState(false);
  const [isDisabled, disableSubmit] = useState(false);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage('');
    disableSubmit(true);

    const data = serialize<SWUserAccount>(e.currentTarget);
    const { success, message } = await addUser(data);

    disableSubmit(false);
    setMessage(message);
    setSuccess(success);
  };

  useEffect(() => {
    if (isSuccess) navigate('/login');
    if (!authorized()) setAuth(false);
  }, [isSuccess]);

  return (
    <div className='safearea'>
      <h1>Sign up</h1>
      <form method='POST' onSubmit={submitForm} autoComplete='off'>
        <p>
          <input type="text" name='username' placeholder='Username' required />
        </p>
        <p>
          <input type="email" name='email' placeholder='Email' required />
        </p>
        <p>
          <input type="password" name='password' placeholder='Password' required />
        </p>
        <p>
          <input type="password" name='cPassword' placeholder='Confirm password' required />
        </p>
        <input type="submit" disabled={isDisabled} value='Submit'/>
        <p>{message}</p>
      </form>
    </div>
  );
}

export default Register;
