import { 
    AuthProvider, 
    // useLogout,
} from "@pankod/refine-core";
// import Cookies from "universal-cookie";

import TACTIC from "./tactic/Tactic";

import {
    LOGIN_TICKET,
    USER_LOGIN,
    USER_GROUP,
    // SERVER,
    // SITE,
    // PROJECT,
    // SERVER_URL,
    // DEF_SITE,
    // DEF_PROJECT,
    USER_ID,
    USER_EMAIL,
    USER_IMAGE_NAME,
    USER_IMAGE_URL,
    USER_PHONE,
    USER_NAME,
    USER_ROLE,
    SaveLoginInGroup,
} from "./conf";

// import { redirectPage } from "@pankod/refine-core/dist/definitions/helpers";

export const TOKEN_KEY = "refine-auth";

// const { mutate: logout } = useLogout<{ redirectPath: string }>();
const save_user_info = (data: any) => {
    localStorage.setItem(USER_EMAIL, data?.email);
    localStorage.setItem(USER_IMAGE_URL, data?.image?.url);
    localStorage.setItem(USER_IMAGE_NAME, data?.image?.name);
    localStorage.setItem(USER_ID, data?.id);
    localStorage.setItem(USER_LOGIN, data?.login);
    localStorage.setItem(USER_PHONE, data?.phone);
    localStorage.setItem(USER_NAME, data?.name);
    localStorage.setItem(USER_GROUP, data?.user_groups);
    localStorage.setItem("PIPELINE_PROCESS", '[]');
    localStorage.setItem("TASKS_FOR_SCENE", "[]");
    localStorage.setItem("LOGIN_IN_GROUP_LIST", "[]");
    localStorage.setItem("GROUP_LIST", "[]");
    localStorage.setItem("USERS_LIST", "[]");
    SaveLoginInGroup();
    const user_groups = localStorage.getItem(USER_GROUP);
    const groups = user_groups?.split("|");
    var role = '';

    for (let group in groups) {
        if (groups[Number(group)] === "admin") {
            role = "admin";
        } else {
            role = "editor";
        }
    };
    localStorage.setItem(USER_ROLE, role);
};

const remove_user_info = () => {
    localStorage.clear();
        // localStorage.removeItem(USER_EMAIL);
        // localStorage.removeItem(USER_IMAGE_URL);
        // localStorage.removeItem(USER_IMAGE_NAME);
        // localStorage.removeItem(USER_ID);
        // localStorage.removeItem(USER_LOGIN);
        // localStorage.removeItem(USER_PHONE);
        // localStorage.removeItem(USER_NAME);
        // localStorage.removeItem(USER_GROUP);
        // localStorage.removeItem(LOGIN_TICKET);
        // localStorage.removeItem(USER_ROLE);
        // localStorage.removeItem("USERS_LIST");
};

export const authProvider: AuthProvider = {
    
    login: async ({ username, password }) => {
        const srv = new TACTIC();
        const kwargs = {
            data: {
                resource: 'sthpw/ticket',
                ticket: localStorage.getItem(LOGIN_TICKET),
            }
        }
        const user_info = await srv.request(
            "execute_cmd",
            ["refinejs.query_classes.GetUserInfo", kwargs],
            null
        );
        
        save_user_info(user_info?.info);
        
        localStorage.setItem(TOKEN_KEY, `${username}-${password}`);

        return Promise.resolve();
    },

    logout: () => {
        const srv = new TACTIC();
        srv.request(
            "execute_cmd",
            ["SignOutCmd", { login: localStorage.getItem(USER_NAME)}],
            null
        );
        remove_user_info();
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("was_reloaded");
        setTimeout(function () {
            window.location.href = "/tactic/refine_test";
        }, 5 * 100);
        return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
            return Promise.resolve();
        }

        return Promise.reject();
    },
    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
        var role = '';
        const ticket = localStorage.getItem(LOGIN_TICKET);
        if (!ticket) {
            return Promise.reject();
        }
        return Promise.resolve({
            id: localStorage.getItem(USER_ID),
            name: localStorage.getItem(USER_NAME),
            avatar: localStorage.getItem(USER_IMAGE_URL),
            role: role,
        });
    },
};
