import { useEffect, useState } from "react";

export const useBooleanState = (initalValue: boolean) => {
    const [booleanValue, setBooleanValue] = useState(initalValue);

    const setFalse = () => {
        setBooleanValue(false);
    }

    const setTrue = () => {
        setBooleanValue(true);
    }

    return [booleanValue, setFalse, setTrue] as const;
}

/**
 * Loads a json array from a url and returns it as a state variable.
 * @param url the url to fetch the data array from
 * @returns [jsonData, setData] where jsonData is the data array and setData is a function that sets the data array (for cases where the data has updated)
 */
export const useGetJsonArrayData = <T extends Object[]>(url: string) => {
    // as unknown allows the assertion to as T becuase [] could be a never[] which is not a T[] but unknown can be anything
    // TODO: invistage a better way to create an empty array of type T maybe using an Array constructor
    const [jsonData, setJsonData] = useState<T>([] as unknown as T);
    const loadData = async () => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        };
        const response = await fetch(url, options);
        const data = await response.json();

        setJsonData(data);
    }
    const setData = (data: T) => {
        setJsonData(data);
    }
    useEffect(() => {
        loadData();
    }, [])
    return [jsonData, setData] as const;;
}
