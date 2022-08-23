import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Accordion,
    AccordionButton,
    AccordionItem,
    AccordionPanel, Badge,
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr, VStack
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Suspense } from "react";
import { PontifexGetEnvironmentResponse } from "../../models/axios";
import { readEnvironment } from "../../resources";
import { PermissionRequestList } from "../permission-request";

export const EnvironmentList = ({environments}) => {

    const environmentItems = environments.map(env =>
        <Tr key={env.id}>
            <Td>{env.name}</Td>
            <Td>{env.id}</Td>
            <Td textAlign='center'>
                <a href={`/environments/${env.id}`}>
                    <ExternalLinkIcon/>
                </a>
            </Td>
        </Tr>
    );

    if (environmentItems.length === 0) {
        environmentItems.push(<Tr>
            <Td>No Environments</Td>
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
                        <Th>Environment Name</Th>
                        <Th>ID</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {environmentItems}
                </Tbody>
            </Table>
        </TableContainer>
    </>
}

export const EnvironmentAccordion = ({resource}) => {
    const {environment, permissionRequests}: PontifexGetEnvironmentResponse = resource.read()

    const pendingRequestCount = permissionRequests.filter(pr => pr.status === 'PENDING').length

    const router = useRouter()

    return <AccordionItem key={environment.id}>
        <h2>
            <Flex alignContent='center' justifyContent={'space-between'} width={'100%'}>
            <AccordionButton borderWidth={'1px'} rounded={'lg'}>
                    <HStack>
                        <Heading as={'h2'} fontSize={'md'}>{environment.name.split("-")[0].toUpperCase()}</Heading>
                        {pendingRequestCount > 0 ? <Badge marginLeft={5}
                                                          colorScheme='yellow'>{`${pendingRequestCount} Pending Request${pendingRequestCount > 1 ? 's' : ''}`}</Badge> : null}
                    </HStack>
            </AccordionButton>
                <a key={environment.id} href={`/environments/${environment.id}`}>
                    <Button variant={'ghost'}>
                        <ExternalLinkIcon/>
                    </Button>
                </a>
            </Flex>
        </h2>
        <AccordionPanel>
            <VStack>
                <Suspense>
                    <PermissionRequestList permissionRequests={permissionRequests}/>
                </Suspense>
            </VStack>
        </AccordionPanel>
    </AccordionItem>
}

export const EnvironmentsAccordion = ({environments}) => {
    const accordionItems = environments.map(env => <Suspense><EnvironmentAccordion resource={readEnvironment(env.id)}/></Suspense>)

    return <Accordion allowMultiple allowToggle>
        {accordionItems}
    </Accordion>
}