import { withTransaction } from '../config/database.js';
import type { CreateCustomerInput, CreateFollowupInput, CustomerQuery, UpdateCustomerInput } from '../models/customer.js';
import { CustomerRepository } from '../repositories/customer.repository.js';
import { NotFoundError } from '../utils/errors.js';

const customerRepository = new CustomerRepository();

export class CustomerService {
  list(params: CustomerQuery) {
    return customerRepository.list(params);
  }

  create(input: CreateCustomerInput, createdBy: string) {
    return customerRepository.create(input, createdBy);
  }

  async getById(id: string) {
    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    const followups = await customerRepository.listFollowups(id);
    return { ...customer, followups };
  }

  async update(id: string, input: UpdateCustomerInput) {
    const customer = await customerRepository.update(id, input);

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    return customer;
  }

  async addFollowup(id: string, createdBy: string, input: CreateFollowupInput) {
    const customer = await customerRepository.findById(id);

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    return withTransaction(async (client) => customerRepository.addFollowup(id, createdBy, input, client));
  }
}

