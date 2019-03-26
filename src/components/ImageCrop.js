import React, { Component } from 'react';
import ReactCrop from 'react-image-crop';
import Dropzone from 'react-dropzone';
//import './custom-image-crop.css';
import 'react-image-crop/dist/ReactCrop.css'

import {base64StringtoFile,
    downloadBase64File,
    extractImageFileExtensionFromBase64,
    image64toCanvasRef} from '../ResuableUtils'

const imageMaxSize = 1000000 // bytes
const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {return item.trim()})

class ImageCrop extends Component {
    
    constructor(props){
        super(props)
        this.imagePreviewCanvasRef = React.createRef()
        this.fileInputRef = React.createRef()
        this.state = {
            imgSrc: null,
            imgSrcExt: null,
            crop: {
                x: 20,
                y: 10,
                width: 32,
                height: 18,
                aspect: 16/9
            }
        }
    }

    verifyFile = (files) => {
        if (files && files.length > 0){
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if(currentFileSize > imageMaxSize) {
                alert("This file is not allowed. " + currentFileSize + " bytes is too large")
                return false
            }
            if (!acceptedFileTypesArray.includes(currentFileType)){
                alert("This file is not allowed. Only images are allowed.")
                return false
            }
            return true
        }
    }

    handleOnDrop = (files, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0){
            this.verifyFile(rejectedFiles)
        }


        if (files && files.length > 0){
             const isVerified = this.verifyFile(files)
             if (isVerified){
                 // imageBase64Data 
                 const currentFile = files[0]
                 const myFileItemReader = new FileReader()
                 myFileItemReader.addEventListener("load", ()=>{
                     // console.log(myFileItemReader.result)
                     const myResult = myFileItemReader.result
                     this.setState({
                         imgSrc: myResult,
                         imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                     })
                 }, false)

                 myFileItemReader.readAsDataURL(currentFile)

             }
        }
    }


    handleImageLoaded = (image) => {
        //console.log(image)
    }
    handleOnCropChange = (crop) => {
        this.setState({crop:crop})
    }
    handleOnCropComplete = (crop, pixelCrop) =>{
        //console.log(crop, pixelCrop)

        const canvasRef = this.imagePreviewCanvasRef.current
        const {imgSrc}  = this.state
        image64toCanvasRef(canvasRef, imgSrc, pixelCrop)
    }
  
    handleDownloadClick = (event) => {
        event.preventDefault()
        const {imgSrc}  = this.state
        if (imgSrc) {
            const canvasRef = this.imagePreviewCanvasRef.current
        
            const {imgSrcExt} =  this.state
            const imageData64 = canvasRef.toDataURL('image/' + imgSrcExt)

      
            const myFilename = "previewFile." + imgSrcExt

            // file to be uploaded
            const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
            console.log('myNewCroppedFile ----', JSON.stringify(myNewCroppedFile));
            // download file
            downloadBase64File(imageData64, myFilename)
            this.handleClearToDefault()
        }
        

    }

    handleClearToDefault = event =>{
        if (event) event.preventDefault()
        const canvas = this.imagePreviewCanvasRef.current
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        this.setState({
            imgSrc: null,
            imgSrcExt: null,
            crop: {
                aspect: 1/1
            }

        })
        this.fileInputRef.current.value = null
    }
   

    handleFileSelect = event => {
        // console.log(event)
        const files = event.target.files
        if (files && files.length > 0){
              const isVerified = this.verifyFile(files)
             if (isVerified){
                 // imageBase64Data 
                 const currentFile = files[0]
                 const myFileItemReader = new FileReader()
                 myFileItemReader.addEventListener("load", ()=>{
                     // console.log(myFileItemReader.result)
                     const myResult = myFileItemReader.result
                     this.setState({
                         imgSrc: myResult,
                         imgSrcExt: extractImageFileExtensionFromBase64(myResult)
                     })
                     console.log('setState', this.setState);
                     
                 }, false)

                 myFileItemReader.readAsDataURL(currentFile)

             }
        }
    }
  render () {
      const {imgSrc} = this.state
    return (
      <div>
        <h1>Drop and Crop</h1>

        <input ref={this.fileInputRef} type='file' accept={acceptedFileTypes} multiple={false} onChange={this.handleFileSelect} />
        <br/>
        {imgSrc !== null ? 
            <div>
               

                 <ReactCrop 
                     src={imgSrc} 
                     crop={this.state.crop} 
                     onImageLoaded={this.handleImageLoaded}
                     onComplete = {this.handleOnCropComplete}
                     onChange={this.handleOnCropChange}/>

                  <br/>
                  <br/>

                  <br/>

                  <h1>Preview Canvas Crop </h1>
                  <canvas ref={this.imagePreviewCanvasRef}></canvas>
                  <button onClick={this.handleDownloadClick}>Download</button>
                  <button onClick={this.handleClearToDefault}>Clear</button>
                  <br/>
                  
              </div>

           : 

             <Dropzone onDrop={this.handleOnDrop} accept={acceptedFileTypes} multiple={false} maxSize={imageMaxSize}>Drop image here or click to upload</Dropzone>
         }
        
      </div>
    )
  }
}

