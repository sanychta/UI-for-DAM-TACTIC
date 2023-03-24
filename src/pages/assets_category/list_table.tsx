import React, { useCallback } from "react";

import {
    useTranslate,
    IResourceComponentsProps,
    HttpError,
    useNavigation,
} from "@pankod/refine-core";

import { 
    // useForm, 
    useModalForm 
} from "@pankod/refine-react-hook-form";

import {
    useTable,
    ColumnDef,
    flexRender,
    Row,
} from "@pankod/refine-react-table";

import {
    List,
    TableContainer,
    Table,
    Stack,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    IconButton,
    Typography,
    TablePagination,
    useDataGrid,
    Avatar,
    GridColumns,
    DataGrid,
    GridActionsCellItem,
    CardMedia,
    CreateButton,
} from "@pankod/refine-mui";

import {
    Edit,
} from "@mui/icons-material";

import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import { IAssetsCategory, IAssets } from "../../interfaces";

import { CreateCategoryAsset, EditAsset, EditCategoryAsset } from "../../components";

export const AssetsCategoryList: React.FC<IResourceComponentsProps> = () => {

    const t = useTranslate();

    const createDrawerFormProps = useModalForm<IAssetsCategory, HttpError, IAssetsCategory>({
        refineCoreProps: {
            redirect: false,
            action: "create",
        },
    });

    const {
        modal: { show: showCreateDrawer, title},
    } = createDrawerFormProps;

    const editDrawerFormProps = useModalForm<IAssetsCategory, HttpError, IAssetsCategory>({
        refineCoreProps: { 
            redirect: false,
            action: "edit"
        },
    });

    const {
        modal: { show: showEditDrawer },
    } = editDrawerFormProps;

    const columns = React.useMemo<ColumnDef<IAssetsCategory>[]>(
        () => [
            {
                id: "image",
                accessorKey: 'image',
                header: t("categories.fields.preview"),
                cell: function render({ row }) {
                    return (
                        <CardMedia
                            component="img"
                            sx={{
                                width: { xs: 65, sm: 65, lg: 65, xl: 65 },
                                height: { xs: 65, sm: 65, lg: 65, xl: 65 },
                                borderRadius: "50%",
                            }}
                            alt={row.original.image.name}
                            image={row.original.image.url}
                        />
                    );
                },
            },
            {
                id: "name",
                accessorKey: "name",
                header: t("categories.fields.name"),
                cell: function render({ row, getValue }) {
                    return (
                        <Stack direction="row" alignItems="center" spacing={3}>
                            <IconButton onClick={() => row.toggleExpanded()}>
                                {row.getIsExpanded() ? (
                                    <KeyboardArrowDownOutlinedIcon fontSize="small" />
                                ) : (
                                    <KeyboardArrowRightOutlinedIcon fontSize="small" />
                                )}
                            </IconButton>
                            <Typography>{getValue() as string}</Typography>
                        </Stack>
                    );
                },
            },
            {
                id: "description",
                header: t("categories.fields.description"),
                accessorKey: "description",
            },
            {
                id: "code",
                header: t("categories.fields.code"),
                accessorKey: "code",
                hide: true,
                hidden: true,
                visible: false,
            },
            {
                id: "actions",
                header: t("table.actions"),
                type: "actions",
                accessorKey: "id",
                cell: function render({ row }) {
                    return [
                        <GridActionsCellItem
                            key={1}
                            label={t("buttons.edit")}
                            icon={<Edit />}
                            onClick={() => showEditDrawer(row.original.id)}
                            showInMenu
                        />,
                    ];
                },
                flex: 0.5,
                minWidth: 100,
            },
        ],
        [showEditDrawer, t],
    );

    const {
        options: {
            state: { pagination },
            pageCount,
        },
        getHeaderGroups,
        getRowModel,
        setPageIndex,
        setPageSize,
        refineCore: { tableQueryResult },
    } = useTable<IAssetsCategory>({
        columns,
        initialState: {
            sorting: [{ id: "title", desc: false }],
        },
    });

    const renderRowSubComponent = useCallback(
        ({ row }: { row: Row<IAssetsCategory> }) => (
            <AssetsCategoryTable record={row.original} />
        ),
        [],
    );

    return (
        <>
            <CreateCategoryAsset {...createDrawerFormProps} />
            <EditCategoryAsset {...editDrawerFormProps} />
            <List 
                wrapperProps={{ sx: { paddingX: { xs: 2, md: 0 }, 
                    // paddingBottom: "none" 
                } }}
                headerProps={{ action: <CreateButton onClick={() => {  return showCreateDrawer()}} /> }}
            >
                <form > 
                    {/* onSubmit={handleSubmit(onFinish)}> */}
                    <TableContainer>
                        <Table size="small" 
                            sx={{
                                ".MuiTableHead-root":{
                                    backgroundColor: "#212121",
                                },
                                ".MuiTableCell-root":{
                                    borderBottomColor: "#212121",
                                },
                                ".MuiTableCell-body":{
                                    borderBottomColor: "#212121",
                                },
                            }}
                        >
                            <TableHead>
                                {getHeaderGroups().map((headerGroup) => (
                                    <TableRow
                                        key={`header-group-${headerGroup.id}`}
                                    >
                                        {headerGroup.headers.map((header) => (
                                            <TableCell
                                                key={`header-group-cell-${header.id}`}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                                {getRowModel().rows.map((row) => {
                                    return (
                                        <React.Fragment key={row.id}>
                                            {(
                                                <TableRow>
                                                    {row
                                                        .getAllCells()
                                                        .map((cell) => {
                                                            return (
                                                                <TableCell
                                                                    key={cell.id}
                                                                >
                                                                    {flexRender(
                                                                        cell.column
                                                                            .columnDef
                                                                            .cell,
                                                                        cell.getContext(),
                                                                    )}
                                                                </TableCell>
                                                            );
                                                        })}
                                                </TableRow>
                                            )}
                                            {row.getIsExpanded() ? (
                                                <TableRow>
                                                    <TableCell colSpan={row.getVisibleCells().length}>
                                                        {renderRowSubComponent({row,})}
                                                    </TableCell>
                                                </TableRow>
                                            ) : null}
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        rowsPerPageOptions={[5, 10, 25,
                            {
                                label: "All",
                                value: tableQueryResult.data?.total ?? 100,
                            },
                        ]}
                        showFirstButton
                        showLastButton
                        count={pageCount || 0}
                        // padding="none"
                        rowsPerPage={pagination?.pageSize || 10}
                        page={pagination?.pageIndex || 0}
                        onPageChange={(_, newPage: number) => setPageIndex(newPage)}
                        onRowsPerPageChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            setPageSize(parseInt(event.target.value, 10));
                            setPageIndex(0);
                        }}
                    />
                </form>
            </List>
        </>
    );
};

const AssetsCategoryTable: React.FC<{ record: IAssetsCategory }> = ({ record }) => {
    const t = useTranslate();

    const { show } = useNavigation();

    const { dataGridProps } = useDataGrid<IAssetsCategory>({
        resource: "assets",
        initialPageSize: 10,
        permanentFilter: [
            {
                field: "assets_category_code",
                operator: "eq",
                value: record.code,
            },
        ],
        syncWithLocation: false,
    });

    const editDrawerFormProps = useModalForm<IAssets, HttpError, IAssets>({
        refineCoreProps: {
            action: "edit",
            resource: "assets",
            redirect: false,
        },
    });

    const {
        modal: { show: showEditDrawer },
    } = editDrawerFormProps;

    const columns = React.useMemo<GridColumns<IAssets>>(
        () => [
            {
                field: "image",
                headerName: "Preview",
                filterable: false,
                filterOperators: undefined,
                disableColumnMenu: true,
                hideSortIcons: true,
                renderCell: function render({ row }) {
                    return (
                        <Avatar
                            alt={`${row.name}`}
                            src={row.image.url}
                            sx={{ width: 48, height: 48 }}
                        />
                    );
                },
                flex: 1,
                maxWidth: 85,
            },
            {
                field: "id",
                hide: true,
            },
            {
                field: "name",
                headerName: t("assets.fields.name"),
                flex: 1,
                // minWidth: 180,
            },
            {
                field: "description",
                headerName: t("assets.fields.description"),
                flex: 1,
                // minWidth: 180,
            },
            {
                field: "actions",
                headerName: t("table.actions"),
                type: "actions",
                getActions: function render({ row }) {
                    return [
                        <GridActionsCellItem
                            key={1}
                            label={t("buttons.edit")}
                            icon={<Edit />}
                            onClick={() => showEditDrawer(row.id)}
                            showInMenu
                        />,
                    ];
                },
                flex: 0.5,
                // minWidth: 100,
            },
        ],
        [showEditDrawer, t],
    );

    return (
        <List
            headerProps={{
                title: "Assets",
            }}
            // wrapperProps={{ sx: {paddingBottom: "0px"}}}
        >
            <DataGrid
                {...dataGridProps}
                columns={columns}
                headerHeight={40}
                rowHeight={50}
                autoHeight
                // sx={{paddingBottom: "0px"}}
                density="comfortable"
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                onRowClick={(row) => {
                    show("assets", row.id);
                }}            />
            <EditAsset {...editDrawerFormProps} />
        </List>
    );
};
