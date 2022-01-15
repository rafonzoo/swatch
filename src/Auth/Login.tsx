import type React from 'react';

import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { getUser } from '@controls/users';
import { serialize } from 'Utils';
import { authorized } from '.';

function Login ({ setAuth }: { setAuth(state: boolean): void }) {
  if (authorized()) return <Navigate to='/' replace />;

  const navigate = useNavigate();

  const [getMessage, setMessage] = useState('');
  const [isSuccess, setSuccess] = useState(false);
  const [isDisabled, disableSubmit] = useState(false);

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage('');
    disableSubmit(true);

    type SWUserAuthdata = {
      email: string;
      password: string;
    }

    const data = serialize<SWUserAuthdata>(e.currentTarget);
    const { success, message } = await getUser(data);

    if (success) {
      setSuccess(success);
      setAuth(true);

      return;
    }

    setMessage(message);
    disableSubmit(false);
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
    if (!authorized()) setAuth(false);
  }, [isSuccess]);

  return (
    <div className='safearea'>
      <h1>Sign in</h1>
      <form method='POST' onSubmit={submitForm} autoComplete='off'>
        <p>
          <input type="email" name='email' placeholder='Email' required />
        </p>
        <p>
          <input type="password" name='password' placeholder='Password' required />
        </p>
        <input type="submit" disabled={isDisabled} value='Submit'/>
        <p>{getMessage}</p>
      </form>
    </div>
  );
}

export default Login;
