import React from 'react'
import DisplayActes from './DisplayActes'
import { Card, CardHeader, Checkbox, Divider } from '@mui/material'

export default function CustomList({ title, items, checked, handleToggle, handleToggleAll, numberOfChecked }) {
  return (
    <Card>
        <CardHeader
            sx={{ px: 2, py: 1 }}
            avatar={
                <Checkbox
                    onClick={handleToggleAll(items)}
                    checked={numberOfChecked(items) === items.length && items.length !== 0}
                    indeterminate={
                        numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
                    }
                    disabled={items.length === 0}
                    inputProps={{
                        'aria-label': 'all items selected',
                    }}
                />
            }
            title={title}
            subheader={`${numberOfChecked(items)}/${items.length} selected`}
        />
        <Divider />
        <DisplayActes
            items={items}
            checked={checked}
            handleToggle={handleToggle}
        />
    </Card>
  )
}
