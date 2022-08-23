import { Badge, Box, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { AuditEventList } from "../../components/audit-event";
import { EnvironmentsAccordion } from "../../components/environment";
import { User } from "../../components/user";
import { readApplication, readApplicationAuditEvents, readUser } from "../../resources";

const ApplicationDetails = () => {
    const router = useRouter()
    const [id, setId] = useState("")
    useEffect(() => {
        if (router.isReady) {
            setId(router.query.id as string)
        }
    }, [router.isReady])

    return <>
        {id ? <Suspense fallback={<h1>Loading Application...</h1>}>
            <Application resource={readApplication(id as string)}/>
        </Suspense> : null}
    </>
}

const Application = ({resource}) => {
    const {application, environments} = resource.read()

    return <>
        <Heading as={'h1'} fontSize={'lg'}>Application Name: {application.name}</Heading>
        <Heading as={'h2'} fontSize={'md'}>Application Id: {application.id}</Heading>
        <Heading as={'h2'} fontSize={'md'}>Creator: <Suspense fallback={application.creator}>
            <User resource={readUser(application.creator)}/>
        </Suspense></Heading>
        <Box><Badge colorScheme={application.secret ? 'red' : 'green'}>{application.secret ? 'SECRET' : 'PUBLIC'}</Badge></Box>
        <Heading as={'h2'} fontSize={'md'}>Environments:</Heading>
        <Suspense>
            <EnvironmentsAccordion environments={environments}/>
        </Suspense>
        <Heading as={'h2'} fontSize={'md'}>Audit Events:</Heading>
        <Suspense>
            <AuditEventList resource={readApplicationAuditEvents(application.id)}/>
        </Suspense>

    </>
}

export default ApplicationDetails