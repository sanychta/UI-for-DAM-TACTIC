import React from "react";
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
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from '@mui/icons-material/Send';
import {
    Delete,
} from "@mui/icons-material";
import { ITask, IPipeline } from "../../interfaces";

import { get_pipe_options, ColorLuminance, getAcronym, getColorHash, HeaderLinks } from '../../conf';

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

// const fillNoteData = (note:any[])=>{
//     const result:any[] = [];
//     for (const j in note) {
//         if (note[j].hasOwnProperty('message')) {
//             const left = note[j]?.login === current_user?.code ? true : false;
//             const author = user_list.filter((element: any) => element?.code === out[j]?.login)[0];
//             const bg_color = item.status_colors?.filter((el: any) => el?.name === out[j]?.message)[0]?.color ?? "#3636";
//             xx.push(system_message(
//                 author?.image?.url,
//                 bg_color,
//                 left,
//                 out[j]?.message_code,
//                 out[j]?.id,
//                 author?.display_name,
//                 out[j]?.message,
//                 new Date(out[j]?.timestamp)))
//         } else {
//             const author = user_list.filter((element: any) => element?.code === out[j]?.login)[0];
//             const msg = {
//                 avatar: author?.image?.url,
//                 left: out[j]?.login === current_user?.code ? true : false,
//                 note_code: out[j]?.code,
//                 display_name: author?.display_name,
//                 id: out[j]?.id,
//                 note: out[j]?.note,
//                 date_time: new Date(out[j]?.timestamp),
//             }
//             xx.push(UserMessage(msg))
//         }
//     }
// }

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
                field: 'message_code',
                operator: 'in',
                value: [msg_code]
            }]
        }
    });
    const messages = messagesAll?.data;
    var out_msg = [];
    if (messagesAll!==undefined) {
        for (const i in messages) {
            if (messages[Number(i)]?.message!==''){
                out_msg.push(messages[Number(i)]);
            }
        }
    };

    var out: any[] = [];
    if (notes!==undefined && out_msg.length > 0) {
        out = joinMessageNote(notes, out_msg);
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
    // const { goBack } = useNavigation();
    // const { show } = useNavigation();
    
    const {
        queryResult: { data, isLoading },
    } = useShow<ITask>();
    const task = data?.data;
    
    // const {data: scenes} = useList({
    //     resource: 'scenes',
    //     config: {
    //         filters: [{
    //             field: "code",
    //             operator: "in",
    //             value: [task?.search_code]
    //         }],
    //     },
    //     queryOptions: {
    //         enabled: !isLoading,
    //     }
    // });
    // const scene = scenes?.data;
    
    const { data: pipe } = useList<IPipeline>(get_pipe_options(task?.pipeline_code));
    const pipe_data = pipe?.data;

    if (isLoading) {
        return <Box sx = {{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%'}}>
            <CircularProgress />
        </Box>
    } else {

    // const { dataGridProps } = useDataGrid<IReview, HttpError>({
    //     resource: "reviews",
    //     initialSorter: [
    //         {
    //             field: "id",
    //             order: "desc",
    //         },
    //     ],
    //     permanentFilter: [
    //         {
    //             field: "order.courier.id",
    //             operator: "eq",
    //             value: courier?.id,
    //         },
    //     ],
    //     initialPageSize: 4,
    //     queryOptions: {
    //         enabled: courier !== undefined,
    //     },
    //     syncWithLocation: false,
    // });

    // const columns = React.useMemo<GridColumns<IReview>>(
    //     () => [
    //         {
    //             field: "order.id",
    //             headerName: t("reviews.fields.orderId"),
    //             renderCell: function render({ row }) {
    //                 return (
    //                     <Button
    //                         onClick={() => {
    //                             show("orders", row.order.id);
    //                         }}
    //                     >
    //                         #{row.order.id}
    //                     </Button>
    //                 );
    //             },
    //             width: 150,
    //         },

    //         {
    //             field: "review",
    //             headerName: t("reviews.fields.review"),
    //             renderCell: function render({ row }) {
    //                 return (
    //                     <Tooltip title={row.comment[0]}>
    //                         <Typography
    //                             sx={{
    //                                 textOverflow: "ellipsis",
    //                                 overflow: "hidden",
    //                             }}
    //                         >
    //                             {row.comment[0]}
    //                         </Typography>
    //                     </Tooltip>
    //                 );
    //             },
    //             flex: 1,
    //         },
    //         {
    //             field: "star",
    //             headerName: t("reviews.fields.rating"),
    //             headerAlign: "center",
    //             flex: 1,
    //             align: "center",
    //             renderCell: function render({ row }) {
    //                 return (
    //                     <Stack alignItems="center">
    //                         <Typography variant="h5" fontWeight="bold">
    //                             {row.star}
    //                         </Typography>
    //                         <Rating
    //                             name="rating"
    //                             defaultValue={row.star}
    //                             readOnly
    //                         />
    //                     </Stack>
    //                 );
    //             },
    //         },
    //     ],
    //     [t],
    // );

    return (
        <Grid container spacing={2}>
            <Grid item width="100%" display="flex" direction="row">
                <Box sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    height: '5vh',
                    width: '2px',
                    position: 'relative',
                    top: '-4px',
                    left: '-8px',
                    bgcolor: ColorLuminance(getColorHash(String(task?.assigned)), 0),
                    // borderRadius: 10,
                }} >
                </Box>
                {/* <Box width="fit-content" >
                    <IconButton onClick={goBack}> <ArrowBackIcon /> </IconButton>
                </Box> */}
                < HeaderLinks showHome display="flex" link="/tactic/refine_test/tasks" title={t("task.task")} />
                <Box width="fit-content">
                    <Typography variant="h5">{task?.process}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12} lg={3}>
                <Paper sx={{ p: 2 }}>
                    <Stack alignItems="center" spacing={1}>
                        {/* <Avatar
                            src={task?.image.url}
                            sx={{ width: 120, height: 120 }}
                        /> */}
                        <Typography variant="h6">
                            {task?.process}
                        </Typography>
                    </Stack>
                    <br />
                    <Stack spacing={1}>
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
                <Stack id="main-note-container" direction="column" spacing={2} height="80vh">
                    <Box id="note-caption-box" sx={{ display: "flex", height:"100px", width: "100%"}}>
                        <Paper sx={{width: "100%"}}>
                            <Typography> Notes window </Typography>
                        </Paper>
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
                    backgroundColor: ColorLuminance(String(msg.bg_color), -0.5),
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
