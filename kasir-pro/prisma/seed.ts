import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash passwords
  const adminPass = await bcrypt.hash("admin123", 10);
  const kasirPass = await bcrypt.hash("kasir123", 10);

  // Users
  const admin = await prisma.user.upsert({
    where: { email: "admin@kasirpro.id" },
    update: {},
    create: {
      name: "Admin KasirPro",
      email: "admin@kasirpro.id",
      password: adminPass,
      role: "ADMIN",
    },
  });

  const kasir = await prisma.user.upsert({
    where: { email: "kasir@kasirpro.id" },
    update: {},
    create: {
      name: "Kasir Toko",
      email: "kasir@kasirpro.id",
      password: kasirPass,
      role: "KASIR",
    },
  });

  // Settings
  await prisma.setting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "Digital Store KasirPro",
      address: "Jl. Merdeka No. 123, Jakarta Pusat",
      phone: "0812-3456-7890",
      email: "hello@kasirpro.id",
      taxRate: 11,
      taxEnabled: true,
      currency: "IDR",
      receiptNote: "Terima kasih atas kunjungan Anda",
      footerNote: "Barang yang dibeli tidak dapat dikembalikan",
      qrisEnabled: true,
    },
  });

  // Categories
  const categories = [
    { name: "Elektronik", description: "Perangkat elektronik dan aksesoris" },
    { name: "Aksesoris HP", description: "Aksesoris ponsel" },
    { name: "Gaming", description: "Perlengkapan gaming" },
    { name: "Audio", description: "Perangkat audio" },
    { name: "Pulsa & Voucher", description: "Pulsa dan voucher digital" },
  ];
  const createdCategories = [];
  for (const c of categories) {
    const cat = await prisma.category.create({ data: c });
    createdCategories.push(cat);
  }

  const catByName = (n: string) => createdCategories.find((c) => c.name === n)!;

  // Products
  const products = [
    { name: "Mouse Wireless Logitech M170", sku: "ELK-MSE-001", category: "Elektronik", price: 145000, cost: 110000, stock: 45 },
    { name: "Keyboard Mechanical Redragon", sku: "ELK-KBD-002", category: "Elektronik", price: 385000, cost: 300000, stock: 22 },
    { name: "Flashdisk 32GB SanDisk", sku: "ELK-FLS-003", category: "Elektronik", price: 68000, cost: 50000, stock: 80 },
    { name: "Webcam HD 1080p", sku: "ELK-WBC-004", category: "Elektronik", price: 220000, cost: 165000, stock: 15 },
    { name: "Power Bank 10000mAh", sku: "AKS-PWB-005", category: "Aksesoris HP", price: 185000, cost: 140000, stock: 30 },
    { name: "Casing iPhone 13 Benos", sku: "AKS-CSG-006", category: "Aksesoris HP", price: 45000, cost: 28000, stock: 120 },
    { name: "Screen Guard Samsung A52", sku: "AKS-TPG-007", category: "Aksesoris HP", price: 25000, cost: 15000, stock: 60 },
    { name: "Charger Fast Charging 25W", sku: "AKS-CHR-008", category: "Aksesoris HP", price: 95000, cost: 70000, stock: 40 },
    { name: "Headset Gaming RGB", sku: "GAM-HST-009", category: "Gaming", price: 275000, cost: 210000, stock: 18 },
    { name: "Mousepad XL Gaming", sku: "GAM-MPD-010", category: "Gaming", price: 65000, cost: 42000, stock: 50 },
    { name: "Controller PS5 DualSense", sku: "GAM-CTL-011", category: "Gaming", price: 850000, cost: 720000, stock: 8 },
    { name: "Earphone TWS Bluetooth", sku: "AUD-TWS-012", category: "Audio", price: 155000, cost: 110000, stock: 35 },
    { name: "Speaker Mini Portable", sku: "AUD-SPK-013", category: "Audio", price: 125000, cost: 90000, stock: 28 },
    { name: "Headphone Over-Ear", sku: "AUD-HPH-014", category: "Audio", price: 320000, cost: 250000, stock: 12 },
    { name: "Pulsa Telkomsel 50K", sku: "VOC-PLS-015", category: "Pulsa & Voucher", price: 51500, cost: 50000, stock: 999 },
    { name: "Voucher Google Play 20K", sku: "VOC-GGP-016", category: "Pulsa & Voucher", price: 21000, cost: 20000, stock: 999 },
    { name: "Voucher Steam 100K", sku: "VOC-STM-017", category: "Pulsa & Voucher", price: 102000, cost: 100000, stock: 999 },
    { name: "HDMI Kabel 2 Meter", sku: "ELK-HDM-018", category: "Elektronik", price: 35000, cost: 22000, stock: 70 },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        sku: p.sku,
        categoryId: catByName(p.category).id,
        price: p.price,
        cost: p.cost,
        stock: p.stock,
        image: null,
        isActive: true,
      },
    });
  }

  // Customers
  const customers = [
    { name: "Budi Santoso", phone: "0812-1111-2222", email: "budi@example.com", address: "Jl. Mawar No. 5, Jakarta" },
    { name: "Siti Rahma", phone: "0813-3333-4444", email: "siti@example.com", address: "Jl. Melati No. 12, Bandung" },
    { name: "Andi Wijaya", phone: "0857-5555-6666", email: null, address: "Jl. Anggrek No. 8, Surabaya" },
    { name: "Dewi Lestari", phone: "0821-7777-8888", email: "dewi@example.com", address: null },
    { name: "Pelanggan Umum", phone: null, email: null, address: null },
  ];
  for (const c of customers) {
    await prisma.customer.create({ data: c });
  }

  // Sample transactions over the past several days for dashboard/reports
  const allProducts = await prisma.product.findMany();
  const now = new Date();
  let invoiceCounter = 1;
  const pad = (n: number, len: number) => String(n).padStart(len, "0");

  for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
    const txCount = 2 + Math.floor(Math.random() * 4); // 2-5 tx per day
    for (let t = 0; t < txCount; t++) {
      const date = new Date(now);
      date.setDate(now.getDate() - dayOffset);
      date.setHours(9 + Math.floor(Math.random() * 11), Math.floor(Math.random() * 60), 0, 0);

      const itemCount = 1 + Math.floor(Math.random() * 4);
      const chosen = [];
      for (let i = 0; i < itemCount; i++) {
        const prod = allProducts[Math.floor(Math.random() * allProducts.length)];
        if (!chosen.find((c) => c.productId === prod.id)) {
          chosen.push({ productId: prod.id, productName: prod.name, quantity: 1 + Math.floor(Math.random() * 3), price: prod.price });
        }
      }
      const subtotal = chosen.reduce((s, c) => s + c.price * c.quantity, 0);
      const taxRate = 11;
      const taxAmount = Math.round((subtotal * taxRate) / 100);
      const total = subtotal + taxAmount;
      const method = ["CASH", "TRANSFER", "QRIS"][Math.floor(Math.random() * 3)];
      const amountPaid = method === "CASH" ? Math.ceil(total / 5000) * 5000 : total;
      const change = amountPaid - total;

      const tx = await prisma.transaction.create({
        data: {
          invoiceNumber: `INV${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(date.getDate(), 2)}-${pad(invoiceCounter++, 4)}`,
          cashierId: Math.random() > 0.5 ? admin.id : kasir.id,
          subtotal,
          discount: 0,
          taxRate,
          taxAmount,
          total,
          status: "COMPLETED",
          createdAt: date,
          payment: {
            create: {
              method,
              amountPaid,
              change,
            },
          },
          details: {
            create: chosen.map((c) => ({
              productId: c.productId,
              productName: c.productName,
              quantity: c.quantity,
              price: c.price,
              subtotal: c.price * c.quantity,
            })),
          },
        },
      });
      // decrement stock
      for (const c of chosen) {
        await prisma.product.update({
          where: { id: c.productId },
          data: { stock: { decrement: c.quantity } },
        });
      }
      void tx;
    }
  }

  console.log("Seed complete.");
  console.log("Admin login: admin@kasirpro.id / admin123");
  console.log("Kasir login: kasir@kasirpro.id / kasir123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
