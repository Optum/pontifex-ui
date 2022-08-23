import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Badge, Link, Skeleton, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { Suspense } from "react";
import {
    PontifexGetApiEndpointResponse,
    PontifexGetPendingPermissionRequestsResponse,
    PontifexGetPermissionRequestResponse
} from "../../models/axios";
import { readApiEndpoint, readEnvironment, readPermissionRequest } from "../../resources";

const getBadgeColor = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    switch (status) {
        case "PENDING":
            return 'yellow'
        case "APPROVED":
            return 'green'
        case "REJECTED":
            return 'red'
    }
}

const rowFallback = <Tr>
    <Td>
        <Skeleton height='20px' width={'100%'}/>
    </Td>
    <Td>
        <Skeleton height='20px' width={'100%'}/>
    </Td>
    <Td>
        <Skeleton height='20px' width={'100%'}/>
    </Td>
    <Td>
        <Skeleton height='20px' width={'100%'}/>
    </Td>
    <Td>
        <Skeleton height='20px' width={'100%'}/>
    </Td>
</Tr>

export const PermissionRequestList = ({permissionRequests}) => {
    const permissionRequestsElements = permissionRequests?.map(pr =>
        <Suspense fallback={rowFallback} key={pr.id}><PermissionRequest resource={readPermissionRequest(pr.id)}/></Suspense>
    );

    if (permissionRequestsElements.length === 0) {
        permissionRequestsElements.push(<Tr key={'no-prs'}>
            <Td>No Permission Requests</Td>
            <Td/>
            <Td/>
            <Td/>
            <Td/>
        </Tr>)
    }

    return <>
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Source Environment</Th>
                        <Th>Target Environment</Th>
                        <Th>Target Endpoint Name</Th>
                        <Th>Status</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {permissionRequestsElements}
                </Tbody>
            </Table>
        </TableContainer>
    </>
}

export const PermissionRequest = ({resource}) => {
    const {sourceEnvironment, targetEnvironment, targetEndpoint, permissionRequest}: PontifexGetPermissionRequestResponse = resource.read()

    const sourceEnvironmentNameParts = sourceEnvironment.name.split(/-(.*)/g)
    const targetEnvironmentNameParts = targetEnvironment.name.split(/-(.*)/g)

    return <Tr key={permissionRequest.id}>
        <Td><Link href={`/environments/${sourceEnvironment.id}`}>{`${sourceEnvironmentNameParts[1]} (${sourceEnvironmentNameParts[0].toUpperCase()})`}</Link></Td>
        <Td><Link href={`/environments/${targetEnvironment.id}`}>{`${targetEnvironmentNameParts[1]} (${targetEnvironmentNameParts[0].toUpperCase()})`}</Link></Td>
        <Td><Link href={`/endpoints/${targetEndpoint.id}`}>{targetEndpoint.name}</Link></Td>
        <Td><Badge colorScheme={getBadgeColor(permissionRequest.status)}>{permissionRequest.status}</Badge></Td>
        <Td textAlign={'center'}>
            <a key={permissionRequest.id} href={`/permission-requests/${permissionRequest.id}`}>
                <ExternalLinkIcon/>
            </a>
        </Td>
    </Tr>
}


export const PendingPermissionRequestList = ({resource}) => {
    const {pendingPermissionRequests} = resource.read()

    return <Suspense key={pendingPermissionRequests.length}>
        <PermissionRequestList permissionRequests={pendingPermissionRequests}/>
    </Suspense>
}