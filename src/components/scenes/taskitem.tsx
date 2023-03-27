import {
    useList,
    useNavigation,
} from "@pankod/refine-core";
import {
    Card,
    Grid,
    Box,
    Stack,
    TextField,
    IconButton,
    CardContent,
    // Create,
    Typography,
} from "@pankod/refine-mui";
import Popper from '@mui/material/Popper';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatIcon from '@mui/icons-material/Chat';
import SaveIcon from '@mui/icons-material/Save';
import React from "react";
import {
    ILogindata,
    IPipeline,
} from "../../interfaces";
import { PieChart, Pie, Cell, } from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TacticDataProvider from '../../tactic/tacticdataprovider';
import { SaveTaskForScene, get_pipe_options, ColorLuminance } from '../../conf';
import CircularProgress from '@mui/material/CircularProgress';
const locales = ['en', 'ru'] as const;

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        fontSize: '0.7rem',
        '& ul': {
            padding: 0,
            margin: 0,
        },
        '& li': {
            bgcolor: '#345783'
        }
    },
});

const Update_save = (data: CaptionName) => {
    const task = JSON.parse(String(localStorage.getItem('TASKS_FOR_SCENE'))).filter((element: any) => element.process === data?.name);
    const elem = document.getElementById(String(data?.name));
    const found: boolean = task.length > 0 ? true : false;
    const textStatus = document.getElementById(String(data?.name +"-comboStatus-label"));
    const oldStatus = textStatus !== null ? textStatus.textContent : '';

    if (elem !== null) {
        const status_data = document.getElementById(data?.name + '-comboStatus');
        const newStatus = status_data !== null ? status_data.getAttribute('value') : '';

        const user_data = document.getElementById(data?.name + '-comboUser');
        const sel_user = user_data !== null ? user_data.getAttribute('value') : '';

        const user_assigned = JSON.parse(String(localStorage.getItem('USERS_LIST'))).filter((element: any) => element.display_name === sel_user)[0];

        const bid_start_date = document.getElementById(data?.name + '-bid_start');
        var start_date = bid_start_date !== null ? bid_start_date.getAttribute('value') : ''
        if (start_date !== null) { start_date = start_date?.replace(/[\u2066-\u2069]/gu, '')}

        const bid_end_date = document.getElementById(data?.name + '-bid_end');
        var end_date = bid_end_date !== null ? bid_end_date.getAttribute('value') : ''
        if (end_date !== null) { end_date = end_date?.replace(/[\u2066-\u2069]/gu, '') }

        if (found) {
            const update_data = {
            resource: 'tasks',
            id: task[0].id,
            variables: {
                status: newStatus !== '' ? newStatus : oldStatus,
                assigned: user_assigned !== undefined ? user_assigned.code : '',
                bid_start_date: start_date,
                bid_end_date: end_date,
                triggers: false,
                },
            };

            TacticDataProvider().update(update_data);
            if (textStatus!==null) {
                if (oldStatus==='Status' && newStatus!==''){
                    textStatus.textContent = newStatus
                } else if (oldStatus!=='' && newStatus!=='') {
                    textStatus.textContent = newStatus
                } else {
                    textStatus.textContent = oldStatus
                }
            }
        } else {
            const save_data = {
                resource: 'tasks',
                variables: {
                    status: status_data !== null ? status_data.getAttribute('value') : '',
                    process: data?.name,
                    pipeline_code: data.pipeline_code,
                    assigned: user_assigned!==undefined ? user_assigned.code : '',
                    bid_start_date: start_date,
                    bid_end_date: end_date,
                    add_data: {
                        project: 'dolly3d',
                        search_type: 'complex/scenes',
                        code: data?.scene_code,
                        triggers: false,
                    },
                },
            };

            if (textStatus !== null) { textStatus.textContent = newStatus !== '' && newStatus !== undefined ? newStatus : 'Status' };
            TacticDataProvider().create(save_data);
        };
    };
    const save_box = document.getElementById(data?.name + '-box');
    if (save_box !== null) { save_box.style.display = 'none' };
    SaveTaskForScene(data.scene_code);
};

type AssignedGroup = {
    group_name?: string | undefined;
    process?: string | undefined;
}

