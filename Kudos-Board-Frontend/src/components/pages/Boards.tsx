import "./Boards.css"
// TODO: find a better way to get dynamic types from the back end to the front end
import type { Board } from '../../../../Kudos-Board-Backend/node_modules/@prisma/client'
import BoardElement from "../elements/BoardElement";
import CreateNewBoardModal from "../forms/CreateNewBoardModal";
import { Button, SimpleGrid } from "@mantine/core";
import { useBooleanState, useGetJsonArrayData } from "../../hooks";
import BoardFilters from "../selectors/BoardFilters";
import { useEffect, useState } from "react";
import Sort from "../selectors/Sort";

const Boards = () => {
    const [boards, setBoards, setNewBoardsUrl] = useGetJsonArrayData<Board[]>(import.meta.env.VITE_RESTFUL_URL + "/boards");

    const [isNewBoardOpen, handleCloseNewBoardModal, handleOpenNewBoardModal] = useBooleanState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [sortValue, setSortValue] = useState<string>('Newest');


    /**
     * Passed to the CreateNewBoardModal component to update the boards state when a new board is created
     * @param newBoards the fresh boards array to set in the boards state
     */
    const handleBoardsUpdate = (newBoards: Board[]) => {
        setBoards(newBoards);
    }

    /**
     * updates the state of the category filter, passed to the BoardFilters
     * @param category the category to filter by
     */
    const handleSetCategoryFilter = (category: string) => {
        setCategoryFilter(category);
    }

    /**
     * updates the state of the sort value, passed to the Sort component
     * @param sortValue the new sort value
     */
    const handleSetSortValue = (sortValue: string) => {
        setSortValue(sortValue);
    }

    useEffect(() => {
        setNewBoardsUrl(import.meta.env.VITE_RESTFUL_URL + `/boards?category=${categoryFilter}`);
    }, [categoryFilter, sortValue]);

    return (
        <main>
            <Button onClick={() => handleOpenNewBoardModal()}>Create New Board</Button>
            <BoardFilters categoryFilter={categoryFilter} setCategoryFilter={handleSetCategoryFilter} />
            <Sort sortValue={sortValue} setSortValue={handleSetSortValue} />
            <CreateNewBoardModal isOpen={isNewBoardOpen} closeModal={() => handleCloseNewBoardModal()} updateBoards={handleBoardsUpdate} />
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
