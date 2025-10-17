import chalk from 'chalk'
import readline from 'readline'
import yargsFactory from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

let notes
try {
  notes = await import('./notes.cjs')
  if (notes?.default && !notes.addNote) notes = notes.default
} catch {
  notes = require('./notes.cjs')
}

const header = () => {
  const title = ' ***** NOTAS ***** '
  const line = '─'.repeat(40)
  console.log(chalk.blueBright(`\n┌${line}┐`))
  console.log(
    chalk.blueBright('│') +
      chalk.bold.white(title.padStart((40 + title.length) / 2).padEnd(40)) +
      chalk.blueBright('│')
  )
  console.log(chalk.blueBright(`└${line}┘\n`))
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const ask = (q) => new Promise((resolve) => rl.question(q, (ans) => resolve(ans.trim())))

async function interactiveMenu () {
  header()
  console.log(chalk.cyan('Elige una opción:'))
  console.log(chalk.white('  1) Agregar nota'))
  console.log(chalk.white('  2) Listar notas'))
  console.log(chalk.white('  3) Leer nota'))
  console.log(chalk.white('  4) Eliminar nota'))
  console.log(chalk.white('  5) Salir\n'))

  const choice = await ask(chalk.yellow('Opción (1-5): '))

  switch (choice) {
    case '1': {
      const title = await ask(chalk.magenta('Título: '))
      const body  = await ask(chalk.magenta('Contenido: '))
      console.log()
      notes.addNote(title, body)
      break
    }
    case '2': {
      console.log()
      notes.listNotes()
      break
    }
    case '3': {
      const title = await ask(chalk.magenta('Título a leer: '))
      console.log()
      notes.readNote(title)
      break
    }
    case '4': {
      const title = await ask(chalk.magenta('Título a eliminar: '))
      console.log()
      notes.removeNote(title)
      break
    }
    case '5':
      console.log(chalk.gray('\nSaliendo…'))
      rl.close()
      return
    default:
      console.log(chalk.red('\n✖ Opción no válida.'))
  }

  console.log()
  const again = await ask(chalk.yellow('¿Volver al menú? (s/n): '))
  if (again.toLowerCase().startsWith('s')) {
    console.clear()
    return interactiveMenu()
  } else {
    rl.close()
  }
}

const yargs = yargsFactory(hideBin(process.argv))
  .scriptName('notes')
  .version('1.1.0')
  .usage(`${chalk.cyan('Uso:')} $0 <comando> [opciones]  ó  ${chalk.cyan('solo')} $0 para menú`)
  .strict()
  .help('h')
  .alias('h', 'help')
  .alias('v', 'version')

yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: { describe: 'Note title', demandOption: true, type: 'string' },
    body:  { describe: 'Note body',  demandOption: true, type: 'string' },
  },
  handler(argv) {
    header()
    notes.addNote(argv.title, argv.body)
  },
})

yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    title: { describe: 'Note title', demandOption: true, type: 'string' },
  },
  handler(argv) {
    header()
    notes.removeNote(argv.title)
  },
})

yargs.command({
  command: 'list',
  describe: 'List your notes',
  handler() {
    header()
    notes.listNotes()
  },
})

yargs.command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    title: { describe: 'Note title', demandOption: true, type: 'string' },
  },
  handler(argv) {
    header()
    notes.readNote(argv.title)
  },
})

const passedArgs = hideBin(process.argv)
if (passedArgs.length === 0) {
  interactiveMenu().catch((e) => {
    console.error(chalk.red('Error en el menú:'), e)
    rl.close()
  })
} else {
  yargs.parse()
}
