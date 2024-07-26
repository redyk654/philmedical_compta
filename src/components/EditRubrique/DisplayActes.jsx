import { Checkbox, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import React from 'react'
import { extraireCode } from '../../shared/functions/functions';

export default function DisplayActes({ items, checked, handleToggle }) {
  return (
    <List
        sx={{
            width: 375,
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
                </ListItemButton>
            );
        })}
    </List>
  )
}
