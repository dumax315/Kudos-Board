import { useParams } from "react-router-dom";
import "./Posts.css"
import { useGetJsonArrayData } from "../../hooks";
import type { Post, Board } from '../../../../Kudos-Board-Backend/node_modules/@prisma/client'
import { SimpleGrid } from "@mantine/core";
import PostElement from "../elements/PostElement";
import { useEffect, useState } from "react";


const Posts = () => {
    const { boardId } = useParams();

    const [posts, setPosts] = useGetJsonArrayData<Post[]>(import.meta.env.VITE_RESTFUL_URL + "/board/" + boardId + "/posts/");
    const [boardData, setBoardData] = useState<Board | null>(null);

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

    return (
        <main>
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
