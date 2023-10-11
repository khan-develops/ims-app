import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const SortIcon = ({ sort }: { sort: { column: string; direction: '' | 'ASC' | 'DESC' } }): JSX.Element => {
    if (sort.direction === 'ASC') {
        return <KeyboardArrowUpIcon fontSize="small" />;
    }
    if (sort.direction === 'DESC') {
        return <KeyboardArrowDownIcon fontSize="small" />;
    }
    return <></>;
};

export default SortIcon;
