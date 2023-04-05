import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
// import Button from '@mui/material/Button';
import {
    CrudFilters,
    // CrudFilter,
    // LogicalFilter,
    getDefaultFilter,
    useList,
    useTranslate,

} from "@pankod/refine-core";
import {
    Stack,
    Grid,
    Typography,
    InputAdornment,
    TextField,
    IconButton,
    Divider,
    // useAutocomplete,
} from "@pankod/refine-mui";

import { IDuration, IPipeline } from "../../interfaces";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearIcon from '@mui/icons-material/Clear';
import React from "react";


const saveFiltersToLocalStorage = (
    searchFilter?: string,
    filterCategories?: string[],
    filterTaskProcess?: string[],
    filterTaskStatus?: string[],
    filters?: CrudFilters,
) => {
    localStorage.setItem('searchFilter', JSON.stringify(searchFilter));
    localStorage.setItem('filterCategories', JSON.stringify(filterCategories));
    localStorage.setItem('filterTaskProcess', JSON.stringify(filterTaskProcess));
    localStorage.setItem('filterTaskStatus', JSON.stringify(filterTaskStatus));
    localStorage.setItem('filters', JSON.stringify(filters));
};

const loadFiltersFromLocalStorage = (
) => {
    return [
        JSON.parse(String(localStorage.getItem('searchFilter'))),
        JSON.parse(String(localStorage.getItem('filterCategories'))),
        JSON.parse(String(localStorage.getItem('filterTaskProcess'))),
        JSON.parse(String(localStorage.getItem('filterTaskStatus'))),
        JSON.parse(String(localStorage.getItem('filters')))
    ]
};

type ScenesItemProps = {
    setFilters: (filters: CrudFilters) => void;
    filters: CrudFilters;
};

