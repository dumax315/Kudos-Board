import { useParams } from "react-router-dom";
import "./Posts.css"
import { useGetJsonArrayData } from "../../hooks";
import type { Post } from '../../../../Kudos-Board-Backend/node_modules/@prisma/client'
import { SimpleGrid } from "@mantine/core";
import PostElement from "../elements/PostElement";


const Posts = () => {
    const { boardId } = useParams();

    const [posts, setPosts] = useGetJsonArrayData<Post[]>(import.meta.env.VITE_RESTFUL_URL + "/board/" + boardId + "/posts/");

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
