import { useMsal } from "@azure/msal-react";
import { CheckIcon, WarningIcon } from "@chakra-ui/icons";
import {
    Badge,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Link, Skeleton,
    Table,
    TableContainer, Tbody, Td, Th,
    Thead, Tr,
    VStack
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { User } from "../../components/user";
import {
    PontifexGetEndpointOwnersResponse,
    PontifexGetPendingPermissionRequestsResponse,
    PontifexGetPermissionRequestResponse
} from "../../models/axios";
import { readApiEndpoint, readPermissionRequest, readUser } from "../../resources";

const PermissionRequestDetailsPage = () => {
    const router = useRouter()
    const [id, setId] = useState("")
    useEffect(() => {
        if (router.isReady) {
            setId(router.query.id as string)
        }
    }, [router.isReady])

    return (
        <>
            {id ? (<Suspense fallback={<h1>Loading Permission Request...</h1>}>
                <PermissionRequestDetails resource={readPermissionRequest(id as string)}/>
            </Suspense>) : null}

        </>
    )
}

const PermissionRequestDetails = ({resource}) => {
    const {permissionRequest, sourceEnvironment, targetEnvironment, targetEndpoint}: PontifexGetPermissionRequestResponse = resource.read()


    const sourceEnvironmentNameParts = sourceEnvironment.name.split(/-(.*)/g)
    const targetEnvironmentNameParts = targetEnvironment.name.split(/-(.*)/g)

    const [isOwner, setIsOwner] = useState(false)

    const {accounts} = useMsal();
    const accountId = accounts[0].idTokenClaims.oid;

    useEffect(() => {
        const getIsOwner = async () => {
            const {data: {owners}} = await axios.get<PontifexGetEndpointOwnersResponse>(`/api/endpoints/${targetEndpoint.id}/owners`)

            setIsOwner(owners.some(owner => owner.id === accountId))
        }

        getIsOwner()
    })

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

    const insightsFallback =
        <VStack>
            <Skeleton height='20px' width={'400px'}/>
            <Skeleton height='20px' width={'400px'}/>
            <Skeleton height='20px' width={'400px'}/>
        </VStack>

    return <>
        <VStack>
            <VStack>
                <Heading>Permission Request Details</Heading>
                <h3>ID: {permissionRequest.id}</h3>
                <h3>Requestor: <Suspense fallback={permissionRequest.requestor}>
                    <User resource={readUser(permissionRequest.requestor)}/>
                </Suspense>
                </h3>
                <h3>Create Date: {permissionRequest.createDate}</h3>
                <h3>Status: <Badge
                    colorScheme={getBadgeColor(permissionRequest.status)}>{permissionRequest.status}</Badge></h3>
            </VStack>

            <Flex alignItems={'beginning'}>
                <VStack m={2} p={5} shadow='md' borderWidth='1px' rounded='lg'>
                    <Heading>Source Environment</Heading>
                    <h3><Link href={`/environments/${sourceEnvironment.id}`}>{`${sourceEnvironmentNameParts[1]} (${sourceEnvironmentNameParts[0].toUpperCase()})`}</Link></h3>
                </VStack>
                <HStack alignItems={'center'}>
                    <img
                        src="/bridge.png"
                        title="Bridge"
                        width="50px"
                        height="50px"
                    />
                </HStack>
                <VStack m={2} p={5} shadow='md' borderWidth='1px' rounded='lg'>
                    <Heading>Target API Endpoint</Heading>
                    <h3>Name: <Link href={`/endpoints/${targetEndpoint.id}`}>{targetEndpoint.name}</Link></h3>
                    <h3>Environment: <Link href={`/environments/${sourceEnvironment.id}`}>{`${sourceEnvironmentNameParts[1]} (${sourceEnvironmentNameParts[0].toUpperCase()})`}</Link></h3>
                    <h3>Sensitive: {JSON.stringify(targetEndpoint.sensitive)}</h3>
                </VStack>
            </Flex>

            {isOwner ?
                <VStack boxShadow={'md'} borderWidth={'1px'} rounded={'lg'} p={5}>
                    <Heading>Insights</Heading>
                    <Suspense fallback={insightsFallback}>
                        <Insights resource={readApiEndpoint(targetEndpoint.id)} sourceEnvironment={sourceEnvironment}/>
                    </Suspense>
                    <AdminActions pr={permissionRequest}/>
                </VStack>
                : null}
        </VStack>
    </>
}

const Insights = ({resource, sourceEnvironment}) => {
    const {environment} = resource.read()

    return <>
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Check</Th>
                        <Th>Result</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td>Environments match ({`${environment.level} === ${sourceEnvironment.level}`})</Td>
                        <Td textAlign={'center'}>{environment.level === sourceEnvironment.level ? <CheckIcon color='green'/> :
                            <WarningIcon color={'red'}/>}</Td>
                    </Tr>
                </Tbody>
            </Table>
        </TableContainer>
    </>
}

const AdminActions = ({pr}) => {
    const updateStatus = async (approved) => {
        console.log("updating permission request status, approved: ", approved)

        const res = await axios.patch(`/api/permission-requests/${pr.id}`, {
            status: approved ? "APPROVED" : "REJECTED"
        })
        window.location.reload()
    }

    return <>
        <VStack p={5} shadow='md' borderWidth='1px' rounded='lg'>
            <Heading>Admin Actions</Heading>
            <HStack>
                {pr.status !== 'APPROVED' ?
                    <Button colorScheme='green' onClick={() => updateStatus(true)}>Approve</Button> : null}
                {pr.status !== 'REJECTED' ?
                    <Button colorScheme='red' onClick={() => updateStatus(false)}>Reject</Button> : null}
            </HStack>
        </VStack>
    </>
}

export default PermissionRequestDetailsPage