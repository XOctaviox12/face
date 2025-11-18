import { DetalleComponent } from "../detalle/detalle.component";

// Interface que define la estructura de la respuesta general proveniente de una base de datos o API
export interface RespuestaBD {
  page: number;          // Número de la página actual
  per_page: number;      // Cantidad de registros por página
  total: number;         // Total de registros disponibles
  total_pages: number;   // Número total de páginas disponibles
  data: Personajes[];    // Arreglo de objetos del tipo Personajes
}

// Interface que describe las propiedades de un personaje básico
export interface Personajes {
  id: number;            // Identificador único del personaje
  email: string;         // Correo electrónico del personaje (si aplica)
  first_name: string;    // Nombre del personaje
  last_name: string;     // Apellido del personaje
  avatar: string;        // URL de la imagen o avatar del personaje
}

// Interface que representa la estructura de la respuesta al solicitar el detalle de un personaje
export interface RespuestaDetalle {
  data: Detalle;         // Información detallada del personaje
  suport: InfGeneral;    // Información adicional o de soporte (como créditos o fuente)
}

// Interface con información general o adicional que acompaña a los datos principales
export interface InfGeneral {
  url: string;           // Enlace a la fuente o referencia
  text: string;          // Texto descriptivo o informativo
}

// Interface que define los detalles de un personaje individual
// Los campos son opcionales ya que pueden no estar presentes en todas las respuestas
export interface Detalle {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
}

// Interface usada para representar personajes almacenados en Firebase
// Incluye atributos personalizados relacionados con un videojuego o aplicación
export interface personajesFirebase {
  apellido: string;      // Apellido del personaje
  armas: string;         // Armas o equipo que posee
  dano: string;          // Nivel de daño que puede causar
  descripcion: string;   // Descripción general del personaje
  id: string;            // Identificador único en Firebase
  imagen: string;        // Ruta o URL de la imagen del personaje
  nombre: string;        // Nombre del personaje
  salud: string;         // Nivel de salud o resistencia
  velocidad: string;     // Velocidad o agilidad del personaje
}
