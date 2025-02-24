import nock from 'nock';
import { AUTH_BASE, USER_BASE } from '../../../src/constants';
import {
  Client,
  createClient,
  ParamsOauth2,
  rqlBuilder,
} from '../../../src/index';
import { GlobalPermissionName } from '../../../src/services/users/types';
import { permissionData, roleData } from '../../__helpers__/user';
import { createPagedResponse } from '../../__helpers__/utils';

describe('Global Roles Service', () => {
  const host = 'https://api.xxx.extrahorizon.io';
  const roleId = '5bfbfc3146e0fb321rsa4b21';

  let sdk: Client<ParamsOauth2>;

  beforeAll(async () => {
    sdk = createClient({
      host,
      clientId: '',
    });

    const mockToken = 'mockToken';
    nock(host)
      .post(`${AUTH_BASE}/oauth2/tokens`)
      .reply(200, { access_token: mockToken });

    await sdk.auth.authenticate({
      username: '',
      password: '',
    });
  });

  it('should retrieve a list of permissions', async () => {
    nock(`${host}${USER_BASE}`)
      .get('/permissions')
      .reply(200, createPagedResponse(permissionData));

    const permissions = await sdk.users.globalRoles.getPermissions();

    expect(permissions.data.length).toBeGreaterThan(0);
  });

  it('should retrieve a list of roles', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${USER_BASE}`)
      .get(`/roles${rql}`)
      .reply(200, createPagedResponse(roleData));

    const roles = await sdk.users.globalRoles.get({ rql });

    expect(roles.data.length).toBeGreaterThan(0);
  });

  it('should create a role', async () => {
    const newRole = {
      name: 'newRole',
      description: 'this is a new role',
    };
    nock(`${host}${USER_BASE}`)
      .post(`/roles`)
      .reply(200, {
        ...newRole,
        id: roleId,
      });

    const res = await sdk.users.globalRoles.create(newRole);

    expect(res.id).toBe(roleId);
    expect(res.name).toBe(newRole.name);
  });

  it('should delete a role', async () => {
    const rql = rqlBuilder().build();
    nock(`${host}${USER_BASE}`).delete(`/roles${rql}`).reply(200, {
      affectedRecords: 1,
    });

    const res = await sdk.users.globalRoles.remove(rql);

    expect(res.affectedRecords).toBe(1);
  });

  it('should update a role', async () => {
    const id = roleId;
    const requestBody = {
      name: 'newRoleName',
      description: 'this is a new role desc',
    };
    nock(`${host}${USER_BASE}`).put(`/roles/${id}`).reply(200, roleData);

    const res = await sdk.users.globalRoles.update(id, requestBody);

    expect(res.id).toBe(roleData.id);
  });

  it('should add permissions to a role', async () => {
    const rql = rqlBuilder().limit(10).build();
    const requestBody = {
      permissions: [GlobalPermissionName.VIEW_PRESCRIPTIONS],
    };
    nock(`${host}${USER_BASE}`)
      .post(`/roles/add_permissions${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.globalRoles.addPermissions(rql, requestBody);

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove permissions from roles', async () => {
    const rql = rqlBuilder().build();
    const requestBody = {
      permissions: [GlobalPermissionName.VIEW_PRESCRIPTIONS],
    };
    nock(`${host}${USER_BASE}`)
      .post(`/roles/remove_permissions${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.globalRoles.removePermissions(rql, requestBody);

    expect(res.affectedRecords).toBe(1);
  });

  it('should add roles to users', async () => {
    const rql = rqlBuilder().build();
    const requestBody = {
      roles: [roleId],
    };
    nock(`${host}${USER_BASE}`)
      .post(`/add_roles${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.globalRoles.addToUsers(rql, requestBody);

    expect(res.affectedRecords).toBe(1);
  });

  it('should remove roles from users', async () => {
    const rql = rqlBuilder().build();
    const requestBody = {
      roles: [roleId],
    };
    nock(`${host}${USER_BASE}`)
      .post(`/remove_roles${rql}`)
      .reply(200, { affectedRecords: 1 });

    const res = await sdk.users.globalRoles.removeFromUser(rql, requestBody);

    expect(res.affectedRecords).toBe(1);
  });
});
