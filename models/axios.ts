export interface PontifexGetApplicationsResponse {
    applications: PontifexApplication[]
}

export interface PontifexApplication {
    id: string
    name: string // human-friendly
    creator: string
    secret: boolean // should the application be discoverable/searchable
}

export interface PontifexGetApplicationResponse {
    application: PontifexApplication
    environments?: PontifexEnvironment[]
}

export interface PontifexAuditEvent {
    id: string
    type: string
    action: string
    associatedUserId: string
    createDate: string
}

export interface PontifexGetApplicationAuditEventsResponse {
    events: PontifexAuditEvent[]
}

export interface PontifexGetEnvironmentResponse {
    environment: PontifexEnvironment
    endpoints?: PontifexApiEndpoint[]
    permissionRequests?: PontifexPermissionRequest[]
    application: PontifexApplication
}

export interface PontifexGetPermissionRequestResponse {
    permissionRequest: PontifexPermissionRequest
    sourceEnvironment: PontifexEnvironment
    targetEnvironment: PontifexEnvironment
    targetEndpoint: PontifexApiEndpoint
}

export interface PontifexGetApiEndpointResponse {
    endpoint: PontifexApiEndpoint
    environment: PontifexEnvironment
    requests?: PontifexPermissionRequest[]
}

export interface PontifexGetPendingPermissionRequestsResponse {
    pendingPermissionRequests: PontifexPermissionRequest[]
}

export interface PontifexGetEndpointOwnersResponse {
    owners: PontifexUser[]
}

export interface PontifexGetUserResponse {
    user: PontifexUser
}

export interface PontifexUser {
    id: string
    name: string
    email: string
}

export interface PontifexPermissionRequest {
    id: string
    requestor: string
    createDate: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface PontifexApiEndpoint {
    id: string
    name: string // app registration name + dev/stage/prod
    sensitive: boolean
}

export interface PontifexEnvironment {
    name: string // app registration name + dev/stage/prod
    level: string
    id: string // app registration object id
}