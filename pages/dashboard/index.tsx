import { AuthenticatedTemplate, useMsal } from "@azure/msal-react";
import {
    Flex,
    Heading, Skeleton,
    VStack
} from "@chakra-ui/react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ApplicationList } from "../../components/application";
import { PendingPermissionRequestList } from "../../components/permission-request";
import { readOwnedApplications, readPendingPermissionRequests } from "../../resources";

function ErrorFallback({error, resetErrorBoundary}) {
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    )
}

const DashboardRedirect = () => {
    const {accounts} = useMsal();
    const username = accounts[0].name;

    const fallback = <>
        <Flex>
            <VStack m='5' rounded='lg' borderWidth='1px' boxShadow='xl' padding={5}>
                <Heading as={'h3'} fontSize={'lg'}>Owned Applications</Heading>
                <Skeleton height='20px' width={'500px'}/>
                <Skeleton height='20px' width={'500px'}/>
                <Skeleton height='20px' width={'500px'}/>
            </VStack>
            <VStack m='5' rounded='lg' borderWidth='1px' boxShadow='xl' padding={5}>
                <Heading as={'h3'} fontSize={'lg'}>Pending Permission Requests</Heading>
                <Skeleton height='20px' width={'500px'}/>
                <Skeleton height='20px' width={'500px'}/>
                <Skeleton height='20px' width={'500px'}/>
            </VStack>
        </Flex>
    </>

    return <AuthenticatedTemplate>
        <VStack p={5}>
            <Heading as={'h1'}>{username}'s Dashboard</Heading>
            <Flex>
                <Suspense fallback={fallback}>
                    <ErrorBoundary FallbackComponent={ErrorFallback}>
                        <VStack m='5' rounded='lg' borderWidth='1px' boxShadow='xl' padding={5}>
                            <Heading as={'h3'} fontSize={'lg'}>Owned Applications</Heading>
                            <ApplicationList resource={readOwnedApplications()}/>
                        </VStack>
                        <VStack m='5' rounded='lg' borderWidth='1px' boxShadow='xl' padding={5}>
                            <Heading as={'h3'} fontSize={'lg'}>Pending Permission Requests</Heading>
                            <PendingPermissionRequestList resource={readPendingPermissionRequests()}/>
                        </VStack>
                    </ErrorBoundary>
                </Suspense>
            </Flex>
        </VStack>

    </AuthenticatedTemplate>
}

export default DashboardRedirect