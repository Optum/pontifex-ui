import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
    Avatar,
    AvatarBadge,
    Icon,
    Flex,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useColorMode,
    Text,
    useToast, HStack
} from '@chakra-ui/react'
import axios from 'axios'
import { User } from './user'

export interface GlobalNavigationLink {
    hrefPath: string
    displayText: string
    disableGlobalSearch?: boolean
}

export interface AccountMenu {
    signInPath: string
    signOutPath: string
    userInfoPath: string
    profilePath: string
    userFromInfo: (userInfo: any) => User
}

export interface AccountMenuProps {
    accountMenu: AccountMenu
    pathname: string
    color: string
    isDark: boolean
}

export interface AccountMenuListItem {
    href: string
    text: string
}

export interface AccountMenuListProps {
    items: AccountMenuListItem[]
}

export interface GlobalNavigationProps {
    accountMenu: AccountMenu
    navLinks: GlobalNavigationLink[]
    applicationName?: string
}

export const GlobalNavigation = ({
                                     accountMenu,
                                     navLinks,
                                     applicationName
                                 }) => {
    const {pathname} = useRouter()
    const {colorMode} = useColorMode()
    const bgColor = {light: 'gray.900', dark: 'gray.300'}
    const color = {light: 'gray.100', dark: 'gray.900'}
    return (
        <Flex
            direction="column"
            width="100%"
            minHeight="1rem"
            backgroundColor={bgColor[colorMode]}
            borderTopWidth="2px"
        >
            <Flex
                pl={5}
                direction="row"
                width="100%"
                justifyContent="space-between"
            >
                <HStack
                    justifyContent="center"
                    alignItems="center">
                    <img
                        src="/pontifex-white.png"
                        title="Pontifex"
                        height="68px"
                        width="90px"
                    />
                    <Text
                        fontSize="2xl"
                        fontWeight="semibold"
                        lineHeight="taller"
                        color={colorMode === 'dark' ? color.dark : color.light}
                    >
                        {applicationName}
                    </Text>
                </HStack>
            </Flex>
        </Flex>
    )
}
