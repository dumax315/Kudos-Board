import "./CreateNewBoardModal.css"

import { Button, Modal, NativeSelect, TextInput, Textarea, Notification } from '@mantine/core';
import { hasLength, useForm, isNotEmpty } from '@mantine/form'
import { useContext, useState } from "react";
import GiphySearch from "./GiphySearch";
import { UserContext } from '../../App'


interface Props {
    isOpen: boolean,
    closeModal: () => void,
    updateBoards: () => void,
}

const CreateNewBoardModal = ({ isOpen, closeModal, updateBoards }: Props) => {
    const user = useContext(UserContext);

    // stores any text that should be desplayed in the form error notificaiton
    const [formError, setFormError] = useState<string | null>(null);

    const imageUrlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const form = useForm({
        mode: 'controlled',
        initialValues: { newBoardName: '', newBoardDescription: '', newBoardCategory: '', newBoardImageUrl: '' },
        validate: {
            newBoardName: hasLength({ min: 2, max: 20 }, 'Board name must be between 2 and 20 characters'),
            newBoardDescription: hasLength({ min: 2, max: 256 }, 'Board description must be between 2 and 256 characters'),
            newBoardCategory: isNotEmpty('Please select a category'),
            newBoardImageUrl: (value) => (imageUrlRegex.test(value) ? null : 'Invalid image url'),
        },
    });

    /**
     * Sends a POST request to the backend to create a new board. Only sends the user token if the user is logged in.
     * @param values - the form values, autofilled due to useForm()
     * @returns
     */
    const handleSubmit = async (values: typeof form.values) => {
        let url = import.meta.env.VITE_RESTFUL_URL + "/boards";
        const body = {
            title: values.newBoardName,
            description: values.newBoardDescription,
            category: values.newBoardCategory,
            imageUrl: values.newBoardImageUrl,
        }

        // only attempt to set the Authorization header if user is not null
        const headers = user ? {
            "Content-Type": "application/json",
            accept: 'application/json',
            'Authorization': `Bearer ${user.token}`
        }: {
            "Content-Type": "application/json",
            accept: 'application/json',
            'Authorization': ""
        };

        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                setFormError(response.statusText);
                return;
            }
            await response.json();
            updateBoards();
            closeModal();
        } catch (error) {
            let errorMessage = (error as Error).message;
            setFormError(errorMessage);
        }
    };

    const setSelectedGifUrl = (url: string) => {
        form.setFieldValue('newBoardImageUrl', url)
    }

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal()}
            title={"Create a new Board"}
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
                <TextInput {...form.getInputProps('newBoardName')} autoComplete="on" label="Board Title" placeholder="" />
                <Textarea {...form.getInputProps('newBoardDescription')} autoComplete="on" label="Board Description" placeholder="" />
                <NativeSelect
                    {...form.getInputProps('newBoardCategory')}
                    label="Category"
                    data={[{ label: "Choose a Category", value: "" }, "Celebration", "Thank You", "Inspiration"]}
                />
                <GiphySearch setSelectedGifUrl={setSelectedGifUrl} />
                <TextInput {...form.getInputProps('newBoardImageUrl')} autoComplete="on" label="Image Url" placeholder="https://" />
                <Button type="submit">Submit</Button>
            </form>
        </Modal>
    )
}

export default CreateNewBoardModal;
