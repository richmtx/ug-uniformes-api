interface EnviarCorreoParams {
    apiKey: string;
    asunto: string;
    contenidoHtml: string;
}

// Remitente temporal (ya verificado en Brevo). Esto NO afecta a quién le llega el correo.
const REMITENTE = {
    name: "Sitio UG Uniformes",
    email: "tecnologiasweb@itdurango.edu.mx",
};

// TODO: cambiar este correo por "irispurpura@hotmail.com" cuando todo esté
// probado y listo para producción.
const DESTINATARIO = {
    name: "Pruebas UG",
    email: "irispurpura@hotmail.com",
};

export async function enviarCorreo({ apiKey, asunto, contenidoHtml }: EnviarCorreoParams): Promise<void> {
    const respuesta = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "api-key": apiKey,
        },
        body: JSON.stringify({
            sender: REMITENTE,
            to: [DESTINATARIO],
            subject: asunto,
            htmlContent: contenidoHtml,
        }),
    });

    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(`Error al enviar correo (${respuesta.status}): ${detalle}`);
    }
}