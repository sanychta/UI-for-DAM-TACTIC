import React from "react";
import TacticDataProvider from "./tactic/tacticdataprovider";
import { CrudFilter, useList } from "@pankod/refine-core";
import ColorHash from "color-hash";
import {
    Link,
    Stack,
    Typography,
} from "@pankod/refine-mui";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { ITask, } from "./interfaces";

export const LOGIN_TICKET = "login_ticket";
export const USER_LOGIN = "login";
export const USER_GROUP = "group";
export const SERVER = "server";
export const SITE = "site";
export const PROJECT = "project";
export const SERVER_URL = "http://tactic";
export const DEF_SITE = "";
export const DEF_PROJECT = "admin";
export const USER_ID = "id";
export const USER_EMAIL = "email";
export const USER_IMAGE_NAME = "image_name";
export const USER_IMAGE_URL = "image_url";
export const USER_PHONE = "phone";
export const USER_NAME = "name";
export const USER_ROLE = "role";

export const SaveTaskForScene = (code: any) => {
    var filter: CrudFilter[] = [
        { field: "search_code", operator: "contains", value: code },
    ];
    var params = { resource: "tasks", hasPagination: false, filters: filter };
    TacticDataProvider()
        .getList(params)
        .then((res) => {
            const data = JSON.stringify(res.data);
            localStorage.setItem("TASKS_FOR_SCENE", data);
            return data;
        })
        .then((data) => localStorage.setItem("TASKS_FOR_SCENE", data));
};

export const SaveLoginInGroup = () => {
    var params = { resource: "login_in_group", hasPagination: false };
    TacticDataProvider()
        .getList(params)
        .then((res) => {
            const data = JSON.stringify(res.data);
            localStorage.setItem("LOGIN_IN_GROUP_LIST", data);
            return data;
        })
        .then((data) => localStorage.setItem("LOGIN_IN_GROUP_LIST", data));
};

export const SaveLoginGroup = () => {
    var params = { resource: "login_group", hasPagination: false };
    TacticDataProvider()
        .getList(params)
        .then((res) => {
            const data = JSON.stringify(res.data);
            localStorage.setItem("GROUP_LIST", data);
            return data;
        })
        .then((data) => localStorage.setItem("GROUP_LIST", data));
};

export const SaveUsersInLS = () => {
    var params = { resource: "logins", hasPagination: false };
    TacticDataProvider()
        .getList(params)
        .then((res) => {
            const data = JSON.stringify(res.data);
            localStorage.setItem("USERS_LIST", data);
            return data;
        })
        .then((data) => localStorage.setItem("USERS_LIST", data));
};

export const SavePipeProcess = (code: string) => {
    let filter: CrudFilter[] = [
        { field: "code", operator: "contains", value: code },
    ];
    let params = { resource: "pipes", hasPagination: false, filters: filter };
    TacticDataProvider()
        .getList(params)
        .then((res) => {
            const data = JSON.stringify(res.data);
            localStorage.setItem("PIPELINE_PROCESS", data);
            return data;
        })
};

export const get_pipe_options = (value: any) => {
    if (value === undefined) {
        return JSON.parse(`{
            "resource": "pipes",
            "config":{
                "hasPagination":false
            }
        }`);
    } else {
        return JSON.parse(`{
            "resource": "pipes",
            "config": {
                "hasPagination":false, 
                "filters": [{ 
                    "field": "code", 
                    "operator": "in", 
                    "value": "${value}"
                }]
            }
        }`);
    }
};

export function ColorLuminance(hex: string, lum: any) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "#",
        c;
    for (let i = 0; i < 3; i++) {
        c = parseInt(hex[i * 2] + hex[i * 2 + 1], 16);
        c = Math.round(
            Math.min(Math.max(0, c + c * Number(lum)), 255)
        ).toString(16);
        rgb += ("00" + c).substring(c.length);
    }
    return rgb;
}

export const crc32 = function (r: any) {
    for (var a, o = [], c = 0; c < 256; c++) {
        a = c;
        for (var f = 0; f < 8; f++)
            a = 1 & a ? 3988292384 ^ (a >>> 1) : a >>> 1;
        o[c] = a;
    }
    for (var n = -1, t = 0; t < r.length; t++)
        n = (n >>> 8) ^ o[255 & (n ^ r.charCodeAt(t))];
    return (-1 ^ n) >>> 0;
};

export const getAcronym = (name: string) => {
    const abbr = name
        .split(" ")
        .map((elem) => elem.match(/^[а-яА-Яa-zA-Z]/g))
        .join("")
        .toLocaleUpperCase();
    return abbr !== undefined ? abbr : null;
};

export const getColorHash = (name: string) => {
    return new ColorHash({ saturation: 0.3, lightness: 0.5 }).hex(name);
};

type HeaderLinksProps = {
    showHome?: boolean;
    display?: "flex" | "none";
    link?: string | "";
    title?: string;
    separator?: string;
};

export const HeaderLinks: React.FC<HeaderLinksProps> = ( props: HeaderLinksProps ) => {
    return (
        <Stack direction="row" alignItems="center" paddingRight="10px">
            <Link
                id="home-link"
                href="/tactic/refine_test"
                alignSelf="center"
                display={props.showHome ? "flex" : "none"}
                alignContent="center"
            >
                {" "}
                <HomeOutlinedIcon color="action" />
            </Link>
            <Typography display={props.display} padding="10px" >
                {props.separator ?? "/"}
            </Typography>
            <Link
                id="second-link"
                href={props.link}
                underline="none"
                color="text.primary"
                alignSelf="center"
                display={props.display}
                alignContent="center"
            >
                <Typography>
                    {props.title}
                </Typography>
            </Link>
        </Stack>
    );
};
