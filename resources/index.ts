import axios from "axios";
import { memoize } from "memoize-lit";
import {
    PontifexApiEndpoint,
    PontifexApplication,
    PontifexEnvironment, PontifexGetApiEndpointResponse, PontifexGetApplicationAuditEventsResponse,
    PontifexGetApplicationResponse,
    PontifexGetApplicationsResponse,
    PontifexGetEnvironmentResponse,
    PontifexGetPendingPermissionRequestsResponse,
    PontifexGetPermissionRequestResponse,
    PontifexGetUserResponse,
    PontifexUser
} from "../models/axios";
import { wrapPromise } from "../utils/suspense";

export const readAllApplications = () => wrapPromise(async (): Promise<PontifexApplication[]> => {
        const res = await axios.get<PontifexGetApplicationsResponse>('/api/applications')

        return res.data.applications
    }
)

export const readOwnedApplications = () => wrapPromise(async (): Promise<PontifexApplication[]> => {
        const res = await axios.get<PontifexGetApplicationsResponse>('/api/user/applications')

        return res.data.applications
    }
)

export const readApplication = memoize((appId: string) => wrapPromise<PontifexGetApplicationResponse>(async (): Promise<PontifexGetApplicationResponse> => {
    if(!appId) {
        console.error("empty appId")
        return null
    }

    const res = await axios.get<PontifexGetApplicationResponse>(`/api/applications/${appId}`)

    return res.data
}), {maxAge: 300000})

export const readApplicationAuditEvents = (appId: string) => wrapPromise<PontifexGetApplicationAuditEventsResponse>(async (): Promise<PontifexGetApplicationAuditEventsResponse> => {
    if(!appId) {
        console.error("empty appId")
        return null
    }

    const res = await axios.get<PontifexGetApplicationAuditEventsResponse>(`/api/applications/${appId}/audit`)

    return res.data
})

export const readApplicationEnvironments = memoize((appId: string) => wrapPromise<PontifexEnvironment>(async (): Promise<PontifexEnvironment[]> => {
    if(!appId) {
        console.error("empty appId")
        return null
    }

    const res = await axios.get<PontifexGetApplicationResponse>(`/api/applications/${appId}`)

    return res.data.environments
}), {maxAge: 300000})

export const readEnvironment = memoize((envId: string) => wrapPromise<PontifexGetEnvironmentResponse>(async (): Promise<PontifexGetEnvironmentResponse> => {
    if(!envId) {
        console.error("empty envId")
        return null
    }

    const res = await axios.get<PontifexGetEnvironmentResponse>(`/api/environments/${envId}`)
    
    return res.data
}), {maxAge: 300000})

export const readEnvironmentApiEndpoints = memoize((envId: string) => wrapPromise(async (): Promise<PontifexApiEndpoint[]> => {
    if(!envId) {
        console.error("empty envId")
        return null
    }

    const res = await axios.get<PontifexGetEnvironmentResponse>(`/api/environments/${envId}`)

    return res.data.endpoints
}), {maxAge: 300000})

export const readPermissionRequest = (prId: string) => wrapPromise(async (): Promise<PontifexGetPermissionRequestResponse> => {
    if(!prId) {
        console.error("empty prId")
        return null
    }

    const res = await axios.get<PontifexGetPermissionRequestResponse>(`/api/permission-requests/${prId}`)
    const targetEndpointRes = await axios.get<PontifexGetApiEndpointResponse>(`/api/endpoints/${res.data.targetEndpoint.id}`)

    return {
        ...res.data,
        targetEnvironment: targetEndpointRes.data.environment
    }
})

export const readApiEndpoint = memoize((endpointId: string) => wrapPromise(async (): Promise<PontifexGetApiEndpointResponse> => {
    if(!endpointId) {
        console.error("empty endpointId")
        return null
    }

    const res = await axios.get<PontifexGetApiEndpointResponse>(`/api/endpoints/${endpointId}`)

    return res.data
}), {maxAge: 300000})

export const readPendingPermissionRequests = () => wrapPromise(async (): Promise<PontifexGetPendingPermissionRequestsResponse> => {

    const res = await axios.get<PontifexGetPendingPermissionRequestsResponse>(`/api/user/permission-requests/pending`)

    return res.data
})

export const readUser = memoize((userId: string) => wrapPromise(async (): Promise<PontifexUser> => {
    const res = await axios.get<PontifexGetUserResponse>(`/api/users/${userId}`)

    return res.data.user
}), { maxAge: 3600000 })

export const requestAccess = (sourceEnvId: string, targetEnvId: string, roleIds: PontifexApiEndpoint[]) => wrapPromise(async () => {
    const res = await axios.patch(`/api/environments/${sourceEnvId}/permissions`, {
        permissions: roleIds.map(roleId => ({
            roleId: roleId.id,
            roleApplicationObjectId: targetEnvId
        }))
    })

    return res.status
})