export const CategoryFilter: React.FC<ScenesItemProps> = ({
    setFilters,
    filters,
}) => {

    const t = useTranslate();

    const [ searchFilter, setSearchFilter ] = useState<string>(
        getDefaultFilter("name|keywords|description", filters, "contains") ?? ""
    );

    const [durationFilter, setDurationFilter] = useState<string[]>(
        getDefaultFilter("duration|AND", filters, "in") ?? [],
    );

    const [taskProcessFilter, setTaskProcessFilter] = useState<string[]>(
        getDefaultFilter("PROC", filters, "in") ?? [],
    );

    const [taskStatusFilter, setTaskStatusFilter] = useState<string[]>(
        getDefaultFilter("STAT", filters, "in") ?? [],
    );

    const { data: durations, isLoading } = useList<IDuration>({
        resource: "durations",
    });

    const { data: pipelines, isLoading: processLoading } = useList<IPipeline>({
        resource: "pipes",
        config: {
            filters: [{
                field: "code",
                operator: "in",
                value: ['dolly3d/scenes']
            }]
        }
    })

    var sub_filter_value = ['dolly3d_render', 'dolly3d/light', 'dolly3d/publish'];
    const { data: taskStatus, isLoading: taskStatusLoading } = useList({
        resource: "pipes",
        config: {
            hasPagination: false,
            filters: [{
                field: "code",
                operator: "in",
                value: sub_filter_value
            }]
        },
        queryOptions: {
            enabled: sub_filter_value !== undefined ? true : false
        }
    })
    var statuses = taskStatus?.data || [];
    statuses = statuses.filter((elem:any, index:any, self:any) => self.findIndex((el:any) => el.name === elem.name) === index)

    useEffect(()=>{
        const loadFilters = loadFiltersFromLocalStorage();
        setSearchFilter(loadFilters[0] !== null ? loadFilters[0] : '');
        setDurationFilter(loadFilters[1] !== null ? loadFilters[1] : []);
        setTaskProcessFilter(loadFilters[2] !== null ? loadFilters[2] : []);
        setTaskStatusFilter(loadFilters[3] !== null ? loadFilters[3] : []);
        setFilters(loadFilters[4] !== null ? loadFilters[4] : []);
    },[]);

    useEffect(() => {
        let filter: CrudFilters;
        let values: string[];
        switch (true){
            case taskStatusFilter.length > 0 && taskProcessFilter.length > 0 && durationFilter.length > 0:
                values = taskProcessFilter.concat('|', taskStatusFilter, '|', durationFilter);
                filter = [{
                    field: "PROC$STAT$duration|AND",
                    operator: "in",
                    value: values.length > 0 ? values : undefined,
                }];
                break;
            case taskProcessFilter.length > 0 && durationFilter.length > 0 && taskStatusFilter.length === 0:
                values = taskProcessFilter.concat('|', durationFilter);
                filter = [{
                    field: 'PROC$duration|AND',
                    operator: "in",
                    value: values.length > 0 ? values : undefined,
                }];
                break;
            case taskStatusFilter.length > 0 && durationFilter.length > 0 && taskProcessFilter.length === 0:
                values = taskStatusFilter.concat('|', durationFilter);
                filter = [{
                    field: 'STAT$duration|AND',
                    operator: "in",
                    value: values.length > 0 ? values : undefined,
                }]
                break;
            case taskProcessFilter.length > 0 && taskStatusFilter.length > 0 && durationFilter.length === 0:
                values = taskProcessFilter.concat('|', taskStatusFilter);
                filter = [{
                    field: 'PROC$STAT',
                    operator: "in",
                    value: values.length > 0 ? values : undefined,
                }]
                break;
            case taskProcessFilter.length > 0 && taskStatusFilter.length === 0 && durationFilter.length === 0:
                filter = [{
                    field: 'PROC',
                    operator: "in",
                    value: taskProcessFilter.length > 0 ? taskProcessFilter : undefined,
                }]
                break;
            case taskProcessFilter.length === 0 && taskStatusFilter.length > 0 && durationFilter.length === 0:
                filter = [{
                    field: 'STAT',
                    operator: "in",
                    value: taskStatusFilter.length > 0 ? taskStatusFilter : undefined,
                }];
                break;
            case taskProcessFilter.length === 0 && taskStatusFilter.length === 0 && durationFilter.length > 0:
                filter = [{
                    field: "duration|AND",
                    operator: "in",
                    value: durationFilter.length > 0 ? durationFilter : undefined,
                }]
                break;
            default: 
                filter = [];
                break;
        };
        if (searchFilter !== ""){
            filter.unshift({
                field: "name|keywords|description",
                operator: "contains",
                value: searchFilter.length > 0 ? searchFilter : undefined,
            })
        }
      
        saveFiltersToLocalStorage(searchFilter, durationFilter, taskProcessFilter, taskStatusFilter, filter);

        setFilters?.(filter)
    }, [durationFilter, taskProcessFilter, taskStatusFilter, searchFilter]);
    
    const toggleSearchFilter = (inputValue: string) => {
        setSearchFilter(inputValue);
    };

    const toggleFilterCategory = (clickedDuration: string) => {
        const target = durationFilter.findIndex(
            (duration) => duration === clickedDuration,
        );

        if (target < 0) {
            setDurationFilter((prevDuration) => {
                return [...prevDuration, clickedDuration];
            });
        } else {
            const copyDurationFilter = [...durationFilter];

            copyDurationFilter.splice(target, 1);

            setDurationFilter(copyDurationFilter);
        }
    };

    const toggleFilterTaskProcess = (clickedName: string, task_pipeline: string) => {

        const target = taskProcessFilter.findIndex(
            (names) => names === clickedName,
        );

        if (target < 0) {

            // setFilterPipeline((prevPipe) => { return [...prevPipe, task_pipeline]; });
            setTaskProcessFilter((prevNames) => { return [...prevNames, clickedName]; });
        } else {

            // const copyFilterPipe = [...filterPipeline];
            // copyFilterPipe.splice(target, 1);
            // setFilterPipeline(copyFilterPipe);

            const copyFilterNames = [...taskProcessFilter];

            copyFilterNames.splice(target, 1);

            setTaskProcessFilter(copyFilterNames);
        };
    };

    const toggleFilterTaskStatus = (clickedName: string) => {
        const target = taskStatusFilter.findIndex(
            (names) => names === clickedName,
        );

        if (target < 0) {
            setTaskStatusFilter((prevNames) => {
                return [...prevNames, clickedName];
            });
        } else {
            const copyFilterTaskStatus = [...taskStatusFilter];

            copyFilterTaskStatus.splice(target, 1);

            setTaskStatusFilter(copyFilterTaskStatus);
        };
    };


    return (
        <>
            <TextField
                sx={{
                    ml: 0,
                    flex: 0,
                    width: "100%",
                }}
                size="small"
                id="searchText"
                placeholder={t("scenes.scenesSearch")}
                value={searchFilter}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => toggleSearchFilter(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchOutlinedIcon />
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={()=> setSearchFilter('')} >
                                <ClearIcon fontSize="small"/>
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />     
            <Divider sx={{height: "20px"}} />                           
            <Typography variant="subtitle1">
                {"DURATION"}
            </Typography>
            <Stack>
                <Grid container columns={6} marginTop="10px">
                    <Grid item p={0.5}>
                        <LoadingButton
                            color="warning"
                            onClick={() => setDurationFilter([])}
                            variant={
                                durationFilter.length === 0
                                    ? "contained"
                                    : "outlined"
                            }
                            size="small"
                            loading={isLoading}
                            sx={{
                                borderRadius: "50px",
                                color: "warning"
                            }}
                        >
                            {t("actions.all")}
                        </LoadingButton>
                    </Grid>
                        {durations?.data.map((duration: IDuration) => { 

                        return(
                            <Grid item key={duration.duration} p={0.5}>
                            <LoadingButton
                                color="warning"
                                variant={
                                    durationFilter.includes(
                                        duration.duration.toString(),
                                    )
                                        ? "contained"
                                        : "outlined"
                                }
                                size="small"
                                loading={isLoading}
                                sx={{
                                    borderRadius: "50px",
                                    color: "warning"
                                }}
                                onClick={() =>
                                    toggleFilterCategory(duration.duration.toString())
                                }
                            >
                                    {duration.duration}
                            </LoadingButton>
                        </Grid>
                    )})}
                </Grid>
            </Stack>
            <br></br>
            <Typography variant="subtitle1">
                {"TASK PROCESS"}
            </Typography>
            <Stack>
                <Grid container columns={6} marginTop="10px">
                    <Grid item p={0.5}>
                        <LoadingButton
                            onClick={() => setTaskProcessFilter([])}
                            color="info"
                            variant={
                                taskProcessFilter.length === 0
                                    ? "contained"
                                    : "outlined"
                            }
                            size="small"
                            loading={isLoading}
                            sx={{
                                borderRadius: "50px",
                                color: "info"
                            }}
                        >
                            {t("actions.all")}
                        </LoadingButton>
                    </Grid>
                    {pipelines?.data.map((pipeline: IPipeline) => (
                        <Grid item key={pipeline.name} p={0.5}>
                            <LoadingButton
                                variant={
                                    taskProcessFilter.includes(
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
            <Typography variant="subtitle1">
                {"TASK STATUS"}
            </Typography>
            <Stack>
                <Grid container columns={6} marginTop="10px">
                    <Grid item p={0.5}>
                        <LoadingButton
                            onClick={() => setTaskStatusFilter([])}
                            variant={
                                taskStatusFilter.length === 0
                                    ? "contained"
                                    : "outlined"
                            }
                            size="small"
                            loading={isLoading}
                            sx={{
                                borderRadius: "50px",
                            }}
                        >
                            {t("actions.all")}
                        </LoadingButton>
                    </Grid>
                    {statuses.map((pipeline) => (
                        <Grid item key={pipeline.name} p={0.5}>
                            <LoadingButton
                                variant={
                                    taskStatusFilter.includes(
                                        pipeline.name,
                                    )
                                        ? "contained"
                                        : "outlined"
                                }
                                size="small"
                                loading={taskStatusLoading}
                                sx={{
                                    borderRadius: "50px",
                                }}
                                onClick={() =>
                                    toggleFilterTaskStatus(String(pipeline.name))
                                }
                            >
                                {pipeline.hasOwnProperty('label') ? pipeline.label : pipeline.name}
                            </LoadingButton>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </>
    );
};