import { useParams } from "react-router-dom";
import "./Posts.css"
import { useBooleanState, useGetJsonArrayData } from "../../hooks";
import type { Post, Board } from '../../../../Kudos-Board-Backend/node_modules/@prisma/client'
import { Button, SimpleGrid } from "@mantine/core";
import PostElement from "../elements/PostElement";
import { useEffect, useState } from "react";
import CreateNewPostModal from "../forms/CreateNewPostModal";


const Posts = () => {
    const { boardId } = useParams();

    const [posts, setPosts] = useGetJsonArrayData<Post[]>(import.meta.env.VITE_RESTFUL_URL + "/board/" + boardId + "/posts/");
    const [boardData, setBoardData] = useState<Board | null>(null);
    const [isNewPostOpen, handleCloseNewPostModal, handleOpenNewPostModal] = useBooleanState(false);

    const loadBoardData = async () => {
        const url = import.meta.env.VITE_RESTFUL_URL + "/board/" + boardId;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        };
        const response = await fetch(url, options);
        const data = await response.json();

        setBoardData(data);
    }

    useEffect(() => {
        loadBoardData();
    }, [])

    /**
     * Passed to the CreateNewBoardModal component to update the boards state when a new board is created
     * @param newBoards the fresh boards array to set in the boards state
     */
    const handlePostsUpdate = (newBoards: Post[]) => {
        setPosts(newBoards);
    }

    return (
        <main>
            <Button onClick={() => handleOpenNewPostModal()}>Create New Card</Button>
            <CreateNewPostModal isOpen={isNewPostOpen} closeModal={() => handleCloseNewPostModal()} updatePosts={handlePostsUpdate} boardId={parseInt(boardId!)}/>
            <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 5 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
                {posts.map((post, i) => {
                    return (
                        <PostElement key={i} post={post} />
                    )
                })}
            </SimpleGrid>
        </main>
    )
}

export default Posts;
