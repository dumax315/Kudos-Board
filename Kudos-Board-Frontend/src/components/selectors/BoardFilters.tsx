import { useContext } from "react";
import "./BoardFilters.css"
import { Group, Radio } from '@mantine/core';
import { UserContext } from "../../App";

interface Props {
    categoryFilter: string,
    setCategoryFilter: (value: string) => void,
}

const BoardFilters = ({categoryFilter, setCategoryFilter}: Props) => {
    const user = useContext(UserContext);

    return (
        <Radio.Group
            value={categoryFilter}
            onChange={setCategoryFilter}
            name="categoryFilter"
            className='categoryFilter'
        >
            <Group mt="xs">
                <Radio value="" label="All" />
                {user ? <Radio value={"User" + user.id} label="My Boards" />:null}
                <Radio value="Celebration" label="Celebration" />
                <Radio value="Thank You" label="Thank You" />
                <Radio value="Inspiration" label="Inspiration" />
            </Group>
        </Radio.Group>
    );
}

export default BoardFilters;
