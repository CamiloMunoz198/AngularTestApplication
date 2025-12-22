export interface OperationMock {
  valor: string; // El valor real de la operación (+, -, *, /)
  nombre: string; // El nombre legible para el usuario (Suma, Resta, etc.)
}

// Exportamos el array de operaciones mockeadas
export const listaOperaciones: OperationMock[] = [
  { valor: '+', nombre: 'Suma' },
  { valor: '-', nombre: 'Resta' },
  { valor: '*', nombre: 'Multiplicación' },
  { valor: '/', nombre: 'División' },
];