import "./PostCommentsModal.css"

import { Button, Modal, TextInput, Notification } from '@mantine/core';
import { hasLength, useForm } from '@mantine/form'
import { useContext, useState } from "react";
import { UserContext } from '../../App'
import { PostWithAuthor, Comment } from "../../types";
import { useGetJsonArrayData } from '../../hooks';

interface Props {
    isOpen: boolean,
    closeModal: () => void,
    post: PostWithAuthor,
}

const PostCommentsModal = ({ isOpen, closeModal, post }: Props) => {
    const [comments, , setCommentsUrl] = useGetJsonArrayData<Comment[]>(import.meta.env.VITE_RESTFUL_URL + `/post/${post.id}/comments`);
    const user = useContext(UserContext);

    const [formError, setFormError] = useState<string | null>(null);

    const form = useForm({
        mode: 'controlled',
        initialValues: { comment: '', signiture: '' },
        validate: {
            signiture: hasLength({ min: 1, max: 15 }, 'Signiture name must be between 1 and 15 characters'),
        },
    });

    /**
     * Sends a POST request to the backend to create a new posts. Only sends the user token if the user is logged in.
     * @param values - the form values, autofilled due to useForm()
     * @returns
     */
    const handleSubmit = async (values: typeof form.values) => {
        if (!user) {
            setFormError("You must be logged in to comment on a post");
            return;
        }
        let url = import.meta.env.VITE_RESTFUL_URL + `/post/${post.id}/comments`;

        // only attempt to set the Authorization header if user is not null
        const headers = {
            "Content-Type": "application/json",
            accept: 'application/json',
            'Authorization': `Bearer ${user.token}`
        };

        const options = {
            method: 'POST',
            headers,
            body: JSON.stringify({
                comment: values.comment,
                signiture: values.signiture,
            })
        };
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                setFormError(response.statusText);
                return;
            }
            setCommentsUrl("");
        } catch (error) {
            let errorMessage = (error as Error).message;
            setFormError(errorMessage);
        }
    };

    const commentElement = comments.map((comment, index) => {
        return (
            <div className='commentContainer' key={index}>
                {comment.content ? <p className='commentContent'>{comment.content}</p> : null}
                <p className='commentSig'>{comment.assignedBy}</p>
            </div>
        )
    })

    return (
        <Modal
            opened={isOpen}
            onClose={() => closeModal()}
            title={"Comments"}
            overlayProps={{
                backgroundOpacity: 0.55,
                blur: 3,
            }}
        >

            {commentElement}
            <form method="dialog" onSubmit={form.onSubmit(handleSubmit)}>
                    {formError ?
                        <Notification color="red" title="Error" onClose={() => { setFormError(null) }} closeButtonProps={{ 'aria-label': 'Hide notification' }}>
                            {formError}
                        </Notification>
                        : null}
                    <TextInput {...form.getInputProps('comment')} label="Comment" placeholder="Optional" />
                    <TextInput {...form.getInputProps('signiture')} required label="Signiture" placeholder="" />
                    <Button type="submit">Submit</Button>
                </form>
        </Modal>
    )
}

export default PostCommentsModal;
