import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useModel } from "../../context/ModelContext";

export type BoardFilter = "all" | "lost" | "found";

export type UserFilter = "all" | "me" | string;

interface BoardFiltersProps {
    search: string;
    filter: BoardFilter;
    userFilter: UserFilter;
    userOptions: {
        user_id: string;
        display_name: string;
    }[];
    archive: boolean;

    onSearchChange: (value: string) => void;
    onFilterChange: (value: BoardFilter) => void;
    onUserFilterChange: (value: UserFilter) => void;
    onArchiveChange: (value: boolean) => void;
    onCreatePost: () => void;
}

export default function BoardFilters({ search, filter, userFilter, userOptions, archive, onSearchChange, onFilterChange, onUserFilterChange, onArchiveChange, onCreatePost }: BoardFiltersProps) {
    const { model } = useModel();
    return (
        <Box
            sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
            }}
        >
            <TextField
                label="Search posts"
                size="small"
                value={search}
                onChange={(event) =>
                    onSearchChange(event.target.value)
                }
                sx={{
                    flex: 1,
                    minWidth: 200,
                }}
            />

            <FormControl
                size="small"
                sx={{
                    minWidth: 140,
                }}
            >
                <InputLabel>Type</InputLabel>

                <Select
                    value={filter}
                    label="Type"
                    onChange={(event) =>
                        onFilterChange(
                            event.target.value as BoardFilter
                        )
                    }
                >
                    <MenuItem value="all">All Posts</MenuItem>
                    <MenuItem value="lost">Lost</MenuItem>
                    <MenuItem value="found">Found</MenuItem>
                </Select>
            </FormControl>

            <FormControl
                size="small"
                sx={{
                    minWidth: 180,
                }}
            >
                <InputLabel>Posted By</InputLabel>

                <Select
                    value={userFilter}
                    label="User"
                    onChange={(event) =>
                        onUserFilterChange(
                            event.target.value as UserFilter
                        )
                    }
                >
                    <MenuItem value="me">
                        {model.currUser?.display_name} (Me)
                    </MenuItem>

                    <MenuItem value="all">
                        All Users
                    </MenuItem>

                    {userOptions.map((user) => (
                        <MenuItem
                            key={user.user_id}
                            value={user.user_id}
                        >
                            {user.display_name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControlLabel
                control={
                    <Switch
                        checked={archive}
                        onChange={(event) =>
                            onArchiveChange(event.target.checked)
                        }
                    />
                }
                label="Archive"
            />

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onCreatePost}
                sx={{
                    whiteSpace: "nowrap",
                }}
            >
                Create Post
            </Button>
        </Box>
    );
}