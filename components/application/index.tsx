import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

export const ApplicationList = ({resource}) => {
    const applications = resource.read()

    const applicationItems = applications.map(app =>
        <Tr key={app.id}>
            <Td>{app.name}</Td>
            <Td>{app.id}</Td>
            <Td textAlign='center'>
                <a href={`/applications/${app.id}`}>
                    <ExternalLinkIcon />
                </a>
            </Td>
        </Tr>
    );

    return <>
        <TableContainer>
            <Table variant='simple'>
                <Thead>
                    <Tr>
                        <Th>Application Name</Th>
                        <Th>ID</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {applicationItems}
                </Tbody>
            </Table>
        </TableContainer>
    </>
}