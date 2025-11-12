import { DetalleComponent } from "../componentes/detalle/detalle.component";

export interface RespuestaBD {
page: number;
per_page: number;
total: number;
total_pages: number;
data: Personajes[];
}
export interface Personajes {
id: number;
email: string;
first_name: string;
last_name: string;
avatar: string;
}

export interface RespuestaDetalle {
    data: Detalle;
    suport: InfGeneral;

}

export interface InfGeneral{
    url: string;
    text: string;
}

export interface Detalle{ 
    id?: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
}


export interface personajesFirebase{

apellido:string;
armas:number;
dano:number;
descripcion:string;
id:string;
imagen:string;
nombre:string;
salud:number;
velocidad:number;

}