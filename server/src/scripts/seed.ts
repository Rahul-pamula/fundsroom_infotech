import { pool } from '../config/database.js';
import { hashPassword } from '../utils/password.js';

const run = async () => {
  console.log('Seeding Supabase database with realistic Indian B2B data...');

  const passwordHash = await hashPassword('Password123!');

  // 1. Seed users
  const users = [
    { email: 'admin@fundsroom.local', fullName: 'Admin Manager', role: 'ADMIN' },
    { email: 'sales@fundsroom.local', fullName: 'Arjun Mehta', role: 'SALES' },
    { email: 'warehouse@fundsroom.local', fullName: 'Rohan Patel', role: 'WAREHOUSE' },
    { email: 'accounts@fundsroom.local', fullName: 'Ananya Iyer', role: 'ACCOUNTS' },
  ] as const;

  const seededUsers: Record<string, string> = {};

  for (const user of users) {
    const res = await pool.query(
      `
        INSERT INTO users (email, password_hash, full_name, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (email) DO UPDATE
        SET full_name = EXCLUDED.full_name,
            role = EXCLUDED.role
        RETURNING id
      `,
      [user.email, passwordHash, user.fullName, user.role]
    );
    seededUsers[user.role] = res.rows[0].id;
  }

  const salesId = seededUsers['SALES'];
  const warehouseId = seededUsers['WAREHOUSE'];

  // 2. Seed 10 Indian Customers
  const customers = [
    { name: 'Priya Sharma', mobile: '9876543210', email: 'priya@sharmaoffice.in', business: 'Sharma Office Solutions', type: 'WHOLESALE', gst: '27AAAAA1111A1Z1', address: 'Plot 45, MIDC, Andheri East, Mumbai', status: 'ACTIVE', notes: 'Prefers standard credit terms.' },
    { name: 'Vikram Desai', mobile: '9822334455', email: 'vikram@desaisupplies.co.in', business: 'Desai Industrial Supplies', type: 'DISTRIBUTOR', gst: '24BBBBB2222B2Z2', address: '12 GIDC Estate, Makarpura, Vadodara', status: 'ACTIVE', notes: 'Bulk chemical purchaser.' },
    { name: 'Sneha Reddy', mobile: '9900112233', email: 'sneha@reddyhouse.com', business: 'Reddy Distribution House', type: 'DISTRIBUTOR', gst: '36CCCCC3333C3Z3', address: 'Phase 3, Hitec City, Hyderabad', status: 'ACTIVE', notes: 'Key distributor in Telangana.' },
    { name: 'Karthik Nair', mobile: '9566778899', email: 'karthik@nairpack.in', business: 'Nair Packaging Solutions', type: 'WHOLESALE', gst: '32DDDDD4444D4Z4', address: '45/1 Kinfra Park, Kakkanad, Cochin', status: 'ACTIVE', notes: 'Orders monthly packaging tapes.' },
    { name: 'Neha Verma', mobile: '9811223344', email: 'neha@vermaelec.co.in', business: 'Verma Electronics', type: 'RETAIL', gst: '07EEEEE5555E5Z5', address: 'Connaught Place, New Delhi', status: 'ACTIVE', notes: 'Retail showroom buyer.' },
    { name: 'Aditya Rao', mobile: '9123456789', email: 'aditya@raowholesale.com', business: 'Rao Wholesale Hub', type: 'WHOLESALE', gst: '29FFFFF6666F6Z6', address: 'Peenya Industrial Area, Bengaluru', status: 'ACTIVE', notes: 'Handles hardware accessories.' },
    { name: 'Pooja Shah', mobile: '9321456789', email: 'pooja@shahsupplies.in', business: 'Shah Business Supplies', type: 'RETAIL', gst: '24GGGGG7777G7Z7', address: 'Kalupur Market, Ahmedabad', status: 'LEAD', notes: 'Interested in thermal paper rolls.' },
    { name: 'Rahul Kapoor', mobile: '9830012345', email: 'rahul@kapoortraders.in', business: 'Kapoor Traders', type: 'WHOLESALE', gst: '19HHHHH8888H8Z8', address: 'Salt Lake Sector V, Kolkata', status: 'INACTIVE', notes: 'Payment terms negotiations pending.' },
    { name: 'Meera Joshi', mobile: '9765432100', email: 'meera@joshienterprises.co.in', business: 'Joshi Enterprises', type: 'RETAIL', gst: '27IIIII9999I9Z9', address: 'Shivaji Nagar, Pune', status: 'ACTIVE', notes: 'Consistent buyer of office utilities.' },
    { name: 'Amit Patel', mobile: '9988776655', email: 'amit@patelhardware.in', business: 'Patel Hardware Mart', type: 'WHOLESALE', gst: '24JJJJJ0000J0Z0', address: 'Ring Road, Surat', status: 'ACTIVE', notes: 'Requests pricing catalogs frequently.' },
  ];

  const seededCustomers: Record<string, string> = {};

  for (const c of customers) {
    const existing = await pool.query(`SELECT id FROM customers WHERE email = $1`, [c.email]);
    if (existing.rowCount) {
      await pool.query(
        `
          UPDATE customers
          SET name = $1, mobile = $2, business_name = $3, gst_number = $4, customer_type = $5, address = $6, status = $7, notes = $8
          WHERE email = $9
        `,
        [c.name, c.mobile, c.business, c.gst, c.type, c.address, c.status, c.notes, c.email]
      );
      seededCustomers[c.business] = existing.rows[0].id;
    } else {
      const res = await pool.query(
        `
          INSERT INTO customers (name, mobile, email, business_name, gst_number, customer_type, address, status, notes, created_by)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING id
        `,
        [c.name, c.mobile, c.email, c.business, c.gst, c.type, c.address, c.status, c.notes, salesId]
      );
      seededCustomers[c.business] = res.rows[0].id;
    }
  }

  // 3. Seed 15 realistic products
  const products = [
    { name: 'Wireless Keyboard', sku: 'ELEC-WKEY-01', category: 'Electronics', price: 1450.00, stock: 75, minStock: 15, loc: 'A-01' },
    { name: 'USB-C Multi-Hub', sku: 'ELEC-UCHUB-02', category: 'Electronics', price: 2100.00, stock: 40, minStock: 10, loc: 'A-02' },
    { name: 'LED Monitor 24"', sku: 'ELEC-LED24-03', category: 'Electronics', price: 9500.00, stock: 12, minStock: 5, loc: 'A-03' },
    { name: 'Thermal Paper Roll 57mm', sku: 'OFF-TP57-01', category: 'Office Supplies', price: 45.00, stock: 350, minStock: 50, loc: 'B-01' },
    { name: 'Barcode Laser Scanner', sku: 'ELEC-BARSCAN-04', category: 'Electronics', price: 3200.00, stock: 8, minStock: 10, loc: 'A-04' },
    { name: 'Heavy Duty Packaging Tape', sku: 'PACK-TAPE-01', category: 'Packaging', price: 120.00, stock: 180, minStock: 30, loc: 'C-01' },
    { name: 'Corrugated Shipping Box', sku: 'PACK-BOX-02', category: 'Packaging', price: 35.00, stock: 500, minStock: 100, loc: 'C-02' },
    { name: 'Office Inkjet Printer', sku: 'OFF-PRIN-02', category: 'Office Supplies', price: 11200.00, stock: 4, minStock: 5, loc: 'B-02' },
    { name: 'HDMI Gold Cable 1.5m', sku: 'ACC-HDMI-01', category: 'Accessories', price: 250.00, stock: 95, minStock: 20, loc: 'D-01' },
    { name: 'Gigabit Network Switch', sku: 'ELEC-NETSW-05', category: 'Electronics', price: 4800.00, stock: 0, minStock: 4, loc: 'A-05' },
    { name: 'Desktop Label Printer', sku: 'OFF-LBLPR-03', category: 'Office Supplies', price: 8500.00, stock: 15, minStock: 5, loc: 'B-03' },
    { name: 'Steel Storage Cabinet', sku: 'OFF-CAB-04', category: 'Office Supplies', price: 13500.00, stock: 6, minStock: 2, loc: 'B-04' },
    { name: 'Cat6 Ethernet Cable 305m', sku: 'ACC-CAT6-02', category: 'Accessories', price: 6200.00, stock: 25, minStock: 8, loc: 'D-02' },
    { name: 'Wireless Optical Mouse', sku: 'ELEC-WMSE-06', category: 'Electronics', price: 650.00, stock: 110, minStock: 25, loc: 'A-06' },
    { name: 'Universal Power Adapter', sku: 'ACC-PWR-03', category: 'Accessories', price: 950.00, stock: 45, minStock: 12, loc: 'D-03' },
  ];

  const seededProducts: Record<string, { id: string; price: number }> = {};

  for (const p of products) {
    const res = await pool.query(
      `
        INSERT INTO products (name, sku, category, unit_price, current_stock, min_stock_alert, location)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (sku) DO UPDATE
        SET name = EXCLUDED.name,
            category = EXCLUDED.category,
            unit_price = EXCLUDED.unit_price,
            current_stock = EXCLUDED.current_stock,
            location = EXCLUDED.location
        RETURNING id, unit_price
      `,
      [p.name, p.sku, p.category, p.price, p.stock, p.minStock, p.loc]
    );
    seededProducts[p.sku] = { id: res.rows[0].id, price: Number(res.rows[0].unit_price) };
  }

  // 4. Seed Follow-ups timeline
  const sharmaId = seededCustomers['Sharma Office Solutions'];
  const desaiId = seededCustomers['Desai Industrial Supplies'];

  await pool.query('DELETE FROM customer_followups');
  await pool.query(
    `
      INSERT INTO customer_followups (customer_id, note, follow_up_date, created_by)
      VALUES 
        ($1, 'Called regarding quarterly wholesale contract parameters.', CURRENT_DATE - INTERVAL '5 days', $3),
        ($1, 'Price catalog dispatched; pending product confirmation.', CURRENT_DATE + INTERVAL '3 days', $3),
        ($2, 'Discussed Bulk packaging box dispatch schedules.', CURRENT_DATE - INTERVAL '1 day', $3)
    `,
    [sharmaId, desaiId, salesId]
  );

  // 5. Seed stock movements (Opening inventories)
  await pool.query('DELETE FROM stock_movements');
  for (const p of products) {
    if (p.stock <= 0) continue; // Skip if stock is zero to satisfy quantity > 0 check constraint
    const dbProd = seededProducts[p.sku];
    // Write opening inventory record
    await pool.query(
      `
        INSERT INTO stock_movements (product_id, quantity, movement_type, reason, reference_type, created_by)
        VALUES ($1, $2, 'IN', 'Opening inventory', 'MANUAL_ADJUSTMENT', $3)
      `,
      [dbProd.id, p.stock, warehouseId]
    );
  }

  // 6. Seed Challans & Challan items
  await pool.query('DELETE FROM challan_items');
  await pool.query('DELETE FROM challans');

  // Let's create one CONFIRMED challan
  // It deducts stock. We should create a stock movement OUT matching this.
  const challanNo1 = 'CH-2026-001';
  const c1Res = await pool.query(
    `
      INSERT INTO challans (challan_number, customer_id, total_quantity, status, created_by, confirmed_by, confirmed_at)
      VALUES ($1, $2, 15, 'CONFIRMED', $3, $3, NOW())
      RETURNING id
    `,
    [challanNo1, sharmaId, salesId]
  );
  const challan1Id = c1Res.rows[0].id;

  const wKey = seededProducts['ELEC-WKEY-01'];
  const ucHub = seededProducts['ELEC-UCHUB-02'];

  // Add items
  await pool.query(
    `
      INSERT INTO challan_items (challan_id, product_id, quantity, snapshot_product_name, snapshot_sku, snapshot_unit_price)
      VALUES 
        ($1, $2, 10, 'Wireless Keyboard', 'ELEC-WKEY-01', $3),
        ($1, $4, 5, 'USB-C Multi-Hub', 'ELEC-UCHUB-02', $5)
    `,
    [challan1Id, wKey.id, wKey.price, ucHub.id, ucHub.price]
  );

  // Insert corresponding OUT stock movements for confirmed challan
  await pool.query(
    `
      INSERT INTO stock_movements (product_id, quantity, movement_type, reason, reference_type, reference_id, created_by)
      VALUES 
        ($1, 10, 'OUT', 'Customer dispatch - CH-2026-001', 'CHALLAN', $2, $3),
        ($4, 5, 'OUT', 'Customer dispatch - CH-2026-001', 'CHALLAN', $2, $3)
    `,
    [wKey.id, challan1Id, salesId, ucHub.id]
  );

  // Create one DRAFT challan (does not deduct stock)
  const challanNo2 = 'CH-2026-002';
  const c2Res = await pool.query(
    `
      INSERT INTO challans (challan_number, customer_id, total_quantity, status, created_by)
      VALUES ($1, $2, 50, 'DRAFT', $3)
      RETURNING id
    `,
    [challanNo2, desaiId, salesId]
  );
  const challan2Id = c2Res.rows[0].id;

  const boxProd = seededProducts['PACK-BOX-02'];
  await pool.query(
    `
      INSERT INTO challan_items (challan_id, product_id, quantity, snapshot_product_name, snapshot_sku, snapshot_unit_price)
      VALUES ($1, $2, 50, 'Corrugated Shipping Box', 'PACK-BOX-02', $3)
    `,
    [challan2Id, boxProd.id, boxProd.price]
  );

  console.log('Database seeded successfully.');
  await pool.end();
};

run().catch(async (error) => {
  console.error('Seeding failed:', error);
  await pool.end();
  process.exit(1);
});
