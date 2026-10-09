import { strict as assert } from 'node:assert'
import { readFile } from 'node:fs/promises'
import type { AddressInfo } from 'node:net'
import { randomUUID } from 'node:crypto'
import test from 'node:test'
import { Pool } from 'pg'
import { createApp } from './app.ts'

const databaseUrl = process.env.TEST_DATABASE_URL

class Client {
  cookie?: string
  private readonly baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async request(method: string, path: string, body?: unknown) {
    const headers: Record<string, string> = {}
    if (body !== undefined) headers['content-type'] = 'application/json'
    if (this.cookie) headers.cookie = this.cookie

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      const cookie = setCookie.split(';', 1)[0]
      this.cookie = cookie.endsWith('=') ? undefined : cookie
    }
    return response
  }
}

test('account lifecycle', { skip: databaseUrl ? false : 'TEST_DATABASE_URL is not set' }, async () => {
  assert.ok(databaseUrl)
  const schema = `auth_test_${randomUUID().replaceAll('-', '')}`
  const admin = new Pool({ connectionString: databaseUrl })
  await admin.query(`CREATE SCHEMA "${schema}"`)

  const pool = new Pool({
    connectionString: databaseUrl,
    options: `-c search_path=${schema},public`,
  })
  const migration = await readFile(new URL('../migrations/001_accounts.sql', import.meta.url), 'utf8')
  await pool.query(migration)

  const server = await new Promise<ReturnType<ReturnType<typeof createApp>['listen']>>((resolve) => {
    const listeningServer = createApp(pool, 'test-session-secret').listen(0, () => resolve(listeningServer))
  })
  const address = server.address() as AddressInfo
  const baseUrl = `http://127.0.0.1:${address.port}`
  const first = new Client(baseUrl)
  const second = new Client(baseUrl)

  try {
    let response = await first.request('POST', '/api/register', { username: 'Player_One', password: 'password-one' })
    assert.equal(response.status, 201)
    assert.equal((await response.json() as { user: { username: string } }).user.username, 'player_one')

    response = await first.request('GET', '/api/me')
    assert.equal(response.status, 200)

    response = await second.request('POST', '/api/register', { username: 'player_one', password: 'password-two' })
    assert.equal(response.status, 409)

    response = await second.request('POST', '/api/register', { username: 'no spaces', password: 'password-two' })
    assert.equal(response.status, 400)

    response = await second.request('POST', '/api/login', { username: 'player_one', password: 'wrong-password' })
    assert.equal(response.status, 401)

    response = await second.request('POST', '/api/login', { username: 'player_one', password: 'password-one' })
    assert.equal(response.status, 200)

    const third = new Client(baseUrl)
    response = await third.request('POST', '/api/register', { username: 'other_user', password: 'password-two' })
    assert.equal(response.status, 201)

    response = await first.request('PATCH', '/api/me', { username: 'other_user' })
    assert.equal(response.status, 409)

    response = await first.request('PATCH', '/api/me', { username: 'Player_Two' })
    assert.equal(response.status, 200)
    assert.equal((await response.json() as { user: { username: string } }).user.username, 'player_two')

    response = await first.request('PATCH', '/api/me/password', {
      currentPassword: 'password-one',
      newPassword: 'password-new',
    })
    assert.equal(response.status, 204)

    response = await second.request('GET', '/api/me')
    assert.equal(response.status, 401)

    response = await second.request('POST', '/api/login', { username: 'player_two', password: 'password-one' })
    assert.equal(response.status, 401)

    response = await first.request('POST', '/api/logout')
    assert.equal(response.status, 204)
    response = await first.request('POST', '/api/logout')
    assert.equal(response.status, 204)
    response = await first.request('GET', '/api/me')
    assert.equal(response.status, 401)

    response = await first.request('POST', '/api/login', { username: 'player_two', password: 'password-new' })
    assert.equal(response.status, 200)
    response = await second.request('POST', '/api/login', { username: 'player_two', password: 'password-new' })
    assert.equal(response.status, 200)

    response = await first.request('DELETE', '/api/me', { password: 'wrong-password' })
    assert.equal(response.status, 401)
    response = await first.request('DELETE', '/api/me', { password: 'password-new' })
    assert.equal(response.status, 204)
    response = await second.request('GET', '/api/me')
    assert.equal(response.status, 401)
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
    await pool.end()
    await admin.query(`DROP SCHEMA "${schema}" CASCADE`)
    await admin.end()
  }
})
