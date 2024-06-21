import { BoardWithAuthor } from "../../types"
import "./BoardElement.css"
import { Link } from "react-router-dom"
import { UserContext } from '../../App'
import { useContext } from "react"
import { Button } from "@mantine/core"


interface Props {
    board: BoardWithAuthor;
    reloadBoards: () => void;
}

const BoardElement = ({ board, reloadBoards }: Props) => {
    const user = useContext(UserContext);

    const deleteBoard = async () => {
        if (user === null) {
            return;
        }
        const url = import.meta.env.VITE_RESTFUL_URL + "/board/" + board.id;
        const options = {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
                'Authorization': 'Bearer ' + user.token,
            }
        };
        await fetch(url, options);
        reloadBoards();

    }

    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(event);
        event.preventDefault();
        event.stopPropagation();
        deleteBoard();
    }

    return (
        <div className="BoardElement">
            <Link className="boardLink" to={`/Kudos-Board/${board.id}/posts`}>
                <h2>{board.title}</h2>
                <p>{board.category}</p>
                <p className="boardDescription">{board.description}</p>
                <img className="boardImage" src={board.imageUrl} alt={"Image for " + board.title} />
                {board.author ?
                    <div>Created by {board.author.name}</div>
                    : <div>Created by Guest</div>}

            </Link>
            {(board.author && user && typeof user.id == "number" && board.author.id == user.id) ?
                <Button onClickCapture={handleDeleteClick}>Delete</Button> : null}
        </div>
    )
}

export default BoardElement;
