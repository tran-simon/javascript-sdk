import type { HttpInstance } from '../../types';
import {
  AffectedRecords,
  ObjectId,
  PagedResult,
  ResultResponse,
  Results,
} from '../types';
import { RQLString, rqlBuilder } from '../../rql';
import type {
  TemplateIn,
  TemplateOut,
  CreateFile,
  TemplatesService,
} from './types';

export default (client, httpAuth: HttpInstance): TemplatesService => ({
  /**
   * Perform a health check
   * @permission Everyone can use this endpoint
   * @returns {boolean} success
   */
  async health(): Promise<boolean> {
    const result: ResultResponse = await client.get(httpAuth, '/health');
    return result.status === Results.Success;
  },

  /**
   * Get all templates the service has to offer
   * Permission | Scope | Effect
   * - | - | -
   * `VIEW_TEMPLATES` | `global` | **Required** for this endpoint
   *
   * @param rql Add filters to the requested list.
   * @returns PagedResult<TemplateOut>
   */
  async find(options?: { rql?: RQLString }): Promise<PagedResult<TemplateOut>> {
    return (await client.get(httpAuth, `/${options?.rql || ''}`)).data;
  },

  /**
   * Find By Id
   * @param id the Id to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findById(
    id: ObjectId,
    options?: { rql?: RQLString }
  ): Promise<TemplateOut> {
    const rqlWithId = rqlBuilder(options?.rql).eq('id', id).build();
    const res = await this.find({ rql: rqlWithId });
    return res.data[0];
  },

  /**
   * Find By Name
   * @param name the name to search for
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findByName(
    name: string,
    options?: { rql?: RQLString }
  ): Promise<TemplateOut> {
    const rqlWithName = rqlBuilder(options?.rql).eq('name', name).build();
    const res = await this.find({ rql: rqlWithName });
    return res.data[0];
  },

  /**
   * Find First
   * @param rql an optional rql string
   * @returns the first element found
   */
  async findFirst(options?: { rql?: RQLString }): Promise<TemplateOut> {
    const res = await this.find(options);
    return res.data[0];
  },

  /**
   * Create a new template
   * Permission | Scope | Effect
   * - | - | -
   * `CREATE_TEMPLATES` | `global` | **Required** for this endpoint
   *
   * @param requestBody
   * @returns TemplateOut Success
   */
  async create(requestBody: TemplateIn): Promise<TemplateOut> {
    return (await client.post(httpAuth, '/', requestBody)).data;
  },

  /**
   * Update an existing template
   * Permission | Scope | Effect
   * - | - | -
   * `UPDATE_TEMPLATES` | `global` | **Required** for this endpoint
   *
   * @param templateId Id of the targeted template
   * @param requestBody
   * @returns TemplateOut Success
   * @throws {ResourceUnknownError}
   */
  async update(
    templateId: string,
    requestBody: TemplateIn
  ): Promise<TemplateOut> {
    return (await client.put(httpAuth, `/${templateId}`, requestBody)).data;
  },

  /**
   * Delete a template
   * Permission | Scope | Effect
   * - | - | -
   * `DELETE_TEMPLATES` | `global` | **Required** for this endpoint
   *
   * @param templateId Id of the targeted template
   * @returns any Operation successful
   * @throws {ResourceUnknownError}
   */
  async remove(templateId: string): Promise<AffectedRecords> {
    return (await client.delete(httpAuth, `/${templateId}`)).data;
  },

  /**
   * Resolves a template and presents the result as a pdf file
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param templateId Id of the targeted template
   * @param requestBody The file data
   * @returns Buffer
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  async resolveAsPdf(
    templateId: string,
    requestBody: CreateFile
  ): Promise<Buffer> {
    return (
      await client.post(httpAuth, `/${templateId}/pdf`, requestBody, {
        responseType: 'arraybuffer',
      })
    ).data;
  },

  /**
   * @deprecated
   * Resolves a template and presents the result as a pdf file
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param templateId Id of the targeted template
   * @param localizationCode Specifies the language the template must be resolved in
   * @param requestBody The file data
   * @returns Buffer
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  async resolveAsPdfUsingCode(
    templateId: string,
    localizationCode: string,
    requestBody: CreateFile
  ): Promise<Buffer> {
    return (
      await client.post(
        httpAuth,
        `/${templateId}/pdf/${localizationCode}`,
        requestBody,
        {
          responseType: 'arraybuffer',
        }
      )
    ).data;
  },

  /**
   * Resolves a template and presents the result as a json response
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param templateId Id of the targeted template
   * @param requestBody
   * @returns string Success
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  async resolveAsJson(
    templateId: string,
    requestBody: CreateFile
  ): Promise<Record<string, string>> {
    return (await client.post(httpAuth, `/${templateId}/resolve`, requestBody))
      .data;
  },

  /**
   * @deprecated
   * Resolves a template and presents the result as a json response
   * Permission | Scope | Effect
   * - | - | -
   * none | | Everyone can use this endpoint
   *
   * @param templateId Id of the targeted template
   * @param localizationCode Specifies the language the template must be resolved in
   * @param requestBody
   * @returns string Success
   * @throws {LocalizationKeyMissingError}
   * @throws {TemplateFillingError}
   * @throws {ResourceUnknownError}
   */
  async resolveAsJsonUsingCode(
    templateId: string,
    localizationCode: string,
    requestBody: CreateFile
  ): Promise<Record<string, string>> {
    return (
      await client.post(
        httpAuth,
        `/${templateId}/resolve/${localizationCode}`,
        requestBody
      )
    ).data;
  },
});
