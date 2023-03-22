import React from "react";
import axios from "axios";
import { useTranslate, HttpError } from "@pankod/refine-core"; // useApiUrl,
import {
    Controller,
    UseModalFormReturnType,
} from "@pankod/refine-react-hook-form";
import {
    Drawer,
    Input,
    Typography,
    FormLabel,
    Stack,
    Box,
    Avatar,
    // Button,
    IconButton,
    FormControl,
    Autocomplete,
    OutlinedInput,
    FormHelperText,
    Create,
    useAutocomplete,
    TextField,
} from "@pankod/refine-mui";

import { 
    CloseRounded, 
    // PhotoCamera 
} from "@mui/icons-material";

import { IDuration, IPipeline, IScenes } from "../../interfaces";

// import TACTIC from "../../tactic/Tactic";

// Asset creation form
export const CreateScene: React.FC<
    UseModalFormReturnType<IScenes, HttpError, IScenes>
> = ({
    watch,
    setValue,
    register,
    formState: { errors },
    control,
    refineCore: { onFinish },
    handleSubmit,
    modal: { visible, close },
    saveButtonProps,
}) => {

        const t = useTranslate(); // Using language switching on the page
        
        // a variable to fill the combo box with data from the assets_category table
        const { autocompleteProps: durationsProps } = useAutocomplete<IDuration, HttpError>({
            resource: "durations",
        });
        
        const { autocompleteProps: pipelinesProps } = useAutocomplete<IPipeline, HttpError>({
            resource: "sthpw/pipeline",
            filters:[{
                field: "search_type",
                operator: "eq",
                value: "complex/scenes",
            }]
        });
        
        // const imageInput = watch("image");
        // image selection handler
        const onChangeHandler = async (
            event: React.ChangeEvent<HTMLInputElement>,
        ) => {
            const formData = new FormData();
            const target = event.target;
            const file: File = (target.files as FileList)[0];

            formData.append("file", file);
            // file upload
            const res = await axios.post<{ url: string }>(
                "/tactic/default/UploadServer/",
                formData,
                {
                    withCredentials: false,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                },
            );
            
            const file_path = String(res.data).split("=")[1];            
            const imagePaylod: any = 
                {
                    name: file_path.split("/").at(-1),
                    url: file_path,
                }
            ;
            // setting a new image value
            setValue("image", imagePaylod, { shouldValidate: true });
        };

        return (
            <Drawer
                sx={{ zIndex: "1301" }}
                PaperProps={{ sx: { width: { sm: "100%", md: 500 } } }}
                open={visible}
                onClose={close}
                anchor="right"
            >
                <Create
                    // Save button
                    saveButtonProps={saveButtonProps}
                    title={<Typography variant="h5" >{t("scenes.create")}</Typography>}
                    // The title of the "Create" window
                    headerProps={{
                        // Close Button
                        avatar: (
                            <IconButton
                                onClick={() => close()}
                                sx={{ width: "30px", height: "30px", mb: "5px", }}
                            >
                                <CloseRounded />
                            </IconButton>
                        ),
                        action: null,
                    }}
                    wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
                >
                    <Stack>
                        <Box
                            paddingX="50px"
                            justifyContent="center"
                            alignItems="center"
                            sx={{
                                paddingX: {
                                    xs: 1,
                                    md: 6,
                                },
                            }}
                        >
                            <form onSubmit={handleSubmit(onFinish)}>
                                <FormControl sx={{ width: "100%" }}>
                                    <FormLabel>
                                        {t("scenes.fields.image.label")}
                                    </FormLabel>
                                    <Stack
                                        display="flex"
                                        alignItems="center"
                                        border="1px dashed  "
                                        borderColor="primary.main"
                                        borderRadius="5px"
                                        padding="10px"
                                        marginTop="5px"
                                    >
                                        <Typography
                                            variant="body2"
                                            style={{
                                                fontWeight: 800,
                                                marginTop: "8px",
                                            }}
                                        >
                                            {t("scenes.fields.image.description")}
                                        </Typography>
                                        <label htmlFor="images-input">
                                            <Input
                                                id="images-input"
                                                type="file"
                                                sx={{
                                                    display: "none",
                                                }}
                                                onChange={onChangeHandler}
                                            />
                                            <input
                                                id="file"
                                                {...register("image")}
                                                type="hidden"
                                            />
                                            <Avatar
                                                sx={{
                                                    cursor: "pointer",
                                                    width: { xs: 48, md: 48, },
                                                    height: { xs: 48, md: 48, },
                                                }}
                                                src={''}
                                                alt="imageInput.name"
                                            />
                                        </label>
                                    </Stack>
                                </FormControl>

                                {/* Scene name */}
                                <Stack gap="10px" marginTop="10px">
                                    <FormControl>
                                        <FormLabel required>
                                            {t("scenes.fields.name")}
                                        </FormLabel>
                                        <OutlinedInput
                                            id="name"
                                            {...register("name", {
                                                required: t(
                                                    "errors.required.field",
                                                    { field: t("scenes.fields.name") },
                                                ),
                                            })}
                                            style={{ height: "40px" }}
                                        />
                                        {errors.name && (
                                            <FormHelperText error>
                                                {errors.name.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                    {/* Scene Pipeline */}
                                    <FormControl required>
                                        <Controller
                                            control={control}
                                            name="pipeline_code"
                                            rules={{ required: t("errors.required.field", { field: "Pipeline" },), }}
                                            defaultValue={null as any}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    disablePortal
                                                    {...pipelinesProps}
                                                    // {...field}
                                                    onChange={(_, value) => {
                                                        field.onChange(value?.code);
                                                    }}

                                                    getOptionLabel={(item) => item.name}

                                                    isOptionEqualToValue={(
                                                        option,
                                                        value,
                                                    ) =>
                                                        value === undefined ||
                                                        option.name ===
                                                        value.toString()
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            {...field}
                                                            label={t("scenes.fields.pipeline")}
                                                            variant="outlined"
                                                            error={
                                                                !!errors.duration?.message
                                                            }
                                                            required
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        {errors.duration && (
                                            <FormHelperText error>
                                                {errors.duration.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                    {/* Scene description */}
                                    <FormControl>
                                        <FormLabel>
                                            {t("scenes.fields.description")}
                                        </FormLabel>
                                        <OutlinedInput
                                            id="description"
                                            {...register("description")}
                                            multiline
                                            minRows={2}
                                            maxRows={2}
                                        />
                                        {errors.description && (
                                            <FormHelperText error>
                                                {errors.description.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                    {/* Scene keywords */}
                                    <FormControl>
                                        <FormLabel>
                                            {t("scenes.fields.keywords")}
                                        </FormLabel>
                                        <OutlinedInput
                                            id="keywords"
                                            {...register("keywords")}
                                            multiline
                                            minRows={2}
                                            maxRows={2}
                                        />
                                        {errors.keywords && (
                                            <FormHelperText error>
                                                {errors.keywords.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                    {/* Scene script */}
                                    <FormControl>
                                        <FormLabel>
                                            {t("scenes.fields.script")}
                                        </FormLabel>
                                        <OutlinedInput
                                            size="small"
                                            id="script"
                                            {...register("script")}
                                        />
                                        {errors.script && (
                                            <FormHelperText error>
                                                {errors.script.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                    {/* Scene Duration */}
                                    <FormControl required>
                                        <Controller
                                            control={control}
                                            name="duration"
                                            rules={{ required: t("errors.required.field", { field: "Duration" },), }}
                                            defaultValue={null as any}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    disablePortal
                                                    {...durationsProps}
                                                    // {...field}
                                                    onChange={(_, value) => {
                                                        field.onChange(value?.duration);
                                                    }}

                                                    getOptionLabel={(item) => item.duration}
                                                    
                                                    isOptionEqualToValue={(
                                                        option,
                                                        value,
                                                    ) =>
                                                        value === undefined ||
                                                        option.duration ===
                                                        value.toString()
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            {...field}
                                                            label={t("scenes.fields.duration")}
                                                            variant="outlined"
                                                            error={
                                                                !!errors.duration?.message
                                                            }
                                                            required
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                        {errors.duration && (
                                            <FormHelperText error>
                                                {errors.duration.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                    {/* Scene Storyboard */}
                                    <FormControl>
                                        <Autocomplete
                                            disablePortal
                                            id="combo-box-storyboard"
                                            options={['(With Storyboard)', '(No Storyboard)']}
                                            defaultValue='(No Storyboard)'
                                            renderInput={(params) => <TextField {...params} label={t("scenes.fields.storyboard")} />}
                                        />
                                        {errors.script && (
                                            <FormHelperText error>
                                                {errors.script.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>

                                </Stack>
                            </form>
                        </Box>
                    </Stack>
                </Create>
            </Drawer>
        );
    };