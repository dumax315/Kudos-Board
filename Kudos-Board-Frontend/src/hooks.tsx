import { useEffect, useState } from "react";
import type { User } from "./types"

/**
 * A wrapper for useState<boolean>, commonly used to show modals and to removed the need for close modal handlers
 * @param initalValue the initial value of the boolean
 * @returns
 *           [booleanValue, setFalse, setTrue] where booleanValue is the current value of the boolean,
 *           setFalse is a function that sets the boolean to false
 *           and setTrue is a function that sets the boolean to true
 *           Both of these are not states so they can be passed down as props to child components
 */
export const useBooleanState = (initalValue: boolean) => {
    const [booleanValue, setBooleanValue] = useState<boolean>(initalValue);

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
    const [isLoading, setIsLoading] = useState(false);
    let url = startingUrl;
    const loadData = async () => {
        setIsLoading(true);
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
            }
        };
        const response = await fetch(url, options);
        setIsLoading(false);
        const data = await response.json();
        setJsonData(data);
    }

    const setData = (data: T) => {
        setJsonData(data);
    }

    const loadNewUrl = (newUrl: string) => {
        if(newUrl !== ""){
            url = newUrl;
        }
        loadData();
    }

    useEffect(() => {
        if(startingUrl !== "") {
            loadData();
        }
    }, [])

    return [jsonData, setData, loadNewUrl, isLoading] as const;
}

/**
 * Checks the local storage for a token and sets the user state to the user data if the token is valid
 * Also provides a fuction to set a new token after a new user is created or logged in
 * @returns [user, setToken, logout] where user is the current user,
    * setToken is a function that sets the current user and
    * logout is a function that logs the user out
 */
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
        const data = await response.json();
        if (!response.ok) {
            console.log("Error fetching user data");
            console.log(data);
            return null
        }
        return data;
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