const UsersList: React.FC<AssignedGroup> = (data) => {
    if (data.process !== 'assets') {
        const task = JSON.parse(String(localStorage.getItem('TASKS_FOR_SCENE'))).filter((element: any) => element.process === data.process);
        const login_in_groups = JSON.parse(String(localStorage.getItem('LOGIN_IN_GROUP_LIST'))).filter((element: any) => element.login_group === data.group_name);
        const users_list = JSON.parse(String(localStorage.getItem('USERS_LIST')));
        var users: ILogindata[] = [];
        login_in_groups.map((elem: any) => { 
            let f_res = users_list.filter((element: any) => element.code === elem.login)[0];
            if (f_res!==undefined) {
                users.push(f_res)
            }
        });
        var def_vl = '';
        for(let i = 0; i < users.length; i++) {
            if (task.length>0) {
                if (users[i].code === task[0].assigned) {
                    def_vl = users[i].display_name;
                }
            }
        };
        return (
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: 1,
                padding: '2px'
            }}>
            <Autocomplete
                id={data.process+"-comboUser"}
                size="small"
                fullWidth
                defaultValue={def_vl}
                options={ users !== undefined ? users.map((option) => {if (option!== undefined) {return option.display_name}}) : ['No items'] }
                PopperComponent={StyledPopper}
                sx={{
                    width: 150,
                    fontFamily: "Helvetica, sans-serif",
                    fontSize: "8px",
                    '& label': {
                        fontSize: '10px',
                        lineHeight: '1rem',
                    },
                    '& input': {
                        fontSize: '10px',
                        lineHeight: '1rem',
                    },
                }}
                renderInput={(params) => 
                    <TextField 
                        {...params} variant='standard' label='<User>' />
                }
                onChange={(event: any, newValue: string | null | undefined, reason, details) => {
                    const save_box = document.getElementById(data.process + '-box');
                    if (save_box !== null) { save_box.style.display = 'flex' }
                }}
            />
            </Box>
         )
    } else {
        return <></>
    }
}

type CaptionName = {
    caption?: string;
    name?: string;
    box_id?: string;
    pipeline_code?: string;
    scene_code?: string;
    color?: string;
};

const ItemCaption: React.FC<CaptionName> = (items) => {
    const save =() =>{
        Update_save({ name: items.name, scene_code: items.scene_code })
    }
    return <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: '1.5px',
        borderRadius: 1,
        height: "30px"
    }}>
        <Box sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            padding: '1.5px',
            height: '30px',
        }}
        >
            <Box sx={{
                display: "flex",
                justifyContent: "flex-start",
                height: '35px',
                width: '2px',
                position: 'relative',
                top: '-4px',
                left: '-8px',
                bgcolor: ColorLuminance(String(items?.color), 0),
                borderRadius: 10,
            }} >
            </Box>
            <Typography
                sx={{
                    fontFamily: "Helvetica, sans-serif",
                    fontWeight: "bold",
                    fontSize: "10px",
                }}
                variant="overline"
            >
                { items.caption}
            </Typography>
        </Box>
        <Box id={items.box_id + '-box'} sx={{ display: 'none' }}>
            <IconButton
                size = "small"
                onClick={save}
            >
                <SaveIcon 
                    fontSize="inherit"
                    // sx={{ fontSize: 14 }} 
                />
            </IconButton>
        </Box>
    </Box>
}

const StatusCombo: React.FC<CaptionName> =(items) => {
    
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly IPipeline[]>([]);
    const [color_value, setValue] = React.useState<IPipeline | null>(null);
    const loading = open && options.length === 0;
    const task = JSON.parse(String(localStorage.getItem('TASKS_FOR_SCENE'))).filter((element: any) => element.process === items?.name);
    const def_value_status = task?.map((val:any)=>val?.status);
    const { data: pipe } = useList<IPipeline>(get_pipe_options(items?.pipeline_code));
    const pipe_data = pipe?.data;
    var bg_color_status = '';
    if (pipe_data!== undefined) {
        if (pipe_data.length > 0) {
            for (let i = 0; i < pipe_data.length; i++) {
                if (def_value_status !== undefined) {
                    if (pipe_data[i].name === def_value_status[0]) {
                        bg_color_status = pipe_data[i].color;
                        break;
                    }
                }
            }
        }
    };
    React.useEffect(() => {
            const pipes = pipe?.data !== undefined ? pipe?.data : [];
            let active = true;
            if (!loading) {
                return undefined;
            }
            if (active) {
                setOptions([...pipes]);
            }
            return () => {
            active = false;
            };
    }, [bg_color_status, pipe, loading]);
    React.useEffect(() => {
            if (!open) {
                setOptions([]);
            }
    }, [open]);
    if (items.name !== 'assets') {
        return <Box
            id={items.box_id}
            sx={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: 1,
                bgcolor: bg_color_status !== undefined ? bg_color_status : null,
                spacing: 0.5,
                padding: '1.5px',
            }}
            >
                <Autocomplete
                    id={items?.name + "-comboStatus"}
                    open={open}
                    onOpen={() => { setOpen(true); }}
                    onClose={() => { setOpen(false); }}
                    isOptionEqualToValue={(option, value) => option?.name === value?.name}
                    getOptionLabel={(option) => option?.name}
                    options={options}
                    loading={loading}
                    size="small"
                    PopperComponent={StyledPopper}
                    componentsProps={{ clearIndicator: { size: 'small', sx: { fontSize: '0.5rem' } } }}
                    sx={{
                        '& label': {
                            fontSize: '10px',
                            lineHeight: '1rem',
                        },
                        '& input': {
                            fontSize: '10px',
                            lineHeight: '1rem',
                        },
                        padding: '0px',
                    }}
                    fullWidth
                    onChange={(event: any, newValue: IPipeline | null, reason, details) => {
                        const elem = document.getElementById(String(items?.name));
                        setValue(newValue);
                        if (elem !== null) { elem.style.backgroundColor = String(newValue?.color); };
                        const save_box = document.getElementById(String(items?.name + '-box'));
                        if (save_box !== null) { save_box.style.display = 'flex' }
                    }}
                    renderInput={(params) => 
                        <TextField
                            {...params}
                            label={def_value_status !== undefined ? def_value_status?.length > 0 ? def_value_status[0] : 'Status' : 'Status'}
                            value={def_value_status !== undefined ? def_value_status[0] : null }
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    }
                />
            </Box>
    } else {
        return <></>
    }
}

