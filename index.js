import espree from 'espree'
import escodegen from 'escodegen'

const code = mathModule.toString()
const ast = espree.parse(code)
const traversers = getTraversers()

traverse(ast, {
  Identifier(node) {
    console.log('\n\n------\nIdentifier', node)
    node.name = node.name.split('').reverse().join('')
  },
  FunctionDeclaration(node) {
    node.params.push({type: 'Identifier', name: 'myExtraParam'})
  }
})

const resultingCode = escodegen.generate(ast)
console.log('\n\n\n----------\n' + resultingCode)


// function definitions
function traverse(node, config) {
  console.log('\n\n--\nnode', node)

  const visitor = config[node.type] || noop
  visitor(node)

  const traverser = traversers[node.type] || noop
  traverser(node, config)
}

function getTraversers() {
  return {
    Program(node, config) {
      node.body.forEach(n => traverse(n, config))
    },
    FunctionDeclaration(node, config) {
      traverse(node.id, config)
      traverse(node.body, config)
      node.params.forEach(p => traverse(p, config))
      node.body.body.forEach(n => traverse(n, config))
    },
  }
}

function mathModule() {
  function add(a, b) {
    return a + b
  }

  function subtract(a, b) {
    return a - b
  }

  function multiply(a, b) {
    return a * b
  }

  function divide(a, b) {
    return a / b
  }
}

function noop() {}

