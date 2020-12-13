/**
 * Write code to describe how you would analyze the semantic meaning of the languages of the
    expressions high lighted above? How would it track variable value or type? Does value or type matter?
    If the do matter what are your rules around the operations that they matter for?

    Given expressions:
    1) a * b - 1 + c
    2) a * (b - 1) / c % d
    3) (a - b) / c & (d * e / a - 3)
    4) ( a + b <= c ) * ( d > b - e )
    5) -a || c = d && e
    6) a > b ˜| c || d <= 17
    7) -a + b
    8) a + b * c + d
    9) E = ++(a++)

    Operator precedence:
    ( postfix ) ++, ( postfix ) --
    ++ ( prefix ), -- ( prefix )
    *, >= , &
    + , - , <=
    - ( unary ) , + ( unary ) , %
    > , <
    &&, /, !
    ||, ˜ |( this symbol meant to be a tilde followed by a pipe )
    =, /=

    Program to analyze semantic meaning of the languages of the expressions above:

    A prime responsibility of the semantic analyzer would be to:
    1) Track the variables
    2) Enlist the functions
    3) Identify the type declarations
    4) And perform type checking for validity

    Keeping this target in mind we will write a sementic analyzer program that can perform the 4 tasks listed above for the given expressions and 
    conforming to the operator precedence standard.

    Also to keep in mind the language processes its symbols in LTR manner with highest to lowest precedence
 */


// initialize global
var SyntaxKind = {};
SyntaxKind.equal = `SyntaxKind.equal`;
SyntaxKind.notEqual = `SyntaxKind.notEqual`;
SyntaxKind.logicalOr = `SyntaxKind.logicalOr`;
SyntaxKind.logicalXOR = `SyntaxKind.logicalXOR`;
SyntaxKind.logicalAnd = `SyntaxKind.logicalAnd`;
SyntaxKind.division = `SyntaxKind.division`;
SyntaxKind.logicalNot = `SyntaxKind.logicalNot`;
SyntaxKind.greaterThan = `SyntaxKind.greaterThan`;
SyntaxKind.lessThan = `SyntaxKind.lessThan`;
SyntaxKind.unaryNegation = `SyntaxKind.unaryNegation`;
SyntaxKind.unaryAddition = `SyntaxKind.unaryAddition`;
SyntaxKind.modulo = `SyntaxKind.modulo`;
SyntaxKind.addition = `SyntaxKind.addition`;
SyntaxKind.subtraction = `SyntaxKind.subtraction`;
SyntaxKind.lessThanEqual = `SyntaxKind.lessThanEqual`;
SyntaxKind.multiplication = `SyntaxKind.multiplication`;
SyntaxKind.greaterThanEqual = `SyntaxKind.greaterThanEqual`;
SyntaxKind.and = `SyntaxKind.and`;
SyntaxKind.prefixAdd = `SyntaxKind.prefixAdd`;
SyntaxKind.prefixSubtract = `SyntaxKind.prefixSubtract`;
SyntaxKind.postfixAdd = `SyntaxKind.postfixAdd`;
SyntaxKind.postfixSubtract = `SyntaxKind.postfixSubtract`;
SyntaxKind.openParan = `SyntaxKind.openParan`;
SyntaxKind.closeParan = `SyntaxKind.closeParan`;
SyntaxKind.openExpr = `SyntaxKind.openExpr`;
SyntaxKind.closeExpr = `SyntaxKind.closeExpr`;
SyntaxKind.variable = `SyntaxKind.variable`;
// the actual operators as defined by the language
const baseOperators = {
  equal: '=',
  notEqual: '/=',
  logicalOr: '||',
  logicalXOR: '~|',
  logicalAnd: '&&',
  division: '/',
  logicalNot: '!',
  greaterThan: '>',
  lessThan: '<',
  unaryNegation: '-',
  unaryAddition: '+',
  modulo: '%',
  addition: '+',
  subtraction: '-',
  lessThanEqual: '<=',
  multiplication: '*',
  greaterThanEqual: '>=',
  and: '&',
  prefixAdd: '( prefix ) ++',
  prefixSubtract: '( prefix ) --',
  postfixAdd: '++ ( postfix )',
  postfixSubtract: '-- ( postfix )',
  openParan: '(',
  closeParan: ')',
  openExpr: '(<some expr>',
  closeExpr: '<some expr>)'
};

