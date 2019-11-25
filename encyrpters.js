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
function randomText(){ //TODO: DO
    return textsA[0];
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
            var q = 0;
            for(var i = 0; i < 26; i++){
                var ranLetter = randomInt(0, 25);
                if(i == 25 && ranLetter == 25){
                    break;
                }
                while(doesArrayContain(key, ranLetter)){
                    ranLetter = randomInt(0, 25);
                }
                key[i] = ranLetter;
            }
            return key;
        }
        key = chooseKey(key);
        while(key[25] == 25){
            key = chooseKey(key);
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