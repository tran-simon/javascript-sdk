import { rqlBuilder } from '../../../rql';
import { HttpInstance } from '../../../types';
import { HttpClient } from '../../http-client';
import { ActivationRequestsService } from './types';

export const activationRequestsService = (
  client: HttpClient,
  httpWithAuth: HttpInstance
): ActivationRequestsService => ({

  async find(options) {
    const response = await client.get(httpWithAuth, `/activation_requests/${options?.rql || ''}`, options);
    return response.data;
  },

  async findFirst(options) {
    const result = await this.find(options);
    return result.data[0];
  },

  async findById(id, options) {
    const rql = rqlBuilder(options?.rql).eq('id', id).build();
    return await this.findFirst({ ...options, rql });
  },

  async findByUserId(userId, options) {
    const rql = rqlBuilder(options?.rql).eq('user_id', userId).build();
    return await this.findFirst({ ...options, rql });
  },

  async remove(id, options) {
    const response = await client.delete(httpWithAuth, `/activation_requests/${id}`, options);
    return response.data;
  },

});