/**
 * The grammar classes tree
 * This structure holds {SyntaxKind} and the associated {lexeme}
 * Note the special {SyntaxKind} named here as variable which
 * holds user defined symbols a.k.a variables and we have created
 * a lexeme definition of 'v' for it.
 */
const grammarClasses = [
  {class: SyntaxKind.equal, lexeme: baseOperators['equal']},
  {class: SyntaxKind.notEqual, lexeme: baseOperators['notEqual']},
  {class: SyntaxKind.logicalOr, lexeme: baseOperators['logicalOr']},
  {class: SyntaxKind.logicalXOR, lexeme: baseOperators['logicalXOR']},
  {class: SyntaxKind.logicalAnd, lexeme: baseOperators['logicalAnd']},
  {class: SyntaxKind.division, lexeme: baseOperators['division']},
  {class: SyntaxKind.logicalNot, lexeme: baseOperators['logicalNot']},
  {class: SyntaxKind.greaterThan, lexeme: baseOperators['greaterThan']},
  {class: SyntaxKind.lessThan, lexeme: baseOperators['lessThan']},
  {class: SyntaxKind.unaryNegation, lexeme: baseOperators['unaryNegation']},
  {class: SyntaxKind.unaryAddition, lexeme: baseOperators['unaryAddition']},
  {class: SyntaxKind.modulo, lexeme: baseOperators['modulo']},
  {class: SyntaxKind.addition, lexeme: baseOperators['addition']},
  {class: SyntaxKind.subtraction, lexeme: baseOperators['subtraction']},
  {class: SyntaxKind.lessThanEqual, lexeme: baseOperators['lessThanEqual']},
  {class: SyntaxKind.multiplication, lexeme: baseOperators['multiplication']},
  {class: SyntaxKind.greaterThanEqual, lexeme: baseOperators['greaterThanEqual']},
  {class: SyntaxKind.and, lexeme: baseOperators['and']},
  {class: SyntaxKind.prefixAdd, lexeme: baseOperators['prefixAdd']},
  {class: SyntaxKind.prefixSubtract, lexeme: baseOperators['prefixSubtract']},
  {class: SyntaxKind.postfixAdd, lexeme: baseOperators['postfixAdd']},
  {class: SyntaxKind.postfixSubtract, lexeme: baseOperators['postfixSubtract']},
  {class: SyntaxKind.openParan, lexeme: baseOperators['openParan']},
  {class: SyntaxKind.closeParan, lexeme: baseOperators['closeParan']},
  {class: SyntaxKind.openExpr, lexeme: baseOperators['openExpr']},
  {class: SyntaxKind.closeExpr, lexeme: baseOperators['closeExpr']},
  {class: SyntaxKind.variable, lexeme: 'v'}
];

/**
 * The regex grammar to aid in parsing the tokens and associating them
 * with the {SyntaxKind}
 */
