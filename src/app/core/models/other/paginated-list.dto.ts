
export interface PaginatedListDTO<T> {
    /**Lista del generic obtenido */
    results: T[];
    /**Total de filas encontradas del generic */
    totalRecords: number;
}