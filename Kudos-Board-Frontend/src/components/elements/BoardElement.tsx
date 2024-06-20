import "./BoardElement.css"
import type { Board } from '../../../../Kudos-Board-Backend/node_modules/@prisma/client'
import { Link } from "react-router-dom"

interface Props{
    board: Board
}

const BoardElement = ({board}: Props) => {
    return (
        <Link to={`/Kudos-Board/${board.id}/posts`}>
            <h2>{board.title}</h2>
            <img src={board.imageUrl} alt={"Image for " + board.title} />
        </Link>
    )
}

export default BoardElement;
