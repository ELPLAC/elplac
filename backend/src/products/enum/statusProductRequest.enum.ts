export enum StatusProductRequest {
        PENDING = 'pending',
        CHECKED = 'checked',
    }
    
export const StatusProductRequestDescription = {
        [StatusProductRequest.PENDING]: 'Pendiente',
        [StatusProductRequest.CHECKED]: 'Verificado',
    };