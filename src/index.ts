import { enviarCorreo } from "./email";
import type { Env, ContactoFormData, CotizarFormData } from "./types";

const ORIGENES_PERMITIDOS = ["http://localhost:4200", "https://sitio-ug.pages.dev"];

function headersCors(origin: string | null): HeadersInit {
	const origenPermitido = origin && ORIGENES_PERMITIDOS.includes(origin) ? origin : ORIGENES_PERMITIDOS[0];
	return {
		"Access-Control-Allow-Origin": origenPermitido,
		"Access-Control-Allow-Methods": "POST, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	};
}

function respuestaJson(data: unknown, status: number, origin: string | null): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
			...headersCors(origin),
		},
	});
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const origin = request.headers.get("Origin");

		if (request.method === "OPTIONS") {
			return new Response(null, { headers: headersCors(origin) });
		}

		if (request.method !== "POST") {
			return respuestaJson({ error: "Método no permitido" }, 405, origin);
		}

		try {
			if (url.pathname === "/contacto") {
				const datos = (await request.json()) as ContactoFormData;

				if (!datos.nombre || !datos.correo || !datos.descripcion) {
					return respuestaJson({ error: "Faltan datos obligatorios" }, 400, origin);
				}

				await enviarCorreo({
					apiKey: env.BREVO_API_KEY,
					asunto: `Nuevo mensaje de contacto - ${datos.nombre}`,
					contenidoHtml: `
            <h2>Nuevo mensaje de contacto</h2>
            <p><strong>Nombre:</strong> ${datos.nombre}</p>
            <p><strong>Empresa:</strong> ${datos.empresa ?? "No especificado"}</p>
            <p><strong>Teléfono:</strong> ${datos.telefono ?? "No especificado"}</p>
            <p><strong>Correo:</strong> ${datos.correo}</p>
            <p><strong>Tipo de servicio:</strong> ${datos.tipoServicio ?? "No especificado"}</p>
            <p><strong>Descripción:</strong> ${datos.descripcion}</p>
          `,
				});

				return respuestaJson({ ok: true }, 200, origin);
			}

			if (url.pathname === "/cotizar") {
				const datos = (await request.json()) as CotizarFormData;

				if (!datos.nombre || !datos.correo) {
					return respuestaJson({ error: "Faltan datos obligatorios" }, 400, origin);
				}

				await enviarCorreo({
					apiKey: env.BREVO_API_KEY,
					asunto: `Nueva solicitud de cotización - ${datos.nombre}`,
					contenidoHtml: `
            <h2>Nueva solicitud de cotización</h2>
            <p><strong>Nombre:</strong> ${datos.nombre}</p>
            <p><strong>Empresa:</strong> ${datos.empresa ?? "No especificado"}</p>
            <p><strong>Teléfono:</strong> ${datos.telefono ?? "No especificado"}</p>
            <p><strong>Correo:</strong> ${datos.correo}</p>
            <p><strong>Tipo de uniforme:</strong> ${datos.tipoUniforme ?? "No especificado"}</p>
            <p><strong>Servicios:</strong> ${datos.servicios ?? "No especificado"}</p>
            <p><strong>Cantidad:</strong> ${datos.cantidad ?? "No especificado"}</p>
            <p><strong>Detalles:</strong> ${datos.detalles ?? "No especificado"}</p>
          `,
				});

				return respuestaJson({ ok: true }, 200, origin);
			}

			return respuestaJson({ error: "Ruta no encontrada" }, 404, origin);
		} catch (error) {
			console.error(error);
			return respuestaJson({ error: "Error interno al procesar la solicitud" }, 500, origin);
		}
	},
};