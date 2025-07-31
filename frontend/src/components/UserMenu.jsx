import { useState } from "react";
import {
  Tooltip,
  Menu,
  IconButton,
  MenuItem,
  Avatar,
  ListItemIcon,
  Box,
} from "@mui/material";
import { Logout, Person, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../lib/api";
import queryClient from "../config/queryClient";

const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <Box sx={{ position: "fixed", bottom: 10, left: 0 }}>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleOpen}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 42, height: 42 }}></Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        id="account-menu"
        onClose={handleClose}
        onClick={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MenuItem onClick={() => navigate("/")}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate("/settings")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={signOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default UserMenu;
