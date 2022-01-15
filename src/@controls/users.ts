import type { SWUserAccount } from '@scheme/users';

import { timeout, timerize } from 'Utils';
import { decryptor, encryptor, storage, tokenize } from 'Auth';
import { validate, collection, currentUser } from '@scheme/users';
import { db } from '@scheme';

export async function addUser <T extends SWUserAccount> (data: T) {
  const { username, email, password } = data;
  const { error } = validate(data);
  const result = {
    success: false,
    message: error?.message || ''
  };

  await timeout(timerize(150, 1000));

  if (error) return result;

  const unameExist = await db.users
    .where('account.username')
    .equals(username)
    .first();

  const emailExist = await db.users
    .where('account.email')
    .equals(email)
    .first();

  if (unameExist) {
    result.message = 'Username already exist.';
    return result;
  }

  if (emailExist) {
    result.message = 'Email already exist.';
    return result;
  }

  try {
    await db.users.add({
      ...collection,
      account: {
        email: email,
        username: username,
        password: encryptor(password)
      }
    });

    result.success = true;
    result.message = 'success!';

    return result;
  } catch (e: any) {
    result.message = e.message as string;
    return result;
  }
}

export async function getUser ({ email, password }: { [x: string]: string }) {
  const result = {
    success: false,
    message: ''
  };

  await timeout(timerize(150, 1000));

  const user = await db.users
    .where('account.email')
    .equals(email)
    .first();

  if (!user || decryptor(user.account.password) !== password) {
    result.message = 'Incorrect email or password.';
    return result;
  }

  const token = encryptor({ data: user }, true);
  const strng = JSON.stringify({ token: token });
  localStorage.setItem('sw-config', strng);

  result.success = true;
  result.message = 'Success!';

  return result;
}

export async function updateUser (keystring: { [x: string]: string }) {
  const result = {
    success: false,
    message: ''
  };

  const { token } = storage();
  const { isExpired } = tokenize();

  await timeout(timerize(150, 1000));

  if (!token || isExpired) {
    result.message = 'Session expired.';
    setTimeout(() => location.reload(), 1000);
    return result;
  }

  const { id } = currentUser();

  if (id && await db.users.update(id, keystring) === 1) {
    const updatedUser = await db.users.get(id);

    if (!updatedUser) {
      result.message = 'Cannot get updated change. Please reload the page.';
      return result;
    }

    localStorage.setItem(
      'sw-config',
      JSON.stringify({
        token: encryptor({ data: updatedUser })
      })
    );

    result.success = true;
    result.message = 'Update success.';
    return result;
  }

  result.message = 'Update failed. Try again later.';
  return result;
}

// export async function updateUser (data: Partial<SWUserAccount & SWUserProfile>) {
//   const result = {
//     success: false,
//     message: ''
//   };

//   await timeout(timerize(150, 1000));

//   const { token } = storage();
//   const { isExpired } = tokenize();

//   if (!token || isExpired) {
//     result.message = 'Session expired.';
//     return result;
//   }

//   const user = (decryptor(token) as { data: SWUser }).data;
//   // TODO: Update user data based on form field change. Compare previous
//   // object with the new one. Override unchanged field is prohibited.
//   type UserUpdate = Partial<SWUserAccount & SWUserProfile>;
//   type UserData = Record<keyof SWUser, UserUpdate>;
//   type UserKey = keyof SWUserAccount | keyof SWUserProfile;

//   const userchanges = Object.create({});
//   const userdata = Object.create({});

//   forin(user, (key, userkey) => {
//     userdata[key] = {};

//     forin(userkey as UserUpdate, (keystring, string) => {
//       if (keystring === 'password') {
//         console.log(keystring);
//       }
//     });
//   });

//   // for (const key in user) {
//   //   const details = user[key as keyof SWUser];

//   //   if (!details || typeof details !== 'object') {
//   //     continue;
//   //   }

//   //   userdata[key as keyof SWUser] = {};

//   //   for (const props in details) {
//   //     const propKey = props as UserKey;
//   //     const notPassword = propKey !== 'password';

//   //     let accprof = paralize(props)(details);
//   //     if (propKey === 'password') {
//   //       accprof = decryptor(accprof as string);
//   //     }

//   //     const currentKey = userdata[key as keyof SWUser];
//   //     currentKey[propKey] = data[propKey];

//   //     if (accprof !== currentKey[propKey]) {
//   //       const selector = [key, props].join('.');
//   //       const valueString = data[propKey] as string;

//   //       userchanges[selector] = notPassword ? data[propKey] : encryptor(valueString);
//   //     }
//   //   }
//   // }

//   // if (Object.keys(userchanges).length === 0) {
//   //   result.success = true;
//   //   result.message = 'All is up to date.';

//   //   return result;
//   // }

//   // if (userchanges['account.email']) {
//   //   const usermap = db.users.where({
//   //     'account.email': userchanges['account.email']
//   //   });

//   //   if (await usermap.first()) {
//   //     result.message = 'Email already exist.';
//   //     return result;
//   //   }
//   // }

//   // const [userID] = await db.users.where({
//   //   'account.email': user.account.email
//   // }).primaryKeys();

//   // if (!userID) {
//   //   return result;
//   // }

//   // if (await db.users.update(userID, userchanges) === 1) {
//   //   const updatedUser = await db.users.get(userID);

//   //   if (!updatedUser) {
//   //     result.message = 'Cannot get updated change. Please reload the page.';
//   //     return result;
//   //   }

//   //   localStorage.setItem(
//   //     'sw-config',
//   //     JSON.stringify({
//   //       token: encryptor({ data: updatedUser })
//   //     })
//   //   );

//   //   result.success = true;
//   //   result.message = 'Update success';
//   //   return result;
//   // }

//   result.message = 'Update failed. Try again later.';
//   return result;
// }
