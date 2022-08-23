import { InteractionRequiredAuthError, InteractionType, PublicClientApplication } from "@azure/msal-browser";
import {
    AuthenticatedTemplate,
    MsalAuthenticationTemplate,
    MsalProvider, useMsal
} from "@azure/msal-react";
import { ChakraProvider } from "@chakra-ui/provider";
import { Flex } from "@chakra-ui/react";
import axios from "axios";
import { AppProps } from "next/app";
import Head from "next/head";
import { Container } from "../components/container";
import { Footer } from "../components/Footer";
import { AccountMenu, GlobalNavigation } from "../components/global-navigation";
import { User } from "../components/global-navigation/user";
import { PrimaryNavigation, PrimaryNavigationLink } from "../components/primary-navigation";
import { loginRequest, msalConfig } from "../config/authConfig";
import '../styles/globals.css'
import { theme } from "../theme";

const msalInstance = new PublicClientApplication(msalConfig);

const refreshAccessToken = async () => {
    const accounts = msalInstance.getAllAccounts();
    msalInstance.setActiveAccount(accounts[0])
    const account = msalInstance.getActiveAccount();
    try {
        const token = await msalInstance.acquireTokenSilent({
            scopes: msalConfig.auth.scopes,
            account,
        });
        return token.idToken;
    } catch (error) {
        console.error("got error when refreshing token", error)
        if (error instanceof InteractionRequiredAuthError) {
            return msalInstance.acquireTokenRedirect(loginRequest)
        } else {
            console.error(error);
        }
    }
};

axios.interceptors.request.use(
    async (config) => {
        // refreshAccessToken method is the one which makes acquireTokenSilent call .
        const token = await refreshAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {

            console.error("couldn't attach bearer token")
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const accountMenu: AccountMenu = {
    signInPath: '/openid/signin',
    signOutPath: '/openid/signout',
    userInfoPath: '/openid/userinfo',
    profilePath: '/profile',
    userFromInfo: (userInfo: any): User => {
        const {family_name, given_name, email, status_code} = userInfo
        const isAuthenticated =
            !status_code || (status_code !== 500 && status_code !== 401)
        return {
            firstName: given_name,
            lastName: family_name,
            email,
            isAuthenticated
        }
    }
}

const primaryLinks: PrimaryNavigationLink[] = [
    {
        hrefPath: '/',
        displayText: 'Home'
    },
    {
        hrefPath: '/dashboard',
        displayText: 'My Dashboard'
    },
    {
        hrefPath: '/applications/create',
        displayText: 'New Application'
    },
    {
        hrefPath: '/connections/update',
        displayText: 'Update Connections'
    }
]

function MyApp({Component, pageProps}: AppProps) {
    return (
        <MsalProvider instance={msalInstance}>
            <MsalAuthenticationTemplate interactionType={InteractionType.Redirect} authenticationRequest={msalConfig.auth}>
                <AuthenticatedTemplate>
                    <ChakraProvider theme={theme}>
                        <Head>
                            <title>Pontifex</title>
                        </Head>
                        <Container>
                            <GlobalNavigation
                                accountMenu={accountMenu}
                                navLinks={[]}
                                applicationName="Pontifex"
                            />
                            <PrimaryNavigation navLinks={primaryLinks} />
                            <Flex
                                grow={1}
                                shrink={0}
                                basis={"auto"}
                                direction={"column"}
                                padding={5}
                            >
                                    <Component {...pageProps} />
                            </Flex>
                            <Footer />
                        </Container>
                    </ChakraProvider>
                </AuthenticatedTemplate>
            </MsalAuthenticationTemplate>
        </MsalProvider>
    )
}

export default MyApp
