import PropTypes from 'prop-types';
import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

export default function OpenChatDialog(props) {
    const { onClose, selectedValue, open, botList } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Who do you want to talk with:</DialogTitle>
            <List sx={{ pt: 0 }}>
                {botList.map((bot) => (
                    <ListItem key={bot.name}>
                        <ListItemButton onClick={() => handleListItemClick(bot.name)}>
                            <ListItemText primary={`${bot.name}: ${bot.description}`} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

OpenChatDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
    botList: PropTypes.array.isRequired
};