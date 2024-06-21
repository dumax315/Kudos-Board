import "./PostElement.css"
import { PostWithAuthor } from "../../types"
import { Button } from "@mantine/core"
import { UserContext } from "../../App";
import { useContext } from "react";

interface Props {
    post: PostWithAuthor;
    setPosts: (posts: PostWithAuthor[]) => void;
}

const PostElement = ({ post, setPosts}: Props) => {
    const user = useContext(UserContext)

    const upvotePost = async () => {
        if(!user){
            alert("You must be logged in to upvote a post");
            return;
        }
        let url = import.meta.env.VITE_RESTFUL_URL + "/board/" + post.boardId + "/posts/" + post.id +"/upvote/";

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
            headers
        };
        const res = await fetch(url, options);
        if(!res.ok){
            alert("Error upvoting post");
            return;
        }
        const data = await res.json();
        setPosts(data);
    }

    return (
        <div className="postElement">
            <h3>{post.title}</h3>
            <img className="postImage" src={post.imageUrl} alt={"Image for " + post.title} />
            <p>{post.description}</p>
            {post.author ?
                <p>Posted by {post.author.name}</p> :
                <p>Posted by guest</p>
            }
            <div>{post.upvotedUsers.length}</div>
            <Button onClick={() => upvotePost()}>Upvote</Button>

        </div>
    )
}

export default PostElement;
