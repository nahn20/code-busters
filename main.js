var currentPlainText = "";
function newCypher(){
    document.getElementById("response").innerHTML = fillerResponses[randomInt(0, fillerResponses.length-1)]
    document.getElementById("response").style.color = "black";
    document.getElementById("inputBox").value = "";
    var radios = document.getElementsByName("encryptionRadio");
    var cypher = "none";
    for(var i = 0; i < radios.length; i++){
        if(radios[i].checked){
            cypher = radios[i].value;
            break;
        }
    }
    var optionsRadios = document.getElementsByName("optionsRadio");
    var option = "none";
    for(var i = 0; i < optionsRadios.length; i++){
        if(optionsRadios[i].checked){
            option = optionsRadios[i].value;
            break;
        }
    }

    document.getElementById("extraInfo").innerHTML = ""; //Assumes no extra info unless the cypher sets it

    currentPlainText = randomText(); //I'm too lazy to rename my variables, so in some cases the currentPlainText is actually the cypher text
    var cypheredText = "";
    switch(cypher){
        //Look here when adding new cypher types
        case "caesar":
            cypheredText = caesar(currentPlainText, {});
            break;
        case "aristocrat":
            cypheredText = aristocrat(currentPlainText, "aristocrat", {});
            break;
        case "patristocrat":
            cypheredText = aristocrat(currentPlainText, "patristocrat", {});
            break;
        case "affine":
            cypheredText = affine(currentPlainText, option, {});
            break;
        case "vigenere":
            cypheredText = vigenere(currentPlainText, option, {});
            break;
        case "baconian":
            cypheredText = baconian(currentPlainText, option, {});
            break;
        case "hill":
            cypheredText = hill(currentPlainText, option, {});
            break;
        default:
            console.log("Error in Encryption Selection. Nathan is trash 001.");
    }
    if(option == "ptc"){
        document.getElementById("encryptedText").innerHTML = "Plain Text: " + cypheredText;
        document.getElementById("enterPlainTextGuess").innerHTML = "Enter Cypher Text Guess:";
    }
    else{
        document.getElementById("encryptedText").innerHTML = "Encrypted Text: " + cypheredText;
        document.getElementById("enterPlainTextGuess").innerHTML = "Enter Plain Text Guess:";
    }
    console.log("Answer: " + currentPlainText);
}
function submitText(){
    var answer = phraseToLower(document.getElementById("inputBox").value);
    var text = phraseToLower(currentPlainText);
    var numWrong = 0;
    for(var i = 0; i < text.length; i++){
        if(text[i] != answer[i]){
            numWrong++;
        }
    }
    if(numWrong <= 2){ //This is the threshold for wrongness
        document.getElementById("response").innerHTML = correctResponses[randomInt(0, correctResponses.length-1)];
        document.getElementById("response").style.color = "green";
    }
    else{
        document.getElementById("response").innerHTML = wrongResponses[randomInt(0, wrongResponses.length-1)];
        document.getElementById("response").style.color = "red";
    }
    document.getElementById("numWrong").innerHTML = numWrong + " letters incorrect.";
}
function optionsMenu(){ //Updates the options menu based on the currently selected cypher
    var radios = document.getElementsByName("encryptionRadio");
    var cypher = "none";
    for(var i = 0; i < radios.length; i++){
        if(radios[i].checked){
            cypher = radios[i].value;
            break;
        }
    }
    //Look here when adding new cypher types
    if(cypher == "caesar" || cypher == "aristocrat" || cypher == "patristocrat"){ //No options menu
        document.getElementById("optionsMenu").innerHTML = "";
    }
    if(cypher == "affine" || cypher == "vigenere" || cypher == "hill"){ //Options: CTP or PTC
        document.getElementById("optionsMenu").innerHTML = "<input type='radio' name='optionsRadio' value='ptc' checked>Plain to Cypher<br><input type='radio' name='optionsRadio' value='ctp'>Cypher to Plain<br>";
    }
    if(cypher == "baconian"){
        document.getElementById("optionsMenu").innerHTML = "<input type='radio' name='optionsRadio' value='version1' checked>Standard<br><input type='radio' name='optionsRadio' value='version2'>Dumb Version<br>";
    }
}