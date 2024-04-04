import { rqlBuilder } from '../../rql';
import type { HttpInstance } from '../../types';
import { addPagersFn, findAllIterator, findAllGeneric } from '../helpers';
import { HttpClient } from '../http-client';
import type { PagedResult } from '../types';
import type { DataSchemasService, Schema } from './types';

const addTransitionHelpersToSchema = (schema: Schema): Schema => ({
  ...schema,
  findTransitionIdByName(name) {
    return schema.transitions?.find(transition => transition.name === name)?.id;
  },
  get transitionsByName() {
    return schema.transitions?.reduce(
      (memo, transition) => ({ ...memo, [transition.name]: transition }),
      {}
    );
  },
});

export default (
  client: HttpClient,
  httpAuth: HttpInstance
): DataSchemasService => {
  async function find(options) {
    const result: PagedResult<Schema> = (
      await client.get(httpAuth, `/${options?.rql || ''}`, {
        ...options,
        customResponseKeys: ['data.properties', 'data.statuses'],
      })
    ).data;
    return {
      ...result,
      data: result.data.map(addTransitionHelpersToSchema),
    };
  }

  return {
    async create(requestBody, options) {
      return addTransitionHelpersToSchema(
        (await client.post(httpAuth, '/', requestBody, options)).data
      );
    },

    async find(options) {
      const result = await find(options);
      return addPagersFn<Schema>(find, options, result);
    },

    async findAll(options) {
      return findAllGeneric<Schema>(find, options);
    },

    findAllIterator(options) {
      return findAllIterator<Schema>(find, options);
    },

    async findById(this: DataSchemasService, id, options) {
      const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
      const res = await find({ ...options, rql: rqlWithId });
      return res.data[0];
    },

    async findByName(this: DataSchemasService, name, options) {
      const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
      const res = await find({ ...options, rql: rqlWithName });
      return res.data[0];
    },

    async findFirst(this: DataSchemasService, options) {
      const res = await find(options);
      return res.data[0];
    },

    async update(schemaIdOrName, requestBody, options) {
      return (await client.put(httpAuth, `/${schemaIdOrName}`, requestBody, options))
        .data;
    },

    async remove(schemaIdOrName, options) {
      return (await client.delete(httpAuth, `/${schemaIdOrName}`, options)).data;
    },

    async disable(schemaIdOrName, options) {
      return (
        await client.post(httpAuth, `/${schemaIdOrName}/disable`, undefined, options)
      ).data;
    },

    async enable(schemaIdOrName, options) {
      return (
        await client.post(httpAuth, `/${schemaIdOrName}/enable`, undefined, options)
      ).data;
    },
  };
};
