import { Button, Group } from "@mantine/core";
import { User } from "../../types";

interface Props {
    user: User;
    logout: () => void;
}

const UserButtons = ({ user, logout }: Props) => {
    return (
        <Group className="userButtons">
            {/*  */}
            <p>Hello {user.name}</p>
            <Button onClick={() => {logout()}} variant="default">Log Out</Button>

        </Group>

    )
}

export default UserButtons;
