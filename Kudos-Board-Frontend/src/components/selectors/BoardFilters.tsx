import "./BoardFilters.css"
import { useState } from 'react';
import { Group, Radio } from '@mantine/core';

interface Props {
    categoryFilter: string,
    setCategoryFilter: (value: string) => void,
}

const BoardFilters = ({categoryFilter, setCategoryFilter}: Props) => {

    return (
        <Radio.Group
            value={categoryFilter}
            onChange={setCategoryFilter}
            name="categoryFilter"
            className='categoryFilter'
        >
            <Group mt="xs">
                <Radio value="" label="All" />
                <Radio value="Celebration" label="Celebration" />
                <Radio value="Thank You" label="Thank You" />
                <Radio value="Inspiration" label="Inspiration" />
            </Group>
        </Radio.Group>
    );
}

export default BoardFilters;
