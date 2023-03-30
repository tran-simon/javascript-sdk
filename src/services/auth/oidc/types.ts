import { AffectedRecords, OptionsWithRql, PagedResult } from '../../types';

export interface OidcService {
  /**
   * ## Create a new OpenId Connect Provider
   * You can use this function to create a new OpenId Connect Provider to enable Single Sign On.
   *
   * #### Global Permissions
   * `CREATE_OIDC_PROVIDER` - Is required to use this function and provides you with the ability to create new OIDC Providers.
   *
   * @param requestBody {@link OidcProviderCreation}
   * @returns OidcProvider {@link OidcProvider}
   */
  createProvider(requestBody: OidcProviderCreation): Promise<OidcProvider>;

  /**
   * ## Get a list OpenId connect providers
   * You can use this function to retrieve a paginated list of configured OpenId Connect Providers.
   *
   * #### Global Permissions
   * `VIEW_OIDC_PROVIDERS` - Is required to use this function and provides you with the ability to retrieve a paginated list.
   *
   * @param options {@link OptionsWithRql} addional options with rql that can be set for your request to the cluster.
   * @returns Returns a promise of a {@link PagedResult} with {@link OidcProvider}'s
   */
  getProviders(options?: OptionsWithRql): Promise<PagedResult<OidcProvider>>;

  /**
   * ## Update an openId Connect Provider
   * You can use this function to update an existing OpenId Connect Provider. Fields left undefined will not be updated.
   *
   * #### Global Permissions
   * `UPDATE_OIDC_PROVIDER` - Is required to use this function and provides you with the ability to update, enable or disable existing providers.
   *
   * @param providerId A 24 character long hexadecimal value acting as the identifier of an OpenId Connect provider.
   * @param requestBody {@link OidcProviderUpdate} A set of updatable fields for existing providers.
   * @returns Returns a promise of a {@link AffectedRecords}.
   */
  updateProvider(
    providerId: string,
    requestBody: OidcProviderUpdate
  ): Promise<AffectedRecords>;

  /**
   * ## Delete an OpenId Connect Provider
   * You can use this function to delete an existing OpenId Connect provider.
   *
   * #### Global Permissions
   * `DELETE_OIDC_PROVIDER` - Is required to use this function and provides you with the ability to delete existing OpenId Connect providers.
   *
   * @param providerId A 24 character long hexadecimal value acting as the identifier of an OpenId Connect provider.
   * @returns Returns a promise of a {@link AffectedRecords}.
   */
  deleteProvider(providerId: string): Promise<AffectedRecords>;

  /**
   * ## Enable an OpenId Connect Provider
   * You can use this function to enable an existing OpenId Connect provider. When a provider is enabled client applications will be able to authenticate users using this provider.
   *
   * #### Global Permissions
   * `UPDATE_OIDC_PROVIDER` - Is required to use this function and provides you with the ability to update, enable or disable existing providers.
   *
   * @param providerId A 24 character long hexadecimal value acting as the identifier of an OpenId Connect provider.
   * @returns Returns a promise of a {@link AffectedRecords}.
   */
  enableProvider(providerId: string): Promise<AffectedRecords>;

  /**
   * ## Disable an OpenId Connect Provider
   * You can use this function to disable an existing OpenId Connect provider. When a provider is disabled client applications will no longer be able to authenticate users using this provider.
   * When disabled the {@link linkUserToOidcProvider}, {@link TODO: oAuth2Login}, {@link TODO: generateAuthenticationUrl} functions will return an IllegalStateError.
   * Make sure these clients correctly handle these error's or make sure to update your frontend before disabling.
   *
   *  link -> IllegalStateError('The provider is currently disabled and must be enabled to link a user');
   *  oAuth2Login -> IllegalStateError('The provider is currently disabled and must be enabled to login');
   *  generateAuthenticationUrl- > IllegalStateError('The provider is currently disabled and must be enabled to generate authentication urls');
   *
   * #### Global Permissions
   * `UPDATE_OIDC_PROVIDER` - Is required to use this function and provides you with the ability to update, enable or disable existing providers.
   *
   * @param providerId A 24 character long hexadecimal value acting as the identifier of an OpenId Connect provider.
   * @returns Returns a promise of a {@link AffectedRecords}.
   */
  disableProvider(providerId: string): Promise<AffectedRecords>;

  /**
   * Link the currently logged-in user to an OIDC provider
   * Permission | Scope | Effect
   * - | - | -
   * none | | Only a logged-in user can use this endpoint
   * @param providerName The name of the OpenID Connect provider that the user will be linked to
   * @param linkRequestBody
   * */
  linkUserToOidcProvider(
    providerName: string,
    linkRequestBody: OidcLinkRequestBody
  ): Promise<AffectedRecords>;

  /**
   * Unlink a user from OpenID Connect
   * Permission | Scope | Effect
   * - | - | -
   * UNLINK_USER_FROM_OIDC | `global` | **Required** for this endpoint
   * @param userId The id of the user to be unlinked from OpenID Connect
   */
  unlinkUserFromOidc(userId: string): Promise<AffectedRecords>;
}

export interface OidcProvider {
  /** A 24 character long hexadecimal value acting as the identifier of an OpenId Connect provider */
  id: string;
  /** Human friendly name of the provider, which can also be used in the oidc login url. Then name can be between 3 and 40 characters and match pattern: '/^[a-zA-Z0-9_-]+$/' */
  name: string;
  /** Description of the provider. With a maximum of 256 characters */
  description: string;
  /** Provided by the OpenID Connect provider after registration. With a maximum of 2048 characters */
  clientId: string;
  /** A URL of maximum 2048 charactes that acts as a unique identifier for the provider. `Issuer` in the provider's discovery document. */
  issuerId: string;
  /** A URL of maximum 2048 character that points to the provider’s URL for authorising the user (i.e., signing the user in). authorization_endpoint in the provider's discovery document. */
  authorizationEndpoint: string;
  /** A URL of maximum 2048 character that points to the provider’s OAuth 2.0 protected URL from which user information can be obtained. token_endpoint in the provider's discovery document. */
  tokenEndpoint: string;
  /** A URL of maximum 2048 character that points to the provider’s endpoint of the authorization server Extra Horizon can use to obtain the email address and optionally also the family name and given name. userinfo_endpoint in the provider's discovery document. */
  userinfoEndpoint: string;
  /** A URL of maximum 2048 character that points to the location where the authorization server sends the user once the app has been successfully authorised and granted an authorization code or access token */
  redirectUri: string;
  /** Indicates wether the OpenID Connect provider is active and can be used for SSO */
  enabled: boolean;
  /** The last four characters of the client secret */
  clientSecretHint: string;
  /** The creation timestamp of the OpenID Connectprovider */
  creationTimestamp: Date;
  /** The update timestamp of the OpenID Connect provider */
  updateTimestamp: Date;
}

export interface OidcProviderCreation
  extends Required<
    Pick<
      OidcProvider,
      | 'name'
      | 'description'
      | 'clientId'
      | 'authorizationEndpoint'
      | 'redirectUri'
      | 'tokenEndpoint'
      | 'userinfoEndpoint'
      | 'issuerId'
    >
  > {
  /** The OAuth 2.0 Client Secret you received from your provider. Max 2048 characters */
  clientSecret: string;
}

export type OidcProviderUpdate = Partial<OidcProviderCreation>;

export interface OidcLinkRequestBody {
  /** Obtained from the OpenID Connect provider upon successful user login. */
  authorizationCode: string;
  /** Optional: include the nonce if it was provided in the authentication request */
  nonce?: string;
}
