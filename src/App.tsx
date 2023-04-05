import { 
    Refine, 
} from "@pankod/refine-core";
import { 
    createContext, 
    // useContext 
} from 'react';
import { KBarProvider } from "@pankod/refine-kbar";

import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  Layout,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-mui";
import MovieFilterTwoToneIcon from '@mui/icons-material/MovieFilterTwoTone';
// import TheatersTwoToneIcon from '@mui/icons-material/TheatersTwoTone';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
// import TakeoutDiningOutlinedIcon from '@mui/icons-material/TakeoutDiningOutlined';
import BoxIcon from './contexts/box_icon';

import { authProvider } from "./authProvider";

import routerProvider from "@pankod/refine-react-router-v6";

import { DashboardPage } from "./pages/dashboard";

import { useTranslation } from "react-i18next";

import { ColorModeContextProvider } from "./contexts";

import { UserList, LoginShow } from "./pages/userslist";

import { AssetsList, AssetShow, } from "./pages/assets";

import { AssetsCategoryList } from "./pages/assets_category";

import { Header, Title, } from "./components";

import { ScenesList, SceneShow } from "./pages";

import { TasksList, TaskShow } from "./pages";

import { LoginPage } from "./pages/login";

import TacticDataProvider from './tactic/tacticdataprovider';

import { ILoginInfo } from "./interfaces";

import React from "react";

import TACTIC from "./tactic/Tactic";
import Cookies from "universal-cookie";
import {
    LOGIN_TICKET,
    USER_NAME,
    // USER_GROUP,
    USER_ROLE,
} from "./conf";

const cookies = new Cookies();

const username = async () => {

    const data = await new TACTIC().request(
        'execute_cmd',
        ['refinejs.query_classes.GetUserInfo',
            {
                data: {
                    resource: 'sthpw/ticket',
                    ticket: cookies.get(LOGIN_TICKET)
                }
            }],
        null);
    // console.log("🚀 ~ file: App.tsx:70 ~ username ~ data", data)
    localStorage.setItem('USER_INFO', JSON.stringify(data?.info));
    localStorage.setItem(USER_NAME, data.info?.name);
    localStorage.setItem(LOGIN_TICKET, cookies.get(LOGIN_TICKET));
};

export const LoginedUser = createContext('')

function App() {
    username();


    
    const { t, i18n } = useTranslation();
    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    const { RouterComponent } = routerProvider;
    const CustomRouterComponent = () => <RouterComponent basename="/tactic/refine_test" />;
    const login_info: ILoginInfo = {
        name: localStorage.getItem(USER_NAME) ?? 'admin',
        ticket: localStorage.getItem(LOGIN_TICKET) ?? 'password',
        role: localStorage.getItem(USER_ROLE) ?? 'editor',
    };
    // const user_role = localStorage.getItem(USER_ROLE) ?? 'editor';

    return (
        <React.Suspense>
        <KBarProvider>
        <ColorModeContextProvider>
            <CssBaseline />
            <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
            <RefineSnackbarProvider>
            <Refine
                authProvider={authProvider}
                notificationProvider={notificationProvider}
                i18nProvider={i18nProvider}
                DashboardPage={DashboardPage}
                LoginPage={() => <LoginPage 
                    name={login_info.name} 
                    ticket={String(localStorage.getItem(LOGIN_TICKET))} 
                    role={String(localStorage.getItem(USER_ROLE))}/>
                }
                Title={Title}
                Layout={Layout}
                ReadyPage={ReadyPage}
                Header={Header}
                catchAll={<ErrorComponent />}

                accessControlProvider={{
                    can: async ({resource, action, params}) => {
                        const roles = localStorage.getItem(USER_ROLE);
                        if (roles === 'editor'){
                            if (resource === "assets" && (action === "create" || action === "edit" || action === "delete")) {
                                return Promise.resolve({
                                    can: false,
                                    reason: "Not enough rights",
                                });
                            }
                            if (resource === "logins" && action === "list") {
                                return Promise.resolve({
                                    can: false,
                                    reason: "Not enough rights",
                                });
                            }
                            if (resource === "categories" && (action === "create" || action === "edit")) {
                                return Promise.resolve({
                                    can: false,
                                    reason: "Not enough rights",
                                });
                            }
                        }

                        return Promise.resolve({can: true });
                    },
                }}

                routerProvider={{
                    ...routerProvider,
                    RouterComponent: CustomRouterComponent,
                }}

                // options={{
                //     breadcrumb: false,
                // }}

                dataProvider={TacticDataProvider()}
                resources={[
                    {
                        name: "mytask",
                        options: { label: String(t("My task"))},
                    },
                    {
                        name: "My episodes",
                        parentName: "mytask",
                        options: { label: "My Episodes" },
                        list: UserList
                    },
                    {
                        name: "My assets",
                        parentName: "mytask",
                        options: { label: String(t("My Assets"))},
                        list: UserList
                    },
                    {
                        name: "logins", //"sthpw/login",
                        options: { label: String(t("userslogins.logins"))},
                        list: UserList,
                        // create: PostCreate,
                        // edit: PostEdit,
                        show: LoginShow,
                        icon: <GroupOutlinedIcon />,
                    },
                    {
                        name: "assets", // "dolly3d/assets&dolly3d",
                        options: { label: String(t("assets.assets"))},
                        list: AssetsList,
                        show: AssetShow,
                        icon: <BoxIcon viewBox="0 0 16 16"/>
                        // icon: <TakeoutDiningOutlinedIcon />,
                        // canDelete: true,
                        // create: CreateAsset,
                    },
                    {
                        name: "categories", // "complex/assets_category&dolly3d",
                        options: { label: String(t("categories.categories")) },
                        list: AssetsCategoryList,
                        icon: <CategoryOutlinedIcon />
                        // create: AssetCategoryCreate,
                    },
                    {
                        name: "scenes", // "complex/assets_category&dolly3d",
                        options: { label: String(t("scenes.scenes")) },
                        list: ScenesList,
                        show : SceneShow,
                        icon: <MovieFilterTwoToneIcon />,
                        // create: AssetCategoryCreate,
                    },
                    {
                        name: "tasks", // "complex/assets_category&dolly3d",
                        options: { label: String(t("task.task")) },
                        list: TasksList,
                        show: TaskShow,
                        icon: <InventoryOutlinedIcon />,
                        // show: SceneShow,
                        // create: AssetCategoryCreate,
                    },
                ]}
            />
            </RefineSnackbarProvider>
        </ColorModeContextProvider>
        </KBarProvider>
        </React.Suspense>
    );
}

export default App;
