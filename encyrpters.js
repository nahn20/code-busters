//SUPPORT FUNCTIONS\\
function phraseToLower(plainText){
    var lowerText = "";
    for(var i = 0; i < plainText.length; i++){
        if(plainText[i].charCodeAt(0) >= 65 && plainText[i].charCodeAt(0) <= 90){
            lowerText += String.fromCharCode(plainText[i].charCodeAt(0)+32);
        }
        else{
            lowerText += plainText[i];
        }
    }
    return lowerText;
}
function phraseScrubber(plainText){ //Removes all non-letters and converts to lowercase
    plainText = phraseToLower(plainText);
    var cleanText = "";
    for(var i = 0; i < plainText.length; i++){
        if(isLower(plainText[i])){
            cleanText += plainText[i];
        }
    }
    return cleanText;
}
function modWithNeg(num1, num2){
    num1 %= num2;
    while(num1 < 0){
        num1 += num2;
    }
    return num1;
}
function isLower(char){ //Non-letters return false
    if(typeof(char) == "string"){
        char = char.charCodeAt(0);
    }
    if(char >= 97 && char <= 122){
        return true;
    }
    return false;
}
function doesArrayContain(array, element){
    for(var i = 0; i < array.length; i++){
        if(array[i] == element){
            return true;
        }
    }
    return false;
}
function randomInt(lower, upper){ //Includes the upper bound with equal odds (maybe)
    var range = 1+upper-lower;
    var rando = lower+Math.floor(range*Math.random());
    return rando;
}
function replaceLetterInString(string, letter, position){
    var text = "";
    for(var i = 0 ; i < string.length; i++){
        if(i == position){
            text += letter;
        }
        else{
            text += string[i];
        }
    }
    return text;
}
function randomText(){
    var texts = [];
    if(document.getElementById("sen").checked){
        texts = texts.concat(shortTexts);
    }
    if(document.getElementById("men").checked){
        texts = texts.concat(mediumTexts);
    }
    if(document.getElementById("len").checked){
        texts = texts.concat(longTexts);
    }
    if(document.getElementById("span").checked){
        texts = texts.concat(spanishTexts);
    }
    var text = texts[randomInt(0, texts.length-1)];
    var perTypos = document.getElementById("typos").value;
    if(perTypos != 0){
        var numTypos = Math.round(perTypos*phraseScrubber(text).length/100);
        for(var i = 0; i < numTypos; i++){
            var charPlace = randomInt(0, text.length-1);
            var char = text[charPlace].charCodeAt(0)
            if(char >= 97 && char <= 122){
                char = randomInt(97, 122);
                text = replaceLetterInString(text, String.fromCharCode(char), charPlace);
            }
            else if(char >= 65 && char <= 90){
                char = randomInt(65, 90);
                text = replaceLetterInString(text, String.fromCharCode(char), charPlace);
            }
        }
    }
    return text;
}
//ACTUAL CYPHERS\\
//Look here when adding new cypher types
function caesar(plainText, options){
    var shift;
    if(typeof(options.shift) != "undefined"){
        shift = options.shift;
    }
    else{
        shift = randomInt(1, 25);
    }
    console.log("Shift: " + shift);
    plainText = phraseToLower(plainText);
    var cypher = "";
    for(var i = 0; i < plainText.length; i++){
        var newChar = plainText[i].charCodeAt(0);
        if(isLower(newChar)){
            newChar -= 97;
            newChar += shift;
            newChar %= 26;
            newChar += 97;
        }
        cypher += String.fromCharCode(newChar);
    }
    return cypher;
}
function aristocrat(plainText, type, options){
    var key = [];
    if(typeof(options.key) != "undefined"){
        key = options.key;
    }
    else{
        function chooseKey(key){
            for(var i = 0; i < 26; i++){
                var ranLetter = randomInt(0, 25);
                if(i == 25 && ranLetter == 25){
                    break;
                }
                var counter = 0; //Fuck you i'm tired and it's crashing
                while(doesArrayContain(key, ranLetter)){
                    ranLetter = randomInt(0, 25);
                    counter++;
                    if(counter > 500){
                        console.log("Error: That fucking fucker. @Nathan to fix")
                        return "BAD";
                    }
                }
                key[i] = ranLetter;
            }
            return key;
        }
        key = chooseKey(key);
        while(key[25] == 25 || key == "BAD"){
            key = chooseKey([]);
        }
        for(var i = 0; i < 26; i++){
            key[i] += 65;
            key[i] = String.fromCharCode(key[i]);
        }
    }
    if(type == "patristocrat"){
        plainText = phraseScrubber(plainText);
    }
    plainText = phraseToLower(plainText);
    var cypher = "";
    for(var i = 0; i < plainText.length; i++){
        var newChar = plainText[i].charCodeAt(0);
        if(isLower(newChar)){
            newChar -= 97;
            newChar = key[newChar];
            cypher += newChar;
        }
        else{
            cypher += String.fromCharCode(newChar);
        }
    }
    
    //This is a kinda scuffed and lazy way of making a table. I'm sorry. I don't feel like typing the entire alphabet
    var tableHTML = "Frequency Table: <table><tr>";
    for(var i = 65; i <= 90; i++){
        tableHTML += "<th>" + String.fromCharCode(i) + "</th>";
    }
    tableHTML += "</tr><tr>";
    var frequencyTable = []; //frequencyTable[0] is the number of As in the text
    for(var i = 0; i <= 25; i++){
        frequencyTable[i] = 0;
    }
    for(var i = 0; i < cypher.length; i++){
        var char = cypher[i];
        char = char.charCodeAt(0);
        char -= 65;
        frequencyTable[char]++;
    }
    for(var i = 0; i <= 25; i++){
        tableHTML += "<td>" + frequencyTable[i] + "</td>";
    }
    tableHTML += "</tr></table>";

    document.getElementById("extraInfo").innerHTML = tableHTML;
    return cypher;
}
function affine(plainText, type, options){
    var a;
    var b;
    var possibleAValues = [3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
    if(typeof(options.a) != "undefined"){
        a = options.a;
        var j = false;
        for(var i = 0; i < possibleAValues.length; i++){
            if(a == possibleAValues[i]){
                j = true;
                break;
            }
        }
        if(j == false){
            alert("This alert should never come up. You messed up a value in your options for affine cypher. I have no idea why I'm coding this because the options parameter is never used but whatever fml");
        }
    }
    else{
        a = possibleAValues[randomInt(0, 10)];
    }
    if(typeof(options.b) != "undefined"){
        b = options.b;
    }
    else{
        b = randomInt(1, 30);
    }
    document.getElementById("extraInfo").innerHTML = "a: " + a + "<br>b: " + b;
    plainText = phraseToLower(plainText);
    var cypher = "";
    for(var i = 0; i < plainText.length; i++){
        var newChar = plainText[i].charCodeAt(0);
        if(isLower(newChar)){
            newChar -= 97;
            newChar *= a;
            newChar += b;
            newChar %= 26;
            newChar += 97;
        }
        cypher += String.fromCharCode(newChar);
    }
    if(type == "ctp"){
        return cypher;
    }
    if(type == "ptc"){
        currentPlainText = cypher;
        return plainText;
    }
}
function vigenere(plainText, type, options){
    var keyword;
    if(typeof(options.keyword) != "undefined"){
        keyword = options.keyword;
    }
    else{
        keyword = keywords[randomInt(0, keywords.length-1)];
    }
    document.getElementById("extraInfo").innerHTML = "Keyword: " + keyword;
    plainText = phraseToLower(plainText);
    var cypher = "";
    var letterCounter = 0;
    for(var i = 0; i < plainText.length; i++){
        var newChar = plainText[i].charCodeAt(0);
        if(isLower(newChar)){
            var charOfKeyword = keyword[letterCounter % keyword.length].charCodeAt(0);
            charOfKeyword -= 97;
            newChar -= 97;
            newChar += charOfKeyword;
            newChar %= 26;
            newChar += 97;
            letterCounter++;
        }
        cypher += String.fromCharCode(newChar);
    }
    if(type == "ctp"){
        return cypher;
    }
    if(type == "ptc"){
        currentPlainText = cypher;
        return plainText;
    }
}
function baconian(plainText, type, options){
    var dictionary;
    if(type == "version1"){
        dictionary = ["AAAAA", "AAAAB", "AAABA", "AAABB", "AABAA", "AABAB", "AABBA", "AABBB", "ABAAA", "ABAAA", "ABAAB", "ABABA", "ABABB", "ABBAA", "ABBAB", "ABBBA", "ABBBB", "BAAAA", "BAAAB", "BAABA", "BAABB", "BAABB", "BABAA", "BABAB", "BABBA", "BABBB"];
    }
    if(type == "version2"){
        dictionary = ["AAAAA", "AAAAB", "AAABA", "AAABB", "AABAA", "AABAB", "AABBA", "AABBB", "ABAAA", "ABAAB", "ABABA", "ABABB", "ABBAA", "ABBAB", "ABBBA", "ABBBB", "BAAAA", "BAAAB", "BAABA", "BAABB", "BABAA", "BABAB", "BABBA", "BABBB", "BBAAA", "BBAAB"];
    }
    plainText = phraseToLower(plainText);
    var cypher = "";
    for(var i = 0; i < plainText.length; i++){
        var newChar = plainText[i].charCodeAt(0);
        if(isLower(newChar)){
            newChar -= 97;
            cypher += dictionary[newChar];
            cypher += " ";
        }
    }
    return cypher;
}
function hill(plainText, type, options){
    //https://crypto.interactive-maths.com/hill-cipher.html#2x2encypt
    /*Matrix Format [a, b, c, d]
    [A B]
    [C D]
    */
    var originalPlainText = plainText;
    if(typeof(options.keyword) != "undefined"){
        keyword = options.keyword;
    }
    else{
        keyword = fourLetterWords[randomInt(0, fourLetterWords.length-1)];
    }
    var decryptionMatrix = [0, 0, 0, 0];
    for(var i = 0; i < 4; i++){
        decryptionMatrix[i] = keyword[i].charCodeAt(0)-97;
    }
    document.getElementById("extraInfo").innerHTML = "Keyword: " + keyword + "<br>Decryption Matrix:<br>[" + decryptionMatrix[0] + "\t" + decryptionMatrix[1] + "]<br>[" + decryptionMatrix[2] + "\t" + decryptionMatrix[3] + "]";
    if(type == "ptc"){
        document.getElementById("extraInfo").innerHTML = document.getElementById("extraInfo").innerHTML + "<br>Here's a workspace to find the encryption matrix: <br><textArea id='workspace' cols='4' rows='2'></textArea>"
        document.getElementById("workspace").value = "[]\n[]"
    }

    //Finding the encryption matrix
    var determinant = decryptionMatrix[0]*decryptionMatrix[3]-decryptionMatrix[1]*decryptionMatrix[2];
    determinant %= 26;
    var multInverse = 0;
    for(var i = 1; i <= 25; i++){
        if(modWithNeg(i*determinant, 26) == 1){
            multInverse = i;
            break;
        }
    }
    if(multInverse == 0){
        console.log("ERROR! BAD KEYWORD: " + keyword);
        newCypher();
    }
    var encryptionMatrix = [modWithNeg(multInverse*decryptionMatrix[3], 26), modWithNeg(-multInverse*decryptionMatrix[1], 26), modWithNeg(-multInverse*decryptionMatrix[2], 26), modWithNeg(multInverse*decryptionMatrix[0], 26)];
    console.log("Encryption Matrix: " + encryptionMatrix);
    plainText = phraseScrubber(plainText);
    if(plainText.length % 2 == 1){
        plainText += "x";
    }
    var cypher = "";
    for(var i = 0; i < plainText.length; i+=2){
        var v1 = plainText[i].charCodeAt(0);
        var v2 = plainText[i+1].charCodeAt(0);
        v1 -= 97;
        v2 -= 97;
        var newChar1 = encryptionMatrix[0]*v1+encryptionMatrix[1]*v2;
        var newChar2 = encryptionMatrix[2]*v1+encryptionMatrix[3]*v2;
        newChar1 = modWithNeg(newChar1, 26);
        newChar2 = modWithNeg(newChar2, 26);
        newChar1 += 97;
        newChar2 += 97;
        cypher += String.fromCharCode(newChar1);
        cypher += String.fromCharCode(newChar2);
    }

    if(type == "ctp"){
        return cypher;
    }
    if(type == "ptc"){
        currentPlainText = cypher;
        return originalPlainText;
    }
}
function pollux(plainText, options){ //"I"s might be broken but I'm a lazy shit and nobody's ever going to actually use this
    var dictionary = [".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--.."];
    var morseText = "";
    for(var i = 0; i < plainText.length; i++){
        var char = plainText[i].charCodeAt(0);
        char -= 97;
        if(char >= 0 && char <= 25){
            morseText += dictionary[char];
            if(i+1 != plainText.length){
                morseText += "/";
            }
        }
        else if(plainText[i] == " "){
            morseText += "/";
        }
    }
    function chooseKey(){
        var key = [];
        for(var i = 0; i < 10; i++){
            var ranLetter = randomInt(0, 9);
            if(i == 9 && ranLetter == 9){
                break;
            }
            while(doesArrayContain(key, ranLetter)){
                ranLetter = randomInt(0, 9);
            }
            key[i] = ranLetter;
        }
        return key;
    }
    var key = chooseKey(key);
    while(key[9] == 9){
        key = chooseKey(key);
    }
    var key1 = [0, 1, 2, 3];
    var key2 = [4, 5, 6];
    var key3 = [7, 8, 9];
    var cypherText = "";
    for(var i = 0; i < morseText.length; i++){
        var num;
        if(morseText[i] == "-"){
            num = key[key1[randomInt(0, 3)]];
        }
        if(morseText[i] == "."){
            num = key[key2[randomInt(0, 2)]];
        }
        if(morseText[i] == "/"){
            num = key[key3[randomInt(0, 2)]];
        }
        cypherText += num.toString();
    }
    console.log("key: (first 4 are -, next 3 are ., next 3 are /): " + key);
    var html = "Hint:<br>- = " + key[key1[0]].toString() + ", " + key[key1[1]].toString();
    html += "<br>. = " + key[key2[0]].toString() + ", " + key[key2[1]].toString();
    html += "<br>/ = " + key[key3[0]].toString() + ", " + key[key3[1]].toString();
    document.getElementById("extraInfo").innerHTML = html;
    return cypherText;
}