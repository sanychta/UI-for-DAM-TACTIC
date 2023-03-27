import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import {
    CrudFilters,
    getDefaultFilter,
    useList,
    useTranslate,

} from "@pankod/refine-core";
import {
    Stack,
    Grid,
    Typography,
    // InputAdornment,
    TextField,
    // IconButton,
    // Divider,
    Box,
    // Autocomplete,
    // useAutocomplete,
} from "@pankod/refine-mui";

import Autocomplete from '@mui/material/Autocomplete';
import { IPipeline } from "../../interfaces";
// import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
// import ClearIcon from '@mui/icons-material/Clear';
import React from "react";


const saveFiltersToLocalStorage = (
    filterTaskProcess?: string[],
    filterUsers?: string[],
) => {
    localStorage.setItem('TaskfilterTaskProcesses', JSON.stringify(filterTaskProcess));
    localStorage.setItem('TaskfilterUsers', JSON.stringify(filterUsers));
};

const loadFiltersFromLocalStorage = (
) => {
    return [
        JSON.parse(String(localStorage.getItem('TaskfilterTaskProcesses'))),
        JSON.parse(String(localStorage.getItem('TaskfilterUsers'))),
    ]
};

type ScenesItemProps = {
    setFilters: (filters: CrudFilters) => void;
    filters: CrudFilters;
};

const getPipelineProcess = (pipelinelist: IPipeline[] | undefined) =>{
    let result: any[] = [];
    if (pipelinelist !== undefined)
        result = pipelinelist.map((value) => { 
            if (value.hasOwnProperty('process_code')) 
                return value;
        } );
    result = result.filter((elem: any, index: any, self: any) => elem !== undefined)
    return result;
};

const SaveAllPipelineProcess = (process: any) => {
    localStorage.setItem('ALL_PIPELINE_PROCESSES', JSON.stringify(process))
};

