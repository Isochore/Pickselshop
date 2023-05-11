import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import classes from './styles/editor.module.css';

const endpoint = 'http://localhost:5001';

const filterObject = {
    blackWhite : classes.blackWhiteFilter,
    sepia : classes.sepiaFilter,
    none : ''
}

function Editor(props) {
    const [filterType, setFilterType] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isObjectFit, setIsObjectFit] = useState('contain');
    const [resizeValues, setResizeValues] = useState({
        width: 0,
        height: 0,
    });
    const [confirmedResizeValues, setConfirmedResizeValues] = useState({
        width: 0,
        height: 0,
    });
    // const [currentImageRatio, setCurrentImageRatio] = useState('90%');


    const handleFilter = (filter) => {
        setFilterType(filterObject[filter]);
    };

    const handleResize = () => {
        setIsVisible(!isVisible);
    };

    const handleResizeChange = (event) => {
        const { name, value } = event.target;
        setResizeValues((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleResizeValidation = () => {
        Swal.fire({
            icon: 'error',
            title: "Cette fonctionnalité n'est pas encore disponible",
        })
        setIsVisible(!isVisible)
        // setIsObjectFit(classes.objectFitInherit);
        // setConfirmedResizeValues({
        //     ...confirmedResizeValues,
        //     width: resizeValues.width,
        //     height: resizeValues.height,
        // });
    };

    const handleSave = () => {
        fetch(`${endpoint}/black-white/${props.currentImage}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            }
        })
        .then((response) => {
            if (!response.ok) {
            throw new Error('Failed to apply black and white filter');
            }
            console.log('Black and white filter applied successfully');
            props.updateMessage();
        })
        .catch((error) => {
            console.error('Error:', error.message);
        });
    }

    // Clear filters when image is changed
    useEffect(() => {
        handleFilter('none');
        setIsObjectFit(classes.objectFitContain);
        setConfirmedResizeValues({
            ...confirmedResizeValues,
            width: 0,
            height: 0,
        });
    }, [props.currentImage])

    return (
        <div className={classes.editorContainer}>
            <div className={classes.editorMenu}>
                <button title="Rogner" className={classes.editorButton}><span className="material-symbols-outlined">crop</span></button>
                <div className={classes.resizeContainer}>
                    <button title="Redimensionner" className={classes.editorButton} onClick={() => handleResize()}><span className="material-symbols-outlined">aspect_ratio</span></button>
                    <div className={classes.resizeFigures} style={{visibility: isVisible ? 'visible' : 'hidden', display: isVisible ? 'flex' : 'none'}}>
                        <div className={classes.resizeInputContainer}>
                            <span className={classes.resizeLabel}>Width :</span>
                            <input name="width" className={classes.resizeInput} value={resizeValues.width} onChange={handleResizeChange} min="0" type="number" />
                        </div>
                        <div className={classes.resizeInputContainer}>
                            <span className={classes.resizeLabel}>Height :</span>
                            <input name="height" className={classes.resizeInput} value={resizeValues.height} onChange={handleResizeChange} min="0" type="number" />
                        </div>
                        <div className={classes.resizeButtonContainer}>
                            <button className={classes.resizeButton} onClick={() => handleResizeValidation()} >
                                <span className="material-symbols-outlined">done</span>
                            </button>
                        </div>
                    </div>
                </div>
                <button title="Noir et blanc" className={classes.editorButton} onClick={() => handleFilter('blackWhite')}><span className="material-symbols-outlined">filter_b_and_w</span></button>
                <button title="Sepia" className={classes.editorButton} onClick={() => handleFilter('sepia')}><span className="material-symbols-outlined">auto_awesome</span></button>
                <button title="Enregistrer" className={classes.editorButton} onClick={() => handleSave()} ><span className="material-symbols-outlined">save</span></button>
                <button title="Télécharger" className={classes.editorButton}><span className="material-symbols-outlined">download</span></button>
            </div>
            <div className={classes.currentImageContainer}>
                {(typeof props.currentImage === 'undefined') ? (<p>No image selected.</p>) : (<img className={`${classes.currentImage} ${filterType} ${isObjectFit}`} style={confirmedResizeValues.width === 0 ? { width: confirmedResizeValues.width >  confirmedResizeValues.height ? '90%' : 90 * confirmedResizeValues.width / confirmedResizeValues.height + '%', height: confirmedResizeValues.height >  confirmedResizeValues.width ? '90%' : 90 * (confirmedResizeValues.height / confirmedResizeValues.width) + '%'} : {width: '90%'}} src={`http://localhost:5001/${props.currentImage}`} alt={props.currentImage} />)}
            </div>
        </div>
    );
}

export default Editor;