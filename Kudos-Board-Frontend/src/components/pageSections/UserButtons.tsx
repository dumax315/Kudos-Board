import { Button, Group } from "@mantine/core";
import { User } from "../../types";
import { useEffect } from "react";

interface Props {
    user: User;
    logout: () => void;
}

const UserButtons = ({ user, logout }: Props) => {
    useEffect(() => {
        console.log(user)
    }, [user])
    return (
        <Group>
            {/*  */}
            <p>Hello {user.name}</p>
            <Button onClick={() => {logout()}} variant="default">Log Out</Button>

        </Group>

    )
}

export default UserButtons;
