import { PropsWithChildren } from "react";
import "./Header.css"

type Props = {

}

const Header = ({ children }: PropsWithChildren<Props>) => {
    return (
        <header>
            <h1>
                Kudos Board
            </h1>
            {children}
        </header>
    )
}

export default Header;
