import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL_DEV || process.env.NEXT_PUBLIC_BACKEND_URL_PROD || '';

function baseUrl() {
  return BASE.replace(/\/$/, '');
}

export async function fetchCategories() {
  const url = `${baseUrl()}/categories`;
  const res = await axios.get(url);
  return res.data; // expected: Category[] including related words
}

export async function fetchWords(categoryId?: number) {
  const url = `${baseUrl()}/words${categoryId ? `?categoryId=${categoryId}` : ''}`;
  const res = await axios.get(url);
  return res.data;
}

/**
 * Fetch words and return only those that have a non-null `layout` value.
 * Useful for building the homepage positions (home_layout/layout).
 */
export async function fetchWordsWithLayout() {
  const words = await fetchWords();
  if (!Array.isArray(words)) return [];
  return words.filter((w: any) => w && ((w.layout !== null && w.layout !== undefined) || (w.home_layout !== null && w.home_layout !== undefined)));
}
