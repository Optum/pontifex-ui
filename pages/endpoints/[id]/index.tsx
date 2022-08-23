import { Heading, Link, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { EndpointList } from "../../../components/endpoints";
import { PermissionRequestList } from "../../../components/permission-request";
import { PontifexGetApiEndpointResponse, PontifexGetEnvironmentResponse } from "../../../models/axios";
import { readApiEndpoint, readEnvironment, readPermissionRequest } from "../../../resources";

const EndpointDetailsPage = () => {
    const router = useRouter()
    const [id, setId] = useState("")
    useEffect(() => {
        if (router.isReady) {
            setId(router.query.id as string)
        }
    }, [router.isReady])

    return (
        <>
            {id ? (<Suspense fallback={<h1>Loading API Endpoint...</h1>}>
                <EndpointDetails resource={readApiEndpoint(id as string)}/>
            </Suspense>) : null }

        </>
    )
}

const EndpointDetails = ({resource}) => {
    const {endpoint, environment, requests}: PontifexGetApiEndpointResponse = resource.read()

    return <>
        <Heading as={'h1'} fontSize={'lg'}>Name: {endpoint.name}</Heading>
        <Heading as={'h2'} fontSize={'md'}>Id: {endpoint.id}</Heading>
        <Heading as={'h2'} fontSize={'md'}>Environment: <Link color="blue" href={`/environments/${environment.id}`}>{environment.name}</Link></Heading>
        <Heading as={'h2'} fontSize={'md'}>Permission Requests:</Heading>
        <PermissionRequestList permissionRequests={requests} />
    </>
}



export default EndpointDetailsPage