import { ApiClient } from '../oauth1-api';
import { RegisterUserData, UserData, UserDataList } from './models';
import { recordsAffectedResponse, resultResponse, Results } from '../models';

const userServiceClient = new ApiClient('users', 'v1');

/**
 * Perform a health check
 * @permission Everyone can use this endpoint
 * @returns {boolean} success
 */
export async function getHealth(): Promise<boolean> {
  const result: resultResponse = await userServiceClient.get('health');
  return result.status === Results.Success;
}
/**
 * Retrieve the current logged in user.
 * @permission Everyone can use this endpoint
 * @returns {UserData} UserData
 */
export async function getCurrent(): Promise<UserData> {
  return await userServiceClient.get('me') as UserData;
}

/**
 * Retrieve a list of users.
 * @permission See a subset of fields from all staff members of groups where you have a patient enlistment
 * @permission --------- | scope:group  | See a subset of fields from all patients of the group
 * @permission VIEW_USER | scope:global | See all fields of all users
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getList(rql = ''): Promise<UserDataList> {
  return await userServiceClient.get(rql) as UserDataList;
}

/**
 * Retrieve a list of users that have a patient enlistment.
 * @permission --------- | scope:group  | View the patients of the group
 * @permission VIEW_PATIENTS | scope:global | View all patients
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getPatients(rql = ''): Promise<UserDataList> {
  return await userServiceClient.get(`patients/${rql}`) as UserDataList;
}

/**
 * Retrieve a list of users that have a staff enlistment.
 * @permission --------- | scope:group  | View the other staff members of the group
 * @permission VIEW_STAFF | scope:global | View all staff members
 * @params {string} rql Add filters to the requested list (optional)
 * @returns {UserDataList} UserDataList
 */
export async function getStaff(rql = ''): Promise<UserDataList> {
  return await userServiceClient.get(`staff/${rql}`) as UserDataList;
}

/**
 * Retrieve a specific user.
 * @permission See your own user object
 * @permission --------- | scope:group  | See a subset of the fields for any staff member or patient of the group
 * @permission VIEW_PATIENTS | scope:global | See a subset of fields for any user with a patient enlistment
 * @permission VIEW_STAFF | scope:global | See a subset of fields for any user with a staff enlistment
 * @permission VIEW_USER | scope:global | See any user object
 * @params {string} userId of the targeted user (required)
 * @throws 404: 
 * {
    "code": 16,
    "name": "RESOURCE_UNKNOWN_EXCEPTION",
    "message": "Requested resource is unknown"
  }
 * @returns {UserData} UserData
 */
export async function getById(userId: string): Promise<UserData> {
  return await userServiceClient.get(userId) as UserData;
}

/**
 * Update a specific user.
 * @permission Update your own data
 * @permission UPDATE_USER | scope:global | Update any user
 * @params {string} userId of the targeted user (required)
 * @params {any} data Fields to update
 * @throws 404:
 * {
    "code": 16,
    "name": "RESOURCE_UNKNOWN_EXCEPTION",
    "message": "Requested resource is unknown"
  }
 * @returns {UserData} UserData
 */
export async function update(userId: string, data: any): Promise<UserData> {
  return await userServiceClient.put(userId, data) as UserData;
}

/**
 * Delete a specific user
 * @permission Delete your own user object
 * @permission DELETE_USER | scope:global | Delete any user
 * @params {string} userId of the targeted user (required)
 * @throws 404:
 * {
    "code": 16,
    "name": "RESOURCE_UNKNOWN_EXCEPTION",
    "message": "Requested resource is unknown"
  }
 * @returns {boolean} success
 */
export async function remove(userId: string): Promise<boolean> {
  const response: recordsAffectedResponse = await userServiceClient.delete(userId);
  return response.recordsAffected === 1;
}

/**
 * Update the email address of a specific user.
 * An email is send to validate and activate the new address.
 * @permission Update your own data
 * @permission UPDATE_USER_EMAIL | scope:global | Update any user
 * @params {string} userId of the targeted user (required)
 * @params {string} email
 * @throws 400:
 * {
    "code": 203,
    "name": "EMAIL_USED_EXCEPTION",
    "message": "This email address is already in use"
  }
 * @throws 404:
 * {
    "code": 16,
    "name": "RESOURCE_UNKNOWN_EXCEPTION",
    "message": "Requested resource is unknown"
  }
 * @returns {UserData} UserData
 */
export async function updateEmail(userId: string, email: string): Promise<UserData> {
  return await userServiceClient.put(`${userId}/email`, { email }) as UserData;
}

/**
 * Add a patient enlistment to a user.
 * @permission ADD_PATIENT | scope:global | Add any patient enlistment
 * @params {string} userId of the targeted user (required)
 * @params {string} groupId of the targeted group (required)
 * @throws 400:
 * {
    "code": 203,
    "name": "RESOURCE_ALREADY_EXISTS_EXCEPTION",
    "message": "This resource already exists"
  }
 * @returns {boolean} success
 */
export async function addPatientEnlistment(userId: string, groupId: string): Promise<boolean> {
  const response: recordsAffectedResponse = await userServiceClient.post(`${userId}/patient_enlistments`, { groupId });
  return response.recordsAffected === 1;
}

/**
 * Remove a patient enlistment from a user.
 * @permission Remove a patient enlistment from yourself
 * @permission REMOVE_PATIENT | scope:group | Remove a patient enlistment for the group
 * @permission REMOVE_PATIENT | scope:global | Remove any patient enlistment
 * @params {string} userId of the targeted user (required)
 * @params {string} groupId of the targeted group (required)
 * @throws 404:
 * {
    "code": 16,
    "name": "RESOURCE_UNKNOWN_EXCEPTION",
    "message": "Requested resource is unknown"
  }
 * @returns {boolean} success
 */
