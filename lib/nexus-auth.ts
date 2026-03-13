/**
 * Nexus portal auth – user store and password hashing.
 * Christian de Coster (Chr.coster) is admin: can create users, change/reset passwords.
 * Persistence: data/nexus-users.json (create with seed on first run). On serverless (e.g. Vercel)
 * the filesystem may be read-only; then only seed users work until you switch to a DB or KV.
 */

import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import path from 'path'

const SALT_LEN = 16
const NEXUS_USERS_PATH = path.join(process.cwd(), 'data', 'nexus-users.json')

export type NexusUser = {
  id: string
  name: string
  username: string
  /** Stored as salt:hash (hex) */
  passwordHash: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

function hashPassword(plain: string, salt?: string): { salt: string; hash: string } {
  const s = salt ?? randomBytes(SALT_LEN).toString('hex')
  const h = createHash('sha256').update(s + plain).digest('hex')
  return { salt: s, hash: h }
}

export function hashPasswordForStore(plain: string): string {
  const { salt, hash } = hashPassword(plain)
  return `${salt}:${hash}`
}

export function verifyPassword(plain: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  if (!salt || !hash) return false
  const { hash: expected } = hashPassword(plain, salt)
  try {
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

const SEED_USERS: Omit<NexusUser, 'createdAt' | 'updatedAt'>[] = [
  { id: 'nexus-1', name: 'Christian de Coster', username: 'Chr.coster', passwordHash: '', role: 'admin' },
  { id: 'nexus-2', name: 'Natascha de Coster', username: 'Nta.coster', passwordHash: '', role: 'user' },
  { id: 'nexus-3', name: 'Karen Thompson', username: 'Kar.thompson', passwordHash: '', role: 'user' },
  { id: 'nexus-4', name: 'Jan de Coster', username: 'Jan.coster', passwordHash: '', role: 'user' },
  { id: 'nexus-5', name: 'Sabrina Winter-Martinez', username: 'Sab.w-martinez', passwordHash: '', role: 'user' },
  { id: 'nexus-6', name: 'Marco Hochrein', username: 'Mar.Hochrein', passwordHash: '', role: 'user' },
]

const SEED_PASSWORDS: Record<string, string> = {
  'Chr.coster': 'Matnachweis1!',
  'Nta.coster': 'miLch2026!',
  'Kar.thompson': '47(q>0vgt8Rd',
  'Jan.coster': 'vj=c|AH*939T',
  'Sab.w-martinez': '=b&13|057Vjq',
  'Mar.Hochrein': 'wZtz|R*5h47>',
}

function ensureDataDir() {
  const dir = path.dirname(NEXUS_USERS_PATH)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function loadUsers(): NexusUser[] {
  ensureDataDir()
  if (!existsSync(NEXUS_USERS_PATH)) {
    const now = new Date().toISOString()
    const users: NexusUser[] = SEED_USERS.map((u) => ({
      ...u,
      passwordHash: hashPasswordForStore(SEED_PASSWORDS[u.username] ?? 'ChangeMe1!'),
      createdAt: now,
      updatedAt: now,
    }))
    writeFileSync(NEXUS_USERS_PATH, JSON.stringify(users, null, 2), 'utf-8')
    return users
  }
  const raw = readFileSync(NEXUS_USERS_PATH, 'utf-8')
  try {
    return JSON.parse(raw) as NexusUser[]
  } catch {
    return []
  }
}

function saveUsers(users: NexusUser[]) {
  ensureDataDir()
  writeFileSync(NEXUS_USERS_PATH, JSON.stringify(users, null, 2), 'utf-8')
}

export function findNexusUserByUsername(username: string): NexusUser | undefined {
  const users = loadUsers()
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase())
}

export function verifyNexusCredentials(username: string, password: string): NexusUser | null {
  const user = findNexusUserByUsername(username)
  if (!user || !verifyPassword(password, user.passwordHash)) return null
  return user
}

export function isNexusAdmin(username: string): boolean {
  const user = findNexusUserByUsername(username)
  return user?.role === 'admin'
}

export function listNexusUsers(): NexusUser[] {
  return loadUsers().map(({ passwordHash: _, ...u }) => ({ ...u, passwordHash: '' }))
}

export function createNexusUser(data: { name: string; username: string; password: string; role?: 'user' | 'admin' }): NexusUser | { error: string } {
  const users = loadUsers()
  if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase()))
    return { error: 'Username already exists.' }
  const now = new Date().toISOString()
  const id = `nexus-${Date.now()}`
  const user: NexusUser = {
    id,
    name: data.name,
    username: data.username,
    passwordHash: hashPasswordForStore(data.password),
    role: data.role ?? 'user',
    createdAt: now,
    updatedAt: now,
  }
  users.push(user)
  saveUsers(users)
  return { ...user, passwordHash: '' }
}

export function updateNexusUserPassword(id: string, newPassword: string): NexusUser | { error: string } {
  const users = loadUsers()
  const i = users.findIndex((u) => u.id === id)
  if (i < 0) return { error: 'User not found.' }
  users[i].passwordHash = hashPasswordForStore(newPassword)
  users[i].updatedAt = new Date().toISOString()
  saveUsers(users)
  const { passwordHash: _, ...u } = users[i]
  return { ...u, passwordHash: '' }
}

export function getNexusUserById(id: string): NexusUser | undefined {
  return loadUsers().find((u) => u.id === id)
}
