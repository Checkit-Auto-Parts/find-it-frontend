export interface Message {
    /** Mensaje simplificado para el usuario */
    description: string;
    /** Mensaje detallado para el desarrollador, esto generalmente saldra de la excepciónn del catch */
    detailDev?: string;
    /** Mensaje de accion a ejecutar sugerida para el usuario. Ejm: Comuniquese con soporte técnico al número xxx-xxx-xxx */
    action?: string;
}