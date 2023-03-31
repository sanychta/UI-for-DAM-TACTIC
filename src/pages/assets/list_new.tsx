import React from "react";
import {
    useTranslate,
    IResourceComponentsProps,
    useTable,
    HttpError,
    // useNavigation,
} from "@pankod/refine-core";
import { 
    useModalForm 
} from "@pankod/refine-react-hook-form";
import {
    Grid,
    Paper,
    Typography,
    Stack,
    Pagination,
    CreateButton,
} from "@pankod/refine-mui";

import { AssetsItem, EditAsset, CategoryFilter, CreateAsset } from "../../components";
import { IAssets } from "../../interfaces";

export const AssetsList: React.FC<IResourceComponentsProps> = () => {
    
    // const { show } = useNavigation();

    const t = useTranslate();
    
    const { tableQueryResult, pageCount, setCurrent, filters, setFilters } =
        useTable<IAssets>({
            resource: "assets",
            initialPageSize: 15,
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
                    {/* <Grid item xs={16} md={4}> */}
                    <CategoryFilter
                        setFilters={setFilters}
                        filters={filters}
                    />
                    {/* </Grid> */}
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
                                        md={4}
                                        key={assets.id}
                                        sx={{ padding: "8px" }}
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
                </Grid>
            </Paper>
        </>
    );
};
