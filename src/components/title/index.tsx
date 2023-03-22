import { useRouterContext } from "@pankod/refine-core";
import { Box } from "@pankod/refine-mui";
import React from "react";

type TitleProps = {
    collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    const { Link } = useRouterContext();

    return (
        <Link to="/">
            <Box
                sx={{
                    height: "72px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {collapsed ? (
                    <img width="64px" height="64px" src="/assets/images/lamb1.svg" alt="tactic" />
                ) : (
                        <img src="/assets/images/logo1.svg" alt="tactic" />
                )}
            </Box>
        </Link>
    );
};