export async function deletePatientEnlistment(userId: string, groupId: string): Promise<boolean> {
  const response: recordsAffectedResponse = await userServiceClient.delete(`${userId}/patient_enlistments/${groupId}`);
  return response.recordsAffected === 1;
}

/**
 * Create an account.
 * @permission Everyone can use this endpoint
 * @params {RegisterUserData} registerData Data necessary to register (required)
 * @returns {UserData} UserData
 * @throws 400: {
    "code": 203,
    "name": "EMAIL_USED_EXCEPTION",
    "message": "This email address is already in use"
  }
 */
export async function register(data: RegisterUserData): Promise<UserData> {
  return await userServiceClient.post('register', data) as UserData;
}

/**
 * Change your password..
 * @permission Everyone can use this endpoint
 * @params {string} Old password (required)
 * @params {string} New password (required)
 * @throws 400: {
    "code": 208,
    "name": "PASSWORD_EXCEPTION",
    "message": "The provided password is not correct"
  }
 * @returns {boolean} success
 */
export async function updatePassword(oldPassword: string, newPassword: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.put('password', { oldPassword, newPassword });
  return result.status === Results.Success;
}

/**
 * Authenticate a user.
 * @permission Everyone can use this endpoint
 * @params {string} email (required)
 * @params {string} password (required)
 * @throws 401: {
    "code": 106,
    "name": "AUTHENTICATION_EXCEPTION",
    "message": "This password email combination is unknown"
  }
 * @throws 401: {
    "code": 211,
    "name": "LOGIN_TIMEOUT_EXCEPTION",
    "message": "Login attempt too fast"
  }
 * @throws 401: {
    "code": 212,
    "name": "LOGIN_FREEZE_EXCEPTION",
    "message": "Login timeout in progress, too many failed login attempts"
  }
 * @throws 401: {
    "code": 213,
    "name": "TOO_MANY_FAILED_ATTEMPTS_EXCEPTION",
    "message": "Account is locked due to too many failed login attempts"
  }
 * @returns {UserData} UserData
 */
export async function authenticate(email: string, password: string): Promise<UserData> {
  return await userServiceClient.post('authenticate', { email, password }) as UserData;
}

/**
 * Request an email activation.
 * @permission Everyone can use this endpoint
 * @params {string} email (required)
 * @returns {boolean} success
 * @throws 400: {
    "code": 202,
    "name": "EMAIL_UNKNOWN_EXCEPTION",
    "message": "This email is not known"
  }
 * @throws 400: {
    "code": 206,
    "name": "ALREADY_ACTIVATED_EXCEPTION",
    "message": "This user is already activated"
  }
 */
export async function requestActivationMail(email: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.get(`activation?email=${email}`);
  return result.status === Results.Success;
}

/**
 * Complete an email activation
 * @permission Everyone can use this endpoint
 * @params {string} hash (required)
 * @throws 400: {
    "code": 205,
    "name": "ACTIVATION_UNKNOWN_EXCEPTION",
    "message": "This activation does not exist"
  }
 * @returns {boolean} success
 */
export async function completeActivationMail(hash: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.post('activation', { hash });
  return result.status === Results.Success;
}

/**
 * Request a password reset.
 * @permission Everyone can use this endpoint
 * @params {string} email (required)
 * @throws 400: {
    "code": 202,
    "name": "EMAIL_UNKNOWN_EXCEPTION",
    "message": "This email is not known"
  }
 * @throws 400: {
    "code": 204,
    "name": "NOT_ACTIVATED_EXCEPTION",
    "message": "This account needs to be activated before this action can be performed"
  }
 * @returns {boolean} success
 */
export async function requestPasswordReset(email: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.get(`forgot_password?email=${email}`);
  return result.status === Results.Success;
}

/**
 * Complete a password reset..
 * @permission Everyone can use this endpoint
 * @params {string} email (required)
 * @params {string} new password (required)
 * @throws 400: {
    "code": 204,
    "name": "NOT_ACTIVATED_EXCEPTION",
    "message": "This account needs to be activated before this action can be performed"
  }
 * @throws 400: {
    "code": 207,
    "name": "NEW_PASSWORD_HASH_UNKNOWN_EXCEPTION",
    "message": "This new password hash does not exist"
  }
 * @returns {boolean} success
 */
export async function completePasswordReset(hash: string, newPassword: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.post('forgot_password', { hash, newPassword });
  return result.status === Results.Success;
}

/**
 * Confirm the password for the user making the request
 * @permission Everyone can use this endpoint
 * @params {string} password (required)
 * @throws 401: {
    "code": 106,
    "name": "AUTHENTICATION_EXCEPTION",
    "message": "This password email combination is unknown"
  }
 * @throws 401: {
    "code": 211,
    "name": "LOGIN_TIMEOUT_EXCEPTION",
    "message": "Login attempt too fast"
  }
 * @throws 401: {
    "code": 212,
    "name": "LOGIN_FREEZE_EXCEPTION",
    "message": "Login timeout in progress, too many failed login attempts"
  }
 * @throws 401: {
    "code": 213,
    "name": "TOO_MANY_FAILED_ATTEMPTS_EXCEPTION",
    "message": "Account is locked due to too many failed login attempts"
  }
 * @returns {boolean} success
 */
export async function confirmPassword(password: string): Promise<boolean> {
  const result: resultResponse = await userServiceClient.post('confirm_password', { password });
  return result.status === Results.Success;
}

/**
 * Check if an email address is still available.
 * @permission Everyone can use this endpoint
 * @params {string} email (required)
 * @returns {boolean} success
 */
export async function emailAvailable(email: string): Promise<boolean> {
  const result = await userServiceClient.get(`email_available?email=${email}`);
  return result.emailAvailable;
}
