import { useParams } from "react-router-dom";
import "./Posts.css"

const Posts = () => {
    const { boardId } = useParams();
    return (
        <main>
            posts <br />
            <div>{boardId}</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. At, vitae cumque incidunt minima doloribus et eius qui tempore quam fuga dignissimos distinctio, ipsa veniam hic voluptatem. Repellat eligendi dolore inventore!
        </main>
    )
}

export default Posts;
