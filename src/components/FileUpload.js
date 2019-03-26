import React, { Component } from "react";
import axios from "axios";
import { Button, ButtonGroup } from "reactstrap";
import ImageDisplay from "./ImageDisplay";

class FileUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      description: ""
    };
    this.descriptionHandler = this.descriptionHandler.bind(this);
  }

  fileChangedHandler = event => {
    console.log("event.target.files[0] :", event.target.files[0]);
    this.setState({ selectedFile: event.target.files[0] });
  };
  descriptionHandler = e => {
    this.setState({ description: e.target.value }, () =>
      console.log("---------", this.state.description)
    );
  };

  uploadHandler = e => {
    e.preventDefault();
    // let description = { description: this.state.description };
    const formData = new FormData();

    formData.append(
      "image",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
    formData.append("description", this.state.description);

    axios
      .post("http://localhost:4000/api/imageUpload", formData, {
        onUploadProgress: progressEvent => {
          console.log(
            "Progress: " +
              Math.round((progressEvent.loaded / progressEvent.total) * 100) +
              "%"
          );
        }
      })
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  };
  render() {
    var styles = {
      float: "left",
      padding: "15px"
    };
    var buttonStyle = {
      padding: "15px"
    };

    return (
      <ButtonGroup>
        <div style={styles}>
          <input
            style={{ display: "none" }}
            type="file"
            onChange={this.fileChangedHandler}
            ref={fileInput => (this.fileInput = fileInput)}
          />
          <Button
            color="primary"
            size="sm"
            onClick={() => this.fileInput.click()}
          >
            Pick File..!
          </Button>
        </div>
        <div style={styles}>
          <textarea
            name="body"
            onChange={this.descriptionHandler}
            value={this.state.description}
          />
        </div>
        <div style={buttonStyle}>
          <Button color="secondary" size="sm" onClick={this.uploadHandler}>
            Upload!
          </Button>
        </div>

        <ImageDisplay />
      </ButtonGroup>
    );
  }
}

export default FileUpload;
