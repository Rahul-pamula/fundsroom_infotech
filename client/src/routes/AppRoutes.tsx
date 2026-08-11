import { Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { LandingPage } from '../features/auth/LandingPage';
import { LoginPage } from '../features/auth/LoginPage';
import { SignupPage } from '../features/auth/SignupPage';
import { ChallanDetailPage } from '../features/challans/ChallanDetailPage';
import { ChallansPage } from '../features/challans/ChallansPage';
import { CustomerDetailPage } from '../features/crm/CustomerDetailPage';
import { CustomersPage } from '../features/crm/CustomersPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ProductsPage } from '../features/inventory/ProductsPage';
import { StockMovementsPage } from '../features/inventory/StockMovementsPage';
import { ProtectedRoute, PublicRoute, RoleRoute } from './RouteGuards';
import { AccessDenied } from '../components/feedback/AccessDenied';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <AppShell>
              <DashboardPage />
            </AppShell>
          }
        />
        <Route
          path="/customers"
          element={
            <AppShell>
              <RoleRoute roles={['ADMIN', 'SALES', 'ACCOUNTS']}>
                <CustomersPage />
              </RoleRoute>
            </AppShell>
          }
        />
        <Route
          path="/customers/:id"
          element={
            <AppShell>
              <RoleRoute roles={['ADMIN', 'SALES', 'ACCOUNTS']}>
                <CustomerDetailPage />
              </RoleRoute>
            </AppShell>
          }
        />
        <Route
          path="/products"
          element={
            <AppShell>
              <RoleRoute roles={['ADMIN', 'WAREHOUSE', 'SALES', 'ACCOUNTS']}>
                <ProductsPage />
              </RoleRoute>
            </AppShell>
          }
        />
        <Route
          path="/stock-movements"
          element={
            <AppShell>
              <RoleRoute roles={['ADMIN', 'WAREHOUSE']}>
                <StockMovementsPage />
              </RoleRoute>
            </AppShell>
          }
        />
        <Route
          path="/challans"
          element={
            <AppShell>
              <RoleRoute roles={['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']}>
                <ChallansPage />
              </RoleRoute>
            </AppShell>
          }
        />
        <Route
          path="/challans/:id"
          element={
            <AppShell>
              <RoleRoute roles={['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS']}>
                <ChallanDetailPage />
              </RoleRoute>
            </AppShell>
          }
        />
      </Route>

      {/* Catch-all Access Denied / 404 */}
      <Route
        path="*"
        element={
          <AppShell>
            <AccessDenied />
          </AppShell>
        }
      />
    </Routes>
  );
}
