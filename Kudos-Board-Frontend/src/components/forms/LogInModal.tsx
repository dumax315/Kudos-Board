import { Button, Modal, TextInput, Notification, PasswordInput, Group } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { useState } from "react";

interface Props {
    isOpen: boolean,
    closeModal: () => void,
    switchAuthAction: () => void,
    setToken: (token: string) => void,
}

const LogInModal = ({ isOpen, closeModal, switchAuthAction, setToken }: Props) => {
    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm({
        mode: 'controlled',
        initialValues: { email: '', password: '' },
        validate: {
            email: isEmail(),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        let url = import.meta.env.VITE_RESTFUL_URL + "/login";
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                accept: 'application/json',
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
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
            title={"Log In"}
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
                <TextInput {...form.getInputProps('email')} autoComplete="email" label="Email" placeholder="zuck@meta.com" />
                <PasswordInput {...form.getInputProps('password')} autoComplete="current-password" label="Password" placeholder="" />
                <Group>
                    <Button type="submit">Submit</Button>
                    <Button onClick={switchAuthAction}>Sign Up instead</Button>
                </Group>
            </form>
        </Modal>
    )
}

export default LogInModal;