const regexGrammar = [
  {regexRule: SyntaxKind.equal, ruleDefinition: new RegExp(/^=$/)},
  {regexRule: SyntaxKind.notEqual, ruleDefinition: new RegExp(/^\/=$/)},
  {regexRule: SyntaxKind.logicalOr, ruleDefinition: new RegExp(/^\|\|$/)},
  {regexRule: SyntaxKind.logicalXOR, ruleDefinition: new RegExp(/^\~\|$/)},
  {regexRule: SyntaxKind.logicalAnd, ruleDefinition: new RegExp(/^\&\&$/)},
  {regexRule: SyntaxKind.division, ruleDefinition: new RegExp(/^\/$/)},
  {regexRule: SyntaxKind.logicalNot, ruleDefinition: new RegExp(/^\|$/)},
  {regexRule: SyntaxKind.greaterThan, ruleDefinition: new RegExp(/^>$/)},
  {regexRule: SyntaxKind.lessThan, ruleDefinition: new RegExp(/^<$/)},
  {regexRule: SyntaxKind.unaryNegation, ruleDefinition: new RegExp(/^-[a-zA-Z]$/)},
  {regexRule: SyntaxKind.unaryAddition, ruleDefinition: new RegExp(/^\+[a-zA-Z]$/)},
  {regexRule: SyntaxKind.modulo, ruleDefinition: new RegExp(/^%$/)},
  {regexRule: SyntaxKind.addition, ruleDefinition: new RegExp(/^\+$/)},
  {regexRule: SyntaxKind.subtraction, ruleDefinition: new RegExp(/^-$/)},
  {regexRule: SyntaxKind.lessThanEqual, ruleDefinition: new RegExp(/^<=$/)},
  {regexRule: SyntaxKind.multiplication, ruleDefinition: new RegExp(/^\*$/)},
  {regexRule: SyntaxKind.greaterThanEqual, ruleDefinition: new RegExp(/^>=$/)},
  {regexRule: SyntaxKind.and, ruleDefinition: new RegExp(/^&$/)},
  {regexRule: SyntaxKind.prefixAdd, ruleDefinition: new RegExp(/^\+\+\(.*\)$/)},
  {regexRule: SyntaxKind.prefixSubtract, ruleDefinition: new RegExp(/^--\(.*\)$/)},
  {regexRule: SyntaxKind.postfixAdd, ruleDefinition: new RegExp(/^[a-zA-Z]\+\+$/)},
  {regexRule: SyntaxKind.postfixSubtract, ruleDefinition: new RegExp(/^[a-zA-Z]--$/)},
  {regexRule: SyntaxKind.openParan, ruleDefinition: new RegExp(/^\($/)},
  {regexRule: SyntaxKind.closeParan, ruleDefinition: new RegExp(/^\)$/)},
  {regexRule: SyntaxKind.openExpr, ruleDefinition: new RegExp(/^\([a-zA-Z0-9]$/)},
  {regexRule: SyntaxKind.closeExpr, ruleDefinition: new RegExp(/^[a-zA-Z0-9]\)$/)},
  {regexRule: SyntaxKind.variable, ruleDefinition: new RegExp(/^[a-zA-Z]$/)}
];

/**
 * 
 * @param {Array<string>} input 
 * @return Array
 * @function tokenize Tokenizes the input array and returns the tokenized array result
 */
function tokenize(input) {
    let result = [];
    for(let i = 0; i < input.length; i++) {
        for (let j = 0; j < regexGrammar.length; j++) {
            if(input[i].match(regexGrammar[j].ruleDefinition)) {
                result.push({input: input[i], class: grammarClasses[j].class, lexeme: grammarClasses[j].lexeme})
            }
        }
    }

    return result
}


/**
 * 
 * @param {string} input 
 * @return {Array<string>}
 * @function inputParser Takes the string input and outputs parsed language symbol array
 */
function inputParser(input) {
    return input.split(' ');
}

/**
 * 
 * @param {string} input 
 */
function main(input) {
    console.log('original input: ');
    console.log(input);
    let parsedInput = inputParser(input);
    console.log('Parsed input');
    console.log(parsedInput);
    let tokenizedExpression = tokenize(parsedInput);
    console.log('Semantically analyzed output :');
    console.log(tokenizedExpression);
}

// call the main with all the input expressions
main('a * b - 1 + c');
main('a * (b - 1) / c % d');
main('(a - b) / c & (d * e / a - 3)');
main('( a + b <= c ) * ( d > b - e )');
main('-a || c = d && e');
main('a > b ˜| c || d <= 17');
main('-a + b');
main('a + b * c + d');
main('E = ++(a++)');