import { Button, Modal, TextInput, Notification, PasswordInput, Group } from "@mantine/core";
import { hasLength, isEmail, isNotEmpty, useForm } from "@mantine/form";
import { useState } from "react";

interface Props {
    isOpen: boolean,
    closeModal: () => void,
    switchAuthAction: () => void,
    setToken: (token: string) => void,
}

const RegisterModal = ({ isOpen, closeModal, switchAuthAction, setToken }: Props) => {
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm({
        mode: 'controlled',
        initialValues: { email: '', password: '', name: '' },
        validate: {
            email: isEmail(),
            name: isNotEmpty('Please select a category'),
            password: hasLength({ min: 6 }, 'Password must be at least 6 characters long'),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        let url = import.meta.env.VITE_RESTFUL_URL + "/register";
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                accept: 'application/json',
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
                name: values.name
            })
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            if (!response.ok) {
                setFormError(response.statusText + " " + data.message);
                return;
            }
            setToken(data.data.accessToken);
            closeModal();
        } catch (error) {
            let errorMessage = (error as Error).message;
            setFormError(errorMessage);
        }
    };

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal()}
            title={"Sign Up"}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >

            <form method="dialog" onSubmit={form.onSubmit(handleSubmit)}>
                {formError ?
                    <Notification color="red" title="Error" onClose={() => { setFormError(null) }} closeButtonProps={{ 'aria-label': 'Hide notification' }}>
                        {formError}
                    </Notification>
                    : null}
                <TextInput {...form.getInputProps('name')} autoComplete="name" label="Name (public)" placeholder="Zuck" />
                <TextInput {...form.getInputProps('email')} autoComplete="email" label="Email" placeholder="zuck@meta.com" />
                <PasswordInput {...form.getInputProps('password')} autoComplete="new-password" label="Password" placeholder="" />
                <Group>
                    <Button type="submit">Submit</Button>
                    <Button onClick={switchAuthAction}>Log In instead</Button>
                </Group>
            </form>
        </Modal>
    )
}

export default RegisterModal;
