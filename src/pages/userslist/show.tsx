import React from "react";
import {
    HttpError,
    IResourceComponentsProps,
    useNavigation,
    useShow,
    useTranslate,
    useList,
} from "@pankod/refine-core";
import {
    Avatar,
    IconButton,
    DataGrid,
    Grid,
    GridColumns,
    List,
    Paper,
    Stack,
    Typography,
    useDataGrid,
    Button,
    Tooltip,
    // TextField,
} from "@pankod/refine-mui";
import {
    LocalPhoneOutlined,
    EmailOutlined,
    SupervisedUserCircleRounded,
} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ILogindata, ITask, IScenes } from "../../interfaces"; // IReview

type LoginInfoTextProps = {
    icon: React.ReactNode;
    text?: string;
};
const LoginInfoText: React.FC<LoginInfoTextProps> = ({ icon, text }) => (
    <Stack
        direction="row"
        alignItems="center"
        justifyContent={{
            sm: "center",
            lg: "flex-start",
        }}
        gap={1}
    >
        {icon}
        <Typography variant="body1">{text}</Typography>
    </Stack>
);

const TaskShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { show } = useNavigation();
    const { goBack } = useNavigation();
    const {
        queryResult: { data },
    } = useShow<ILogindata>();
    const login = data?.data;
    const { dataGridProps } = useDataGrid<ITask, HttpError>({
        resource: "tasks",
        initialSorter: [
            {
                field: "id",
                order: "asc",
            },
        ],
        permanentFilter: [
            {
                field: "assigned",
                operator: "eq",
                value: login?.login,
            },
        ],
        initialPageSize: 5,
        queryOptions: {
            enabled: login !== undefined,
        },
        syncWithLocation: false,
    });
    const columns = React.useMemo<GridColumns<ITask>>(
        () => [{
            field: "id",
            headerName: t("task.fields.id"),
            renderCell: function render({ row }) {
                return (
                    <Button onClick={() => { show("tasks", row.id) }} >
                        {row.id}
                    </Button>
                );
            },
            width: 100,
            },
            {
                field: "status",
                headerName: t("task.fields.status"),
                renderCell: function render({ row }) {
                    return (
                        <Tooltip title={row.status}>
                            <Typography
                                sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                }}
                            >
                                {row.status}
                            </Typography>
                        </Tooltip>
                    );
                },
                flex: 1,
            },
            {
                field: "process",
                headerName: t("task.fields.process"),
                renderCell: function render({ row }) {
                    return (
                        <Tooltip title={row.process}>
                            <Typography
                                sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                }}
                            >
                                {row.process}
                            </Typography>
                        </Tooltip>
                    );
                },
                flex: 1,
            },
            {
                field: "priority",
                headerName: t("task.fields.priority"),
                renderCell: function render({ row }) {
                    return (
                        <Tooltip title={row.priority}>
                            <Typography
                                sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                }}
                            >
                                {row.priority}
                            </Typography>
                        </Tooltip>
                    );
                },
                flex: 1,
            },
            {
                field: "description",
                headerName: t("task.fields.description"),
                flex: 1,
                renderCell: function render({ row }) {
                    return (
                        <Stack alignItems="center">
                            <Typography >
                                {row.description}
                            </Typography>
                        </Stack>
                    );
                },
            },
        ],
        [show, t],
    );
    return (
        <Grid container >
            <Grid
                item 
                xs={12} lg={12}
            >
                <Stack direction="column" spacing={2}
                    // spacing={2}
                    // justifyContent="flex-start"
                    // alignItems="left"
                    // flexWrap="wrap"
                    // padding={1}
                    // direction="row"
                    // gap={2}
                >
                <List
                    headerProps={{ title: t("task.task") }}
                    canCreate={false}
                >
                    <IconButton 
                        onClick={goBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    {/* <Typography
                        variant="h5"
                        align="left"
                    >
                        {t("task.task")}
                    </Typography>
                    <TextField
                        sx={{
                            ml: 0,
                            width: 200,
                            alignItems: "right",
                            align: "right"
                        }}
                        size="small"
                        placeholder={t("task.filters.status")}
                    /> */}
                    <DataGrid
                        {...dataGridProps}
                        headerHeight={40}
                        columns={columns}
                        autoHeight
                        rowsPerPageOptions={[5, 10, 20, 100]}
                    />
                </List>
                </Stack>
            </Grid>
        </Grid>
    );
};

const EpisodesShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { show } = useNavigation();
    var { queryResult } = useShow<ILogindata>();
    const login = queryResult.data?.data;
    var {data: task } = useList<ITask>({
        resource:"tasks",
        config:{ 
            hasPagination: false,
            filters:[{ 
                field: "assigned",
                operator: "eq",
                value: login?.login,
            }],
        },
        queryOptions: { enabled: login?.login !== undefined, },
    });
    var search_id: String[] = [];
    const s_data = task?.data
    for (let i in s_data){
        search_id.push(String(s_data[Number(i)]?.search_id))
    };
    const { dataGridProps } = useDataGrid<IScenes, HttpError>({
        resource: "scenes",
        initialSorter: [{
            field: "code",
            order: "asc",
        }],
        permanentFilter: [{
            field: "id",
            operator: "in",
            value: search_id,
        }],
        initialPageSize: 5,
        queryOptions: { enabled: search_id !== undefined },
    });

    const columns = React.useMemo<GridColumns<IScenes>>(
        () => [{
            field: "id",
            headerName: t("scenes.fields.id"),
            renderCell: function render({ row }) {
                return (
                    <Button onClick={() => { show("scenes", row.id) }} >
                        {row.id}
                    </Button>
                )},
            width: 100,
            },
            {
                field: "name",
                headerName: t("scenes.fields.name"),
                renderCell: function render({ row }) {
                    return (
                        <Tooltip title={row.name}>
                            <Typography
                                sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                }}
                            >
                                {row.name}
                            </Typography>
                        </Tooltip>
                    );
                },
                flex: 1,
            },
            {
                field: "description",
                headerName: t("scenes.fields.description"),
                renderCell: function render({ row }) {
                    return (
                        <Tooltip title={row.description}>
                            <Typography
                                sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                }}
                            >
                                {row.description}
                            </Typography>
                        </Tooltip>
                    );
                },
                flex: 1,
            },
            {
                field: "keywords",
                headerName: t("scenes.fields.keywords"),
                renderCell: function render({ row }) {
                    return (
                        <Tooltip title={row.keywords}>
                            <Typography
                                sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                }}
                            >
                                {row.keywords}
                            </Typography>
                        </Tooltip>
                    );
                },
                flex: 1,
            },
        ],
        [show, t],
    );
    return (
        <Grid container>
            <Grid item xs={12} lg={12}>
                <Stack direction="column" spacing={2}>
                    <List
                        headerProps={{ title: t("scenes.scenes") }}
                        canCreate={false}
                    >
                        <DataGrid
                            {...dataGridProps}
                            headerHeight={40}
                            columns={columns}
                            autoHeight
                            rowsPerPageOptions={[5, 10, 20, 100]}
                        />
                    </List>
                </Stack>
            </Grid>
        </Grid>
    );
};

export const LoginShow: React.FC<IResourceComponentsProps> = () => {
    // const { show } = useNavigation();
    const {
        queryResult: { data },
    } = useShow<ILogindata>();
    const login = data?.data;
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={3}>
                <Paper sx={{ p: 2 }}>
                    <Stack alignItems="center" spacing={1}>
                        <Avatar
                            src={login?.image.url}
                            sx={{ width: 120, height: 120 }}
                        />
                        <Typography variant="h6">
                            {login?.display_name}
                        </Typography>
                    </Stack>
                    <br />
                    <Stack spacing={1}>
                        <LoginInfoText
                            icon={<SupervisedUserCircleRounded />}
                            text={login?.login}
                        />
                        <LoginInfoText
                            icon={<LocalPhoneOutlined />}
                            text={login?.phone_number}
                        />
                        <LoginInfoText
                            icon={<EmailOutlined />}
                            text={login?.email}
                        />
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12} lg={9}>
                <Stack direction="column" spacing={2}>
                    <TaskShow />
                    <EpisodesShow />
                </Stack>
            </Grid>
        </Grid>
    );
};





