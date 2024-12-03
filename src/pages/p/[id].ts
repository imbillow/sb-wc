import type { APIRoute } from "astro";
import { sbc, type SBCBody } from "../../fun";

export const GET: APIRoute = async ({ params, request, locals, site }) => {
    const id = params.id;
    const sb = locals.runtime.env.sb;

    try {
        const text: SBCBody = await sb.get(id);
        return await sbc(text);
    } catch (e) {
        return new Response('', { status: 404 });
    }
}
