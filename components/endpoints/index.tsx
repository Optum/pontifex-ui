import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export const EndpointList = ({endpoints}) => {
    const environmentItems = endpoints.map(endpoint =>
        <Tr>
            <Td>{endpoint.name}</Td>
            <Td>{endpoint.id}</Td>
            <Td>{JSON.stringify(endpoint.sensitive)}</Td>
            <Td textAlign='center'>
                <a href={`/endpoints/${endpoint.id}`}>
                    <ExternalLinkIcon />
                </a>
            </Td>
        </Tr>
    );

    if(environmentItems.length === 0) {
        environmentItems.push( <Tr>
            <Td>No Endpoints</Td>
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
                        <Th>Endpoint Name</Th>
                        <Th>ID</Th>
                        <Th>Sensitive</Th>
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