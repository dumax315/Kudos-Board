import "./PostElement.css"
import type { Post } from '../../../../Kudos-Board-Backend/node_modules/@prisma/client'

interface Props {
    post: Post
}

const PostElement = ({ post }: Props) => {

    return (
        <div>
            <h2>{post.title}</h2>
            <img src={post.imageUrl} alt={"Image for " + post.title} />
        </div>
    )
}

export default PostElement;
