import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import {
    CrudFilters,
    getDefaultFilter,
    useList,
    useTranslate,
} from "@pankod/refine-core";
import { 
    Stack, 
    Typography, 
    Grid,
    TextField,
    InputAdornment,
    IconButton,
    Divider,
} from "@pankod/refine-mui";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearIcon from '@mui/icons-material/Clear';
import { IAssetsCategory } from "../../interfaces";
import React from "react";

const saveFiltersToLocalStorage = (
    filterCategories?: string[], searchFilter?: string
) => {
    localStorage.setItem('filterCategoriesAssetsBrowser', JSON.stringify(filterCategories));
    localStorage.setItem('searchFilterAssetsBrowser', JSON.stringify(searchFilter));
};

const loadFiltersFromLocalStorage = (
) => {
    return [
        JSON.parse(String(localStorage.getItem('filterCategoriesAssetsBrowser'))),
        JSON.parse(String(localStorage.getItem('searchFilterAssetsBrowser'))),
    ]
};

type AssetItemProps = {
    setFilters: (filters: CrudFilters) => void;
    filters: CrudFilters;
};

export const CategoryFilter: React.FC<AssetItemProps> = ({
    setFilters,
    filters,
}) => {
    const t = useTranslate();

    const [searchFilter, setSearchFilter] = useState<string>(
        getDefaultFilter("name|keywords|description", filters, "contains") ?? ""
    );

    const [filterCategories, setFilterCategories] = useState<string[]>(
        getDefaultFilter("assets_category_code|AND", filters, "in") ?? [],
    );
    
    const { data: categories, isLoading } = useList<IAssetsCategory>({
        resource: "categories",
    });

    useEffect(() => {
        const loadFilters = loadFiltersFromLocalStorage();
        setFilterCategories(loadFilters[0] !== null ? loadFilters[0] : []);
        setSearchFilter(loadFilters.length > 1 ? loadFilters[1] : '');
    }, []);

    useEffect(() => {
        var filter: CrudFilters;
        if (filterCategories.length > 0) {
            filter = [{
                field: "assets_category_code|AND",
                operator: "in",
                value: filterCategories.length > 0 ? filterCategories : undefined,
            }];
        } else {
            filter = [{
                field: "assets_category_code|AND",
                operator: "in",
                value: filterCategories.length > 0 ? filterCategories : undefined,
            }];
        }

        if (searchFilter !== "") {
            filter.unshift({
                field: "name|keywords|description",
                operator: "contains",
                value: searchFilter.length > 0 ? searchFilter : undefined,
            })
        } else {
            filter.unshift({
                field: "name|keywords|description",
                operator: "contains",
                value: searchFilter.length > 0 ? searchFilter : undefined,
            })
        };

        saveFiltersToLocalStorage(filterCategories, searchFilter);

        setFilters?.(filter);

    }, [filterCategories, searchFilter]);

    const toggleSearchFilter = (inputValue: string) => {
        setSearchFilter(inputValue);
    };

    const toggleFilterCategory = (clickedCategory: string) => {
        const target = filterCategories.findIndex(
            (category) => category === clickedCategory,
        );

        if (target < 0) {
            setFilterCategories((prevCategories) => {
                return [...prevCategories, clickedCategory];
            });
        } else {
            const copyFilterCategories = [...filterCategories];

            copyFilterCategories.splice(target, 1);

            setFilterCategories(copyFilterCategories);
        }
    };

    return (
        // <Grid
        //     item
        //     sm={3}
        //     md={3}
        //     sx={{
        //         display: {
        //             xs: "none",
        //             md: "block",
        //         },
        //     }}
        // >
            <Stack padding="8px">
                <TextField
                    sx={{
                        ml: 0,
                        flex: 0,
                        width: "100%",
                    }}
                    size="small"
                    id="searchText"
                    placeholder={t("assets.assetsSearch")}
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
                                <IconButton onClick={() => setSearchFilter('')} >
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Divider sx={{ height: "20px" }} />                           
                <Grid container columns={6} marginTop="10px">
                    <Grid item p={0.5}>
                        <LoadingButton
                            onClick={() => setFilterCategories([])}
                            variant={
                                filterCategories.length === 0
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
                    {categories?.data.map((category: IAssetsCategory) => (
                        <Grid item key={category.code} p={0.5}>
                            <LoadingButton
                                variant={
                                    filterCategories.includes(
                                        category.code.toString(),
                                    )
                                        ? "contained"
                                        : "outlined"
                                }
                                size="small"
                                loading={isLoading}
                                sx={{
                                    borderRadius: "50px",
                                }}
                                onClick={() =>
                                    toggleFilterCategory(category.code.toString())
                                }
                            >
                                {category.name}
                            </LoadingButton>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        // </Grid>
    );
};
