import React from "react";
import {
    useTranslate,
    IResourceComponentsProps,
    useNavigation,
} from "@pankod/refine-core";

import {
    DataGrid,
    Grid,
    GridColumns,
    useDataGrid,
    List,
    Stack,
    CardHeader,
    Card,
    CardContent,
    // Divider,
    // Breadcrumb,
    Typography,
} from "@pankod/refine-mui";
import { 
    SaveUsersInLS, 
    HeaderLinks,
    SaveLoginInGroup,
    SaveLoginGroup,
} from "../../conf";

import {
    ITask,
    HttpError,
} from "../../interfaces";
import { TasksFilter } from '../../components';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
export const TasksList: React.FC<IResourceComponentsProps> = () => {

    const { show } = useNavigation();

    const t = useTranslate();

    const {
        dataGridProps,
        // search,
        filters,
        setFilters
    } = useDataGrid<ITask, HttpError, ITask>(
        {
            initialPageSize: 15,
            initialSorter: [
                {
                    field: "id",
                    order: "asc",
                },
            ],
        }
    );

    const columns = React.useMemo<GridColumns<ITask>>(
        () => [
            {
                field: "id",
                headerName: "ID",
                width: 90,
            },
            {
                field: "priority",
                headerName: t("task.fields.priority"),
                maxWidth: 100,
                flex: 1,
            },
            {
                field: "description",
                headerName: t("task.fields.description"),
                flex: 0.5,
            },
            {
                field: "status",
                headerName: t("task.fields.status"),
                flex: 0.5,
            },
            {
                field: "discussion",
                headerName: t("task.fields.discussion"),
                flex: 0.5
            },
            {
                field: "assigned",
                align: "center",
                headerName: t("task.fields.assigned"),
                flex: 0.5,
            },
        ],
        [t]
    );

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={3}>
                <Card sx={{ paddingX: { xs: 3, md: 0 } }}>
                    <CardContent >
                        <Stack padding="8px">
                            <TasksFilter
                                setFilters={setFilters}
                                filters={filters}
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} lg={9}>
                <List
                    headerProps={{
                        sx: {
                            padding: "4px 16px 4px 16px",
                            border: "none",
                        },
                        avatar: <InventoryOutlinedIcon />,
                        // action: <CreateButton sx={{ margin: '10px 5px 0px 0px' }} onClick={() => showCreateDrawer()} />,
                        title: <Typography variant="h6" > {t("task.task")}</Typography>
                        // avatar: <HeaderLinks showHome display="none" link="/tactic/refine_test/tasks" title={t("task.task")}/>
                    }}
                >
                    <DataGrid
                        {...dataGridProps}
                        columns={columns}
                        headerHeight={40}
                        sx={{
                            ".MuiDataGrid-cell:hover": {
                                cursor: "pointer",
                            },
                            ".MuiDataGrid-columnHeaders": {
                                borderBottomColor: "#212121",
                                backgroundColor: "#212121",
                            },
                            ".MuiDataGrid-cell": {
                                borderBottomColor: "#212121",
                            },
                            ".MuiDataGrid": {
                                borderBottomColor: "#212121",
                            },
                            ".MuiDataGrid-footerContainer": {
                                borderTopColor: "#212121",
                            },
                            border: "none",
                        }}
                        filterModel={undefined}
                        autoHeight
                        rowHeight={30}
                        rowsPerPageOptions={[10, 15, 25, 50, 100]}
                        density="comfortable"
                        onRowClick={(row) => {
                            SaveUsersInLS();
                            SaveLoginInGroup();
                            SaveLoginGroup();
                            show("tasks", row.id);
                        }}
                    />
                </List>
            </Grid>
        </Grid>
    );
};
