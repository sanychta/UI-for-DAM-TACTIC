import React from "react";
import {
    IResourceComponentsProps,
    useShow,
    useNavigation,
    useTranslate,
} from "@pankod/refine-core";
import {
    Avatar,
    Grid,
    List,
    Paper,
    Stack,
    Typography,
    IconButton,
    Button,
    Divider,
    Dialog,
    Box,
    DialogContent,
    // padding,
    Breadcrumb,
} from "@pankod/refine-mui";
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IScenes, } from "../../interfaces";
import CircularProgress from '@mui/material/CircularProgress';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CloseIcon from '@mui/icons-material/Close';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Reviews from "../../components/scenes/taskitem";
import { SimpleScript } from "../../contexts/icons";
import { getAcronym, getColorHash } from "../../conf";
import { 
    // SaveTaskForScene, 
    // get_pipe_options, 
    ColorLuminance 
} from '../../conf';
import Link from '@mui/material/Link';

type SceneInfoTextProps = {
    icon: React.ReactNode;
    text?: string;
};

const SceneInfoText: React.FC<SceneInfoTextProps> = ({ icon, text }) => { 
    if(Array.isArray(text)){
        return (
            <Stack sx={{ display: text === null ? "none" : "flex" }}>
                <Stack
                    direction="row"
                    justifyContent={{
                        lg: "flex-start",
                    }}
                    gap={1}
                >
                    {icon}
                    <Stack direction="column">
                    {text.map((element) => {
                        if (element.indexOf('http')){
                            return (<Typography variant="body1">{element}</Typography>)
                        }else{
                            return (
                                <Link href={element} variant="body1" target="_blank" rel="noreferrer">
                                    {element}
                                </Link>)
                        }
                    })}
                    </Stack>
                </Stack>
                <Divider flexItem sx={{ borderColor: "text.secondary", margin: "10px 20% 10px 20%" }} />
            </Stack>
        )
    }else{
        return (
            <Stack sx={{ display: text === null ? "none" : "flex" }}>
                <Stack
                    direction="row"
                    justifyContent={{
                        lg: "flex-start",
                    }}
                    gap={1}
                >
                    {icon}
                    <Typography variant="body1">{text}</Typography>
                </Stack>
                <Divider flexItem sx={{ borderColor: "text.secondary", margin: "10px 20% 10px 20%" }} />
            </Stack>
    )}
};

type UsersInfoTextProps = {
    process: {
        name: string,
        color: string,
    };
    name: string;
    login: string;
    avatar: {
        url: string,
        name: string,
    };
};


type ImageURL = {
    avatar: {
        name: string,
        url: string,
    };
    display_name: string;
    login: string;
}

