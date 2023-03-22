import React from "react";
import { 
	getDefaultFilter, 
	CrudFilters, 
	useTranslate, 
	IResourceComponentsProps, 
	useNavigation, 
} from "@pankod/refine-core";

import {
	DataGrid,
	Grid,
	GridColumns,
	Avatar,
	useDataGrid,
	useAutocomplete,
	Button,
	TextField,
	Box,
	InputAdornment,
	CardHeader,
	Card,
	CardContent,
	List,
	Stack,
	Typography,
	Autocomplete,
} from "@pankod/refine-mui";

import { 
	Controller, 
	useForm 
} from "@pankod/refine-react-hook-form";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import TacticDataProvider from "../../tactic/tacticdataprovider";

import { 
	ILogindata, 
	IUserFilterVariables, 
	HttpError, 
	ILoginGroup, 
} from "../../interfaces";

export const UserList: React.FC<IResourceComponentsProps> = () => {

	const { show } = useNavigation(); //, edit
	const t = useTranslate();

	const { autocompleteProps } = useAutocomplete<ILoginGroup, HttpError>({
		resource: "login_group",
	});

	const { 
		dataGridProps, 
		search, 
		filters, 
		// setFilters 
	} = useDataGrid<ILogindata, HttpError, IUserFilterVariables>(
	{
		initialPageSize: 10,
		initialSorter: [
		{
			field: "id",
			order: "asc",
		},
	    ],
			onSearch: async (params) => {
				const filters: CrudFilters = [];
				const { 
					code, 
					login_group 
				} = params;

				filters.push({
					field: "code|display_name|login",
					operator: "contains",
					value: code !== "" ? code : undefined,
				});

				if (login_group !== ''){
					const dp = TacticDataProvider();
					const flt: CrudFilters = [{
						field: 'code',
						operator: "eq",
						value: login_group.toLowerCase(),
					}];

					const param2 = {
						resource: "sthpw/login_group",
						filters: flt,
					};
					var data = await dp.getList(param2).then((resolve) => { return resolve.data[0] });
					flt.pop();
					flt[0] = {
						field: 'login_group',
						operator: "eq",
						value: data.code,
					};

					param2.resource = 'sthpw/login_in_group';
					param2.filters = flt;
					data = await dp.getList(param2).then((resolve) => { return resolve.data });
					var values:any = [];

					for (var x in data) {
						values.push(data[x].login);
					};
				};

				var fld = '';
				if (code !== '') {
					fld = 'login|AND'
				}
				else {
					fld = 'login';
				}

				filters.push({
					field: fld,
					operator: "in",
					value: values,
				});

				return filters;
			},
	}
  	);

	const columns = React.useMemo<GridColumns<ILogindata>>(
		() => [
		{
			field: "image",
			renderHeader: function render() {
			return <></>;
			},
			filterable: false,
			filterOperators: undefined,
			disableColumnMenu: true,
			hideSortIcons: true,
			renderCell: function render({ row }) {
			return (
				<Stack alignItems="center" direction="row" spacing={2}>
					<Avatar
						alt={row.display_name}
						src={row.image.url}
					/>
					<Typography variant="body2">
						{row.display_name}
					</Typography>
				</Stack>
			);
			},
			flex: 1,
			minWidth: 50,
			// maxWidth: 150,
		},
		{
			field: "id",
			headerName: "ID",
			type: "number",
			width: 90,
			hide: true,
		},
		{
			field: "login",
			headerName: t("userslogins.fields.login"),
			width: 250,
			maxWidth: 250,
			flex: 1,
		},
		{
			field: "display_name",
			headerName: t("userslogins.fields.name"),
			minWidth: 200,
			flex: 0.5,
			hide: true,
		},
		{
			field: "email",
			headerName: t("userslogins.fields.email"),
			minWidth: 100,
			flex: 0.5
		},
		{
			field: "phone_number",
			headerName: t("userslogins.fields.phone"),
			minWidth: 100,
			flex: 0.5
		},
		],
		[t]
	);

	const { 
		register, 
		handleSubmit, 
		control 
	} = useForm<
		ILogindata,
		HttpError,
		IUserFilterVariables
	>({
		defaultValues: {
			code: getDefaultFilter("code|display_name|login", filters, "contains"),
			login_group: getDefaultFilter("login_group", filters, "eq"),
		},
	});
	
	
	return (
		<Grid container spacing={2}>
			<Grid item xs={12} lg={3}>
				<Card sx={{ paddingX: { xs: 3, md: 0 } }}>
					<CardHeader title={t("userslogins.filters.title")} />
					<CardContent sx={{ pt: 0 }}>
						<Box
							component="form"
							sx={{ display: "flex", flexDirection: "column" }}
							autoComplete="off"
							onSubmit={handleSubmit(search)}
						>
							<TextField
								{...register("code")}
								label={t("userslogins.filters.searchby")}
								placeholder={t(
									"userslogins.filters.namesearch",
								)}
								margin="normal"
								fullWidth
								autoFocus
								size="small"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchOutlinedIcon />
										</InputAdornment>
									),
								}}
							/>
							<Controller 
								control={control}
								name="login_group"
								render={({field}) => (
									
										<Autocomplete
											disablePortal
											size="small"
											{...register("login_group")}
											{...autocompleteProps}
											getOptionLabel={(item) => {
												if ((item.name === undefined) || (item.name === '')) {
													item.name = item.code
												};
												return item.name
													? item.name
													: autocompleteProps?.options?.find(
														(p) =>
															p.id.toString() ===
															item.toString(),
													)?.name ?? "";
											}}
											renderInput={(params) => <TextField {...params} {...field} label={t("userslogins.filters.group")} />}
										/>		
									
								)}
							/>
							<br />
							<Button type="submit" variant="contained">
								{t("userslogins.filters.filters")}
							</Button>
						</Box>
					</CardContent>
				</Card>
			</Grid>
			<Grid item xs={12} lg={9}>
				<List cardProps={{ sx: { paddingX: { xs: 2, md: 0 } } }}>
					<DataGrid
						{...dataGridProps}
						columns={columns}
						filterModel={undefined}
						headerHeight={40}
						autoHeight
						rowsPerPageOptions={[10, 20, 50, 100]}
						density="comfortable"
						sx={{
							".MuiDataGrid-cell:hover": {
								cursor: "pointer",
							},
							".MuiDataGrid-columnHeaders": {
								borderBottomColor: "#212121",
								backgroundColor: "#212121",
							},
							".MuiDataGrid-cell": {
								borderBottomColor: "#212121",
							},
							".MuiDataGrid": {
								borderBottomColor: "#212121",
							},
							".MuiDataGrid-footerContainer": {
								borderTopColor: "#212121",
							},
							border: "none",
						}}
						onRowClick={(row) => {
							show("logins", row.id);
						}}
					/>
				</List>
			</Grid>
		</Grid>
	);
	};