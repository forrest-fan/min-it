import React from 'react';

function TextArea(props) {
    
    return (
        <textarea value={props.notes} onChange={(e) => {props.handleChange(e.target.value)}}/>
    );
}

export default TextArea;
