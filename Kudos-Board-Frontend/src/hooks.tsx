import { useEffect, useState } from "react";
import type { User } from "./types"

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
export const useGetJsonArrayData = <T extends Object[]>(startingUrl: string) => {
    // as unknown allows the assertion to as T becuase [] could be a never[] which is not a T[] but unknown can be anything
    // TODO: invistage a better way to create an empty array of type T maybe using an Array constructor
    const [jsonData, setJsonData] = useState<T>([] as unknown as T);
    const [url, setUrl] = useState<string>(startingUrl);
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

    const loadNewUrl = (newUrl: string) => {
        setUrl(newUrl);
    }

    useEffect(() => {
        loadData();
    }, [url])
    return [jsonData, setData, loadNewUrl] as const;;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);

    const getUserDetails = async (token: string): Promise<User | null> => {
        let url = import.meta.env.VITE_RESTFUL_URL + "/verifyAccessToken";
        const options = {
            method: 'get',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        };
        const response = await fetch(url, options);
        if (!response.ok) {

            return null
        }
        const data = await response.json();
        return data.payload;
    }

    const setToken = async (token: string) => {
        const userData = await getUserDetails(token);
        if (userData === null) {
            setUser(null);
            localStorage.removeItem("token");
            return;
        }
        userData.token = token;
        setUser(userData);
        localStorage.setItem("token", token);
    }

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        return;
    }

    useEffect(() => {
        const tokenFromStorage = localStorage.getItem("token");
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
        }
    }, [])

    return [user, setToken, logout] as const;
}
