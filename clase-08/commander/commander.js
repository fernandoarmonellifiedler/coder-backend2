import { Command } from "commander";

export const program = new Command(); 

program
  .option("-d", "Variable para debug", false)  // primero el comando flag, segundo la descripción, tercero el valor por defecto
  .option("-p <port>", "Puerto del servidor", 3000)
  .option("-m <mode>", "Modo de ejecución", "development")
  .requiredOption("-u <user>", "Usuario usando el aplicativo", "No se a declarado el usuario")// Opciones obligatorias el tercer argumento es el valor por defecto
  .option("-l, --letters [letters...]", "specify letters")
program.parse();  // parse se utiliza para cerrar la ejecución de comandos.

// console.log("Options", program.opts());
// console.log("Remaining", program.args);
// console.log("Mode", program.opts().m);
// console.log("Letters", program.opts().l);
