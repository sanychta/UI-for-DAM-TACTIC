import React from "react";
import axios from "axios";

import { 
    useTranslate, 
    HttpError 
} from "@pankod/refine-core";

import {
    UseModalFormReturnType,
} from "@pankod/refine-react-hook-form";

import {
    Drawer,
    Input,
    Avatar,
    Typography,
    FormLabel,
    Stack,
    Box,
    IconButton,
    FormControl,
    OutlinedInput,
    FormHelperText,
    Create,
} from "@pankod/refine-mui";
import CloseIcon from "@mui/icons-material/Close";

import { IAssetsCategory } from "../../interfaces";

export const CreateCategoryAsset: React.FC<
    UseModalFormReturnType<IAssetsCategory, HttpError, IAssetsCategory>
> = ({
    watch,
    setValue,
    register,
    formState: { errors },
    // control,
    refineCore: { onFinish },
    handleSubmit,
    modal: { visible, close },
    saveButtonProps,
    // getValues,
}) => {
    const t = useTranslate();

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

        const { name, size, type, lastModified } = file;

        const imagePaylod: any = [
            {
                name,
                size,
                type,
                lastModified,
                url: res.data.url,
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
            <Create
                saveButtonProps={saveButtonProps}
                headerProps={{
                    title: t("categories.buttons.create"),
                    titleTypographyProps: { variant: "h5" },
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
                                    {t("categories.fields.image.label")}
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
                                            src={
                                                imageInput && imageInput.url
                                            }
                                            alt="Image"
                                        />
                                    </label>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 800,
                                            marginTop: "8px",
                                        }}
                                    >
                                        {t(
                                            "categories.fields.image.description",
                                        )}
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
                                        {t("categories.fields.name")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="name"
                                        {...register("name", {
                                            required: t(
                                                "errors.required.field",
                                                { field: "Name" },
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
                                <FormControl>
                                    <FormLabel>
                                        {t("categories.fields.description")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="description"
                                        {...register("description")}
                                        multiline
                                        minRows={5}
                                        maxRows={5}
                                    />
                                    {errors.description && (
                                        <FormHelperText error>
                                            {errors.description.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl sx={{ marginTop: "10px" }}>
                                    <FormLabel>
                                        {t("categories.fields.code")}
                                    </FormLabel>
                                    <OutlinedInput
                                        id="code"
                                        {...register("code")}
                                        style={{ height: "40px" }}
                                    />
                                    {errors.code && (
                                        <FormHelperText error>
                                            {errors.code.message}
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
