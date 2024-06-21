import "./CreateNewPostModal.css"

import { Button, Modal, TextInput, Textarea, Notification } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form'
import type { Post } from '../../../../Kudos-Board-Backend/node_modules/@prisma/client'
import { useContext, useState } from "react";
import GiphySearch from "./GiphySearch";
import { UserContext } from '../../App'

interface Props {
    isOpen: boolean,
    closeModal: () => void,
    updatePosts: (posts: Post[]) => void,
    boardId: number,
}

const CreateNewPostModal = ({ isOpen, closeModal, updatePosts, boardId }: Props) => {
    const user = useContext(UserContext);

    const [formError, setFormError] = useState<string | null>(null);

    const imageUrlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const form = useForm({
        mode: 'controlled',
        initialValues: { newPostName: '', newPostDescription: '', newPostImageUrl: ''},
        validate: {
            newPostName: hasLength({ min: 2, max: 20 }, 'Card name must be between 2 and 20 characters'),
            newPostDescription: hasLength({ min: 2, max: 256 }, 'Card description must be between 2 and 256 characters'),
            newPostImageUrl: (value) => (imageUrlRegex.test(value) ? null : 'Invalid image url'),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        let url = import.meta.env.VITE_RESTFUL_URL + "/board/" + boardId;

        // only attempt to set the Authorization header if user is not null
        const headers = user ? {
            "Content-Type": "application/json",
            accept: 'application/json',
            'Authorization': `Bearer ${user!.token}`
        }: {
            "Content-Type": "application/json",
            accept: 'application/json',
            'Authorization': ""
        };

        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify({
                title: values.newPostName,
                description: values.newPostDescription,
                imageUrl: values.newPostImageUrl
            })
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                setFormError(response.statusText);
                return;
            }
            const data = await response.json();
            updatePosts(data);
            closeModal();
        } catch (error) {
            let errorMessage = (error as Error).message;
            setFormError(errorMessage);
        }
    };

    const setSelectedGifUrl = (url: string) => {
        form.setFieldValue('newPostImageUrl', url)
    }

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal()}
            title={"Create a new Card"}
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
                <TextInput {...form.getInputProps('newPostName')} autoComplete="on" label="Card Title" placeholder="" />
                <Textarea {...form.getInputProps('newPostDescription')} autoComplete="on" label="Card Description" placeholder="" />
                <GiphySearch setSelectedGifUrl={setSelectedGifUrl}/>
                <TextInput {...form.getInputProps('newPostImageUrl')} autoComplete="on" label="Image Url" placeholder="https://" />
                <Button type="submit">Submit</Button>
            </form>
        </Modal>
    )
}

export default CreateNewPostModal;
