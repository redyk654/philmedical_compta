import { Checkbox, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { extraireCode } from '../../shared/functions/functions';
import { Delete } from '@mui/icons-material';

export default function DisplayActes({ items, checked, handleToggle, deleteActe }) {
  return (
    <List
        sx={{
            width: 415,
            height: 280,
            bgcolor: 'background.paper',
            overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
    >
        {items.map((item) => {
            const labelId = `transfer-list-all-item-${item.id}-label`;

            return (
                <ListItemButton
                    key={item.id}
                    role="listitem"
                    onClick={handleToggle(item)}
                >
                    <ListItemIcon>
                        <Checkbox
                            checked={checked.indexOf(item) !== -1}
                            tabIndex={-1}
                            disableRipple
                            inputProps={{
                            'aria-labelledby': labelId,
                            }}
                        />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`${extraireCode(item.designation)}`} />
                    <ListItemIcon>
                        <ListItemText id={labelId} primary={`(${item.prix})`} />
                    </ListItemIcon>
                    <ListItemIcon>
                        <IconButton
                            edge="end"
                            color="error"
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                deleteActe(item);
                            }}
                        >
                            <Delete />
                        </IconButton>
                    </ListItemIcon>
                </ListItemButton>
            );
        })}
    </List>
  )
}
