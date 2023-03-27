import React, { useState, useEffect } from "react";
import {
    IResourceComponentsProps,
    useShow,
    useList,
    useTranslate,
    useCreate,
    useNavigation,
} from "@pankod/refine-core";
import {
    Avatar,
    Grid,
    Paper,
    Stack,
    Typography,
    Box,
    IconButton,
    Button,
    Popover,
    TextField,
    Divider,
} from "@pankod/refine-mui";
import {
    LocalPhoneOutlined,
    StoreOutlined,
} from "@mui/icons-material";
import CircularProgress from '@mui/material/CircularProgress';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from "@mui/icons-material/Edit";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from '@mui/icons-material/Send';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
    Delete,
} from "@mui/icons-material";
import Popper from '@mui/material/Popper';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import { styled } from '@mui/material/styles';
import { ITask, IPipeline, IScenes, ILogindata } from "../../interfaces";
import { get_pipe_options, ColorLuminance, getAcronym, getColorHash, HeaderLinks } from '../../conf';

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

type TaskInfoTextProps = {
    icon: React.ReactNode;
    text?: string;
};

const TaskInfoText: React.FC<TaskInfoTextProps> = ({ icon, text }) => (
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

const scrollText = (id:string)=>{
    var block = document.getElementById(id);
    if (block!==null) {
        block.scrollTop = block.scrollHeight;
    };
}

const user_list = JSON.parse(String(localStorage.getItem("USERS_LIST")));
const current_user = JSON.parse(String(localStorage.getItem("USER_INFO")));

const joinMessageNote = (note:any[], message:any[]) => {
    var out: any[] = [];
    const results = [...note, ...message];
    out = results.sort((obj1, obj2) => {
        if (obj1?.timestamp < obj2?.timestamp) { return -1 };
        if (obj1?.timestamp > obj2?.timestamp) { return 1 };
        return 0
    });
    return out
};

type TaskNote = {
    process?: string;
    status_colors?: any[];
    search_code?: string;
    search_type?: string;
}

const TaskNotes: React.FC<TaskNote> = (item) => {

    const { data: notesAll, isLoading: noteLoading } = useList({
        resource: 'notes',
        queryOptions: {
            enabled: item.process !== undefined && item.search_code!== undefined ? true : false,
        },
        config: {
            hasPagination: false,
            filters: [{
                field: "search_code",
                operator: "in",
                value: [item.search_code]
            },
            {
                field: "process|AND",
                operator: "in",
                value: [item.process]
            }
        ]
        }
    });
    const notes = notesAll?.data;

    const msg_code = `${item.search_type}%26code=${item.search_code}|${item.process}|status`
    const { data: messagesAll, isLoading: messageLoading } = useList({
        resource: 'sthpw/message_log',
        queryOptions:{
            enabled: msg_code===undefined ? false : true,
        },
        config: {
            hasPagination: false,
            filters: [{
                field: 'message_code|AND',
                operator: 'in',
                value: [msg_code]
            },{
                field: 'message|AND',
                operator: 'nnull',
                value: ''
            }]
        }
    });
    const messages = messagesAll?.data;
    
    var out: any[] = [];
    if (notes !== undefined && messages !== undefined) {
        out = joinMessageNote(notes, messages);
    };

    var xx:any[]=[];
    if (out.length > 0 ){
        for (const j in out){
            if (out[j].hasOwnProperty('message')) {
                const author = user_list.filter((element: any) => element?.code === out[j]?.login)[0];
                const msg = {
                    avatar: author?.image,
                    bg_color: item.status_colors?.filter((el: any) => el?.name === out[j]?.message)[0]?.color ?? "#3636",
                    left: out[j]?.login === current_user?.code ? true : false,
                    code: out[j]?.message_code,
                    id: out[j]?.id,
                    display_name: author?.display_name,
                    login: author?.login,
                    message: out[j]?.message,
                    date_time: new Date(out[j]?.timestamp)
                }
                xx.push(system_message(msg))
            } else {
                const author = user_list.filter((element: any) => element?.code === out[j]?.login)[0];
                const msg={
                    avatar: author?.image,
                    left: out[j]?.login === current_user?.code ? true : false,
                    code: out[j]?.code,
                    display_name: author?.display_name,
                    login: author?.login,
                    id: out[j]?.id,
                    note: out[j]?.note,
                    date_time: new Date(out[j]?.timestamp),
                }
                xx.push(UserMessage(msg))
            }
    }}
    
    setTimeout(scrollText, 1000, "note-list");

    const { mutate: addNote } = useCreate();
    const [note, setNote] = React.useState<string | null >(null);
    if (noteLoading && messageLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
            <CircularProgress />
        </Box>}

    return( 
            <Box 
                id="note-box"
                width="100%" 
                height="100%"
                sx={{ 
                    border: "6px", 
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Paper id="note-list" sx={{ overflowX: "clip", overflowY: "scroll", border: "6px", padding: "10px 14px 10px 14px", width: "100%", display: "flex", flexDirection: 'column' }}>
                    {xx.map((elem) => elem)}
                </Paper>
                <Box
                    id="note-footer"
                    width="100%"
                    height="150px" 
                    marginTop="10px"
                >
                    <Paper sx={{ border: "6px", padding: "10px", width: "100%", display: "flex", }}>
                        <IconButton>
                            <AttachFileIcon/>    
                        </IconButton>  
                        <TextField
                            id="note-sender"
                            label="Message"
                            size="small"
                            placeholder="Input message"
                            defaultValue={null}
                            value={note}
                            sx={{width:"100%"}}
                            multiline
                            onChange={(event)=> setNote(event.target.value)}
                        />
                        <IconButton onClick={() => {
                            if (note !== null && note !== ""){
                                addNote({
                                    resource: "sthpw/note",
                                    values: {
                                        note: note,
                                        process: item.process,
                                        context: item.process,
                                        login: current_user?.code,
                                        add_data: {
                                            triggers: "false",
                                            project: "dolly3d",
                                            search_type: item.search_type,
                                            code: item.search_code,
                                            make_key: true,
                                        }
                                    },
                                    successNotification: (data,variables,context)=>{
                                        return {
                                            type: "success",
                                            message: "Note was added successfully!"
                                        }
                                    }
                                });
                            }
                            setNote("");
                        }}>
                            <SendIcon/>
                        </IconButton>
                    </Paper>
                </Box>
            </Box>
)}

export const TaskShow: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const { goBack } = useNavigation();
    
    const {
        queryResult: { data, isLoading },
    } = useShow<ITask>();
    const task = data?.data;

    const {data: scenes} = useList({
        resource: 'scenes',
        config: {
            filters: [{
                field: "code",
                operator: "in",
                value: [task?.search_code]
            }],
        },
        queryOptions: {
            enabled: !isLoading,
        }
    });
    const scene = scenes?.data[0];
    
    const { data: pipe } = useList<IPipeline>(get_pipe_options(task?.pipeline_code));
    const pipe_data = pipe?.data;

    if (isLoading) {
        return <Box sx = {{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%'}}>
            <CircularProgress />
        </Box>
    } else {

    return (
        <Grid container spacing={0.5}>
            <Grid item width="100%" display="flex" direction="row">
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    height: '5vh',
                    width: '2px',
                    position: 'relative',
                    top: '5px',
                    left: '-8px',
                    bgcolor: ColorLuminance(getColorHash(String(task?.assigned)), 0),
                }} >
                </Box>
                <Box display="flex" flexDirection="row" width="100%">
                    <IconButton onClick={goBack}><ArrowBackIcon fontSize="small"/></IconButton>
                    < HeaderLinks showHome display="flex" link="/tactic/refine_test/tasks" title={t("task.task")} />
                </Box>
            </Grid>
            <Grid item xs={12} lg={3}>
                <Paper sx={{ padding: "5px" }}>
                    <Stack alignItems="center" spacing={0.5}>
                        <Typography variant="h6">
                            {task?.process}
                        </Typography>
                    </Stack>
                    <br />
                    <Stack spacing={0.5}>
                        <TaskInfoText
                            icon={<StoreOutlined />}
                            text={task?.assigned}
                        />
                        <TaskInfoText
                            icon={<InfoOutlinedIcon />}
                            text={task?.code}
                        />
                    </Stack>
                </Paper>
            </Grid>
            <Grid item xs={12} lg={9}>
                <Stack id="main-note-container" direction="column" spacing={0.5} height="60vh">
                    <Box id="note-caption-box" sx={{ display: "flex", height:"100%", width: "100%"}}>
                        <Stack width="100%">
                            <Paper sx={{width: "100%", padding: '5px'}}>
                                <Typography variant="caption"> {task?.process} </Typography>
                                <Box display="flex" flexDirection="row" width="100%">
                                    <Box display="flex" flexDirection="column" width="70%">
                                        <Typography variant="subtitle2"> {scene?.name} </Typography>
                                        <TextField 
                                            multiline 
                                            rows={4}
                                    />
                                    </Box>
                                    <Box display="flex" flexDirection="column" width="30%" padding="10px">
                                        <StatusCombo process={task?.process} scene_code={task?.search_code} pipeline_code={task?.pipeline_code} />
                                        <Divider sx={{height: "10px"}} />
                                        <UsersList process={task?.process} assigned_user={task?.assigned} />
                                    </Box>
                                </Box>
                            </Paper>
                        </Stack>
                    </Box>
                    <TaskNotes process={task?.process} search_type={task?.search_type} search_code={task?.search_code} status_colors={pipe_data} />
                </Stack>
            </Grid>
        </Grid>
    );
    }
};

export default TaskShow;

type UserMsg = {
    avatar: {
        url: string,
        name: string,
    },
    bg_color?: string,
    left: boolean,
    code: string,
    id: string,
    display_name: string,
    login: string,
    note?: string,
    message?: string
    date_time: Date,
}

const system_message:React.FC<UserMsg> = (msg) => {

    return (
        <Box id={`message-${msg.id}`} width="100%" display='flex' sx={{ justifyContent: !msg.left ? "flex-start" : "flex-end", alignItems: "center", margin: "2px" }}>
            <UserAvatar display_name={msg.display_name} login={msg.login} id={msg.id} image={msg.avatar} />
            <Box id={msg.code + "|" + msg.id}
                sx={{
                    display: "flex",
                    borderRadius: "6px",
                    backgroundColor: ColorLuminance(String(msg.bg_color), -0.8),
                    width: "auto",
                    minWidth: "20%",
                    padding: '5px 10px 2px 10px',
                    flexDirection: 'column',
                }}>
                <Box id={`username-${msg.id}`} width="100%" display="flex" sx={{ alignItems: "center" }}>
                    <Typography width="100%" variant="caption" color={getColorHash(msg.login)}>
                        {msg.display_name}
                    </Typography>
                </Box>
                <Typography gutterBottom paragraph
                    sx={{ display: "flex", margin: '0px' }}>
                    {msg.message}
                </Typography>
                <Box id={`datetime-${msg.id}`} width="100%" display="flex" sx={{ justifyContent: "flex-end" }}>
                    <Typography variant="overline" color="grey">
                        {msg.date_time.toLocaleDateString()}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

const PopoverMenu: React.FC = ()=> {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const popoverId = open ? "simple-popover" : undefined;

    return(
        <>
            <IconButton
                aria-describedby={popoverId}
                onClick={handleClick}
                aria-label="settings"
                sx={{
                    padding: "0px",
                }}
            >
                <MoreVertIcon fontSize="small" />
            </IconButton>        
            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
            >
                <Button
                    // onClick={() => {
                    //     showEdit(id);
                    //     setAnchorEl(null);
                    // }}
                    size="medium"
                    startIcon={<EditIcon />}
                    sx={{
                        padding: "5px 10px",
                        width: "100%"
                    }}
                >
                    Edit
                </Button>
                <br></br>
                {/* <CanAccess
                    resource="assets"
                    action="delete"
                > */}
                <Button
                    // onClick={() => {
                    //     mutateDelete({
                    //         resource: "assets",
                    //         id: id,
                    //         values: { retired: true },
                    //         mutationMode: "undoable"
                    //     });
                    // }}
                    size="medium"
                    startIcon={<Delete />}
                    sx={{
                        padding: "5px 10px",
                        width: "100%"
                    }}
                >
                    Delete
                </Button>
                {/* </CanAccess> */}
            </Popover>
        </>
    )
}

const UserMessage:React.FC<UserMsg> = (msg) => {

    return (
        <Box id={`note-${msg.id}`} width="100%" display='flex' sx={{ justifyContent: !msg.left ? "flex-start" : "flex-end", alignItems: "center", margin: "2px" }}>
            <UserAvatar display_name={msg.display_name} login={msg.login} id={msg.id} image={msg.avatar} />
            <Box id={`${msg.code}-`+msg.id}
                sx={{
                    display: "flex",
                    borderRadius: "6px",
                    backgroundColor: "#404040",
                    width: "auto",
                    minWidth: "20%",
                    padding: '5px 10px 2px 10px',
                    flexDirection: 'column',
                }}>
                <Box id={`username-${msg.id}`} width="100%" display="flex" sx={{ alignItems: "center" }}>
                    <Typography width="100%" variant="caption" color={getColorHash(msg.login)}>
                        {msg.display_name}
                    </Typography>
                    <Box width="20%" display="flex" sx={{ justifyContent: "flex-end" }}>
                        <PopoverMenu/>
                    </Box>
                </Box>
                <Typography gutterBottom paragraph sx={{ display: "flex", margin: "0px" }}>
                    {msg.note}
                </Typography>
                <Box id={`datetime-${msg.id}`} width="100%" display="flex" sx={{ justifyContent: "flex-end" }}>
                    <Typography variant="overline" color="grey" >
                        {msg.date_time.toLocaleDateString()}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

type AvatarInfo = {
    display_name: string,
    login: string,
    id: string,
    image: {
        url: string,
        name: string,
    }
}
const UserAvatar:React.FC<AvatarInfo> = (avatar)=> {
    if (avatar.image.name === 'no_image.png') {
        const acronym = getAcronym(avatar.display_name)
        return (
        <Box id={`avatar-${avatar.id}`} display='flex' sx={{ width: "64px", height: "100%", justifyContent: "center", alignItems: "flex-end" }}>
                <Box display='flex' sx={{ backgroundColor: getColorHash(avatar.login), width: "48px", borderRadius: "50px", height: "48px", justifyContent: "center", alignItems: "canter" }}>
                <Typography sx={{alignSelf: "center", fontWeight: '500', lineHeight: '1rem', fontSize: "1.2rem"}}>
                    { acronym!==null ? acronym : "UN" }
                </Typography>
            </Box>
        </Box>
        )
    } else
    return (
        <Box id={`avatar-${avatar.id}`} display='flex' sx={{ width: "64px", height: "100%", justifyContent: "center", alignItems: "flex-end" }}>
            <Avatar src={avatar.image.url} alt={avatar.image.name} sx={{ width: "48px", height: "48px" }} />
        </Box>
    )
}


type StatusInfo = {
    process: string | undefined;
    scene_code: string | undefined;
    pipeline_code: string | undefined;
}

const StatusCombo: React.FC<StatusInfo> = (items) => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly IPipeline[]>([]);
    const [color_value, setValue] = React.useState<IPipeline | null>(null);
    const loading = open && options.length === 0;
    const task = JSON.parse(String(localStorage.getItem('TASKS_FOR_SCENE'))).filter((element: any) => element.process === items?.process);
    const def_value_status = task?.map((val: any) => val?.status);
    const { data: pipe } = useList<IPipeline>(get_pipe_options(items?.pipeline_code));
    const pipe_data = pipe?.data;
    var bg_color_status = '';
    if (pipe_data !== undefined) {
        if (pipe_data.length > 0) {
            for (let i = 0; i < pipe_data.length; i++) {
                if (def_value_status !== undefined) {
                    if (pipe_data[i].name === def_value_status[0]) {
                        bg_color_status = ColorLuminance(pipe_data[i].color, -0.5);
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
    if (items.process !== 'assets') {
        return <Box
            id={items.process}
            sx={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: 1,
                bgcolor: bg_color_status !== undefined ? bg_color_status : null,
                spacing: 0.5,
                padding: '0px',
            }}
        >
            <Autocomplete
                id={items?.process + "-comboStatus"}
                open={open}
                onOpen={() => { setOpen(true); }}
                onClose={() => { setOpen(false); }}
                isOptionEqualToValue={(option, value) => option?.name === value?.name}
                getOptionLabel={(option) => option?.name}
                options={options}
                loading={loading}
                size="small"
                componentsProps={{ clearIndicator: { size: 'small', sx: { fontSize: '0.5rem' } } }}
                sx={{
                    // '& label': {
                    //     fontSize: '10px',
                    //     lineHeight: '1rem',
                    // },
                    // '& input': {
                    //     fontSize: '10px',
                    //     lineHeight: '1rem',
                    // },
                    padding: '0px',
                }}
                fullWidth
                onChange={(event: any, newValue: IPipeline | null, reason, details) => {
                    const elem = document.getElementById(String(items?.process));
                    setValue(newValue);
                    if (elem !== null) { elem.style.backgroundColor = ColorLuminance(String(newValue?.color), -0.5); };
                }}
                renderInput={(params) =>
                    <TextField
                        {...params}
                        label={def_value_status !== undefined ? def_value_status?.length > 0 ? def_value_status[0] : 'Status' : 'Status'}
                        value={def_value_status !== undefined ? def_value_status[0] : null}
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

type AssignedGroup = {
    group_name?: string | undefined;
    assigned_user? : string | undefined;
    process?: string | undefined;
}

const UsersList: React.FC<AssignedGroup> = (data) => {
    
    const allProcess = JSON.parse(String(localStorage.getItem('ALL_PIPELINE_PROCESSES')));
    const currentProcess = allProcess.filter((elem: any) => elem.name === data.process)[0];
    const assignedGroup = currentProcess.assigned_login_group;
    
    let usersInGroup = JSON.parse(String(localStorage.getItem('LOGIN_IN_GROUP_LIST')));
    usersInGroup = usersInGroup.filter((elem: any) => elem.login_group === assignedGroup);
    
    const allUsers = JSON.parse(String(localStorage.getItem('USERS_LIST')));
    let users =  usersInGroup.map((elem: any) => 
        allUsers.filter((el:any) => el.login === elem.login)
    );
    users = users.flat();
    let assignedUser = users.filter((elem: any) => elem.login === data.assigned_user);
    if (assignedUser.length > 0) assignedUser = assignedUser[0];

    const [userName, setUserName] = useState<string>(assignedUser.display_name)

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            borderRadius: 1,
            padding: '0px'
        }}>
            <Autocomplete
                id={data.process + "-comboUser"}
                size="small"
                fullWidth
                value={userName}
                options={users.map((option:ILogindata) =>  option.display_name )}
                renderInput={(params) =>
                    <TextField
                        {...params} variant='outlined' label='<User>' />
                }
                onChange={(event: any, newValue: string | null | undefined, reason, details) => {
                    setUserName(String(newValue));
                }}
            />
        </Box>
    )
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
                    openPickerButton: { size: 'small', sx: { fontSize: 'small' } },
                    dialog: { sx: { fontSize: '0.6rem' } },
                    textField: { id: date.id_name, variant: "standard", size: "small", sx: { width: 125 } }
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
    if (data.id_name !== 'assets') {
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
            </Stack>
        </Box>
    } else {
        return <></>
    }
}
