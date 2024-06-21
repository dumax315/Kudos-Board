import "./PostElement.css"
import { PostWithAuthor } from "../../types"
import { Button } from "@mantine/core"
import { UserContext } from "../../App";
import { useContext, useEffect, useState } from "react";

interface Props {
    post: PostWithAuthor;
    setPosts: (posts: PostWithAuthor[]) => void;
}

const PostElement = ({ post, setPosts}: Props) => {
    const user = useContext(UserContext);

    const [isUpvoted, setIsUpvoted] = useState(false);

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
        if(isUpvoted){
            options.method = 'DELETE';
        }
        const res = await fetch(url, options);
        if(!res.ok){
            alert("Error upvoting post");
            return;
        }
        const data = await res.json();
        setPosts(data);
    }

    /**
     * Sends a DELETE request to the server to delete the Post, the server then checks if the user token matches the posts's author, if so, the post is deleted.
     * @returns {Promise<void>} not intended to return data, but could be awaited
     */
    const deletePost = async () => {
        if (user === null) {
            return;
        }
        const url = import.meta.env.VITE_RESTFUL_URL + `/board/${post.boardId}/posts/${post.id}`;
        const options = {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
                'Authorization': 'Bearer ' + user.token,
            }
        };
        const res = await fetch(url, options);
        if(!res.ok){
            alert("Error upvoting post");
            return;
        }
        const data = await res.json();
        setPosts(data);

    }

    /**
     * Triggers the board deletion, and stops propagation of the click event, so that the link is not triggered. (likely no longer needed)
     * @param event the button click event
     */
    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        deletePost();
    }

    useEffect(() => {
        if(user){
            setIsUpvoted(post.upvotedUsers.findIndex((upvotedUser) => upvotedUser.userId === user.id) !== -1);
        }else{
            setIsUpvoted(false);
        }
    }, [user, post])

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
            <Button onClick={() => upvotePost()}>{isUpvoted ? "removed upvote":"upvote"}</Button>
            {(post.author && user && typeof user.id == "number" && post.author.id == user.id) ?
                <Button onClickCapture={handleDeleteClick}>Delete</Button> : null}
        </div>
    )
}

export default PostElement;
