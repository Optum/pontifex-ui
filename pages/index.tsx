import { Box, Text, Heading, HStack, VStack, Flex } from "@chakra-ui/react";
import styles from '../styles/Home.module.css'
import {
    AuthenticatedTemplate,
    UnauthenticatedTemplate, useMsal
} from "@azure/msal-react";

function SignInButton() {
    // useMsal hook will return the PublicClientApplication instance you provided to MsalProvider
    const {instance} = useMsal();

    return <button onClick={() => instance.loginRedirect()}>Sign In</button>;
}

function WelcomeUser() {
    const {accounts} = useMsal();
    const username = accounts[0].username;

    return <>
        <VStack>
            <Heading as='h1' size='2xl'>Welcome to Pontifex!</Heading>
            <Heading as='h2' size='md'>Building Secure Bridges Between Services</Heading>
            <img
                src="/pontifex-black.png"
                title="Pontifex"
                width="25%"
            />
            <Flex padding={5}>
                <VStack m='5' rounded='lg' borderWidth='1px' boxShadow='xl' padding={5} height={''}>
                    <Text fontSize='lg'>
                        Self-service tool for registering application, environments, and endpoints
                    </Text>
                </VStack>
                <VStack m='5' rounded='lg' borderWidth='1px' boxShadow='xl' padding={5}>
                    <Text fontSize='lg'>
                        Integrates with Azure Active Directory to facilitate easy OAuth2/OIDC integration
                    </Text>
                    <img
                        src="/aad.png"
                        title="Pontifex"
                        width="50%"
                    />
                </VStack>
            </Flex>
        </VStack>
    </>;
}

export default function Home() {
    return (
        <div className={styles.container}>
            <AuthenticatedTemplate>
                <WelcomeUser/>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <SignInButton/>
            </UnauthenticatedTemplate>
        </div>
    )
}
