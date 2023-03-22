import React from "react";
import {
    useTranslate,
    IResourceComponentsProps,
    useTable,
    getDefaultFilter,
    HttpError,
    // CanAccess,
    // useNavigation,
} from "@pankod/refine-core";
import { 
    // useForm, 
    useModalForm 
} from "@pankod/refine-react-hook-form";
import {
    Grid,
    Paper,
    Typography,
    // InputBase,
    InputAdornment,
    TextField,
    // IconButton,
    Stack,
    Pagination,
    CreateButton,
} from "@pankod/refine-mui";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { AssetsItem, EditAsset, CategoryFilter, CreateAsset } from "../../components";
import { IAssets } from "../../interfaces";

export const AssetsList: React.FC<IResourceComponentsProps> = () => {
    
    // const { show } = useNavigation();

    const t = useTranslate();
    
    const { tableQueryResult, pageCount, setCurrent, filters, setFilters } =
        useTable<IAssets>({
            resource: "assets",
            initialPageSize: 12,
        });

    const createDrawerFormProps = useModalForm<IAssets, HttpError, IAssets>({
        refineCoreProps: { 
            redirect: false,
            action: "create" 
        },
    });

    const {
        modal: { show: showCreateDrawer },
    } = createDrawerFormProps;

    const editDrawerFormProps = useModalForm<IAssets, HttpError, IAssets>({
        refineCoreProps: { 
            redirect: false,
            action: "edit" 
        },
    });

    const {
        modal: { show: showEditDrawer },
    } = editDrawerFormProps;

    const assets: IAssets[] = tableQueryResult.data?.data || [];

    return (
        <>
            <CreateAsset {...createDrawerFormProps} />
            <EditAsset {...editDrawerFormProps} />
            <Paper
                sx={{
                    paddingX: { xs: 3, md: 2 },
                    paddingY: { xs: 2, md: 3 },
                    my: 0.5,
                }}
            >
                <Grid container columns={16}>
                    <Grid item xs={16} md={12}>
                        <Stack
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            flexWrap="wrap"
                            padding={1}
                            direction="row"
                            gap={2}
                        >
                            <Typography variant="h5">
                                {t("assets.assets")}
                            </Typography>
                            <Paper
                                component="text"
                                sx={{
                                    // display: "flex",
                                    alignItems: "center",
                                    width: 400,
                                }}
                            >
                                <TextField
                                    sx={{
                                        ml: 0, 
                                        flex: 0,
                                        // alignItems: "center",
                                        width: 400,
                                    }}
                                    placeholder={t("assets.assetsSearch")}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchOutlinedIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                    value={getDefaultFilter(
                                        "id",
                                        filters,
                                        "contains",
                                    )}
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                        setFilters([
                                            {
                                                field: "name|keywords|description",
                                                operator: "contains",
                                                value:
                                                    e.target.value !== ""
                                                        ? e.target.value
                                                        : undefined,
                                            },
                                        ]);
                                    }}
                                />
                            </Paper>
                            <CreateButton
                                onClick={() => showCreateDrawer()}
                                variant="contained"
                                sx={{ marginBottom: "5px" }}
                            >
                                {t("assets.titles.create")}
                            </CreateButton>
                        </Stack>
                        <Grid container>
                            {assets.length > 0 ? (
                                assets.map((assets: IAssets) => (
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        lg={4}
                                        xl={3}
                                        key={assets.id}
                                        sx={{ padding: "8px" }}
                                        // onClick={() => show("assets", assets.id)}
                                    >
                                        <AssetsItem
                                            assets={assets}
                                            showEdit={showEditDrawer}
                                            
                                        />
                                    </Grid>
                                ))
                            ) : (
                                <Grid
                                    container
                                    justifyContent="center"
                                    padding={3}
                                >
                                    <Typography variant="body2">
                                        {t("assets.noAssets")}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                        <Pagination
                            count={pageCount}
                            variant="outlined"
                            color="primary"
                            shape="rounded"
                            sx={{
                                display: "flex",
                                justifyContent: "end",
                                paddingY: "20px",
                            }}
                            onChange={(
                                event: React.ChangeEvent<unknown>,
                                page: number,
                            ) => {
                                event.preventDefault();
                                setCurrent(page);
                            }}
                        />
                    </Grid>
                    <Grid
                        item
                        sm={0}
                        md={4}
                        sx={{
                            display: {
                                xs: "none",
                                md: "block",
                            },
                        }}
                    >
                        <Stack padding="8px">
                            <Typography variant="subtitle1">
                                {t("assets.tagFilterDescription")}
                            </Typography>
                            <CategoryFilter
                                setFilters={setFilters}
                                filters={filters}
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
};
