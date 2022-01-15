
import type { SWUserCollection } from './users';
import type { SWProduct } from './prods';

import Dexie, { Table } from 'dexie';
import { usertable } from './users';
import { seedProducts } from './prods';

export class SwatchDatabase extends Dexie {
  users!: Table<SWUserCollection>;
  products!: Table<SWProduct>;

  constructor () {
    super('SwatchDatabase');
    this.version(1).stores({
      users: usertable({
        account: ['email', 'username', 'password'],
        profile: ['firstName', 'lastName', 'nickName']
      }),
      products: ['++id', 'title', 'slug', 'images', 'price', 'stock', 'swatch', 'attributes'].join(', ')
    });
  }
}

export const db = new SwatchDatabase();
db.transaction('rw', db.products, seedProducts);
// db.delete();
