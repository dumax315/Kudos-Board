import { useState } from "react";

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
