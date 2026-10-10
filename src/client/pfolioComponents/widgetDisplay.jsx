
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

function WidgetDisplay( {widgets} ){

    return (
        <>
            <p>Widgets: {JSON.stringify(widgets)}</p>
        </>
    );
}
export default WidgetDisplay;