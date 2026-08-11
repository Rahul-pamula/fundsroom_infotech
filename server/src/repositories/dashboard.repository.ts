import { query } from '../config/database.js';

export class DashboardRepository {
  async getSummary() {
    const [customers, activeCustomers, products, lowStockProducts, challans, recentActivity] = await Promise.all([
      query<{ total: string }>('SELECT COUNT(*)::text AS total FROM customers'),
      query<{ total: string }>(`SELECT COUNT(*)::text AS total FROM customers WHERE status = 'ACTIVE'`),
      query<{ total: string }>('SELECT COUNT(*)::text AS total FROM products'),
      query(
        `
          SELECT id, name, sku, current_stock, min_stock_alert
          FROM products
          WHERE current_stock <= min_stock_alert
          ORDER BY current_stock ASC
          LIMIT 5
        `
      ),
      query(
        `
          SELECT status, COUNT(*)::text AS total
          FROM challans
          GROUP BY status
        `
      ),
      query(
        `
          SELECT 'STOCK_MOVEMENT' AS type, sm.created_at, p.name AS title, sm.reason AS subtitle
          FROM stock_movements sm
          INNER JOIN products p ON p.id = sm.product_id
          UNION ALL
          SELECT 'CHALLAN' AS type, c.created_at, c.challan_number AS title, c.status AS subtitle
          FROM challans c
          ORDER BY created_at DESC
          LIMIT 10
        `
      ),
    ]);

    return {
      totals: {
        customers: Number(customers.rows[0]?.total ?? 0),
        activeCustomers: Number(activeCustomers.rows[0]?.total ?? 0),
        products: Number(products.rows[0]?.total ?? 0),
      },
      lowStockProducts: lowStockProducts.rows,
      challanCounts: challans.rows.reduce<Record<string, number>>((accumulator, row) => {
        accumulator[row.status] = Number(row.total);
        return accumulator;
      }, {}),
      recentActivity: recentActivity.rows,
    };
  }
}