type Bid_Dates = {
    bid_date?: string;
    id_name?: string;
    process?: string;
}

const BidDate: React.FC<Bid_Dates> = (date) => {
    const st_date = date.bid_date !== undefined ? new Date(date.bid_date) : null;
    const [bid_Date, setValue] = React.useState<Dayjs | null>(dayjs(st_date));
    const [locale] = React.useState<typeof locales[number]>('ru');
    
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
            <DatePicker
                format="DD.MM.YYYY"
                value={bid_Date}
                slotProps={{
                    openPickerButton:{size: 'small', sx: { fontSize: 'small'}},
                    dialog: { sx: { fontSize: '0.6rem' } },
                    textField: { id:date.id_name, variant: "standard", size: "small",  sx:{ width: 125 }}
                }}
                onChange={(newValue) => {
                    setValue(newValue);
                    const save_box = document.getElementById(date.process + '-box');
                    if (save_box !== null) { save_box.style.display = 'flex' }
                }}
                // renderInput={(params) => <TextField id={date.id_name} variant="standard" size="small" sx={{ width: 125 }} {...params} />}
            />
        </LocalizationProvider>
    )
}

const BidDates: React.FC<Bid_Dates> = (data) => {
    if (data.id_name!=='assets') {
        var task = JSON.parse(String(localStorage.getItem('TASKS_FOR_SCENE'))).filter((element: any) => element.process === data?.process);
        if (task.length > 0) {
            task = task[0];
        };
        return <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                padding: '2px',
            }}
        >
            <Stack
                sx={{
                    '& .MuiInputBase-root': {
                        fontSize: '0.8rem',
                    },
                }}
                direction="column"
            >
                <BidDate bid_date={task?.bid_start_date} id_name={data.id_name + '-bid_start'} process={data.process} />
                <BidDate bid_date={task?.bid_end_date} id_name={data.id_name + '-bid_end'} process={data.process} />
                {/* <Typography variant="subtitle2" hidden={name.name === 'assets' ? true : false}>
                        {st_date + ' - ' + end_date}
                        <br></br>
                        {'Days: ' + total_date}
                    </Typography> */}
            </Stack>
        </Box>
    } else{
        return <></>
    }
}

type ChartData = {
    name: string,
    assets: string,
}
const AssetsChart: React.FC<ChartData> = (data) => {
    if (data.name === 'assets'){
        const label = data.assets !== undefined ? data.assets : ' ';
        const asset_value = !isNaN(Number(data.assets?.split('/')[0])) && Number(data.assets?.split('/')[0]) !== 0 && data.assets?.split('/')[0]!== undefined ? Number(data.assets?.split('/')[0]) : 1;
        const asset_count = !isNaN(Number(data.assets?.split('/')[1])) && Number(data.assets?.split('/')[1]) !== 0 && data.assets?.split('/')[1] !== undefined ? Number(data.assets?.split('/')[1]) : 1;
        const angle = Math.trunc((360 / asset_count) * (asset_count - asset_value));
        const asset = [{ name: "Assets", value: asset_value}];
        // const RADIAN = Math.PI / 180;
        const renderCustomizedLabel = ({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            index
        }: any) => {
            // const radius = innerRadius + (outerRadius - innerRadius);
            // const x = cx + radius * Math.cos(-midAngle * RADIAN);
            // const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
                <text
                    x={52}
                    y={78}
                    fill="white"
                    textAnchor={"center"}
                    dominantBaseline="central"
                >
                    {label}
                </text>
            );
        };

        return <Box
            sx={{
                display: 'flex',
                justifyContent: "center",
            }}
        >
            <PieChart width={154} height={167}>
                <Pie
                    data={asset}
                    cx={65}
                    cy={75}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={50}
                    outerRadius={60}
                    stroke="none"
                    paddingAngle={angle !== undefined ? angle : 0}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {asset.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={"#008854"} />
                    ))}
                </Pie>
            </PieChart>
        </Box>
    } else {
        return <></>        
    }
};

