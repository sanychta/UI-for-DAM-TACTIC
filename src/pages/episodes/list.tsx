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
    Avatar,
    useDataGrid,
    List,
    CardHeader,
    Card,
    CardContent,
    Stack,
    Typography,
    CreateButton,
    // Breadcrumb,
    Link,
} from "@pankod/refine-mui";
import { IScenes, HttpError, } from "../../interfaces";
import { CategoryFilter } from "../../components/scenes";
import { SaveTaskForScene, SaveLoginInGroup, SaveLoginGroup, SaveUsersInLS, SavePipeProcess, } from "../../conf";
import { useModalForm } from "@pankod/refine-react-hook-form";
import { CreateScene } from "../../components/scenes";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MovieFilterTwoToneIcon from '@mui/icons-material/MovieFilterTwoTone';
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export const ScenesList: React.FC<IResourceComponentsProps> = () => {
    const { show } = useNavigation();
    const t = useTranslate();
    const {
        dataGridProps,
        filters,
        setFilters
    } = useDataGrid<IScenes, HttpError, IScenes>(
        {
            initialPageSize: 10,
            initialSorter: [
                {
                    field: "id",
                    order: "asc",
                },
            ],
        }
    );

    const createDrawerFormProps = useModalForm<IScenes, HttpError, IScenes>({
        refineCoreProps: {
            redirect: false,
            action: "create"
        },
    });

    const {
        modal: { show: showCreateDrawer, },
    } = createDrawerFormProps;

    const columns = React.useMemo<GridColumns<IScenes>>(
        () => [
            {
                field: "image",
                headerName: "Preview",
                filterOperators: undefined,
                disableColumnMenu: true,
                filterable: false,
                hideSortIcons: true,
                renderCell: function render({ row }) {
                    return (
                        <Stack alignItems="center" direction="row" spacing={2}>
                            <Avatar
                                alt={row.name}
                                src={row.image?.url}
                            />
                        </Stack>
                    );
                },
                flex: 1,
                minWidth: 80,
                maxWidth: 80,
            },
            {
                field: "id",
                headerName: "ID",
                type: "number",
                hide: true,
            },
            {
                field: "name",
                headerName: t("scenes.fields.name"),
                flex: 1,
            },
            {
                field: "description",
                headerName: t("scenes.fields.description"),
                flex: 0.5,
            },
            {
                field: "duration",
                headerName: t("scenes.fields.duration"),
                flex: 0.5,
            },
            {
                field: "keywords",
                headerName: t("scenes.fields.keywords"),
                flex: 0.5
            },
            {
                field: "assets",
                align: "center",
                headerName: t("scenes.fields.assets"),
                flex: 0.5,
            },
        ],
        [t]
    );

    return (
        <>
            <CreateScene {...createDrawerFormProps} />
            <Grid container spacing={2} >
                <Grid item xs={12} lg={2.5} > 
                    <Card sx={{ paddingX: { xs: 3, md: 0 } }}>
                        <CardContent >
                            <Stack padding="5px">
                                <CategoryFilter
                                    setFilters={setFilters}
                                    filters={filters}
                                />
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={9.5} >
                    <Stack>
                        <List
                            // breadcrumb={<Breadcrumb breadcrumbProps={{ sx: { padding: "5px" } }} />}
                            headerProps={{ 
                                sx: { 
                                    padding: "4px 16px 4px 16px",
                                    border: "none",
                                 },
                                avatar: <MovieFilterTwoToneIcon />,
                                action: <CreateButton sx={{ margin: '10px 5px 0px 0px'}} onClick={() => showCreateDrawer()} />,
                                title: <Typography variant="h6" > { t("scenes.scenes") }</Typography>
                            }}
                        >
                            <DataGrid
                                {...dataGridProps}
                                headerHeight={40}
                                columns={columns}
                                autoHeight
                                rowsPerPageOptions={[10, 20, 50, 100]}
                                density="comfortable"
                                sx={{
                                    ".MuiDataGrid-cell:hover": {
                                        cursor: "pointer",
                                    },
                                    ".MuiDataGrid-columnHeaders":{
                                        borderBottomColor: "#212121",
                                        backgroundColor: "#212121",
                                    },
                                    ".MuiDataGrid-cell": {
                                        borderBottomColor: "#212121",
                                    },
                                    ".MuiDataGrid": {
                                        borderBottomColor: "#212121",
                                    },
                                    ".MuiDataGrid-footerContainer":{
                                        borderTopColor: "#212121",
                                    },
                                    border: "none",
                                }}
                                onRowClick={(row) => {
                                    localStorage.setItem('reloaded', 'false');
                                    SaveUsersInLS();
                                    SaveLoginGroup();
                                    SaveLoginInGroup();
                                    SavePipeProcess(String(row.row?.pipeline_code));
                                    SaveTaskForScene(row.row?.code);
                                    show("scenes", row.id);
                                }}
                            />
                        </List>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};
