import { TextInput } from '@mantine/core';

interface Props {
  searchValue: string,
  setSearchValue: (value: string) => void,
}

const SearchBar = ({ searchValue, setSearchValue }: Props) => {

  return (
    <TextInput
      value={searchValue}
      onChange={(event) => setSearchValue(event.currentTarget.value)}
      label="Search"
    />
  );
}

export default SearchBar;
