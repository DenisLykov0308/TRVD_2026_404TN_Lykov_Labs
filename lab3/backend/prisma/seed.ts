import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@test.com';
  const legacyAdminEmail = 'admin@warehouse.local';
  const adminPasswordHash = await bcrypt.hash('12345678', 10);
  const managerPasswordHash = await bcrypt.hash('Manager123!', 10);

  const adminRole = await prisma.role.upsert({
    where: { name: 'Адміністратор' },
    update: {},
    create: { name: 'Адміністратор' },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: 'Комірник' },
    update: {},
    create: { name: 'Комірник' },
  });

  const currentAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  const legacyAdmin = currentAdmin
    ? null
    : await prisma.user.findUnique({
        where: { email: legacyAdminEmail },
      });
  if (legacyAdmin) {
    await prisma.user.update({
      where: { email: legacyAdminEmail },
      data: {
        email: adminEmail,
        password_hash: adminPasswordHash,
      },
    });
  }
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      full_name: 'Системний адміністратор',
      password_hash: adminPasswordHash,
      role_id: adminRole.id,
      is_active: true,
    },
    create: {
      full_name: 'Системний адміністратор',
      email: adminEmail,
      password_hash: adminPasswordHash,
      role_id: adminRole.id,
      is_active: true,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@warehouse.local' },
    update: {
      full_name: 'Марія Складська',
      role_id: managerRole.id,
      is_active: true,
    },
    create: {
      full_name: 'Марія Складська',
      email: 'manager@warehouse.local',
      password_hash: managerPasswordHash,
      role_id: managerRole.id,
      is_active: true,
    },
  });

  const unit = await prisma.unit.upsert({
    where: { short_name: 'шт' },
    update: { name: 'Штука' },
    create: {
      name: 'Штука',
      short_name: 'шт',
    },
  });

  const category = await prisma.category.upsert({
    where: { name: 'Електроніка' },
    update: {
      description: 'Пристрої та комплектуючі',
    },
    create: {
      name: 'Електроніка',
      description: 'Пристрої та комплектуючі',
    },
  });

  const supplier = await prisma.supplier.upsert({
    where: { name: 'ТОВ ТехноПостач' },
    update: {
      contact_person: 'Іван Петренко',
      phone: '+380501112233',
      email: 'sales@technopostach.ua',
      address: 'м. Київ, вул. Центральна, 10',
    },
    create: {
      name: 'ТОВ ТехноПостач',
      contact_person: 'Іван Петренко',
      phone: '+380501112233',
      email: 'sales@technopostach.ua',
      address: 'м. Київ, вул. Центральна, 10',
    },
  });

  const customer = await prisma.customer.upsert({
    where: { name: 'ТОВ Рітейл Центр' },
    update: {
      contact_person: 'Олена Коваль',
      phone: '+380671234567',
      email: 'office@retail-center.ua',
      address: 'м. Львів, вул. Галицька, 8',
    },
    create: {
      name: 'ТОВ Рітейл Центр',
      contact_person: 'Олена Коваль',
      phone: '+380671234567',
      email: 'office@retail-center.ua',
      address: 'м. Львів, вул. Галицька, 8',
    },
  });

  const product = await prisma.product.upsert({
    where: { sku: 'NB-001' },
    update: {
      name: 'Ноутбук офісний',
      description: 'Базова модель для офісної роботи',
      category_id: category.id,
      supplier_id: supplier.id,
      unit_id: unit.id,
      price: 25000,
      min_quantity: 2,
    },
    create: {
      name: 'Ноутбук офісний',
      sku: 'NB-001',
      description: 'Базова модель для офісної роботи',
      category_id: category.id,
      supplier_id: supplier.id,
      unit_id: unit.id,
      price: 25000,
      quantity: 0,
      min_quantity: 2,
    },
  });

  const receipt = await prisma.stockReceipt.upsert({
    where: { receipt_number: 'REC-001' },
    update: {
      supplier_id: supplier.id,
      created_by: admin.id,
      receipt_date: new Date('2026-03-25T10:00:00.000Z'),
      status: 'COMPLETED',
      total_amount: 125000,
      comment: 'Тестове надходження товару',
    },
    create: {
      receipt_number: 'REC-001',
      supplier_id: supplier.id,
      created_by: admin.id,
      receipt_date: new Date('2026-03-25T10:00:00.000Z'),
      status: 'COMPLETED',
      total_amount: 125000,
      comment: 'Тестове надходження товару',
    },
  });

  const receiptItem = await prisma.stockReceiptItem.findFirst({
    where: {
      receipt_id: receipt.id,
      product_id: product.id,
    },
  });

  if (!receiptItem) {
    await prisma.stockReceiptItem.create({
      data: {
        receipt_id: receipt.id,
        product_id: product.id,
        quantity: 5,
        unit_price: 25000,
        line_total: 125000,
      },
    });
  }

  const receiptTransaction = await prisma.inventoryTransaction.findFirst({
    where: {
      product_id: product.id,
      reference_type: 'stock_receipt',
      reference_id: receipt.id,
    },
  });

  if (!receiptTransaction) {
    await prisma.inventoryTransaction.create({
      data: {
        product_id: product.id,
        transaction_type: 'IN',
        quantity: 5,
        reference_type: 'stock_receipt',
        reference_id: receipt.id,
        created_by: admin.id,
        transaction_date: new Date('2026-03-25T10:00:00.000Z'),
        comment: 'Тестове надходження товару',
      },
    });
  }

  const shipment = await prisma.stockShipment.upsert({
    where: { shipment_number: 'SHP-001' },
    update: {
      customer_id: customer.id,
      created_by: manager.id,
      shipment_date: new Date('2026-03-25T12:00:00.000Z'),
      status: 'COMPLETED',
      total_amount: 50000,
      comment: 'Тестове відвантаження клієнту',
    },
    create: {
      shipment_number: 'SHP-001',
      customer_id: customer.id,
      created_by: manager.id,
      shipment_date: new Date('2026-03-25T12:00:00.000Z'),
      status: 'COMPLETED',
      total_amount: 50000,
      comment: 'Тестове відвантаження клієнту',
    },
  });

  const shipmentItem = await prisma.stockShipmentItem.findFirst({
    where: {
      shipment_id: shipment.id,
      product_id: product.id,
    },
  });

  if (!shipmentItem) {
    await prisma.stockShipmentItem.create({
      data: {
        shipment_id: shipment.id,
        product_id: product.id,
        quantity: 2,
        unit_price: 25000,
        line_total: 50000,
      },
    });
  }

  const shipmentTransaction = await prisma.inventoryTransaction.findFirst({
    where: {
      product_id: product.id,
      reference_type: 'stock_shipment',
      reference_id: shipment.id,
    },
  });

  if (!shipmentTransaction) {
    await prisma.inventoryTransaction.create({
      data: {
        product_id: product.id,
        transaction_type: 'OUT',
        quantity: 2,
        reference_type: 'stock_shipment',
        reference_id: shipment.id,
        created_by: manager.id,
        transaction_date: new Date('2026-03-25T12:00:00.000Z'),
        comment: 'Тестове відвантаження клієнту',
      },
    });
  }

  await prisma.product.update({
    where: { id: product.id },
    data: {
      quantity: 3,
    },
  });

  const counts = {
    roles: await prisma.role.count(),
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    suppliers: await prisma.supplier.count(),
    customers: await prisma.customer.count(),
    units: await prisma.unit.count(),
    products: await prisma.product.count(),
    receipts: await prisma.stockReceipt.count(),
    shipments: await prisma.stockShipment.count(),
    inventoryTransactions: await prisma.inventoryTransaction.count(),
  };

  console.log('Seed успішно виконано.');
  console.log(JSON.stringify(counts, null, 2));
}

main()
  .catch(async (error) => {
    console.error('Помилка під час виконання seed:', error);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
