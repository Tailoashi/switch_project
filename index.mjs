import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import { ask, yesno } from '@reach-sh/stdlib/ask.mjs';

const stdlib = loadStdlib();

const User_names = ["Alice", "Bob"]

const accAlice = await stdlib.newTestAccount(stdlib.parseCurrency(7000));
const accBob = await stdlib.newTestAccount(stdlib.parseCurrency(1000));


const ctcAlice = accAlice.contract(backend);

const ctcBob = accBob.contract(backend, ctcAlice.getInfo())
console.log(`Hello ${User_names[0]} and ${User_names[1]}`)
console.log(`The vault game has started`)


const getbalance = async (acc, name) => {
    const bal = await stdlib.balanceOf(acc);
    console.log(`${name} has ${stdlib.formatCurrency(bal)} ${stdlib.standardUnit} tokens`)
}

await getbalance(accAlice, User_names[0])
await getbalance(accBob, User_names[1])

await Promise.all([
    ctcAlice.p.Alice({
        funds: async () => {
            const amt = await ask(`How much funds are you depositing into the contract ${User_names[0]} `)
            console.log(`${User_names[0]} deposited ${parseInt(amt)} `)
            return stdlib.parseCurrency(parseInt(amt))
        },
        timeout: parseInt(await ask(`${User_names[0]} enter the timeout for the contract`)),
        Alive: async () => {
            const alivecheck = parseInt(await ask(`is ${User_names[0]} Alive, enter 1 for yes and 0 for no: `))
            if (alivecheck == 0) {
                console.log(`${User_names[0]} is dead `)
            } else if (alivecheck == 1) {
                console.log(`${User_names[0]} is alive`)
            }
            return parseInt(alivecheck)
        },
        showtimeout: async (tm) => {
            console.log(`${User_names[0]} the timeout is ${tm} `)
        },

    }),
    ctcBob.p.Bob({
        acceptfunds: async (amt) => {
            console.log(`${User_names[1]} saw the deposit of ${stdlib.formatCurrency(amt)} ${stdlib.standardUnit}`)
        },
        showtimeout: async (tm) => {
            console.log(`${User_names[1]} the timeout is ${tm} `)
        },
    }),

]);

await getbalance(accAlice, User_names[0])
await getbalance(accBob, User_names[1])
process.exit()
