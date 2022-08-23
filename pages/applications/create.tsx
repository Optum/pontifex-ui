import {
    Button,
    Checkbox,
    CheckboxGroup,
    FormControl,
    FormErrorMessage,
    FormLabel, Heading,
    Input,
    Stack
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";

import { useFormik } from 'formik';
import { wrap } from "popmotion";
import * as yup from 'yup';

const envs = ["dev", "stage", "prod"]


const CreateApplication = () => {
    const router = useRouter()

    const formik = useFormik({
        initialValues: {
            name: '',
            secret: false,
            environments: []
        },
        onSubmit: async (values) => {
            console.log("creating application", values)
            const body = {
                applicationName: values.name,
                secret: values.secret,
                environments: values.environments
            }

            const res = await axios.post('/api/applications', body)
            console.log("createApplication response", res.data)
            router.push(`/applications/${res.data.id}`)
        },
        validationSchema: yup.object({
            name: yup.string().trim().required('Name is required'),
            secret: yup.bool().required('Is Secret is required'),
            environments: yup.array().min(1)
        }),
        validateOnChange: true
    });

    const handleChange = (e) => {
        const {checked, name} = e.target;
        if (checked) {
            formik.setFieldValue("environments", [...formik.values.environments, name]);
        } else {
            formik.setFieldValue(
                "environments",
                formik.values.environments.filter((v) => v !== name)
            );
        }
    };

    console.log(JSON.stringify(formik.errors))

    const test = (<div></div>)

    conditionallyWrap(test)

    return (
        <>
            <Heading>Create a new Application</Heading>

            <form className="w-50" onSubmit={formik.handleSubmit}>
                <FormControl isRequired isInvalid={formik.errors.name !== undefined}>
                    <FormLabel htmlFor="name" className="form-label">
                        Name
                    </FormLabel>
                    <Input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="My Super Awesome Application"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                </FormControl>

                <div className="mb-3">
                    <FormLabel htmlFor="email" className="form-label">
                        Secret
                    </FormLabel>
                    <Checkbox
                        type="checkbox"
                        name="secret"
                        className="form-control"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <FormErrorMessage>{formik.errors.secret}</FormErrorMessage>
                </div>

                <div id="checkbox-group">Environments</div>
                <FormControl isInvalid={formik.errors.name !== undefined}>
                    <CheckboxGroup aria-labelledby="checkbox-group">
                        <Stack spacing={[1, 5]} direction={['column', 'row']}>
                            {envs.map((env) => (
                                <div key={env}>
                                    <Checkbox
                                        id={env}
                                        type="checkbox"
                                        name={env}
                                        checked={formik.values.environments.includes(env)}
                                        onChange={handleChange}
                                    />
                                    <FormLabel htmlFor={env}>{env}</FormLabel>
                                </div>
                            ))}
                        </Stack>
                    </CheckboxGroup>
                    <FormErrorMessage>{formik.errors.environments as string}</FormErrorMessage>
                </FormControl>

                <Button type="submit" className="btn btn-primary">
                    Send
                </Button>
            </form>
        </>
    );
}

export default CreateApplication

function conditionallyWrap(test: JSX.Element) {
    return (
        <div>
            {test}
        </div>
    )
}