export const TasksFilter: React.FC<ScenesItemProps> = ({
    setFilters,
    filters,
}) => {
    
    const t = useTranslate();
    const users_list = JSON.parse(String(localStorage.getItem('USERS_LIST')));
    
    const [filterTaskProcess, setFilterTaskProcess] = useState<string[]>(
        getDefaultFilter("process", filters, "in") ?? [],
    );

    const [filterUsers, setFilterUsers] = useState<string[]>(
        getDefaultFilter("assigned", filters, "in") ?? [],
    );

    // const [filterTaskStatus, setFilterTaskStatus] = useState<string[]>(
    //     getDefaultFilter("STAT", filters, "in") ?? [],
    // );

    const { data: pipelines, isLoading: processLoading } = useList<IPipeline>({
        resource: "pipes",
        config: {
            filters: [{
                field: "code",
                operator: "in",
                value: ['dolly3d/scenes', 'dolly3d/dialog', 'dolly3d/shorts', 'dolly3d/songs', 'complex/shot', 'dolly3d/assets']
            }]
        }
    })
    var processes = getPipelineProcess(pipelines?.data) || [];
    processes = processes.filter((elem: any, index: any, self: any) => self.findIndex((el: any) => el.name === elem.name) === index)
    SaveAllPipelineProcess(processes);

    // var sub_filter_value = ['dolly3d_render', 'dolly3d/light', 'dolly3d/publish'];
    // const [filterPipeline, setFilterPipeline] = useState<string[]>(
    //     getDefaultFilter("code", filters, "in") ?? sub_filter_value,
    // );

    // const { data: taskStatus, isLoading: taskStatusLoading } = useList({
    //     resource: "pipes",
    //     config: {
    //         hasPagination: false,
    //         filters: [{
    //             field: "code",
    //             operator: "in",
    //             value: sub_filter_value
    //         }]
    //     },
    //     queryOptions: {
    //         enabled: sub_filter_value !== undefined ? true : false
    //     }
    // })
    // var statuses = taskStatus?.data || [];
    // statuses = statuses.filter((elem: any, index: any, self: any) => self.findIndex((el: any) => el.name === elem.name) === index)
    // console.log("🚀 ~ file: taskfilters.tsx:108 ~ statuses:", statuses);

    useEffect(() => {
        const loadFilters = loadFiltersFromLocalStorage();
        setFilterTaskProcess(loadFilters[0] !== null ? loadFilters[0] : []);
        setFilterUsers(loadFilters[1] !== null ? loadFilters[1] : []);

    }, []);

    const getDefValue = (elem:any) => {
        let user = users_list.filter((element: any) => element.code === elem);
        if (user.length > 0) {
            user = user[0];
            return user.display_name;
        } else 
            return ''
    }

    useEffect(() => {
        var filter: CrudFilters;

    if (filterTaskProcess.length > 0 ) {
            filter = [{
                field: 'process|AND',
                operator: "in",
                value: filterTaskProcess.length > 0 ? filterTaskProcess : undefined,
            }]
        } else 
            filter = [];
    if (filterUsers.length > 0) {
        filter.push({
            field: 'assigned|AND',
            operator: "in",
            value: filterUsers.length > 0 ? filterUsers : undefined,
        })
    };

        saveFiltersToLocalStorage(filterTaskProcess, filterUsers);
        
        setFilters?.(filter)
    }, [filterTaskProcess, filterUsers]);

    const toggleFilterTaskProcess = (clickedName: string, task_pipeline: string) => {

        const target = filterTaskProcess.findIndex(
            (names) => names === clickedName,
        );

        if (target < 0) {

            setFilterTaskProcess((prevNames) => { return [...prevNames, clickedName]; });
        } else {

            const copyFilterNames = [...filterTaskProcess];

            copyFilterNames.splice(target, 1);

            setFilterTaskProcess(copyFilterNames);
        };

    };

    // const toggleFilterTaskStatus = (clickedName: string) => {
    //     const target = filterTaskStatus.findIndex(
    //         (names) => names === clickedName,
    //     );

    //     if (target < 0) {
    //         setFilterTaskStatus((prevNames) => {
    //             return [...prevNames, clickedName];
    //         });
    //     } else {
    //         const copyFilterTaskStatus = [...filterTaskStatus];

    //         copyFilterTaskStatus.splice(target, 1);

    //         setFilterTaskStatus(copyFilterTaskStatus);
    //     };
    // };


    return (
        <>
            <Typography variant="subtitle1">
                {"TASK PROCESS"}
            </Typography>
            <Stack>
                <Grid container columns={6} marginTop="10px">
                    <Grid item p={0.5}>
                        <LoadingButton
                            onClick={() => setFilterTaskProcess([])}
                            color="info"
                            variant={
                                filterTaskProcess.length === 0
                                    ? "contained"
                                    : "outlined"
                            }
                            size="small"
                            loading={processLoading}
                            sx={{
                                borderRadius: "50px",
                                color: "info"
                            }}
                        >
                            {t("actions.all")}
                        </LoadingButton>
                    </Grid>
                    {processes?.map((pipeline: IPipeline) => (
                        <Grid item key={pipeline.name} p={0.5}>
                            <LoadingButton
                                variant={
                                    filterTaskProcess.includes(
                                        pipeline?.name.toString(),
                                    )
                                        ? "contained"
                                        : "outlined"
                                }
                                size="small"
                                color="info"
                                loading={processLoading}
                                sx={{
                                    borderRadius: "50px",
                                    color: "info"
                                }}
                                onClick={() =>
                                    toggleFilterTaskProcess(pipeline.name.toString(), String(pipeline.task_pipeline))
                                }
                            >
                                {pipeline.hasOwnProperty('label') ? pipeline.label : pipeline.name}
                            </LoadingButton>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
            <br></br>
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                borderRadius: 1,
                padding: '2px'
            }}>
                <Autocomplete
                    size="small"
                    fullWidth
                    value={getDefValue(filterUsers.length > 0 ? filterUsers[0] : '')}
                    options={users_list !== undefined ? users_list.map((option: any) => { if (option !== undefined) { return option.display_name } }) : ['No items']}
                    renderInput={(params) =>
                        <TextField {...params} variant='outlined' label='<User>' />
                    }
                    onChange={(event: any, newValue: string | null, reason, details) => {
                        if (newValue !== null){
                            let f_res = users_list.filter((element: any) => element.display_name === newValue)[0];
                            setFilterUsers([f_res.code]);
                        } else {
                            setFilterUsers([]);
                        }
                    }}
                />
            </Box>
        </>
    );
};