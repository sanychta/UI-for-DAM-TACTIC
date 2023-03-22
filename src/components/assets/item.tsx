import { useState } from "react";
import { 
    useTranslate, 
    BaseKey, 
    useNavigation,
    CanAccess,
    useDelete
} from "@pankod/refine-core";
import {
    Card,
    CardHeader,
    Box,
    IconButton,
    CardMedia,
    CardContent,
    Typography,
    Tooltip,
    Popover,
    Button,
    Divider,
    TextField,
} from "@pankod/refine-mui";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import { 
    Preview,
    Delete,
    DeleteForever,
 } from "@mui/icons-material";

import { IAssets } from "../../interfaces";
import React from "react";

type AssetItem = {
    updateStock?: (changedValue: number, clickedProduct: IAssets) => void;
    assets: IAssets;
    showEdit: (id: BaseKey) => void;
};

export const AssetsItem: React.FC<AssetItem> = ({
    assets,
    showEdit,
    updateStock
}) => {
    const t = useTranslate();

    const { show } = useNavigation();

    const { mutate: mutateDelete } = useDelete();
    
    const { id, name, description, image, keywords } = assets; // code, 

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? "simple-popover" : undefined;

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "relative",
                height: "100%",
            }}
            
        >
            <CardHeader
                action={
                    <Box component="div">
                        <IconButton
                            aria-describedby={popoverId}
                            onClick={handleClick}
                            sx={{ marginRight: "10px", marginTop: "4px" }}
                            aria-label="settings"
                        >
                            <MoreVertIcon  fontSize="small" />
                        </IconButton>
                        <Popover
                            id={popoverId}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                        >
                            <Button
                                onClick={() => {
                                    show("assets", id);
                                    setAnchorEl(null);
                                }}
                                size="medium"
                                startIcon={<Preview />}
                                sx={{
                                    padding: "5px 10px",
                                }}
                            >
                                {t("assets.buttons.show")}
                            </Button>
                            <CanAccess
                                resource="assets"
                                action="edit"
                            >
                                <br></br>
                                <Button
                                    onClick={() => {
                                        showEdit(id);
                                        setAnchorEl(null);
                                    }}
                                    size="medium"
                                    startIcon={<EditIcon />}
                                    sx={{
                                        padding: "5px 10px",
                                    }}
                                >
                                    {t("assets.buttons.edit")}
                                </Button>
                                </CanAccess>
                                <br></br>
                                <CanAccess
                                    resource="assets"
                                    action="delete"
                                >
                                <Button
                                    onClick={() => {
                                        mutateDelete({
                                            resource: "assets",
                                            id: id,
                                            values: { retired: true },
                                            mutationMode: "undoable"
                                        });
                                    }}
                                    size="medium"
                                    startIcon={<Delete />}
                                    sx={{
                                        padding: "5px 10px",
                                    }}
                                >
                                    {t("assets.buttons.retired")}
                                </Button>
                                <br></br>
                                <Button
                                    onClick={() => {
                                        mutateDelete({
                                            resource: "assets",
                                            id: id,
                                            values: { retired: false },
                                            mutationMode: "undoable"
                                        });
                                    }}
                                    size="medium"
                                    startIcon={<DeleteForever />}
                                    sx={{
                                        padding: "5px 10px",
                                    }}
                                >
                                    {t("assets.buttons.delete")}
                                </Button>
                            </CanAccess>
                        </Popover>
                    </Box>
                }
                sx={{ padding: 0 }}
            />
            <Card onClick={() => {show("assets", id);setAnchorEl(null);}}
                sx={{ 
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    height: "100%",
                    cursor: "pointer",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{
                            width: { xs: 144, sm: 144, lg: 144, xl: 144 },
                            height: { xs: 144, sm: 144, lg: 144, xl: 144 },
                            borderRadius: "50%",
                        }}
                        alt={image.name}
                        image={image.url}
                    />
                </Box>
                    <CardContent
                        sx={{
                            paddingX: "36px",
                            display: "flex",
                            flexDirection: "column",
                            flex: 0.5,
                        }}
                    >
                    <Divider />
                    <Tooltip title={assets.name}>
                        <Typography
                            sx={{
                                fontWeight: 800,
                                fontSize: "18px",
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {/* <Box sx={{ margin: 0.2, placement: "top", padding: 0.2, boxShadow: 1, borderRadius: 2, p: 1, }}> */}
                                {name}
                            {/* </Box> */}
                        </Typography>
                    </Tooltip>
                    <Tooltip title={description}>
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 2,
                                overflowWrap: "anywhere",
                                color: "text.secondary",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: "3",
                                WebkitBoxOrient: "vertical",
                                flex: 1,
                            }}
                        >
                                {description}
                        </Typography>
                    </Tooltip>
                    {/* <Typography
                        variant="h6"
                    >{code}</Typography> */}
                    <Tooltip title={keywords} placement="top">
                        <Typography
                            sx={{
                                fontWeight: 500,
                                fontSize: "10px",
                                overflowWrap: "break-word",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                            }}
                        >
                                {keywords}
                        </Typography>
                    </Tooltip>
                    {updateStock && (
                        <TextField
                            type="number"
                            margin="dense"
                            size="small"
                            value={assets.pipeline_code || 0}
                            onChange={(e) => {
                                e.preventDefault();
                                updateStock(parseInt(e.target.value, 10), assets);
                            }}
                        />
                    )}
                </CardContent>
            </Card>
        </Card>
    );
};
