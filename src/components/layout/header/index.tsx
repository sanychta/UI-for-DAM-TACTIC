import React, { useState, useContext } from "react";

import {
    useGetIdentity, 
    useGetLocale,
    useTranslate,
    // useList,
    useSetLocale, 
    // CrudFilters,
} from "@pankod/refine-core";

import {
    AppBar,
    IconButton,
    Avatar,
    Stack,
    Toolbar,
    Typography,
    Autocomplete,
    Link,
    Box,
    TextField,
    FormControl,
    Select,
    MenuItem,
} from "@pankod/refine-mui";

import i18n from "../../../i18n";

import { SearchOutlined, DarkModeOutlined, LightModeOutlined, } from "@mui/icons-material";

import { ColorModeContext } from "../../../contexts";

interface IOptions {
    label: string;
    url: string;
    link: string;
    category: string;
}

export const Header: React.FC = () => {
    const { mode, setMode } = useContext(ColorModeContext);
    const [
        value, 
        setValue
    ] = useState("");
    const [
        options, 
        // setOptions
    ] = useState<IOptions[]>([]);

    const changeLanguage = useSetLocale();
    const locale = useGetLocale();
    const currentLocale = locale();  
    const { data: user } = useGetIdentity();  
    const t=useTranslate();

    return (
        <AppBar color="default" position="sticky" elevation={1}>
            <Toolbar>
                <Stack
                    direction="row"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Stack direction="row" flex={1}>
                        <Autocomplete
                            sx={{
                                maxWidth: 550,
                            }}
                            id="search-autocomplete"
                            options={options}
                            filterOptions={(x) => x}
                            disableClearable
                            freeSolo
                            fullWidth
                            size="small"
                            onInputChange={(event, value) => {
                                if (event?.type === "change") {
                                    setValue(value);
                                }
                            }}
                            groupBy={(option) => option.category}
                            renderOption={(props, option: IOptions) => {
                                return (
                                    <Link href={option.link} underline="none">
                                        <Box
                                            {...props}
                                            component="li"
                                            sx={{
                                                display: "flex",
                                                padding: "10px",
                                                alignItems: "center",
                                                gap: "10px",
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: {
                                                        sm: "48px",
                                                        md: "54px",
                                                        lg: "64px",
                                                    },
                                                    height: {
                                                        sm: "48px",
                                                        md: "54px",
                                                        lg: "64px",
                                                    },
                                                }}
                                                src={option.url}
                                            />
                                            <Typography
                                                sx={{
                                                    fontSize: {
                                                        md: "14px",
                                                        lg: "16px",
                                                    },
                                                }}
                                            >
                                                {option.label}
                                            </Typography>
                                        </Box>
                                    </Link>
                                );
                            }}
                            renderInput={(params) => {
                                return (
                                    <Box
                                        position="relative"
                                        sx={{
                                            display: {
                                                xs: "none",
                                                sm: "block",
                                            },
                                        }}
                                    >
                                        <TextField
                                            {...params}
                                            label={t("search.placeholder")}
                                            InputProps={{
                                                ...params.InputProps,
                                            }}
                                        />
                                        <IconButton
                                            sx={{
                                                position: "absolute",
                                                right: 0,
                                                top: 0,
                                                "&:hover": {
                                                    backgroundColor:
                                                      "transparent",
                                                },
                                            }}
                                        >
                                            <SearchOutlined />
                                        </IconButton>
                                    </Box>
                                );
                            }}
                        />
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <IconButton
                            onClick={() => {
                                setMode();
                            }}
                        >
                            {mode === "dark" ? (
                                <LightModeOutlined />
                            ) : (
                                <DarkModeOutlined />
                            )}
                        </IconButton>
                        <FormControl sx={{ m: 1, minWidth: 120 }}>
                            <Select
                                disableUnderline
                                defaultValue={currentLocale}
                                inputProps={{ "aria-label": "Without label" }}
                                variant="standard"
                            >
                              {[...(i18n.languages ?? [])]
                                  .sort()
                                  .map((lang: string) => (
                                    <MenuItem
                                        selected={currentLocale === lang}
                                        key={lang}
                                        defaultValue={lang}
                                        onClick={() => {
                                           changeLanguage(lang);
                                        }}
                                        value={lang}
                                    >
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            <Avatar
                                                sx={{
                                                    width: "16px",
                                                    height: "16px",
                                                    marginRight: "5px",
                                                }}
                                                alt={lang}
                                                src={`/assets/images/flags/${lang}.svg`}
                                            />
                                            {lang === "en"
                                                ? "English"
                                                : "Русский"}
                                        </Stack>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Stack
                            direction="row"
                            gap="4px"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography variant="subtitle2">
                                {user?.name}
                            </Typography>
                            <Avatar src={user?.avatar} alt={user?.name} />
                        </Stack>
                    </Stack>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

