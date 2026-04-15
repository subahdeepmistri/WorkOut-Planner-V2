import { openDB } from "idb";

interface PendingMutation {
  id: string;
  endpoint: string;
  method: "POST" | "PATCH" | "DELETE";
  payload: Record<string, unknown>;
  createdAt: number;
}

const DB_NAME = "pulseforge-offline";
const STORE_NAME = "mutations";

async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    }
  });
}

export async function addPendingMutation(mutation: PendingMutation) {
  const db = await getDb();
  await db.put(STORE_NAME, mutation);
}

export async function getPendingMutations() {
  const db = await getDb();
  return db.getAll(STORE_NAME) as Promise<PendingMutation[]>;
}

export async function removePendingMutation(id: string) {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

export async function flushOfflineQueue() {
  const pending = await getPendingMutations();

  for (const mutation of pending.sort((a, b) => a.createdAt - b.createdAt)) {
    try {
      await fetch(mutation.endpoint, {
        method: mutation.method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(mutation.payload)
      });
      await removePendingMutation(mutation.id);
    } catch {
      break;
    }
  }
}
