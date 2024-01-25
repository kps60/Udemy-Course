import React, { useEffect, useRef, useState } from 'react'

import Button from './Button'
import './imageUpload.css'

const ImageUpload = (props) => {
    const filePickerRef = useRef()
    const [file, setFile] = useState()
    const [preview, setPreview] = useState()
    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        if (!file) {
            return
        }
        const fileReader = new FileReader()
        fileReader.onload = () => {
            setPreview(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }, [file])
    const pickIamgeHandler = () => {
        filePickerRef.current.click()
    }

    const pickedHandler = event => {
        let pickedFile;
        let fileIsValid = isValid
        if (event.target.files && event.target.files.length === 1) {
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            setIsValid(true)
            fileIsValid = true
        } else {
            setIsValid(false)
            fileIsValid = false
        }
        props.onInput(props.id, pickedFile, fileIsValid)
    }

    return (
        <div className='form-control'>
            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: 'none' }}
                type='file'
                accept='.jpg,.jpeg,.png,.JPG,.JPEG'
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className='image-upload__preview'>
                    {preview && <img src={preview} alt={'Preview'} />}
                    {!preview && <p>Please pick an image.</p>}
                </div>
                <Button type='button' onClick={pickIamgeHandler}>Click IMAGE</Button>
                {!isValid && <p>{props.errorText}</p>}
            </div>
        </div>
    )
}

export default ImageUpload
