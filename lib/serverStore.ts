import { DiamondPackage, Order, Coupon, StoreSettings } from './types';
import { INITIAL_PACKAGES, INITIAL_ORDERS, INITIAL_COUPONS, INITIAL_SETTINGS } from './data';
import fs from 'fs';
import path from 'path';

interface StorageData {
  packages: DiamondPackage[];
  orders: Order[];
  coupons: Coupon[];
  settings: StoreSettings;
}

const DATA_DIR = path.join(process.cwd(), '.store_data');
const DATA_FILE = path.join(DATA_DIR, 'store_state.json');

function ensureDataFile(): StorageData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        packages: parsed.packages || INITIAL_PACKAGES,
        orders: parsed.orders || INITIAL_ORDERS,
        coupons: parsed.coupons || INITIAL_COUPONS,
        settings: parsed.settings || INITIAL_SETTINGS,
      };
    }
  } catch (err) {
    console.error('Error reading store file, using in-memory defaults:', err);
  }

  const initialData: StorageData = {
    packages: INITIAL_PACKAGES,
    orders: INITIAL_ORDERS,
    coupons: INITIAL_COUPONS,
    settings: INITIAL_SETTINGS,
  };

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (e) {
    console.error('Could not persist initial data file:', e);
  }

  return initialData;
}

function saveData(data: StorageData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store data:', err);
  }
}

export function getPackages(): DiamondPackage[] {
  const data = ensureDataFile();
  return data.packages;
}

export function savePackages(packages: DiamondPackage[]): DiamondPackage[] {
  const data = ensureDataFile();
  data.packages = packages;
  saveData(data);
  return data.packages;
}

export function getOrders(): Order[] {
  const data = ensureDataFile();
  return data.orders;
}

export function getOrderByIdOrUid(query: string): Order | undefined {
  const data = ensureDataFile();
  const q = query.trim().toUpperCase();
  return data.orders.find(o => 
    o.orderNumber.toUpperCase() === q || 
    o.id.toUpperCase() === q || 
    o.playerUid === query.trim()
  );
}

export function createOrder(order: Order): Order {
  const data = ensureDataFile();
  data.orders.unshift(order);
  saveData(data);
  return order;
}

export function updateOrderStatus(
  orderId: string, 
  paymentStatus?: Order['paymentStatus'], 
  deliveryStatus?: Order['deliveryStatus'],
  notes?: string
): Order | null {
  const data = ensureDataFile();
  const index = data.orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
  if (index === -1) return null;

  const current = data.orders[index];
  const updated: Order = {
    ...current,
    paymentStatus: paymentStatus || current.paymentStatus,
    deliveryStatus: deliveryStatus || current.deliveryStatus,
    updatedAt: new Date().toISOString(),
    deliveredAt: deliveryStatus === 'delivered' ? new Date().toISOString() : current.deliveredAt,
    fulfillmentNotes: notes !== undefined ? notes : current.fulfillmentNotes,
  };

  data.orders[index] = updated;
  saveData(data);
  return updated;
}

export function getSettings(): StoreSettings {
  const data = ensureDataFile();
  return data.settings;
}

export function updateSettings(settings: Partial<StoreSettings>): StoreSettings {
  const data = ensureDataFile();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
  return data.settings;
}

export function getCoupons(): Coupon[] {
  const data = ensureDataFile();
  return data.coupons;
}

export function resetStoreData(): StorageData {
  const fresh: StorageData = {
    packages: INITIAL_PACKAGES,
    orders: INITIAL_ORDERS,
    coupons: INITIAL_COUPONS,
    settings: INITIAL_SETTINGS,
  };
  saveData(fresh);
  return fresh;
}
