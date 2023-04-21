import { useRouterContext, useList } from "@pankod/refine-core";
import { Box } from "@pankod/refine-mui";
import React from "react";
import { Link, Typography } from '@mui/material';

type TitleProps = {
    collapsed: boolean;
};

const FullLogo: React.FC = () => {
    const { data: projectData } = useList({
        resource: 'sthpw/project',
        config: {
            filters: [{
                field: 'code',
                operator: 'eq',
                value: 'dolly3d'
            }]
        }
    });
    const project = projectData?.data ? projectData?.data[0] : {};
    console.log(projectData?.data);
    return (
        <Box display="flex" flexDirection='row' alignItems='center' justifyContent='center' >
            <Box display="flex" alignItems='center' marginRight='5px'><img src={project?.image?.url} alt={project?.title} width='64px' height='64px' /></Box>
            <Box display="flex" alignItems='center'><Typography >{project?.title}</Typography></Box>
        </Box>
    )
}
export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    // const { Link } = useRouterContext();
    const { data: projectData } = useList({
        resource: 'sthpw/project',
        config: {
            filters: [{
                field: 'code',
                operator: 'eq',
                value: 'dolly3d'
            }]
        }
    });
    const project = projectData?.data ? projectData?.data[0] : {};

    return (
        <Link href="http://tactic2/tactic/refine_test" color='text.primary' underline="none">
            <Box
                sx={{
                    height: "72px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {collapsed ? (
                    <img width="64px" height="64px" src={project?.image?.url} alt={project?.title} />
                ) : (
                    <Box display="flex" flexDirection='row' alignItems='center' justifyContent='center' >
                        <Box display="flex" alignItems='center' marginRight='5px'><img src={project?.image?.url} alt={project?.title} width='64px' height='64px' /></Box>
                        <Box display="flex" alignItems='center'><Typography >{project?.title}</Typography></Box>
                    </Box>
                )}
            </Box>
        </Link>
    );
};