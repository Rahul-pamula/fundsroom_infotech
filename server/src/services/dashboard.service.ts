import { DashboardRepository } from '../repositories/dashboard.repository.js';

const dashboardRepository = new DashboardRepository();

export class DashboardService {
  getSummary() {
    return dashboardRepository.getSummary();
  }
}

