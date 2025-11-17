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
