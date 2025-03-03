import { ProductPrinter } from "./Product.type";

export const printContent = (products: ProductPrinter[]) => {
  return `
                <html>
    <head>
        <title>Print Label</title>
        <style>
            @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
            hr { border: 0; border-top: 1px solid #ccc; }

            .product-list { 
                                display: flex; 
                                flex-wrap: wrap; 
                                justify-content: center; 
                                gap: 10px;
                            }
                           .product-item { 
                                width: calc(33.33% - 10px); 
                                max-width: 210mm;
                                height: 60mm;
                                margin-bottom: 10px; 
                                page-break-inside: avoid; 
                                padding: 8px; 
                                border-radius: 8px; 
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
                                background-color: #ffffff; 
                                display: flex; 
                                flex-direction: column;
                                gap: 4px; 
                                overflow: visible; 
                                border: 1px dashed #ccc;
                                align-items: flex-start;
                            }
                            .product-itemp { 
                                margin: 0; 
                                font-size: 12px; 
                                line-height: 1.4; 
                                margin-bottom: 4px;
                                margin-left: 15px;
                            }
                            .product-item strong { font-weight: 600; }
                            .product-item hr { margin: 4px 0; }
                            .description {
                                display: block;
                                white-space: normal;
                                word-wrap: break-word; 
                                word-break: break-word; 
                                max-height: unset; 
                                overflow: visible; 
                            }
                                .price, .sku, .pin-icon {
                align-self: center; /* Centra estos elementos */
                text-align: center;
            }
                            .price {
                                font-weight: bold;
                                font-size: 20px;
                                text-align: center;
                                align-items: center;
                            }
                            .sku {
                                font-size: 20px;
                                text-align: center;
                                align-items: center;
                            }
                            .dotted-line {
                                border-top: 1px dotted #888;
                                width: 80%;
                                margin: 5px auto;
                            }
                            .pin-icon {
                                display: block;
                                width: 70%;
                                height: 15px;
                                margin-bottom: 2px;
                            }
        </style>
    </head>
    <body class="font-sans">
        <div class="product-list">
            ${products
                .map(
                    (product) => `
                    <div key=${product.id} class="product-item">
                        <p class="product-itemp sku">${product.code}</p>
                        <img src="/img/pin-icon.png" class="pin-icon" alt="Alfiler de gancho">
                        <p class="text-lg product-itemp">${product.size}</p>
                        <p class="text-lg product-itemp">${product.brand}</p>
                        <p class="text-sm description product-itemp">${product.description.length > 50 ? product.description.slice(0, 50) + "..." : product.description}</p>
                        <p class="text-lg product-itemp"><strong>Liquidación:</strong> ${product.liquidation ? "SI" : "NO"}</p>
                        <p class="product-itemp price">$${product.price.toLocaleString("es-AR")}</p>
                    </div>`
                )
                .join("")}
        </div>
        <script>
            window.print();
        </script>
    </body>
</html>


            `;
};
