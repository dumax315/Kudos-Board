import { useParams } from "react-router-dom";
import "./Posts.css"
import { useBooleanState, useGetJsonArrayData } from "../../hooks";
import { Button, SimpleGrid } from "@mantine/core";
import PostElement from "../elements/PostElement";
import { useEffect, useState } from "react";
import CreateNewPostModal from "../forms/CreateNewPostModal";
import { BoardWithAuthor, PostWithAuthor } from "../../types";


const Posts = () => {
    const { boardId } = useParams();

    const [posts, setPosts] = useGetJsonArrayData<PostWithAuthor[]>(import.meta.env.VITE_RESTFUL_URL + "/board/" + boardId + "/posts/");
    const [boardData, setBoardData] = useState<BoardWithAuthor | null>(null);
    const [isNewPostOpen, handleCloseNewPostModal, handleOpenNewPostModal] = useBooleanState(false);

    const loadBoardData = async () => {
        const url = import.meta.env.VITE_RESTFUL_URL + "/board/" + boardId;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                pragma: 'no-cache',
                "cache-control": 'no-cache'
            },
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
    const handlePostsUpdate = (newBoards: PostWithAuthor[]) => {
        setPosts(newBoards);
    }

    return (
        <main>
            {boardData ?
                <div className="boardDetails">
                    <div className="boardDetailsTextContainer">
                        <div className="boardDetailsGroup">
                            <h2 className="boardTitle">{boardData.title}</h2>
                            {boardData.author ?
                                <div>Created by {boardData.author.name}</div>
                                : <div>Created by Guest</div>}
                        </div>
                        <div className="boardDetailsGroup">
                            <p className="boardCategory">Category: {boardData.category}</p>
                            <p className="boardPageDescription">Description: {boardData.description}</p>
                        </div>
                    </div>
                    <img className="boardPageImage" src={boardData.imageUrl} alt={"Image for " + boardData.title} />

                </div>

                : null

            }
            <Button onClick={() => handleOpenNewPostModal()}>Create New Card</Button>
            <CreateNewPostModal isOpen={isNewPostOpen} closeModal={() => handleCloseNewPostModal()} updatePosts={handlePostsUpdate} boardId={parseInt(boardId!)} />
            <SimpleGrid
                cols={{ base: 1, xs: 2, md: 3 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
                {posts.map((post, i) => {
                    return (
                        <PostElement setPosts={handlePostsUpdate} key={i} post={post} />
                    )
                })}
            </SimpleGrid>
        </main>
    )
}

export default Posts;
