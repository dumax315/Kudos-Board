import "./CreateNewBoardModal.css"

import { Button, Modal, NativeSelect, TextInput, Textarea } from '@mantine/core';
import { hasLength, useForm, isNotEmpty } from '@mantine/form';
import { useEffect } from "react";

interface Props {
    isOpen: boolean,
    closeModal: () => void,
}

const CreateNewBoardModal = ({ isOpen, closeModal }: Props) => {
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

    const handleSubmit = (values: typeof form.values) => {
        console.log(values);
    };

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
                <TextInput {...form.getInputProps('newBoardName')} label="Board Title" placeholder="" />
                <Textarea {...form.getInputProps('newBoardDescription')} label="Board Description" placeholder="" />
                <NativeSelect
                    {...form.getInputProps('newBoardCategory')}
                    label="Category"
                    data={[{label: "Choose a Category", value: ""}, "Celebration", "Thank You", "Inspiration"]}
                />
                <TextInput {...form.getInputProps('newBoardImageUrl')} label="Image Url" placeholder="https://" />
                <Button type="submit">Submit</Button>
            </form>
        </Modal>
    )
}

export default CreateNewBoardModal;
