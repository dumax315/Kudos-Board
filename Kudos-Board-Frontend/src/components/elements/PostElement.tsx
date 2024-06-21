import "./PostElement.css"
import { PostWithAuthor } from "../../types"

interface Props {
    post: PostWithAuthor
}

const PostElement = ({ post }: Props) => {

    return (
        <div className="postElement">
            <h3>{post.title}</h3>
            <img className="postImage" src={post.imageUrl} alt={"Image for " + post.title} />
            <p>{post.description}</p>
            {post.author ?
                <p>Posted by {post.author.name}</p> :
                <p>Posted by guest</p>
            }

        </div>
    )
}

export default PostElement;
