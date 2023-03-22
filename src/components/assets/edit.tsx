import React from "react";
import axios from "axios";

import { 
    useTranslate, 
    // useApiUrl, 
    HttpError, 
    // useList,
    // useTable, 
    // CrudFilters, 
} from "@pankod/refine-core";

import {
    Controller,
    UseModalFormReturnType,
} from "@pankod/refine-react-hook-form";

import {
    Drawer,
    Input,
    TextField,
    Avatar,
    Typography,
    FormLabel,
    Stack,
    Box,
    IconButton,
    FormControl,
    useAutocomplete,
    OutlinedInput,
    FormHelperText,
    Autocomplete,
    Edit,
    // getValue,
} from "@pankod/refine-mui";
import CloseIcon from "@mui/icons-material/Close";

import { IAssets, IAssetsCategory } from "../../interfaces";

import TACTIC from "../../tactic/Tactic";

// import { FileDownload } from "@mui/icons-material";

export const EditAsset: React.FC<
    UseModalFormReturnType<IAssets, HttpError, IAssets>
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
    getValues,
}) => {
    const t = useTranslate();

    // const apiUrl = useApiUrl();

    const { autocompleteProps } = useAutocomplete<IAssetsCategory>({
        resource: "categories",
    });

    const imageInput = watch("image");

    const onChangeHandler = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const formData = new FormData();
        
        const target = event.target;
        
        const file: File = (target.files as FileList)[0];

        formData.append("file", file);

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
        
        const kwargs = {
            data: {
                file_path: file_path,
                search_type: 'assets',
                code: `${control._formValues["code"]}`,
            }
        };
        const result = await new TACTIC().request("execute_cmd", ["refinejs.query_classes.CheckUploadedFile", kwargs], null);

        const imagePaylod: any = [
            {
                name: result.info.name,
                url: result.info.url,
            },
        ];

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
            <Edit
                saveButtonProps={saveButtonProps}
                headerProps={{
                    avatar: (
                        <IconButton
                            onClick={() => close()}
                            sx={{ width: "30px", height: "30px", mb: "5px" }}
                        >
                            <CloseIcon />
                        </IconButton>
                    ),
                    action: null,
                }}
                wrapperProps={{ sx: { overflowY: "scroll", height: "100vh" } }}
            >
                <Stack>
                    <Box
                        justifyContent="center"
                        alignItems="center"
                        marginBottom="50px"
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
                                    {t("assets.fields.image.label")}
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
                                                width: {
                                                    xs: 100,
                                                    md: 180,
                                                },
                                                height: {
                                                    xs: 100,
                                                    md: 180,
                                                },
                                            }}
                                            src={ imageInput && imageInput.url }
                                            alt={String(imageInput?.url)}
                                        />
                                    </label>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 800,
                                            marginTop: "8px",
                                        }}
                                    >
                                        {t("assets.fields.image.description",)}
                                    </Typography>
                                </Stack>
                                {errors.image && (
                                    <FormHelperText error>
                                        {errors.image.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Stack gap="10px" marginTop="10px">
                                <FormControl>
                                    <FormLabel required>
                                        {t("assets.fields.name")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="name"
                                        {...register("name", {
                                            required: t("errors.required.field",{ field: "Name" },),
                                        })}
                                        style={{ height: "40px" }}
                                    />
                                    {errors.name && (
                                        <FormHelperText error>
                                            {errors.name.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>
                                        {t("assets.fields.description")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="description"
                                        {...register("description")}
                                        multiline
                                        minRows={3}
                                        maxRows={3}
                                    />
                                    {errors.description && (
                                        <FormHelperText error>
                                            {errors.description.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>
                                        {t("assets.fields.keywords")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="keywords"
                                        {...register("keywords")}
                                        multiline
                                        minRows={3}
                                        maxRows={3}
                                    />
                                    {errors.keywords && (
                                        <FormHelperText error>
                                            {errors.keywords.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl sx={{ marginTop: "10px" }}>
                                    <Controller
                                        control={control}
                                        name="assets_category"
                                        rules={{required: t("errors.required.field",{ field: "Category" },),}}
                                        defaultValue={null as any}
                                        render={({ field }) => (
                                            <Autocomplete
                                                disablePortal
                                                {...autocompleteProps}
                                                {...field}
                                                onChange={(_, value) => {
                                                    field.onChange(value);
                                                }}
                                                getOptionLabel={(item) => {
                                                    return item.name
                                                        ? item.name
                                                        : autocompleteProps?.options?.find(
                                                              (p) =>
                                                                p.id.toString() ===
                                                                item.toString(),
                                                          )?.name ?? "";
                                                }}
                                                isOptionEqualToValue={(
                                                    option,
                                                    value,
                                                ) =>
                                                    value === undefined ||
                                                    option.id.toString() ===
                                                    value.toString()
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Assets Category"
                                                        variant="outlined"
                                                        error={
                                                            !!errors.assets_category?.message
                                                        }
                                                        required
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                    {errors.assets_category_code && (
                                        <FormHelperText error>
                                            {errors.assets_category_code.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Edit>
        </Drawer>
    );
};
