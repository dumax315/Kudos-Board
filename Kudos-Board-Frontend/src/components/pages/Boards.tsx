import "./Boards.css"
// TODO: find a better way to get dynamic types from the back end to the front end
import type { Board } from '../../../../Kudos-Board-Backend/node_modules/@prisma/client'
import { useEffect, useState } from "react"
import BoardElement from "../elements/BoardElement";
import CreateNewBoardDialog from "../forms/CreateNewBoardModal";
import { Button, SimpleGrid } from "@mantine/core";
import { useBooleanState, useGetJsonArrayData } from "../../hooks";

const Boards = () => {
    const [boards, setBoards] = useGetJsonArrayData<Board[]>(import.meta.env.VITE_RESTFUL_URL + "/boards");

    const [isNewBoardOpen, handleCloseNewBoardModal, handleOpenNewBoardModal] = useBooleanState(false);

    /**
     * Passed to the CreateNewBoardModal component to update the boards state when a new board is created
     * @param newBoards the fresh boards array to set in the boards state
     */
    const handleBoardsUpdate = (newBoards: Board[]) => {
        setBoards(newBoards);
    }


    return (
        <main>
            <Button onClick={() => handleOpenNewBoardModal()}>Create New Board</Button>
            <CreateNewBoardDialog isOpen={isNewBoardOpen} closeModal={() => handleCloseNewBoardModal()} updateBoards={handleBoardsUpdate} />
            <SimpleGrid
                cols={{ base: 1, sm: 2, lg: 5 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
                {boards.map((board, i) => {
                    return (
                        <BoardElement key={i} board={board} />
                    )
                })}
            </SimpleGrid>

        </main>
    )
}

export default Boards;
