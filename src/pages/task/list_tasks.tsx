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
    // Link,
    // Stack,
    // Divider,
    // Breadcrumb,
    // Typography,
} from "@pankod/refine-mui";
// import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { 
    // SaveTaskForScene, 
    // SaveLoginInGroup, 
    // SaveLoginGroup, 
    SaveUsersInLS, 
    // SavePipeProcess, 
    HeaderLinks 
} from "../../conf";

import {
    ITask,
    HttpError,
} from "../../interfaces";

export const TasksList: React.FC<IResourceComponentsProps> = () => {

    const { show } = useNavigation(); //, edit

    const t = useTranslate();

    // const { autocompleteProps } = useAutocomplete<ILoginGroup, HttpError>({
    //     resource: "login_group",
    // });

    const {
        dataGridProps,
        // search,
        // filters,
        // setFilters
    } = useDataGrid<ITask, HttpError, ITask>(
        {
            initialPageSize: 15,
            initialSorter: [
                {
                    field: "id",
                    order: "asc",
                },
            ],
            //         onSearch: async (params) => {
            //             const filters: CrudFilters = [];
            //             const {
            //                 code,
            //                 login_group
            //             } = params;

            //             filters.push({
            //                 field: "code|display_name|login",
            //                 operator: "contains",
            //                 value: code !== "" ? code : undefined,
            //             });

            //             if (login_group !== '') {
            //                 const dp = TacticDataProvider();
            //                 const flt: CrudFilters = [{
            //                     field: 'name',
            //                     operator: "eq",
            //                     value: login_group,
            //                 }];

            //                 const param2 = {
            //                     resource: "sthpw/login_group",
            //                     filters: flt,
            //                 };
            //                 var data = await dp.getList(param2).then((resolve) => { return resolve.data[0] });
            //                 flt.pop();
            //                 flt[0] = {
            //                     field: 'login_group',
            //                     operator: "eq",
            //                     value: data.code,
            //                 };

            //                 param2.resource = 'sthpw/login_in_group';
            //                 param2.filters = flt;
            //                 data = await dp.getList(param2).then((resolve) => { return resolve.data });
            //                 var values = [];

            //                 for (var x in data) {
            //                     values.push(data[x].login);
            //                 };
            //             };

            //             var fld = '';
            //             if (code !== '') {
            //                 fld = 'login|AND'
            //             }
            //             else {
            //                 fld = 'login';
            //             }

            //             filters.push({
            //                 field: fld,
            //                 operator: "in",
            //                 value: values,
            //             });

            //             return filters;
            //         },
        }
    );

    // const handleFilter = (
    //     e: React.ChangeEvent<HTMLInputElement>,
    // ) => {
    //     return setFilters([
    //         {
    //             field: "name|keywords|description",
    //             operator: "contains",
    //             value:
    //                 e.target.value !== ""
    //                     ? e.target.value
    //                     : undefined,
    //         }
    //     ])
    // };

    const columns = React.useMemo<GridColumns<ITask>>(
        () => [
            // {
            //     field: "image",
            //     renderHeader: function render() {
            //         return <></>;
            //     },
            //     filterable: false,
            //     filterOperators: undefined,
            //     disableColumnMenu: true,
            //     hideSortIcons: true,
            //     renderCell: function render({ row }) {
            //         return (
            //             <Stack alignItems="center" direction="row" spacing={2}>
            //                 <Avatar
            //                     alt={row.name}
            //                     src={row.image?.url}
            //                 />
            //                 <Typography variant="body2">
            //                     {row.name}
            //                 </Typography>
            //             </Stack>
            //         );
            //     },
            //     flex: 1,
            //     minWidth: 50,
            //     maxWidth: 150,
            // },
            {
                field: "id",
                headerName: "ID",
                // type: "number",
                width: 90,
                // hide: true,
            },
            {
                field: "priority",
                headerName: t("task.fields.priority"),
                // width: 100,
                maxWidth: 100,
                flex: 1,
                // hide: true,
            },
            {
                field: "description",
                headerName: t("task.fields.description"),
                // width: 200,
                // maxWidth: 200,
                flex: 0.5,
            },
            {
                field: "status",
                headerName: t("task.fields.status"),
                // width: 150,
                // maxWidth: 150,
                flex: 0.5,
            },
            {
                field: "discussion",
                headerName: t("task.fields.discussion"),
                // minWidth: 100,
                // maxWidth: 200,
                flex: 0.5
            },
            {
                field: "assigned",
                align: "center",
                headerName: t("task.fields.assigned"),
                // width: 150,
                // maxWidth: 150,
                flex: 0.5,
            },
        ],
        [t]
    );

    // const { tableQueryResult, pageCount, setCurrent, filters, setFilters } =
    //     useTable<IScenes>({
    //         resource: "scenes",
    //     });

    // const scenes: IScenes[] = tableQueryResult.data?.data || [];

    // const {
    // register,
    // handleSubmit,
    // control
    // } = useForm<
    // IScenes,
    // HttpError,
    // IUserFilterVariables
    // >({
    // defaultValues: {
    //     code: getDefaultFilter("code|display_name|login", filters, "contains"),
    //     login_group: getDefaultFilter("login_group", filters, "eq"),
    // },
    // });


    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={12}>
                {/* <Stack
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    padding={1}
                    direction="row"
                    gap={2}
                >
                    <Typography variant="h5">
                        {t("scenes.scenes")}
                    </Typography>
                    <Paper
                        component="text"
                        sx={{
                            // display: "flex",
                            alignItems: "center",
                            width: 400,
                        }}
                    > */}
                {/* <TextField
                            sx={{
                                ml: 0,
                                flex: 0,
                                // alignItems: "center",
                                width: 400,
                            }}
                            placeholder={t("scenes.scenesSearch")}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon />
                                    </InputAdornment>
                                ),
                            }}
                            value={getDefaultFilter(
                                "id",
                                filters,
                                "contains",
                            )}
                            onChange={(
                                e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                setFilters([
                                    {
                                        field: "name|keywords|description",
                                        operator: "contains",
                                        value:
                                            e.target.value !== ""
                                                ? e.target.value
                                                : undefined,
                                    },
                                ]);
                            }}
                        /> */}
                {/* </Paper>
                </Stack> */}
                <List
                    headerProps={{
                        sx: {
                            padding: "4px 16px 4px 16px",
                            border: "none",
                        },
                        avatar: <HeaderLinks showHome display="none" link="/tactic/refine_test/tasks" title={t("task.task")}/>
                        // avatar: <Link href="/tactic/refine_test" alignSelf="center" display="flex" alignContent="center"> <HomeOutlinedIcon color="action" /></Link>,
                        // action: <CreateButton sx={{ margin: '10px 5px 0px 0px' }} onClick={() => showCreateDrawer()} />,
                        // title: <Typography variant="h4" > {t("scenes.scenes")}</Typography>
                    }}
                >
                    {/* <TextField
                        sx={{
                            ml: 0,
                            flex: 0,
                            // alignItems: "center",
                            width: 400,
                        }}
                        placeholder={t("scenes.scenesSearch")}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
                        value={getDefaultFilter(
                            "id",
                            filters,
                            "contains",
                        )}
                        onChange={handleFilter}
                    /> */}
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
                            // console.log("🚀 ~ file: list_tasks.tsx:340 ~ row", row);
                            SaveUsersInLS();
                            show("tasks", row.id);
                        }}
                    />
                </List>
            </Grid>
            {/* <Grid item xs={12} lg={3}>
                <Stack padding="8px">
                    <Typography variant="subtitle1">
                        {t("assets.tagFilterDescription")}
                    </Typography>
                    <CategoryFilter
                        setFilters={setFilters}
                        filters={filters}
                    />
                </Stack>
            </Grid> */}
        </Grid>
    );
};

// type HeaderLinksProps = {
//     showHome?: boolean,
//     display?: "flex" | "none",
//     link?: string | '',
//     title?: string,
//     separator?: string,
// }

// const HeaderLinks: React.FC<HeaderLinksProps> = (props: HeaderLinksProps) => {

//     return <Stack direction="row">
//         <Link id='home-link' href="/tactic/refine_test" alignSelf="center" display={ props.showHome ? 'flex' : 'none' } alignContent="center"> <HomeOutlinedIcon color="action" /></Link>
//         <Typography display={props.display} >{props.separator ?? '/'}</Typography>
//         <Link id='second-link' href={props.link} alignSelf="center" display={props.display} alignContent="center"><Typography color="theme.palette.action">{props.title}</Typography></Link>
//     </Stack>
// }