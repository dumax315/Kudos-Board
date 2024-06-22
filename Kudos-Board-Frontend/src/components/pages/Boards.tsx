import "./Boards.css"
import BoardElement from "../elements/BoardElement";
import CreateNewBoardModal from "../forms/CreateNewBoardModal";
import { Button, Group, SimpleGrid } from "@mantine/core";
import { useBooleanState, useGetJsonArrayData } from "../../hooks";
import BoardFilters from "../selectors/BoardFilters";
import { useContext, useEffect, useState } from "react";
import Sort from "../selectors/Sort";
import SearchBar from "../selectors/SearchBar";
import { BoardWithAuthor } from "../../types";
import { UserContext } from "../../App";

const Boards = () => {
    const user = useContext(UserContext);
    const [boards, , setNewBoardsUrl] = useGetJsonArrayData<BoardWithAuthor[]>("");

    const [isNewBoardOpen, handleCloseNewBoardModal, handleOpenNewBoardModal] = useBooleanState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [sortValue, setSortValue] = useState<string>('Newest');
    const [searchValue, setSearchValue] = useState<string>('');


    /**
     * Passed to the CreateNewBoardModal component to update the boards state when a new board is created
     * @param newBoards the fresh boards array to set in the boards state
     */
    const handleBoardsUpdate = () => {
        setNewBoardsUrl(import.meta.env.VITE_RESTFUL_URL + `/boards?category=${categoryFilter}&sort=${sortValue}&search=${searchValue}`);
    }

    /**
     * updates the state of the category filter, passed to the BoardFilters
     * @param category the category to filter by
     */
    const handleSetCategoryFilter = (category: string) => {
        if(category.startsWith("User")) {
            if(user){
                setCategoryFilter(category);
            }
        }else{
            setCategoryFilter(category);
        }
    }

    /**
     * updates the state of the sort value, passed to the Sort component
     * @param sortValue the new sort value
     */
    const handleSetSortValue = (sortValue: string) => {
        setSortValue(sortValue);
    }

    /**
     * updates the state of the search value, passed to the SearchBar, used a query param in useGetJsonArrayData
     * @param searchValue the new search value
     */
    const handleSetSearchValue = (searchValue: string) => {
        setSearchValue(searchValue);
    }

    useEffect(() => {
        handleBoardsUpdate();
    }, [categoryFilter, sortValue, searchValue]);

    return (
        <main>
            <Group m={20} justify="center">
                <Button onClick={() => handleOpenNewBoardModal()}>Create New Board</Button>
                <SearchBar searchValue={searchValue} setSearchValue={handleSetSearchValue}/>
                <BoardFilters categoryFilter={categoryFilter} setCategoryFilter={handleSetCategoryFilter} />
                <Sort sortValue={sortValue} setSortValue={handleSetSortValue} />
            </Group>
            <CreateNewBoardModal isOpen={isNewBoardOpen} closeModal={() => handleCloseNewBoardModal()} updateBoards={handleBoardsUpdate} />
            <SimpleGrid
                cols={{ base: 1, xs: 2, md: 3 }}
                spacing={{ base: 10, sm: 'xl' }}
                verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
                {boards.map((board, i) => {
                    return (
                        <BoardElement key={i} board={board} reloadBoards={() => {handleBoardsUpdate()}} />
                    )
                })}
            </SimpleGrid>
        </main>
    )
}

export default Boards;
