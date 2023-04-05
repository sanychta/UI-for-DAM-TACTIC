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
    Card,
    CardContent,
    Typography,
    Stack,
    Pagination,
    CreateButton,
    Box,
} from "@pankod/refine-mui";

import { AssetsItem, EditAsset, CategoryFilter, CreateAsset } from "../../components";
import { IAssets } from "../../interfaces";
import BoxIcon from '../../contexts/box_icon';

export const AssetsList: React.FC<IResourceComponentsProps> = () => {
    
    // const { show } = useNavigation();

    const t = useTranslate();
    
    const { tableQueryResult, pageCount, setCurrent, filters, setFilters } =
        useTable<IAssets>({
            resource: "assets",
            initialPageSize: 16,
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
                <Grid 
                    container 
                    columns={16} 
                    spacing={2}
                >
                    <Grid item xs={12} lg={3} minWidth="250px" >
                        <Card 
                        >
                            <CardContent >
                                <Stack 
                                >
                                    <CategoryFilter
                                        setFilters={setFilters}
                                        filters={filters}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid 
                        item 
                        xs={12} 
                        md={12} 
                        spacing={2}
                    >
                        <Grid 
                            container 
                            spacing={2}
                        >
                        <Grid item spacing={2} width="100%">
                            <Paper sx={{ width: "100%" }}>
                                <Stack
                                    display="flex"
                                    alignItems="center"
                                    padding="10px 10px 10px 10px"
                                    direction="row"
                                >
                                    <Box marginRight="16px" width="fit-content" display="flex">
                                        <BoxIcon viewBox="0 0 16 16" />
                                    </Box>
                                    <Box width="100%" display="flex">
                                        <Typography variant="h6">
                                            {t("assets.assets")}
                                        </Typography>
                                    </Box>
                                    <Box width="-webkit-fill-available" display="flex" justifyContent="flex-end">
                                        <CreateButton
                                            onClick={() => showCreateDrawer()}
                                            variant="contained"
                                            size="small"
                                        >
                                            {t("assets.titles.create")}
                                        </CreateButton>
                                    </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                            {assets.length > 0 ? (
                                assets.map((assets: IAssets) => (
                                    <Grid
                                        item
                                        xs={12}
                                        md={3}
                                        spacing={2}
                                        minWidth="250px"
                                        key={assets.id}
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
        </>
    );
};
