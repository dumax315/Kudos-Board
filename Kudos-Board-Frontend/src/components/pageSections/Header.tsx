import { PropsWithChildren } from "react";
import "./Header.css"
import { Link } from "react-router-dom";

type Props = {

}

const Header = ({ children }: PropsWithChildren<Props>) => {
    return (
        <header>
            <Link to={"/"}>
                <h1 className="pageHeaderText">
                    Kudos Board
                </h1>
            </Link>
            {children}
        </header>
    )
}

export default Header;
