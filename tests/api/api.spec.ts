import { test, expect } from '@playwright/test';

const DUMMYJSON_AUTH = 'https://dummyjson.com/auth';
const DUMMYJSON_PRODUCTS = 'https://dummyjson.com/products';

//This data should be in a separate and secure file and should be imported from there.
const AUTH_USER = {
    username: 'emilys',
    password: 'emilyspass',
  } as const;

test.describe('DummyJSON auth', () => {
  test('login and GET /auth/me with Bearer token', async ({ request }) => {
    const loginRes = await request.post(`${DUMMYJSON_AUTH}/login`, {
      data: {
        username: AUTH_USER.username,
        password: AUTH_USER.password,
        expiresInMins: 30,
      },
    });
    expect(loginRes.status()).toBe(200);
    const loginBody = await loginRes.json();
    expect(loginBody.accessToken).toBeTruthy();
    expect(loginBody.refreshToken).toBeTruthy();

    const meRes = await request.get(`${DUMMYJSON_AUTH}/me`, {
      headers: {
        Authorization: `Bearer ${loginBody.accessToken}`,
      },
    });
    expect(meRes.status()).toBe(200);
    const me = await meRes.json();
    expect(me.username).toBe('emilys');
    expect(me.email).toContain('emily');
  });

  test('refresh returns new tokens', async ({ request }) => {
    const loginRes = await request.post(`${DUMMYJSON_AUTH}/login`, {
      data: {
        username: AUTH_USER.username,
        password: AUTH_USER.password,
        expiresInMins: 30,
      },
    });
    expect(loginRes.ok()).toBeTruthy();
    const { refreshToken } = await loginRes.json();
    const refreshRes = await request.post(`${DUMMYJSON_AUTH}/refresh`, {
      data: {
        refreshToken,
        expiresInMins: 30,
      },
    });
    expect(refreshRes.status()).toBe(200);
    const tokens = await refreshRes.json();
    expect(tokens.accessToken).toBeTruthy();
    expect(tokens.refreshToken).toBeTruthy();
  });
});

test.describe('DummyJSON products', () => {
  test('GET all products returns paginated list (default limit 30)', async ({ request }) => {
    const res = await request.get(DUMMYJSON_PRODUCTS);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBe(30);
    expect(body.limit).toBe(30);
    expect(body.skip).toBe(0);
    expect(typeof body.total).toBe('number');
    expect(body.total).toBeGreaterThan(30);
    const first = body.products[0];
    expect(first).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      price: expect.any(Number),
    });
  });

  test('GET single product by id', async ({ request }) => {
    const res = await request.get(`${DUMMYJSON_PRODUCTS}/1`);
    expect(res.status()).toBe(200);
    const p = await res.json();
    expect(p.id).toBe(1);
    expect(p.title).toContain('Essence Mascara');
    expect(p.category).toBe('beauty');
    expect(Array.isArray(p.tags)).toBe(true);
  });

  test('GET search products by query', async ({ request }) => {
    const res = await request.get(`${DUMMYJSON_PRODUCTS}/search`, {
      params: { q: 'phone' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.total).toBeGreaterThan(0);
    expect(body.products.length).toBeGreaterThan(0);
    const matchesQuery = body.products.some((p: { title: string }) =>
      /phone/i.test(p.title),
    );
    expect(matchesQuery).toBe(true);
  });

  test('GET products with limit, skip and select fields', async ({ request }) => {
    const res = await request.get(DUMMYJSON_PRODUCTS, {
      params: { limit: 10, skip: 10, select: 'title,price' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.products.length).toBe(10);
    expect(body.skip).toBe(10);
    expect(body.limit).toBe(10);
    for (const p of body.products) {
      expect(p).toEqual({
        id: expect.any(Number),
        title: expect.any(String),
        price: expect.any(Number),
      });
    }
  });

  test('GET all product categories (objects with slug, name, url)', async ({ request }) => {
    const res = await request.get(`${DUMMYJSON_PRODUCTS}/categories`);
    expect(res.status()).toBe(200);
    const categories = await res.json();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toMatchObject({
      slug: expect.any(String),
      name: expect.any(String),
      url: expect.any(String),
    });
    const beauty = categories.find((c: { slug: string }) => c.slug === 'beauty');
    expect(beauty?.name).toBe('Beauty');
  });

  test('GET category list returns slugs', async ({ request }) => {
    const res = await request.get(`${DUMMYJSON_PRODUCTS}/category-list`);
    expect(res.status()).toBe(200);
    const list = await res.json();
    expect(Array.isArray(list)).toBe(true);
    expect(list.every((item: unknown) => typeof item === 'string')).toBe(true);
    expect(list).toContain('smartphones');
    expect(list).toContain('beauty');
  });

  test('GET products by category slug', async ({ request }) => {
    const res = await request.get(`${DUMMYJSON_PRODUCTS}/category/smartphones`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    expect(
      body.products.every((p: { category: string }) => p.category === 'smartphones'),
    ).toBe(true);
    expect(body.total).toBe(body.products.length);
  });

  test('POST add product returns simulated created resource with id', async ({ request }) => {
    const res = await request.post(`${DUMMYJSON_PRODUCTS}/add`, {
      data: { title: 'BMW Pencil' },
    });
    expect(res.status()).toBe(201);
    const p = await res.json();
    expect(p.id).toEqual(expect.any(Number));
    expect(p.title).toBe('BMW Pencil');
  });

  test('PUT update product returns simulated merged resource', async ({ request }) => {
    const res = await request.put(`${DUMMYJSON_PRODUCTS}/1`, {
      data: { title: 'iPhone Galaxy +1' },
    });
    expect(res.status()).toBe(200);
    const p = await res.json();
    expect(p.id).toBe(1);
    expect(p.title).toBe('iPhone Galaxy +1');
  });

  test('DELETE product returns simulated deletion metadata', async ({ request }) => {
    const res = await request.delete(`${DUMMYJSON_PRODUCTS}/1`);
    expect(res.status()).toBe(200);
    const p = await res.json();
    expect(p.id).toBe(1);
    expect(p.isDeleted).toBe(true);
    expect(p.deletedOn).toBeTruthy();
  });
});