type DocButton = {
    process: string;
    script?: string;
    task_id?: any;
}
const DocButtons: React.FC<DocButton> = (data) => {
    const { show } = useNavigation();
    const showTask = () => {
        if (data.task_id!== undefined) {
            if (data.task_id.length>=0) {
                const id = data.task_id[0];
                if (id?.id!==undefined)
                {
                    show('tasks',id?.id);
                }
            }
        }
    }
    if (data.process !== 'assets') {
        
        return <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: 1,
                padding: '2px',
            }}
        >
            <IconButton >
                <AttachFileIcon fontSize='small' />
            </IconButton>
            <IconButton onClick={showTask}>
                <ChatIcon fontSize='small' />
            </IconButton>
        </Box>
    } else {
        return <></>
    }
}

type SceneCode = {
    code?: string,
    assets?: string,
    script?: string,
};

const Item2: React.FC<SceneCode> = (scene_code) => {
    var process = JSON.parse(String(localStorage.getItem('PIPELINE_PROCESS')));
    console.log("🚀 ~ file: taskitem.tsx:551 ~ process:", process)
    
    // setTimeout(async function () {
    //     const reloaded = localStorage.getItem('reloaded') ?? false;
    //     if (reloaded === 'false') {
    //         localStorage.setItem('reloaded', 'true');
    //         document.location.reload();
    //     }
    // }, 1500);
    return <React.Suspense fallback="Loading...">
        {
            process.map((items:any) => {

                console.log("🚀 ~ file: taskitem.tsx:561 ~ process.map ~ items:", items)

                const task_id = JSON.parse(String(localStorage.getItem('TASKS_FOR_SCENE'))).filter((element:any)=>element.process===items?.name);
                var assigned_group = '';
                if (!('assigned_login_group' in items)&&(items?.name!=='assets')) {
                    assigned_group=items?.supervisor_login_group
                } else {
                    assigned_group = items?.assigned_login_group
                }
                return <Grid item xs={'auto'} >
                    <Card
                        sx={{
                            display: "flex",
                            padding: '2px',
                            flexDirection: "column",
                            position: "relative",
                            height: "100%",
                            width: "100%",
                        }}
                    >
                        <CardContent sx={{
                            padding: '2px',
                        }}>
                            <ItemCaption 
                                caption={items?.label !== undefined ? items.label : items?.name} 
                                pipeline_code={items?.task_pipeline} 
                                box_id={items?.name} 
                                name={items?.name}
                                scene_code={scene_code.code}
                                color={items?.color} 
                            />
                            <StatusCombo 
                                box_id={items?.name} 
                                name={items?.name} 
                                pipeline_code={items?.task_pipeline} 
                                scene_code={scene_code.code} 
                            />
                            <BidDates 
                                id_name={items?.name} 
                                process={items?.name}
                            />
                            {/* <>
                            {setTimeout(() => <UsersList process={items.name} group_name={assigned_group} />, 500)}
                            </> */}
                            <UsersList 
                                group_name={assigned_group} 
                                process={items.name} 
                            />
                            <DocButtons process={items?.name} script={scene_code.script} task_id={task_id} />
                            <AssetsChart 
                                name={items?.name} 
                                assets={String(scene_code?.assets)}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            })
        }
    </React.Suspense>
}

type Review = {
    scene_code: string | undefined;
    scene_pipeline_code: string | undefined;
    assets: string | undefined;
    script?: string;
}

const Reviews: React.FC<Review> = (scene_code) => {
    // const t = useTranslate();
    // const { show } = useNavigation();
    // const { mutate: mutateDelete } = useDelete();
    // const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleClose = () => {
    //     setAnchorEl(null);
    // };
    // const open = Boolean(anchorEl);
    // const popoverId = open ? "simple-popover" : undefined;
    
    return (
        <Box sx={{ 
            width: '100%', 
            padding: 0.5, 
            borderRadius: 1, 
            // overflow: 'auto', 
            bgcolor: '#242424' }}>
            <Grid 
                container 
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                width={'100%'}
                rowSpacing={1}
                sx={{ 
                    padding: '3px',
                    // flexWrap: 'nowrap',
                }}
                spacing={1}
            >
                <Item2 code = {scene_code.scene_code} assets={scene_code.assets} script={scene_code.script} />
            </Grid>
        </Box>
    );
};

export default Reviews;