import { NativeSelect } from '@mantine/core';

interface Props {
    sortValue: string,
    setSortValue: (value: string) => void,
}

const Sort = ({sortValue, setSortValue}: Props) => {

  return (
    <NativeSelect
      value={sortValue}
      onChange={(event) => setSortValue(event.currentTarget.value)}
      data={['Newest', 'Oldest', 'A-Z', 'Z-A']}
    />
  );
}

export default Sort;
