// imports

import "./App.css"
import {useState} from "react"
import languageEncoding from "detect-file-encoding-and-language"
import logo from "./static/yep_logo_dark.png"
import $ from "jquery"

// App

function App() {
  
  // define state variables
  const [dic,setDic]=useState()
  const [txtin,setTxtin]=useState()
  var txt
  const [filename,setFilename]=useState("")
  const [fileEncode, setFileencode]=useState("UTF-8")
  const [dlfilename, setDlfilename]=useState("") 

  // define functions

  //function used to create .txt file from string
  const makeTextFile = (text) => {
    var textFile = null
    var data = new Blob([text], {type: 'text/plain;charset='+fileEncode})

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile)
    }

    textFile = window.URL.createObjectURL(data)

    // returns a URL you can use as a href
    return textFile
  }

  // function handling the .json input
  const handleJsonupload = (event) =>{
    const reader = new FileReader()
    reader.onload = event => setDic(JSON.parse(event.target.result)) // desired file content
    // reader.onerror = error => reject(error)
    reader.readAsText(event.target.files[0])
  }

  // function handling the .txt input
  async function handleTxtinput(event){
    setFilename(event.target.files[0].name)
    languageEncoding(event.target.files[0]).then(fileInfo => console.log(fileInfo));

    const reader = new FileReader()
    reader.onload = event => setTxtin(event.target.result)
    reader.readAsText(event.target.files[0], fileEncode)
    setDlfilename(event.target.files[0].name.split(".")[0]+"_yep.txt")
    console.log(txtin)
  }

  // function handling the "YEP" button
  const handleBtn1click = () =>{
    console.log(txtin)
    console.log(dic)
    txt = txtin
    //check for input
    if(txtin!=null){
      var key
      for (key in dic){
          // setTxtin(txtin.replaceAll(key, dic[key])) 
          txt = txt.replaceAll(key, dic[key])
      }   
      console.log(txt)
      var tempdlfilename = dlfilename 
      if(!tempdlfilename.endsWith(".txt")){
          tempdlfilename = tempdlfilename+".txt"
          console.log(tempdlfilename)
      }
      var link = document.createElement("a")
      link.setAttribute("download", tempdlfilename)
      link.href = makeTextFile(txt)
      document.body.appendChild(link)

      //wait for the link to be added to the document
      window.requestAnimationFrame(function(){
          var event = new MouseEvent("click")
          link.dispatchEvent(event)
          document.body.removeChild(link)
      })
    }
  }

  // function handling filename input
  const handleFilename = (event) =>{
    setDlfilename(event.target.value)
  }

  // function handling encoding select
  const handleSelect = (event) =>{
    setFileencode(event.target.value)
    //console.log(event.target.value)
  }


  var $jsonInput = $('.json-input');
  var $dropareaJson = $('.json-drop-area');
  
  // highlight drag area
  $jsonInput.on('dragenter focus click', function() {
    $dropareaJson.addClass('is-active');
  });
  
  // back to normal state
  $jsonInput.on('dragleave blur drop', function() {
    $dropareaJson.removeClass('is-active');
  });
  
  // change inner text
  $jsonInput.on('change', function() {
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();
  
    if (filesCount === 1) {
      // if single file is selected, show file name
      var fileName = $(this).val().split('\\').pop();
      $textContainer.text(fileName);
    } else {
      // otherwise show number of files
      $textContainer.text(filesCount + ' files selected');
    }
  });

  var $fileInput = $('.file-input');
  var $droparea = $('.file-drop-area');
  
  // highlight drag area
  $fileInput.on('dragenter focus click', function() {
    $droparea.addClass('is-active');
  });
  
  // back to normal state
  $fileInput.on('dragleave blur drop', function() {
    $droparea.removeClass('is-active');
  });
  
  // change inner text
  $fileInput.on('change', function() {
    var filesCount = $(this)[0].files.length;
    var $textContainer = $(this).prev();
  
    if (filesCount === 1) {
      // if single file is selected, show file name
      var fileName = $(this).val().split('\\').pop();
      $textContainer.text(fileName);
    } else {
      // otherwise show number of files
      $textContainer.text(filesCount + ' files selected');
    }
  });

  //html
  return (
    <div className="App">
      <div><img src={logo} alt="YEPSTRING" id="logo"></img></div>
    
      <div className="objects">
        <div id="explainer">
            Upload .json dictionary and .txt file to the specified inputs. <br></br>
            Press "YEP" button to automaticly generate new .txt file with all
            words from the .json dictionary replaced. 
        </div>
        <div className="input">
          <div className="inputcontainer">
            <div className="inputfield">
              <div className="json-drop-area">
                <span className="fake-btn">Choose json file</span>
                <span className="json-msg">or drag and drop files here</span>
                <input className="json-input" type="file" onChange={handleJsonupload} accept=".json"></input>
              </div>
              <div className="file-drop-area">
                <span className="fake-btn">Choose txt file</span>
                <span className="file-msg">or drag and drop files here</span>
                <input className="file-input" type="file" onChange={handleTxtinput} accept=".txt"></input>
              </div>
            </div>
            <div className="encoding">
              <label>Encoding:</label>
              <select id="select" onChange={handleSelect}>
                <option value="UTF-8" defaultValue>UTF-8</option>
                <option value="cp1252">ANSI</option>
              </select>
            </div>
          </div>
        </div>  
        <div className="download">   
            <input type="text" id="dltext" value={dlfilename} onChange={handleFilename}></input>
            <button id="btn1" onClick={handleBtn1click}>YEP</button>
        </div> 
      </div>
      
      <footer>
        <div className="footer">
          <a href="https://github.com/nilsayy/yepstring" target="_blank" id="doc">source</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
