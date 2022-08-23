import { AuthenticatedTemplate } from "@azure/msal-react";
import { Button, Checkbox, CheckboxGroup, Flex, Heading, Input, Select, Skeleton, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { useWizard, Wizard } from 'react-use-wizard';
import {
    readAllApplications,
    readOwnedApplications, readEnvironmentApiEndpoints, readApplicationEnvironments, requestAccess
} from "../../resources";

const UpdateConnections = () => {

    const [state, updateState] = useState({});

    const updateForm = (key, value) => {

        state[key] = value;
        updateState(state);
    };


    return (
        <AuthenticatedTemplate>
            <Wizard footer={<Footer/>}>
                <SelectSourceApplication update={updateForm}/>
                <SelectSourceEnvironment update={updateForm} state={state}/>
                <SelectTargetApplication update={updateForm} state={state}/>
                <SelectTargetEnvironment update={updateForm} state={state}/>
                <SelectTargetEndpoints update={updateForm} state={state}/>
                <ShowValues state={state}/>
                <RequestAccess state={state}/>
                <RedirectToEnvironment/>
            </Wizard>
        </AuthenticatedTemplate>
    );
}

const RequestAccess = ({state}) => {
    const {handleStep} = useWizard()
    const router = useRouter()

    handleStep(() => {
        router.push(`/environments/${state.sourceEnvironment}`)
    })
    return (
        <div>
            <Suspense
                fallback={
                    <>
                        <Heading>Synchronizing Access...</Heading>
                        <Skeleton startColor='gray.500'
                                  endColor='white.500'
                                  height='40px'/>
                    </>
                }>
                <AccessRequestStatus resource={requestAccess(state.sourceEnvironment, state.targetEnvironment, state.targetEndpoints)} />
            </Suspense>
        </div>
    )
}

const AccessRequestStatus = ({resource}) => {
    const status = resource.read()

    return (
        <>
            <Heading>Access Synchronization: {status === 204 ? "Successful" : "Failed"}</Heading>
            <p>Click the 'Next' button to navigate to source environment</p>
        </>
    )
}

const RedirectToEnvironment = () => {
    return <>
        <p>Redirecting to source environment</p>
    </>
}

const SelectSourceApplication = ({update}) => {

    return (
        <div>
            <Heading className='text-center'>Select Source Application</Heading>
            <Text>This is the application that you own that needs to access a different application's endpoints</Text>
            <Suspense fallback={<Skeleton startColor='gray.500' endColor='white.500' height='40px'/>}>
                <SingleResourceSelector resource={readOwnedApplications()} update={update}
                                        selectPlaceholder="Select Source Application" fieldName="sourceApplication"
                                        nameResolver={(item) => `${item.name} : ${item.id}`}/>
            </Suspense>
        </div>
    );
};

const SelectSourceEnvironment = ({update, state}) => {

    return (
        <div>
            <Heading className='center'>Select Source Environment</Heading>
            <Text>This is the environment within the application where traffic will originate from</Text>
            <Text>Note: You shouldn't cross different environment stages.  If you select a dev environment here, the target environment should also be dev</Text>
            <Suspense fallback={<Skeleton startColor='gray.500' endColor='white.500' height='40px'/>}>
                <SingleResourceSelector resource={readApplicationEnvironments(state.sourceApplication)} update={update}
                                        selectPlaceholder="Select Source Environment" fieldName="sourceEnvironment"
                                        nameResolver={(item) => `${item.name} : ${item.id}`}/>
            </Suspense>
        </div>
    );
};

const SelectTargetApplication = ({update, state}) => {

    return (
        <div>
            <Heading className='text-center'>Select Target Application</Heading>
            <Text>This is the application that your source application needs to access</Text>
            <Suspense fallback={<Skeleton startColor='gray.500' endColor='white.500' height='40px'/>}>
                <SingleResourceSelector resource={readAllApplications()}
                                        update={update}
                                        selectPlaceholder="Select Target Application"
                                        fieldName="targetApplication"
                                        nameResolver={(item) => `${item.name} : ${item.id}`}
                                        filter={(item) => item.id !== state.sourceApplication}
                />
            </Suspense>
        </div>
    );
};

const SelectTargetEnvironment = ({update, state}) => {

    return (
        <div>
            <Heading className='text-center'>Select Target Environment</Heading>
            <Text>This is the environment within the application where traffic will originate from</Text>
            <Text>Note: You shouldn't cross different environment stages.  If you had selected a dev environment previously, this environment should also be dev</Text>
            <Text>This will be enforced in future releases</Text>
            <Suspense fallback={<Skeleton startColor='gray.500' endColor='white.500' height='40px'/>}>
                <SingleResourceSelector resource={readApplicationEnvironments(state.targetApplication)} update={update}
                                        selectPlaceholder="Select Target Environment" fieldName="targetEnvironment"
                                        nameResolver={(item) => `${item.name} : ${item.id}`}/>
            </Suspense>
        </div>
    );
};

const SelectTargetEndpoints = ({update, state}) => {

    return (
        <div>
            <Heading className='text-center'>Select Target Environment</Heading>
            <Text>Select the endpoints you wish to access</Text>
            <Suspense fallback={<Skeleton startColor='gray.500' endColor='white.500' height='40px'/>}>
                <MultiResourceSelector resource={readEnvironmentApiEndpoints(state.targetEnvironment)} update={update}
                                       selectPlaceholder="Select Target Roles" fieldName="targetEndpoints"
                                       nameResolver={(item) => item.name}
                                       keyResolver={(item) => item.id}
                />
            </Suspense>
        </div>
    );
};

interface ResourceSelectorProps {
    resource: { read(): any }
    update: (key: string, value: string) => void
    fieldName: string
    selectPlaceholder: string
    nameResolver?: (item: any) => string
    valueResolver?: (item: any) => string
    idResolver?: (item: any) => string
    keyResolver?: (item: any) => string
    filter?: (item: any) => boolean
}

const SingleResourceSelector = (props: ResourceSelectorProps) => {
    const {
        resource,
        update,
        fieldName,
        selectPlaceholder,
        nameResolver,
        valueResolver,
        idResolver,
        keyResolver,
        filter
    } = props
    const items = resource.read()

    const filteredItems = filter ? items.filter(filter) : items

    const onSelect = (e) => {
        update(fieldName, e.target.value)
    }

    return (
        <Select placeholder={selectPlaceholder} onChange={onSelect}>
            {
                filteredItems?.map(item =>
                    <option key={keyResolver?.(item) ?? item.id} id={idResolver?.(item) ?? item.id}
                            value={valueResolver?.(item) ?? item.id}>{nameResolver?.(item) ?? item.name}</option>)
            }
        </Select>
    )
}

const MultiResourceSelector = (props: ResourceSelectorProps) => {
    const {
        resource,
        update,
        fieldName,
        selectPlaceholder,
        nameResolver,
        valueResolver,
        idResolver,
        keyResolver,
        filter
    } = props

    const items = resource.read()

    const filteredItems = filter ? items.filter(filter) : items

    const [checkedItems, setCheckedItems] = useState(filteredItems.map((item) => false))

    useEffect(() => {
        update(fieldName, filteredItems.filter((item, index) => checkedItems[index]))
    }, [checkedItems])

    return (
        <CheckboxGroup colorScheme='green'>
            <Stack pl={6} mt={1} spacing={1}>
                {
                    filteredItems?.map((item, index) =>
                        <Checkbox
                            key={keyResolver?.(item) ?? item.id}
                            isChecked={checkedItems[index]}
                            onChange={(e) => {
                                const checkedState = [...checkedItems]
                                checkedState[index] = e.target.checked
                                setCheckedItems(checkedState)
                            }}
                        >
                            {nameResolver?.(item) ?? item.name}
                        </Checkbox>)
                }
            </Stack>
        </CheckboxGroup>
    )
}

const ShowValues = ({state}) => {

    console.log("form", Object.entries(state))

    return (
        <div>
            {Object.entries(state).map(([k, v]) => (<p key={k}>{`${k} : ${JSON.stringify(v)}`}</p>))}
        </div>
    );
};

const Footer = () => {
    const {
        nextStep,
        previousStep,
        isLoading,
        activeStep,
        stepCount,
        isLastStep,
        isFirstStep,
    } = useWizard();

    return (
        <>
            {/*<br/>*/}
            {/*<div style={{display: 'flex', gap: '1rem'}}>*/}
            {/*    <p>Has previous step: {!isFirstStep ? '✅' : '⛔'}</p>*/}
            {/*    <br/>*/}
            {/*    <p>Has next step: {!isLastStep ? '✅' : '⛔'} </p>*/}
            {/*    <br/>*/}
            {/*    <p>*/}
            {/*        Active step: {activeStep + 1} <br/>*/}
            {/*    </p>*/}
            {/*    <br/>*/}
            {/*    <p>*/}
            {/*        Total steps: {stepCount} <br/>*/}
            {/*    </p>*/}
            {/*</div>*/}
            <Flex marginTop={5} justify={"space-between"}>
                <Button
                    onClick={() => previousStep()}
                    disabled={isLoading || isFirstStep}
                >
                    Previous
                </Button>
                <Button onClick={() => nextStep()} disabled={isLoading || isLastStep}>
                    Next
                </Button>
            </Flex>
        </>
    );
};

export default UpdateConnections