import * as React from "react";
import { useForm } from "@pankod/refine-react-hook-form";
import {
    Button,
    TextField,
    // FormControlLabel,
    // Checkbox,
    // Link,
    Box,
    Typography,
    Container,
    Card,
    CardContent,
} from "@pankod/refine-mui";

import {
    BaseRecord,
    HttpError,
    useLogin,
    useTranslate,
} from "@pankod/refine-core";

import { ILoginInfo } from "../../interfaces";

setTimeout( async function () {
        document.getElementById('logon-button')?.click()
}, 5 * 100);

export const LoginPage: React.FC<ILoginInfo> = ({ name, ticket}) => {
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BaseRecord, HttpError, ILoginInfo>();

    const { mutate: login, isLoading } = useLogin<ILoginInfo>();
    const translate = useTranslate();

    return (
        <>
            <Box
                component="div"
                sx={{
                    background:
                        "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('/assets/images/Tactic+Project+3.png')",
                    backgroundSize: "cover",
                }}
            >
                <Container
                    component="main"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100vh",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        {/* <Box
                            sx={{
                                width: { xs: 200, lg: "auto" },
                            }}
                        >
                            <img
                                src="/images/fine-foods-login.svg"
                                alt="fineFoods Logo"
                                style={{ width: "100%" }}
                            />
                        </Box> */}
                        <Box maxWidth="400px" mt={4}>
                            <Card sx={{ padding: 1 }}>
                                <CardContent>
                                    <Typography
                                        variant="h4"
                                        align="center"
                                        sx={{
                                            fontWeight: "700",
                                            color: "text.primary",
                                        }}
                                    >
                                        <Box
                                            component="span"
                                            color="primary.main"
                                        >
                                            {translate(
                                                "pages.login.title",
                                                "Sign in ",
                                            )}
                                        </Box>
                                    </Typography>
                                    <Box
                                        component="form"
                                        onSubmit={handleSubmit((data) => {
                                            login(data);
                                        })}
                                    >
                                        <TextField
                                            {...register("name", {
                                                required: true,
                                            })}
                                            id="user_name"
                                            margin="normal"
                                            value={name}
                                            fullWidth
                                            label={translate(
                                                "pages.login.username",
                                                "Username",
                                            )}
                                            name="user_name"
                                            autoComplete="user_name"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            autoFocus
                                        />
                                        <TextField
                                            {...register("ticket", {
                                                required: true,
                                            })}
                                            id="password"
                                            margin="normal"
                                            fullWidth
                                            name="password"
                                            value={ticket}
                                            label={translate(
                                                "pages.login.password",
                                                "Password",
                                            )}
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            helperText={
                                                errors?.ticket?.message
                                            }
                                            type="password"
                                            placeholder="●●●●●●●●"
                                            autoComplete="current-password"
                                        />
                                        <Box
                                            component="div"
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                        </Box>
                                        <Button
                                            type="submit"
                                            id="logon-button"
                                            fullWidth
                                            variant="contained"
                                            sx={{
                                                my: "8px",
                                                color: "white",
                                            }}
                                            disabled={isLoading}
                                        >
                                            {translate(
                                                "pages.login.signin",
                                                "Sign in",
                                            )}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </>
    );
};
