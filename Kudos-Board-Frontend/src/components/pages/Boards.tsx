import "./Boards.css"
// TODO: find a better way to get dynamic types from the back end to the front end
import type { Board } from '../../../../Kudos-Board-Backend/node_modules/@prisma/client'
import { useEffect, useState } from "react"
import BoardElement from "../elements/BoardElement";
import CreateNewBoardDialog from "../forms/CreateNewBoardModal";
import { Button } from "@mantine/core";
import { useBooleanState } from "../../hooks";

const Boards = () => {
    const [boards, setBoards] = useState<Board[]>([]);

    const [isNewBoardOpen, handleCloseNewBoardModal, handleOpenNewBoardModal] = useBooleanState(false);

    const loadBoards = async () => {
        let url = import.meta.env.VITE_RESTFUL_URL + "/boards";
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        };
        const response = await fetch(url, options);
        console.log(response);
        const data = await response.json();

        setBoards(data);
    }

    useEffect(() => {
        loadBoards();
    }, [])

    return (
        <main>
            <Button onClick={() => handleOpenNewBoardModal()}>Create New Board</Button>
            <CreateNewBoardDialog isOpen={isNewBoardOpen} closeModal={() => handleCloseNewBoardModal()} />
            {boards.map((board, i) => {
                return (
                    <BoardElement key={i} board={board} />
                )
            })}
        </main>
    )
}

export default Boards;
