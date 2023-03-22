import { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import {
    CrudFilters,
    getDefaultFilter,
    useList,
    useTranslate,
} from "@pankod/refine-core";
import { Stack, Grid } from "@pankod/refine-mui";

import { IAssetsCategory } from "../../interfaces";
import React from "react";

type AssetItemProps = {
    setFilters: (filters: CrudFilters) => void;
    filters: CrudFilters;
};

export const CategoryFilter: React.FC<AssetItemProps> = ({
    setFilters,
    filters,
}) => {
    const t = useTranslate();

    const [filterCategories, setFilterCategories] = useState<string[]>(
        getDefaultFilter("code|", filters, "in") ?? [],
    );
    
    const { data: categories, isLoading } = useList<IAssetsCategory>({
        resource: "categories",
    });

    useEffect(() => {
        setFilters?.([
            {
                field: "assets_category_code|AND",
                operator: "in",
                value:
                    filterCategories.length > 0 ? filterCategories : undefined,
            },
        ]);
    }, [filterCategories]);

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
        <Stack>
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
    );
};
