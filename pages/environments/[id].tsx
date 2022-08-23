import { Heading, Link, Skeleton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { EndpointList } from "../../components/endpoints";
import { PermissionRequestList } from "../../components/permission-request";
import { PontifexGetEnvironmentResponse } from "../../models/axios";
import { readEnvironment, readPermissionRequest } from "../../resources";

const ApplicationDetails = () => {
    const router = useRouter()
    const [id, setId] = useState("")
    useEffect(() => {
        if (router.isReady) {
            setId(router.query.id as string)
        }
    }, [router.isReady])

    console.log("load environment", id)

    return (
        <>
            {id ? (<Suspense fallback={<h1>Loading Environment...</h1>}>
                <Environment resource={readEnvironment(id as string)}/>
            </Suspense>) : null }

        </>
    )
}

const Environment = ({resource}) => {
    const resp: PontifexGetEnvironmentResponse = resource.read()

    return <>
        <Heading as={'h1'} fontSize={'lg'}>Name: {resp?.environment.name}</Heading>
        <Heading as={'h2'} fontSize={'md'}>Id: {resp?.environment.id}</Heading>
        <Heading as={'h2'} fontSize={'md'}>Application: <Link color="blue" href={`/applications/${resp.application.id}`}>{resp?.application.name}</Link></Heading>
        <Heading as={'h2'} fontSize={'md'}>Endpoints:</Heading>
        <EndpointList endpoints={resp?.endpoints} />
        <Heading as={'h2'} fontSize={'md'}>Permission Requests:</Heading>
        <PermissionRequestList permissionRequests={resp?.permissionRequests} />
    </>
}



export default ApplicationDetails