export default ImageCrop;












// import React, { Component } from 'react';
// import ReactCrop from 'react-image-crop';
// import ReactDOM from 'react-dom';
// import Deropzone from 'react-dropzone';


// const imageMaxSize = 1000000000 // bytes
// const acceptedFileTypes = 'image/x-png, image/png, image/jpg, image/jpeg, image/gif'
// const acceptedFileTypesArray = acceptedFileTypes.split(",").map((item) => {return item.trim()})

// class ImageCrop extends Component {
//     constructor(props){
//         super(props)
//         this.imagePreviewCanvasRef = React.createRef()
//         this.fileInputRef = React.createRef()
//         this.state = {
//             src: null,
//             crop: {
//               x: 10,
//               y: 10,
//               width: 80,
//               height: 80,
//             }
//         }
//     }

//     verifyFile = (files) => {
//         if (files && files.length > 0){
//             const currentFile = files[0]
//             const currentFileType = currentFile.type
//             const currentFileSize = currentFile.size
//             if(currentFileSize > imageMaxSize) {
//                 alert("This file is not allowed. " + currentFileSize + " bytes is too large")
//                 return false
//             }
//             if (!acceptedFileTypesArray.includes(currentFileType)){
//                 alert("This file is not allowed. Only images are allowed.")
//                 return false
//             }
//             return true
//         }
//     }

//     handleFileSelect = event => {
//          console.log(event)
//         const files = event.target.files
//         if (files && files.length > 0){
//               const isVerified = this.verifyFile(files)
//              if (isVerified){
//                  // imageBase64Data 
//                  const currentFile = files[0]
//                  const myFileItemReader = new FileReader()
//                  myFileItemReader.addEventListener("load", ()=>{
//                      // console.log(myFileItemReader.result)
//                      const myResult = myFileItemReader.result
//                      this.setState({
//                          imgSrc: myResult
//                         // imgSrcExt: extractImageFileExtensionFromBase64(myResult)
//                      })
//                  }, false)

//                  myFileItemReader.readAsDataURL(currentFile)

//              }
//         }
//     }

//     onImageLoaded = image => {
//         console.log('onCropComplete', image)
//       }
    
//       onCropComplete = crop => {
//         console.log('onCropComplete', crop)
//       }
    
//       onCropChange = crop => {
//         this.setState({ crop })
//       }

//     render() {
//         return (
//             <div>
//                 {/* <input type='file' accept={acceptedFileTypes} multiple={false} onChange={this.handleFileSelect} /> */}
//                 <div className="App">
//         <div>
//           <input type="file" onChange={this.onSelectFile} />
//         </div>
//         {this.state.src && (
//           <ReactCrop
//             src={this.state.src}
//             crop={this.state.crop}
//             onImageLoaded={this.onImageLoaded}
//             onComplete={this.onCropComplete}
//             onChange={this.onCropChange}
//           />
//         )}
//       </div>
//             </div>
            
//         )
//     }
// }

// const rootElement = document.getElementById('root')
// ReactDOM.render(<ImageCrop />, rootElement)
// export default ImageCrop;

