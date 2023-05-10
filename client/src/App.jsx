import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Editor from './Editor.jsx';
import EditIcon from '@mui/icons-material/Edit';

const endpoint = 'http://localhost:5001';

function App() {
const [selectedFile, setSelectedFile] = useState(null);
const [message, setMessage] = useState(false);
const [imageList, setImageList] = useState([]);
const [isRenamed, setIsRenamed] = useState(false);
const [currentImage, setCurrentImage] = useState(undefined);


// Fetch the image list whenever an upload or a rename is done
useEffect(() => {
    fetch(`${endpoint}/images`)
  .then(response => response.json())
  .then(data => {
    setImageList(data)
  })
  .catch(error => console.error(error));
}, [message, isRenamed])

const updateMessage = () => {
    setMessage(!message);
};

const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
};

const handleRename = (imageName) => {

    Swal.fire({
        title: 'Nouveau nom du fichier',
        input: 'text',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Valider',
        cancelButtonText: 'Annuler',
        showLoaderOnConfirm: true,
        preConfirm: (newFilename) => {
          return fetch(`${endpoint}/upload/${imageName}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ newFilename })
          })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText)
                }
            return response.text()
        })
        .then(data => {
        })
        .catch(error => {
              Swal.showValidationMessage(
                `Request failed: ${error}`
              )
            })
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
            setIsRenamed(!isRenamed);
          Swal.fire({
            icon: 'success',
            title: `Image renommée avec succès`,
            showConfirmButton: false,
            timer: 1500
          })
        }
    })
}

  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      return setMessage('Veuillez sélectionner un fichier');
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${endpoint}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to upload file');
      }

      setMessage(!message);
    //   Swal.fire({
    //     position: 'top-end',
    //     icon: 'success',
    //     title: 'Téléversement réussi.',
    //     showConfirmButton: false,
    //     timer: 1500
    //   })
    } catch (error) {
      console.error(error);
      setMessage(!message);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: "Le téléversement a échoué, assurez-vous de n'envoyer que des images.",
        showConfirmButton: false,
        timer: 2000
      })
    }
  }

  const handleEditorDisplay = (imageName) => {
    setCurrentImage(imageName);
  }

  return (
    <div className="main-container">
        <form onSubmit={handleUpload}>
            <input type="file" onChange={handleFileInputChange} id="fileInput" />
            <button type="submit">Upload</button>
        </form>
        <div className="gallery-container">

        <section className="gallery">
            {(typeof imageList.images === 'undefined') ? (
                <p>Chargement...</p>
            ): (
            imageList.images.map((imageName) => (
                <div className="preview-container" key={imageName}>
                    <img className="image-preview" key={imageName} src={`${endpoint}/${imageName}`} onClick={() => handleEditorDisplay(imageName)} alt={imageName} />
                    <div className="preview-title-container">
                        <p title={imageName} key={`${imageName}-name`}>{imageName}</p>
                        <button className="rename-button" key={`${imageName}-button`} onClick={() => handleRename(imageName)}><EditIcon fontSize="small" /></button>
                    </div>
                </div>
            ))
            )}
        </section>
        </div>
        <Editor currentImage={currentImage} updateMessage={updateMessage} />
    </div>
  );
}

export default App;