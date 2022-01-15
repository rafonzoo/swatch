import type React from 'react';
import type { SWUserCollection, SWUserAccount, SWUserProfile } from '@scheme/users';

import { updateUser } from '@controls/users';
import { useState } from 'react';
import { useCustomer } from 'Utils/hook';

function Settings () {
  const [getMessage, setMessage] = useState('');
  const [getDisable, setDisable] = useState(true);

  const user = useCustomer() as SWUserCollection;
  type User = SWUserAccount & SWUserProfile;

  // Fields
  const fieldValue = { defaultValue: '', name: '', placeholder: '' };
  const fields: typeof fieldValue[] = [];

  // Changes
  const userrefold: User = Object.create({});
  const userrefnow: User = Object.create({});

  let key: keyof typeof user;
  let name: keyof User;

  for (key in user) {
    const userkey = user[key] as User;

    if (key !== 'account' && key !== 'profile') {
      continue;
    }

    for (name in userkey) {
      const defaultValue = userkey[name];
      let placeholder: string;

      if (name === 'password' || name === 'email') {
        continue;
      }

      switch (name) {
        case 'firstName': placeholder = 'First name'; break;
        case 'lastName': placeholder = 'Last name'; break;
        case 'nickName': placeholder = 'Nick name'; break;

        default: placeholder = 'Username (required)'; break;
      }

      fields.push({ defaultValue, name, placeholder });
      userrefold[name] = defaultValue;
    }
  }

  const getData = (form: HTMLFormElement) => {
    const inputs = form.querySelectorAll('input');

    Array.from(inputs).forEach(input => {
      const { name, value } = input;
      name && (userrefnow[name as keyof User] = value);
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = e.currentTarget.closest('form');

    if (form) {
      getData(form);
      setDisable(
        JSON.stringify(userrefnow) ===
        JSON.stringify(userrefold)
      );
    }
  };

  const update = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage('');
    setDisable(true);
    getData(e.currentTarget);

    const userdata: { [x: string]: string } = Object.create({});

    for (name in userrefnow) {
      if (userrefnow[name] === userrefold[name]) {
        continue;
      }

      const isAccount = name === 'username';
      const parents = isAccount ? 'account' : 'profile';

      userdata[[parents, name].join('.')] = userrefnow[name];
    }

    const { success, message } = await updateUser(userdata);

    setMessage(message);
    setDisable(success);
  };

  return (
    <form action="/" method='POST' onSubmit={update} autoComplete='off'>
      {fields.map((field, key) => (
        <p key={key}>
          <input {...field} required={field.name === 'username'} type='text' onChange={onChange} />
        </p>
      ))}
      <p>
        <input type="submit" disabled={getDisable} value='Save'/>
      </p>
      <p>{ getMessage }</p>
    </form>
  );
}

export default Settings;
