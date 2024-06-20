import "./PostElement.css"
import type { Post } from '../../../../Kudos-Board-Backend/node_modules/@prisma/client'

interface Props{
    post: Post
}

const PostElement = ({post}: Props) => {

    return (
        <div>{post.title}</div>
    )
}

export default PostElement;
