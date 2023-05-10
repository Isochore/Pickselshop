import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import classes from './styles/editor.module.css';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import CropIcon from '@mui/icons-material/Crop';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import FilterBAndWIcon from '@mui/icons-material/FilterBAndW';
import DoneIcon from '@mui/icons-material/Done';

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
            <button title="Rogner" className={classes.editorButton}><CropIcon /></button>
            <div className={classes.resizeContainer}>
                <button title="Redimensionner" className={classes.editorButton} onClick={() => handleResize()}><AspectRatioIcon /></button>
                <div className={classes.resizeFigures} style={{visibility: isVisible ? 'visible' : 'hidden', display: isVisible ? 'flex' : 'none'}}>
                    <div className={classes.resizeInputContainer}>
                        <span className={classes.resizeLabel}>Largeur :</span>
                        <input name="width" className={classes.resizeInput} value={resizeValues.width} onChange={handleResizeChange} min="0" type="number" />
                    </div>
                    <div className={classes.resizeInputContainer}>
                        <span className={classes.resizeLabel}>Hauteur :</span>
                        <input name="height" className={classes.resizeInput} value={resizeValues.height} onChange={handleResizeChange} min="0" type="number" />
                    </div>
                    <div className={classes.resizeButtonContainer}>
                        <button className={classes.resizeButton} onClick={() => handleResizeValidation()} >
                            <DoneIcon />
                        </button>
                    </div>
                </div>
            </div>
            <button title="Noir et blanc" className={classes.editorButton} onClick={() => handleFilter('blackWhite')}><FilterBAndWIcon /></button>
            <button title="Sepia" className={classes.editorButton} onClick={() => handleFilter('sepia')}><AutoAwesomeIcon /></button>
            <button title="Enregistrer" className={classes.editorButton}><SaveIcon /></button>
            <button title="Télécharger" className={classes.editorButton}><DownloadIcon /></button>
        </div>
        <div className={classes.currentImageContainer}>
            {(typeof props.currentImage === 'undefined') ? (<p>Pas d'image sélectionnée</p>) : (<img className={`${classes.currentImage} ${filterType} ${isObjectFit}`} style={confirmedResizeValues.width === 0 ? { width: confirmedResizeValues.width >  confirmedResizeValues.height ? '90%' : 90 * confirmedResizeValues.width / confirmedResizeValues.height + '%', height: confirmedResizeValues.height >  confirmedResizeValues.width ? '90%' : 90 * (confirmedResizeValues.height / confirmedResizeValues.width) + '%'} : {width: '90%'}} src={`http://localhost:5001/${props.currentImage}`} alt={props.currentImage} />)}
        </div>
    </div>
  );
}

export default Editor;