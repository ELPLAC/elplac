export enum ProductStatus {
    ACCEPTED = 'accepted',
    ACCEPTEDPLAY = 'acceptedPlay',
    NOTACCEPTED = 'notAccepted',
    NOTAVAILABLE = 'notAvailable',
    CATEGORYNOTAPPLY = 'categoryNotApply',
    SECONDMARK = 'secondMark',
    PENDINGVERICATION = 'pendingVerification',
    SOLD = 'sold',
    SOLD_POST_FAIR = 'sold_post_fair',
    SOLDONCLEARANCE = 'soldOnClearance',
    UNSOLD = 'unsold',
  }
  
export const ProductStatusDescription = {
    [ProductStatus.ACCEPTED]: 'Aceptado',
    [ProductStatus.NOTACCEPTED]: 'No aceptado',
    [ProductStatus.NOTAVAILABLE]: 'No entregado',
    [ProductStatus.CATEGORYNOTAPPLY]: 'No corresponde',
    [ProductStatus.SECONDMARK]: 'Segunda marca',
    [ProductStatus.PENDINGVERICATION]: 'Pendiente de verificación',
    [ProductStatus.SOLD]: 'Vendido',
    [ProductStatus.SOLD_POST_FAIR]: 'Vendido Post-feria',
    [ProductStatus.SOLDONCLEARANCE]: 'Vendido en descuento',
    [ProductStatus.UNSOLD]: 'No vendido',
    [ProductStatus.ACCEPTEDPLAY]: 'Aceptado PLAY',
  };