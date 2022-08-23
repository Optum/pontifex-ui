import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr
} from "@chakra-ui/react";
import { Suspense } from "react";
import { readUser } from "../../resources";
import { User } from "../user";

export const AuditEventList = ({resource}) => {
    const {events} = resource.read()

    const eventItems = events.sort(function(a, b) {
        return (a.createDate < b.createDate) ? -1 : ((a.createDate > b.createDate) ? 1 : 0);
    }).map(event =>
        <Tr key={event.id}>
            <Td>{event.createDate}</Td>
            <Td>{event.id}</Td>
            <Td>{event.action}</Td>
            <Td><Suspense fallback={event.associatedUserId}>
                <User resource={readUser(event.associatedUserId)}/>
            </Suspense></Td>
        </Tr>
    );

    return <>
        <Accordion allowToggle border={'1px'} rounded={'lg'}>
            <AccordionItem>
                <h2>
                    <AccordionButton>
                        <Box flex='1' textAlign='left'>
                            Click for Events
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                </h2>
                <AccordionPanel>
                    <TableContainer>
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th>Timestamp</Th>
                                    <Th>Event ID</Th>
                                    <Th>Action</Th>
                                    <Th>Associated User ID</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {eventItems}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    </>
}