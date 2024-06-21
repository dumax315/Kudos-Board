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

    /**
     * Sends a DELETE request to the server to delete the board, the server then checks if the user token matches the board's author, if so, the board is deleted.
     * @returns {Promise<void>} not intended to return data, but could be awaited
     */
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

    /**
     * Triggers the board deletion, and stops propagation of the click event, so that the link is not triggered. (likely no longer needed)
     * @param event the button click event
     */
    const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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
