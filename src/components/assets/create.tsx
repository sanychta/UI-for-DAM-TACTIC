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
    IconButton,
    FormControl,
    Autocomplete,
    OutlinedInput,
    FormHelperText,
    Create,
    useAutocomplete,
    TextField,
} from "@pankod/refine-mui";

import { CloseRounded } from "@mui/icons-material";

import { IAssetsCategory, IAssets } from "../../interfaces";

// import TACTIC from "../../tactic/Tactic";

// Asset creation form
export const CreateAsset: React.FC<
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
      }) => {
      
      const t = useTranslate(); // Using language switching on the page

      // a variable to fill the combo box with data from the assets_category table
      const { autocompleteProps } = useAutocomplete<IAssetsCategory>({
        resource: "categories",
      });

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
        };
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
                  <FormControl required sx={{ minWidth: 350, marginTop: "10px" }}>
                    
                    {/* "Assets category" combo box */}
                    <Controller
                      control={control}
                      name="assets_category"
                      rules={{
                        required: t(
                          "errors.required.field",
                          { field: "Category" },
                        ),
                      }}
                      defaultValue={null as any}
                      render={({ field }) => (
                        <Autocomplete
                          disablePortal
                          {...register("assets_category_code")}
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
                                !!errors.assets_category_code
                                  ?.message
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

                  {/* image upload form */}
                  <FormControl sx={{ width: "100%" }}>
                    <FormLabel>
                      {t("assets.fields.image.label")}
                    </FormLabel >
                    <Stack
                      display="flex"
                      alignItems="center"
                      border="1px dashed  "
                      borderColor="primary.main"
                      borderRadius="5px"
                    >
                      <Typography
                        variant="body2"
                        style={{
                          fontWeight: 800,
                          marginTop: "8px",
                         }}
                      >
                        {t("assets.fields.image.description",)}
                      </Typography>
                      <label htmlFor="images-input" >
                        <Input
                          id="images-input"
                          name="images-input"
                          type="file"
                          sx={{
                            display: "none",
                            cursor: "pointer",
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
                    {errors.image && (
                      <FormHelperText error>
                        {errors.image.message}
                      </FormHelperText>
                    )}
                  </FormControl>

                  {/* Asset name */}
                  <Stack gap="10px" marginTop="10px">
                    <FormControl>
                      <FormLabel required>
                        {t("assets.fields.name")}
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

                    {/* Asset description */}
                    <FormControl>
                      <FormLabel>
                        {t("assets.fields.description")}
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

                    {/* Asset keywords */}
                    <FormControl>
                      <FormLabel>
                        {t("assets.fields.keywords")}
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
                  </Stack>
                </form>
              </Box>
            </Stack>
          </Create>
        </Drawer>
      );
    };