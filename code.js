// date 13.05.2018

function isUnaryOperation(operation) {
    return operation == '!';
}

function equivalence(firstElement, secondElement) {
    return ((firstElement == '1' && secondElement == '1') || (firstElement == '0' && secondElement == '0')) ? '1' : '0';
}

function implication(firstElement, secondElement) {
    return (firstElement == '1' && secondElement == '0') ? '0' : '1';
}

function conjunction(firstElement, secondElement) {
    return (firstElement == '1' && secondElement == '1') ? '1' : '0';
}

function disjunction(firstElement, secondElement) {
    return (firstElement == '0' && secondElement == '0') ? '0' : '1';
}

function negation(firstElement) {
    return (firstElement == '0') ? '1' : '0';
}

function createBinaryNumbers(count) {
    var binaryNumbers = [];
    for(var number=0; number<Math.pow(2, count); number++) {
        var binaryNumber = number.toString(2).split("");
        while(binaryNumber.length < count) {
            binaryNumber.unshift("0");
        }
        binaryNumbers.push(binaryNumber);
    }
    return binaryNumbers;
}

function createUniqueSymbols(inputString) {
    var symbolRegex = /[A-Z]/;
    var uniqueSymbols = [];
    for (var i = 0; i < inputString.length; i++) {
        if (inputString[i].match(symbolRegex) && uniqueSymbols.indexOf(inputString[i]) == -1) {
            uniqueSymbols.push(inputString[i]);
        }
    }
    return uniqueSymbols;
}

function changeSymbolToDigit(symbol, uniqueSymbols, binaryNumber) {
    for(var i=0; i<binaryNumber.length; i++) {
        if (uniqueSymbols.indexOf(symbol) == i) {
            var digit = binaryNumber[i];
            break;
        }
    }
    return digit;
}

function isFormula(inputString) {
    var formulaRegex = /(\(\!([01]|[A-Z])\))|(\(([01]|[A-Z])([\&\|\~]|(\-\>))([01]|[A-Z])\))/g;
    var oneElementRegex = /^([01]|[A-Z])$/g;

    if(inputString.match(oneElementRegex)) {
        return true;
    } else {
        while(formulaRegex.test(inputString)) {
            inputString = inputString.replace(formulaRegex, "A");
        }
        return (inputString == "A");
    }
}

function isNeutral(inputString) {
    var symbolRegex = /[A-Z]/;
    var elementRegex = /[01]|[A-Z]/;
    var formulaRegex = /(\(\!([01]|[A-Z])\))|(\(([01]|[A-Z])([\&\|\~]|(\-\>))([01]|[A-Z])\))/;
    var negationFormulaRegex = /^(\(\!([01]|[A-Z])\))$/g;
    var conjunctionFormulaRegex = /^(\(([01]|[A-Z])\&([01]|[A-Z])\))$/;
    var disjunctionFormulaRegex = /^(\(([01]|[A-Z])\|([01]|[A-Z])\))$/;
    var implicationFormulaRegex = /^(\(([01]|[A-Z])\-\>([01]|[A-Z])\))$/;
    var equivalenceFormulaRegex = /^(\(([01]|[A-Z])\~([01]|[A-Z])\))$/;

    var firstResult;

    var uniqueSymbols = [];
    uniqueSymbols = createUniqueSymbols(inputString);

    var binaryNumbers = [];
    binaryNumbers = createBinaryNumbers(uniqueSymbols.length);

    if(inputString.match(/^[A-Z]$/)) {
        return true;
    }

    for(var i=0; i<binaryNumbers.length; i++) {
        var currentString = inputString;
        while (formulaRegex.test(currentString)) {
            var formula = currentString.match(formulaRegex);
            var currentFormula = formula[0];
            if(currentFormula.match(negationFormulaRegex)) {
                var symbol = currentFormula.match(symbolRegex);
                var digit = changeSymbolToDigit(symbol[0], uniqueSymbols, binaryNumbers[i]);
                currentString = currentString.replace(currentFormula, negation(digit));
            } else {
                var symbol1 = currentFormula.match(elementRegex);
                if(symbol1[0].match(symbolRegex)) {
                    var digit1 = changeSymbolToDigit(symbol1[0], uniqueSymbols, binaryNumbers[i]);
                    currentFormula = currentFormula.replace(symbol1[0], "n");
                } else {
                    digit1 = symbol1[0];
                    currentFormula = currentFormula.replace(symbol1[0], "n");
                }
                var symbol2 = currentFormula.match(elementRegex);
                if(symbol2[0].match(symbolRegex)) {
                    var digit2 = changeSymbolToDigit(symbol2[0], uniqueSymbols, binaryNumbers[i]);
                } else {
                    digit2 = symbol2[0];
                }

                if(formula[0].match(conjunctionFormulaRegex)) {
                    currentString = currentString.replace(formula[0], conjunction(digit1, digit2));
                } else if(formula[0].match(disjunctionFormulaRegex)) {
                    currentString = currentString.replace(formula[0], disjunction(digit1, digit2));
                } else if(formula[0].match(implicationFormulaRegex)) {
                    currentString = currentString.replace(formula[0], implication(digit1, digit2));
                } else if(formula[0].match(equivalenceFormulaRegex)) {
                    currentString = currentString.replace(formula[0], equivalence(digit1, digit2));
                }
            }
        }
        if(i == 0) {
            firstResult = currentString;
        } else {
            if (firstResult != currentString) {
                return true;
            }
        }
    }
    return false;
}

function start() {
    var inputString = document.getElementById('string').value;
    document.getElementById('isFormula').innerHTML = '';
    document.getElementById('isNeutral').innerHTML = '';

    if (isFormula(inputString)) {
        document.getElementById('isFormula').innerHTML += 'Строка ЯВЛЯЕТСЯ формулой логики высказываний.';
        if(isNeutral(inputString)) {
            document.getElementById('isNeutral').innerHTML = 'Логическая формула ЯВЛЯЕТСЯ нейтральной.';
        } else {
            document.getElementById('isNeutral').innerHTML = 'Логическая формула НЕ ЯВЛЯЕТСЯ нейтральной.';
        }
    } else {
        document.getElementById('isFormula').innerHTML += 'Строка НЕ ЯВЛЯЕТСЯ формулой логики высказываний.';
    }
}