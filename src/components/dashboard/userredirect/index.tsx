import { 
    useTranslate, 
    useNavigation, 
    CanAccess
} from "@pankod/refine-core";
import { 
    Box, 
    Button, 
    // NumberField, 
    Stack, 
    Typography 
} from "@pankod/refine-mui";
// import dayjs from "dayjs";
// import { LineChart, Line, Tooltip, ResponsiveContainer } from "recharts";
// import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

export const UserRedirect: React.FC = () => {
    const t = useTranslate();

    // const API_URL = useApiUrl();
    // const url = `${API_URL}/dailyRevenue`;
    // const query = {
    //     start: dayjs().subtract(7, "days").startOf("day"),
    //     end: dayjs().startOf("day"),
    // };

    // const { data } = useCustom<{
    //     data: ISalesChart[];
    //     total: number;
    //     trend: number;
    // }>({
    //     url,
    //     method: "get",
    //     config: {
    //         query,
    //     },
    // });

    const { list } = useNavigation();

    return (
        <CanAccess
            resource='logins'
            action='list'
        >
            <Box
                sx={{
                    height: "230px",
                    p: 1,
                    background: "url(images/daily-revenue.png)",
                    backgroundColor: "#3a233c",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right",
                }}
            >
                <Stack>
                    <Typography
                        variant="h5"
                        sx={{ color: "#fff", fontWeight: 700, mb: 0 }}
                    >
                        {t("dashboard.dailyRevenue.title")}
                    </Typography>
                        <Button variant="outlined" onClick={() => {
                                list("logins");
                            }}>Logins
                        </Button>
                    {/* <Stack direction="row" alignItems="center">
                        <NumberField
                            style={{ fontSize: 36 }}
                            sx={{ fontWeight: 700, color: "#fff" }}
                            options={{
                                currency: "USD",
                                style: "currency",
                                notation: "compact",
                            }}
                            value={data?.data.total ?? 0}
                        />
                        {(data?.data?.trend ?? 0) > 0 ? (
                            <ArrowDropUp fontSize="large" color="success" />
                        ) : (
                            <ArrowDropDown fontSize="large" color="error" />
                        )}
                    </Stack> */}
                </Stack>
                <Box sx={{ height: "130px" }}>
                    {/* <ResponsiveContainer width="99%">
                        <LineChart data={data?.data.data}>
                            <Line
                                type="natural"
                                dataKey="value"
                                stroke="rgba(255, 255, 255, 0.5)"
                                dot={false}
                                strokeWidth={4}
                            /> */}
                            {/* <Tooltip content={<ChartTooltip suffix="$" />} /> */}
                        {/* </LineChart>
                    </ResponsiveContainer> */}
                </Box>
            </Box>
        </CanAccess >
    );
};
