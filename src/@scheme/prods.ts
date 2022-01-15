import { db } from '@scheme';
import Watches from './json/watch.json';

export interface SWProductSwatches {
  images: string[];
  current: number;
  name: string;
}

export interface SWProductAttributes {
  case: {
    collection: string;
    material: string;
    finishes: string;
  };
  band: {
    type: string;
    color: string;
  }
}

export interface SWProduct {
  id: number;
  title: string;
  images: string;
  slug: string;
  price: number;
  stock: number;
  swatch: SWProductSwatches;
  attributes: SWProductAttributes;
}

export function seedProducts () {
  db.products.bulkPut(Watches);
}

export type SWProductNav = {
  data: SWProduct[];
  next: boolean,
  currentPage: number,
  itemsPerPage: number,
  maximumPage: number,
  totalNextPages: number,
  totalPages: number,
  totalItems: number,
}

export function reducedProducts (products: SWProduct[], max = 2): SWProduct[] {
  let currentTitle: string;
  let nextTitle: string;

  const reducingProducts: SWProduct[] = [];
  for (let l = 0; l < products.length; l++) {
    const element = products[l];
    const elementNext = products[l + 1];

    if (elementNext) {
      currentTitle = element.title;
      nextTitle = elementNext.title;

      if (currentTitle === nextTitle) {
        continue;
      }
    }

    reducingProducts.push(element);
  }

  return reducingProducts;
}

export async function productNavigation (current = 1): Promise<SWProductNav> {
  const ITEMS_PER_PAGE = 10;
  const MAXIMUM_PAGE = 5;
  const INDEX_START = (current * ITEMS_PER_PAGE) - ITEMS_PER_PAGE;
  const INDEX_ENDS = ((current + 1) * ITEMS_PER_PAGE) - ITEMS_PER_PAGE;

  const products = await db.products.toArray();
  const result = products.slice(INDEX_START, INDEX_ENDS);
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return {
    data: result,
    next: totalPages - current === 0,
    currentPage: current,
    itemsPerPage: ITEMS_PER_PAGE,
    maximumPage: MAXIMUM_PAGE,
    totalNextPages: totalPages - current,
    totalPages: totalPages,
    totalItems: products.length
  };
};
