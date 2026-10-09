import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import React, { useEffect, useState } from "react";
import {
    ImageOverlay,
    MapContainer,
    Marker,
    useMap,
    useMapEvents,
} from "react-leaflet";
import { blue } from "@mui/material/colors";
import { Tab } from "@mui/material";

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface ClickHandlerProps {
    onClick: (pos: [number, number]) => void;
}

interface GuessMapProps {
    onSubmit: (pos: [number, number]) => void;
}

const ClickHandler: React.FC<ClickHandlerProps> = ({
    onClick,
}) => {
    useMapEvents({
        click(e) {
            onClick([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
};

const MapResizer = ({
    bounds,
}: {
    bounds: L.LatLngBoundsExpression;
}) => {
    const map = useMap();
    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
            map.fitBounds(bounds, {
                animate: false,
                padding: [0, 0],
            });
        });
        resizeObserver.observe(map.getContainer());
        return () => resizeObserver.disconnect();
    }, [map, bounds]);
    return null;
};

export default function GuessMap({
    onSubmit,
}: GuessMapProps) {
    const [position, setPosition] = useState<
        [number, number] | null
    >(null);
    const [expanded, setExpanded] = useState(false);
    const [bounds, setBounds] =
        useState<L.LatLngBoundsExpression | null>(null);
    const [aspectRatio, setAspectRatio] =
        useState<number>(1);

    const imageUrl = "/map.png";

    useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setBounds([
                [0, 0],
                [img.naturalHeight, img.naturalWidth],
            ]);
            setAspectRatio(
                img.naturalWidth / img.naturalHeight,
            );
        };
        img.src = imageUrl;
    }, [imageUrl]);

    if (!bounds) return null;

    return (
        <div>
            <Paper
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                elevation={6}
                sx={{
                    width: expanded ? "50vw" : "240px",
                    aspectRatio: aspectRatio,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    transition: "width 0.3s ease",
                    borderRadius: 1,
                }}
            >
                <MapContainer
                    crs={L.CRS.Simple}
                    bounds={bounds}
                    minZoom={-1.9}
                    maxZoom={1}
                    zoomSnap={0}
                    style={{
                        flex: 1,
                        backgroundColor: "#222",
                    }}
                    attributionControl={false}
                >
                    <MapResizer bounds={bounds} />
                    <ImageOverlay
                        url={imageUrl}
                        bounds={bounds}
                    />
                    <ClickHandler onClick={setPosition} />
                    {position && (
                        <Marker
                            position={position}
                            icon={DefaultIcon}
                        />
                    )}
                </MapContainer>
            </Paper>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 1,
                }}
            >
                <Box
                    sx={{
                        borderRadius: "3px",
                        paddingLeft: "38px",
                        paddingRight: "38px",
                        paddingTop: "6px",
                        paddingBottom: "6px",
                    }}
                >
                    <Button
                        variant="contained"
                        onClick={() => {
                            if (position)
                                onSubmit(position);
                            console.log(
                                "Submitted:",
                                position,
                            );
                        }}
                        disabled={!position}
                        sx={{
                            "&.Mui-disabled": {
                                backgroundColor: "grey.300",
                                color: "grey.500",
                            },
                        }}
                    >
                        Submit The Guess
                    </Button>
                </Box>
            </Box>
        </div>
    );
}
