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
// import Snackbar from '@mui/material/Snackbar';
// import MuiAlert, { AlertProps } from '@mui/material/Alert';


// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
//     props,
//     ref,
// ) {
//     return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

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

            TacticDataProvider().update(update_data).then(() => SaveTaskForScene(data.scene_code));
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
            TacticDataProvider().create(save_data).then(() => SaveTaskForScene(data.scene_code));
        };
    };
    const save_box = document.getElementById(data?.name + '-box');
    if (save_box !== null) { save_box.style.display = 'none' };
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
                marginTop: "5px",
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

    // const [open, setOpen] = React.useState(false);

    // const handleClick = () => {
    //     setOpen(true);
    //     Update_save({ name: items.name, scene_code: items.scene_code })
    //     setOpen(false);
    //     setOpen(true);
    // };

    // const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }

    //     setOpen(false);
    // };


    const save =() =>{
        // setOpen(true);
        Update_save({ name: items.name, scene_code: items.scene_code })
        // setOpen(true);
    }

    return <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: '1.5px',
        borderRadius: 1,
        marginTop: "-7px",
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
                top: '-2px',
                left: '-12px',
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
                // onClick={() => { setOpen(true); Update_save({ name: items.name, scene_code: items.scene_code }); setOpen(true); }}
            >
                <SaveIcon 
                    fontSize="inherit"
                />

                {/* <Snackbar
                    open={open}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    autoHideDuration={3000}
                    onClose={handleClose}
                    message='Saved'
                >
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        Saved
                    </Alert>
                </Snackbar> */}

            </IconButton>

        </Box>
    </Box>
}

const StatusCombo2: React.FC<CaptionName> = (items) => {

    const task = JSON.parse(String(localStorage.getItem('TASKS_FOR_SCENE'))).filter((element: any) => element.process === items?.name) || [];
    const [status, setStatus] = React.useState<string>( task.length >0 ? task[0].status : '')
    const { data: pipe } = useList<IPipeline>(get_pipe_options(items?.pipeline_code));
    const pipe_data = pipe?.data || [];

    var bg_color_status = '';
    if (pipe_data.length > 0) {
        for (let i = 0; i < pipe_data.length; i++) {
            if (status !== '') {
                if (pipe_data[i].name === status) {
                    bg_color_status = ColorLuminance(pipe_data[i].color, -0.5);
                    break;
                }
            }
        }
    };
    if (items.name !== 'assets') {
        return <Box
            id={items.box_id}
            sx={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: 1,
                bgcolor: bg_color_status !== undefined ? bg_color_status : null,
                spacing: 1,
                marginTop: "5px",
                marginBottom: "5px",
                padding: '0px',
            }}
        >
            <Autocomplete
                id={items?.name + "-comboStatus"}
                options={pipe_data.map((option: IPipeline) => option.name)}
                size="small"
                value={status}
                PopperComponent={StyledPopper}
                componentsProps={{ clearIndicator: { size: 'small', sx: { fontSize: '0.5rem' } } }}
                sx={{
                    '& label': {
                        fontSize: '12px',
                        lineHeight: '1rem',
                    },
                    '& input': {
                        fontSize: '12px',
                        lineHeight: '1rem',
                    },
                    padding: '0px',
                }}
                fullWidth
                onChange={(event: any, newValue: string | null, reason, details) => {
                    setStatus(String(newValue));
                    const save_box = document.getElementById(String(items?.name + '-box'));
                    if (save_box !== null) { save_box.style.display = 'flex' }
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label="<Status>"
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
    width: number,
    height: number,
}

const AssetsChart: React.FC<ChartData> = (data) => {
    const dx = 5;
    const dy = 5;

    if (data.name === 'assets'){
        const label = data.assets !== undefined ? data.assets : ' ';
        const asset_value = !isNaN(Number(data.assets?.split('/')[0])) && Number(data.assets?.split('/')[0]) !== 0 && data.assets?.split('/')[0]!== undefined ? Number(data.assets?.split('/')[0]) : 1;
        const asset_count = !isNaN(Number(data.assets?.split('/')[1])) && Number(data.assets?.split('/')[1]) !== 0 && data.assets?.split('/')[1] !== undefined ? Number(data.assets?.split('/')[1]) : 1;
        const angle = Math.trunc((360 / asset_count) * (asset_count - asset_value));
        const asset = [{ name: "Assets", value: asset_value}];
        
        const renderCustomizedLabel = ({
            cx,
            cy,
            midAngle,
            innerRadius,
            outerRadius,
            percent,
            index
        }: any) => {
            switch (label.length){
                    case 3: cx = cx - 12; break;
                    case 4: cx = cx - 14; break;
                    case 5: cx = cx - 18; break;
            }
            return (
                <text
                    id="chart_label"
                    x={cx}
                    y={cy}
                    fill="#7c7c7c"
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
            <PieChart width={data.width} height={data.height}>
                <Pie
                    data={asset}
                    cx={Math.trunc(data.width / 2)-dx}
                    cy={Math.trunc(data.height / 2)-dy}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    innerRadius={65}
                    outerRadius={75}
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
    var process = JSON.parse(String(localStorage.getItem('PIPELINE_PROCESS'))) || [];
    
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
                const task_id = JSON.parse(String(localStorage.getItem('TASKS_FOR_SCENE'))).filter((element:any)=>element.process===items?.name);
                var assigned_group = '';
                if (!('assigned_login_group' in items)&&(items?.name!=='assets')) {
                    assigned_group=items?.supervisor_login_group
                } else {
                    assigned_group = items?.assigned_login_group
                }
                return <Grid 
                    item 
                    xs={'auto'} 
                    >
                    <Card
                        sx={{
                            display: "flex",
                            padding: '5px',
                            '.MuiGrid-item': {
                                paddingLeft: '5px',
                            },
                            flexDirection: "column",
                            position: "relative",
                            height: "100%",
                            width: "100%",
                            '.MuiCardContent-root:last-child': {
                                paddingBottom: '5px',
                            }
                        }}
                    >
                        <CardContent 
                            sx={{
                                padding: '5px',
                            }}>
                            <ItemCaption 
                                caption={items?.label !== undefined ? items.label : items?.name} 
                                pipeline_code={items?.task_pipeline} 
                                box_id={items?.name} 
                                name={items?.name}
                                scene_code={scene_code.code}
                                color={items?.color} 
                            />
                            <StatusCombo2
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
                                width={154}
                                height={182}
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
    return (
        <Box sx={{ 
            width: '100%', 
            borderRadius: 1, 
            }}
        >
            <Grid 
                container 
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                width={'100%'}
                rowSpacing={2}
                sx={{ 
                    padding: '3px 3px 3px 0px',
                }}
                spacing={2}
            >
                <Item2 code = {scene_code.scene_code} assets={scene_code.assets} script={scene_code.script} />
            </Grid>
        </Box>
    );
};

export default Reviews;