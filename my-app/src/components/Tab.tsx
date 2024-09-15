import React from 'react';

import HomeIcon from '@mui/icons-material/Home';
import './Tab.scss';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import RateReviewIcon from '@mui/icons-material/RateReview';

import MenuIcon from '@mui/icons-material/Menu';

import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';

const ROOT = 'adb-tab';

type Props = {
  handleChange: (newValue: number) => void;
};

const IconTabs = (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onClickMenuItem = (idx: number) => {
    handleClose();
    props.handleChange(idx);
  };

  return (
    <div className={`${ROOT}`}>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }}>
          <MenuIcon />
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 34,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => onClickMenuItem(0)}>
          <ListItemIcon>
            <HomeIcon fontSize="medium" />
          </ListItemIcon>
          Main
        </MenuItem>
        <MenuItem onClick={() => onClickMenuItem(1)}>
          <ListItemIcon>
            <HelpCenterIcon fontSize="medium" />
          </ListItemIcon>
          Help
        </MenuItem>
        <MenuItem onClick={() => onClickMenuItem(2)}>
          <ListItemIcon>
            <RateReviewIcon fontSize="medium" />
          </ListItemIcon>
          Feedback
        </MenuItem>
      </Menu>
    </div>
  );
};

export default IconTabs;