const UserAvatar: React.FC<ImageURL> = (avatar) => {
    if (avatar.avatar.name === 'no_image.png') {
        const acronym = getAcronym(avatar.display_name);
        return (
            <Box id={`avatar-${avatar.login}`} display='flex' sx={{ width: "48px", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <Box display='flex' sx={{ backgroundColor: getColorHash(avatar.login), width: "24px", borderRadius: "50px", height: "24px", justifyContent: "center", alignItems: "canter" }}>
                    <Typography sx={{ alignSelf: "center", fontWeight: '500', lineHeight: '1rem', fontSize: "0.75rem" }}>
                        {acronym !== null ? acronym : "UN"}
                    </Typography>
                </Box>
            </Box>
        )
    } else
        return (
            <Box id={`avatar-${avatar.login}`} display='flex' sx={{ width: "48px", height: "100%", justifyContent: "center", alignItems: "center" }}>
                <Avatar src={avatar.avatar.url} alt={avatar.avatar.name} sx={{ width: "32px", height: "32px" }} />
            </Box>
        )
}

const UsersInfoText: React.FC<UsersInfoTextProps> = (data) => { 
    
    return (
        <Stack
            direction="column"
            alignItems="center"
            justifyContent={{
                sm: "center",
                lg: "flex-start",
            }}
            gap={1}
        >
            <Stack 
                direction="column" 
                width="100%"
                // justifyContent="center"
            >
                <Stack 
                    alignItems="flex-start"
                    // justifyContent="center"
                    direction="row"
                >
                    <Box sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        height: '25px',
                        width: '2px',
                        position: 'relative',
                        top: '-4px',
                        left: '-8px',
                        bgcolor: ColorLuminance(String(data.process.color), 0),
                        borderRadius: 10,
                    }} >
                    </Box>
                    <Typography variant="subtitle2">{data.process.name} : </Typography>
                </Stack>
                <Stack
                    alignSelf="flex-start"
                    alignItems="center"
                    direction="row"
                >
                    <UserAvatar avatar={data.avatar} display_name={String(data.name)} login={String(data.login)} /> 
                    <Typography variant="subtitle2">  {'  ' + data.name}  </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
};

const getProcessUsers = ()=>{
    const tasks = JSON.parse(String(localStorage.getItem('TASKS_FOR_SCENE')));
    const users = JSON.parse(String(localStorage.getItem('USERS_LIST')));
    const pipeline_process = JSON.parse(String(localStorage.getItem('PIPELINE_PROCESS')));
    const res: any = [];

    for (const proc in pipeline_process) {
        const task = tasks.filter((element: any) => element.process === pipeline_process[proc]?.name);
        var user = [];
        if (task.length > 0) { user = users.filter((element: any) => element.code === task[0]?.assigned) };
        res.push({
            process: pipeline_process[proc]?.label !== undefined ? pipeline_process[proc]?.label : pipeline_process[proc]?.name,
            color: pipeline_process[proc]?.color,
            proc_user: user.length > 0 ? user[0].display_name : '',
            user_login: user.length > 0 ? user[0].login : null,
            user_avatar: user.length > 0 ? user[0].image : null,
        });
        user = [];
    };
    const result:any=[];
    for (const item in res) {
        if (res[item]?.proc_user!=='') {
            result.push(res[item])
        }
    }
    return result;
};

type UsersList = {
    users: any[];
}

const UsersInfo: React.FC<UsersList> = (userList)=>{
    console.log("🚀 ~ file: show_scenes.tsx:221 ~ users:", userList.users);
    return (
        <>
            {userList.users.map(
                (data: any) => 
                    <UsersInfoText
                        avatar={data.user_avatar}
                        process={{name: data.process, color: data.color}}
                        name={data.proc_user}
                        login={data.user_login}
                    />
            )}
        </>
    )
}

export const SceneShow: React.FC<IResourceComponentsProps> = () => {

    const { goBack } = useNavigation();
    const t = useTranslate();

    const {
        queryResult: { data, isLoading },
    } = useShow<IScenes>();
    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
            <CircularProgress />
        </Box>
    } else {
    const scene = data?.data;
    // const { show } = useNavigation();
    return ( 
        <Grid container spacing={2}>
            {/* <Grid item width="100%">
                <Paper>
                    <Typography variant="subtitle1"> {scene?.name} </Typography>
                </Paper>
            </Grid> */}
            <Grid item xs={12} lg={2}>
                <Stack>
                    <Paper sx={{ p: 1, justifyContent: "start"}}>
                        <Stack alignItems="center" spacing={2} >
                            <Avatar
                                src={scene?.image.url}
                                sx={{ width: 120, height: 120 }}
                            />
                            <Typography variant="h6">
                                {scene?.name}
                            </Typography>
                        </Stack>
                        <ScriptDialog script={scene?.script} />
                        <Divider flexItem sx={{ borderColor: "text.secondary", margin: "10px 20% 10px 20%" }} />
                        <Stack spacing={1}>
                            <SceneInfoText
                                icon={<DescriptionRoundedIcon />}
                                text={scene?.description}
                            />
                            <SceneInfoText
                                icon={<KeyRoundedIcon />}
                                text={scene?.keywords}
                            />
                            <UsersInfo users={getProcessUsers() || []} />
                        </Stack>
                    </Paper>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={10}>
                <Stack direction="column" spacing={2} >
                    <Stack direction="row" width="100%">
                    <Paper sx={{width: "100%" }}>
                        <Breadcrumb breadcrumbProps={{ sx: { padding: "5px" } }} />
                    </Paper>
                    </Stack>
                    <Reviews 
                        scene_code={scene?.code} 
                        assets={scene?.assets} 
                        scene_pipeline_code={scene?.pipeline_code}
                        script={scene?.script}
                    />
                </Stack>
            </Grid>
        </Grid>
    );
    }
};

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

type ScriptText = {
    script: string | undefined,
}

function ScriptDialog(script:ScriptText) {
    
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Stack 
            id='Script-form'
            sx={{ display: script.script === null ? "none" : "flex" }}
        >
            <Button 
                variant="text"
                sx={{width: "50%", alignSelf: "center"}}
                startIcon={<SimpleScript />} 
                onClick={handleClickOpen}
            >
            Script
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar sx={{ position: 'relative' }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                    <DialogContent>
                        <object width={'100%'} height={'100%'} data={script.script}>
                        </object>
                    </DialogContent>    
            </Dialog>
        </Stack>
    );
}
