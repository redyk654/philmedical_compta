import React from 'react';
import { useParams } from 'react-router-dom';
import CustomTitle from '../shared/components/CustomTitle';
import { Button, Card, CardHeader, Checkbox, Container, Divider, Grid, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function EditRubrique() {

    const { rubriqueId } = useParams();
    const rubrique = rubriqueId.split('-');

    const [checked, setChecked] = React.useState([]);
    const [left, setLeft] = React.useState([0, 1, 2, 3]);
    const [right, setRight] = React.useState([4, 5, 6, 7]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items) => intersection(checked, items).length;

    const handleToggleAll = (items) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const customList = (title, items) => (
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
            <List
                sx={{
                    width: 300,
                    height: 280,
                    bgcolor: 'background.paper',
                    overflow: 'auto',
                }}
                dense
                component="div"
                role="list"
            >
            {items.map((value) => {
                const labelId = `transfer-list-all-item-${value}-label`;

                return (
                <ListItemButton
                    key={value}
                    role="listitem"
                    onClick={handleToggle(value)}
                >
                    <ListItemIcon>
                    <Checkbox
                        checked={checked.indexOf(value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{
                        'aria-labelledby': labelId,
                        }}
                    />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={`List item ${value + 1}`} />
                </ListItemButton>
                );
            })}
            </List>
        </Card>
    );

  return (
    <Container>
        <CustomTitle text={`Editer ${rubrique[1]}`} />

        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>{customList(`${rubrique[1]}`, left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList('Toutes les rubriques', right)}</Grid>
        </Grid>
    </Container>
  );
}

